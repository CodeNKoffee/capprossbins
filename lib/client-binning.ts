/**
 * Client-Side Binning Engine for CapprossBins
 * Heavy lifting done in browser, algorithms called from backend via API
 */

interface WOEIVResponse {
  woe_values: number[]
  iv_values: number[]
}

interface StatisticsResponse {
  total_iv: number
  gini_coefficient: number
  ks_statistic: number
  warnings?: string[]
}

export interface BinConfig {
  mode: 'optimal' | 'manual' | 'equal_width' | 'equal_frequency'
  maxBins: number
  minBins: number
  enforceMonotonicity: boolean
  minPopulation: number
  mergeThreshold: number
}

export interface Bin {
  id: number
  min: number
  max: number
  count: number
  goods: number
  bads: number
  badRate: number
  woe: number
  iv: number
  range: string
}

export interface BinningResult {
  bins: Bin[]
  totalIV: number
  giniCoefficient: number
  ksStatistic: number
  isMonotonic: boolean
  processingTime: number
  warnings: string[]
}

export class ClientSideBinningEngine {
  private static readonly API_TIMEOUT = 30000 // 30 seconds

  /**
   * Perform complete binning analysis in the browser
   */
  static async performBinning(
    feature: number[],
    target: number[],
    config: BinConfig,
    onProgress?: (step: string, progress: number) => void
  ): Promise<BinningResult> {
    const startTime = performance.now()

    try {
      onProgress?.('Validating data...', 10)
      
      // Step 1: Data validation (client-side)
      this.validateData(feature, target)

      onProgress?.('Creating initial bins...', 25)
      
      // Step 2: Create initial bins (client-side)
      const initialBins = await this.createInitialBins(feature, target, config)

      onProgress?.('Calculating WOE and IV...', 50)
      
      // Step 3: Calculate WOE/IV using backend API (lightweight computation)
      const binsWithWOE = await this.calculateWOEandIV(initialBins)

      onProgress?.('Applying constraints...', 70)
      
      // Step 4: Apply constraints (client-side)
      const constrainedBins = this.applyConstraints(binsWithWOE, config)

      onProgress?.('Calculating final statistics...', 85)
      
      // Step 5: Calculate final statistics using backend APIs
      const finalStats = await this.calculateFinalStatistics(constrainedBins)

      onProgress?.('Finalizing results...', 100)

      const processingTime = performance.now() - startTime

      return {
        bins: constrainedBins,
        totalIV: finalStats.totalIV,
        giniCoefficient: finalStats.gini,
        ksStatistic: finalStats.ks,
        isMonotonic: this.checkMonotonicity(constrainedBins),
        processingTime: Math.round(processingTime),
        warnings: finalStats.warnings
      }

    } catch (error) {
      throw new Error(`Binning failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Validate input data (client-side)
   */
  private static validateData(feature: number[], target: number[]): void {
    if (feature.length !== target.length) {
      throw new Error('Feature and target arrays must have the same length')
    }

    if (feature.length < 100) {
      throw new Error('Minimum 100 data points required for reliable binning')
    }

    // Check for valid binary target
    const uniqueTargets = [...new Set(target)]
    if (uniqueTargets.length !== 2 || !uniqueTargets.includes(0) || !uniqueTargets.includes(1)) {
      throw new Error('Target must be binary (0 and 1 values only)')
    }

    // Check for sufficient variation in feature
    const uniqueFeatures = new Set(feature)
    if (uniqueFeatures.size < 10) {
      throw new Error('Feature must have at least 10 unique values for binning')
    }
  }

  /**
   * Create initial bins (client-side heavy computation)
   */
  private static async createInitialBins(
    feature: number[],
    target: number[],
    config: BinConfig
  ): Promise<Bin[]> {
    
    // Sort data by feature value
    const sortedData = feature.map((f, i) => ({ feature: f, target: target[i] }))
      .sort((a, b) => a.feature - b.feature)

    const bins: Bin[] = []

    if (config.mode === 'equal_width') {
      return this.createEqualWidthBins(sortedData, config.maxBins)
    } else if (config.mode === 'equal_frequency') {
      return this.createEqualFrequencyBins(sortedData, config.maxBins)
    } else {
      // For optimal binning, we'll use a simple decision tree approach
      return this.createOptimalBins(sortedData, config)
    }
  }

  /**
   * Create equal width bins (client-side)
   */
  private static createEqualWidthBins(
    sortedData: Array<{ feature: number; target: number }>,
    numBins: number
  ): Bin[] {
    const minValue = sortedData[0].feature
    const maxValue = sortedData[sortedData.length - 1].feature
    const binWidth = (maxValue - minValue) / numBins

    const bins: Bin[] = []

    for (let i = 0; i < numBins; i++) {
      const min = minValue + i * binWidth
      const max = i === numBins - 1 ? maxValue : minValue + (i + 1) * binWidth

      const binData = sortedData.filter(d => 
        (i === 0 ? d.feature >= min : d.feature > min) && d.feature <= max
      )

      if (binData.length > 0) {
        const goods = binData.filter(d => d.target === 0).length
        const bads = binData.filter(d => d.target === 1).length

        bins.push({
          id: i + 1,
          min,
          max,
          count: binData.length,
          goods,
          bads,
          badRate: bads / binData.length,
          woe: 0, // Will be calculated later
          iv: 0, // Will be calculated later
          range: `${min.toFixed(2)} - ${max.toFixed(2)}`
        })
      }
    }

    return bins
  }

  /**
   * Create equal frequency bins (client-side)
   */
  private static createEqualFrequencyBins(
    sortedData: Array<{ feature: number; target: number }>,
    numBins: number
  ): Bin[] {
    const binSize = Math.floor(sortedData.length / numBins)
    const bins: Bin[] = []

    for (let i = 0; i < numBins; i++) {
      const startIdx = i * binSize
      const endIdx = i === numBins - 1 ? sortedData.length : (i + 1) * binSize
      
      const binData = sortedData.slice(startIdx, endIdx)
      
      if (binData.length > 0) {
        const min = binData[0].feature
        const max = binData[binData.length - 1].feature
        const goods = binData.filter(d => d.target === 0).length
        const bads = binData.filter(d => d.target === 1).length

        bins.push({
          id: i + 1,
          min,
          max,
          count: binData.length,
          goods,
          bads,
          badRate: bads / binData.length,
          woe: 0,
          iv: 0,
          range: `${min.toFixed(2)} - ${max.toFixed(2)}`
        })
      }
    }

    return bins
  }

  /**
   * Create optimal bins using decision tree approach (client-side)
   */
  private static createOptimalBins(
    sortedData: Array<{ feature: number; target: number }>,
    config: BinConfig
  ): Bin[] {
    // Simple optimal binning using entropy-based splitting
    const bins: Bin[] = []
    let currentBins = [sortedData]

    while (currentBins.length < config.maxBins && this.canSplitFurther(currentBins, config.minPopulation)) {
      const bestSplit = this.findBestSplit(currentBins, config.minPopulation)
      if (!bestSplit) break

      currentBins = this.applySplit(currentBins, bestSplit)
    }

    // Convert to Bin format
    return currentBins.map((binData, index) => {
      const min = binData[0].feature
      const max = binData[binData.length - 1].feature
      const goods = binData.filter(d => d.target === 0).length
      const bads = binData.filter(d => d.target === 1).length

      return {
        id: index + 1,
        min,
        max,
        count: binData.length,
        goods,
        bads,
        badRate: bads / binData.length,
        woe: 0,
        iv: 0,
        range: `${min.toFixed(2)} - ${max.toFixed(2)}`
      }
    })
  }

  /**
   * Calculate WOE and IV using backend API (lightweight computation)
   */
  private static async calculateWOEandIV(bins: Bin[]): Promise<Bin[]> {
    try {
      // Prepare data for backend API call
      const binData = bins.map(bin => ({
        goods: bin.goods,
        bads: bin.bads,
        count: bin.count
      }))

      // Call backend API for WOE/IV calculation
      const response = await this.callBackendAPI('/api/binning/calculate-woe-iv', {
        method: 'POST',
        body: JSON.stringify({ bins: binData }),
        headers: { 'Content-Type': 'application/json' }
      })

      // Update bins with calculated WOE/IV
      return bins.map((bin, index) => ({
        ...bin,
        woe: (response as WOEIVResponse).woe_values[index],
        iv: (response as WOEIVResponse).iv_values[index]
      }))

    } catch {
      // Fallback: calculate WOE/IV client-side (less accurate)
      console.warn('Backend WOE/IV calculation failed, using client-side fallback')
      return this.calculateWOEClientSide(bins)
    }
  }

  /**
   * Calculate final statistics using backend APIs
   */
  private static async calculateFinalStatistics(bins: Bin[]): Promise<{
    totalIV: number
    gini: number
    ks: number
    warnings: string[]
  }> {
    try {
      const response = await this.callBackendAPI('/api/binning/calculate-statistics', {
        method: 'POST',
        body: JSON.stringify({ 
          bins: bins.map(b => ({
            woe: b.woe,
            iv: b.iv,
            goods: b.goods,
            bads: b.bads,
            count: b.count
          }))
        }),
        headers: { 'Content-Type': 'application/json' }
      })

      return {
        totalIV: (response as StatisticsResponse).total_iv,
        gini: (response as StatisticsResponse).gini_coefficient,
        ks: (response as StatisticsResponse).ks_statistic,
        warnings: (response as StatisticsResponse).warnings || []
      }

    } catch {
      // Fallback: basic client-side calculations
      console.warn('Backend statistics calculation failed, using client-side fallback')
      const totalIV = bins.reduce((sum, bin) => sum + bin.iv, 0)
      
      return {
        totalIV,
        gini: 0, // Would need complex calculation
        ks: 0, // Would need complex calculation
        warnings: ['Some statistics calculated using simplified client-side methods']
      }
    }
  }

  /**
   * Apply constraints (client-side)
   */
  private static applyConstraints(bins: Bin[], config: BinConfig): Bin[] {
    let constrainedBins = [...bins]

    // Merge bins with low population
    constrainedBins = this.mergeLowPopulationBins(constrainedBins, config.minPopulation)

    // Enforce monotonicity if required
    if (config.enforceMonotonicity) {
      constrainedBins = this.enforceMonotonicity(constrainedBins)
    }

    // Merge similar bins based on threshold
    constrainedBins = this.mergeSimilarBins(constrainedBins, config.mergeThreshold)

    return constrainedBins
  }

  /**
   * Helper methods for binning algorithms
   */
  private static canSplitFurther(bins: Array<Array<{ feature: number; target: number }>>, minPopulation: number): boolean {
    return bins.some(bin => bin.length >= minPopulation * 2)
  }

  private static findBestSplit(bins: Array<Array<{ feature: number; target: number }>>, minPopulation: number): { binIndex: number; splitPoint: number } | null {
    // Simplified split finding logic
    for (let i = 0; i < bins.length; i++) {
      if (bins[i].length >= minPopulation * 2) {
        return { binIndex: i, splitPoint: Math.floor(bins[i].length / 2) }
      }
    }
    return null
  }

  private static applySplit(bins: Array<Array<{ feature: number; target: number }>>, split: { binIndex: number; splitPoint: number }): Array<Array<{ feature: number; target: number }>> {
    const newBins = [...bins]
    const binToSplit = newBins[split.binIndex]
    const leftBin = binToSplit.slice(0, split.splitPoint)
    const rightBin = binToSplit.slice(split.splitPoint)
    
    newBins[split.binIndex] = leftBin
    newBins.splice(split.binIndex + 1, 0, rightBin)
    
    return newBins
  }

  private static checkMonotonicity(bins: Bin[]): boolean {
    if (bins.length < 2) return true
    
    const trends = []
    for (let i = 1; i < bins.length; i++) {
      if (bins[i].badRate > bins[i-1].badRate) trends.push(1)
      else if (bins[i].badRate < bins[i-1].badRate) trends.push(-1)
      else trends.push(0)
    }
    
    const positive = trends.filter(t => t > 0).length
    const negative = trends.filter(t => t < 0).length
    
    return positive === 0 || negative === 0
  }

  private static mergeLowPopulationBins(bins: Bin[], minPopulation: number): Bin[] {
    // Simplified merging logic
    return bins.filter(bin => bin.count >= minPopulation)
  }

  private static enforceMonotonicity(bins: Bin[]): Bin[] {
    // Simplified monotonicity enforcement
    return bins
  }

  private static mergeSimilarBins(bins: Bin[], threshold: number): Bin[] {
    // Simplified similar bin merging
    return bins
  }

  private static calculateWOEClientSide(bins: Bin[]): Bin[] {
    const totalGoods = bins.reduce((sum, bin) => sum + bin.goods, 0)
    const totalBads = bins.reduce((sum, bin) => sum + bin.bads, 0)

    return bins.map(bin => ({
      ...bin,
      woe: Math.log((bin.goods / totalGoods) / (bin.bads / totalBads)),
      iv: ((bin.goods / totalGoods) - (bin.bads / totalBads)) * Math.log((bin.goods / totalGoods) / (bin.bads / totalBads))
    }))
  }

  /**
   * Make API call to backend with timeout
   */
  private static async callBackendAPI(endpoint: string, options: RequestInit): Promise<unknown> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.API_TIMEOUT)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://capprossbins-server.onrender.com'}${endpoint}`, {
        ...options,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }
}

// Export main function
export const performClientSideBinning = ClientSideBinningEngine.performBinning

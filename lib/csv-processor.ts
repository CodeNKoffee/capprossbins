/**
 * Client-Side CSV Processing for CapprossBins
 * Handles large files in the browser without server upload
 */

export interface CSVColumn {
  name: string
  type: 'numeric' | 'categorical' | 'text'
  uniqueValues: number
  nullCount: number
  sampleValues: (string | number)[]
}

export interface CSVAnalysis {
  fileName: string
  fileSize: number
  rowCount: number
  columnCount: number
  columns: CSVColumn[]
  preview: Record<string, unknown>[]
  processingTime: number
  memoryUsage?: number
}

export interface ProcessedDataChunk {
  feature: number[]
  target: number[]
  chunkIndex: number
  totalChunks: number
}

export class ClientSideCSVProcessor {
  private static readonly CHUNK_SIZE = 10000 // Process 10k rows at a time
  private static readonly PREVIEW_ROWS = 100

  /**
   * Analyze CSV file structure without uploading to server
   */
  static async analyzeFile(file: File): Promise<CSVAnalysis> {
    const startTime = performance.now()
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (event) => {
        try {
          const csvText = event.target?.result as string
          const lines = csvText.split('\n').filter(line => line.trim())
          
          if (lines.length < 2) {
            throw new Error('CSV must have at least a header and one data row')
          }

          // Parse header
          const headers = this.parseCSVRow(lines[0])
          
          // Analyze sample data (first 1000 rows for performance)
          const sampleSize = Math.min(1000, lines.length - 1)
          const sampleData: Record<string, unknown>[] = []
          const columnStats: Record<string, {
            values: (string | number)[]
            nullCount: number
            numericCount: number
          }> = {}

          // Initialize column stats
          headers.forEach(header => {
            columnStats[header] = { values: [], nullCount: 0, numericCount: 0 }
          })

          // Process sample rows
          for (let i = 1; i <= sampleSize; i++) {
            const row = this.parseCSVRow(lines[i])
            const rowObj: Record<string, unknown> = {}

            headers.forEach((header, index) => {
              const value = row[index]?.trim()
              
              if (!value || value === '') {
                columnStats[header].nullCount++
                rowObj[header] = null
              } else {
                const numValue = Number(value)
                if (!isNaN(numValue) && isFinite(numValue)) {
                  columnStats[header].numericCount++
                  columnStats[header].values.push(numValue)
                  rowObj[header] = numValue
                } else {
                  columnStats[header].values.push(value)
                  rowObj[header] = value
                }
              }
            })

            if (sampleData.length < this.PREVIEW_ROWS) {
              sampleData.push(rowObj)
            }
          }

          // Generate column analysis
          const columns: CSVColumn[] = headers.map(header => {
            const stats = columnStats[header]
            const totalValues = stats.values.length
            const numericRatio = stats.numericCount / Math.max(totalValues, 1)
            
            return {
              name: header,
              type: numericRatio > 0.8 ? 'numeric' : 'categorical',
              uniqueValues: new Set(stats.values).size,
              nullCount: stats.nullCount,
              sampleValues: stats.values.slice(0, 10)
            }
          })

          const processingTime = performance.now() - startTime

          const analysis: CSVAnalysis = {
            fileName: file.name,
            fileSize: file.size,
            rowCount: lines.length - 1, // Exclude header
            columnCount: headers.length,
            columns,
            preview: sampleData,
            processingTime: Math.round(processingTime),
            memoryUsage: this.estimateMemoryUsage(file.size)
          }

          resolve(analysis)
        } catch (error) {
          reject(new Error(`CSV analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`))
        }
      }

      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }

      reader.readAsText(file)
    })
  }

  /**
   * Process CSV data in chunks for binning analysis
   */
  static async processDataForBinning(
    file: File,
    featureColumn: string,
    targetColumn: string,
    onProgress?: (progress: number) => void
  ): Promise<{ feature: number[], target: number[] }> {
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = async (event) => {
        try {
          const csvText = event.target?.result as string
          const lines = csvText.split('\n').filter(line => line.trim())
          const headers = this.parseCSVRow(lines[0])
          
          const featureIndex = headers.indexOf(featureColumn)
          const targetIndex = headers.indexOf(targetColumn)

          if (featureIndex === -1) {
            throw new Error(`Feature column '${featureColumn}' not found`)
          }
          if (targetIndex === -1) {
            throw new Error(`Target column '${targetColumn}' not found`)
          }

          const feature: number[] = []
          const target: number[] = []
          const totalRows = lines.length - 1

          // Process in chunks to avoid blocking the UI
          for (let i = 1; i < lines.length; i += this.CHUNK_SIZE) {
            const chunkEnd = Math.min(i + this.CHUNK_SIZE, lines.length)
            
            // Process chunk
            for (let j = i; j < chunkEnd; j++) {
              const row = this.parseCSVRow(lines[j])
              
              const featureValue = Number(row[featureIndex])
              const targetValue = Number(row[targetIndex])

              // Skip rows with invalid data
              if (!isNaN(featureValue) && !isNaN(targetValue) && 
                  isFinite(featureValue) && isFinite(targetValue)) {
                feature.push(featureValue)
                target.push(targetValue)
              }
            }

            // Update progress and yield control
            const progress = (chunkEnd - 1) / totalRows * 100
            onProgress?.(progress)
            
            // Yield control to prevent UI blocking
            await new Promise(resolve => setTimeout(resolve, 1))
          }

          if (feature.length === 0) {
            throw new Error('No valid numeric data found in the specified columns')
          }

          resolve({ feature, target })
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }

      reader.readAsText(file)
    })
  }

  /**
   * Parse a single CSV row handling quotes and commas
   */
  private static parseCSVRow(row: string): string[] {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i]
      const nextChar = row[i + 1]
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"'
          i++ // Skip next quote
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    
    result.push(current.trim())
    return result
  }

  /**
   * Estimate memory usage for processing
   */
  private static estimateMemoryUsage(fileSize: number): number {
    // Rough estimate: CSV text + parsed arrays ≈ 3x file size
    return Math.round(fileSize * 3)
  }

  /**
   * Check if browser can handle the file size
   */
  static canProcessFile(fileSize: number): { canProcess: boolean; reason?: string } {
    const estimatedMemory = this.estimateMemoryUsage(fileSize)
    const maxRecommendedSize = 100 * 1024 * 1024 // 100MB

    if (fileSize > maxRecommendedSize) {
      return {
        canProcess: false,
        reason: `File size (${Math.round(fileSize / 1024 / 1024)}MB) exceeds recommended limit (${Math.round(maxRecommendedSize / 1024 / 1024)}MB)`
      }
    }

    // Check available memory (rough estimate)
    if ('memory' in performance) {
      const memory = (performance as typeof performance & { memory?: { jsHeapSizeLimit: number } }).memory
      if (memory && estimatedMemory > memory.jsHeapSizeLimit * 0.5) {
        return {
          canProcess: false,
          reason: 'Insufficient browser memory for processing this file'
        }
      }
    }

    return { canProcess: true }
  }
}

// Export utility functions
export const analyzeCSV = ClientSideCSVProcessor.analyzeFile
export const processCSVForBinning = ClientSideCSVProcessor.processDataForBinning
export const checkFileProcessability = ClientSideCSVProcessor.canProcessFile

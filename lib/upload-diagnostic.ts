/**
 * Upload Performance Diagnostic Utility for CapprossBins
 * Use this to debug slow upload issues
 */

import { CapprossBinsAPI } from './api'

export interface UploadDiagnosticResult {
  fileSize: number
  fileSizeMB: string
  uploadStartTime: number
  uploadEndTime?: number
  uploadDuration?: number
  uploadSpeedMBps?: number
  networkType?: string
  effectiveType?: string
  error?: string
  success: boolean
}

interface NetworkConnection {
  effectiveType?: string
  type?: string
  downlink?: number
  rtt?: number
  saveData?: boolean
}

export class UploadDiagnosticUtils {
  static async testUploadPerformance(file: File): Promise<UploadDiagnosticResult> {
    const diagnostic: UploadDiagnosticResult = {
      fileSize: file.size,
      fileSizeMB: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      uploadStartTime: Date.now(),
      success: false
    }

    // Get network information if available
    if ('connection' in navigator) {
      const connection = (navigator as typeof navigator & { connection: NetworkConnection }).connection
      diagnostic.networkType = connection?.type || 'unknown'
      diagnostic.effectiveType = connection?.effectiveType || 'unknown'
    }

    console.log('📊 Starting upload performance test...', {
      fileName: file.name,
      fileSize: diagnostic.fileSizeMB,
      networkType: diagnostic.networkType,
      effectiveType: diagnostic.effectiveType
    })

    try {
      // Test upload with progress tracking
      await CapprossBinsAPI.uploadDataWithProgress(file, (progress) => {
        if (progress % 10 === 0) { // Log every 10%
          const elapsed = (Date.now() - diagnostic.uploadStartTime) / 1000
          const estimatedTotal = elapsed / (progress / 100)
          console.log(`📤 Upload progress: ${progress}% (${elapsed.toFixed(1)}s elapsed, ~${estimatedTotal.toFixed(1)}s total)`)
        }
      })

      diagnostic.uploadEndTime = Date.now()
      diagnostic.uploadDuration = diagnostic.uploadEndTime - diagnostic.uploadStartTime
      diagnostic.uploadSpeedMBps = (file.size / (1024 * 1024)) / (diagnostic.uploadDuration / 1000)
      diagnostic.success = true

      console.log('✅ Upload performance test completed:', {
        duration: `${(diagnostic.uploadDuration / 1000).toFixed(2)}s`,
        speed: `${diagnostic.uploadSpeedMBps.toFixed(2)} MB/s`,
        fileSize: diagnostic.fileSizeMB
      })

    } catch (error) {
      diagnostic.uploadEndTime = Date.now()
      diagnostic.uploadDuration = diagnostic.uploadEndTime - diagnostic.uploadStartTime
      diagnostic.error = error instanceof Error ? error.message : 'Unknown error'

      console.error('❌ Upload performance test failed:', {
        error: diagnostic.error,
        duration: `${(diagnostic.uploadDuration / 1000).toFixed(2)}s`,
        fileSize: diagnostic.fileSizeMB
      })
    }

    return diagnostic
  }

  static async diagnoseConnection(): Promise<{
    backendReachable: boolean
    responseTime: number
    error?: string
  }> {
    const startTime = Date.now()
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const endTime = Date.now()
      const responseTime = endTime - startTime

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Backend connection healthy:', {
          responseTime: `${responseTime}ms`,
          status: data.status,
          version: data.version
        })
        
        return {
          backendReachable: true,
          responseTime
        }
      } else {
        return {
          backendReachable: false,
          responseTime,
          error: `HTTP ${response.status}: ${response.statusText}`
        }
      }
    } catch (error) {
      const endTime = Date.now()
      const responseTime = endTime - startTime
      
      return {
        backendReachable: false,
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  static async runFullDiagnostic(file?: File): Promise<void> {
    console.group('🔍 CapprossBins Upload Diagnostic')
    
    // 1. Test backend connection
    console.log('1️⃣ Testing backend connection...')
    const connectionTest = await this.diagnoseConnection()
    
    if (!connectionTest.backendReachable) {
      console.error('❌ Backend is not reachable. Upload will fail.')
      console.error('Connection error:', connectionTest.error)
      console.groupEnd()
      return
    }
    
    console.log(`✅ Backend reachable (${connectionTest.responseTime}ms)`)
    
    // 2. Check network conditions
    console.log('2️⃣ Checking network conditions...')
    if ('connection' in navigator) {
      const connection = (navigator as typeof navigator & { connection: NetworkConnection }).connection
      console.log('Network info:', {
        effectiveType: connection?.effectiveType,
        downlink: connection?.downlink,
        rtt: connection?.rtt,
        saveData: connection?.saveData
      })
      
      if (connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g') {
        console.warn('⚠️ Slow network detected. Uploads may be very slow.')
      }
      
      if (connection?.saveData) {
        console.warn('⚠️ Data saver mode is enabled. This may affect upload performance.')
      }
    } else {
      console.log('ℹ️ Network information not available')
    }
    
    // 3. Test file upload if file provided
    if (file) {
      console.log('3️⃣ Testing file upload performance...')
      
      if (file.size > 50 * 1024 * 1024) { // 50MB
        console.warn(`⚠️ Large file detected: ${(file.size / (1024 * 1024)).toFixed(2)} MB`)
        console.warn('This may take a while to upload. Consider reducing file size.')
      }
      
      await this.testUploadPerformance(file)
    } else {
      console.log('3️⃣ Skipping upload test (no file provided)')
    }
    
    // 4. Recommendations
    console.log('4️⃣ Recommendations:')
    if (connectionTest.responseTime > 2000) {
      console.warn('- Backend response is slow. Check server status.')
    }
    if (file && file.size > 10 * 1024 * 1024) {
      console.warn('- Consider compressing large CSV files before upload.')
      console.warn('- Remove unnecessary columns to reduce file size.')
    }
    console.log('- Ensure stable internet connection during upload.')
    console.log('- Avoid switching tabs during large uploads.')
    
    console.groupEnd()
  }
}

// Export for global use
if (typeof window !== 'undefined') {
  (window as typeof window & { CapprossBinsUploadDiagnostic?: typeof UploadDiagnosticUtils }).CapprossBinsUploadDiagnostic = UploadDiagnosticUtils
}

export default UploadDiagnosticUtils

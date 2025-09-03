'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Upload, File, AlertCircle, CheckCircle, X } from 'lucide-react'
import { CapprossBinsAPI } from '../../../lib/api'

interface DataInfo {
  filename: string
  rows: number
  columns: string[]
  preview: Record<string, unknown>[]
  upload_id: string
}

interface DataUploaderProps {
  onUpload: (data: DataInfo) => void
}

export default function DataUploader({ onUpload }: DataUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const processFile = useCallback(async (file: File) => {
    setError(null)
    setIsProcessing(true)
    setUploadedFile(file)

    try {
      // Use the real backend API to upload the file
      const uploadResult = await CapprossBinsAPI.uploadData(file)
      
      const dataInfo: DataInfo = {
        filename: uploadResult.filename,
        rows: uploadResult.rows,
        columns: uploadResult.columns,
        preview: uploadResult.preview,
        upload_id: uploadResult.upload_id
      }

      onUpload(dataInfo)
      
    } catch (err) {
      console.error('File upload error:', err)
      setError(err instanceof Error ? err.message : 'Failed to process file')
      setUploadedFile(null)
    } finally {
      setIsProcessing(false)
    }
  }, [onUpload])

  const handleFileSelect = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please select a CSV file')
      return
    }
    
    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      setError('File size must be less than 50MB')
      return
    }
    
    processFile(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (!file.name.toLowerCase().endsWith('.csv')) {
        setError('Please select a CSV file')
        return
      }
      
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        setError('File size must be less than 50MB')
        return
      }
      
      processFile(file)
    }
  }, [processFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Credit Data</h2>
        <p className="text-gray-600">
          Upload a CSV file containing credit scoring features and target variable
        </p>
      </div>

      {/* Upload Area */}
      <motion.div
        className={`border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
          isDragOver
            ? 'border-emerald-400 bg-emerald-50'
            : error
            ? 'border-red-300 bg-red-50'
            : uploadedFile
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 bg-gray-50 hover:border-emerald-300 hover:bg-emerald-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        whileHover={{ scale: 1.01 }}
      >
        <div className="text-center">
          {isProcessing ? (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="text-gray-600">Processing your file...</p>
            </div>
          ) : uploadedFile ? (
            <div className="space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <div>
                <p className="text-lg font-medium text-green-700">File uploaded successfully!</p>
                <p className="text-sm text-green-600">{uploadedFile.name}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-16 h-16 text-gray-400 mx-auto" />
              <div>
                <p className="text-lg font-medium text-gray-900">Drop your CSV file here</p>
                <p className="text-gray-600">or click to browse</p>
              </div>
              <div className="flex items-center justify-center">
                <label className="cursor-pointer">
                  <span className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors inline-block">
                    Choose File
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv"
                    onChange={handleFileInput}
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg border border-red-200"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Sample Data Format */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
          <File className="w-4 h-4 mr-2" />
          Expected CSV Format
        </h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• First row should contain column headers</p>
          <p>• Must include a target column (good_bad, target, or default)</p>
          <p>• Numeric features for binning analysis</p>
          <p>• Special values: -99999 for missing data</p>
        </div>
        <div className="mt-3 bg-white rounded border p-2 font-mono text-xs">
          <div className="text-gray-600">Sample:</div>
          <div>total_rev_hi_lim,revol_util,annual_inc,good_bad</div>
          <div>20400,46.1,60000,1</div>
          <div>62801,16.8,115000,1</div>
        </div>
      </div>
    </div>
  )
}

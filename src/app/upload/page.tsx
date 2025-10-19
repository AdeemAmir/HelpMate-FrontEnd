'use client'

import { useState, useCallback } from 'react'
import { useAuth, api } from '../providers'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { 
  DocumentPlusIcon, 
  CloudArrowUpIcon, 
  XMarkIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  TagIcon
} from '@heroicons/react/24/outline'

interface UploadFormData {
  reportType: string
  testDate: string
  labName: string
  doctorName: string
  notes: string
}

const reportTypes = [
  { value: 'blood-test', label: 'Blood Test' },
  { value: 'urine-test', label: 'Urine Test' },
  { value: 'x-ray', label: 'X-Ray' },
  { value: 'ct-scan', label: 'CT Scan' },
  { value: 'mri', label: 'MRI' },
  { value: 'ultrasound', label: 'Ultrasound' },
  { value: 'ecg', label: 'ECG' },
  { value: 'prescription', label: 'Prescription' },
  { value: 'discharge-summary', label: 'Discharge Summary' },
  { value: 'consultation', label: 'Consultation' },
  { value: 'other', label: 'Other' },
]

export default function UploadPage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UploadFormData>()

  // Redirect if not authenticated
  if (!authLoading && !user) {
    router.push('/login')
    return null
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-8 h-8"></div>
      </div>
    )
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf'
      if (!isValidType) {
        //toasterror(`${file.name} is not a supported file type. Please upload images or PDFs.`)
        return false
      }
      return true
    })
    
    setUploadedFiles(prev => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'],
      'application/pdf': ['.pdf']
    },
    multiple: true
  })

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: UploadFormData) => {
    if (uploadedFiles.length === 0) {
      //toasterror('Please select at least one file to upload')
      return
    }

    try {
      setUploading(true)
      setUploadProgress(0)

      const formData = new FormData()
      formData.append('reportType', data.reportType)
      formData.append('testDate', data.testDate)
      formData.append('labName', data.labName)
      formData.append('doctorName', data.doctorName)
      formData.append('notes', data.notes)

      // Add files to form data
      uploadedFiles.forEach((file, index) => {
        formData.append('file', file) // Changed from 'files' to 'file'
      })

      const response = await api.upload('/files/upload', formData, token)
      
      setUploadProgress(100)
      //toastsuccess('Files uploaded successfully! AI is processing your reports...')
      
      // Reset form and files
      reset()
      setUploadedFiles([])
      setUploadProgress(0)
      
      // Redirect to reports page
      router.push('/reports')
    } catch (error) {
      console.error('Upload error:', error)
      //toasterror(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Upload Medical Report</h1>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* File Upload Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Files</h2>
            
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary-400 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <p className="text-lg font-medium text-gray-900">
                  {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  or click to select files
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Supports: PDF, PNG, JPG, JPEG, GIF, BMP, WEBP
                </p>
              </div>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Selected Files:</h3>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <DocumentPlusIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Report Details Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Details</h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Report Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TagIcon className="h-4 w-4 inline mr-1" />
                  Report Type
                </label>
                <select
                  {...register('reportType', { required: 'Report type is required' })}
                  className="input-field"
                >
                  <option value="">Select report type</option>
                  {reportTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.reportType && (
                  <p className="mt-1 text-sm text-red-600">{errors.reportType.message}</p>
                )}
              </div>

              {/* Test Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CalendarIcon className="h-4 w-4 inline mr-1" />
                  Test Date
                </label>
                <input
                  type="date"
                  {...register('testDate', { required: 'Test date is required' })}
                  className="input-field"
                />
                {errors.testDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.testDate.message}</p>
                )}
              </div>

              {/* Lab Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <BuildingOfficeIcon className="h-4 w-4 inline mr-1" />
                  Lab/Hospital Name
                </label>
                <input
                  type="text"
                  {...register('labName')}
                  placeholder="e.g., Aga Khan Hospital"
                  className="input-field"
                />
              </div>

              {/* Doctor Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor Name
                </label>
                <input
                  type="text"
                  {...register('doctorName')}
                  placeholder="e.g., Dr. Ahmed Khan"
                  className="input-field"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                placeholder="Any additional information about this report..."
                className="input-field"
              />
            </div>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="spinner w-6 h-6"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Uploading and processing...</p>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={uploading || uploadedFiles.length === 0}
            >
              {uploading ? 'Uploading...' : 'Upload & Process'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

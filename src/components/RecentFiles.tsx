'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { 
  DocumentTextIcon, 
  EyeIcon, 
  SparklesIcon,
  ClockIcon 
} from '@heroicons/react/24/outline'

interface RecentFilesProps {
  files: any[]
  loading: boolean
}

export default function RecentFiles({ files, loading }: RecentFilesProps) {
  const getReportTypeColor = (reportType: string) => {
    const colors: { [key: string]: string } = {
      'blood-test': 'report-blood-test',
      'urine-test': 'report-urine-test',
      'x-ray': 'report-x-ray',
      'ct-scan': 'report-ct-scan',
      'mri': 'report-mri',
      'ultrasound': 'report-ultrasound',
      'ecg': 'report-ecg',
      'prescription': 'report-prescription',
      'discharge-summary': 'report-discharge-summary',
      'consultation': 'report-consultation',
      'other': 'report-other',
    }
    return colors[reportType] || 'report-other'
  }

  const getReportTypeLabel = (reportType: string) => {
    const labels: { [key: string]: string } = {
      'blood-test': 'Blood Test',
      'urine-test': 'Urine Test',
      'x-ray': 'X-Ray',
      'ct-scan': 'CT Scan',
      'mri': 'MRI',
      'ultrasound': 'Ultrasound',
      'ecg': 'ECG',
      'prescription': 'Prescription',
      'discharge-summary': 'Discharge Summary',
      'consultation': 'Consultation',
      'other': 'Other',
    }
    return labels[reportType] || 'Other'
  }

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
        <Link
          href="/reports"
          className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors"
        >
          View all
        </Link>
      </div>
      
      {files.length === 0 ? (
        <div className="text-center py-8">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reports yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Upload your first medical report to get started.
          </p>
          <div className="mt-6">
            <Link
              href="/upload"
              className="btn-primary"
            >
              Upload Report
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {files.map((file) => (
            <div key={file._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all duration-200">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="h-5 w-5 text-primary-600" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {file.originalName}
                  </h4>
                  <span className={`badge ${getReportTypeColor(file.reportType)}`}>
                    {getReportTypeLabel(file.reportType)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>{format(new Date(file.testDate), 'MMM dd, yyyy')}</span>
                  </div>
                  {file.labName && (
                    <span>• {file.labName}</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {file.isProcessed ? (
                  <div className="flex items-center space-x-1 text-success-600">
                    <SparklesIcon className="h-4 w-4" />
                    <span className="text-xs font-medium">AI Ready</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-warning-600">
                    <ClockIcon className="h-4 w-4" />
                    <span className="text-xs font-medium">Processing</span>
                  </div>
                )}
                
                <Link
                  href={`/reports/${file._id}`}
                  className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                >
                  <EyeIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useAuth, api } from '../../providers'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { 
  XMarkIcon,
  CalendarIcon,
  HeartIcon,
  BeakerIcon,
  ScaleIcon
} from '@heroicons/react/24/outline'

interface VitalsFormData {
  date: string
  time: string
  bloodPressure: {
    systolic: number
    diastolic: number
  }
  heartRate: number
  bloodSugar: {
    fasting: number
    postPrandial: number
    random: number
  }
  weight: number
  temperature: number
  notes: string
}

export default function AddVitalsPage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<VitalsFormData>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      bloodPressure: { systolic: 0, diastolic: 0 },
      heartRate: 0,
      bloodSugar: { fasting: 0, postPrandial: 0, random: 0 },
      weight: 0,
      temperature: 0
    }
  })

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

  const onSubmit = async (data: VitalsFormData) => {
    try {
      setSubmitting(true)

      // Prepare vitals data
      const vitalsData = {
        date: data.date,
        bloodPressure: data.bloodPressure.systolic > 0 ? {
          systolic: data.bloodPressure.systolic,
          diastolic: data.bloodPressure.diastolic
        } : undefined,
        heartRate: data.heartRate > 0 ? {
          value: data.heartRate
        } : undefined,
        bloodSugar: {
          fasting: data.bloodSugar.fasting > 0 ? data.bloodSugar.fasting : undefined,
          postPrandial: data.bloodSugar.postPrandial > 0 ? data.bloodSugar.postPrandial : undefined,
          random: data.bloodSugar.random > 0 ? data.bloodSugar.random : undefined
        },
        weight: data.weight > 0 ? {
          value: data.weight
        } : undefined,
        temperature: data.temperature > 0 ? {
          value: data.temperature
        } : undefined,
        notes: data.notes
      }

      await api.post('/vitals', vitalsData, token)
      
      console.log('Vitals recorded successfully!')
      reset()
      router.push('/vitals')
    } catch (error) {
      console.error('Vitals submission error:', error)
      console.error(error instanceof Error ? error.message : 'Failed to record vitals')
    } finally {
      setSubmitting(false)
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
              <h1 className="text-xl font-semibold text-gray-900">Add Health Vitals</h1>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Date and Time */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Date & Time</h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CalendarIcon className="h-4 w-4 inline mr-1" />
                  Date
                </label>
                <input
                  type="date"
                  {...register('date', { required: 'Date is required' })}
                  className="input-field"
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  {...register('time', { required: 'Time is required' })}
                  className="input-field"
                />
                {errors.time && (
                  <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Blood Pressure */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <HeartIcon className="h-5 w-5 mr-2 text-red-500" />
              Blood Pressure
            </h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Systolic (mmHg)
                </label>
                <input
                  type="number"
                  min="0"
                  max="300"
                  {...register('bloodPressure.systolic', { 
                    min: { value: 0, message: 'Must be positive' },
                    max: { value: 300, message: 'Must be realistic' }
                  })}
                  placeholder="e.g., 120"
                  className="input-field"
                />
                {errors.bloodPressure?.systolic && (
                  <p className="mt-1 text-sm text-red-600">{errors.bloodPressure.systolic.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diastolic (mmHg)
                </label>
                <input
                  type="number"
                  min="0"
                  max="200"
                  {...register('bloodPressure.diastolic', { 
                    min: { value: 0, message: 'Must be positive' },
                    max: { value: 200, message: 'Must be realistic' }
                  })}
                  placeholder="e.g., 80"
                  className="input-field"
                />
                {errors.bloodPressure?.diastolic && (
                  <p className="mt-1 text-sm text-red-600">{errors.bloodPressure.diastolic.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Heart Rate */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <HeartIcon className="h-5 w-5 mr-2 text-pink-500" />
              Heart Rate
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heart Rate (BPM)
              </label>
              <input
                type="number"
                min="0"
                max="300"
                {...register('heartRate', { 
                  min: { value: 0, message: 'Must be positive' },
                  max: { value: 300, message: 'Must be realistic' }
                })}
                placeholder="e.g., 72"
                className="input-field"
              />
              {errors.heartRate && (
                <p className="mt-1 text-sm text-red-600">{errors.heartRate.message}</p>
              )}
            </div>
          </div>

          {/* Blood Sugar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BeakerIcon className="h-5 w-5 mr-2 text-blue-500" />
              Blood Sugar
            </h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fasting (mg/dL)
                </label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  {...register('bloodSugar.fasting', { 
                    min: { value: 0, message: 'Must be positive' },
                    max: { value: 500, message: 'Must be realistic' }
                  })}
                  placeholder="e.g., 95"
                  className="input-field"
                />
                {errors.bloodSugar?.fasting && (
                  <p className="mt-1 text-sm text-red-600">{errors.bloodSugar.fasting.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Post-Prandial (mg/dL)
                </label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  {...register('bloodSugar.postPrandial', { 
                    min: { value: 0, message: 'Must be positive' },
                    max: { value: 500, message: 'Must be realistic' }
                  })}
                  placeholder="e.g., 140"
                  className="input-field"
                />
                {errors.bloodSugar?.postPrandial && (
                  <p className="mt-1 text-sm text-red-600">{errors.bloodSugar.postPrandial.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Random (mg/dL)
                </label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  {...register('bloodSugar.random', { 
                    min: { value: 0, message: 'Must be positive' },
                    max: { value: 500, message: 'Must be realistic' }
                  })}
                  placeholder="e.g., 110"
                  className="input-field"
                />
                {errors.bloodSugar?.random && (
                  <p className="mt-1 text-sm text-red-600">{errors.bloodSugar.random.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Weight and Temperature */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Other Measurements</h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <ScaleIcon className="h-4 w-4 mr-1" />
                  Weight (kg)
                </label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  step="0.1"
                  {...register('weight', { 
                    min: { value: 0, message: 'Must be positive' },
                    max: { value: 500, message: 'Must be realistic' }
                  })}
                  placeholder="e.g., 70.5"
                  className="input-field"
                />
                {errors.weight && (
                  <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <BeakerIcon className="h-4 w-4 mr-1" />
                  Temperature (°F)
                </label>
                <input
                  type="number"
                  min="90"
                  max="110"
                  step="0.1"
                  {...register('temperature', { 
                    min: { value: 90, message: 'Must be realistic' },
                    max: { value: 110, message: 'Must be realistic' }
                  })}
                  placeholder="e.g., 98.6"
                  className="input-field"
                />
                {errors.temperature && (
                  <p className="mt-1 text-sm text-red-600">{errors.temperature.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                {...register('notes')}
                rows={4}
                placeholder="Any additional information about your health condition, symptoms, or observations..."
                className="input-field"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Recording...' : 'Record Vitals'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

// Types
interface User {
  _id: string
  name: string
  email: string
  phone?: string
  dateOfBirth?: string
  gender?: string
  bloodGroup?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  preferences: {
    language: 'en' | 'ur'
    notifications: {
      email: boolean
      push: boolean
    }
  }
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => Promise<void>
  loading: boolean
}

interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
  dateOfBirth?: string
  gender?: string
  bloodGroup?: string
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Auth provider component
export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('healthmate_token')
        if (storedToken) {
          setToken(storedToken)
          
          // Verify token and get user data
          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
              'Content-Type': 'application/json',
            },
          })

          if (response.ok) {
            const data = await response.json()
            setUser(data.data.user)
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('healthmate_token')
            setToken(null)
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        localStorage.removeItem('healthmate_token')
        setToken(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      const { user: userData, token: userToken } = data.data
      
      setUser(userData)
      setToken(userToken)
      localStorage.setItem('healthmate_token', userToken)
      
      console.log('Login successful!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      console.error(error instanceof Error ? error.message : 'Login failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Register function
  const register = async (userData: RegisterData) => {
    try {
      setLoading(true)
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      const { user: newUser, token: userToken } = data.data
      
      setUser(newUser)
      setToken(userToken)
      localStorage.setItem('healthmate_token', userToken)
      
      console.log('Registration successful!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Registration error:', error)
      console.error(error instanceof Error ? error.message : 'Registration failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('healthmate_token')
    console.log('Logged out successfully')
    router.push('/')
  }

  // Update user function
  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!token) throw new Error('Not authenticated')

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Update failed')
      }

      setUser(data.data.user)
      console.log('Profile updated successfully')
    } catch (error) {
      console.error('Update user error:', error)
      console.error(error instanceof Error ? error.message : 'Update failed')
      throw error
    }
  }

  const value = {
    user,
    token,
    login,
    register,
    logout,
    updateUser,
    loading,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a Providers')
  }
  return context
}

// API utility functions
export const api = {
  get: async (endpoint: string, token?: string | null) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Request failed')
    }
    
    return response.json()
  },

  post: async (endpoint: string, data: any, token?: string | null) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Request failed')
    }
    
    return response.json()
  },

  put: async (endpoint: string, data: any, token?: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Request failed')
    }
    
    return response.json()
  },

  delete: async (endpoint: string, token?: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Request failed')
    }
    
    return response.json()
  },

  upload: async (endpoint: string, formData: FormData, token?: string | null) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Upload failed')
    }
    
    return response.json()
  },
}

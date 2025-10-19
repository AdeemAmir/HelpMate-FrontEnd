import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HealthMate - Your Personal Health Vault',
  description: 'Store, manage, and understand your medical reports with AI-powered insights in English and Roman Urdu.',
  keywords: ['health', 'medical', 'reports', 'AI', 'healthcare', 'vitals', 'tracking'],
  authors: [{ name: 'HealthMate Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0ea5e9',
  openGraph: {
    title: 'HealthMate - Your Personal Health Vault',
    description: 'Store, manage, and understand your medical reports with AI-powered insights.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HealthMate - Your Personal Health Vault',
    description: 'Store, manage, and understand your medical reports with AI-powered insights.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}

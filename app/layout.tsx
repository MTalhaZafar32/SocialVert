import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SocialVert — Client Dashboard',
  description: 'Your content pipeline, at a glance.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full" style={{ fontFamily: 'var(--font-inter, sans-serif)' }}>
        {children}
      </body>
    </html>
  )
}

import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk'
})

export const metadata: Metadata = {
  title: 'Shreyank Parab | AI/ML & GeoAI Developer',
  description: 'Portfolio of Shreyank Parab - Computer Engineering student passionate about Geospatial AI, environmental modeling, and spatial decision systems.',
  keywords: ['AI/ML', 'GeoAI', 'Space Tech', 'Machine Learning', 'Remote Sensing', 'Portfolio'],
  authors: [{ name: 'Shreyank Parab' }],
  openGraph: {
    title: 'Shreyank Parab | AI/ML & GeoAI Developer',
    description: 'Portfolio of Shreyank Parab - Computer Engineering student passionate about Geospatial AI and Space Tech.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import config from './config'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-manrope'
})
export const metadata: Metadata = {
  title: config.siteName,
  description: config.siteName
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='vi'>
      <body
        className={`${manrope.variable} relative font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}

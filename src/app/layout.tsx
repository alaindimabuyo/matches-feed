import './globals.css'
import type { Metadata } from 'next'
import { Barlow } from 'next/font/google'

const barlow = Barlow({
  weight: ['400', '700', '100'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})


export const metadata: Metadata = {
  title: 'Spinbet',
  description: 'Spinbet',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={barlow.className}>{children}</body>
    </html>
  )
}

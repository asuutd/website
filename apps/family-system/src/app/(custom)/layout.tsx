// This is the root layout component for your Next.js app.

import { DM_Sans } from 'next/font/google'
import { Space_Mono } from 'next/font/google'
import { cn } from '@/utils/lib'
import './globals.css'
import type { PropsWithChildren } from 'react'

const fontHeading = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
})

const fontBody = Space_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['400'],
})

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body 
        className={cn(
          'antialiased',
          fontHeading.variable,
          fontBody.variable
        )}
      >
        {children}
      </body>
    </html>
  )
}
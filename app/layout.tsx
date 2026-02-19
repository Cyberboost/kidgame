import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Save the Bunnies: Backyard Edition',
  description: 'A wholesome literacy game for kids (Pre-K to Grade 8). Rescue bunnies by spelling sight words!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

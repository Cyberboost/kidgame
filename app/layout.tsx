import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Livy's Bunny Rescue Adventure – A Sight Word Learning Game",
  description: 'Help Livy rescue her bunny friends by spelling sight words! A fun learning game for kids Pre-K through Grade 3.',
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

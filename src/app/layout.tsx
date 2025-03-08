import SessionProvider from '@/components/providers/SessionProvider'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Contact Manager',
  description: 'School Contact Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full bg-gray-100">
      <body className={`${inter.className} h-full`}>
        <SessionProvider>
          <main className="min-h-full">{children}</main>
        </SessionProvider>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import TopNav from '@/components/TopNav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Quizzify AI',
  description: 'Turn PDFs into interactive quizzes instantly.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TopNav />
        {children}
      </body>
    </html>
  )
}

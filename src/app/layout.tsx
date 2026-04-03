import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import TopNav from '@/components/TopNav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Quizzify AI',
  description: 'Turn PDFs into interactive quizzes instantly.',
  icons: {
    icon: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-[#09090b] overscroll-none">
      <body className={`${inter.className} pb-20 md:pb-0`}>
        <TopNav />
        {children}
      </body>
    </html>
  )
}

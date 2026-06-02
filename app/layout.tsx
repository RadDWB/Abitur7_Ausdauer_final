import '../styles/globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Ausdauer Test Abitur',
  description: 'Ausdauertests verstehen und durchführen',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-gray-100">
        <main className="p-4 max-w-3xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  )
}

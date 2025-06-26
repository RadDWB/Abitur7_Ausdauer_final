import '../styles/globals.css'
import { ReactNode } from 'react'
import Image from 'next/image'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-gray-100">
        <header className="bg-[#004A9F] text-white p-4 flex items-center gap-4">
          {/* Dein Logo */}
          <Image
            src="/Zeit.png"      // liegt in public/Zeit.png
            alt="Zeitschätzlauf Logo"
            width={64}
            height={64}
          />
          {/* Qualis-NRW-Logo */}
          <Image
            src="/qualis-logo.svg"  // lege qualis-logo.svg ebenfalls in public/
            alt="Qualis NRW"
            width={48}
            height={48}
          />
          <h1 className="text-2xl font-bold">
            Zeitschätzlauf 5000 m
          </h1>
        </header>
        <main className="p-4 max-w-3xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  )
}

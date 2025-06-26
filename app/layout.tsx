// app/layout.tsx
import '../styles/globals.css'
import { ReactNode } from 'react'
import Image from 'next/image'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-gray-100">
        <header className="border-2 border-[#004A9F] p-2 flex items-center justify-between rounded-md bg-white shadow-md">
          {/* Linkes Logo */}
          <div className="flex-1 flex justify-start">
            <Image
              src="/Zeit.png"
              alt="Eingabe-Interface Logo"
              
              height={320}
            />
          </div>

          {/* Titel */}
          <div className="flex-1 flex justify-center">
            <h1 className="text-3xl font-extrabold text-[#004A9F]">
              Belastungssteuerungslauf über 5000m (als Zeitschätzlauf) in der Abiturprüfung NRW
            </h1>
          </div>

          {/* Rechtes Logo */}
          <div className="flex-1 flex justify-end">
            <Image
              src="/qualis-logo.svg"
              alt="Qualis NRW"
              width={80}
              height={80}
            />
          </div>
        </header>

        <main className="p-4 max-w-3xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  )

// app/layout.tsx
import '../styles/globals.css'
import { ReactNode } from 'react'
import Image from 'next/image'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-gray-100">
        <header className="border-2 border-[#004A9F] p-1 flex items-center justify-between rounded-md bg-white shadow-md">
          {/* Linkes Logo */}
          <div className="flex-1 flex justify-start">
            <Image
              src="/Zeit.png"
              alt="Eingabe-Interface Logo"
              width={320}
              height={320}
            />
          </div>

          {/* Titel mit Mehrzeiliger Beschreibung */}
          <div className="flex-1 flex flex-col items-center text-center space-y-0.5 px-2">
            <h1 className="text-3xl font-extrabold text-[#004A9F]">
              Belastungssteuerungslauf
            </h1>
            <p className="text-lg text-gray-700">
              Als 5000 m-Zeitschätzlauf
            </p>
            <p className="text-base text-gray-500">
              Abitur Sport LK NRW
            </p>
          </div>

          {/* Rechtes Logo */}
          <div className="flex-1 flex justify-end">
            <Image
              src="/qualis-logo.svg"
              alt="Qualis NRW"
              width={160}
              height={160}
            />
          </div>
        </header>

        <main className="p-4 max-w-3xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  )
}

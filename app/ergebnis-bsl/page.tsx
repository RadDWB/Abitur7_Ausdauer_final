'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { decodeBslRun, fmtMsShort, type BslShareData } from '../lib/dauerlauf'
import calculate from '../../utils/berechnung'
import BewertungErklaerung from '../../components/BewertungErklaerung'

function readHash(): BslShareData | null {
  if (typeof window === 'undefined') return null
  const hash = window.location.hash || ''
  const idx = hash.indexOf('#d=')
  const encoded = idx >= 0 ? hash.slice(idx + 3) : ''
  if (!encoded) return null
  return decodeBslRun(encoded)
}

function formatGermanDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return iso
  return `${m[3]}.${m[2]}.${m[1]}`
}

export default function ErgebnisBslPage() {
  const [data, setData] = useState<BslShareData | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const update = () => {
      setData(readHash())
      setLoaded(true)
    }
    update()
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])

  if (!loaded) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-8 text-center text-gray-500">
            Ergebnis wird geladen …
          </div>
        </div>
      </main>
    )
  }

  if (data === null) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-8 text-center">
            <p className="text-4xl mb-3">🔍</p>
            <h1 className="text-xl font-semibold text-gray-800 mb-2">
              Kein gültiges Ergebnis gefunden
            </h1>
            <p className="text-gray-600 mb-6">
              Der Link ist möglicherweise ungültig oder beschädigt.
            </p>
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-semibold">
              Zur Startseite
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const totalSec = data.l.reduce((a, b) => a + b, 0)
  const istZeit = Math.floor(totalSec / 60) + ':' + (totalSec % 60).toFixed(1).padStart(4, '0')

  // Vollständige Bewertung (Punkte + Note) aus denselben Rundendaten
  const result = calculate(data.l, new Array(data.l.length).fill(false), data.z, data.n)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-blue-700 mb-1">{data.n}</h1>
              <p className="text-gray-600">Belastungssteuerungslauf 5000m – Ergebnis</p>
            </div>
            <div className="text-right text-sm text-gray-500">
              {formatGermanDate(data.d)}
            </div>
          </div>
        </div>

        {/* Kennzahlen */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <p className="text-xs text-gray-500 font-semibold mb-1">Gesamtzeit</p>
            <p className="text-2xl font-mono font-bold text-blue-700">{istZeit}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <p className="text-xs text-gray-500 font-semibold mb-1">Zielzeit</p>
            <p className="text-2xl font-mono font-bold text-gray-700">{data.z}</p>
          </div>
        </div>

        {/* Bewertung */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
            <h3 className="font-bold text-gray-900">Bewertung</h3>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-gray-500 font-semibold">Gesamt</p>
                <p className="text-lg font-bold text-gray-800">{result.gesamt} / 15 Pkt.</p>
              </div>
              <div className="bg-green-100 text-green-800 rounded-xl px-5 py-2 text-3xl font-extrabold tabular-nums">
                {result.note}
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-blue-50 border-l-4 border-[#004A9F] p-4 rounded-r-lg">
              <p className="text-sm font-semibold text-[#004A9F]">Säule 1 · Zielzeit-Genauigkeit</p>
              <p className="text-2xl font-bold text-[#004A9F] mt-1">{result.zielPunkte} <span className="text-base font-medium text-gray-500">/ 10 Pkt.</span></p>
              <p className="text-xs text-gray-600 mt-1">Abweichung von der Zielzeit: <strong>{result.abwProzent} %</strong></p>
            </div>
            <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-r-lg">
              <p className="text-sm font-semibold text-green-800">Säule 2 · Tempokonstanz</p>
              <p className="text-2xl font-bold text-green-700 mt-1">{result.konstanzPunkte} <span className="text-base font-medium text-gray-500">/ 5 Pkt.</span></p>
              <p className="text-xs text-gray-600 mt-1">Standardabweichung der Runden: <strong>{result.stdAbw} s</strong></p>
            </div>
          </div>
        </div>

        {/* Rundenzeiten Tabelle */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-auto p-6">
          <h3 className="font-bold text-gray-900 mb-4">Rundenzeiten</h3>
          <div className="space-y-2">
            {data.l.map((sec, i) => {
              const label = i === 0 ? '½ Runde (200m)' : `Runde ${i} (400m)`
              return (
                <div
                  key={i}
                  className="flex items-center justify-between bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg"
                >
                  <span className="font-medium text-gray-900">{label}</span>
                  <span className="font-mono font-bold text-blue-700">
                    {Math.floor(sec / 60)}:{(sec % 60).toFixed(1).padStart(4, '0')}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Erklärung der Bewertungslogik */}
        <BewertungErklaerung />

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-semibold">
            ← Zurück zur Startseite
          </Link>
        </div>
      </div>
    </main>
  )
}

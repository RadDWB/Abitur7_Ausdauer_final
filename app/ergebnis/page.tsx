'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import LapChart from '../../components/LapChart'
import {
  decodeRun,
  calcPoints,
  ptsToGrade,
  fmtMs,
  fmtMsShort,
  analyzeLaps,
  lapLabel,
  lapDistance,
  type RunShareData,
} from '../lib/dauerlauf'

// Liest den kodierten Lauf aus dem URL-Fragment (#d=...)
function readHash(): RunShareData | null {
  if (typeof window === 'undefined') return null
  const hash = window.location.hash || ''
  const idx = hash.indexOf('#d=')
  const encoded = idx >= 0 ? hash.slice(idx + 3) : ''
  if (!encoded) return null
  return decodeRun(encoded)
}

// yyyy-mm-dd → TT.MM.JJJJ
function formatGermanDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return iso
  return `${m[3]}.${m[2]}.${m[1]}`
}

// Sekunden/km → "M:SS /km"
function formatPace(secPerKm: number): string {
  const total = Math.round(secPerKm)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, '0')} /km`
}

export default function ErgebnisPage() {
  const [data, setData] = useState<RunShareData | null>(null)
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

  // ─── Ladezustand ───────────────────────────────────────────────
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

  // ─── Fehlerzustand ─────────────────────────────────────────────
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
              Bitte den QR-Code erneut scannen.
            </p>
            <Link
              href="/"
              className="inline-block rounded-lg bg-blue-700 px-4 py-2 text-white font-medium hover:bg-blue-800 transition-colors"
            >
              Zur Startseite
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // ─── Ergebniskarte ─────────────────────────────────────────────
  const analysis = analyzeLaps(data.l)
  const points = calcPoints(Math.floor(data.t / 1000), data.g)
  const grade = ptsToGrade(points)
  const role = data.g === 'w' ? 'Schülerin' : 'Schüler'

  let cumulative = 0

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-6">
          <h1 className="text-lg font-semibold" style={{ color: '#004A9F' }}>
            🏃 5000m Dauerlauf – Ergebnis
          </h1>
          <p className="mt-2 text-2xl font-bold text-gray-900">{data.n}</p>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
            <span>{role}</span>
            {data.k ? <span>Kurs: {data.k}</span> : null}
            <span>Datum: {formatGermanDate(data.d)}</span>
          </div>
        </div>

        {/* Prominente Kennzahlen */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-5 text-center">
            <p className="text-xs uppercase tracking-wide text-gray-500">Gesamtzeit</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{fmtMs(data.t)}</p>
          </div>
          <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-5 text-center">
            <p className="text-xs uppercase tracking-wide text-gray-500">Notenpunkte</p>
            <p className="mt-1 text-2xl font-bold" style={{ color: '#004A9F' }}>
              {points}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-5 text-center">
            <p className="text-xs uppercase tracking-wide text-gray-500">Note</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{grade}</p>
          </div>
        </div>

        {/* Weitere Kennzahlen */}
        <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Kennzahlen</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Ø-Rundenzeit (400m)</p>
              <p className="mt-1 font-semibold text-gray-900">
                {fmtMsShort(Math.round(analysis.avgFullLapMs))}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Schnellste Runde</p>
              <p className="mt-1 font-semibold text-green-600">
                {lapLabel(analysis.fastestIdx)} · {fmtMsShort(data.l[analysis.fastestIdx])}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Langsamste Runde</p>
              <p className="mt-1 font-semibold text-red-600">
                {lapLabel(analysis.slowestIdx)} · {fmtMsShort(data.l[analysis.slowestIdx])}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Ø-Pace pro km</p>
              <p className="mt-1 font-semibold text-gray-900">
                {formatPace(analysis.avgPaceSecPerKm)}
              </p>
            </div>
          </div>
        </div>

        {/* Grafische Auswertung */}
        <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Grafische Auswertung</h2>
          <LapChart
            laps={data.l}
            fastestIdx={analysis.fastestIdx}
            slowestIdx={analysis.slowestIdx}
          />
        </div>

        {/* Tabelle aller Runden */}
        <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Alle Runden</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200">
                  <th className="py-2 pr-4 font-medium">Runde</th>
                  <th className="py-2 pr-4 font-medium">Distanz</th>
                  <th className="py-2 pr-4 font-medium">Rundenzeit</th>
                  <th className="py-2 font-medium">Kumuliert</th>
                </tr>
              </thead>
              <tbody>
                {data.l.map((ms, i) => {
                  cumulative += ms
                  const isFastest = i === analysis.fastestIdx
                  const isSlowest = i === analysis.slowestIdx
                  const rowClass = isFastest
                    ? 'bg-green-50'
                    : isSlowest
                    ? 'bg-red-50'
                    : ''
                  return (
                    <tr key={i} className={`border-b border-gray-100 ${rowClass}`}>
                      <td className="py-2 pr-4 text-gray-900">{lapLabel(i)}</td>
                      <td className="py-2 pr-4 text-gray-600">{lapDistance(i)}m</td>
                      <td className="py-2 pr-4 font-medium text-gray-900">{fmtMsShort(ms)}</td>
                      <td className="py-2 text-gray-600">{fmtMs(cumulative)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Aktionen & Hinweis */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg bg-blue-700 px-4 py-2 text-white font-medium hover:bg-blue-800 transition-colors"
          >
            🖨️ Drucken / als PDF speichern
          </button>
          <Link href="/" className="text-blue-700 hover:underline text-sm font-medium">
            ← Zur Startseite
          </Link>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Diese Ansicht wurde per QR-Code von der Schüler*in übergeben.
        </p>
      </div>
    </main>
  )
}

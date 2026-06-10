'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import LapChart from './LapChart'
import { useWakeLock } from '../utils/useWakeLock'
import {
  calcPoints,
  ptsToGrade,
  fmtMs,
  fmtMsShort,
  FULL_LAPS,
  TOTAL_LAPS,
  lapLabel,
  lapDistance,
  analyzeLaps,
  buildShareUrl,
  type Gender,
  type RunShareData,
} from '../app/lib/dauerlauf'

type Phase = 'setup' | 'running' | 'results'

// ms → "M:SS/km"
function fmtPacePerKm(secPerKm: number): string {
  const total = Math.round(secPerKm)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, '0')}/km`
}

export default function Dauerlauf5000mSolo() {
  const [phase, setPhase] = useState<Phase>('setup')

  // Setup-Daten
  const [name, setName] = useState('')
  const [gender, setGender] = useState<Gender>('m')
  const [className, setClassName] = useState('')

  // Erfasste Rundendauern (ms je Abschnitt)
  const [laps, setLaps] = useState<number[]>([])

  // Stoppuhr
  const [elapsedMs, setElapsedMs] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)
  const baseMsRef = useRef<number>(0)

  // QR / Teilen
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Display während des Laufs wach halten, damit man sich selbst stoppen kann.
  const wakeLockActive = useWakeLock(phase === 'running')

  const currentMs = useCallback(
    () => baseMsRef.current + (isRunning ? Date.now() - startTimeRef.current : 0),
    [isRunning],
  )

  const startWatch = useCallback(() => {
    startTimeRef.current = Date.now()
    setIsRunning(true)
    intervalRef.current = setInterval(() => {
      setElapsedMs(baseMsRef.current + Date.now() - startTimeRef.current)
    }, 50)
  }, [])

  const pauseWatch = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
    baseMsRef.current = baseMsRef.current + Date.now() - startTimeRef.current
    setElapsedMs(baseMsRef.current)
    setIsRunning(false)
  }, [])

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current) }, [])

  // ── Aktionen ──────────────────────────────────────────────
  const recordLap = () => {
    if (laps.length >= TOTAL_LAPS) return
    const now = baseMsRef.current + (isRunning ? Date.now() - startTimeRef.current : 0)
    setLaps(prev => {
      if (prev.length >= TOTAL_LAPS) return prev
      const sumSoFar = prev.reduce((a, b) => a + b, 0)
      const lapMs = now - sumSoFar
      if (lapMs <= 0) return prev
      const next = [...prev, lapMs]
      // Nach 5000m (letzter Klick) Uhr automatisch anhalten
      if (next.length >= TOTAL_LAPS && intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
        baseMsRef.current = now
        setElapsedMs(now)
        setIsRunning(false)
      }
      return next
    })
  }

  const undoLap = () => setLaps(prev => prev.slice(0, -1))

  const finish = () => {
    if (isRunning) pauseWatch()
    setPhase('results')
  }

  const resetAll = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
    baseMsRef.current = 0
    startTimeRef.current = 0
    setElapsedMs(0)
    setIsRunning(false)
    setLaps([])
    setName('')
    setGender('m')
    setClassName('')
    setShareUrl(null)
    setCopied(false)
    setPhase('setup')
  }

  const buildQr = () => {
    const totalMs = laps.reduce((a, b) => a + b, 0)
    const data: RunShareData = {
      v: 1,
      n: name.trim(),
      g: gender,
      k: className.trim() || undefined,
      t: totalMs,
      l: laps,
      d: new Date().toISOString().slice(0, 10),
    }
    const url = buildShareUrl(window.location.origin, data)
    setShareUrl(url)
    setCopied(false)
  }

  const copyLink = async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const completedLaps = laps.length
  const remaining = Math.max(0, TOTAL_LAPS - completedLaps)
  const allDone = completedLaps >= TOTAL_LAPS
  const coveredDistance = laps.reduce((sum, _ms, i) => sum + lapDistance(i), 0)

  // ── PHASE: Setup ──────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">5000m Dauerlauf – Einzelmodus</h2>

          <div className="mb-5">
            <label className="block font-semibold mb-2 text-gray-900">Name *</label>
            <input
              className="border border-gray-300 p-3 rounded-lg w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Vorname Nachname"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="mb-5">
            <label className="block font-semibold mb-2 text-gray-900">Geschlecht *</label>
            <select
              className="border border-gray-300 p-3 rounded-lg w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={gender}
              onChange={e => setGender(e.target.value as Gender)}
            >
              <option value="m">Schüler (m)</option>
              <option value="w">Schülerin (w)</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2 text-gray-900">Kurs / Klasse (optional)</label>
            <input
              className="border border-gray-300 p-3 rounded-lg w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="z.B. LK Sport Q1"
              value={className}
              onChange={e => setClassName(e.target.value)}
            />
          </div>

          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-5">
            <p className="font-bold text-blue-800 mb-2">So funktioniert&apos;s</p>
            <ul className="text-blue-900 leading-relaxed space-y-1.5 text-sm">
              <li>📍 Du startest am <strong>200m-Start</strong> und läufst zuerst eine <strong>halbe Runde</strong>, bevor du die Ziellinie zum ersten Mal überquerst.</li>
              <li>👉 Drücke den großen Button <strong>jedes Mal, wenn du die Ziellinie überquerst</strong> – beim ersten Mal nach 200m, danach nach jeder vollen Runde (400m).</li>
              <li>🏁 Insgesamt sind es <strong>13 Klicks</strong> (½ Runde + 12 volle Runden = 5000m). Beim letzten Klick stoppt die Uhr automatisch.</li>
            </ul>
          </div>

          <button
            onClick={() => { setPhase('running'); }}
            disabled={!name.trim()}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white py-5 rounded-xl text-2xl font-bold transition-colors active:scale-[0.99]"
          >
            {name.trim() ? '▶ Lauf starten' : 'Bitte Namen eingeben'}
          </button>
        </div>
      </div>
    )
  }

  // ── PHASE: Running ────────────────────────────────────────
  if (phase === 'running') {
    const phaseLabel = allDone
      ? '🏁 5000m geschafft!'
      : completedLaps === 0
      ? '½ Runde (200m) bis zur ersten Ziellinie'
      : `Runde ${completedLaps} / ${FULL_LAPS}`

    return (
      <div className="space-y-5">
        {/* Stoppuhr */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm text-center">
          {className && <p className="text-gray-500 text-sm mb-1">{className}</p>}
          <p className="text-gray-700 font-semibold mb-3">{name}</p>
          <div className={`text-6xl sm:text-7xl font-mono font-bold mb-3 tabular-nums ${allDone ? 'text-green-600' : 'text-blue-700'}`}>
            {fmtMs(elapsedMs)}
          </div>
          <div className="text-lg font-bold text-gray-900">{phaseLabel}</div>
          <div className="flex justify-center gap-6 text-sm text-gray-500 mt-1">
            <span>{coveredDistance} m / 5000 m</span>
            {!allDone && <span>noch {remaining} ×</span>}
          </div>

          {/* Runden-Punkte: rot → grün beim Überqueren der Ziellinie */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {Array.from({ length: TOTAL_LAPS }).map((_, i) => {
              const done = i < completedLaps
              const isHalf = i === 0
              return (
                <div
                  key={i}
                  title={lapLabel(i)}
                  className={`flex items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
                    isHalf ? 'w-6 h-6' : 'w-7 h-7'
                  } ${done ? 'bg-green-500 text-white' : 'bg-red-400/80 text-white'}`}
                >
                  {isHalf ? '½' : i}
                </div>
              )
            })}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {completedLaps} von {TOTAL_LAPS} Ziellinien-Überquerungen
          </p>
        </div>

        {/* RUNDE-Button */}
        <button
          onClick={recordLap}
          disabled={(!isRunning && elapsedMs === 0) || allDone}
          className={`w-full disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white py-12 rounded-2xl text-4xl font-extrabold transition-transform active:scale-95 shadow-md ${
            allDone ? 'bg-green-600' : 'bg-blue-700 hover:bg-blue-800'
          }`}
        >
          {allDone ? '✓ 5000m FERTIG' : completedLaps === 0 ? 'ZIELLINIE ✓' : 'RUNDE ✓'}
        </button>

        {/* Steuerung */}
        <button
          onClick={finish}
          disabled={laps.length === 0}
          className={`w-full disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-xl text-lg font-bold transition-colors active:scale-95 ${
            allDone ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-700 hover:bg-blue-800'
          }`}
        >
          {allDone ? '📊 Zur Auswertung' : '🏁 Ziel & Auswertung'}
        </button>

        <div className="flex gap-3">
          {!isRunning ? (
            <button
              onClick={startWatch}
              disabled={allDone}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-xl text-lg font-bold transition-colors active:scale-95"
            >
              ▶ {elapsedMs === 0 ? 'Start' : 'Weiter'}
            </button>
          ) : (
            <button
              onClick={pauseWatch}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-xl text-lg font-bold transition-colors active:scale-95"
            >
              ⏸ Pause
            </button>
          )}
          <button
            onClick={undoLap}
            disabled={laps.length === 0}
            className="flex-1 bg-gray-400 hover:bg-gray-500 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-xl text-base font-bold transition-colors active:scale-95"
          >
            ↺ Letzte Runde
          </button>
        </div>

        {/* Rundenliste */}
        {laps.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3">Erfasste Runden ({laps.length})</h3>
            <div className="space-y-2">
              {laps.map((ms, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg"
                >
                  <span className="font-medium text-gray-800">{lapLabel(i)}</span>
                  <span className="font-mono font-bold text-blue-700 text-lg">{fmtMsShort(ms)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {wakeLockActive && (
          <p className="text-xs text-green-600 text-center px-4 flex items-center justify-center gap-1">
            📱 Display bleibt während des Laufs an – du kannst das Handy in der Hand tragen.
          </p>
        )}

        <p className="text-xs text-gray-400 text-center px-4">
          Geht es dir nicht gut? Gehen ist erlaubt. Bei Schwindel, Brustschmerz oder Atemnot:
          sofort anhalten.
        </p>
      </div>
    )
  }

  // ── PHASE: Results ────────────────────────────────────────
  const analysis = analyzeLaps(laps)
  const totalMs = analysis.totalMs
  const pts = calcPoints(Math.floor(totalMs / 1000), gender)
  const grade = ptsToGrade(pts)

  // Kumulierte Zeiten für die Tabelle
  let cumulative = 0
  const cumulativeTimes = laps.map(ms => (cumulative += ms))

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-blue-700 mb-1">Auswertung</h2>
        <p className="text-gray-600 mb-6">
          {name}{className && ` · ${className}`} · {gender === 'w' ? 'Schülerin (w)' : 'Schüler (m)'}
        </p>

        {/* Hauptkarten */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
            <p className="text-sm font-semibold text-blue-700 mb-1">Gesamtzeit</p>
            <p className="text-3xl font-mono font-bold text-blue-700 tabular-nums">{fmtMs(totalMs)}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
            <p className="text-sm font-semibold text-blue-700 mb-1">Notenpunkte</p>
            <p className="text-4xl font-bold text-blue-700">{pts}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
            <p className="text-sm font-semibold text-green-700 mb-1">Note</p>
            <p className="text-4xl font-bold text-green-700">{grade}</p>
          </div>
        </div>
      </div>

      {/* Kennzahlen */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Kennzahlen</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg">
            <span className="text-gray-700">Ø-Rundenzeit (400m)</span>
            <span className="font-mono font-bold text-gray-900">{fmtMsShort(analysis.avgFullLapMs)}</span>
          </div>
          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg">
            <span className="text-gray-700">Ø-Pace</span>
            <span className="font-mono font-bold text-gray-900">{fmtPacePerKm(analysis.avgPaceSecPerKm)}</span>
          </div>
          {laps.length > 0 && (
            <>
              <div className="flex items-center justify-between bg-green-50 border border-green-200 px-4 py-3 rounded-lg">
                <span className="text-green-700">Schnellste Runde ({lapLabel(analysis.fastestIdx)})</span>
                <span className="font-mono font-bold text-green-700">{fmtMsShort(laps[analysis.fastestIdx])}</span>
              </div>
              <div className="flex items-center justify-between bg-red-50 border border-red-200 px-4 py-3 rounded-lg">
                <span className="text-red-700">Langsamste Runde ({lapLabel(analysis.slowestIdx)})</span>
                <span className="font-mono font-bold text-red-700">{fmtMsShort(laps[analysis.slowestIdx])}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Diagramm */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Rundenzeiten</h3>
        <LapChart laps={laps} fastestIdx={analysis.fastestIdx} slowestIdx={analysis.slowestIdx} />
      </div>

      {/* Tabelle */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Alle Runden</h3>
        <div className="overflow-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Runde</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Distanz</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Rundenzeit</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Kumuliert</th>
              </tr>
            </thead>
            <tbody>
              {laps.map((ms, i) => {
                const rowClass =
                  i === analysis.fastestIdx
                    ? 'bg-green-50'
                    : i === analysis.slowestIdx
                    ? 'bg-red-50'
                    : i % 2 === 0
                    ? 'bg-white'
                    : 'bg-gray-50'
                return (
                  <tr key={i} className={rowClass}>
                    <td className="px-4 py-3 font-medium">{lapLabel(i)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{lapDistance(i)}m</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-blue-700">{fmtMsShort(ms)}</td>
                    <td className="px-4 py-3 text-right font-mono text-gray-700">{fmtMsShort(cumulativeTimes[i])}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR-Übergabe */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Übergabe an Lehrkraft</h3>
        {!shareUrl ? (
          <button
            onClick={buildQr}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-4 rounded-xl text-lg font-bold transition-colors active:scale-[0.99]"
          >
            📱 An Lehrkraft übergeben (QR-Code)
          </button>
        ) : (
          <div className="flex flex-col items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(shareUrl)}`}
              alt="QR-Code für die Ergebnisübergabe"
              width={240}
              height={240}
              className="border border-gray-200 rounded-lg shadow-sm"
            />
            <p className="text-sm text-gray-600 text-center max-w-md">
              Die Lehrkraft scannt diesen Code — es öffnet sich automatisch eine Ergebniskarte
              mit allen Daten.
            </p>
            <div className="w-full">
              <p className="text-xs text-gray-400 mb-1">Link als Fallback:</p>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={shareUrl}
                  className="flex-1 border border-gray-300 p-2 rounded-lg text-xs font-mono text-gray-600 focus:outline-none"
                  onFocus={e => e.currentTarget.select()}
                />
                <button
                  onClick={copyLink}
                  className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  {copied ? '✓ Kopiert' : 'Kopieren'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={resetAll}
        className="w-full border-2 border-blue-600 text-blue-700 hover:bg-blue-50 py-4 rounded-xl text-lg font-bold transition-colors active:scale-[0.99]"
      >
        + Neuer Lauf
      </button>
    </div>
  )
}

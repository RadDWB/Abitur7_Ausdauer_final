'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import calculate, { Result } from '../utils/berechnung'
import { fmtMs, fmtMsShort } from '../app/lib/dauerlauf'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'

const LAP_COUNT = 13 // Index 0 = halbe Runde (200m), 1–12 = volle Runden (400m)

function lapLabel(i: number): string {
  return i === 0 ? '½ Runde (200m)' : `Runde ${i} (400m)`
}

export default function RundenzeitTabelle() {
  const [name, setName] = useState('')
  const [zielzeit, setZielzeit] = useState('')
  const [runden, setRunden] = useState<number[]>(Array(LAP_COUNT).fill(0))
  const [captured, setCaptured] = useState<boolean[]>(Array(LAP_COUNT).fill(false))
  const [ignore, setIgnore] = useState<boolean[]>(Array(LAP_COUNT).fill(false))
  const [history, setHistory] = useState<Result[]>([])

  // ─── Stoppuhr ───────────────────────────────────────────────
  const [elapsedMs, setElapsedMs] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)
  const baseMsRef = useRef<number>(0)
  const lastMarkRef = useRef<number>(0) // Gesamtzeit beim letzten Rundenmark

  const nowMs = useCallback(
    () => baseMsRef.current + (isRunning ? Date.now() - startTimeRef.current : 0),
    [isRunning]
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
    baseMsRef.current = baseMsRef.current + Date.now() - startTimeRef.current
    setIsRunning(false)
  }, [])

  const resetWatch = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setIsRunning(false)
    setElapsedMs(0)
    baseMsRef.current = 0
    lastMarkRef.current = 0
    setRunden(Array(LAP_COUNT).fill(0))
    setCaptured(Array(LAP_COUNT).fill(false))
  }, [])

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current) }, [])

  // aktuelle Zwischenzeit (laufende Runde) in ms
  const currentSplitMs = Math.max(0, elapsedMs - lastMarkRef.current)

  // nächste noch nicht erfasste Runde
  const activeIdx = captured.findIndex(c => !c)

  // Runde an Position i erfassen (Zwischenzeit übertragen)
  const captureLap = (i: number) => {
    const total = nowMs()
    const splitMs = Math.max(0, total - lastMarkRef.current)
    const splitSec = Math.round(splitMs / 100) / 10 // 1 Nachkommastelle
    lastMarkRef.current = total
    setRunden(r => { const c = [...r]; c[i] = splitSec; return c })
    setCaptured(c => { const x = [...c]; x[i] = true; return x })
  }

  // nächste Runde automatisch erfassen
  const captureNext = () => {
    if (activeIdx === -1) return
    captureLap(activeIdx)
  }

  const handleRoundChange = (i: number, value: string) => {
    const num = parseFloat(value) || 0
    setRunden(r => { const c = [...r]; c[i] = num; return c })
    setCaptured(c => { const x = [...c]; x[i] = value.trim() !== ''; return x })
  }

  const clearLap = (i: number) => {
    setRunden(r => { const c = [...r]; c[i] = 0; return c })
    setCaptured(c => { const x = [...c]; x[i] = false; return x })
  }

  const toggleIgnore = (i: number) => {
    setIgnore(f => { const c = [...f]; c[i] = !c[i]; return c })
  }

  const addResult = () => {
    const res = calculate(runden, ignore, zielzeit, name)
    setHistory(h => [...h, res])
  }

  const removeAt = (i: number) => setHistory(h => h.filter((_, idx) => idx !== i))

  const exportXLS = () => {
    const ws = XLSX.utils.json_to_sheet(history)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Ergebnisse')
    XLSX.writeFile(wb, 'zeitschaetzlauf.xlsx')
  }

  const exportPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('Belastungssteuerungslauf – Ergebnisse', 14, 20)
    doc.setFontSize(10)
    history.forEach((r, idx) => {
      doc.text(`${idx + 1}. ${r.name} – Endzeit ${r.istZeit} – Note ${r.note} (${r.gesamt} Pkt.)`, 14, 32 + idx * 8)
    })
    doc.save('zeitschaetzlauf.pdf')
  }

  // Kennzahlen für die Live-Anzeige
  const capturedCount = captured.filter(Boolean).length
  const sumSec = runden.reduce((s, t, i) => s + (i === 0 ? t * 0.5 : t), 0)
  const fullLapTimes = runden.filter((_, i) => i > 0 && captured[i])
  const maxLap = Math.max(1, ...fullLapTimes)

  return (
    <div className="space-y-6">
      {/* ─── Kopf: Name & Zielzeit ─── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Belastungssteuerungslauf – Erfassung</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="font-semibold block mb-1 text-gray-900">Name</label>
            <input
              className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Vorname Nachname"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="font-semibold block mb-1 text-gray-900">Zielzeit (MM:SS)</label>
            <input
              className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="z.B. 22:00"
              value={zielzeit}
              onChange={e => setZielzeit(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ─── Stoppuhr ─── */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl p-6 shadow-sm text-center text-white">
        <p className="text-blue-200 text-sm font-medium mb-1">Gesamtzeit</p>
        <div className="text-6xl sm:text-7xl font-mono font-bold tabular-nums mb-1">
          {fmtMs(elapsedMs)}
        </div>
        <p className="text-blue-200 text-sm mb-5">
          laufende Runde: <span className="font-mono font-bold text-white">{fmtMs(currentSplitMs)}</span>
          {activeIdx !== -1 && <> · nächste: <span className="font-semibold text-white">{lapLabel(activeIdx)}</span></>}
        </p>

        <div className="flex justify-center gap-3 flex-wrap mb-4">
          {!isRunning ? (
            <button
              onClick={startWatch}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl text-lg font-bold transition-colors active:scale-95"
            >
              ▶ {elapsedMs === 0 ? 'Start' : 'Weiter'}
            </button>
          ) : (
            <button
              onClick={pauseWatch}
              className="bg-amber-400 hover:bg-amber-500 text-amber-950 px-8 py-3 rounded-xl text-lg font-bold transition-colors active:scale-95"
            >
              ⏸ Pause
            </button>
          )}
          <button
            onClick={resetWatch}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl text-lg font-bold transition-colors active:scale-95"
          >
            ↺ Reset
          </button>
        </div>

        <button
          onClick={captureNext}
          disabled={activeIdx === -1 || elapsedMs === 0}
          className="w-full bg-white text-blue-800 hover:bg-blue-50 disabled:bg-white/30 disabled:text-white/60 disabled:cursor-not-allowed py-4 rounded-xl text-xl font-extrabold transition-colors active:scale-[0.98]"
        >
          {activeIdx === -1
            ? '✓ Alle Runden erfasst'
            : `⏱ ${lapLabel(activeIdx)} erfassen`}
        </button>

        {/* Fortschritt */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-blue-200 mb-1">
            <span>{capturedCount} / {LAP_COUNT} Runden</span>
            <span>{Math.round((capturedCount === 0 ? 0 : (0.5 + (capturedCount - 1)) / 12.5 * 5000))} m</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="bg-green-400 h-full transition-all"
              style={{ width: `${(capturedCount / LAP_COUNT) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* ─── Rundentabelle mit Timer-Button je Runde ─── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="font-bold text-gray-900">Rundenzeiten (Sekunden)</h3>
          <span className="text-sm text-gray-500">Summe: <span className="font-mono font-bold text-blue-700">{fmtMsShort(sumSec * 1000)}</span> ({sumSec.toFixed(1)} s)</span>
        </div>

        <div className="space-y-2">
          {runden.map((val, i) => {
            const isActive = i === activeIdx
            const isCaptured = captured[i]
            const barPct = i > 0 && isCaptured ? (val / maxLap) * 100 : 0
            return (
              <div
                key={i}
                className={`flex items-center gap-2 sm:gap-3 rounded-lg px-3 py-2 border transition-colors ${
                  isActive ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-300'
                  : isCaptured ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
                }`}
              >
                <span className="w-32 sm:w-40 text-sm font-medium text-gray-700 flex-shrink-0">{lapLabel(i)}</span>

                {/* Mini-Balken zur Tempo-Visualisierung (volle Runden) */}
                <div className="hidden sm:block flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  {i > 0 && isCaptured && (
                    <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${barPct}%` }} />
                  )}
                </div>

                <input
                  type="number"
                  step="0.1"
                  className={`border p-2 rounded-lg w-24 text-right font-mono focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    isCaptured ? 'border-green-300 bg-white' : 'border-gray-300'
                  }`}
                  placeholder="Sek."
                  value={isCaptured || val !== 0 ? val : ''}
                  onChange={e => handleRoundChange(i, e.target.value)}
                />

                <button
                  onClick={() => captureLap(i)}
                  disabled={elapsedMs === 0}
                  title="Aktuelle Zwischenzeit in diese Runde übertragen"
                  className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors active:scale-95"
                >
                  ⏱
                </button>

                {isCaptured && (
                  <button
                    onClick={() => clearLap(i)}
                    title="Runde leeren"
                    className="flex-shrink-0 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    ✕
                  </button>
                )}

                <label className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0 ml-1">
                  <input type="checkbox" checked={ignore[i]} onChange={() => toggleIgnore(i)} />
                  <span className="hidden sm:inline">ignor.</span>
                </label>
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── Aktionen ─── */}
      <div className="flex flex-wrap gap-3">
        <button onClick={addResult} className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors">
          📊 Auswerten
        </button>
        <button onClick={exportXLS} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors">
          Export XLS
        </button>
        <button onClick={exportPDF} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors">
          Export PDF
        </button>
      </div>

      {/* ─── Ergebnis-Tabelle ─── */}
      {history.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-auto">
          <table className="min-w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="p-3 text-sm font-semibold text-gray-700">Endzeit</th>
                <th className="p-3 text-sm font-semibold text-gray-700">Abw. Ziel (%)</th>
                <th className="p-3 text-sm font-semibold text-gray-700 bg-blue-100">Pkt. Ziel</th>
                <th className="p-3 text-sm font-semibold text-gray-700">Stdabw (s)</th>
                <th className="p-3 text-sm font-semibold text-gray-700 bg-blue-100">Pkt. Tempo</th>
                <th className="p-3 text-sm font-semibold text-gray-700">Gesamt</th>
                <th className="p-3 text-sm font-semibold text-gray-700 bg-green-100">Note</th>
                <th className="p-3 text-center text-sm font-semibold text-gray-700">Löschen</th>
              </tr>
            </thead>
            <tbody>
              {history.map((r, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-3 font-medium">{r.name}</td>
                  <td className="p-3 text-center font-mono">{r.istZeit}</td>
                  <td className="p-3 text-center">{r.abwProzent}</td>
                  <td className="p-3 text-center bg-blue-50 font-bold text-blue-700">{r.zielPunkte}</td>
                  <td className="p-3 text-center">{r.stdAbw}</td>
                  <td className="p-3 text-center bg-blue-50 font-bold text-blue-700">{r.konstanzPunkte}</td>
                  <td className="p-3 text-center font-bold">{r.gesamt}</td>
                  <td className="p-3 text-center bg-green-50 font-bold text-lg">{r.note}</td>
                  <td className="p-3 text-center">
                    <button onClick={() => removeAt(idx)} aria-label="Eintrag löschen" className="text-gray-300 hover:text-red-600 transition-colors">
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

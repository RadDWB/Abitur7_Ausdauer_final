'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import Dauerlauf5000mSolo from './Dauerlauf5000mSolo'
import { useWakeLock } from '../utils/useWakeLock'

type Mode = 'choose' | 'kurs' | 'solo'

// ─── Normwerte (Sekunden) ─────────────────────────────────────
const NORM_W: Record<number, number> = {
  15: 1515, 14: 1545, 13: 1575, 12: 1605, 11: 1650,
  10: 1695,  9: 1740,  8: 1800,  7: 1860,  6: 1920,
   5: 1980,  4: 2040,  3: 2115,  2: 2190,  1: 2265,
}
const NORM_M: Record<number, number> = {
  15: 1275, 14: 1305, 13: 1335, 12: 1365, 11: 1410,
  10: 1455,  9: 1500,  8: 1560,  7: 1620,  6: 1680,
   5: 1740,  4: 1800,  3: 1875,  2: 1950,  1: 2025,
}

function calcPoints(secs: number, gender: 'w' | 'm'): number {
  const table = gender === 'w' ? NORM_W : NORM_M
  for (let p = 15; p >= 1; p--) {
    if (secs <= table[p]) return p
  }
  return 0
}

function ptsToGrade(p: number): string {
  const g: Record<number, string> = {
    15:'1+',14:'1',13:'1-',12:'2+',11:'2',10:'2-',
    9:'3+',8:'3',7:'3-',6:'4+',5:'4',4:'4-',
    3:'5+',2:'5',1:'5-',0:'6',
  }
  return g[p] ?? '6'
}

function fmtMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const centis = Math.floor((ms % 1000) / 10)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${s.toString().padStart(2,'0')}.${centis.toString().padStart(2,'0')}`
}

function fmtMsShort(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${s.toString().padStart(2,'0')}`
}

function genId(): string {
  return Math.random().toString(36).slice(2, 11)
}

// ─── Types ───────────────────────────────────────────────────
interface Student {
  id: string
  name: string
  gender: 'w' | 'm'
  finishMs: number | null
}

type Phase = 'setup' | 'running' | 'results'

// ─── Normwerte Table (shared) ─────────────────────────────────
function NormwerteTabelle() {
  const rows: [number, string, string][] = [
    [15,'25:15','21:15'],[14,'25:45','21:45'],[13,'26:15','22:15'],
    [12,'26:45','22:45'],[11,'27:30','23:30'],[10,'28:15','24:15'],
    [9,'29:00','25:00'],[8,'30:00','26:00'],[7,'31:00','27:00'],
    [6,'32:00','28:00'],[5,'33:00','29:00'],[4,'34:00','30:00'],
    [3,'35:15','31:15'],[2,'36:30','32:30'],[1,'37:45','33:45'],
  ]
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">Normwerttabelle – 5000m Dauerlauf</h3>
        <a
          href="https://www.qua-lis.nrw.de/system/files/media/document/file/4734_2_sportpraktische_pruefung_abitur_teil_i_vorgaben_ab_2021.pdf"
          target="_blank" rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          📄 Qua-Lis PDF
        </a>
      </div>
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-blue-50">
              <th className="px-4 py-2 text-center font-semibold border-b border-gray-200">Notenpunkte</th>
              <th className="px-4 py-2 text-center font-semibold border-b border-gray-200">Schülerinnen</th>
              <th className="px-4 py-2 text-center font-semibold border-b border-gray-200">Schüler</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([pts, w, m], i) => (
              <tr key={pts} className={pts === 11 || pts === 5 ? 'bg-blue-50 font-semibold' : i % 2 === 0 ? '' : 'bg-gray-50'}>
                <td className="px-4 py-2 text-center border-b border-gray-100 font-bold">{pts}</td>
                <td className="px-4 py-2 text-center border-b border-gray-100">{w}</td>
                <td className="px-4 py-2 text-center border-b border-gray-100">{m}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-3">Quelle: Qua-Lis NRW – Vorgaben Sportpraktische Prüfung Abitur ab 2021</p>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────
export default function Dauerlauf5000mTest() {
  const [mode, setMode] = useState<Mode>('choose')
  const [phase, setPhase] = useState<Phase>('setup')
  const [className, setClassName] = useState('')
  const [students, setStudents] = useState<Student[]>([])
  const [newName, setNewName] = useState('')
  const [newGender, setNewGender] = useState<'w' | 'm'>('m')
  const [qrVisible, setQrVisible] = useState(false)

  // Stopwatch
  const [elapsedMs, setElapsedMs] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)
  const baseMsRef = useRef<number>(0)

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
    setStudents(s => s.map(st => ({ ...st, finishMs: null })))
  }, [])

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current) }, [])

  // Display während des laufenden Kurstests wach halten (Handy in der Hand).
  const wakeLockActive = useWakeLock(mode === 'kurs' && phase === 'running')

  const addStudent = () => {
    if (!newName.trim()) return
    setStudents(s => [...s, { id: genId(), name: newName.trim(), gender: newGender, finishMs: null }])
    setNewName('')
  }

  const removeStudent = (id: string) => setStudents(s => s.filter(st => st.id !== id))

  const markFinished = (id: string) => {
    const now = baseMsRef.current + (isRunning ? Date.now() - startTimeRef.current : 0)
    setStudents(s => s.map(st => st.id === id ? { ...st, finishMs: now } : st))
  }

  const unmarkFinished = (id: string) =>
    setStudents(s => s.map(st => st.id === id ? { ...st, finishMs: null } : st))

  const results = students.map(st => {
    const secs = st.finishMs !== null ? Math.floor(st.finishMs / 1000) : null
    const pts = secs !== null ? calcPoints(secs, st.gender) : null
    return { ...st, secs, pts, grade: pts !== null ? ptsToGrade(pts) : '–', timeStr: st.finishMs !== null ? fmtMsShort(st.finishMs) : 'Nicht erfasst' }
  })

  const exportXLS = () => {
    const data = results.map(r => ({
      Name: r.name,
      Geschlecht: r.gender === 'w' ? 'Schülerin (w)' : 'Schüler (m)',
      'Zeit (MM:SS)': r.timeStr,
      Notenpunkte: r.pts ?? '–',
      Note: r.grade,
      Kurs: className,
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '5000m Dauerlauf')
    XLSX.writeFile(wb, `5000m_Dauerlauf_${className || 'Ergebnisse'}.xlsx`)
  }

  const exportPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text('5000m Dauerlauf – Ergebnisse', 14, 22)
    if (className) { doc.setFontSize(12); doc.text(className, 14, 32) }
    doc.setFontSize(10)
    let y = className ? 44 : 38
    const cols = [14, 70, 110, 145, 170]
    const headers = ['Name', 'Geschlecht', 'Zeit (MM:SS)', 'Punkte', 'Note']
    headers.forEach((h, i) => doc.text(h, cols[i], y))
    y += 4; doc.line(14, y, 196, y); y += 6
    results
      .filter(r => r.finishMs !== null)
      .sort((a, b) => (a.finishMs ?? 0) - (b.finishMs ?? 0))
      .forEach(r => {
        doc.text(r.name.slice(0, 22), cols[0], y)
        doc.text(r.gender === 'w' ? 'w' : 'm', cols[1], y)
        doc.text(r.timeStr, cols[2], y)
        doc.text(String(r.pts ?? '–'), cols[3], y)
        doc.text(r.grade, cols[4], y)
        y += 8
        if (y > 270) { doc.addPage(); y = 20 }
      })
    doc.save(`5000m_Dauerlauf_${className || 'Ergebnisse'}.pdf`)
  }

  const qrData = typeof window !== 'undefined'
    ? encodeURIComponent(window.location.href)
    : ''

  // ── Moduswahl: Einzel- oder Kursmodus ─────────────────────
  if (mode === 'choose') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-blue-700 mb-2">5000m Dauerlauf</h2>
          <p className="text-gray-600 mb-6">Wie möchtest du den Test durchführen?</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <button
              onClick={() => setMode('solo')}
              className="text-left border-2 border-blue-600 hover:bg-blue-50 rounded-xl p-5 transition-colors active:scale-95"
            >
              <div className="text-3xl mb-2">📱</div>
              <h3 className="text-lg font-bold text-blue-700 mb-1">Einzelmodus (selbst)</h3>
              <p className="text-sm text-gray-600">
                Ich laufe alleine und stoppe selbst mit dem Handy. Rundenzeiten alle 400m,
                am Ende umfassende Auswertung mit Diagramm – per QR-Code an die Lehrkraft übergebbar.
              </p>
            </button>
            <button
              onClick={() => setMode('kurs')}
              className="text-left border-2 border-gray-300 hover:bg-gray-50 rounded-xl p-5 transition-colors active:scale-95"
            >
              <div className="text-3xl mb-2">👥</div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Kursmodus (Lehrkraft)</h3>
              <p className="text-sm text-gray-600">
                Mehrere Schüler*innen werden erfasst. Eine Stoppuhr, Zieleinlauf per Tippen,
                Ergebnisliste mit Export (XLS/PDF).
              </p>
            </button>
          </div>
        </div>
        <NormwerteTabelle />
      </div>
    )
  }

  // ── Einzelmodus: eigene Komponente ────────────────────────
  if (mode === 'solo') {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setMode('choose')}
          className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
        >
          ← Modus wechseln
        </button>
        <Dauerlauf5000mSolo />
      </div>
    )
  }

  // ── PHASE: Setup ──────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">5000m Dauerlauf – Vorbereitung</h2>

          <div className="mb-6">
            <label className="block font-semibold mb-2 text-gray-900">Klasse / Kurs (optional)</label>
            <input
              className="border border-gray-300 p-2 rounded-lg w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="z.B. LK Sport Q1"
              value={className}
              onChange={e => setClassName(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Schüler*innen hinzufügen</h3>
            <div className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Name</label>
                <input
                  className="border border-gray-300 p-2 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Vorname Nachname"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addStudent()}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Geschlecht</label>
                <select
                  className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={newGender}
                  onChange={e => setNewGender(e.target.value as 'w' | 'm')}
                >
                  <option value="m">Schüler (m)</option>
                  <option value="w">Schülerin (w)</option>
                </select>
              </div>
              <button
                onClick={addStudent}
                className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg font-semibold transition-colors"
              >
                + Hinzufügen
              </button>
            </div>
          </div>

          {students.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Schülerliste ({students.length})</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {students.map(st => (
                  <div key={st.id} className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${st.gender === 'w' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>
                      {st.gender === 'w' ? '♀ w' : '♂ m'}
                    </span>
                    <span className="flex-1 font-medium text-sm">{st.name}</span>
                    <button onClick={() => removeStudent(st.id)} className="text-gray-300 hover:text-red-500 transition-colors">✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => setPhase('running')}
            disabled={students.length === 0}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-xl text-xl font-bold transition-colors"
          >
            {students.length === 0 ? 'Bitte zuerst Schüler*innen hinzufügen' : `▶ Test starten (${students.length} Schüler*innen)`}
          </button>
        </div>

        <NormwerteTabelle />
      </div>
    )
  }

  // ── PHASE: Running ────────────────────────────────────────
  if (phase === 'running') {
    const running = students.filter(s => s.finishMs === null)
    const finished = students.filter(s => s.finishMs !== null).sort((a, b) => (a.finishMs ?? 0) - (b.finishMs ?? 0))

    return (
      <div className="space-y-6">
        {/* Stopwatch */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm text-center">
          {className && <p className="text-gray-500 text-sm mb-2">{className}</p>}
          <div className="text-7xl font-mono font-bold text-blue-700 mb-6 tabular-nums">
            {fmtMs(elapsedMs)}
          </div>
          <div className="flex justify-center gap-4 flex-wrap">
            {!isRunning ? (
              <button
                onClick={startWatch}
                className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-xl text-xl font-bold transition-colors"
              >
                ▶ {elapsedMs === 0 ? 'Start' : 'Weiter'}
              </button>
            ) : (
              <button
                onClick={pauseWatch}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-10 py-3 rounded-xl text-xl font-bold transition-colors"
              >
                ⏸ Pause
              </button>
            )}
            <button
              onClick={resetWatch}
              className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-xl text-xl font-bold transition-colors"
            >
              ↺ Reset
            </button>
          </div>
          {wakeLockActive && (
            <p className="text-xs text-green-600 mt-4 flex items-center justify-center gap-1">
              📱 Display bleibt während des Tests an.
            </p>
          )}
        </div>

        {/* Still running */}
        {running.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">🏃 Noch laufend ({running.length})</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {running.map(st => (
                <button
                  key={st.id}
                  onClick={() => markFinished(st.id)}
                  className="flex items-center gap-3 bg-amber-50 border-2 border-amber-400 hover:bg-amber-100 px-4 py-4 rounded-xl text-left font-semibold transition-colors active:scale-95"
                >
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${st.gender === 'w' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>
                    {st.gender === 'w' ? '♀' : '♂'}
                  </span>
                  <span className="flex-1">{st.name}</span>
                  <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-lg font-bold flex-shrink-0">ZIEL ✓</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Finished */}
        {finished.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">✅ Im Ziel ({finished.length})</h3>
            <div className="space-y-2">
              {finished.map(st => {
                const secs = Math.floor((st.finishMs ?? 0) / 1000)
                const pts = calcPoints(secs, st.gender)
                return (
                  <div key={st.id} className="flex items-center gap-3 bg-green-50 border border-green-200 px-4 py-3 rounded-xl">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${st.gender === 'w' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>
                      {st.gender === 'w' ? '♀' : '♂'}
                    </span>
                    <span className="flex-1 font-medium">{st.name}</span>
                    <span className="font-mono font-bold text-blue-700">{fmtMsShort(st.finishMs ?? 0)}</span>
                    <span className="bg-blue-600 text-white text-sm px-2 py-1 rounded font-bold">{pts} Pkt.</span>
                    <span className="bg-green-600 text-white text-sm px-2 py-1 rounded font-bold">{ptsToGrade(pts)}</span>
                    <button onClick={() => unmarkFinished(st.id)} className="text-xs text-gray-300 hover:text-red-400 ml-1">↺</button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <button
          onClick={() => { if (isRunning) pauseWatch(); setPhase('results') }}
          disabled={finished.length === 0}
          className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-xl text-lg font-bold transition-colors"
        >
          {finished.length === 0 ? 'Noch keine Ergebnisse' : `📊 Zur Auswertung (${finished.length} Ergebnisse)`}
        </button>
      </div>
    )
  }

  // ── PHASE: Results ────────────────────────────────────────
  const sortedResults = results
    .filter(r => r.finishMs !== null)
    .sort((a, b) => (a.finishMs ?? 0) - (b.finishMs ?? 0))
  const missing = results.filter(r => r.finishMs === null)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className="text-2xl font-bold text-blue-700">
            Ergebnisse {className && `– ${className}`}
          </h2>
          <button
            onClick={() => setPhase('running')}
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
          >
            ← Zurück zum Test
          </button>
        </div>

        <div className="overflow-auto rounded-lg border border-gray-200">
          <table className="min-w-full">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Platz</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Gesch.</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 font-mono">Zeit</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 bg-blue-100">Punkte</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 bg-green-100">Note</th>
              </tr>
            </thead>
            <tbody>
              {sortedResults.map((r, i) => (
                <tr key={r.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-gray-500 font-mono text-sm">{i + 1}.</td>
                  <td className="px-4 py-3 font-medium">{r.name}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.gender === 'w' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>
                      {r.gender === 'w' ? '♀ w' : '♂ m'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-blue-700">{r.timeStr}</td>
                  <td className="px-4 py-3 text-center bg-blue-50 font-bold text-blue-700 text-lg">{r.pts}</td>
                  <td className="px-4 py-3 text-center bg-green-50 font-bold text-lg">{r.grade}</td>
                </tr>
              ))}
              {missing.map(r => (
                <tr key={r.id} className="bg-red-50">
                  <td className="px-4 py-3 text-gray-400">–</td>
                  <td className="px-4 py-3 text-gray-500">{r.name}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-400">{r.gender}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 italic text-sm">Nicht erfasst</td>
                  <td className="px-4 py-3 text-center text-gray-300">–</td>
                  <td className="px-4 py-3 text-center text-gray-300">–</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={exportXLS}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            📊 Export XLS
          </button>
          <button
            onClick={exportPDF}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            📄 Export PDF
          </button>
          <button
            onClick={() => setQrVisible(!qrVisible)}
            className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            📱 QR Code
          </button>
          <button
            onClick={() => { setPhase('setup'); setStudents([]); setElapsedMs(0); baseMsRef.current = 0 }}
            className="border-2 border-blue-600 text-blue-700 hover:bg-blue-50 px-5 py-2.5 rounded-lg font-semibold transition-colors"
          >
            + Neuer Test
          </button>
        </div>

        {/* QR Code */}
        {qrVisible && qrData && (
          <div className="mt-6 p-5 bg-gray-50 rounded-xl flex flex-col sm:flex-row items-center gap-6 border border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}`}
              alt="QR Code"
              width={200}
              height={200}
              className="border border-gray-200 rounded-lg shadow-sm"
            />
            <div>
              <p className="font-semibold text-gray-900 mb-1">QR Code – Test-Seite</p>
              <p className="text-sm text-gray-500">Scanne diesen Code, um die Test-Seite auf einem anderen Gerät zu öffnen.</p>
            </div>
          </div>
        )}
      </div>

      <NormwerteTabelle />
    </div>
  )
}

'use client'
import { useState } from 'react'
import calculate, { Result } from '../utils/berechnung'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'

export default function RundenzeitTabelle() {
  const [name, setName] = useState('')
  const [zielzeit, setZielzeit] = useState('')
  const [runden, setRunden] = useState<number[]>(Array(13).fill(0))
  const [ignore, setIgnore] = useState<boolean[]>(Array(13).fill(false))
  const [history, setHistory] = useState<Result[]>([])

  const handleRoundChange = (i: number, value: string) => {
    const nums = [...runden]
    nums[i] = parseFloat(value) || 0
    setRunden(nums)
  }

  const toggleIgnore = (i: number) => {
    const flags = [...ignore]
    flags[i] = !flags[i]
    setIgnore(flags)
  }

  const addResult = () => {
    const res = calculate(runden, ignore, zielzeit, name)
    setHistory(h => [...h, res])
  }

  const removeAt = (i: number) => {
    setHistory(h => h.filter((_, idx) => idx !== i))
  }

  const exportXLS = () => {
    const ws = XLSX.utils.json_to_sheet(history)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Ergebnisse')
    XLSX.writeFile(wb, 'zeitschaetzlauf.xlsx')
  }

  const exportPDF = () => {
    const doc = new jsPDF()
    history.forEach((r, idx) => {
      doc.text(`${idx + 1}. ${r.name} – Note ${r.note}`, 10, 10 + idx * 10)
    })
    doc.save('zeitschaetzlauf.pdf')
  }

  return (
    <div className="space-y-6">
      {/* Eingabebereich */}
      <div className="flex flex-col md:flex-row md:space-x-4">
        <div className="flex-1">
          <label className="font-semibold block mb-1">Name</label>
          <input
            className="border p-2 rounded w-full"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="font-semibold block mb-1">Zielzeit (MM:SS)</label>
          <input
            className="border p-2 rounded w-full"
            placeholder="22:00"
            value={zielzeit}
            onChange={e => setZielzeit(e.target.value)}
          />
        </div>
      </div>

      {/* Rundenzeiten */}
      <div className="space-y-2">
        <p className="font-semibold">Rundenzeiten in Sekunden</p>
        {runden.map((_, i) => {
          const label = i === 0 ? 'Erste halbe Runde 0,5' : `Runde ${i}`
          return (
            <div key={i} className="flex items-center gap-2">
              <label className="w-40">{label}</label>
              <input
                type="number"
                className="border p-2 rounded w-32"
                placeholder="Sekunden"
                onChange={e => handleRoundChange(i, e.target.value)}
              />
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={ignore[i]}
                  onChange={() => toggleIgnore(i)}
                />
                <span>ignorieren</span>
              </label>
            </div>
          )
        })}
      </div>

      {/* Aktionen */}
      <div className="flex flex-wrap gap-2">
        <button onClick={addResult} className="bg-blue-600 text-white px-4 py-2 rounded">
          Auswerten
        </button>
        <button onClick={exportXLS} className="bg-green-600 text-white px-4 py-2 rounded">
          Export XLS
        </button>
        <button onClick={exportPDF} className="bg-red-600 text-white px-4 py-2 rounded">
          Export PDF
        </button>
      </div>

      {/* Ergebnis-Tabelle */}
      {history.length > 0 && (
        <div className="overflow-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Endzeit (mm:ss)</th>
                <th className="p-2">Abw. Ziel (%)</th>
                <th className="p-2 bg-blue-100">Pkt. Ziel</th>
                <th className="p-2">Stdabw (s)</th>
                <th className="p-2 bg-blue-100">Pkt. Tempok.</th>
                <th className="p-2">Gesamtpkt.</th>
                <th className="p-2 bg-green-100">Note</th>
                <th className="p-2 text-center">Löschen</th>
              </tr>
            </thead>
            <tbody>
              {history.map((r, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">{r.name}</td>
                  <td className="p-2">{r.istZeit}</td>
                  <td className="p-2">{r.abwProzent}</td>
                  <td className="p-2 bg-blue-50">{r.zielPunkte}</td>
                  <td className="p-2">{r.stdAbw}</td>
                  <td className="p-2 bg-blue-50">{r.konstanzPunkte}</td>
                  <td className="p-2">{r.gesamt}</td>
                  <td className="p-2 bg-green-50">{r.note}</td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => removeAt(idx)}
                      aria-label="Eintrag löschen"
                      className="hover:text-red-600"
                    >
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

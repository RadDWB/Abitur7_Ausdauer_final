'use client'

import { useState } from 'react'

/**
 * Tiefe, didaktische Erklärung der Bewertungslogik des Belastungssteuerungslaufs.
 * Spiegelt exakt die Berechnung in utils/berechnung.ts wider.
 * Wird in der Info-Seite, der Lehrer-Auswertung und der QR-Ergebniskarte verwendet.
 */

const ZIEL_SCHWELLEN: [string, number][] = [
  ['≤ 1 %', 10],
  ['≤ 2 %', 9],
  ['≤ 3 %', 8],
  ['≤ 4 %', 7],
  ['≤ 5 %', 6],
  ['≤ 6 %', 5],
  ['≤ 7 %', 4],
  ['≤ 8 %', 3],
  ['≤ 10 %', 2],
  ['> 10 %', 1],
]

const KONSTANZ_SCHWELLEN: [string, number, string][] = [
  ['σ ≤ 3 s', 5, 'sehr gleichmäßig'],
  ['σ ≤ 6 s', 4, 'gleichmäßig'],
  ['σ ≤ 9 s', 3, 'leichte Schwankungen'],
  ['σ ≤ 12 s', 2, 'deutliche Schwankungen'],
  ['σ > 12 s', 1, 'starke Schwankungen'],
]

const NOTEN: [number, string][] = [
  [15, '1+'], [14, '1'], [13, '1-'], [12, '2+'], [11, '2'], [10, '2-'],
  [9, '3+'], [8, '3'], [7, '3-'], [6, '4+'], [5, '4'], [4, '4-'],
  [3, '5+'], [2, '5'], [1, '5-'], [0, '6'],
]

function Formula({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 text-gray-50 rounded-lg px-4 py-3 my-3 font-mono text-sm overflow-x-auto">
      {children}
    </div>
  )
}

export default function BewertungErklaerung({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="bg-white rounded-xl border-2 border-[#004A9F]/20 shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full px-6 py-5 flex items-center justify-between bg-gradient-to-r from-[#004A9F] to-[#003a7a] text-white transition-all"
      >
        <span className="flex items-center gap-3 text-lg font-semibold">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path d="M9 7h6m-6 4h6m-6 4h4M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z" />
          </svg>
          <span>So wird bewertet — das mathematische Modell</span>
        </span>
        <span className={`transform transition-transform duration-200 text-xl ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {open && (
        <div className="px-6 py-8 space-y-8 text-gray-700 border-t-2 border-[#004A9F]/20">

          {/* In einfachen Worten */}
          <section className="bg-green-50 border-l-4 border-green-600 p-4 rounded-r-lg">
            <p className="font-semibold text-green-800 mb-2">In einfachen Worten</p>
            <p className="text-sm">
              Du sagst vorher, wie lange du für die 5000&nbsp;m brauchen möchtest (deine <strong>Zielzeit</strong>).
              Danach zählt zweierlei: <strong>(1)</strong> Wie nah deine echte Zeit an dieser Wunschzeit liegt – egal ob
              du schneller oder langsamer warst. <strong>(2)</strong> Wie <strong>gleichmäßig</strong> du gelaufen bist,
              also ob alle Runden ungefähr gleich lang gedauert haben. Für beides gibt es Punkte, zusammen ergeben sie
              die Note. Es geht also <strong>nicht ums Schnellsein</strong>, sondern ums kluge Einteilen der Kraft.
            </p>
          </section>

          {/* Überblick */}
          <section>
            <h4 className="text-lg font-bold text-[#004A9F] mb-3">Überblick: zwei Säulen, maximal 15 Punkte</h4>
            <p className="text-sm mb-3">
              Die Note setzt sich aus <strong>zwei unabhängigen Bewertungssäulen</strong> zusammen. Bewertet wird
              nicht, wie <em>schnell</em> du bist, sondern wie gut du deine selbst gewählte Belastung <em>steuerst</em>.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 border-l-4 border-[#004A9F] p-4 rounded-r-lg">
                <p className="font-bold text-[#004A9F]">Säule 1 · Zielzeit-Genauigkeit</p>
                <p className="text-sm mt-1">Wie nah liegt deine Endzeit an deiner selbst gewählten Zielzeit? <strong>max. 10 Punkte</strong></p>
              </div>
              <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-r-lg">
                <p className="font-bold text-green-800">Säule 2 · Tempokonstanz</p>
                <p className="text-sm mt-1">Wie gleichmäßig waren deine Rundenzeiten? <strong>max. 5 Punkte</strong></p>
              </div>
            </div>
            <Formula>Gesamtpunkte = Punkte&nbsp;Zielzeit (0–10) + Punkte&nbsp;Tempokonstanz (0–5)</Formula>
          </section>

          {/* Endzeit */}
          <section>
            <h4 className="text-lg font-bold text-[#004A9F] mb-3">Grundlage: die Endzeit</h4>
            <p className="text-sm mb-2">
              Die Strecke besteht aus einer halben Runde (200&nbsp;m) plus zwölf vollen Runden (je 400&nbsp;m) = 5000&nbsp;m.
              Jede gemessene Splitzeit ist die <strong>tatsächlich verstrichene Zeit</strong> für ihren Abschnitt und
              zählt <strong>voll</strong> – auch die halbe Runde.
            </p>
            <Formula>
              t<sub>gesamt</sub> = r<sub>0</sub> (½&nbsp;Runde) + r<sub>1</sub> + r<sub>2</sub> + … + r<sub>12</sub>
            </Formula>
            <p className="text-xs text-gray-500">
              r<sub>0</sub> = Zeit für die ersten 200&nbsp;m, r<sub>1</sub>…r<sub>12</sub> = Zeiten der zwölf vollen Runden.
            </p>
          </section>

          {/* Säule 1 */}
          <section>
            <h4 className="text-lg font-bold text-[#004A9F] mb-3">Säule 1 — Zielzeit-Genauigkeit (max. 10 Punkte)</h4>
            <p className="text-sm mb-2">
              Du legst <strong>vor dem Lauf</strong> selbst eine Zielzeit fest. Bewertet wird die <strong>betragsmäßige</strong>
              {' '}Abweichung in Prozent – zu schnell und zu langsam werden gleich behandelt. Der Bezug auf die Zielzeit
              macht die Bewertung <strong>fair für schnelle wie langsame Läufer*innen</strong> (geschlechtsunabhängig).
            </p>
            <Formula>
              Abweichung [%] = | Zielzeit − Endzeit | ÷ Zielzeit × 100
            </Formula>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border border-gray-200 px-3 py-2 text-left">Abweichung</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">Punkte</th>
                  </tr>
                </thead>
                <tbody>
                  {ZIEL_SCHWELLEN.map(([s, p], i) => (
                    <tr key={i} className={i % 2 ? 'bg-gray-50' : ''}>
                      <td className="border border-gray-200 px-3 py-2">{s}</td>
                      <td className="border border-gray-200 px-3 py-2 font-bold text-[#004A9F]">{p}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg mt-3 text-sm">
              <p className="font-semibold text-amber-900 mb-1">Rechenbeispiel</p>
              <p>Zielzeit 25:00 (= 1500&nbsp;s), Endzeit 25:06 (= 1506&nbsp;s):</p>
              <p className="font-mono mt-1">|1500 − 1506| ÷ 1500 × 100 = 6 ÷ 1500 × 100 = <strong>0,40 %</strong></p>
              <p className="mt-1">0,40&nbsp;% liegt im Bereich „≤ 1 %" → <strong>10 Punkte</strong>.</p>
            </div>
          </section>

          {/* Säule 2 */}
          <section>
            <h4 className="text-lg font-bold text-green-800 mb-3">Säule 2 — Tempokonstanz (max. 5 Punkte)</h4>
            <p className="text-sm mb-2">
              Diese Säule misst, wie <strong>gleichmäßig</strong> du gelaufen bist – der Kern der „Belastungssteuerung".
              Grundlage sind <strong>nur die zwölf vollen 400-m-Runden</strong> (die halbe Runde zählt hier nie; einzelne
              Runden kann die Lehrkraft als „ignoriert" markieren, z.&nbsp;B. nach einem Sturz).
            </p>
            <p className="text-sm mb-1">Schritt 1 — Mittelwert der vollen Rundenzeiten:</p>
            <Formula>µ = (r<sub>1</sub> + r<sub>2</sub> + … + r<sub>n</sub>) ÷ n</Formula>
            <p className="text-sm mb-1">Schritt 2 — Standardabweichung (Populationsformel, Teiler n):</p>
            <Formula>σ = √[ ( (r<sub>1</sub>−µ)² + (r<sub>2</sub>−µ)² + … + (r<sub>n</sub>−µ)² ) ÷ n ]</Formula>
            <p className="text-xs text-gray-500 mb-3">
              Verwendet wird die <strong>Populations-Standardabweichung</strong> (Division durch n, nicht n−1), da alle
              gelaufenen Runden die vollständige Stichprobe bilden. Je kleiner σ, desto gleichmäßiger das Tempo.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-green-50">
                    <th className="border border-gray-200 px-3 py-2 text-left">Standardabw. σ</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">Punkte</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">Bedeutung</th>
                  </tr>
                </thead>
                <tbody>
                  {KONSTANZ_SCHWELLEN.map(([s, p, b], i) => (
                    <tr key={i} className={i % 2 ? 'bg-gray-50' : ''}>
                      <td className="border border-gray-200 px-3 py-2">{s}</td>
                      <td className="border border-gray-200 px-3 py-2 font-bold text-green-700">{p}</td>
                      <td className="border border-gray-200 px-3 py-2 text-xs">{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg mt-3 text-sm">
              <p className="font-semibold text-amber-900 mb-1">Rechenbeispiel</p>
              <p>Vier Runden (vereinfacht): 118, 120, 122, 124&nbsp;s.</p>
              <p className="font-mono mt-1">µ = (118+120+122+124) ÷ 4 = 121&nbsp;s</p>
              <p className="font-mono">σ = √[ (9 + 1 + 1 + 9) ÷ 4 ] = √5 ≈ <strong>2,24&nbsp;s</strong></p>
              <p className="mt-1">2,24&nbsp;s liegt im Bereich „σ ≤ 3&nbsp;s" → <strong>5 Punkte</strong>.</p>
            </div>
          </section>

          {/* Gesamtpunkte & Note */}
          <section>
            <h4 className="text-lg font-bold text-[#004A9F] mb-3">Von Punkten zur Note</h4>
            <p className="text-sm mb-3">
              Die Punkte beider Säulen werden addiert (0–15) und über folgende Tabelle in eine Note übersetzt:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
              {NOTEN.map(([p, n]) => (
                <div key={p} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                  <span className="font-mono text-gray-500">{p} Pkt.</span>
                  <span className="font-bold text-[#004A9F]">{n}</span>
                </div>
              ))}
            </div>
          </section>

          {/* End-to-End-Beispiel */}
          <section>
            <h4 className="text-lg font-bold text-[#004A9F] mb-3">Komplettes Beispiel — von den Rundenzeiten zur Note</h4>
            <p className="text-sm mb-3">Zielzeit <strong>25:00</strong> (= 1500&nbsp;s). Erfasste Zeiten (Sekunden):</p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 px-2 py-1">½</th>
                    {Array.from({ length: 12 }, (_, i) => (
                      <th key={i} className="border border-gray-200 px-2 py-1">{i + 1}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-center font-mono">
                    <td className="border border-gray-200 px-2 py-1">60</td>
                    {[118, 119, 120, 121, 122, 120, 121, 119, 122, 123, 121, 120].map((v, i) => (
                      <td key={i} className="border border-gray-200 px-2 py-1">{v}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li><strong>Endzeit:</strong> 60 + (118+119+…+120) = 60 + 1446 = <strong>1506&nbsp;s = 25:06</strong></li>
              <li><strong>Abweichung:</strong> |1500 − 1506| ÷ 1500 × 100 = 0,40&nbsp;% → <strong>10 Punkte</strong></li>
              <li><strong>Mittelwert</strong> der 12 vollen Runden: 1446 ÷ 12 = 120,5&nbsp;s</li>
              <li><strong>Standardabweichung:</strong> σ = √(23,0 ÷ 12) ≈ 1,38&nbsp;s → <strong>5 Punkte</strong></li>
              <li><strong>Gesamt:</strong> 10 + 5 = <strong>15 Punkte</strong> → <strong>Note 1+</strong></li>
            </ol>
          </section>

          {/* Didaktischer Hintergrund */}
          <section className="bg-blue-50 border-l-4 border-[#004A9F] p-4 rounded-r-lg">
            <p className="text-sm font-semibold text-[#004A9F] mb-1">Warum dieses Modell?</p>
            <p className="text-sm">
              Der Belastungssteuerungslauf bewertet eine zentrale sportwissenschaftliche Kompetenz: die Fähigkeit, eine
              Belastung <strong>realistisch einzuschätzen</strong> (Säule 1) und <strong>gleichmäßig zu steuern</strong>
              {' '}(Säule 2). Beides ist <strong>unabhängig von der absoluten Schnelligkeit</strong> und damit
              geschlechts- und niveauunabhängig fair – Anfänger*innen wie Leistungssportler*innen können die volle
              Punktzahl erreichen.
            </p>
          </section>

        </div>
      )}
    </div>
  )
}

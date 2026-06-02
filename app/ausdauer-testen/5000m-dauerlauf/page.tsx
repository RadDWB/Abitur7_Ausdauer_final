'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface AccordionSection {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
}

const NORMWERTE = [
  [15,'25:15','21:15'],[14,'25:45','21:45'],[13,'26:15','22:15'],
  [12,'26:45','22:45'],[11,'27:30','23:30'],[10,'28:15','24:15'],
  [9,'29:00','25:00'],[8,'30:00','26:00'],[7,'31:00','27:00'],
  [6,'32:00','28:00'],[5,'33:00','29:00'],[4,'34:00','30:00'],
  [3,'35:15','31:15'],[2,'36:30','32:30'],[1,'37:45','33:45'],
] as [number, string, string][];

export default function Dauerlauf5000mInfoPage() {
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({ definition: true });

  const toggleAccordion = (id: string) =>
    setOpenAccordions(prev => ({ ...prev, [id]: !prev[id] }));

  const sections: AccordionSection[] = [
    {
      id: 'definition',
      title: 'Was ist der 5000m Dauerlauf?',
      icon: 'ℹ️',
      content: (
        <div className="space-y-4 text-gray-700">
          <p>
            Der <strong>5000m Dauerlauf</strong> ist eine wettkampfbezogene Prüfungsleistung im Abitur Sport NRW. Im Gegensatz zum Belastungssteuerungslauf wird hier keine Zielzeit geschätzt – es wird die <strong>tatsächlich gelaufene Zeit</strong> gemessen und anhand von Normwerten bewertet.
          </p>
          <h4 className="font-bold text-gray-900 mt-4">Charakteristika:</h4>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li><strong>Distanz:</strong> Exakt 5000 Meter auf der 400m-Bahn</li>
            <li><strong>Bewertung:</strong> Rein zeitbasiert nach Normwerttabelle (nach Geschlecht getrennt)</li>
            <li><strong>Ziel:</strong> So schnell wie möglich laufen</li>
            <li><strong>Energiesystem:</strong> 80–90% aerob, 10–20% anaerob (aerob-anaerobe Schwelle)</li>
          </ul>
          <p className="text-sm text-gray-600 mt-3">
            Die Normwerte stammen aus den offiziellen Vorgaben des Ministeriums für Schule und Bildung NRW (Qua-Lis).
          </p>
        </div>
      ),
    },
    {
      id: 'normwerte',
      title: 'Normwerttabelle & Bewertung',
      icon: '📊',
      content: (
        <div className="space-y-4 text-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm">Die Noten ergeben sich verbindlich aus der folgenden Tabelle. Bei einer Leistung zwischen zwei Tabellenwerten gilt der niedrigere Notenpunktwert.</p>
            <a
              href="https://www.qua-lis.nrw.de/system/files/media/document/file/4734_2_sportpraktische_pruefung_abitur_teil_i_vorgaben_ab_2021.pdf"
              target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 ml-4 text-sm text-blue-600 hover:underline font-semibold"
            >
              📄 Qua-Lis PDF
            </a>
          </div>
          <div className="overflow-auto rounded-lg border border-gray-200">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-blue-50">
                  <th className="px-4 py-3 text-center font-semibold border-b border-gray-200">Notenpunkte</th>
                  <th className="px-4 py-3 text-center font-semibold border-b border-gray-200">Schülerinnen</th>
                  <th className="px-4 py-3 text-center font-semibold border-b border-gray-200">Schüler</th>
                </tr>
              </thead>
              <tbody>
                {NORMWERTE.map(([pts, w, m], i) => (
                  <tr key={pts} className={pts === 11 || pts === 5 ? 'bg-blue-50 font-semibold' : i % 2 === 0 ? '' : 'bg-gray-50'}>
                    <td className="px-4 py-2.5 text-center font-bold border-b border-gray-100">{pts}</td>
                    <td className="px-4 py-2.5 text-center border-b border-gray-100">{w}</td>
                    <td className="px-4 py-2.5 text-center border-b border-gray-100">{m}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400">Quelle: Qua-Lis NRW – Vorgaben Sportpraktische Prüfung Abitur ab 2021</p>
        </div>
      ),
    },
    {
      id: 'ablauf',
      title: 'Testdurchführung',
      icon: '🏃',
      content: (
        <div className="space-y-4 text-gray-700">
          <h4 className="font-bold text-gray-900">Vorbereitung (15–20 Min vorher):</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>5 Min leichtes Joggen</li>
            <li>5–8 Min dynamisches Dehnen (Beinpendel, Ausfallschritte)</li>
            <li>3 × 60m Steigerungsläufe</li>
          </ul>
          <h4 className="font-bold text-gray-900 mt-4">Durchführung:</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li><strong>Start:</strong> Gemeinsamer Start nach Startsignal</li>
            <li><strong>Laufstrecke:</strong> 12,5 Runden auf der 400m-Bahn (Startlinie = Ziellinie)</li>
            <li><strong>Zeitmessung:</strong> Individuell bei Zieleinlauf stoppen</li>
            <li><strong>Bewertung:</strong> Automatisch anhand der Normwerttabelle</li>
          </ol>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-3 mt-4">
            <p className="text-sm font-semibold text-blue-900">💡 Taktik-Tipp:</p>
            <p className="text-sm text-blue-800">Ein gleichmäßiges Tempo über alle Runden ist effizienter als ein zu schneller Start. Berechne deinen Ziel-Split: Zielzeit ÷ 12,5 Runden.</p>
          </div>
        </div>
      ),
    },
    {
      id: 'schueler',
      title: 'Schüler-Information',
      icon: '👤',
      content: (
        <div className="space-y-4 text-gray-700 text-sm">
          <h4 className="font-bold text-gray-900">Orientierungszeiten nach Niveau:</h4>
          <table className="w-full border-collapse mt-2 rounded-lg overflow-hidden border border-gray-200">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-4 py-2 text-left font-semibold">Niveau</th>
                <th className="px-4 py-2 text-left font-semibold">Schülerinnen</th>
                <th className="px-4 py-2 text-left font-semibold">Schüler</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Wenig trainiert', '33:00–37:45', '29:00–33:45'],
                ['Durchschnittlich', '28:15–33:00', '24:15–29:00'],
                ['Gut trainiert', '25:15–28:15', '21:15–24:15'],
              ].map(([n, w, m], i) => (
                <tr key={n} className={i % 2 === 0 ? '' : 'bg-gray-50'}>
                  <td className="px-4 py-2 border-t border-gray-100 font-medium">{n}</td>
                  <td className="px-4 py-2 border-t border-gray-100">{w}</td>
                  <td className="px-4 py-2 border-t border-gray-100">{m}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-3 mt-3">
            <p className="font-semibold text-amber-900">⚠️ Wichtig:</p>
            <p className="text-amber-800">Wer schneller als der 15-Punkte-Wert ist, erhält trotzdem nur 15 Punkte. Wer langsamer als der 1-Punkte-Wert ist, erhält 0 Punkte.</p>
          </div>
        </div>
      ),
    },
    {
      id: 'lehrer',
      title: 'Lehrer-Information',
      icon: '📋',
      content: (
        <div className="space-y-4 text-gray-700 text-sm">
          <h4 className="font-bold text-gray-900">Organisation:</h4>
          <ul className="list-disc list-inside space-y-2">
            <li>Gruppenstart: alle Schüler*innen gleichzeitig oder in kleinen Gruppen</li>
            <li>Zeitmessung: Stoppuhr pro Schüler*in oder digitale Zeitnahme</li>
            <li>Mindestens 1 Helfer für Rundenzeiten / Zieleinlauf</li>
            <li>Bahn markieren: Startlinie klar kennzeichnen</li>
            <li>Witterung: Test bei extremer Hitze verschieben (über 28°C)</li>
          </ul>
          <h4 className="font-bold text-gray-900 mt-4">Rechtliche Grundlage:</h4>
          <p>Die Prüfungsanforderungen sind verbindlich im Erlass des Ministeriums für Schule und Bildung NRW festgelegt:</p>
          <a
            href="https://www.qua-lis.nrw.de/system/files/media/document/file/4734_2_sportpraktische_pruefung_abitur_teil_i_vorgaben_ab_2021.pdf"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:underline font-semibold mt-2"
          >
            📄 Qua-Lis NRW – Sportpraktische Prüfung Abitur (PDF)
          </a>
        </div>
      ),
    },
    {
      id: 'faq',
      title: 'Häufig gestellte Fragen',
      icon: '❓',
      content: (
        <div className="space-y-4 text-gray-700 text-sm">
          <div>
            <p className="font-semibold text-gray-900">F: Woher kommen die Normwerte?</p>
            <p className="mt-1">A: Die Normwerte stammen aus den verbindlichen Vorgaben der Qualitäts- und UnterstützungsAgentur – Landesinstitut für Schule (Qua-Lis) NRW und basieren auf langjährigen Leistungsdaten von Abiturient*innen.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">F: Darf ich zwischendurch gehen?</p>
            <p className="mt-1">A: Nein, beim 5000m Dauerlauf ist kontinuierliches Laufen erforderlich. Kurze Gehphasen führen zu einer schlechteren Zeit und damit zu weniger Punkten.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">F: Wie unterscheidet sich der Dauerlauf vom Belastungssteuerungslauf?</p>
            <p className="mt-1">A: Beim Dauerlauf wird nur die Zeit gemessen – Ziel ist so schnell wie möglich zu laufen. Beim Belastungssteuerungslauf schätzt man vorab eine Zielzeit und wird auch für Tempokonstanz bewertet.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">F: Kann ich den Test mit unserer Schul-App erfassen?</p>
            <p className="mt-1">A: Ja! Nutze die "Ausdauer testen"-Funktion auf dieser Seite – sie enthält eine Stoppuhr, Schülerliste und automatische Berechnung der Notenpunkte.</p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 text-sm">
          <Link href="/" className="text-blue-600 hover:text-blue-700">Zur Homepage</Link>
          {' / '}
          <span className="text-gray-600">5000m Dauerlauf</span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-300 py-8 sm:py-12">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-2">5000m Dauerlauf</h1>
            <p className="text-gray-600">Wettkampfbezogene Ausdauerprüfung – NRW Abitur Sport</p>
          </div>
          <a
            href="https://www.qua-lis.nrw.de/system/files/media/document/file/4734_2_sportpraktische_pruefung_abitur_teil_i_vorgaben_ab_2021.pdf"
            target="_blank" rel="noopener noreferrer"
            className="flex-shrink-0 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
          >
            📄 Offizielle Vorgaben (Qua-Lis PDF)
          </a>
        </div>
      </div>

      {/* Accordions */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="space-y-3">
          {sections.map(section => (
            <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleAccordion(section.id)}
                className={`w-full px-6 py-4 flex items-center justify-between font-semibold transition-colors ${
                  openAccordions[section.id]
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-2xl">{section.icon}</span>
                  {section.title}
                </span>
                <span className={`transform transition-transform ${openAccordions[section.id] ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {openAccordions[section.id] && (
                <div className="px-6 py-6 bg-white border-t border-gray-200">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap gap-4">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-semibold">
            ← Zurück zur Homepage
          </Link>
          <Link
            href="/ausdauer-testen/testauswahl?test=5000m-dauerlauf"
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold"
          >
            ▶ Test starten
          </Link>
        </div>
      </div>
    </main>
  );
}

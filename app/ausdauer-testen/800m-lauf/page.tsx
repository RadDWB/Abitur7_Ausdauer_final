'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface AccordionSection {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
}

export default function Lauf800mPage() {
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    definition: true,
  });

  const toggleAccordion = (id: string) => {
    setOpenAccordions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const sections: AccordionSection[] = [
    {
      id: 'definition',
      title: 'Was ist der 800m Lauf?',
      icon: 'ℹ️',
      content: (
        <div className="space-y-4 text-gray-700">
          <p>
            Der <strong>800m Lauf</strong> ist eine olympische Mittelstreckendisziplin und gilt als eine der anspruchsvollsten Ausdauerdisziplinen im Schulsport. Die Distanz von 800 Metern erfordert eine optimale Kombination aus <strong>Schnelligkeit und Ausdauer</strong>.
          </p>
          <h4 className="font-bold text-gray-900 mt-4">Charakteristika:</h4>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li><strong>Distanz:</strong> 800 Meter (2 Runden auf einer 400m-Bahn)</li>
            <li><strong>Energiesysteme:</strong> Ca. 60–70% aerob, 30–40% anaerob</li>
            <li><strong>Typische Zeiten Schüler:</strong> 2:00–3:30 min</li>
            <li><strong>Typische Zeiten Schülerinnen:</strong> 2:20–4:00 min</li>
            <li><strong>Weltrekord Männer:</strong> 1:40,91 min (David Rudisha, 2012)</li>
            <li><strong>Weltrekord Frauen:</strong> 1:53,28 min (Jarmila Kratochvílová, 1983)</li>
          </ul>
          <p className="text-sm text-gray-600 mt-4">
            <strong>Energiestoffwechsel:</strong> Beim 800m-Lauf wird sowohl das aerobe als auch das anaerobe Laktat-System intensiv beansprucht – eine besondere Herausforderung für den Körper.
          </p>
        </div>
      )
    },
    {
      id: 'zweck',
      title: 'Ziele und Bedeutung im Schulsport',
      icon: '🎯',
      content: (
        <div className="space-y-4 text-gray-700">
          <h4 className="font-bold text-gray-900">Warum der 800m-Lauf?</h4>
          <div className="space-y-3 text-sm">
            <div>
              <h5 className="font-semibold text-gray-900">1. Diagnostik der Mittelstreckenausdauer</h5>
              <p>Der 800m-Lauf liefert zuverlässige Daten über die aerob-anaerobe Leistungsfähigkeit von Schüler*innen.</p>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900">2. Taktisches Denken fördern</h5>
              <p>Schüler*innen müssen Energie einteilen – zu schneller Start führt zu einem starken Einbruch in der zweiten Runde.</p>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900">3. Motorische Entwicklung</h5>
              <p>Koordination, Lauftechnik und Atemrhythmus werden trainiert und bewertet.</p>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900">4. Abiturrelevanz</h5>
              <p>In NRW ist der 800m-Lauf ein anerkannter Ausdauertest im Abitur Sport Leistungskurs.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ablauf',
      title: 'Testdurchführung',
      icon: '🏃',
      content: (
        <div className="space-y-4 text-gray-700">
          <h4 className="font-bold text-gray-900">Vorbereitung:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>10–15 Min Aufwärmen (Joggen, Dehnen, Steigerungsläufe)</li>
            <li>Startaufstellung: Schüler*innen in Startreihen eingeteilt</li>
            <li>Startschuss oder akustisches Signal</li>
          </ul>
          <h4 className="font-bold text-gray-900 mt-4">Durchführung:</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li><strong>Start:</strong> Hochstart oder Tiefstart, erstes 100m-Tempo bewusst steuern</li>
            <li><strong>Runde 1 (400m):</strong> Kontrolliertes Tempo, ca. 52–55% der Gesamtleistung</li>
            <li><strong>Runde 2 (400m):</strong> Steigerung ab 300m vor Schluss, Endspurt im letzten 100m</li>
            <li><strong>Ziel:</strong> Zeitmessung stoppt bei Überschreiten der Ziellinie</li>
          </ol>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-3 mt-4">
            <p className="text-sm font-semibold text-blue-900">💡 Taktik-Tipp:</p>
            <p className="text-sm text-blue-800">Erste Runde ca. 2–3 Sekunden langsamer als Ziel-Split laufen, dann in der zweiten Runde steigern. Ein gleichmäßiges Tempo ist effizienter als ein zu schneller Beginn.</p>
          </div>
        </div>
      )
    },
    {
      id: 'schueler-info',
      title: 'Schüler-Information',
      icon: '👤',
      content: (
        <div className="space-y-4 text-gray-700 text-sm">
          <h4 className="font-bold text-gray-900">Was du wissen musst:</h4>
          <ul className="list-disc list-inside space-y-2">
            <li>Der 800m-Lauf dauert in der Regel 2–4 Minuten – vollständige Ausbelastung!</li>
            <li>Anaerobe Kapazität ist entscheidend: Laktattoleranz trainieren</li>
            <li>Lauftechnik: hohe Kniehebefrequenz, entspannte Arme, aufrechter Oberkörper</li>
            <li>Atemrhythmus: 2-2 oder 3-2 Schritte pro Atemzug</li>
          </ul>
          <h4 className="font-bold text-gray-900 mt-4">Orientierungszeiten:</h4>
          <table className="w-full text-sm border-collapse mt-2">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-gray-200 px-3 py-2 text-left">Niveau</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Schüler (m)</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Schülerinnen (w)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-3 py-2">Einsteiger</td>
                <td className="border border-gray-200 px-3 py-2">3:00–3:30</td>
                <td className="border border-gray-200 px-3 py-2">3:30–4:00</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-200 px-3 py-2">Durchschnitt</td>
                <td className="border border-gray-200 px-3 py-2">2:20–3:00</td>
                <td className="border border-gray-200 px-3 py-2">2:45–3:30</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-3 py-2">Gut trainiert</td>
                <td className="border border-gray-200 px-3 py-2">2:00–2:20</td>
                <td className="border border-gray-200 px-3 py-2">2:20–2:45</td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    },
    {
      id: 'lehrer-info',
      title: 'Lehrer-Information',
      icon: '📋',
      content: (
        <div className="space-y-4 text-gray-700 text-sm">
          <h4 className="font-bold text-gray-900">Organisationshinweise:</h4>
          <ul className="list-disc list-inside space-y-2">
            <li>Gruppenstart: max. 6–8 Schüler*innen gleichzeitig empfohlen</li>
            <li>Zeitmessung: Stoppuhr oder elektronische Zeitnahme</li>
            <li>Mindestens 2 Helfer für Rundenzeiten und Zieleinlauf</li>
            <li>Bahn: 400m-Laufbahn oder vermessene Strecke</li>
            <li>Sicherheit: Schüler*innen mit gesundheitlichen Einschränkungen vorher prüfen</li>
          </ul>
          <h4 className="font-bold text-gray-900 mt-4">Trainingshinweise:</h4>
          <ul className="list-disc list-inside space-y-2">
            <li>Intervalltraining: 4–8 × 200m mit kurzer Pause (60–90 Sek.)</li>
            <li>Tempoläufe: 2–3 × 400m im Renntempo</li>
            <li>Grundlagenausdauer: regelmäßiges 20–30 Min Dauerlaufen</li>
          </ul>
        </div>
      )
    },
    {
      id: 'bewertung',
      title: 'Bewertung & Normwerte',
      icon: '📊',
      content: (
        <div className="space-y-4 text-gray-700 text-sm">
          <p>Die Bewertung des 800m-Laufs erfolgt nach erreichten Zeiten, getrennt nach Geschlecht und Altersgruppe.</p>
          <h4 className="font-bold text-gray-900 mt-2">Orientierungsnoten (Schüler, Jgst. 11–13):</h4>
          <table className="w-full border-collapse mt-2">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-gray-200 px-3 py-2 text-left">Note</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Zeit (m)</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Zeit (w)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['1 (sehr gut)', '< 2:10', '< 2:35'],
                ['2 (gut)', '2:10–2:25', '2:35–2:55'],
                ['3 (befriedigend)', '2:25–2:45', '2:55–3:15'],
                ['4 (ausreichend)', '2:45–3:05', '3:15–3:40'],
                ['5 (mangelhaft)', '> 3:05', '> 3:40'],
              ].map(([note, m, w], i) => (
                <tr key={i} className={i % 2 === 0 ? '' : 'bg-gray-50'}>
                  <td className="border border-gray-200 px-3 py-2">{note}</td>
                  <td className="border border-gray-200 px-3 py-2">{m}</td>
                  <td className="border border-gray-200 px-3 py-2">{w}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-500 mt-2">* Orientierungswerte – genaue Normwerte je nach Schule und Bundesland variieren.</p>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-3 mt-4">
            <p className="text-sm font-semibold text-blue-900">Woher kommen die Normwerte?</p>
            <p className="text-sm text-blue-800">Die Normwerte basieren auf großangelegten Studien der Deutschen Vereinigung für Sportwissenschaft (dvs) sowie den KMK-Sportempfehlungen. Sie spiegeln die durchschnittliche Leistungsfähigkeit von Schüler*innen der jeweiligen Altersgruppe wider und werden regelmäßig überprüft und aktualisiert.</p>
          </div>
        </div>
      )
    },
    {
      id: 'faq',
      title: 'Häufig gestellte Fragen',
      icon: '❓',
      content: (
        <div className="space-y-4 text-gray-700 text-sm">
          <div>
            <p className="font-semibold text-gray-900">F: Wie trainiere ich am besten für den 800m-Lauf?</p>
            <p>A: Kombiniere Intervalltraining (200–400m schnell), Grundlagenausdauer (30 Min ruhig laufen) und gelegentliche Tempoläufe über 600m im Renntempo.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">F: Darf ich auch gehen?</p>
            <p>A: Im Wettkampf ist kontinuierliches Laufen vorgeschrieben. Im Schultest kann die Lehrkraft Ausnahmen bei gesundheitlichen Einschränkungen genehmigen.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">F: Wie wichtig ist der Start?</p>
            <p>A: Sehr wichtig! Ein zu schneller Start führt zu massivem Laktatanstieg und einem starken Einbruch in Runde 2. Kontrolliert starten!</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">F: Was tun bei Seitenstechen?</p>
            <p>A: Tempo reduzieren, tief in den Bauch atmen, auf die schmerzende Seite drücken. Vorbeugung: 2 Stunden vor dem Test nichts mehr essen.</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 text-sm">
          <Link href="/" className="text-blue-600 hover:text-blue-700">Zur Homepage</Link>
          {' / '}
          <span className="text-gray-600">800m Lauf</span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-300 py-8 sm:py-12">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl font-bold text-blue-700 mb-4">
            800m Lauf
          </h1>
          <p className="text-gray-700 text-lg">
            Lerne alles Wichtige über Ablauf, Bewertung und erfolgreiche Durchführung des 800m-Mittelstreckenlaufs
          </p>
        </div>
      </div>

      {/* Accordions */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="space-y-3">
          {sections.map((section) => (
            <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
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
                <span className={`transform transition-transform ${openAccordions[section.id] ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {openAccordions[section.id] && (
                <div className="px-6 py-6 bg-white border-t border-gray-200">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex gap-6">
          <Link href="/" className="inline-block text-blue-600 hover:text-blue-700 font-semibold">
            ← Zurück zur Homepage
          </Link>
          <a
            href="https://800m.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold"
          >
            🏅 Test starten →
          </a>
        </div>
      </div>
    </main>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import BewertungErklaerung from '../../../components/BewertungErklaerung';

interface AccordionSection {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
}

const iconComponents: Record<string, React.ReactNode> = {
  overview: (
    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  ablauf: (
    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  'schueler-info': (
    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  'lehrer-info': (
    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17.25m20-11.002c5.5 0 10 4.745 10 10.002M12 6.253c5.5 0 10 4.745 10 10.002M12 19.253v.003" />
    </svg>
  ),
  bewertung: (
    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
  faq: (
    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export default function BelastungssteuerungslaufPage() {
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    overview: true,
  });

  const toggleAccordion = (id: string) => {
    setOpenAccordions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const sections: AccordionSection[] = [
    {
      id: 'overview',
      title: 'Überblick: Was & Wofür',
      icon: '📚',
      content: (
        <div className="space-y-6 text-gray-700">
          {/* WAS IST DAS? */}
          <div>
            <h4 className="text-lg font-bold text-[#004A9F] mb-3">Was ist der Belastungssteuerungslauf?</h4>
            <p className="mb-3">
              Der <strong>Belastungssteuerungslauf 5000m</strong> ist ein standardisiertes Ausdauer-Prüfungsformat im schulischen Sportunterricht. Es handelt sich um einen <strong>selbstgesteuerten Langstreckenlauf</strong>, bei dem die Schüler*innen eine zu Beginn der Prüfung selbst festgelegte Zielzeit über eine Distanz von genau 5000 Metern einzuhalten versuchen.
            </p>

            <div className="bg-blue-50 border-l-4 border-[#004A9F] p-4 rounded-r-lg mb-4">
              <h5 className="font-bold text-[#004A9F] mb-2">Besonderheiten:</h5>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Selbstbestimmte Zielzeit:</strong> Du legst die angestrebte Zeit selbst fest</li>
                <li><strong>Feste Distanz:</strong> Exakt 5000 Meter (0,5 Runde + 12 volle Runden)</li>
                <li><strong>Tempokontrolle:</strong> Der Test misst nicht nur die Gesamtleistung, sondern auch die Fähigkeit zur Belastungssteuerung</li>
                <li><strong>Duale Bewertung:</strong> Abweichung von Zielzeit + Tempokonstanz</li>
              </ul>
            </div>

            <p className="text-sm text-gray-600">
              <strong>Wissenschaftlicher Hintergrund:</strong> Der Test basiert auf modernen sportwissenschaftlichen Erkenntnissen über die <strong>Belastungssteuerung im Sport</strong> – die Fähigkeit, Trainingsintensität gezielt zu regulieren.
            </p>
          </div>

          <hr className="my-4 border-gray-300" />

          {/* WOFÜR WIRD DER TEST VERWENDET? */}
          <div>
            <h4 className="text-lg font-bold text-[#004A9F] mb-3">Wofür wird der Test verwendet?</h4>

            <div className="space-y-3">
              <div className="bg-white border-l-4 border-green-500 p-4 rounded-r-lg hover:shadow-sm transition-shadow">
                <h5 className="font-semibold text-gray-900">1. Ausdauerleistungsfähigkeit messen</h5>
                <p className="text-sm text-gray-600">Der 5000m-Lauf erfasst die aerob-anaerobe Leistungsfähigkeit – eine Grundvoraussetzung für Gesundheit und sportliche Leistung.</p>
              </div>

              <div className="bg-white border-l-4 border-blue-500 p-4 rounded-r-lg hover:shadow-sm transition-shadow">
                <h5 className="font-semibold text-gray-900">2. Tempokontroll-Fähigkeit diagnostizieren</h5>
                <p className="text-sm text-gray-600">Ein zentrales Trainingsprinzip: Der Test bewertet nicht nur "wie schnell?", sondern "wie gleichmäßig?" – das ist realistisches Trainingsverhalten.</p>
              </div>

              <div className="bg-white border-l-4 border-purple-500 p-4 rounded-r-lg hover:shadow-sm transition-shadow">
                <h5 className="font-semibold text-gray-900">3. Motorische Lernziele</h5>
                <p className="text-sm text-gray-600">Du lernst Selbsteinschätzung, realistische Zieletzung, und Belastungsregulation.</p>
              </div>

              <div className="bg-white border-l-4 border-orange-500 p-4 rounded-r-lg hover:shadow-sm transition-shadow">
                <h5 className="font-semibold text-gray-900">4. Individuelle Leistungserbringung & Geschlechtsunabhängigkeit</h5>
                <p className="text-sm text-gray-600">Durch die freie Zielzeitwahl können Anfänger und Leistungssportler am gleichen Test teilnehmen und angemessen bewertet werden.</p>
                <p className="text-sm text-gray-600 mt-2"><strong>Genderunabhängig überprüfbar:</strong> Jungen wie Mädchen zeigen hier geschlechterunabhängig die Fähigkeit, die Belastung zu steuern. Der Test misst nicht absolute Schnelligkeit, sondern die Fähigkeit zur Tempokontrolle und Belastungsregulation – Kompetenzen, die geschlechtsunabhängig sind.</p>
              </div>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-600 p-4 rounded-r-lg mt-4">
              <p className="text-sm text-gray-700">
                <strong>⚡ Energieverteilung beim 5000m-Lauf:</strong> 80-90% aerobe Energiebereitstellung (Sauerstoffnutzung), 10-20% anaerobe (Laktat-Produktion). Dies entspricht einem Training in der aerob-anaeroben Schwelle – hocheffektiv für Entwicklung!
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ablauf',
      title: 'Wie läuft der Test ab?',
      icon: '🏃',
      content: (
        <div className="space-y-4 text-gray-700">
          <h4 className="font-bold text-gray-900">Vorbereitung (15-30 Min vorher):</h4>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li><strong>Aufwärmen:</strong> 5 Min leichtes Joggen, 5-8 Min dynamische Dehnübungen, 3×60m Steigerungen</li>
            <li><strong>Zielzeitfestlegung:</strong> Realistische Zeit wählen (nicht zu ambitioniert!)</li>
            <li><strong>Mentale Vorbereitung:</strong> Strategie besprechen, sich beruhigen</li>
          </ul>

          <h4 className="font-bold text-gray-900 mt-4">Durchführung:</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li><strong>Start:</strong> Zeitmessung beginnt, du startest mit angestrebtem Tempo</li>
            <li><strong>Rundenzeiten erfassen:</strong> Nach jeder Runde wird die Zeit gemessen und notiert</li>
            <li><strong>Laufstrecke:</strong> 0,5 Runde (200m) + 12 volle Runden (4.800m) = 5000m</li>
            <li><strong>Konstantes Tempo halten:</strong> Ziel ist gleichmäßiges Laufen über alle Runden</li>
            <li><strong>Zieleinlauf:</strong> Bei 5000m: Zeitmessung stoppt, Endzeit dokumentiert</li>
          </ol>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-3 mt-4">
            <p className="text-sm font-semibold text-blue-900">💡 Pro-Tipp:</p>
            <p className="text-sm text-blue-800">Wenn deine Zielzeit 25:00 ist, sollte jede Runde ca. 120 Sekunden (2:00) dauern. Merke dir diese Zeit und überprüfe dein Tempo!</p>
          </div>
        </div>
      )
    },
    {
      id: 'schueler-info',
      title: 'Schüler Information',
      icon: '👤',
      content: (
        <div className="space-y-4 text-gray-700">
          <h4 className="font-bold text-gray-900">Anforderungen:</h4>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Aerobe Grundlagenausdauer (Fähigkeit, 20+ min zu laufen)</li>
            <li>Verletzungsfreiheit</li>
            <li>Realistische Selbsteinschätzung</li>
            <li>Motivation und mentale Ausdauer</li>
          </ul>

          <h4 className="font-bold text-gray-900 mt-4">Zielzeitfestlegung – Das ist essentiell!</h4>
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">Wenig trainiert</td>
                <td className="p-2">28-32 Minuten</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Durchschnittlich trainiert</td>
                <td className="p-2">24-28 Minuten</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Gut trainiert</td>
                <td className="p-2">20-24 Minuten</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Sehr gut trainiert</td>
                <td className="p-2">&lt;20 Minuten</td>
              </tr>
            </tbody>
          </table>

          <div className="bg-red-50 border-l-4 border-red-600 p-3 mt-4">
            <p className="text-sm font-semibold text-red-900">⚠️ Warnung:</p>
            <p className="text-sm text-red-800">Eine zu ehrgeizige Zielzeit führt zu Abweichungen und schlechteren Konstanz-Werten!</p>
          </div>

          <h4 className="font-bold text-gray-900 mt-4">Trainingsvorbereitung (4-6 Wochen):</h4>
          <div className="bg-gray-50 p-3 rounded text-sm">
            <p><strong>Woche 1-2:</strong> Aerobe Grundlage - 2× Dauerlauf 20-25 min, 1× Intervall</p>
            <p><strong>Woche 3-4:</strong> Spezifisches Training - 1× 5km-Testverlauf, 1× Tempolauf</p>
            <p><strong>Woche 5:</strong> Wettkampf-Simulation - Einmaliger 5000m-Test mit Zeitmessung</p>
            <p><strong>Woche 6:</strong> Regeneration - Reduziertes Training, kurze Einheiten</p>
          </div>

          <h4 className="font-bold text-gray-900 mt-4">Häufige Fehler vermeiden:</h4>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>❌ Zu ambitionierte Zielzeit → Schlechte Ergebnisse</li>
            <li>❌ Unausgeruhter Start → Schlechte Leistung</li>
            <li>❌ Zu schneller Start → Kann nicht halten</li>
            <li>❌ Keine Vorbereitung → Test-Scheitern</li>
          </ul>
        </div>
      )
    },
    {
      id: 'lehrer-info',
      title: 'Lehrer Information',
      icon: '📝',
      content: (
        <div className="space-y-4 text-gray-700">
          <h4 className="font-bold text-gray-900">Sicherheitsaspekte:</h4>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Kontinuierliche Aufsicht erforderlich</li>
            <li>Mindestzahl 2 Betreuungspersonen bei &gt;8 Läufern</li>
            <li>Erste-Hilfe-Set verfügbar halten</li>
            <li>Streckensicherung und klare Markierungen</li>
            <li>Angemessenes Aufwärmen vor Test (15 Min)</li>
          </ul>

          <h4 className="font-bold text-gray-900 mt-4">Zeitmessung:</h4>
          <p className="text-sm">Digitale Stoppuhren oder Smartphone-Apps sind beste Wahl. Genauigkeit ±0,1 Sekunden. Mindestens 2 Messhilfer erforderlich für präzise Rundenzeiterfassung.</p>

          <h4 className="font-bold text-gray-900 mt-4">Organisatorischer Zeitplan (2-3 Std):</h4>
          <div className="bg-gray-50 p-3 rounded text-sm space-y-1">
            <p>14:00-14:15 - Eintreffen, Umziehen</p>
            <p>14:15-14:30 - Aufwärmen und Erklärung</p>
            <p>14:30-14:35 - Zielzeitfestlegung</p>
            <p>14:40-15:10 - Test Gruppe 1 (5 Läufer)</p>
            <p>15:10-15:40 - Test Gruppe 2 (5 Läufer)</p>
            <p>15:40-16:00 - Abkühlen, Auswertung, Feedback</p>
          </div>

          <h4 className="font-bold text-gray-900 mt-4">Checkliste Ausrüstung:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>☐ Digitale Stoppuhren (mindestens 2)</li>
            <li>☐ Dokumentations-Formulare</li>
            <li>☐ Erste-Hilfe-Set</li>
            <li>☐ Wasser-Station</li>
            <li>☐ Markierungshütchen</li>
          </ul>
        </div>
      )
    },
    {
      id: 'bewertung',
      title: 'Bewertung',
      icon: '⭐',
      content: (
        <div className="space-y-4 text-gray-700">
          <p className="text-sm">
            Die Note des Belastungssteuerungslaufs hängt <strong>nicht von der absoluten Zeit oder vom Geschlecht</strong> ab,
            sondern allein davon, wie genau du deine selbst gewählte Zielzeit triffst und wie gleichmäßig du läufst.
            Wie das im Detail berechnet wird, erklärt der folgende Abschnitt:
          </p>

          <BewertungErklaerung defaultOpen />
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
            <p className="font-semibold text-gray-900">F: Kann ich auch gehen?</p>
            <p className="text-sm">A: Ja, schnelles Gehen ist ausdrücklich erlaubt! Da das Tempo selbst bestimmt wird, kannst du auch eine Gehgeschwindigkeit als Zielzeit einplanen und diese dann konstant einhalten.</p>
          </div>

          <div>
            <p className="font-semibold text-gray-900">F: Was passiert, wenn ich meine Zielzeit nicht schaffe?</p>
            <p className="text-sm">A: Das ist völlig normal! Eine 1-3% Abweichung ist sehr realistisch und gibt noch gute Punkte.</p>
          </div>

          <div>
            <p className="font-semibold text-gray-900">F: Sollte ich schneller oder langsamer starten?</p>
            <p className="text-sm">A: GLEICH! Starten Sie mit der gleichen Geschwindigkeit wie die mittleren Runden.</p>
          </div>

          <div>
            <p className="font-semibold text-gray-900">F: Was ist eine gute Standardabweichung?</p>
            <p className="text-sm">A: Unter 5 Sekunden ist sehr gut, 5-8 Sekunden ist noch gut, über 10 Sekunden ist problematisch.</p>
          </div>

          <div>
            <p className="font-semibold text-gray-900">F: Ich bin schwach im Laufen – bekomme ich schlechte Noten?</p>
            <p className="text-sm">A: NEIN! Das Schöne am Belastungssteuerungslauf: Wenn Sie realistisch trainiert, ehrlich Zielzeit gewählt und konstant gelaufen sind, bekommen Sie gute Noten, auch wenn Sie "langsam" sind!</p>
          </div>

          <div>
            <p className="font-semibold text-gray-900">F: Wie lange sollte das Aufwärmen sein?</p>
            <p className="text-sm">A: Mindestens 15 Minuten, idealerweise 20: 5 Min leichtes Joggen, 5-8 Min dynamische Dehnübungen, 3×60m Steigerungen.</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <nav className="bg-gray-100 border-b border-gray-300">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <a href="https://lp-2-tan.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-6 h-6 rounded-full bg-[#004A9F] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">🏃</div>
            <span className="font-semibold text-gray-700 text-sm sm:text-base">AUSDAUER-LAB</span>
            <span className="hidden sm:inline font-semibold text-gray-500">M05 - Ausdauertests</span>
          </a>
          <nav className="flex items-center gap-3 sm:gap-6">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 hidden sm:inline">Zur Homepage</Link>
            <Link href="/ausdauer-testen/5000m-dauerlauf#sicherheit" className="text-sm font-semibold text-red-600 hover:text-red-700 flex items-center gap-1">
              🩺 <span className="hidden xs:inline sm:inline">Sicherheit &amp; Gesundheit</span>
            </Link>
          </nav>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white border-b border-gray-300 py-8 sm:py-12">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl font-bold text-blue-700 mb-4">
            Belastungssteuerungslauf 5000m
          </h1>
          <p className="text-gray-700 text-lg">
            Lerne alles Wichtige über Ablauf, Bewertung und erfolgreiche Durchführung
          </p>
        </div>
      </div>

      {/* Accordions */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`rounded-xl border-2 transition-all overflow-hidden shadow-sm ${
                openAccordions[section.id]
                  ? 'border-[#004A9F] bg-white shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleAccordion(section.id)}
                className={`w-full px-6 py-5 flex items-center justify-between font-semibold transition-all ${
                  openAccordions[section.id]
                    ? 'bg-gradient-to-r from-[#004A9F] to-[#003a7a] text-white'
                    : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-900 hover:from-gray-100 hover:to-gray-150'
                }`}
              >
                <span className="flex items-center gap-3 text-lg">
                  <span className="flex items-center justify-center">{iconComponents[section.id]}</span>
                  <span>{section.title}</span>
                </span>
                <span className={`transform transition-transform duration-200 text-xl ${openAccordions[section.id] ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {/* Accordion Content */}
              {openAccordions[section.id] && (
                <div className="px-6 py-8 bg-white border-t-2 border-[#004A9F] animate-in fade-in duration-200">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Back */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/"
            className="inline-block text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Zurück zur Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}

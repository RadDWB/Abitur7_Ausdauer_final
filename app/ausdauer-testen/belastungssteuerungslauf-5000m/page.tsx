'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface AccordionSection {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
}

export default function BelastungssteuerungslaufPage() {
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
      title: 'Was ist das?',
      icon: 'ℹ️',
      content: (
        <div className="space-y-4 text-gray-700">
          <p>
            Der <strong>Belastungssteuerungslauf 5000m</strong> ist ein standardisiertes Ausdauer-Prüfungsformat im schulischen Sportunterricht. Es handelt sich um einen <strong>selbstgesteuerten Langstreckenlauf</strong>, bei dem die Schüler*innen eine zu Beginn der Prüfung selbst festgelegte Zielzeit über eine Distanz von genau 5000 Metern einzuhalten versuchen.
          </p>

          <h4 className="font-bold text-gray-900 mt-4">Besonderheiten:</h4>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Selbstbestimmte Zielzeit:</strong> Du legst die angestrebte Zeit selbst fest</li>
            <li><strong>Feste Distanz:</strong> Exakt 5000 Meter (0,5 Runde + 12 volle Runden)</li>
            <li><strong>Tempokontrolle:</strong> Der Test misst nicht nur die Gesamtleistung, sondern auch die Fähigkeit zur Belastungssteuerung</li>
            <li><strong>Duale Bewertung:</strong> Abweichung von Zielzeit + Tempokonstanz</li>
          </ul>

          <p className="text-sm text-gray-600 mt-4">
            <strong>Wissenschaftlicher Hintergrund:</strong> Der Test basiert auf modernen sportwissenschaftlichen Erkenntnissen über die <strong>Belastungssteuerung im Sport</strong> – die Fähigkeit, Trainingsintensität gezielt zu regulieren.
          </p>
        </div>
      )
    },
    {
      id: 'zweck',
      title: 'Wofür wird der Test verwendet?',
      icon: '🎯',
      content: (
        <div className="space-y-4 text-gray-700">
          <h4 className="font-bold text-gray-900">Primäre Ziele im Schulsport:</h4>

          <div className="space-y-3">
            <div>
              <h5 className="font-semibold text-gray-900">1. Ausdauerleistungsfähigkeit messen</h5>
              <p className="text-sm">Der 5000m-Lauf erfasst die aerob-anaerobe Leistungsfähigkeit – eine Grundvoraussetzung für Gesundheit und sportliche Leistung.</p>
            </div>

            <div>
              <h5 className="font-semibold text-gray-900">2. Tempokontroll-Fähigkeit diagnostizieren</h5>
              <p className="text-sm">Ein zentrales Trainingsprinzip: Der Test bewertet nicht nur "wie schnell?", sondern "wie gleichmäßig?" – das ist realistisches Trainingsverhalten.</p>
            </div>

            <div>
              <h5 className="font-semibold text-gray-900">3. Motorische Lernziele</h5>
              <p className="text-sm">Du lernst Selbsteinschätzung, realistische Zieletzung, und Belastungsregulation.</p>
            </div>

            <div>
              <h5 className="font-semibold text-gray-900">4. Curriculare Integration</h5>
              <p className="text-sm">Der Test ist in Abiturprüfungen integriert und dient als Leistungsnachweis.</p>
            </div>

            <div>
              <h5 className="font-semibold text-gray-900">5. Individuelle Leistungserbringung</h5>
              <p className="text-sm">Durch die freie Zielzeitwahl können Anfänger und Leistungssportler am gleichen Test teilnehmen und angemessen bewertet werden.</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 mt-4">
            <strong>Energieverteilung beim 5000m-Lauf:</strong> 80-90% aerobe Energiebereitstellung (Sauerstoffnutzung), 10-20% anaerobe (Laktat-Produktion). Dies entspricht einem Training in der aerob-anaeroben Schwelle – hocheffektiv für Entwicklung!
          </p>
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
      icon: '👨‍🏫',
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
      title: 'Normwerte & Bewertung',
      icon: '⭐',
      content: (
        <div className="space-y-4 text-gray-700">
          <h4 className="font-bold text-gray-900">Normwerte Jungen/Männer (Klasse 11-12):</h4>
          <table className="w-full text-sm border-collapse mb-4">
            <tbody>
              <tr className="border-b bg-blue-50">
                <td className="p-2 font-semibold">Sehr gut</td>
                <td className="p-2">18:00-20:00</td>
                <td className="p-2">Note 1-2</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Gut</td>
                <td className="p-2">20:00-22:00</td>
                <td className="p-2">Note 2-3</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Befriedigend</td>
                <td className="p-2">22:00-24:00</td>
                <td className="p-2">Note 3-4</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Ausreichend</td>
                <td className="p-2">24:00-26:00</td>
                <td className="p-2">Note 4-5</td>
              </tr>
            </tbody>
          </table>

          <h4 className="font-bold text-gray-900">Normwerte Mädchen/Frauen (Klasse 11-12):</h4>
          <table className="w-full text-sm border-collapse mb-4">
            <tbody>
              <tr className="border-b bg-blue-50">
                <td className="p-2 font-semibold">Sehr gut</td>
                <td className="p-2">20:00-22:00</td>
                <td className="p-2">Note 1-2</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Gut</td>
                <td className="p-2">22:00-24:00</td>
                <td className="p-2">Note 2-3</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Befriedigend</td>
                <td className="p-2">24:00-26:00</td>
                <td className="p-2">Note 3-4</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Ausreichend</td>
                <td className="p-2">26:00-28:00</td>
                <td className="p-2">Note 4-5</td>
              </tr>
            </tbody>
          </table>

          <h4 className="font-bold text-gray-900">Bewertungskriterium 1: Zielzeit-Genauigkeit (max. 10 Punkte)</h4>
          <table className="w-full text-sm border-collapse mb-4">
            <tbody>
              <tr className="border-b">
                <td className="p-2">≤1%</td>
                <td className="p-2 font-semibold">10 Punkte</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">≤2%</td>
                <td className="p-2 font-semibold">9 Punkte</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">≤3%</td>
                <td className="p-2 font-semibold">8 Punkte</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">≤5%</td>
                <td className="p-2 font-semibold">6 Punkte</td>
              </tr>
              <tr>
                <td className="p-2">&gt;10%</td>
                <td className="p-2 font-semibold">1 Punkt</td>
              </tr>
            </tbody>
          </table>

          <h4 className="font-bold text-gray-900">Bewertungskriterium 2: Tempokonstanz (max. 5 Punkte)</h4>
          <table className="w-full text-sm border-collapse mb-4">
            <tbody>
              <tr className="border-b">
                <td className="p-2">≤3 Sekunden</td>
                <td className="p-2 font-semibold">5 Punkte</td>
                <td className="p-2 text-xs">Perfekt</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">3-6 Sekunden</td>
                <td className="p-2 font-semibold">4 Punkte</td>
                <td className="p-2 text-xs">Gut</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">6-9 Sekunden</td>
                <td className="p-2 font-semibold">3 Punkte</td>
                <td className="p-2 text-xs">Befriedigend</td>
              </tr>
              <tr>
                <td className="p-2">&gt;12 Sekunden</td>
                <td className="p-2 font-semibold">1 Punkt</td>
                <td className="p-2 text-xs">Schwach</td>
              </tr>
            </tbody>
          </table>

          <h4 className="font-bold text-gray-900">Gesamtnote:</h4>
          <p className="text-sm mb-2"><strong>Zielzeit-Punkte (0-10) + Konstanz-Punkte (0-5) = Gesamtpunkte (0-15)</strong></p>
          <div className="bg-gray-50 p-3 rounded text-sm">
            <p>15 = 1+ | 14 = 1 | 13 = 1- | 12 = 2+ | 11 = 2 | 10 = 2- | 9 = 3+</p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-3 mt-4">
            <p className="text-sm font-semibold text-blue-900">Woher kommen die Normwerte?</p>
            <p className="text-sm text-blue-800">Die Normwerte des Belastungssteuerungslaufs basieren auf den Richtlinien des Ministeriums für Schule und Bildung NRW sowie den Qualis-Empfehlungen für den Sport-Abitur in Nordrhein-Westfalen. Sie wurden aus langjährigen Leistungsdaten von Schüler*innen der Oberstufe ermittelt und spiegeln realistische Erwartungen für unterschiedliche Trainingsniveaus wider.</p>
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
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#004A9F] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">🏃</div>
            <span className="font-semibold text-gray-700 text-sm sm:text-base">AUSDAUER-LAB</span>
            <span className="hidden sm:inline font-semibold text-gray-500">M05 - Ausdauertests</span>
          </Link>
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
        <div className="space-y-3">
          {sections.map((section) => (
            <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Accordion Header */}
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

              {/* Accordion Content */}
              {openAccordions[section.id] && (
                <div className="px-6 py-6 bg-white border-t border-gray-200">
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

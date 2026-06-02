'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface AccordionSection {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
}

const iconComponents: Record<string, React.ReactNode> = {
  definition: (
    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  normwerte: (
    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  ablauf: (
    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  schueler: (
    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  lehrer: (
    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17.25m20-11.002c5.5 0 10 4.745 10 10.002M12 6.253c5.5 0 10 4.745 10 10.002M12 19.253v.003" />
    </svg>
  ),
  sicherheit: (
    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  faq: (
    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

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

  // Öffnet das passende Akkordeon, wenn die Seite mit #anker aufgerufen wird
  useEffect(() => {
    const id = window.location.hash.replace('#', '');
    if (id) {
      setOpenAccordions(prev => ({ ...prev, [id]: true }));
      setTimeout(() => {
        document.getElementById(`acc-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, []);

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
      id: 'sicherheit',
      title: 'Sicherheit & Gesundheit',
      icon: '🩺',
      content: (
        <div className="space-y-5 text-gray-700 text-sm">
          <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
            <p className="font-bold text-red-900 mb-1">⚠️ Deine Gesundheit hat immer Vorrang vor der Note.</p>
            <p className="text-red-800">Ein Ausdauerlauf ist eine intensive Belastung für Herz und Kreislauf. Höre auf deinen Körper – kein Notenpunkt rechtfertigt ein gesundheitliches Risiko.</p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-2">🛑 Warnsignale – sofort anhalten und Lauf beenden bei:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Brustschmerzen</strong> oder Druck/Enge in der Brust (auch ausstrahlend in Arm, Hals, Kiefer)</li>
              <li><strong>Plötzliche, starke Atemnot</strong>, die nicht zur Belastung passt</li>
              <li><strong>Herzrasen, Herzstolpern</strong> oder unregelmäßiger Herzschlag</li>
              <li><strong>Schwindel, Benommenheit</strong>, „Schwarzwerden" vor den Augen, Sehstörungen</li>
              <li><strong>Plötzliche starke Übelkeit</strong>, besonders mit Schwindel oder Kopfschmerzen</li>
              <li><strong>Kalter Schweiß, Blässe</strong> oder Ohnmachtsgefühl</li>
            </ul>
            <div className="bg-red-100 border border-red-300 p-3 mt-3 rounded">
              <p className="text-red-900"><strong>Notruf 112</strong> wählen bei: Bewusstlosigkeit, anhaltenden Brustschmerzen, Sturz mit Verwirrtheit oder wenn jemand nicht mehr ansprechbar ist.</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-2">📋 Verhalten bei Problemen – stufenweise reagieren:</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li><strong>Tempo herausnehmen</strong> – oft reicht das schon (z. B. bei beginnendem Seitenstechen oder leichter Erschöpfung).</li>
              <li><strong>Ins Gehen wechseln</strong> statt komplett zu stoppen – so bleibt der Kreislauf in Bewegung.</li>
              <li><strong>Lehrkraft / Aufsicht informieren</strong>, wenn Beschwerden auftreten – nicht stillschweigend weitermachen.</li>
            </ol>
            <p className="mt-2 italic">„Langsamer werden ist besser als gehen, gehen ist besser als abbrechen – aber bei Warnsignalen ist Abbrechen die einzig richtige Entscheidung."</p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-2">🏥 Ärztliche Abklärung vor der Belastung</h4>
            <p className="mb-2">Die Deutsche Gesellschaft für Sportmedizin und Prävention (DGSP) empfiehlt eine sportmedizinische Untersuchung, um unerkannte Herz-Kreislauf-Erkrankungen aufzudecken. Ein Check ist <strong>besonders sinnvoll bei</strong>:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Vorerkrankungen, v. a. Herz-Kreislauf-Erkrankungen oder Bluthochdruck</li>
              <li>bekannten Herzproblemen, Herzrhythmusstörungen, Ohnmacht unter Belastung</li>
              <li>Wiedereinstieg nach langer Trainingspause / bei Untrainierten</li>
              <li>Fällen von plötzlichem Herztod in der Familie</li>
              <li>Brustschmerz, Atemnot oder Schwindel bereits bei moderater Belastung</li>
            </ul>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <h4 className="font-bold text-amber-900 mb-2">🤒 Nie mit Infekt laufen – Myokarditis-Risiko</h4>
            <p className="text-amber-900 mb-2">Eine Infektion (Erkältung, grippaler Infekt, COVID-19) kann den Herzmuskel mitbetreffen. Belastung mit verschlepptem Infekt kann eine <strong>Herzmuskelentzündung (Myokarditis)</strong> auslösen – eine der häufigsten Ursachen für den plötzlichen Herztod bei jungen Sportler*innen.</p>
            <ul className="list-disc list-inside space-y-1 text-amber-900">
              <li><strong>Asymptomatischer Infekt:</strong> ca. 2 Wochen keine intensive Belastung</li>
              <li><strong>Mit Symptomen (Husten, Halsschmerzen, Fieber):</strong> 2–4 Wochen Pause</li>
              <li><strong>Diagnostizierte Myokarditis:</strong> 3–6 Monate Sportpause, nur mit ärztlicher Freigabe zurück</li>
            </ul>
            <p className="text-amber-900 font-semibold mt-2">Grundregel: Nie mit Fieber oder akutem Infekt laufen. Im Zweifel ärztlich abklären lassen.</p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-2">✅ Allgemeine Sicherheitsempfehlungen</h4>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Aufwärmen:</strong> lockeres Einlaufen, Mobilisation, Steigerungen – bei Kälte länger</li>
              <li><strong>Flüssigkeit:</strong> über den Tag verteilt trinken, nicht erst kurz vor dem Start</li>
              <li><strong>Hitze:</strong> bei über 28 °C Test verschieben oder deutlich langsamer laufen</li>
              <li><strong>Auslaufen:</strong> nach dem Lauf nicht abrupt stehen bleiben, sondern locker auslaufen</li>
              <li><strong>Auf den Körper hören:</strong> Symptome ernst nehmen, nicht „durchbeißen"</li>
            </ul>
          </div>

          <div className="bg-gray-100 border border-gray-300 p-3 rounded text-xs text-gray-600">
            <p><strong>Medizinischer Hinweis:</strong> Diese Informationen ersetzen keine ärztliche Beratung. Bei Vorerkrankungen oder Beschwerden lasse deine Sporttauglichkeit vor der Prüfung ärztlich abklären. Quellen u. a.: DGSP, Deutsche Gesellschaft für Kardiologie, Deutsches Ärzteblatt.</p>
          </div>
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
            <p className="mt-1">A: Ja, Gehpausen sind erlaubt – du wirst nicht disqualifiziert oder aus dem Lauf genommen. Gewertet wird ausschließlich deine Gesamtzeit über die 5000m. Insbesondere wenn du Probleme mit der Atmung bekommst oder dir nicht gut geht, ist Gehen ausdrücklich besser, als dich zu überfordern oder abzubrechen. Beachte aber: Jede Gehphase kostet Zeit und verschlechtert dadurch dein Ergebnis und deine Notenpunkte. Ziel ist deshalb ein <strong>möglichst gleichmäßiges, kontinuierliches Tempo</strong>. Faustregel: <em>Langsamer werden ist besser als gehen, gehen ist besser als abbrechen.</em></p>
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
            <div key={section.id} id={`acc-${section.id}`} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm scroll-mt-4">
              <button
                onClick={() => toggleAccordion(section.id)}
                className={`w-full px-6 py-4 flex items-center justify-between font-semibold transition-colors ${
                  openAccordions[section.id]
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="flex items-center justify-center">{iconComponents[section.id]}</span>
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

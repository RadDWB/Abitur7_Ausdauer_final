'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const [testinfoOpen, setTestinfoOpen] = useState(false);
  const router = useRouter();

  const handleTestClick = () => {
    router.push('/ausdauer-testen/testauswahl');
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-bold">
              🏃
            </div>
            <span className="text-sm font-semibold text-gray-700">AUSDAUER-TEST ABITUR</span>
            <span className="text-sm font-semibold text-gray-500">Sport Leistungskurs</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">Zur Homepage</Link>
            <button className="text-sm text-gray-600 hover:text-gray-900">Info</button>
            <button className="text-sm text-gray-600 hover:text-gray-900">Hintergrund</button>
            <button className="text-2xl">🌙</button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Logo and Title */}
        <div className="flex items-start gap-6 mb-8">
          <div className="flex-shrink-0">
            <Image
              src="/AusdauertestenLK.png"
              alt="Ausdauer testen Logo"
              width={80}
              height={80}
              className="rounded-full"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-teal-700 mb-4">
              Ausdauertests verstehen und durchführen!
            </h1>
            <p className="text-gray-600 text-center">
              Systematische Erfassung, Bewertung und Analyse von Ausdauerleistungen im Schulsport. Wähle einen Test, lerne die wissenschaftlichen Grundlagen und dokumentiere Schüler*innen-Ergebnisse.
            </p>
          </div>
        </div>

        {/* Buttons/Accordion */}
        <div className="space-y-4 mt-12">
          {/* Testinformationen */}
          <button
            onClick={() => setTestinfoOpen(!testinfoOpen)}
            className="w-full bg-teal-700 hover:bg-teal-800 text-white py-4 px-6 rounded-lg flex items-center justify-between text-lg font-semibold transition-colors"
          >
            <span className="flex items-center gap-3">
              <span>📋</span>
              Testinformationen
            </span>
            <span className={`transform transition-transform ${testinfoOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {testinfoOpen && (
            <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Verfügbare Tests:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Cooper-Test</strong> - 12-Minuten-Lauf</li>
                <li>• <strong>Ausdauer-Testlauf</strong> - Standardisierte Laufstrecke</li>
                <li>• <strong>Weitere Tests</strong> - Je nach Lehrplan</li>
              </ul>
              <p className="text-gray-600 mt-4 text-sm">
                Erfahre mehr über die wissenschaftlichen Grundlagen und Durchführungsrichtlinien.
              </p>
            </div>
          )}

          {/* Ausdauer testen */}
          <button
            onClick={handleTestClick}
            className="w-full bg-teal-700 hover:bg-teal-800 text-white py-4 px-6 rounded-lg flex items-center justify-between text-lg font-semibold transition-colors"
          >
            <span className="flex items-center gap-3">
              <span>⏱️</span>
              Ausdauer testen
            </span>
            <span>→</span>
          </button>

          <p className="text-center text-gray-600 text-sm mt-6">
            Klicke auf "Ausdauer testen" um einen Test auszuwählen...
          </p>
        </div>

        {/* Footer Info */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
          <p className="font-semibold mb-2">Ausdauer Test Abitur</p>
          <p>Sport Leistungskurs - Systematische Erfassung und Analyse</p>
        </div>
      </div>
    </main>
  );
}

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
      {/* Top Header - Title Section */}
      <div className="bg-white border-b border-gray-300">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Image
              src="/AusdauertestenLK.png"
              alt="Ausdauer testen Logo"
              width={70}
              height={70}
              className="rounded-full"
            />
          </div>

          {/* Center: Main Title */}
          <div className="flex-1 text-center px-8">
            <h1 className="text-4xl font-bold text-blue-700 mb-2">
              Ausdauertests verstehen und durchführen!
            </h1>
            <p className="text-sm text-gray-600">
              Systematische Erfassung, Bewertung und Analyse von Ausdauerleistungen im Schulsport
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Abitur Sport Leistungskurs
            </p>
          </div>

          {/* Right: Logo */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
              QUA
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Header */}
      <nav className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-semibold text-gray-700">AUSDAUER-TEST ABITUR</span>
            <span className="text-sm text-gray-600">Sport Leistungskurs</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">Zur Homepage</Link>
            <button className="text-sm text-gray-600 hover:text-gray-900">Info</button>
            <button className="text-sm text-gray-600 hover:text-gray-900">Hintergrund</button>
            <button className="text-2xl">🌙</button>
          </nav>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Description */}
        <p className="text-gray-700 text-center mb-12 leading-relaxed">
          Wähle einen Test, lerne die wissenschaftlichen Grundlagen und dokumentiere Schüler*innen-Ergebnisse.
        </p>

        {/* Buttons/Accordion */}
        <div className="space-y-4">
          {/* Testinformationen */}
          <button
            onClick={() => setTestinfoOpen(!testinfoOpen)}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-4 px-6 rounded-lg flex items-center justify-between text-lg font-semibold transition-colors"
          >
            <span className="flex items-center gap-3">
              <span>📋</span>
              Testinformationen
            </span>
            <span className={`transform transition-transform ${testinfoOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {testinfoOpen && (
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-4">Verfügbare Tests:</h3>
              <ul className="space-y-2 text-blue-800">
                <li>• <strong>Cooper-Test</strong> - 12-Minuten-Lauf</li>
                <li>• <strong>Ausdauer-Testlauf</strong> - Standardisierte Laufstrecke</li>
                <li>• <strong>Weitere Tests</strong> - Je nach Lehrplan</li>
              </ul>
              <p className="text-blue-700 mt-4 text-sm">
                Erfahre mehr über die wissenschaftlichen Grundlagen und Durchführungsrichtlinien.
              </p>
            </div>
          )}

          {/* Ausdauer testen */}
          <button
            onClick={handleTestClick}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-4 px-6 rounded-lg flex items-center justify-between text-lg font-semibold transition-colors"
          >
            <span className="flex items-center gap-3">
              <span>⏱️</span>
              Ausdauer testen
            </span>
            <span>→</span>
          </button>

          <p className="text-center text-gray-600 text-sm mt-8">
            Klicke auf "Ausdauer testen" um einen Test auszuwählen...
          </p>
        </div>

        {/* Footer Info */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
          <p className="font-semibold mb-2">Ausdauer Test Abitur</p>
          <p>Sport Leistungskurs</p>
        </div>
      </div>
    </main>
  );
}

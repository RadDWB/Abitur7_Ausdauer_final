'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { APP_VERSION } from './lib/version';

export default function HomePage() {
  const [testinfoOpen, setTestinfoOpen] = useState(false);
  const router = useRouter();

  const handleTestClick = () => {
    router.push('/ausdauer-testen/testauswahl');
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar - wie LP2 */}
      <nav className="bg-gray-100 border-b border-gray-300">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-bold">
              🏃
            </div>
            <span className="font-semibold text-gray-700">AUSDAUER-LAB</span>
            <span className="font-semibold text-gray-500">M06 - Ausdauertests</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">Zur Homepage</Link>
            <button className="text-sm text-gray-600 hover:text-gray-900">Info</button>
            <button className="text-sm text-gray-600 hover:text-gray-900">Hintergrund</button>
            <button className="text-xl">🌙</button>
          </nav>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Logo and Title Section - wie LP2 */}
        <div className="bg-white border-b border-gray-300">
          <div className="max-w-6xl mx-auto px-6 py-12 flex items-center justify-center gap-12">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Image
                src="/AusdauertestenLK.png"
                alt="Ausdauer testen Logo"
                width={120}
                height={120}
                className="rounded-full shadow-lg"
              />
            </div>

            {/* Title and Description */}
            <div className="flex-1">
              <h1 className="text-5xl font-bold text-blue-700 mb-4">
                Ausdauertests verstehen und durchführen!
              </h1>
              <p className="text-gray-700 mb-2">
                Systematische Erfassung, Bewertung und Analyse von Ausdauerleistungen im Schulsport. Wähle einen Test, lerne die wissenschaftlichen Grundlagen und dokumentiere Schüler*innen-Ergebnisse.
              </p>
            </div>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="max-w-4xl mx-auto px-6 py-12 flex-1">
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
        </div>
      </div>

      {/* Footer - wie LP2 */}
      <div className="bg-white border-t border-gray-300">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center">
          <p className="text-gray-700 font-semibold mb-2">Modul 6: Ausdauer testen (Abitur)</p>
          <p className="text-gray-600 text-sm mb-1">Version {APP_VERSION}</p>
          <p className="text-gray-600 text-sm">© 2026 Ralf Duwenbeck Straight Edge Media. All rights reserved.</p>
        </div>
      </div>
    </main>
  );
}

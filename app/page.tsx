'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { APP_VERSION } from './lib/version';

export default function HomePage() {
  const [testinfoOpen, setTestinfoOpen] = useState(false);
  const [testauswahlOpen, setTestauswahlOpen] = useState(false);
  const router = useRouter();

  const handleSelectTest = (testType: string) => {
    router.push(`/ausdauer-testen/testauswahl?test=${testType}`);
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
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 space-y-4">
                <div>
                  <h3 className="font-semibold text-blue-900 mb-3">Verfügbare Tests:</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setTestinfoOpen(false);
                        handleSelectTest('5000m-zeitschaetzlauf');
                      }}
                      className="border-2 border-blue-600 hover:bg-blue-100 text-blue-700 py-3 px-3 rounded-lg font-semibold transition-colors text-sm"
                    >
                      ⏱️ 5000m Zeitschätzlauf
                    </button>
                    <button
                      onClick={() => {
                        setTestinfoOpen(false);
                        handleSelectTest('5000m-lauf');
                      }}
                      className="border-2 border-blue-600 hover:bg-blue-100 text-blue-700 py-3 px-3 rounded-lg font-semibold transition-colors text-sm"
                    >
                      🏃 5000m Lauf
                    </button>
                  </div>
                </div>
                <p className="text-blue-700 text-sm">
                  Wähle einen Test, um die wissenschaftlichen Grundlagen zu erfahren und Schüler*innen-Ergebnisse zu dokumentieren.
                </p>
              </div>
            )}

            {/* Ausdauer testen */}
            <button
              onClick={() => setTestauswahlOpen(true)}
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

      {/* Testauswahl Modal */}
      {testauswahlOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-8 border border-gray-200">
            {/* Close Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setTestauswahlOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Modal Title */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">ℹ️</span>
              <h2 className="text-3xl font-bold text-blue-700">Testauswahl</h2>
            </div>
            <p className="text-gray-600 mb-8">
              Wähle einen Test aus und stelle ggf. Parameter ein
            </p>

            {/* Schritt 1 */}
            <h3 className="text-xl font-bold text-gray-900 mb-6">Schritt 1: Test wählen</h3>

            {/* Test Grid - nur 2 Optionen */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* 5000m Zeitschätzlauf */}
              <button
                onClick={() => {
                  setTestauswahlOpen(false);
                  handleSelectTest('5000m-zeitschaetzlauf');
                }}
                className="border-2 border-blue-600 hover:bg-blue-50 text-blue-700 py-6 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <span>⏱️</span>
                5000m Zeitschätzlauf
              </button>

              {/* 5000m Lauf */}
              <button
                onClick={() => {
                  setTestauswahlOpen(false);
                  handleSelectTest('5000m-lauf');
                }}
                className="border-2 border-blue-600 hover:bg-blue-50 text-blue-700 py-6 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <span>🏃</span>
                5000m Lauf
              </button>
            </div>
          </div>
        </div>
      )}

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

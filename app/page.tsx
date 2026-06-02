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

  const handleViewInfo = (testType: string) => {
    router.push(`/ausdauer-testen/${testType}`);
  };

  const handleStartTest = (testType: string) => {
    router.push(`/ausdauer-testen/testauswahl?test=${testType}`);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-gray-100 border-b border-gray-300">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-teal-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              🏃
            </div>
            <span className="font-semibold text-gray-700 text-sm sm:text-base">AUSDAUER-LAB</span>
            <span className="hidden sm:inline font-semibold text-gray-500">M05 - Ausdauertests</span>
          </div>
          <nav className="flex items-center gap-2 sm:gap-6">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 hidden sm:inline">Zur Homepage</Link>
            <button className="text-sm text-gray-600 hover:text-gray-900 hidden sm:inline">Info</button>
            <button className="text-sm text-gray-600 hover:text-gray-900 hidden sm:inline">Hintergrund</button>
            <button className="text-xl">🌙</button>
          </nav>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Logo and Title Section */}
        <div className="bg-white border-b border-gray-300">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Image
                src="/AusdauertestenLK.png"
                alt="Ausdauer testen Logo"
                width={130}
                height={130}
                className="rounded-full shadow-lg"
              />
            </div>

            {/* Title and Description */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-teal-700 mb-2">
                Ausdauertests im Abiturkurs
              </h1>
              <p className="text-base sm:text-lg text-gray-600 font-medium mb-2">
                5000m Belastungssteuerungslauf, klassischer 5000m Lauf und 800m Lauf
              </p>
              <p className="text-gray-500 text-sm sm:text-base">
                Als Teil einer Abiturprüfung verstehen, durchführen und erfassen.
              </p>
            </div>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1">
          <div className="space-y-4">
            {/* Testinformationen */}
            <button
              onClick={() => setTestinfoOpen(!testinfoOpen)}
              className="w-full bg-teal-700 hover:bg-teal-800 text-white py-4 px-5 sm:px-6 rounded-lg flex items-center justify-between text-base sm:text-lg font-semibold transition-colors"
            >
              <span className="flex items-center gap-3">
                <span>📋</span>
                Testinformationen
              </span>
              <span className={`transform transition-transform ${testinfoOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {testinfoOpen && (
              <div className="bg-teal-50 p-4 sm:p-6 rounded-lg border border-teal-200 space-y-4">
                <div>
                  <h3 className="font-semibold text-teal-900 mb-3">Verfügbare Tests:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => { setTestinfoOpen(false); handleViewInfo('belastungssteuerungslauf-5000m'); }}
                      className="border-2 border-teal-600 hover:bg-teal-100 text-teal-700 py-3 px-3 rounded-lg font-semibold transition-colors text-sm"
                    >
                      ⏱️ Belastungssteuerungslauf 5000m
                    </button>
                    <button
                      onClick={() => { setTestinfoOpen(false); handleViewInfo('5000m-dauerlauf'); }}
                      className="border-2 border-teal-600 hover:bg-teal-100 text-teal-700 py-3 px-3 rounded-lg font-semibold transition-colors text-sm"
                    >
                      🏃 5000m Dauerlauf
                    </button>
                    <button
                      onClick={() => { setTestinfoOpen(false); handleViewInfo('800m-lauf'); }}
                      className="border-2 border-teal-600 hover:bg-teal-100 text-teal-700 py-3 px-3 rounded-lg font-semibold transition-colors text-sm"
                    >
                      🏅 800m Lauf
                    </button>
                  </div>
                </div>
                <p className="text-teal-700 text-sm">
                  Wähle einen Test, um die wissenschaftlichen Grundlagen zu erfahren und Schüler*innen-Ergebnisse zu dokumentieren.
                </p>
              </div>
            )}

            {/* Ausdauer testen */}
            <button
              onClick={() => setTestauswahlOpen(true)}
              className="w-full bg-teal-700 hover:bg-teal-800 text-white py-4 px-5 sm:px-6 rounded-lg flex items-center justify-between text-base sm:text-lg font-semibold transition-colors"
            >
              <span className="flex items-center gap-3">
                <span>⏱️</span>
                Ausdauer testen
              </span>
              <span>→</span>
            </button>

            <p className="text-center text-gray-500 text-sm mt-8">
              Klicke auf &ldquo;Ausdauer testen&rdquo; um einen Test auszuwählen...
            </p>
          </div>
        </div>
      </div>

      {/* Testauswahl Modal */}
      {testauswahlOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full p-5 sm:p-8 border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-end mb-4">
              <button onClick={() => setTestauswahlOpen(false)} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">ℹ️</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-teal-700">Testauswahl</h2>
            </div>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
              Wähle einen Test aus und stelle ggf. Parameter ein
            </p>

            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Schritt 1: Test wählen</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <button
                onClick={() => { setTestauswahlOpen(false); handleStartTest('belastungssteuerungslauf-5000m'); }}
                className="border-2 border-teal-600 hover:bg-teal-50 text-teal-700 py-5 sm:py-6 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <span>⏱️</span>
                Belastungssteuerungslauf 5000m
              </button>

              <button
                onClick={() => { setTestauswahlOpen(false); handleStartTest('5000m-dauerlauf'); }}
                className="border-2 border-teal-600 hover:bg-teal-50 text-teal-700 py-5 sm:py-6 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <span>🏃</span>
                5000m Dauerlauf
              </button>

              <a
                href="https://800m.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setTestauswahlOpen(false)}
                className="border-2 border-teal-600 hover:bg-teal-50 text-teal-700 py-5 sm:py-6 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <span>🏅</span>
                800m Lauf
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-white border-t border-gray-300">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 text-center">
          <p className="text-gray-700 font-semibold mb-2">Modul 5: Ausdauer testen (Abitur)</p>
          <p className="text-gray-600 text-sm mb-1">Version {APP_VERSION}</p>
          <p className="text-gray-600 text-sm">© 2026 Ralf Duwenbeck Straight Edge Media. All rights reserved.</p>
        </div>
      </div>
    </main>
  );
}

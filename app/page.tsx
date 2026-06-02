'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [activeModal, setActiveModal] = useState<'info' | 'test' | null>(null);
  const router = useRouter();

  const handleTestClick = () => {
    router.push('/ausdauer-testen/testauswahl');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col justify-center items-center p-4">
      {/* Header mit Logo */}
      <div className="text-center mb-12">
        <div className="mb-6 flex justify-center">
          <Image
            src="/AusdauertestenLK.png"
            alt="Ausdauer testen Logo"
            width={120}
            height={120}
            priority
            className="rounded-lg shadow-lg"
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          Ausdauer im Abitur testen
        </h1>
        <p className="text-lg text-slate-300">Sport Leistungskurs</p>
      </div>

      {/* Modal Buttons Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        {/* Testinformationen Button */}
        <button
          onClick={() => setActiveModal('info')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-8 px-6 rounded-lg shadow-lg transform transition hover:scale-105 text-center group"
        >
          <div className="text-3xl mb-3">ℹ️</div>
          <div className="text-xl group-hover:text-blue-100">Testinformationen</div>
          <div className="text-sm text-blue-200 mt-2">Erfahre mehr über den Test</div>
        </button>

        {/* Ausdauer testen Button */}
        <button
          onClick={handleTestClick}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-8 px-6 rounded-lg shadow-lg transform transition hover:scale-105 text-center group"
        >
          <div className="text-3xl mb-3">🏃</div>
          <div className="text-xl group-hover:text-emerald-100">Ausdauer testen</div>
          <div className="text-sm text-emerald-200 mt-2">Starten Sie jetzt</div>
        </button>
      </div>

      {/* Modal: Testinformationen */}
      {activeModal === 'info' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg shadow-2xl max-w-md w-full p-6 border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Testinformationen</h2>
            <div className="text-slate-300 space-y-4 mb-6">
              <p>
                <strong>Testtyp:</strong> Cooper-Test (12-Minuten-Lauf)
              </p>
              <p>
                <strong>Dauer:</strong> 12 Minuten durchgehendes Laufen
              </p>
              <p>
                <strong>Ziel:</strong> Maximale Distanz in 12 Minuten zurücklegen
              </p>
              <p>
                <strong>Vorbereitung:</strong> Gutes Schuhwerk und ausreichend Wasser empfohlen
              </p>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
            >
              Verstanden
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

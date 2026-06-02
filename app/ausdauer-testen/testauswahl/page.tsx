import React from 'react';
import Link from 'next/link';
import RundenzeitTabelle from '../../../components/RundenzeitTabelle';
import Dauerlauf5000mTest from '../../../components/Dauerlauf5000mTest';

interface Props {
  searchParams: { test?: string };
}

const TEST_LABELS: Record<string, string> = {
  'belastungssteuerungslauf-5000m': 'Belastungssteuerungslauf 5000m',
  '5000m-dauerlauf': '5000m Dauerlauf',
};

export default function TestauswahlPage({ searchParams }: Props) {
  const test = searchParams.test ?? 'belastungssteuerungslauf-5000m';
  const label = TEST_LABELS[test] ?? test;

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
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

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Title */}
      <h1 className="text-xl font-bold text-gray-800">{label}</h1>

      {/* Route to correct test component */}
      {test === '5000m-dauerlauf' ? (
        <Dauerlauf5000mTest />
      ) : (
        <RundenzeitTabelle />
      )}
      </div>
    </main>
  );
}

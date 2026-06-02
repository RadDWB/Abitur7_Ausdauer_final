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
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Back button + Title */}
      <div className="flex items-center gap-4 flex-wrap">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-sm"
        >
          ← Zur Startseite
        </Link>
        <span className="text-gray-300">|</span>
        <h1 className="text-xl font-bold text-gray-800">{label}</h1>
      </div>

      {/* Route to correct test component */}
      {test === '5000m-dauerlauf' ? (
        <Dauerlauf5000mTest />
      ) : (
        <RundenzeitTabelle />
      )}
    </main>
  );
}

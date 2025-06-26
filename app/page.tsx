import React from 'react';
import RundenzeitTabelle from '../components/RundenzeitTabelle';

export default function HomePage() {
  return (
    <main className="p-4 max-w-3xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold text-center">Abiturprüfung: Zeitschätzlauf 5000 m</h1>
      <RundenzeitTabelle />
    </main>
  );
}

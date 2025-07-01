/**
 * =============================================================================
 * Zeitschätzlauf 5000 m – Berechnungs­modul (halbe Runde korrekt gewichtet)
 * =============================================================================
 *
 * Prüfungsformat (Kernpunkte):
 * - Distanz: 5000 m (0,5 Runde + 12 volle Runden)
 * - Selbsteingestellte Zielzeit (MM:SS)
 * - Bewertung:
 *    • Abweichung von Zielzeit (max. 10 Pkt)
 *    • Tempokonstanz (Stdabw der vollen Runden; max. 5 Pkt)
 * - Gesamt: max. 15 Punkte → Note 1+–6
 *
 * Datenschutz & Datensicherheit:
 * - Keine Speicherung personenbezogener Daten auf Servern
 * - Alle Berechnungen finden client-seitig statt
 * - Exporte nur lokal (Download im Browser)
 */

export interface Result {
  name: string;
  istZeit: string;      // Endzeit formatiert mm:ss
  abwProzent: string;   // Ziel­zeit­abweichung in %
  stdAbw: string;       // Standard­abweichung der vollen Runden (s)
  zielPunkte: number;   // Punkte für Abweichung
  konstanzPunkte: number; // Punkte für Tempokons­tanz
  gesamt: number;       // Gesamtpunkte
  note: string;         // Note 1+–6
}

function parseTargetTime(ziel: string): number {
  if (ziel.includes(':')) {
    const [m, s] = ziel.split(':').map(x => parseInt(x, 10) || 0);
    return m * 60 + s;
  }
  return parseFloat(ziel) || 0;
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function calculate(
  runden: number[],
  ignore: boolean[],
  ziel: string,
  name: string
): Result {
  // 1. Zielzeit in Sekunden
  const zielSec = parseTargetTime(ziel);

  // 2. Endzeit: halbe Runde zählt 0.5, volle Runden zählen 1
  const totalSec = runden.reduce(
    (sum, t, i) => sum + (i === 0 ? t * 0.5 : t),
    0
  );
  const istZeit = formatTime(totalSec);

  // 3. Prozentuale Abweichung von Zielzeit
  const abw = zielSec > 0
    ? (Math.abs(zielSec - totalSec) / zielSec) * 100
    : 0;
  const abwProzent = abw.toFixed(2);

  // 4. Tempokonstanz: nur volle Runden (Index > 0), ignorierte Runden auslassen
  const volleRunden = runden
    .slice(1)                  // entferne halbe Runde
    .filter((_, idx) => !ignore[idx + 1]);

  const mean = volleRunden.reduce((a, b) => a + b, 0) / volleRunden.length;
  const std = Math.sqrt(
    volleRunden.reduce((a, b) => a + (b - mean) ** 2, 0) /
    volleRunden.length
  );
  const stdAbw = std.toFixed(2);

  // 5. Punkte für Zielzeit-Abweichung (1 % Schritte)
  const zielPunkte =
    abw <=  1 ? 10 :
    abw <=  2 ? 9  :
    abw <=  3 ? 8  :
    abw <=  4 ? 7  :
    abw <=  5 ? 6  :
    abw <=  6 ? 5  :
    abw <=  7 ? 4  :
    abw <=  8 ? 3  :
    abw <= 10 ? 2  : 1;

  // 6. Punkte für Tempokonstanz (Stdabw-Schwellen)
  const konstanzPunkte =
    std <=  3 ? 5 :
    std <=  6 ? 4 :
    std <=  9 ? 3 :
    std <= 12 ? 2 : 1;

  // 7. Gesamtpunkte und Note
  const gesamt = zielPunkte + konstanzPunkte;

  let note: string;
  switch (gesamt) {
    case 15: note = '1+'; break;
    case 14: note = '1';  break;
    case 13: note = '1-'; break;
    case 12: note = '2+'; break;
    case 11: note = '2';  break;
    case 10: note = '2-'; break;
    case  9: note = '3+'; break;
    case  8: note = '3';  break;
    case  7: note = '3-'; break;
    case  6: note = '4+'; break;
    case  5: note = '4';  break;
    case  4: note = '4-'; break;
    case  3: note = '5+'; break;
    case  2: note = '5';  break;
    case  1: note = '5-'; break;
    default: note = '6';  break;
  }

  return {
    name,
    istZeit,
    abwProzent,
    stdAbw,
    zielPunkte,
    konstanzPunkte,
    gesamt,
    note
  };
}

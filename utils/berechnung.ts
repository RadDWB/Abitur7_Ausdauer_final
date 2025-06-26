// utils/berechnung.ts

export interface Result {
  name: string;
  istZeit: string;         // Endzeit formatiert mm:ss
  abwProzent: string;      // Abweichung in %
  stdAbw: string;          // Standardabweichung in Sekunden
  zielPunkte: number;      // Punkte für Abweichung
  konstanzPunkte: number;  // Punkte für Tempokonstanz
  gesamt: number;
  note: string;
}

/** Parst Zielzeit als "MM:SS" oder reine Sekundenzahl */
function parseTargetTime(ziel: string): number {
  if (ziel.includes(':')) {
    const [min, sec] = ziel.split(':').map(s => parseInt(s, 10) || 0);
    return min * 60 + sec;
  }
  return parseFloat(ziel) || 0;
}

/** Formatiert Sekunden in "m:ss" */
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
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

  // 2. Endzeit (Summe aller Runden inkl. halber als volle): 
  const totalSec = runden.reduce((sum, t) => sum + t, 0);
  const istZeit = formatTime(totalSec);

  // 3. Abweichung in Prozent
  const abw = Math.abs(zielSec - totalSec) / zielSec * 100;

  // 4. Runden für Tempokonstanz normalisieren:
  //    - erste halbe Runde wird als volle 400 m gerechnet (t * 2)
  //    - alle anderen Runden nehmen wir direkt
  //    - nur diejenigen Werte, die nicht ignoriert sind (ignore-flag gilt nur ab i>0)
  const normierte = runden.map((t, i) => i === 0 ? t * 2 : t);
  const valid = normierte.filter((_, i) => (i === 0) || !ignore[i]);

  // 5. Mittelwert und Standardabweichung
  const mean = valid.reduce((sum, t) => sum + t, 0) / valid.length;
  const std = Math.sqrt(
    valid.reduce((sum, t) => sum + (t - mean) ** 2, 0) / valid.length
  );

  // 6. Punkte vergeben
  //    Schwellen kannst du hier noch anpassen, das ist ein Beispiel:
  const zielPunkte =
    abw <= 1  ? 10 :
    abw <= 2  ? 9  :
    abw <= 3  ? 8  :
    abw <= 4  ? 7  :
    abw <= 5  ? 6  :
    abw <= 6  ? 5  :
    abw <= 7  ? 4  :
    abw <= 8  ? 3  :
    abw <= 10 ? 2  : 1;

  const konstanzPunkte =
    std <= 3  ? 5 :
    std <= 6  ? 4 :
    std <= 9  ? 3 :
    std <= 12 ? 2 : 1;

  const gesamt = zielPunkte + konstanzPunkte;

  // 7. Note
  const note =
    gesamt >= 14 ? '1' :
    gesamt >= 12 ? '2' :
    gesamt >= 10 ? '3' :
    gesamt >= 8  ? '4' : '5';

  return {
    name,
    istZeit,
    abwProzent: abw.toFixed(2),
    stdAbw: std.toFixed(2),
    zielPunkte,
    konstanzPunkte,
    gesamt,
    note
  };
}

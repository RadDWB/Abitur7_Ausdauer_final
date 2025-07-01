/**
 * =============================================================================
 * Zeitschätzlauf 5000 m – Berechnungs­modul (aktualisiert)
 * =============================================================================
 *
 * Prüfungsformat (Kernpunkte):
 * - Distanz: 5000 m (0,5 Runde + 12 volle Runden)
 * - Selbsteingestellte Zielzeit (MM:SS)
 * - Bewertung: Abweichung von Zielzeit (max. 10 Pkt), Tempokonstanz (Stdabw; max. 5 Pkt)
 * - Gesamt: max. 15 Punkte → Note 1+–6
 *
 * Web-App:
 * - Erfassung: Name, Zielzeit, Rundenzeiten, Ignorier-Flags
 * - Auswertung: Automatische Berechnung von Endzeit, Abweichung, Stdabw, Punkte, Note
 * - Export: XLSX & PDF
 *
 * Datenschutz & Datensicherheit:
 * - Keine Speicherung personenbezogener Daten auf Servern
 * - Alle Berechnungen finden client-seitig statt
 * - Exporte nur lokal (Download im Browser)
 *
 * =============================================================================
 */

export interface Result {
  name: string;
  istZeit: string;         // Endzeit formatiert mm:ss
  abwProzent: string;      // Ziel­zeit­abweichung in %
  stdAbw: string;          // Standard­abweichung (s)
  zielPunkte: number;      // Punkte für Abweichung
  konstanzPunkte: number;  // Punkte für Tempokons­tanz
  gesamt: number;          // Gesamtpunkte
  note: string;            // Note 1+–6
}

/** Parsen der eingegebenen Zielzeit ("MM:SS" oder reine Sekundenzahl) */
function parseTargetTime(ziel: string): number {
  if (ziel.includes(':')) {
    const [m, s] = ziel.split(':').map((x) => parseInt(x, 10) || 0);
    return m * 60 + s;
  }
  return parseFloat(ziel) || 0;
}

/** Formatiert Sekunden in "m:ss" */
function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Hauptfunktion: Berechnet alle Prüfungsmetriken
 *
 * @param runden   Array mit 13 Zeiten (erste ist 0.5-Runde)
 * @param ignore   Boolean-Flags (Index 0 wird intern nicht beachtet)
 * @param ziel     Selbst gesetzte Zielzeit als String (MM:SS)
 * @param name     Name der getesteten Person
 * @returns        Result-Objekt mit allen Werten
 */
export default function calculate(
  runden: number[],
  ignore: boolean[],
  ziel: string,
  name: string
): Result {
  // 1. Zielzeit → Sekunden
  const zielSec = parseTargetTime(ziel);

  // 2. Endzeit (Summe aller eingegebenen Zeiten)
  const totalSec = runden.reduce((a, b) => a + b, 0);
  const istZeit = formatTime(totalSec);

  // 3. Prozentuale Abweichung
  const abw = zielSec > 0
    ? (Math.abs(zielSec - totalSec) / zielSec) * 100
    : 0;
  const abwProzent = abw.toFixed(2);

  // 4. Tempobereinigung:
  //    Halbe Runde (Index 0) wird als volle Runde (×2) behandelt
  const normiert = runden.map((t, i) => (i === 0 ? t * 2 : t));
  //    nur die Runden, die nicht ignoriert werden, zählen
  const valid = normiert.filter((_, i) => i === 0 || !ignore[i]);

  // 5. Mittelwert & Standardabweichung
  const mean = valid.reduce((sum, x) => sum + x, 0) / valid.length;
  const std = Math.sqrt(valid.reduce((sum, x) => sum + (x - mean) ** 2, 0) / valid.length);
  const stdAbw = std.toFixed(2);

  // 6. Punkte für Zielzeit-Abweichung (1 %-Schritte)
  const zielPunkte =
    abw <= 1   ? 10 :
    abw <= 2   ? 9  :
    abw <= 3   ? 8  :
    abw <= 4   ? 7  :
    abw <= 5   ? 6  :
    abw <= 6   ? 5  :
    abw <= 7   ? 4  :
    abw <= 8   ? 3  :
    abw <= 10  ? 2  : 1;

  // 7. Punkte für Tempokonstanz (Stdabw-Schwellen)
  const konstanzPunkte =
    std <= 3   ? 5 :
    std <= 6   ? 4 :
    std <= 9   ? 3 :
    std <= 12  ? 2 : 1;

  // 8. Gesamtpunkte
  const gesamt = zielPunkte + konstanzPunkte;

  // 9. Note ableiten (exaktes Mapping)
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

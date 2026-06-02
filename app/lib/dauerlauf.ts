// ─── Gemeinsame Logik für den 5000m Dauerlauf ──────────────────
// Wird von Test-Komponenten (Kurs- & Einzelmodus) und der
// QR-Empfänger-Seite (/ergebnis) gemeinsam genutzt.

// ─── Normwerte (Sekunden) ─────────────────────────────────────
export const NORM_W: Record<number, number> = {
  15: 1515, 14: 1545, 13: 1575, 12: 1605, 11: 1650,
  10: 1695,  9: 1740,  8: 1800,  7: 1860,  6: 1920,
   5: 1980,  4: 2040,  3: 2115,  2: 2190,  1: 2265,
}
export const NORM_M: Record<number, number> = {
  15: 1275, 14: 1305, 13: 1335, 12: 1365, 11: 1410,
  10: 1455,  9: 1500,  8: 1560,  7: 1620,  6: 1680,
   5: 1740,  4: 1800,  3: 1875,  2: 1950,  1: 2025,
}

export type Gender = 'w' | 'm'

export function calcPoints(secs: number, gender: Gender): number {
  const table = gender === 'w' ? NORM_W : NORM_M
  for (let p = 15; p >= 1; p--) {
    if (secs <= table[p]) return p
  }
  return 0
}

export function ptsToGrade(p: number): string {
  const g: Record<number, string> = {
    15:'1+',14:'1',13:'1-',12:'2+',11:'2',10:'2-',
    9:'3+',8:'3',7:'3-',6:'4+',5:'4',4:'4-',
    3:'5+',2:'5',1:'5-',0:'6',
  }
  return g[p] ?? '6'
}

// ms → "M:SS.cc"
export function fmtMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const centis = Math.floor((ms % 1000) / 10)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${s.toString().padStart(2,'0')}.${centis.toString().padStart(2,'0')}`
}

// ms → "M:SS"
export function fmtMsShort(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${s.toString().padStart(2,'0')}`
}

export function genId(): string {
  return Math.random().toString(36).slice(2, 11)
}

// ─── 5000m auf 400m-Bahn ──────────────────────────────────────
// Start am 200m-Start: zuerst 1 halbe Runde à 200m (erste Ziellinien-
// Überquerung), danach 12 volle Runden à 400m (= 4800m) = 5000m.
export const FULL_LAPS = 12            // Anzahl voller 400m-Runden
export const TOTAL_LAPS = 13           // halbe Runde + 12 volle Runden
export const LAP_DISTANCE = 400        // Meter pro voller Runde
export const HALF_DISTANCE = 200       // Meter erste halbe Runde
export const TOTAL_DISTANCE = 5000     // Meter gesamt

// Liefert die Meterzahl eines Abschnitts (0-basiert).
// Index 0 = erste halbe Runde (200m), danach volle Runden (400m).
export function lapDistance(index: number): number {
  return index === 0 ? HALF_DISTANCE : LAP_DISTANCE
}

// Label für einen Abschnitt (0-basiert).
export function lapLabel(index: number): string {
  return index === 0 ? '½ Runde (200m)' : `Runde ${index}`
}

// ─── Auswertung der Rundenzeiten ──────────────────────────────
export interface LapAnalysis {
  laps: number[]                 // Rundendauern in ms
  totalMs: number                // Gesamtzeit in ms
  fastestIdx: number             // Index der schnellsten 400m-Runde
  slowestIdx: number             // Index der langsamsten 400m-Runde
  avgFullLapMs: number           // Ø-Zeit einer 400m-Runde
  avgPaceSecPerKm: number        // Ø-Pace (Sekunden pro km)
}

// Berechnet Kennzahlen aus Rundendauern (ms je Abschnitt).
// Index 0 (halbe Runde, 200m) wird bei Ø/schnellste/langsamste
// ausgenommen — verglichen werden nur volle 400m-Runden (Index ≥ 1).
export function analyzeLaps(laps: number[]): LapAnalysis {
  const totalMs = laps.reduce((a, b) => a + b, 0)
  // Indizes der vollen 400m-Runden (ohne halbe Anfangsrunde)
  const fullIdx = laps.map((_, i) => i).filter(i => i >= 1)
  let fastestIdx = fullIdx.length ? fullIdx[0] : 0
  let slowestIdx = fullIdx.length ? fullIdx[0] : 0
  fullIdx.forEach(i => {
    if (laps[i] < laps[fastestIdx]) fastestIdx = i
    if (laps[i] > laps[slowestIdx]) slowestIdx = i
  })
  const avgFullLapMs = fullIdx.length
    ? fullIdx.reduce((a, i) => a + laps[i], 0) / fullIdx.length
    : 0
  // Ø-Pace bezogen auf die tatsächlich gelaufene Distanz
  const distanceM = laps.reduce((sum, _ms, i) => sum + lapDistance(i), 0)
  const avgPaceSecPerKm = distanceM > 0
    ? (totalMs / 1000) / (distanceM / 1000)
    : 0
  return { laps, totalMs, fastestIdx, slowestIdx, avgFullLapMs, avgPaceSecPerKm }
}

// ─── Teilen via QR / Link ─────────────────────────────────────
// Kompaktes, base64url-kodiertes JSON im URL-Fragment (#d=...)
export interface RunShareData {
  v: 1                 // Schema-Version
  n: string            // Name
  g: Gender            // Geschlecht
  k?: string           // Kurs/Klasse (optional)
  t: number            // Gesamtzeit in ms
  l: number[]          // Rundendauern in ms
  d: string            // Datum ISO (yyyy-mm-dd)
}

// UTF-8-sichere base64url-Kodierung
function toBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str)
  let bin = ''
  bytes.forEach(b => { bin += String.fromCharCode(b) })
  const b64 = (typeof btoa !== 'undefined' ? btoa(bin) : Buffer.from(bin, 'binary').toString('base64'))
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(b64url: string): string {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/')
  const bin = (typeof atob !== 'undefined' ? atob(b64) : Buffer.from(b64, 'base64').toString('binary'))
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

export function encodeRun(data: RunShareData): string {
  return toBase64Url(JSON.stringify(data))
}

export function decodeRun(encoded: string): RunShareData | null {
  try {
    const obj = JSON.parse(fromBase64Url(encoded))
    if (obj && obj.v === 1 && typeof obj.n === 'string' && Array.isArray(obj.l)) {
      return obj as RunShareData
    }
    return null
  } catch {
    return null
  }
}

// Baut die vollständige Ergebnis-URL (für QR-Code & Link)
export function buildShareUrl(origin: string, data: RunShareData): string {
  return `${origin}/ergebnis#d=${encodeRun(data)}`
}

// ─── Belastungssteuerungslauf QR-Share ─────────────────────────
// Datenstruktur für Belastungssteuerungslauf (keine Geschlechts-Differenzierung)
export interface BslShareData {
  v: 1                 // Schema-Version
  n: string            // Name
  z: string            // Zielzeit (MM:SS)
  l: number[]          // Rundenzeiten in Sekunden (mit 1 Dezimalstelle)
  d: string            // Datum ISO (yyyy-mm-dd)
}

export function encodeBslRun(data: BslShareData): string {
  return toBase64Url(JSON.stringify(data))
}

export function decodeBslRun(encoded: string): BslShareData | null {
  try {
    const obj = JSON.parse(fromBase64Url(encoded))
    if (obj && obj.v === 1 && typeof obj.n === 'string' && Array.isArray(obj.l)) {
      return obj as BslShareData
    }
    return null
  } catch {
    return null
  }
}

export function buildBslShareUrl(origin: string, data: BslShareData): string {
  return `${origin}/ergebnis-bsl#d=${encodeBslRun(data)}`
}

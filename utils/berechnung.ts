export interface Result {
  name: string;
  istZeit: string;
  abwProzent: string;
  stdAbw: string;
  zielPunkte: number;
  konstanzPunkte: number;
  gesamt: number;
  note: string;
}

function parseTargetTime(ziel: string): number {
  if (ziel.includes(':')) {
    const [min, sec] = ziel.split(':').map((s) => parseInt(s, 10) || 0)
    return min * 60 + sec
  }
  return parseFloat(ziel) || 0
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return `${m.toString()}:${s.toString().padStart(2, '0')}`
}

export default function calculate(
  runden: number[],
  ignore: boolean[],
  ziel: string,
  name: string
): Result {
  const valid = runden.filter((_, i) => !ignore[i])
  const totalSec = runden.reduce((a, b) => a + b, 0)
  const istZeit = formatTime(totalSec)
  const zielSec = parseTargetTime(ziel)
  const abw = Math.abs(zielSec - totalSec) / zielSec * 100
  const mean = valid.reduce((a, b) => a + b, 0) / valid.length
  const std = Math.sqrt(valid.reduce((a, b) => a + (b - mean) ** 2, 0) / valid.length)
  let zp = abw <= 1 ? 10 : abw <= 2 ? 9 : abw <= 3 ? 8 : abw <= 4 ? 7 : abw <= 5 ? 6 : abw <= 6 ? 5 : abw <= 7 ? 4 : abw <= 8 ? 3 : abw <= 10 ? 2 : 1
  let kp = std <= 2 ? 5 : std <= 4 ? 4 : std <= 6 ? 3 : std <= 8 ? 2 : 1
  const total = zp + kp
  const note = total >= 14 ? '1' : total >= 12 ? '2' : total >= 10 ? '3' : total >= 8 ? '4' : '5'
  return {
    name,
    istZeit,
    abwProzent: abw.toFixed(2),
    stdAbw: std.toFixed(2),
    zielPunkte: zp,
    konstanzPunkte: kp,
    gesamt: total,
    note
  }
}

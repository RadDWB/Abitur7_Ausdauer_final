'use client'

import { fmtMsShort } from '../app/lib/dauerlauf'

interface LapChartProps {
  laps: number[]          // Rundendauern in ms
  fastestIdx?: number
  slowestIdx?: number
}

// Schlankes SVG-Balkendiagramm der Rundenzeiten (ohne externe Lib).
// Index 0 ist die halbe Anfangsrunde (200m) und wird zur Vergleichbarkeit
// auf 400m hochgerechnet dargestellt (gestrichelt markiert).
export default function LapChart({ laps, fastestIdx, slowestIdx }: LapChartProps) {
  if (!laps.length) return null

  // Normierte Werte: halbe Runde (200m, Index 0) ×2 für faire Balkenhöhe
  const norm = laps.map((ms, i) => (i === 0 ? ms * 2 : ms))
  const max = Math.max(...norm)

  const W = 640
  const H = 240
  const padL = 36
  const padB = 28
  const padT = 12
  const chartW = W - padL - 8
  const chartH = H - padB - padT
  const barGap = 6
  const barW = (chartW / laps.length) - barGap

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[480px]" role="img" aria-label="Rundenzeiten-Diagramm">
        {/* Achsenlinie */}
        <line x1={padL} y1={padT + chartH} x2={W - 4} y2={padT + chartH} stroke="#d1d5db" strokeWidth={1} />

        {/* Ø-Linie der vollen Runden */}
        {(() => {
          const full = norm.slice(1)
          if (!full.length) return null
          const avg = full.reduce((a, b) => a + b, 0) / full.length
          const y = padT + chartH - (avg / max) * chartH
          return (
            <>
              <line x1={padL} y1={y} x2={W - 4} y2={y} stroke="#3b82f6" strokeWidth={1} strokeDasharray="4 3" />
              <text x={padL + 2} y={y - 3} fontSize={9} fill="#3b82f6">Ø</text>
            </>
          )
        })()}

        {laps.map((ms, i) => {
          const h = (norm[i] / max) * chartH
          const x = padL + i * (barW + barGap)
          const y = padT + chartH - h
          const isHalf = i === 0
          let fill = '#1d4ed8'
          if (i === fastestIdx) fill = '#16a34a'
          else if (i === slowestIdx) fill = '#dc2626'
          else if (isHalf) fill = '#94a3b8'
          return (
            <g key={i}>
              <rect
                x={x} y={y} width={barW} height={h} rx={2}
                fill={fill}
                strokeDasharray={isHalf ? '3 2' : undefined}
                stroke={isHalf ? '#64748b' : undefined}
              />
              {/* Zeit über dem Balken */}
              <text x={x + barW / 2} y={y - 3} fontSize={8} fill="#374151" textAnchor="middle">
                {fmtMsShort(ms)}
              </text>
              {/* Rundennummer */}
              <text x={x + barW / 2} y={padT + chartH + 12} fontSize={9} fill="#6b7280" textAnchor="middle">
                {isHalf ? '½' : i}
              </text>
            </g>
          )
        })}
      </svg>
      <div className="flex flex-wrap gap-4 text-xs text-gray-600 mt-2 px-1">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-green-600 inline-block" /> schnellste Runde</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-600 inline-block" /> langsamste Runde</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-slate-400 inline-block" /> ½ Runde 200m (×2 skaliert)</span>
        <span className="flex items-center gap-1"><span className="w-4 border-t-2 border-dashed border-blue-500 inline-block" /> Ø 400m</span>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'

/** Minimal-Schnittstelle der Screen-Wake-Lock-API (vermeidet harte Typabhängigkeit). */
interface WakeLockSentinelLike {
  release: () => Promise<void>
  addEventListener: (type: 'release', listener: () => void) => void
}

/**
 * Hält das Display wach, solange `active` true ist (Screen Wake Lock API).
 *
 * Gedacht für den laufenden Test: Die Schüler*innen tragen das Handy in der Hand
 * und sollen sich selbst stoppen können, ohne dass sich der Bildschirm abschaltet.
 *
 * Die Sperre wird vom Browser automatisch freigegeben, wenn die Seite in den
 * Hintergrund wechselt (z.B. Display manuell gesperrt). Beim Zurückkehren in den
 * Vordergrund fordern wir sie deshalb erneut an.
 *
 * @returns true, wenn die Sperre aktuell aktiv ist (sonst false, z.B. wenn der
 *          Browser die API nicht unterstützt).
 */
export function useWakeLock(active: boolean): boolean {
  const sentinelRef = useRef<WakeLockSentinelLike | null>(null)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nav: any = typeof navigator !== 'undefined' ? navigator : null
    if (!active || !nav || !nav.wakeLock) return

    let cancelled = false

    const request = async () => {
      try {
        const sentinel: WakeLockSentinelLike = await nav.wakeLock.request('screen')
        if (cancelled) {
          sentinel.release().catch(() => {})
          return
        }
        sentinelRef.current = sentinel
        setIsActive(true)
        sentinel.addEventListener('release', () => {
          sentinelRef.current = null
          setIsActive(false)
        })
      } catch {
        // Anfrage abgelehnt oder Seite nicht im Vordergrund – still ignorieren.
        setIsActive(false)
      }
    }

    // Nach Rückkehr in den Vordergrund Sperre erneut anfordern.
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && sentinelRef.current === null) {
        request()
      }
    }

    request()
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', handleVisibility)
      const sentinel = sentinelRef.current
      sentinelRef.current = null
      setIsActive(false)
      sentinel?.release().catch(() => {})
    }
  }, [active])

  return isActive
}

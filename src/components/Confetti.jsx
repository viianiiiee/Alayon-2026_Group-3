import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const COLORS = ['#F59E0B', '#7C3AED', '#DC2626', '#10B981', '#3B82F6', '#EC4899', '#FCD34D', '#A78BFA']

export default function Confetti({ active, x = 0, y = 0, onDone }) {
  const doneRef = useRef(false)

  useEffect(() => {
    if (active && !doneRef.current) {
      doneRef.current = true
      const t = setTimeout(() => { doneRef.current = false; onDone?.() }, 1000)
      return () => clearTimeout(t)
    }
  }, [active, onDone])

  if (!active) return null

  return createPortal(
    <div style={{ position: 'fixed', left: x, top: y, pointerEvents: 'none', zIndex: 9998 }}>
      {Array.from({ length: 36 }, (_, i) => {
        const angle = (i / 36) * 360
        const dist = 60 + (i % 4) * 35
        const tx = Math.cos(angle * Math.PI / 180) * dist
        const ty = -(Math.sin(angle * Math.PI / 180) * dist * 0.6 + 40 + (i % 5) * 15)
        return (
          <div key={i} style={{
            position: 'absolute',
            width: `${5 + (i % 3) * 2}px`,
            height: `${5 + (i % 4) * 2}px`,
            borderRadius: i % 3 === 0 ? '50%' : i % 3 === 1 ? '2px' : '50% 0',
            background: COLORS[i % COLORS.length],
            '--tx': `${tx}px`,
            '--ty': `${ty}px`,
            '--rot': `${i * 47}deg`,
            animation: `confetti-fly ${0.55 + (i % 5) * 0.08}s ease-out ${(i % 6) * 0.03}s both`,
          }} />
        )
      })}
    </div>,
    document.body
  )
}

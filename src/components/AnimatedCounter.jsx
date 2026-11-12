import { useEffect, useRef, useState } from 'react'

export default function AnimatedCounter({ value, duration = 1200, prefix = '', suffix = '' }) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    const start = performance.now()
    const from = 0
    const to = Number(value)
    const step = ts => {
      const elapsed = ts - start
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(from + (to - from) * ease))
      if (progress < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [value, duration])

  return <span>{prefix}{display.toLocaleString()}{suffix}</span>
}

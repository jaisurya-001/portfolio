import { useEffect, useRef, useState } from 'react'

export function SpaceshipCursor() {
  const shipRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // Only enable on desktop pointer devices, non-reduced-motion, and decent hardware
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isCapable = (navigator.hardwareConcurrency ?? 8) > 2

    if (!isFinePointer || isReducedMotion || !isCapable) {
      return
    }

    setEnabled(true)

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let currentX = mouseX
    let currentY = mouseY
    let currentAngle = 0
    let rafId: number
    let isVisible = false

    const onPointerMove = (e: PointerEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!isVisible) {
        isVisible = true
        if (shipRef.current) shipRef.current.style.opacity = '1'
      }
    }

    const onPointerLeave = () => {
      isVisible = false
      if (shipRef.current) shipRef.current.style.opacity = '0'
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('mouseleave', onPointerLeave)

    const tick = () => {
      const dx = mouseX - currentX
      const dy = mouseY - currentY
      currentX += dx * 0.12
      currentY += dy * 0.12

      const targetAngle = Math.atan2(dy, dx) + Math.PI / 2
      // Smooth angle interpolation
      let diff = targetAngle - currentAngle
      while (diff < -Math.PI) diff += Math.PI * 2
      while (diff > Math.PI) diff -= Math.PI * 2
      currentAngle += diff * 0.15

      if (shipRef.current) {
        shipRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) rotate(${currentAngle}rad)`
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('mouseleave', onPointerLeave)
      cancelAnimationFrame(rafId)
    }
  }, [])

  if (!enabled) return null

  return (
    <div
      ref={shipRef}
      className="pointer-events-none fixed top-0 left-0 z-50 transition-opacity duration-300 will-change-transform"
      style={{ opacity: 0 }}
      aria-hidden="true"
    >
      <svg
        width="28"
        height="32"
        viewBox="0 0 28 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_10px_rgba(0,229,255,0.7)]"
      >
        {/* Thruster exhaust glow */}
        <polygon points="14,26 11,31 17,31" fill="#00e5ff" opacity="0.8" />
        <polygon points="14,25 12.5,29 15.5,29" fill="#ffffff" />
        {/* Main hull */}
        <polygon points="14,2 22,24 14,20 6,24" fill="#080c18" stroke="#00e5ff" strokeWidth="1.2" />
        {/* Wing accents */}
        <polygon points="14,6 20,22 14,19" fill="#8b5cf6" opacity="0.6" />
        <polygon points="14,6 8,22 14,19" fill="#8b5cf6" opacity="0.6" />
        {/* Cockpit canopy */}
        <circle cx="14" cy="11" r="2.2" fill="#00e5ff" />
      </svg>
    </div>
  )
}

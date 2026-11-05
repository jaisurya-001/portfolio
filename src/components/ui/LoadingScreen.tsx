import { useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'
import { profile } from '../../data/portfolio'
import { useStore } from '../../store/useStore'

interface LoadingScreenProps {
  webglReady: boolean
}

export function LoadingScreen({ webglReady }: LoadingScreenProps) {
  const { progress, active } = useProgress()
  const setIntroComplete = useStore((state) => state.setIntroComplete)
  const [phase, setPhase] = useState<'loading' | 'countdown' | 'done'>('loading')
  const [count, setCount] = useState<number | null>(null)
  const [displayProgress, setDisplayProgress] = useState(0)

  // Smooth progress increment
  useEffect(() => {
    const target = active ? Math.min(progress, 99) : 100
    const timer = window.setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev < target) return prev + 1
        if (!active && webglReady && prev >= 100) {
          window.clearInterval(timer)
          return 100
        }
        return prev
      })
    }, 15)
    return () => window.clearInterval(timer)
  }, [progress, active, webglReady])

  // Trigger countdown once loaded
  useEffect(() => {
    if (phase !== 'loading') return
    if (displayProgress >= 100 && webglReady) {
      const reducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (reducedMotion) {
        setPhase('done')
        setIntroComplete(true)
        return
      }

      setPhase('countdown')
      setCount(3)
    }
  }, [displayProgress, webglReady, phase, setIntroComplete])

  // Countdown timer
  useEffect(() => {
    if (phase !== 'countdown' || count === null) return
    if (count > 0) {
      const timer = window.setTimeout(() => {
        setCount((prev) => (prev !== null ? prev - 1 : null))
      }, 700)
      return () => window.clearTimeout(timer)
    }
    if (count === 0) {
      const timer = window.setTimeout(() => {
        setPhase('done')
        setIntroComplete(true)
      }, 500)
      return () => window.clearTimeout(timer)
    }
  }, [phase, count, setIntroComplete])

  const isVisible = phase !== 'done'

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-void transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      role="status"
      aria-live="polite"
      aria-hidden={!isVisible}
    >
      <div className="w-[min(100%-2.5rem,400px)] text-center">
        <p className="font-display text-[10px] tracking-[0.3em] text-cyan uppercase">
          {phase === 'loading' ? 'Initializing launch sequence…' : 'Final countdown to launch'}
        </p>

        <h1 className="mt-4 font-grotesk text-3xl font-semibold tracking-wide text-white sm:text-4xl">
          {profile.name}
        </h1>
        <p className="mt-2 text-xs text-white/55 sm:text-sm">{profile.roles[0]}</p>

        {phase === 'loading' ? (
          <div className="mt-8 space-y-3">
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan to-solar shadow-[0_0_12px_rgba(0,229,255,0.8)] transition-all duration-150 ease-out"
                style={{ width: `${displayProgress}%` }}
              />
            </div>
            <div className="flex justify-between font-display text-[10px] tracking-[0.15em] text-white/40 uppercase">
              <span>Calibrating orbits</span>
              <span>{Math.round(displayProgress)}%</span>
            </div>
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center justify-center py-2">
            <span
              key={count}
              className="animate-ping-once font-display text-5xl font-bold tracking-widest text-cyan drop-shadow-[0_0_24px_rgba(0,229,255,0.9)] sm:text-6xl"
            >
              {count === 0 ? 'LIFTOFF' : count}
            </span>
            <span className="mt-3 font-display text-[10px] tracking-[0.25em] text-solar uppercase">
              {count === 0 ? 'Approaching system core' : 'Thrusters engaged'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

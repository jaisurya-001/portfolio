import { useEffect, useRef } from 'react'
import { BODIES } from '../../data/bodies'
import { profile, uiCopy } from '../../data/portfolio'
import { useStore } from '../../store/useStore'
import { Typewriter } from './Typewriter'

export function HelpModal() {
  const helpOpen = useStore((state) => state.helpOpen)
  const setHelpOpen = useStore((state) => state.setHelpOpen)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!helpOpen) return
    closeBtnRef.current?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || ((e.key === 'h' || e.key === 'H') && !e.ctrlKey && !e.metaKey && !e.altKey)) {
        e.preventDefault()
        setHelpOpen(false)
        return
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [helpOpen, setHelpOpen])

  if (!helpOpen) return null

  const shortcuts = [
    { key: '← / →', desc: 'Step to previous or next planetary sector' },
    { key: 'Scroll Wheel', desc: 'Scroll up/down to cycle through solar bodies' },
    { key: 'Esc', desc: 'Close open section panel or return to overview' },
    { key: 'H', desc: 'Toggle keyboard navigation shortcuts' },
    { key: 'Click Planet / Label', desc: 'Warp camera directly to any planet or moon' },
    { key: 'Explore / Quick View', desc: 'Switch between cinematic 3D and accessible quick view' },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 backdrop-blur-md p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) setHelpOpen(false)
      }}
    >
      <div
        ref={modalRef}
        className="glass relative w-[min(100%-2rem,480px)] rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(0,229,255,0.15)]"
      >
        <div className="flex items-center justify-between border-b border-cyan/20 pb-4">
          <div>
            <span className="font-display text-[10px] tracking-[0.25em] text-cyan uppercase">
              Mission Directives
            </span>
            <h2 id="help-title" className="font-grotesk text-xl font-bold text-white sm:text-2xl">
              Flight Controls & Navigation
            </h2>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            className="rounded-full border border-white/20 px-3 py-1 font-display text-[11px] tracking-wider text-white/80 uppercase hover:border-cyan hover:text-cyan focus:outline-none focus:ring-2 focus:ring-cyan"
            onClick={() => setHelpOpen(false)}
            aria-label="Close navigation help"
          >
            {uiCopy.close}
          </button>
        </div>

        <div className="mt-5 space-y-3.5">
          {shortcuts.map((sc) => (
            <div key={sc.key} className="flex items-center justify-between gap-4 text-xs sm:text-sm">
              <kbd className="shrink-0 rounded-lg border border-cyan/35 bg-cyan/10 px-2.5 py-1 font-display text-[11px] tracking-wider text-cyan">
                {sc.key}
              </kbd>
              <span className="text-right text-white/70">{sc.desc}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-cyan/15 pt-4 text-center">
          <p className="font-display text-[10px] tracking-widest text-white/40 uppercase">
            Press <kbd className="text-cyan">H</kbd> or <kbd className="text-cyan">Esc</kbd> anytime to dismiss
          </p>
        </div>
      </div>
    </div>
  )
}

export function JourneyProgress() {
  const focusId = useStore((state) => state.focusId)
  const isTransitioning = useStore((state) => state.isTransitioning)
  const navigate = useStore((state) => state.navigate)

  const activeBody = focusId ? BODIES.find((b) => b.id === focusId) : null

  return (
    <nav
      className="pointer-events-auto fixed bottom-5 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-1.5"
      aria-label="Journey progress"
    >
      <div className="flex h-4 items-center justify-center">
        {activeBody ? (
          <span className="font-display text-[10px] font-semibold tracking-[0.2em] text-cyan uppercase drop-shadow-[0_0_8px_rgba(0,229,255,0.7)]">
            {activeBody.name}
          </span>
        ) : (
          <span className="font-display text-[9px] tracking-[0.2em] text-white/45 uppercase">
            Solar Overview
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 rounded-full border border-cyan/25 bg-void/70 px-3.5 py-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(0,229,255,0.08)]">
        {BODIES.map((body, index) => {
          const isCurrent = focusId === body.id
          return (
            <button
              key={body.id}
              type="button"
              className={`rounded-full transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-cyan ${
                isCurrent
                  ? 'h-2.5 w-2.5 bg-cyan shadow-[0_0_10px_#00e5ff] scale-125'
                  : 'h-1.5 w-1.5 bg-white/30 hover:bg-white/70 hover:scale-110'
              }`}
              disabled={isTransitioning}
              onClick={() => navigate(body.id)}
              aria-label={`Jump to sector ${index + 1}: ${body.name}`}
              aria-current={isCurrent ? 'true' : undefined}
            />
          )
        })}
      </div>
    </nav>
  )
}

export function WarpLabel() {
  const warpLabel = useStore((state) => state.warpLabel)
  if (!warpLabel) return null
  return (
    <div
      className="pointer-events-none fixed top-24 left-1/2 z-40 -translate-x-1/2 rounded-full border border-cyan/40 bg-void/90 px-5 py-2 font-display text-[10px] tracking-[0.2em] text-cyan uppercase shadow-[0_0_20px_rgba(0,229,255,0.4)] backdrop-blur-md sm:top-6"
      role="status"
    >
      <span className="inline-block animate-pulse mr-2">✦</span>
      {warpLabel}
    </div>
  )
}

export function Overview() {
  const focusId = useStore((state) => state.focusId)
  const isTransitioning = useStore((state) => state.isTransitioning)
  const mode = useStore((state) => state.mode)
  const navigate = useStore((state) => state.navigate)
  const setMode = useStore((state) => state.setMode)
  if (mode !== '3d' || focusId || isTransitioning) return null

  return (
    <div className="pointer-events-none fixed bottom-18 left-4 z-20 sm:bottom-16 sm:left-8 w-[min(100%-2rem,440px)]">
      <div className="pointer-events-auto glass rounded-3xl p-6 sm:p-7 shadow-[0_0_40px_rgba(0,229,255,0.08)]">
        <p className="font-display text-[10px] tracking-[0.25em] text-cyan/70 uppercase">
          {profile.location}
        </p>
        <Typewriter
          as="h1"
          text={profile.name}
          speed={32}
          delay={80}
          className="mt-2 block font-grotesk text-3xl font-bold sm:text-4xl text-white"
        />
        <Typewriter
          as="p"
          text={profile.tagline}
          speed={18}
          delay={500}
          className="mt-3 text-sm leading-relaxed text-cyan/90 font-medium"
        />
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-full border border-solar/60 bg-solar/15 px-4 py-2 font-display text-[10px] tracking-[0.16em] text-solar uppercase hover:bg-solar/25 focus:outline-none focus:ring-2 focus:ring-solar transition-colors"
            onClick={() => navigate('mercury')}
          >
            {uiCopy.beginJourney}
          </button>
          <button
            type="button"
            className="rounded-full border border-cyan/40 bg-cyan/5 px-4 py-2 font-display text-[10px] tracking-[0.16em] text-cyan uppercase hover:bg-cyan/15 focus:outline-none focus:ring-2 focus:ring-cyan transition-colors"
            onClick={() => setMode('2d')}
          >
            {uiCopy.quickView}
          </button>
        </div>
      </div>
    </div>
  )
}

import { uiCopy } from '../../data/portfolio'
import { useStore, type ViewMode } from '../../store/useStore'

export function ModeToggle() {
  const mode = useStore((state) => state.mode)
  const setMode = useStore((state) => state.setMode)
  const isTransitioning = useStore((state) => state.isTransitioning)

  const buttonClass = (value: ViewMode) =>
    `px-3 py-1 font-display text-[10px] tracking-[0.14em] uppercase transition-colors ${
      mode === value
        ? 'bg-cyan/20 text-cyan font-semibold shadow-[inset_0_0_8px_rgba(0,229,255,0.2)]'
        : 'text-white/60 hover:text-white'
    }`

  return (
    <div
      className="inline-flex overflow-hidden rounded-full border border-cyan/30 bg-void/60 backdrop-blur-md"
      role="group"
      aria-label={uiCopy.viewMode}
    >
      <button
        type="button"
        className={buttonClass('3d')}
        aria-pressed={mode === '3d'}
        disabled={isTransitioning}
        onClick={() => setMode('3d')}
      >
        Explore (3D)
      </button>
      <button
        type="button"
        className={buttonClass('2d')}
        aria-pressed={mode === '2d'}
        disabled={isTransitioning}
        onClick={() => setMode('2d')}
      >
        Quick View (2D)
      </button>
    </div>
  )
}

export function HelpButton() {
  const toggleHelp = useStore((state) => state.toggleHelp)

  return (
    <button
      type="button"
      className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-cyan/30 bg-void/60 backdrop-blur-md text-[11px] font-display font-semibold text-cyan hover:border-cyan hover:bg-cyan/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan transition-colors"
      onClick={toggleHelp}
      aria-label="Open flight navigation help"
      title="Keyboard Shortcuts (H)"
    >
      H
    </button>
  )
}

export function TopControls() {
  return (
    <div className="fixed top-4 right-4 z-30 flex items-center gap-2">
      <ModeToggle />
      <HelpButton />
    </div>
  )
}

import { useEffect, useState, useRef } from 'react'
import { BODY_BY_ID, type BodyId } from '../../data/bodies'
import { sectionTitles, uiCopy } from '../../data/portfolio'
import { useStore } from '../../store/useStore'
import { sectionViews } from '../sections'

export function InfoPanel() {
  const panelOpen = useStore((state) => state.panelOpen)
  const focusId = useStore((state) => state.focusId)
  const navigate = useStore((state) => state.navigate)
  const [shown, setShown] = useState<BodyId | null>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const panelRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (focusId) setShown(focusId)
  }, [focusId])

  // Focus trap & restoration
  useEffect(() => {
    if (panelOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement
      // Small delay to allow transition
      const timer = window.setTimeout(() => {
        closeBtnRef.current?.focus()
      }, 100)
      return () => window.clearTimeout(timer)
    } else {
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus()
      }
    }
  }, [panelOpen])

  // Escape key handler on panel
  useEffect(() => {
    if (!panelOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        navigate(null)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [panelOpen, navigate])

  const activeId = focusId ?? shown
  if (!activeId) return null

  const body = BODY_BY_ID[activeId]
  const Section = sectionViews[body.section]

  return (
    <aside
      ref={panelRef}
      data-panel
      role="dialog"
      aria-modal={panelOpen}
      aria-hidden={!panelOpen}
      aria-label={`${body.name}, ${sectionTitles[body.section]}`}
      className={`glass fixed top-0 right-0 z-40 flex h-full w-full flex-col bg-[rgba(5,6,15,0.85)] transition-transform duration-500 ease-out sm:w-[440px] ${
        panelOpen ? 'translate-x-0' : 'pointer-events-none translate-x-full'
      }`}
    >
      <div className="flex items-start justify-between gap-4 border-b border-cyan/20 px-6 py-5">
        <div>
          <p className="font-display text-[10px] tracking-[0.25em] text-cyan font-semibold uppercase">
            {body.name}
          </p>
          <p className="font-grotesk text-base font-semibold text-white/80">
            {sectionTitles[body.section]}
          </p>
        </div>
        <button
          ref={closeBtnRef}
          type="button"
          className="rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 font-display text-[10px] tracking-[0.14em] text-white/90 uppercase hover:border-cyan hover:text-cyan focus:outline-none focus:ring-2 focus:ring-cyan transition-colors"
          onClick={() => navigate(null)}
          aria-label={`Close ${body.name} information panel`}
        >
          {uiCopy.close}
        </button>
      </div>
      <div className="scroll-thin min-h-0 flex-1 overflow-y-auto px-6 py-6 text-white/90">
        <Section />
      </div>
    </aside>
  )
}

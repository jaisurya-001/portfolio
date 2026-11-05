import { create } from 'zustand'
import { BODY_BY_ID, BODY_ORDER, type BodyId } from '../data/bodies'
import { uiCopy } from '../data/portfolio'

export type ViewMode = '3d' | '2d'

interface PortfolioState {
  focusId: BodyId | null
  isTransitioning: boolean
  mode: ViewMode
  panelOpen: boolean
  warpLabel: string | null
  flightId: number
  introComplete: boolean
  helpOpen: boolean
  navigate: (id: BodyId | null) => void
  finishTransition: () => void
  setMode: (mode: ViewMode) => void
  step: (direction: 1 | -1) => void
  setIntroComplete: (complete: boolean) => void
  setHelpOpen: (open: boolean) => void
  toggleHelp: () => void
}

export const useStore = create<PortfolioState>((set, get) => ({
  focusId: null,
  isTransitioning: false,
  mode: '3d',
  panelOpen: false,
  warpLabel: null,
  flightId: 0,
  introComplete: false,
  helpOpen: false,
  navigate: (id) => {
    const state = get()
    if (state.isTransitioning || state.mode !== '3d') return
    if (id === state.focusId) {
      set({ panelOpen: id !== null })
      return
    }
    set({
      focusId: id,
      isTransitioning: true,
      panelOpen: false,
      warpLabel: id ? uiCopy.warping(BODY_BY_ID[id].name) : uiCopy.returning,
      flightId: state.flightId + 1,
    })
  },
  finishTransition: () => {
    const { focusId } = get()
    set({
      isTransitioning: false,
      warpLabel: null,
      panelOpen: focusId !== null,
    })
  },
  setMode: (mode) => {
    const state = get()
    if (state.isTransitioning || state.mode === mode) return
    set({
      mode,
      panelOpen: false,
    })
  },
  step: (direction) => {
    const { focusId, navigate } = get()
    const index = focusId ? BODY_ORDER.indexOf(focusId) : direction === 1 ? -1 : 0
    const next = BODY_ORDER[(index + direction + BODY_ORDER.length) % BODY_ORDER.length]
    navigate(next)
  },
  setIntroComplete: (introComplete) => set({ introComplete }),
  setHelpOpen: (helpOpen) => set({ helpOpen }),
  toggleHelp: () => set((state) => ({ helpOpen: !state.helpOpen })),
}))

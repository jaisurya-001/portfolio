import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { CameraRig } from './components/scene/CameraRig'
import { SolarSystem } from './components/scene/SolarSystem'
import { Starfield } from './components/scene/Starfield'
import { FlatView } from './components/ui/FlatView'
import { HelpModal, JourneyProgress, Overview, WarpLabel } from './components/ui/HUD'
import { InfoPanel } from './components/ui/InfoPanel'
import { LoadingScreen } from './components/ui/LoadingScreen'
import { TopControls } from './components/ui/ModeToggle'
import { SpaceshipCursor } from './components/ui/SpaceshipCursor'
import { useStore } from './store/useStore'

function useMissionInput() {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target
      if (target instanceof HTMLElement && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return
      const { mode, isTransitioning, focusId, setMode, step, navigate, toggleHelp, helpOpen, setHelpOpen } =
        useStore.getState()
      if (event.key.toLowerCase() === 'h' && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault()
        toggleHelp()
        return
      }
      if (event.key === 'Escape' && helpOpen) {
        event.preventDefault()
        setHelpOpen(false)
        return
      }
      if (isTransitioning) return
      if (mode !== '3d') {
        if (event.key === 'Escape') setMode('3d')
        return
      }
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault()
        step(1)
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault()
        step(-1)
      } else if (event.key === 'Escape') {
        if (focusId) {
          navigate(null)
        }
      }
    }

    let lastWheel = 0
    const onWheel = (event: WheelEvent) => {
      const state = useStore.getState()
      if (state.mode !== '3d') return
      const panel = document.querySelector('[data-panel]')
      if (state.panelOpen && panel && event.target instanceof Node && panel.contains(event.target)) return
      event.preventDefault()
      if (state.isTransitioning) return
      if (Math.abs(event.deltaY) < 8) return
      const now = performance.now()
      if (now - lastWheel < 900) return
      lastWheel = now
      state.step(event.deltaY > 0 ? 1 : -1)
    }

    window.addEventListener('keydown', onKey)
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('wheel', onWheel)
    }
  }, [])
}

export default function App() {
  const mode = useStore((state) => state.mode)
  const [webglReady, setWebglReady] = useState(false)
  useMissionInput()

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-void text-white">
      <Canvas
        className={mode === '3d' ? 'block h-full w-full' : 'invisible h-full w-full'}
        dpr={[1, 1.5]}
        frameloop={mode === '3d' ? 'always' : 'never'}
        camera={{ position: [0, 32, 65], fov: 42, near: 0.1, far: 240 }}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor('#05060f')
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.05
          setWebglReady(true)
        }}
      >
        <color attach="background" args={['#05060f']} />
        <Suspense fallback={null}>
          <SolarSystem />
          <Starfield />
        </Suspense>
        <CameraRig />
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom intensity={0.42} luminanceThreshold={0.8} mipmapBlur />
          <Vignette eskil={false} offset={0.22} darkness={0.7} />
        </EffectComposer>
      </Canvas>
      {mode === '3d' ? (
        <>
          <TopControls />
          <JourneyProgress />
          <Overview />
          <WarpLabel />
          <InfoPanel />
        </>
      ) : (
        <FlatView />
      )}
      <HelpModal />
      <LoadingScreen webglReady={webglReady} />
      <SpaceshipCursor />
    </div>
  )
}

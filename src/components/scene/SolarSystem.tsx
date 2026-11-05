import { useFrame } from '@react-three/fiber'
import { BODIES } from '../../data/bodies'
import { useStore } from '../../store/useStore'
import { angles, poses } from './poses'
import { Sun } from './Sun'
import { Planet } from './Planet'
import { OrbitRing } from './OrbitRing'
import { AsteroidBelt } from './AsteroidBelt'

export function SolarSystem() {
  useFrame((_, delta) => {
    const { panelOpen, isTransitioning } = useStore.getState()
    if (panelOpen || isTransitioning) return
    for (const body of BODIES) {
      if (body.orbit === 0) continue
      angles[body.id] += delta * body.orbitSpeed
      const angle = angles[body.id]
      poses[body.id].set(Math.cos(angle) * body.orbit, 0, Math.sin(angle) * body.orbit)
    }
  })

  return (
    <>
      <ambientLight intensity={0.22} />
      <pointLight position={[0, 0, 0]} intensity={90} distance={100} decay={2} color="#ffe2b8" />
      <directionalLight position={[12, 18, 8]} intensity={0.85} color="#d7f4ff" />
      <Sun />
      {BODIES.filter((body) => body.id !== 'sun' && body.id !== 'asteroids').map((body) => (
        <group key={body.id}>
          <OrbitRing radius={body.orbit} />
          <Planet body={body} />
        </group>
      ))}
      <OrbitRing radius={BODIES.find((body) => body.id === 'asteroids')!.orbit} opacity={0.22} />
      <AsteroidBelt />
    </>
  )
}

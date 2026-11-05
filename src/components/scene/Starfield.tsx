import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'
import { nebulaFragment, nebulaVertex } from './shaders'

interface ShootingStarData {
  mesh: THREE.Line | null
  pos: THREE.Vector3
  dir: THREE.Vector3
  speed: number
  length: number
  progress: number
  active: boolean
  timer: number
}

function ShootingStars() {
  const lineCount = 3
  const linesRef = useRef<THREE.Line[]>([])

  const data = useMemo<ShootingStarData[]>(() => {
    return Array.from({ length: lineCount }, () => ({
      mesh: null,
      pos: new THREE.Vector3(),
      dir: new THREE.Vector3(),
      speed: 35 + Math.random() * 25,
      length: 6 + Math.random() * 4,
      progress: 0,
      active: false,
      timer: 1 + Math.random() * 4,
    }))
  }, [])

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    const positions = new Float32Array([0, 0, 0, 0, 0, -1])
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geom
  }, [])

  useFrame((_, delta) => {
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    for (let i = 0; i < data.length; i += 1) {
      const star = data[i]
      const line = linesRef.current[i]
      if (!line) continue

      if (!star.active) {
        star.timer -= delta
        if (star.timer <= 0) {
          // Trigger new streak
          star.active = true
          star.progress = 0
          star.speed = 35 + Math.random() * 25
          // Random point on upper hemisphere
          const theta = Math.random() * Math.PI * 2
          const phi = 0.2 + Math.random() * 0.9
          const r = 70 + Math.random() * 20
          star.pos.set(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.cos(phi),
            r * Math.sin(phi) * Math.sin(theta),
          )
          // Direction pointing roughly down and across
          star.dir.set(
            (Math.random() - 0.5) * 1.5,
            -0.8 - Math.random() * 0.5,
            (Math.random() - 0.5) * 1.5,
          ).normalize()

          line.position.copy(star.pos)
          line.lookAt(star.pos.clone().add(star.dir))
          line.scale.set(1, 1, star.length)
          line.visible = true
        }
      } else {
        star.progress += delta * (star.speed / 25)
        star.pos.addScaledVector(star.dir, star.speed * delta)
        line.position.copy(star.pos)

        // Fade in and out
        const alpha = Math.sin(star.progress * Math.PI)
        const mat = line.material as THREE.LineBasicMaterial
        mat.opacity = Math.max(0, Math.min(1, alpha * 0.9))

        if (star.progress >= 1) {
          star.active = false
          line.visible = false
          star.timer = 3 + Math.random() * 6
        }
      }
    }
  })

  return (
    <group>
      {Array.from({ length: lineCount }).map((_, i) => (
        <primitive
          key={i}
          object={
            new THREE.Line(
              geometry,
              new THREE.LineBasicMaterial({
                color: '#e0faff',
                transparent: true,
                opacity: 0,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
              }),
            )
          }
          ref={(el: THREE.Line) => {
            if (el) {
              linesRef.current[i] = el
              data[i].mesh = el
              el.visible = false
            }
          }}
        />
      ))}
    </group>
  )
}

export function Starfield() {
  const nebulaMaterialRef = useRef<THREE.ShaderMaterial>(null)

  useFrame((_, delta) => {
    if (nebulaMaterialRef.current) {
      nebulaMaterialRef.current.uniforms.uTime.value += delta
    }
  })

  return (
    <>
      <Stars
        radius={120}
        depth={60}
        count={3500}
        factor={2.6}
        saturation={0}
        fade
        speed={0.35}
      />

      {/* Procedural Nebula sphere */}
      <mesh scale={[-160, 160, 160]} raycast={() => null}>
        <sphereGeometry args={[1, 32, 32]} />
        <shaderMaterial
          ref={nebulaMaterialRef}
          vertexShader={nebulaVertex}
          fragmentShader={nebulaFragment}
          uniforms={{ uTime: { value: 0 } }}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <ShootingStars />
    </>
  )
}

import { useLayoutEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { BodyDef } from '../../data/bodies'
import { useStore } from '../../store/useStore'
import { poses } from './poses'
import { BodyLabel } from './BodyLabel'
import { planetFragment, planetVertex, ringFragment, ringVertex } from './shaders'

const scratchQ = new THREE.Quaternion()
const scratchP = new THREE.Vector3()
const scratchL = new THREE.Vector3()

interface PlanetProps {
  body: BodyDef
}

export function Planet({ body }: PlanetProps) {
  const group = useRef<THREE.Group>(null)
  const spin = useRef<THREE.Mesh>(null)
  const moon = useRef<THREE.Group>(null)
  const moonAngle = useRef(0.6)
  const hover = useRef(false)
  const focused = useStore((state) => state.focusId === body.id)

  useLayoutEffect(() => {
    group.current?.position.copy(poses[body.id])
  }, [body.id])

  useFrame((_, delta) => {
    const root = group.current
    const mesh = spin.current
    if (!root || !mesh) return
    root.position.copy(poses[body.id])
    mesh.rotation.y += delta * body.spinSpeed

    mesh.getWorldPosition(scratchP)
    mesh.getWorldQuaternion(scratchQ)
    scratchL.copy(scratchP).negate()
    if (scratchL.lengthSq() < 1e-6) scratchL.set(0.2, 0.8, 0.4)
    scratchL.normalize().applyQuaternion(scratchQ.invert())
    const material = mesh.material as THREE.ShaderMaterial
    material.uniforms.uLightDir.value.copy(scratchL)
    material.uniforms.uTime.value += delta

    const goal = hover.current || focused ? 1.06 : 1
    mesh.scale.setScalar(THREE.MathUtils.damp(mesh.scale.x, goal, 6, delta))

    if (body.id === 'earth' && moon.current) {
      const paused = useStore.getState().panelOpen || useStore.getState().isTransitioning
      if (!paused) moonAngle.current += delta * 0.85
      const angle = moonAngle.current
      moon.current.position.set(Math.cos(angle) * 0.95, 0.05, Math.sin(angle) * 0.95)
    }
  })

  return (
    <group ref={group}>
      <BodyLabel
        text={body.name}
        position={[0, body.radius + 0.42, 0]}
        onClick={() => useStore.getState().navigate(body.id)}
      />
      <group rotation={[0, 0, body.tilt]}>
        <mesh
          ref={spin}
          onClick={(event) => {
            event.stopPropagation()
            useStore.getState().navigate(body.id)
          }}
          onPointerOver={(event) => {
            event.stopPropagation()
            hover.current = true
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            hover.current = false
            document.body.style.cursor = 'default'
          }}
        >
          <sphereGeometry args={[body.radius, 48, 48]} />
          <shaderMaterial
            uniforms={{
              uColorA: { value: new THREE.Color(body.colors[0]) },
              uColorB: { value: new THREE.Color(body.colors[1]) },
              uLightDir: { value: new THREE.Vector3(0.4, 0.7, 0.4) },
              uBands: { value: body.bands },
              uSeed: { value: body.seed },
              uTime: { value: 0 },
              uNoiseAmt: { value: body.noise },
            }}
            vertexShader={planetVertex}
            fragmentShader={planetFragment}
          />
        </mesh>
        {body.id === 'saturn' && (
          <mesh rotation={[Math.PI / 2.35, 0, 0]} raycast={() => null}>
            <ringGeometry args={[1.35, 2.25, 96]} />
            <shaderMaterial
              transparent
              depthWrite={false}
              side={THREE.DoubleSide}
              uniforms={{ uColor: { value: new THREE.Color('#e6d3a8') } }}
              vertexShader={ringVertex}
              fragmentShader={ringFragment}
            />
          </mesh>
        )}
        {body.id === 'earth' && (
          <group ref={moon}>
            <mesh raycast={() => null}>
              <sphereGeometry args={[0.12, 20, 20]} />
              <shaderMaterial
                uniforms={{
                  uColorA: { value: new THREE.Color('#d9dde4') },
                  uColorB: { value: new THREE.Color('#8d93a0') },
                  uLightDir: { value: new THREE.Vector3(0.5, 0.6, 0.4) },
                  uBands: { value: 2 },
                  uSeed: { value: 12.5 },
                  uTime: { value: 0 },
                  uNoiseAmt: { value: 5 },
                }}
                vertexShader={planetVertex}
                fragmentShader={planetFragment}
              />
            </mesh>
          </group>
        )}
      </group>
      {focused && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
          <ringGeometry args={[body.radius * 1.55, body.radius * 1.72, 64]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}

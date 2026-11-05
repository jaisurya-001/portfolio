import { useLayoutEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { BODY_BY_ID } from '../../data/bodies'
import { useStore } from '../../store/useStore'
import { poses } from './poses'
import { BodyLabel } from './BodyLabel'

const COUNT = 520

export function AsteroidBelt() {
  const body = BODY_BY_ID.asteroids
  const mesh = useRef<THREE.InstancedMesh>(null)
  const spin = useRef<THREE.Group>(null)
  const anchor = useRef<THREE.Group>(null)
  const hover = useRef(false)

  useLayoutEffect(() => {
    const instanced = mesh.current
    if (!instanced) return
    const dummy = new THREE.Object3D()
    const color = new THREE.Color()
    for (let index = 0; index < COUNT; index += 1) {
      const angle = Math.random() * Math.PI * 2
      const radius = body.orbit + (Math.random() - 0.5) * 1.35
      dummy.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 0.42,
        Math.sin(angle) * radius,
      )
      dummy.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6)
      dummy.scale.setScalar(0.025 + Math.random() * 0.07)
      dummy.updateMatrix()
      instanced.setMatrixAt(index, dummy.matrix)
      color.setHSL(0.07, 0.08, 0.32 + Math.random() * 0.28)
      instanced.setColorAt(index, color)
    }
    instanced.instanceMatrix.needsUpdate = true
    if (instanced.instanceColor) instanced.instanceColor.needsUpdate = true
  }, [body.orbit])

  useFrame((_, delta) => {
    const anchorGroup = anchor.current
    const rockGroup = spin.current
    if (anchorGroup) anchorGroup.position.copy(poses.asteroids)
    if (!rockGroup) return
    const paused = useStore.getState().panelOpen || useStore.getState().isTransitioning
    if (!paused) rockGroup.rotation.y += delta * body.spinSpeed
  })

  return (
    <group>
      <group ref={spin}>
        <instancedMesh
          ref={mesh}
          args={[undefined, undefined, COUNT]}
          raycast={() => null}
          frustumCulled={false}
        >
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial roughness={0.86} metalness={0.08} />
        </instancedMesh>
      </group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(event) => {
          event.stopPropagation()
          useStore.getState().navigate('asteroids')
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
        <torusGeometry args={[body.orbit, 0.62, 6, 96]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>
      <group ref={anchor}>
        <BodyLabel
          text={body.name}
          position={[0, 0.7, 0]}
          onClick={() => useStore.getState().navigate('asteroids')}
        />
      </group>
    </group>
  )
}

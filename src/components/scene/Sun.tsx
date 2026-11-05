import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { BODY_BY_ID } from '../../data/bodies'
import { useStore } from '../../store/useStore'
import { BodyLabel } from './BodyLabel'
import { sunFragment, sunVertex } from './shaders'

function createGlowTexture() {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255, 246, 220, 0.95)')
  gradient.addColorStop(0.16, 'rgba(255, 179, 71, 0.5)')
  gradient.addColorStop(0.4, 'rgba(255, 122, 32, 0.14)')
  gradient.addColorStop(1, 'rgba(255, 122, 32, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export function Sun() {
  const body = BODY_BY_ID.sun
  const spin = useRef<THREE.Mesh>(null)
  const hover = useRef(false)
  const focused = useStore((state) => state.focusId === 'sun')
  const glow = useMemo(() => createGlowTexture(), [])

  useEffect(() => {
    return () => {
      glow?.dispose()
    }
  }, [glow])

  useFrame((_, delta) => {
    const mesh = spin.current
    if (!mesh) return
    mesh.rotation.y += delta * body.spinSpeed
    const material = mesh.material as THREE.ShaderMaterial
    material.uniforms.uTime.value += delta
    const goal = hover.current || focused ? 1.04 : 1
    const next = THREE.MathUtils.damp(mesh.scale.x, goal, 5, delta)
    mesh.scale.setScalar(next)
  })

  return (
    <group>
      <BodyLabel
        text={body.name}
        position={[0, body.radius + 0.55, 0]}
        onClick={() => useStore.getState().navigate('sun')}
      />
      <mesh
        ref={spin}
        onClick={(event) => {
          event.stopPropagation()
          useStore.getState().navigate('sun')
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
        <sphereGeometry args={[body.radius, 64, 64]} />
        <shaderMaterial
          uniforms={{ uTime: { value: 0 } }}
          vertexShader={sunVertex}
          fragmentShader={sunFragment}
          toneMapped={false}
        />
      </mesh>
      {glow && (
        <sprite scale={[10.5, 10.5, 1]} raycast={() => null}>
          <spriteMaterial
            map={glow}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </sprite>
      )}
      {focused && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
          <ringGeometry args={[body.radius * 1.35, body.radius * 1.48, 64]} />
          <meshBasicMaterial color="#ffb347" transparent opacity={0.75} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}

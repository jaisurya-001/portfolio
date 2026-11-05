import * as THREE from 'three'

interface OrbitRingProps {
  radius: number
  opacity?: number
  color?: string
}

export function OrbitRing({ radius, opacity = 0.16, color = '#00e5ff' }: OrbitRingProps) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
      <ringGeometry args={[radius - 0.012, radius + 0.012, 192]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

import * as THREE from 'three'
import { BODIES, type BodyId } from '../../data/bodies'

export const poses: Record<BodyId, THREE.Vector3> = {} as Record<BodyId, THREE.Vector3>
export const angles: Record<BodyId, number> = {} as Record<BodyId, number>

for (const body of BODIES) {
  angles[body.id] = body.initialAngle
  poses[body.id] = new THREE.Vector3(
    Math.cos(body.initialAngle) * body.orbit,
    0,
    Math.sin(body.initialAngle) * body.orbit,
  )
}

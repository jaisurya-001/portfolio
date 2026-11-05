import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { PerspectiveCamera } from 'three'
import * as THREE from 'three'
import gsap from 'gsap'
import { BODY_BY_ID, type BodyId } from '../../data/bodies'
import { useStore } from '../../store/useStore'
import { poses } from './poses'

const up = new THREE.Vector3(0, 1, 0)
const outward = new THREE.Vector3()
const forward = new THREE.Vector3()
const right = new THREE.Vector3()
const point = new THREE.Vector3()
const lookNow = new THREE.Vector3()

function overviewPosition(time: number, target: THREE.Vector3) {
  target.set(
    Math.sin(time * 0.08) * 1.8,
    16 + Math.sin(time * 0.05) * 0.7,
    36 + Math.cos(time * 0.06) * 1.1,
  )
}

function frameBody(id: BodyId, position: THREE.Vector3, look: THREE.Vector3) {
  const body = BODY_BY_ID[id]
  const planet = poses[id]
  const distance = body.focusDistance
  outward.copy(planet)
  if (outward.lengthSq() < 1e-4) outward.set(0.35, 0.2, 1)
  outward.normalize()
  position.copy(planet).addScaledVector(outward, distance)
  position.y += distance * 0.3
  forward.copy(outward).negate()
  right.crossVectors(forward, up)
  if (right.lengthSq() < 1e-6) right.set(1, 0, 0)
  right.normalize()
  look.copy(planet).addScaledVector(right, distance * 0.32)
}

export function CameraRig() {
  const camera = useThree((state) => state.camera)
  const clock = useThree((state) => state.clock)
  const flightId = useStore((state) => state.flightId)
  const introComplete = useStore((state) => state.introComplete)
  const animating = useRef(false)
  const introPushed = useRef(false)
  const lastLook = useRef(new THREE.Vector3(0, 0, 0))
  const cameraRef = useRef(camera)
  const clockRef = useRef(clock)
  cameraRef.current = camera
  clockRef.current = clock

  // Cinematic intro push-in toward the Sun
  useEffect(() => {
    if (!introComplete || introPushed.current) return
    introPushed.current = true

    const activeCamera = cameraRef.current as PerspectiveCamera
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      overviewPosition(clockRef.current.elapsedTime, activeCamera.position)
      activeCamera.lookAt(0, 0, 0)
      return
    }

    activeCamera.position.set(0, 32, 65)
    activeCamera.lookAt(0, 0, 0)
    animating.current = true

    const targetPos = new THREE.Vector3()
    overviewPosition(clockRef.current.elapsedTime, targetPos)

    gsap.to(activeCamera.position, {
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z,
      duration: 2.2,
      ease: 'power2.out',
      onUpdate: () => {
        activeCamera.lookAt(0, 0, 0)
      },
      onComplete: () => {
        animating.current = false
      },
    })
  }, [introComplete])

  // Planet flight transitions
  useEffect(() => {
    if (flightId === 0) return
    const activeCamera = cameraRef.current as PerspectiveCamera
    const focusId = useStore.getState().focusId
    const start = activeCamera.position.clone()
    const end = new THREE.Vector3()
    const lookStart = lastLook.current.clone()
    const lookEnd = new THREE.Vector3()

    if (focusId) {
      frameBody(focusId, end, lookEnd)
    } else {
      overviewPosition(clockRef.current.elapsedTime, end)
      lookEnd.set(0, 0, 0)
    }

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      activeCamera.position.copy(end)
      activeCamera.up.copy(up)
      activeCamera.lookAt(lookEnd)
      lastLook.current.copy(lookEnd)
      useStore.getState().finishTransition()
      return
    }

    const mid = start.clone().lerp(end, 0.5)
    const span = Math.max(start.distanceTo(end), 0.001)
    mid.y += Math.max(2.4, span * 0.2)
    const lateral = end.clone().sub(start)
    if (lateral.lengthSq() < 1e-4) lateral.set(0, 0, 1)
    lateral.normalize()
    const bend = new THREE.Vector3().crossVectors(lateral, up)
    if (bend.lengthSq() < 1e-4) bend.set(1, 0, 0)
    mid.addScaledVector(bend.normalize(), span * 0.12)

    const curve = new THREE.CatmullRomCurve3([start, mid, end])
    const proxy = { t: 0 }
    animating.current = true
    const duration = THREE.MathUtils.clamp(span / 16, 1.55, 2.7)

    const tween = gsap.to(proxy, {
      t: 1,
      duration,
      ease: 'power2.inOut',
      onUpdate: () => {
        curve.getPoint(proxy.t, point)
        activeCamera.position.copy(point)
        lookNow.lerpVectors(lookStart, lookEnd, proxy.t)
        activeCamera.up.copy(up)
        activeCamera.lookAt(lookNow)
      },
      onComplete: () => {
        activeCamera.position.copy(end)
        activeCamera.up.copy(up)
        activeCamera.lookAt(lookEnd)
        lastLook.current.copy(lookEnd)
        animating.current = false
        useStore.getState().finishTransition()
      },
    })

    return () => {
      tween.kill()
    }
  }, [flightId])

  useFrame(() => {
    if (animating.current) return
    const { focusId, mode } = useStore.getState()
    if (focusId || mode !== '3d') return
    const activeCamera = camera as PerspectiveCamera
    overviewPosition(clock.elapsedTime, activeCamera.position)
    activeCamera.up.copy(up)
    activeCamera.lookAt(0, 0, 0)
    lastLook.current.set(0, 0, 0)
  })

  return null
}

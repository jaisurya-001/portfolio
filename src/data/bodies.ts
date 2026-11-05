import type { SectionId } from './portfolio'

export type BodyId =
  | 'sun'
  | 'mercury'
  | 'venus'
  | 'earth'
  | 'mars'
  | 'asteroids'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'

export interface BodyDef {
  id: BodyId
  name: string
  section: SectionId
  /** Artistic orbit radius. Not to scale. */
  orbit: number
  radius: number
  /** Camera pull-back after arrival so the body sits left of the panel. */
  focusDistance: number
  orbitSpeed: number
  spinSpeed: number
  /** Axial tilt in radians. */
  tilt: number
  initialAngle: number
  colors: [string, string]
  bands: number
  noise: number
  seed: number
}

export const BODIES: BodyDef[] = [
  {
    id: 'sun',
    name: 'Sun',
    section: 'hero',
    orbit: 0,
    radius: 1.65,
    focusDistance: 8.2,
    orbitSpeed: 0,
    spinSpeed: 0.06,
    tilt: 0.09,
    initialAngle: 0,
    colors: ['#ffb347', '#ff6a1a'],
    bands: 5,
    noise: 2.4,
    seed: 1.3,
  },
  {
    id: 'mercury',
    name: 'Mercury',
    section: 'skills',
    orbit: 4.5,
    radius: 0.28,
    focusDistance: 3.2,
    orbitSpeed: 0.2,
    spinSpeed: 0.32,
    tilt: 0.04,
    initialAngle: 0.45,
    colors: ['#c8c2b8', '#6e675f'],
    bands: 3,
    noise: 6.5,
    seed: 2.2,
  },
  {
    id: 'venus',
    name: 'Venus',
    section: 'education',
    orbit: 6.5,
    radius: 0.46,
    focusDistance: 4.1,
    orbitSpeed: 0.15,
    spinSpeed: 0.08,
    tilt: 2.55,
    initialAngle: 1.75,
    colors: ['#f0d7a2', '#c48945'],
    bands: 2.4,
    noise: 1.4,
    seed: 4.6,
  },
  {
    id: 'earth',
    name: 'Earth',
    section: 'about',
    orbit: 8.7,
    radius: 0.5,
    focusDistance: 4.4,
    orbitSpeed: 0.11,
    spinSpeed: 0.42,
    tilt: 0.41,
    initialAngle: 2.85,
    colors: ['#1f6fbf', '#3e9a62'],
    bands: 4,
    noise: 3.2,
    seed: 8.4,
  },
  {
    id: 'mars',
    name: 'Mars',
    section: 'achievements',
    orbit: 10.9,
    radius: 0.36,
    focusDistance: 3.6,
    orbitSpeed: 0.09,
    spinSpeed: 0.4,
    tilt: 0.44,
    initialAngle: 4.15,
    colors: ['#d15a38', '#7c301c'],
    bands: 6,
    noise: 4.2,
    seed: 3.4,
  },
  {
    id: 'asteroids',
    name: 'Asteroid Belt',
    section: 'interests',
    orbit: 13.3,
    radius: 0.4,
    focusDistance: 7.2,
    orbitSpeed: 0.028,
    spinSpeed: 0.02,
    tilt: 0,
    initialAngle: 0.85,
    colors: ['#b1a89c', '#5e574f'],
    bands: 0,
    noise: 1,
    seed: 1,
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    section: 'projects',
    orbit: 16.8,
    radius: 1.18,
    focusDistance: 8.8,
    orbitSpeed: 0.05,
    spinSpeed: 0.62,
    tilt: 0.05,
    initialAngle: 5.35,
    colors: ['#e6c49a', '#c56b3a'],
    bands: 18,
    noise: 1.6,
    seed: 6.7,
  },
  {
    id: 'saturn',
    name: 'Saturn',
    section: 'certifications',
    orbit: 20.8,
    radius: 0.96,
    focusDistance: 10.2,
    orbitSpeed: 0.038,
    spinSpeed: 0.5,
    tilt: 0.47,
    initialAngle: 1.2,
    colors: ['#f0dfb4', '#c9a56a'],
    bands: 11,
    noise: 1.8,
    seed: 9.2,
  },
  {
    id: 'uranus',
    name: 'Uranus',
    section: 'objective',
    orbit: 24.4,
    radius: 0.68,
    focusDistance: 6.4,
    orbitSpeed: 0.028,
    spinSpeed: 0.3,
    tilt: 1.71,
    initialAngle: 2.45,
    colors: ['#9aebef', '#3f8fb8'],
    bands: 5,
    noise: 2.2,
    seed: 5.6,
  },
  {
    id: 'neptune',
    name: 'Neptune',
    section: 'contact',
    orbit: 27.8,
    radius: 0.66,
    focusDistance: 6.1,
    orbitSpeed: 0.022,
    spinSpeed: 0.34,
    tilt: 0.49,
    initialAngle: 4.55,
    colors: ['#4a63e0', '#1a348f'],
    bands: 7,
    noise: 2.6,
    seed: 7.8,
  },
]

export const BODY_ORDER: BodyId[] = BODIES.map((body) => body.id)

export const BODY_BY_ID = Object.fromEntries(BODIES.map((body) => [body.id, body])) as Record<
  BodyId,
  BodyDef
>

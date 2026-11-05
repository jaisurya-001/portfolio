import type { ComponentType } from 'react'
import type { SectionId } from '../../data/portfolio'
import { Hero } from './Hero'
import { Skills } from './Skills'
import { Education } from './Education'
import { About } from './About'
import { Achievements } from './Achievements'
import { Interests } from './Interests'
import { Projects } from './Projects'
import { Certifications } from './Certifications'
import { Objective } from './Objective'
import { Contact } from './Contact'

export const sectionViews: Record<SectionId, ComponentType> = {
  hero: Hero,
  skills: Skills,
  education: Education,
  about: About,
  achievements: Achievements,
  interests: Interests,
  projects: Projects,
  certifications: Certifications,
  objective: Objective,
  contact: Contact,
}

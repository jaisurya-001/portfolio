export type SectionId =
  | 'hero'
  | 'skills'
  | 'education'
  | 'about'
  | 'achievements'
  | 'interests'
  | 'projects'
  | 'certifications'
  | 'objective'
  | 'contact'

export const profile = {
  name: 'Jaisurya V',
  roles: [
    'Computer Science Engineering Student',
    'AI & Machine Learning Enthusiast',
    'Aspiring Software Developer',
  ],
  location: 'Tiruppur, Tamil Nadu, India',
  email: 'jaisurya.v31@gmail.com',
  github: 'https://github.com/jaisurya-001',
  linkedin: 'https://www.linkedin.com/in/jaisurya-v-a23354380/',
  tagline: 'Building Ideas into Reality Through Code, Creativity, and Curiosity.',
  closing: "Let's Connect, Collaborate, and Create Something Extraordinary.",
} as const

export const about = {
  body: 'CSE student at Bannari Amman Institute of Technology (BIT), passionate about technology, software development, AI, ML, and Big Data Analytics. Enjoys exploring new technologies, solving programming challenges, and turning creative ideas into practical applications. Has worked on web applications, authentication systems, database management, and student-focused platforms. Hackathons and technical activities have strengthened problem-solving, teamwork, and collaborative development. Continuously expanding technical knowledge and working toward becoming a skilled developer who builds meaningful, innovative solutions.',
} as const

export interface EducationStop {
  institution: string
  credential: string
  location: string
}

export const education: EducationStop[] = [
  {
    institution: 'Bannari Amman Institute of Technology (BIT)',
    credential: 'B.E. Computer Science and Engineering',
    location: 'Sathyamangalam, Tamil Nadu',
  },
  {
    institution: 'Jaycees Matriculation Higher Secondary School',
    credential: '',
    location: 'Sivanmalai, Tamil Nadu',
  },
]

export interface SkillGroup {
  label: string
  items: string[]
}

export const skillGroups: SkillGroup[] = [
  { label: 'Languages', items: ['C', 'C++', 'Python', 'Java', 'JavaScript'] },
  { label: 'Frontend', items: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Next.js'] },
  { label: 'Backend', items: ['Node.js', 'Express.js'] },
  { label: 'Databases and Auth', items: ['SQL', 'SQLite', 'Supabase', 'Google OAuth'] },
  { label: 'Tools', items: ['Git', 'GitHub', 'VS Code'] },
  {
    label: 'CS Fundamentals',
    items: ['DSA', 'OOP', 'DBMS', 'Problem Solving', 'Basic ML Concepts'],
  },
]

export const interests: string[] = [
  'Artificial Intelligence',
  'Machine Learning',
  'Big Data Analytics',
  'Data Analysis',
  'Full-Stack Development',
  'Software Engineering',
]

export interface ProjectItem {
  name: string
  summary: string
  tech: string[]
  githubUrl: string
  liveUrl: string
}

export const projects: ProjectItem[] = [
  {
    name: 'HackOrbit',
    summary:
      'Hackathon-related project focused on practical technological solutions and collaborative problem-solving.',
    tech: [],
    githubUrl: 'TODO',
    liveUrl: 'TODO',
  },
  {
    name: 'Placement Gap Hub',
    summary:
      'Student platform that identifies skill gaps and helps students improve placement readiness.',
    tech: ['React', 'Vite', 'Supabase'],
    githubUrl: 'TODO',
    liveUrl: 'TODO',
  },
  {
    name: 'Big Data Analytics and Machine Learning Community Portal',
    summary:
      'College community platform managing student activities, hackathons, problem statements, team coordination, and leader responsibilities.',
    tech: ['React', 'Supabase', 'Google OAuth'],
    githubUrl: 'TODO',
    liveUrl: 'TODO',
  },
  {
    name: 'Placement Portal',
    summary: 'Web-based student portal for placement-related activities and student services.',
    tech: [],
    githubUrl: 'TODO',
    liveUrl: 'TODO',
  },
]

export const achievement = {
  title: 'College-Level Hackathon Winner',
  summary:
    'Showed teamwork, creativity, technical problem-solving, and the ability to build under time constraints.',
} as const

export const certifications: string[] = [
  'Introduction to Data Science',
  'Introduction to AI',
  'AI Fundamentals with IBM Skills',
  'Linux Unhatched',
]

export const objective =
  'To grow as a software developer, strengthen expertise in AI and ML, and contribute to innovative projects that solve real-world problems, continuously learning and turning ideas into impactful digital solutions.'

export const sectionTitles: Record<SectionId, string> = {
  hero: 'Hero',
  skills: 'Skills',
  education: 'Education',
  about: 'About',
  achievements: 'Achievements',
  interests: 'Interests',
  projects: 'Projects',
  certifications: 'Certifications',
  objective: 'Career Objective',
  contact: 'Mission Control',
}

export const uiCopy = {
  beginJourney: 'Begin Journey',
  quickView: 'Quick View',
  warping: (planet: string) => `Warping to ${planet}…`,
  returning: 'Returning to overview…',
  transmit: 'Transmit signal',
  email: 'Email',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  live: 'Live',
  close: 'Close',
  overview: 'Overview',
  mode3d: '3D',
  mode2d: '2D',
  viewMode: 'View mode',
  sections: 'Solar system sections',
  loading: 'Initializing mission',
  controls: 'Arrows, scroll, or select a body. Escape returns.',
} as const

export function isProvidedUrl(url: string): boolean {
  return url.startsWith('https://') || url.startsWith('http://')
}

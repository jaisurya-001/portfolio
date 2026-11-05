import { about, profile, sectionTitles } from '../../data/portfolio'

export function About() {
  return (
    <div className="space-y-4">
      <h2 className="font-grotesk text-2xl font-semibold text-white">{sectionTitles.about}</h2>
      <p className="text-sm font-medium text-cyan/90">{profile.location}</p>
      <p className="text-sm leading-relaxed text-white/90">{about.body}</p>
    </div>
  )
}

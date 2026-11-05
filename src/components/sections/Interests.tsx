import { interests, sectionTitles } from '../../data/portfolio'

export function Interests() {
  return (
    <div className="space-y-4">
      <h2 className="font-grotesk text-2xl font-semibold">{sectionTitles.interests}</h2>
      <ul className="flex flex-wrap gap-2">
        {interests.map((interest) => (
          <li
            key={interest}
            className="rounded-full border border-violet/40 bg-violet/10 px-3 py-1.5 text-sm text-white/90"
          >
            {interest}
          </li>
        ))}
      </ul>
    </div>
  )
}

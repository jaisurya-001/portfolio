import { objective, sectionTitles } from '../../data/portfolio'

export function Objective() {
  return (
    <div className="space-y-4">
      <h2 className="font-grotesk text-2xl font-semibold">{sectionTitles.objective}</h2>
      <p className="text-sm leading-relaxed text-white/85">{objective}</p>
    </div>
  )
}

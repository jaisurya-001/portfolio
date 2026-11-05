import { achievement, sectionTitles } from '../../data/portfolio'

export function Achievements() {
  return (
    <div className="space-y-4">
      <h2 className="font-grotesk text-2xl font-semibold">{sectionTitles.achievements}</h2>
      <article className="rounded-2xl border border-solar/30 bg-solar/8 p-4">
        <h3 className="font-grotesk text-lg text-solar">{achievement.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/80">{achievement.summary}</p>
      </article>
    </div>
  )
}

import { education, sectionTitles } from '../../data/portfolio'

export function Education() {
  return (
    <div className="space-y-5">
      <h2 className="font-grotesk text-2xl font-semibold text-white">{sectionTitles.education}</h2>
      <ol className="relative space-y-8 border-l border-cyan/40 pl-6">
        {education.map((stop) => (
          <li key={stop.institution} className="relative">
            <span className="absolute top-1 -left-[1.7rem] h-3 w-3 rounded-full border border-cyan bg-void shadow-[0_0_12px_#00e5ff]" />
            <h3 className="font-grotesk text-base font-semibold text-white">{stop.institution}</h3>
            {stop.credential ? (
              <p className="mt-1 text-sm font-medium text-cyan">{stop.credential}</p>
            ) : null}
            <p className="mt-1 text-sm text-white/80">{stop.location}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

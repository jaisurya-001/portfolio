import { sectionTitles, skillGroups } from '../../data/portfolio'

export function Skills() {
  return (
    <div className="space-y-5">
      <h2 className="font-grotesk text-2xl font-semibold">{sectionTitles.skills}</h2>
      <div className="space-y-4">
        {skillGroups.map((group) => (
          <section key={group.label}>
            <h3 className="mb-2 font-display text-[10px] tracking-[0.18em] text-cyan uppercase">
              {group.label}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-cyan/30 bg-cyan/8 px-3 py-1 text-xs text-white/90"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}

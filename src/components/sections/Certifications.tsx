import { certifications, sectionTitles } from '../../data/portfolio'

export function Certifications() {
  return (
    <div className="space-y-4">
      <h2 className="font-grotesk text-2xl font-semibold">{sectionTitles.certifications}</h2>
      <ul className="grid gap-3">
        {certifications.map((item) => (
          <li
            key={item}
            className="rounded-xl border border-cyan/30 bg-cyan/6 px-4 py-3 font-grotesk text-sm text-white"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

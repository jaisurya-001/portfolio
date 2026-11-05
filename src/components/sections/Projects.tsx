import { isProvidedUrl, projects, sectionTitles, uiCopy } from '../../data/portfolio'

export function Projects() {
  return (
    <div className="space-y-4">
      <h2 className="font-grotesk text-2xl font-semibold text-white">{sectionTitles.projects}</h2>
      <div className="space-y-3.5">
        {projects.map((project) => {
          const github = isProvidedUrl(project.githubUrl)
          const live = isProvidedUrl(project.liveUrl)
          return (
            <article key={project.name} className="rounded-2xl border border-white/15 bg-white/5 p-4 sm:p-5">
              <h3 className="font-grotesk text-base font-semibold text-white">{project.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/85">{project.summary}</p>
              {project.tech.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.tech.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-cyan/30 bg-cyan/10 px-2.5 py-0.5 text-[11px] tracking-wide text-cyan font-medium uppercase"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
              {(github || live) && (
                <div className="mt-3.5 flex gap-2.5">
                  {github && (
                    <a
                      className="rounded-full border border-cyan/50 bg-cyan/10 px-3 py-1 text-xs text-cyan font-medium hover:bg-cyan/20 focus:outline-none focus:ring-2 focus:ring-cyan transition-colors"
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {uiCopy.github}
                    </a>
                  )}
                  {live && (
                    <a
                      className="rounded-full border border-solar/50 bg-solar/10 px-3 py-1 text-xs text-solar font-medium hover:bg-solar/20 focus:outline-none focus:ring-2 focus:ring-solar transition-colors"
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {uiCopy.live}
                    </a>
                  )}
                </div>
              )}
            </article>
          )
        })}
      </div>
    </div>
  )
}

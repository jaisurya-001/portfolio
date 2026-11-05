import { useEffect, useState, useRef } from 'react'
import { BODIES } from '../../data/bodies'
import { profile, sectionTitles } from '../../data/portfolio'
import { sectionViews } from '../sections'
import { HelpButton, ModeToggle } from './ModeToggle'

export function FlatView() {
  const [activeId, setActiveId] = useState<string>('sun')
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const sections = BODIES.map((body) => document.getElementById(`section-${body.id}`)).filter(
      Boolean,
    ) as HTMLElement[]

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace('section-', '')
            setActiveId(id)
          }
        }
      },
      {
        root: container,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0,
      },
    )

    sections.forEach((sec) => observer.observe(sec))
    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    const target = document.getElementById(`section-${id}`)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveId(id)
    }
  }

  return (
    <div
      ref={scrollContainerRef}
      className="scroll-thin absolute inset-0 z-20 overflow-y-auto bg-void text-white"
    >
      {/* Sticky Semantic Header */}
      <header className="sticky top-0 z-30 w-full border-b border-cyan/20 bg-void/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div>
              <span className="font-display text-xs font-bold tracking-[0.2em] text-cyan uppercase">
                {profile.name}
              </span>
              <span className="ml-2 hidden font-grotesk text-xs text-white/50 md:inline">
                Quick View Mode
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ModeToggle />
            <HelpButton />
          </div>
        </div>

        {/* Sticky Subnav Bar */}
        <nav
          className="scroll-thin mx-auto flex max-w-5xl overflow-x-auto px-4 py-2 sm:px-6"
          aria-label="Portfolio sections navigation"
        >
          <ul className="flex items-center gap-1.5 whitespace-nowrap">
            {BODIES.map((body) => {
              const isActive = activeId === body.id
              return (
                <li key={body.id} className="shrink-0">
                  <a
                    href={`#section-${body.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection(body.id)
                    }}
                    className={`rounded-full px-3 py-1 font-display text-[10px] tracking-wider uppercase transition-colors ${
                      isActive
                        ? 'bg-cyan/20 text-cyan font-semibold shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                        : 'text-white/65 hover:bg-white/5 hover:text-white'
                    }`}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    {sectionTitles[body.section]}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </header>

      {/* Semantic Main Content */}
      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 pt-8 pb-16 sm:px-6">
        {BODIES.map((body, idx) => {
          const Section = sectionViews[body.section]
          return (
            <section
              id={`section-${body.id}`}
              key={body.id}
              className="glass scroll-mt-28 rounded-3xl p-6 sm:p-8 shadow-[0_0_30px_rgba(0,229,255,0.05)] border border-cyan/20"
              aria-labelledby={`heading-${body.id}`}
            >
              <div className="mb-4 flex items-center justify-between border-b border-cyan/15 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-display text-[10px] text-cyan/60 font-semibold tracking-widest uppercase">
                    Sector {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-white/30">•</span>
                  <span className="font-display text-[10px] tracking-[0.2em] text-white/70 uppercase">
                    {body.name}
                  </span>
                </div>
                <span className="font-display text-[9px] tracking-wider text-solar/80 uppercase">
                  {sectionTitles[body.section]}
                </span>
              </div>
              <Section />
            </section>
          )
        })}
      </main>

      {/* Semantic Footer */}
      <footer className="border-t border-cyan/20 bg-void/90 py-10 text-center">
        <div className="mx-auto max-w-3xl px-4 space-y-3">
          <p className="font-grotesk text-base text-cyan font-medium">
            "{profile.closing}"
          </p>
          <div className="flex justify-center items-center gap-4 text-xs text-white/50">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan transition-colors"
            >
              GitHub
            </a>
            <span>•</span>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan transition-colors"
            >
              LinkedIn
            </a>
            <span>•</span>
            <a
              href={`mailto:${profile.email}`}
              className="hover:text-cyan transition-colors"
            >
              {profile.email}
            </a>
          </div>
          <p className="font-display text-[10px] tracking-widest text-white/35 uppercase pt-2">
            Built with React Three Fiber, Three.js & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  )
}

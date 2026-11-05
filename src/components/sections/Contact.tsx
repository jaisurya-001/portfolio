import { profile, sectionTitles, uiCopy } from '../../data/portfolio'

const channels = [
  { label: uiCopy.email, href: `mailto:${profile.email}` },
  { label: uiCopy.github, href: profile.github },
  { label: uiCopy.linkedin, href: profile.linkedin },
]

export function Contact() {
  return (
    <div className="space-y-4">
      <h2 className="font-grotesk text-2xl font-semibold text-white">{sectionTitles.contact}</h2>
      <p className="text-sm text-white/80">{profile.email}</p>
      <div className="flex flex-col gap-2.5">
        {channels.map((channel) => (
          <a
            key={channel.label}
            href={channel.href}
            target={channel.href.startsWith('mailto:') ? undefined : '_blank'}
            rel={channel.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
            className="rounded-xl border border-cyan/35 bg-cyan/8 px-4 py-3 text-sm text-cyan hover:bg-cyan/15 focus:outline-none focus:ring-2 focus:ring-cyan transition-colors"
          >
            <span className="font-display text-[10px] tracking-widest uppercase opacity-75">
              {uiCopy.transmit}
            </span>
            <span className="mt-1 block font-grotesk text-base font-medium text-white">
              {channel.label}
            </span>
          </a>
        ))}
      </div>
      <p className="pt-2 text-sm leading-relaxed text-solar font-medium">{profile.closing}</p>
    </div>
  )
}

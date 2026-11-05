import { profile, uiCopy } from '../../data/portfolio'
import { useStore } from '../../store/useStore'
import { Typewriter } from '../ui/Typewriter'

export function Hero() {
  const navigate = useStore((state) => state.navigate)
  const setMode = useStore((state) => state.setMode)

  return (
    <div className="space-y-4">
      <p className="font-display text-[10px] tracking-[0.28em] text-solar">SUN</p>
      <Typewriter
        as="h2"
        text={profile.name}
        speed={35}
        delay={80}
        className="font-grotesk text-3xl font-semibold text-white"
      />
      <ul className="space-y-1.5 text-sm text-white/75">
        {profile.roles.map((role, idx) => (
          <li key={role} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan/60 shadow-[0_0_8px_#00e5ff]" />
            <Typewriter text={role} speed={20} delay={300 + idx * 200} />
          </li>
        ))}
      </ul>
      <p className="text-sm text-white/55">{profile.location}</p>
      <Typewriter
        as="p"
        text={profile.tagline}
        speed={16}
        delay={900}
        className="max-w-md text-base leading-relaxed text-cyan"
      />
      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="button"
          className="rounded-full border border-solar/50 bg-solar/15 px-4 py-2 font-display text-[10px] tracking-[0.16em] text-solar uppercase hover:bg-solar/25"
          onClick={() => {
            setMode('3d')
            navigate('mercury')
          }}
        >
          {uiCopy.beginJourney}
        </button>
        <button
          type="button"
          className="rounded-full border border-cyan/40 px-4 py-2 font-display text-[10px] tracking-[0.16em] text-cyan uppercase hover:bg-cyan/10"
          onClick={() => setMode('2d')}
        >
          {uiCopy.quickView}
        </button>
      </div>
    </div>
  )
}

import { useEffect, useState, type ElementType } from 'react'

interface TypewriterProps {
  text: string
  delay?: number
  speed?: number
  className?: string
  as?: ElementType
}

export function Typewriter({
  text,
  delay = 0,
  speed = 28,
  className = '',
  as: Component = 'span',
}: TypewriterProps) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    const isReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (isReducedMotion) {
      setDisplayed(text)
      return
    }

    setDisplayed('')
    let index = 0
    let intervalId: number

    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        index += 1
        setDisplayed(text.slice(0, index))
        if (index >= text.length) {
          window.clearInterval(intervalId)
        }
      }, speed)
    }, delay)

    return () => {
      window.clearTimeout(timeoutId)
      window.clearInterval(intervalId)
    }
  }, [text, delay, speed])

  return <Component className={className}>{displayed}</Component>
}

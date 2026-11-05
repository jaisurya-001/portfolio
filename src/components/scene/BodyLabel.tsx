import { Html } from '@react-three/drei'

interface BodyLabelProps {
  text: string
  position: [number, number, number]
  onClick?: () => void
}

export function BodyLabel({ text, position, onClick }: BodyLabelProps) {
  return (
    <Html
      position={position}
      center
      zIndexRange={[12, 0]}
      wrapperClass="body-label-wrap"
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onClick?.()
        }}
        className="body-label"
        aria-label={`Select ${text}`}
      >
        {text}
      </button>
    </Html>
  )
}

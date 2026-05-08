import { motion } from 'framer-motion'

/**
 * size="sm"  — SVG circle spinner, w-4 h-4. Use inside buttons for loading states.
 * size="lg"  — Brand ring spinner with Framer Motion. Use in modal pending views.
 *              Pass `color` (hex) to tint the center dot to a network/brand color.
 *              Pass `className` to override the container size (default: w-16 h-16).
 */
interface SpinnerProps {
  size?: 'sm' | 'lg'
  color?: string
  className?: string
}

export default function Spinner({ size = 'sm', color, className = '' }: SpinnerProps) {
  if (size === 'lg') {
    return (
      <div className={`relative shrink-0 ${className || 'w-16 h-16'}`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-4 border-brand/20 border-t-brand"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-6 h-6 rounded-full"
            style={{ background: color ? color + '33' : 'var(--color-brand-subtle)' }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{ background: color ?? 'var(--color-brand)' }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <svg className={`animate-spin w-4 h-4 shrink-0 ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

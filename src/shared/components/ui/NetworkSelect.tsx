import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDownIcon, CheckCircleIcon } from '../icons'
import { NETWORKS } from '../../data/networksConfig'

interface NetworkSelectProps {
  value: string
  onChange: (id: string) => void
  error?: string
}

export default function NetworkSelect({ value, onChange, error }: NetworkSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = NETWORKS.find(n => n.id === value)

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-sm text-left transition-colors ${
          error
            ? 'border-danger bg-danger-subtle/20'
            : open
              ? 'border-brand ring-2 ring-brand/20 bg-card'
              : 'border-line bg-surface hover:border-brand/40'
        }`}
      >
        {selected ? (
          <>
            <div className="w-5 h-5 rounded-full shrink-0" style={{ background: selected.color }} />
            <span className="flex-1 font-medium text-ink">{selected.label}</span>
            <span className="text-xs text-ink-muted font-mono bg-canvas px-2 py-0.5 rounded-md border border-line">{selected.symbol}</span>
          </>
        ) : (
          <span className="flex-1 text-ink-faint">Select blockchain network</span>
        )}
        <ChevronDownIcon className={`w-4 h-4 text-ink-faint transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full left-0 right-0 mt-1.5 bg-card border border-line rounded-xl shadow-xl z-20 overflow-hidden py-1"
          >
            {NETWORKS.map(net => (
              <button
                key={net.id}
                type="button"
                onClick={() => { onChange(net.id); setOpen(false) }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-surface transition-colors text-sm ${value === net.id ? 'bg-brand-subtle/30' : ''}`}
              >
                <div className="w-5 h-5 rounded-full shrink-0" style={{ background: net.color }} />
                <span className="flex-1 font-medium text-ink text-left">{net.label}</span>
                <span className="text-xs text-ink-muted font-mono">{net.feeDisplay}</span>
                {value === net.id && <CheckCircleIcon className="w-4 h-4 text-brand shrink-0" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="text-xs text-danger mt-1.5">{error}</p>}
    </div>
  )
}

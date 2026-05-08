import { motion } from 'framer-motion'
import type { KYBItem } from '../../../shared/data/mockData'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.42 } },
}

const rowVariants = {
  hidden: { opacity: 0, x: -8 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut', delay: 0.52 + i * 0.05 },
  }),
}

const urgencyConfig = {
  High:   { bg: 'bg-danger-subtle',  text: 'text-danger',         ring: 'ring-1 ring-danger-border'  },
  Medium: { bg: 'bg-warning-subtle', text: 'text-warning',        ring: 'ring-1 ring-warning-border' },
  Low:    { bg: 'bg-success-subtle', text: 'text-success-accent', ring: 'ring-1 ring-success-border' },
}

export default function KYBQueue({ items }: { items: KYBItem[] }) {
  const highCount = items.filter(i => i.urgency === 'High').length

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="show"
      className="bg-card rounded-xl shadow-sm border border-line/80 overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-line flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-ink">KYB Queue</h2>
            <span className="bg-warning-accent text-white text-xs font-semibold rounded-full px-1.5 py-0.5 leading-none">
              {items.length}
            </span>
          </div>
          <p className="text-sm text-ink-muted mt-0.5">{highCount} high priority</p>
        </div>
        <button className="text-sm font-medium text-brand hover:text-brand-dark transition-colors">
          Review all →
        </button>
      </div>

      <div className="divide-y divide-line-subtle">
        {items.map((item, i) => {
          const { bg, text, ring } = urgencyConfig[item.urgency] ?? urgencyConfig.Low
          return (
            <motion.div
              key={item.id}
              custom={i}
              variants={rowVariants}
              initial="hidden"
              animate="show"
              className="px-6 py-3.5 flex items-center gap-3 hover:bg-canvas/70 transition-colors duration-100"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">{item.company}</p>
                <p className="text-xs text-ink-faint mt-0.5">Submitted {item.submitted}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-ink-muted whitespace-nowrap">
                  {item.daysPending}d
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${bg} ${text} ${ring}`}>
                  {item.urgency}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

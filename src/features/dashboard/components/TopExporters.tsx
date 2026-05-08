import { motion } from 'framer-motion'
import type { Exporter } from '../../../shared/data/mockData'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.35 } },
}

const rowVariants = {
  hidden: { opacity: 0, x: -8 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut' as const, delay: 0.45 + i * 0.05 },
  }),
}

export default function TopExporters({ exporters }: { exporters: Exporter[] }) {
  const max = exporters[0]?.volumeRaw ?? 1

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="show"
      className="lg:col-span-2 bg-card rounded-xl shadow-sm border border-line/80 overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-line flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-ink">Top Exporters</h2>
          <p className="text-sm text-ink-muted mt-0.5">by transaction volume</p>
        </div>
        <button className="text-sm font-medium text-brand hover:text-brand-dark transition-colors">
          View all →
        </button>
      </div>

      <div className="divide-y divide-line-subtle">
        {exporters.map((exp, i) => {
          const barWidth = Math.round((exp.volumeRaw / max) * 100)
          return (
            <motion.div
              key={exp.id}
              custom={i}
              variants={rowVariants}
              initial="hidden"
              animate="show"
              className="px-6 py-4 flex items-center gap-4 hover:bg-canvas/70 transition-colors duration-100"
            >
              <span className="w-6 h-6 rounded-full bg-surface text-ink-muted text-xs font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{exp.company}</p>
                    <p className="text-xs text-ink-faint">{exp.country} · {exp.transactions} txns</p>
                  </div>
                  <span className="text-sm font-semibold text-ink ml-4 shrink-0">{exp.volume}</span>
                </div>
                <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand rounded-full"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

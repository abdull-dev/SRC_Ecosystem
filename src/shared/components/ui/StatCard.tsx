import { motion } from 'framer-motion'
import { CurrencyIcon, UsersIcon, ShieldCheckIcon, TrendUpIcon, TrendDownIcon } from '../icons'

const iconMap = {
  currency: CurrencyIcon,
  users:    UsersIcon,
  shield:   ShieldCheckIcon,
}

const iconConfig = {
  currency: { bg: 'bg-brand-subtle',  text: 'text-brand',          glow: 'bg-brand-subtle'  },
  users:    { bg: 'bg-success-subtle', text: 'text-success-accent', glow: 'bg-success-subtle' },
  shield:   { bg: 'bg-warning-subtle', text: 'text-warning-accent', glow: 'bg-warning-subtle' },
}

export const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
}

type IconKey = 'currency' | 'users' | 'shield'

interface StatCardProps {
  title: string
  value: string
  trend: string
  trendDirection: 'up' | 'down'
  icon: IconKey
}

export default function StatCard({ title, value, trend, trendDirection, icon }: StatCardProps) {
  const { bg, text, glow } = iconConfig[icon] ?? { bg: 'bg-surface', text: 'text-ink-muted', glow: 'bg-surface' }
  const Icon = iconMap[icon]

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
      whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
      className="relative bg-card rounded-2xl border border-line/60 p-6 overflow-hidden hover:shadow-lg hover:shadow-black/5 transition-shadow duration-200 cursor-default"
    >
      {/* Ambient colour bloom */}
      <div className={`absolute -right-8 -bottom-8 w-40 h-40 rounded-full ${glow} opacity-60 blur-3xl pointer-events-none`} />

      {/* Label + icon */}
      <div className="relative flex items-start justify-between mb-5">
        <p className="text-xs font-semibold text-ink-faint uppercase tracking-widest leading-none pt-0.5">
          {title}
        </p>
        <div className={`w-10 h-10 rounded-full ${bg} ${text} flex items-center justify-center shrink-0`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      {/* Hero value */}
      <p className="relative text-4xl font-bold text-ink tracking-tight leading-none mb-5 font-tabular">
        {value}
      </p>

      {/* Trend */}
      <div className="relative flex items-center gap-1.5 pt-3 border-t border-line/50">
        {trendDirection === 'up' ? (
          <TrendUpIcon className="w-3.5 h-3.5 text-success-accent shrink-0" />
        ) : (
          <TrendDownIcon className="w-3.5 h-3.5 text-danger-accent shrink-0" />
        )}
        <span className="text-xs text-ink-muted">{trend}</span>
      </div>
    </motion.div>
  )
}

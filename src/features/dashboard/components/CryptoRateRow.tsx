import { motion } from 'framer-motion'
import { TrendUpIcon, TrendDownIcon } from '../../../shared/components/icons'

const rowVariants = {
  hidden: { opacity: 0, x: -8 },
  show: (i: number) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.28, ease: 'easeOut', delay: 0.38 + i * 0.06 },
  }),
}

interface Coin {
  id: string
  name: string
  symbol: string
  color: string
  price: number | null
  change24h: number | null
}

function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return '—'
  if (price >= 1000)
    return price.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
  if (price >= 1)
    return price.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
  return price.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 4 })
}

export default function CryptoRateRow({ coin, index }: { coin: Coin; index: number }) {
  const { name, symbol, color, price, change24h } = coin
  const isPositive = change24h >= 0
  const changeAbs = Math.abs(change24h ?? 0).toFixed(2)

  return (
    <motion.div
      custom={index}
      variants={rowVariants}
      initial="hidden"
      animate="show"
      className="px-6 py-3.5 flex items-center gap-4 border-b border-line-subtle last:border-0 hover:bg-canvas/70 transition-colors duration-100"
    >
      {/* Coin badge */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
        style={{ backgroundColor: color }}
      >
        {symbol.slice(0, 1)}
      </div>

      {/* Name + symbol */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink leading-none">{name}</p>
        <p className="text-xs text-ink-muted mt-0.5">{symbol}</p>
      </div>

      {/* Price */}
      <p className="text-sm font-semibold text-ink font-tabular tabular-nums shrink-0">
        {formatPrice(price)}
      </p>

      {/* 24h change badge */}
      <div
        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold shrink-0 ${
          change24h === null
            ? 'bg-surface text-ink-muted'
            : isPositive
            ? 'bg-success-subtle text-success'
            : 'bg-danger-subtle text-danger'
        }`}
      >
        {change24h !== null && (
          isPositive
            ? <TrendUpIcon className="w-3 h-3 shrink-0" />
            : <TrendDownIcon className="w-3 h-3 shrink-0" />
        )}
        <span>{change24h !== null ? `${changeAbs}%` : '—'}</span>
      </div>
    </motion.div>
  )
}

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import CryptoRateRow from './CryptoRateRow'
import { COINS, fetchCryptoPrices } from '../api/marketRates'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 } },
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="px-6 py-3.5 flex items-center gap-4 border-b border-line-subtle last:border-0">
      <div className="w-9 h-9 rounded-full bg-surface animate-pulse shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-24 rounded bg-surface animate-pulse" />
        <div className="h-2.5 w-10 rounded bg-surface animate-pulse" />
      </div>
      <div className="h-3 w-20 rounded bg-surface animate-pulse" />
      <div className="h-6 w-16 rounded-lg bg-surface animate-pulse" />
    </div>
  )
}

function RefreshButton({ isFetching, onRefresh }: { isFetching: boolean; onRefresh: () => void }) {
  return (
    <button
      onClick={onRefresh}
      disabled={isFetching}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ink-muted border border-line rounded-lg hover:bg-surface hover:text-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Refresh market data"
    >
      <svg
        className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      {isFetching ? 'Updating…' : 'Refresh'}
    </button>
  )
}

function ErrorState({ message, onRetry }: { message?: string; onRetry: () => void }) {
  return (
    <div className="px-6 py-10 flex flex-col items-center gap-3 text-center">
      <div className="w-11 h-11 rounded-full bg-danger-subtle flex items-center justify-center">
        <svg className="w-5 h-5 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-ink">Failed to load market data</p>
        <p className="text-xs text-ink-muted mt-1">{message ?? 'Check your connection and try again.'}</p>
      </div>
      <button
        onClick={onRetry}
        className="mt-1 px-4 py-2 bg-brand text-white text-xs font-semibold rounded-lg hover:bg-brand-dark transition-colors"
      >
        Try Again
      </button>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="px-6 py-10 flex flex-col items-center gap-2 text-center">
      <div className="w-11 h-11 rounded-full bg-surface flex items-center justify-center">
        <svg className="w-5 h-5 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p className="text-sm font-medium text-ink">No market data available</p>
      <p className="text-xs text-ink-muted">The API returned an empty response.</p>
    </div>
  )
}

// ── Main widget ───────────────────────────────────────────────────────────────

export default function MarketRatesWidget() {
  const { data, isLoading, isFetching, isError, error, refetch, dataUpdatedAt } = useQuery({
    queryKey: ['crypto-prices'],
    queryFn: fetchCryptoPrices,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    retry: 2,
  })

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : null

  const isEmpty = !isLoading && !isError && data && data.every(c => c.price === null)

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="show"
      className="bg-card rounded-xl shadow-sm border border-line/80 overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-line flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-ink leading-none">Live Market Rates</h3>
          <p className="text-xs text-ink-muted mt-1">
            Crypto prices · USD
            {lastUpdated && !isLoading && (
              <span className="ml-2 text-ink-faint">· Updated {lastUpdated}</span>
            )}
          </p>
        </div>
        <RefreshButton isFetching={isFetching} onRefresh={refetch} />
      </div>

      {/* Body */}
      {isLoading ? (
        <div>
          {COINS.map(c => <SkeletonRow key={c.id} />)}
        </div>
      ) : isError ? (
        <ErrorState message={error?.message} onRetry={refetch} />
      ) : isEmpty ? (
        <EmptyState />
      ) : (
        <div>
          {data.map((coin, i) => (
            <CryptoRateRow key={coin.id} coin={coin} index={i} />
          ))}
        </div>
      )}

      {/* Footer note */}
      {!isLoading && !isError && !isEmpty && (
        <div className="px-6 py-3 bg-surface/40 border-t border-line-subtle">
          <p className="text-xs text-ink-faint">
            Powered by CoinGecko · Data may be delayed up to 60 seconds
          </p>
        </div>
      )}
    </motion.div>
  )
}

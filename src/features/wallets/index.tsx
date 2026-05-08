import { motion } from 'framer-motion'
import { wallets } from '../../shared/data/mockData'
import { NETWORKS } from '../../shared/data/networksConfig'
import { CopyButton } from '../../shared/components/ui/ModalParts'
import StatusBadge from '../../shared/components/ui/StatusBadge'
import { WalletsIcon } from '../../shared/components/icons'

const networkMap = Object.fromEntries(NETWORKS.map(n => [n.id, n]))

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

export default function WalletsPage() {
  const totalBalance = wallets
    .filter(w => w.status === 'active')
    .reduce((sum, w) => sum + parseFloat(w.balance.replace(/[$,]/g, '')), 0)
    .toLocaleString('en-US', { style: 'currency', currency: 'USD' })

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-ink">Connected Wallets</h1>
          <p className="text-sm text-ink-muted mt-0.5">
            {wallets.filter(w => w.status === 'active').length} active wallets · {totalBalance} total active balance
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand text-white rounded-xl text-sm font-semibold hover:bg-brand-dark transition-colors shrink-0 self-start sm:self-auto"
        >
          <WalletsIcon className="w-4 h-4" />
          Add Wallet
        </button>
      </div>

      {/* Wallet grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {wallets.map(wallet => {
          const net = networkMap[wallet.network]
          return (
            <motion.div
              key={wallet.id}
              variants={cardVariants}
              className="bg-card rounded-2xl border border-line/60 p-5 flex flex-col gap-4 hover:shadow-lg hover:shadow-black/5 transition-shadow duration-200"
            >
              {/* Network + status row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: net?.color ?? '#888' }}
                  />
                  <span className="text-xs font-medium text-ink-muted">
                    {net?.label ?? wallet.network} ({net?.symbol})
                  </span>
                </div>
                <StatusBadge status={wallet.status} />
              </div>

              {/* Label + address */}
              <div>
                <p className="text-sm font-semibold text-ink">{wallet.label}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-xs font-mono text-ink-muted">{wallet.addressShort}</span>
                  <CopyButton text={wallet.address} ariaLabel="Copy wallet address" />
                </div>
              </div>

              {/* Balance */}
              <div className="bg-surface/60 rounded-xl px-4 py-3">
                <p className="text-xs text-ink-faint uppercase tracking-wider mb-1">Balance</p>
                <p className="text-2xl font-bold text-ink tabular-nums">{wallet.balance}</p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-1 border-t border-line-subtle">
                <span className="text-xs text-ink-faint">Last used {wallet.lastUsed}</span>
                <span className="text-xs font-medium text-ink-muted">{wallet.id}</span>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}

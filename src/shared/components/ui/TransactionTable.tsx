import { useState } from 'react'
import { motion } from 'framer-motion'
import StatusBadge from './StatusBadge'
import TransactionModal from './TransactionModal'
import type { Transaction } from '../../data/mockData'

const tableVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.28 },
  },
}

const rowVariants = {
  hidden: { opacity: 0, x: -8 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut', delay: 0.38 + i * 0.04 },
  }),
}

const ACTION_STYLES = {
  pending:   'text-brand hover:text-brand-dark font-semibold',
  failed:    'text-danger hover:opacity-75 font-semibold',
  completed: 'text-ink-muted hover:text-ink font-medium',
}

const ACTION_LABELS = {
  pending:   'Review',
  failed:    'Retry',
  completed: 'View',
}

export default function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  const [selectedTx, setSelectedTx]   = useState<Transaction | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleReview = (tx: Transaction) => {
    setSelectedTx(tx)
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setSelectedTx(null)
  }

  return (
    <>
      <motion.div
        variants={tableVariants}
        initial="hidden"
        animate="show"
        className="bg-card rounded-xl shadow-sm border border-line/80 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-line flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-ink">Recent Transactions</h2>
            <p className="text-sm text-ink-muted mt-0.5">{transactions.length} transactions this period</p>
          </div>
          <button className="text-sm font-medium text-brand hover:text-brand-dark transition-colors">
            View all →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-canvas border-b border-line">
              <tr>
                {['Transaction ID', 'Company / Exporter', 'Amount', 'Wallet Address', 'Status', 'Date', 'Action'].map(col => (
                  <th key={col} className="px-6 py-3 text-left text-xs font-semibold text-ink-muted uppercase tracking-wider whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line-subtle">
              {transactions.map((tx, i) => (
                <motion.tr
                  key={tx.id}
                  custom={i}
                  variants={rowVariants}
                  initial="hidden"
                  animate="show"
                  className="hover:bg-canvas/70 transition-colors duration-100"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-xs bg-surface text-ink-2 rounded-md px-2 py-1">
                      {tx.id}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-ink">{tx.company}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-ink">{tx.amount}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-xs text-ink-muted bg-canvas border border-line rounded px-2 py-0.5">
                      {tx.wallet}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={tx.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-ink-muted">
                    {tx.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleReview(tx)}
                      className={`text-xs transition-colors ${ACTION_STYLES[tx.status] ?? ACTION_STYLES.completed}`}
                    >
                      {ACTION_LABELS[tx.status] ?? 'View'}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleClose}
        transaction={selectedTx}
      />
    </>
  )
}

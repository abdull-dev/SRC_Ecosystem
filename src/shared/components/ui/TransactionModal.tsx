import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  XMarkIcon, CheckCircleIcon,
  ExclamationTriangleIcon, InformationCircleIcon,
} from '../icons'
import Spinner from './Spinner'
import { CopyButton, DetailRow } from './ModalParts'
import type { Transaction } from '../../data/mockData'

const NETWORK_LABELS = {
  ethereum: 'Ethereum',
  polygon:  'Polygon (MATIC)',
  bnb:      'BNB Smart Chain',
  solana:   'Solana',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseAmount(str: string | undefined | null): number {
  return parseFloat((str ?? '0').replace(/[$,]/g, '')) || 0
}

function formatTotal(amount: string | undefined, fee: string | undefined): string {
  const total = parseAmount(amount) + parseAmount(fee)
  return total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface/60 rounded-xl p-4 space-y-0">
      {children}
    </div>
  )
}

// ── State views ───────────────────────────────────────────────────────────────

function ReviewView({ tx, onConfirm, onCancel }: { tx: Transaction; onConfirm: () => void; onCancel: () => void }) {
  const [showFull, setShowFull] = useState(false)
  const isReadOnly = tx.status === 'completed'
  const maskedAddress = tx.walletFull
    ? `${tx.walletFull.slice(0, 6)}...${tx.walletFull.slice(-4)}`
    : tx.wallet

  return (
    <motion.div
      key="review"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-4"
    >
      {/* Warning / info banner */}
      {!isReadOnly ? (
        <div className="flex gap-2.5 bg-warning-subtle border border-warning-border rounded-xl px-4 py-3">
          <ExclamationTriangleIcon className="w-4 h-4 text-warning-accent shrink-0 mt-0.5" />
          <p className="text-xs text-warning leading-relaxed">
            <span className="font-semibold">Important:</span> Blockchain payments are generally irreversible. Verify the wallet address carefully before confirming.
          </p>
        </div>
      ) : (
        <div className="flex gap-2.5 bg-brand-subtle/50 border border-brand/20 rounded-xl px-4 py-3">
          <InformationCircleIcon className="w-4 h-4 text-brand shrink-0 mt-0.5" />
          <p className="text-xs text-ink-muted leading-relaxed">This transaction has already been processed and cannot be modified.</p>
        </div>
      )}

      {/* Payment details */}
      <div>
        <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider mb-2">Payment Details</p>
        <SectionCard>
          <DetailRow label="Recipient"      value={tx.company} />
          <DetailRow label="Transaction ID" value={tx.id} mono />
          <DetailRow label="Date"           value={tx.date} />
        </SectionCard>
      </div>

      {/* Amount breakdown */}
      <div>
        <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider mb-2">Amount Breakdown</p>
        <SectionCard>
          <DetailRow label="Payment Amount" value={tx.amount} />
          <DetailRow label="Network Fee"    value={tx.networkFee} />
          <div className="pt-1 mt-1 border-t border-line">
            <DetailRow label="Total" value={formatTotal(tx.amount, tx.networkFee)} highlight />
          </div>
        </SectionCard>
      </div>

      {/* Destination wallet */}
      <div>
        <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider mb-2">Destination Wallet</p>
        <SectionCard>
          <DetailRow label="Network" value={NETWORK_LABELS[tx.network] ?? tx.network} />
          <div className="py-2.5 border-b border-line-subtle">
            <div className="flex items-start justify-between gap-3 text-sm">
              <span className="text-ink-muted shrink-0">Address</span>
              <div className="flex flex-col items-end gap-1.5 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs text-ink break-all text-right">
                    {showFull ? tx.walletFull : maskedAddress}
                  </span>
                  <CopyButton text={tx.walletFull ?? tx.wallet} />
                </div>
                <button
                  type="button"
                  onClick={() => setShowFull(v => !v)}
                  className="text-xs text-brand hover:text-brand-dark transition-colors"
                >
                  {showFull ? 'Hide full address' : 'View full address'}
                </button>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Footer actions */}
      <div className="flex gap-3 pt-1">
        {isReadOnly ? (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 bg-brand text-white rounded-lg text-sm font-semibold hover:bg-brand-dark transition-colors"
          >
            Close
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 border border-line text-ink-muted rounded-lg text-sm font-medium hover:bg-surface hover:text-ink transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-brand text-white rounded-lg text-sm font-semibold hover:bg-brand-dark transition-colors"
            >
              Confirm Payment →
            </button>
          </>
        )}
      </div>
    </motion.div>
  )
}

function PendingView({ tx }: { tx: Transaction }) {
  return (
    <motion.div
      key="pending"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center gap-4 py-8 text-center"
    >
      <Spinner size="lg" />
      <div>
        <p className="text-base font-semibold text-ink">Processing Transaction…</p>
        <p className="text-sm text-ink-muted mt-1">Please wait — do not close this window.</p>
      </div>
      <div className="bg-surface rounded-lg px-4 py-2.5 text-sm text-ink-2">
        <span className="font-mono text-xs text-ink-muted">{tx.id}</span>
        <span className="mx-2 text-ink-faint">·</span>
        <span className="font-semibold">{tx.amount}</span>
      </div>
    </motion.div>
  )
}

function SuccessView({ tx, onClose }: { tx: Transaction; onClose: () => void }) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center gap-4 py-6 text-center"
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4, type: 'spring', stiffness: 200 }}
        className="w-16 h-16 rounded-full bg-success-subtle flex items-center justify-center"
      >
        <CheckCircleIcon className="w-9 h-9 text-success-accent" />
      </motion.div>
      <div>
        <p className="text-base font-semibold text-success">Payment Confirmed!</p>
        <p className="text-sm text-ink-muted mt-1 leading-relaxed max-w-xs">
          Your payment has been submitted to the blockchain and is being processed.
        </p>
      </div>
      <div className="w-full bg-surface/60 rounded-xl p-4 text-left space-y-0">
        <DetailRow label="Reference" value={tx.id} mono />
        <DetailRow label="Amount"    value={tx.amount} />
        <DetailRow label="Network"   value={NETWORK_LABELS[tx.network] ?? tx.network} />
      </div>
      <button
        type="button"
        onClick={onClose}
        className="w-full px-4 py-2.5 bg-brand text-white rounded-lg text-sm font-semibold hover:bg-brand-dark transition-colors"
      >
        Close
      </button>
    </motion.div>
  )
}

function FailedView({ onRetry, onClose }: { onRetry: () => void; onClose: () => void }) {
  return (
    <motion.div
      key="failed"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center gap-4 py-6 text-center"
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4, type: 'spring', stiffness: 200 }}
        className="w-16 h-16 rounded-full bg-danger-subtle flex items-center justify-center"
      >
        <ExclamationTriangleIcon className="w-9 h-9 text-danger-accent" />
      </motion.div>
      <div>
        <p className="text-base font-semibold text-danger">Payment Failed</p>
        <p className="text-sm text-ink-muted mt-1 leading-relaxed max-w-xs">
          We couldn't process this payment. This may be due to insufficient network fees or a temporary network issue.
        </p>
      </div>
      <div className="flex gap-3 w-full">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2.5 border border-line text-ink-muted rounded-lg text-sm font-medium hover:bg-surface hover:text-ink transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onRetry}
          className="flex-1 px-4 py-2.5 bg-brand text-white rounded-lg text-sm font-semibold hover:bg-brand-dark transition-colors"
        >
          Try Again
        </button>
      </div>
    </motion.div>
  )
}

// ── Main modal ────────────────────────────────────────────────────────────────

export default function TransactionModal({ isOpen, onClose, transaction }: { isOpen: boolean; onClose: () => void; transaction: Transaction | null }) {
  const [modalStatus, setModalStatus] = useState('review')

  const handleClose = useCallback(() => {
    setModalStatus('review')
    onClose()
  }, [onClose])

  const handleCancel = () => {
    toast.info('Payment cancelled')
    handleClose()
  }

  const handleConfirm = () => {
    setModalStatus('pending')
    setTimeout(() => {
      setModalStatus(Math.random() < 0.2 ? 'failed' : 'success')
    }, 2000)
  }

  // Scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // ESC to close
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape' && modalStatus === 'review') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, modalStatus, handleClose])

  if (!transaction) return null

  const isReadOnly = transaction.status === 'completed'
  const headerTitle = isReadOnly ? 'Transaction Details' : 'Confirm Payment'
  const headerSubtitle = isReadOnly
    ? 'This transaction has been processed.'
    : 'Review the details before confirming this payment.'

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && modalStatus === 'review') handleClose()
          }}
        >
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md bg-card rounded-2xl border border-line/80 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            {modalStatus === 'review' && (
              <div className="px-6 py-4 border-b border-line flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-ink">{headerTitle}</h2>
                  <p className="text-xs text-ink-muted mt-0.5">{headerSubtitle}</p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-1.5 rounded-lg text-ink-faint hover:text-ink hover:bg-surface transition-colors shrink-0 mt-0.5"
                  aria-label="Close modal"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Modal body */}
            <div className="px-6 py-5 max-h-[80vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                {modalStatus === 'review' && (
                  <ReviewView
                    tx={transaction}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                  />
                )}
                {modalStatus === 'pending' && <PendingView tx={transaction} />}
                {modalStatus === 'success' && (
                  <SuccessView tx={transaction} onClose={handleClose} />
                )}
                {modalStatus === 'failed' && (
                  <FailedView
                    onRetry={() => setModalStatus('review')}
                    onClose={handleClose}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

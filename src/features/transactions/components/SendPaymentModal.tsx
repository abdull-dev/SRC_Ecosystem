import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon,
} from '../../../shared/components/icons'
import Spinner from '../../../shared/components/ui/Spinner'
import { CopyButton, DetailRow } from '../../../shared/components/ui/ModalParts'

const NETWORK_META = {
  ethereum: { label: 'Ethereum',   symbol: 'ETH',   color: '#627EEA' },
  polygon:  { label: 'Polygon',    symbol: 'MATIC', color: '#8247E5' },
  bnb:      { label: 'BNB Chain',  symbol: 'BNB',   color: '#F3BA2F' },
  solana:   { label: 'Solana',     symbol: 'SOL',   color: '#9945FF' },
}

interface PaymentData {
  amount: string
  address: string
  network: string
  fee: number
}

function generateTxHash(): string {
  const hex = '0123456789abcdef'
  return '0x' + Array.from({ length: 64 }, () => hex[Math.floor(Math.random() * 16)]).join('')
}

// ── Review ──────────────────────────────────────────────────────────────────

function ReviewView({ data, onConfirm, onCancel }: { data: PaymentData; onConfirm: () => void; onCancel: () => void }) {
  const [showFull, setShowFull] = useState(false)
  const net = NETWORK_META[data.network]
  const amountNum = parseFloat(data.amount)
  const feeFmt = data.fee.toLocaleString('en-US', {
    style: 'currency', currency: 'USD',
    minimumFractionDigits: data.fee < 0.1 ? 3 : 2,
    maximumFractionDigits: data.fee < 0.1 ? 4 : 2,
  })
  const amountFmt = amountNum.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  const totalFmt  = (amountNum + data.fee).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  const shortAddr = `${data.address.slice(0, 8)}...${data.address.slice(-6)}`

  return (
    <motion.div key="review" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }} className="flex flex-col gap-4">
      {/* Warning */}
      <div className="flex gap-2.5 bg-warning-subtle border border-warning-border rounded-xl px-4 py-3">
        <ExclamationTriangleIcon className="w-4 h-4 text-warning-accent shrink-0 mt-0.5" />
        <p className="text-xs text-warning leading-relaxed">
          <span className="font-semibold">Important:</span> Blockchain payments are irreversible. Verify the wallet address before confirming.
        </p>
      </div>

      {/* Amount hero */}
      <div className="bg-surface/60 rounded-xl p-5 text-center border border-line-subtle">
        <p className="text-xs font-medium text-ink-faint uppercase tracking-wider mb-1.5">You're sending</p>
        <p className="text-3xl font-bold text-ink tabular-nums">{amountFmt}</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: net?.color }} />
          <span className="text-sm text-ink-muted">via {net?.label}</span>
        </div>
      </div>

      {/* Destination */}
      <div>
        <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider mb-2">Destination</p>
        <div className="bg-surface/60 rounded-xl p-4">
          <DetailRow label="Network" value={net?.label ?? data.network} />
          <div className="py-2.5 text-sm">
            <div className="flex items-start justify-between gap-3">
              <span className="text-ink-muted shrink-0">Address</span>
              <div className="flex flex-col items-end gap-1.5 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs text-ink break-all text-right">
                    {showFull ? data.address : shortAddr}
                  </span>
                  <CopyButton text={data.address} />
                </div>
                <button type="button" onClick={() => setShowFull(v => !v)} className="text-xs text-brand hover:text-brand-dark transition-colors">
                  {showFull ? 'Hide' : 'Show full address'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cost breakdown */}
      <div>
        <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider mb-2">Cost Breakdown</p>
        <div className="bg-surface/60 rounded-xl p-4">
          <DetailRow label="Payment Amount" value={amountFmt} />
          <DetailRow label="Network Fee"    value={feeFmt} />
          <div className="pt-2 mt-1 border-t border-line">
            <DetailRow label="Total You Pay" value={totalFmt} highlight />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2.5 border border-line text-ink-muted rounded-lg text-sm font-medium hover:bg-surface hover:text-ink transition-colors">
          Cancel
        </button>
        <button type="button" onClick={onConfirm} className="flex-1 px-4 py-2.5 bg-brand text-white rounded-xl text-sm font-semibold hover:bg-brand-dark transition-colors">
          Confirm & Send →
        </button>
      </div>
    </motion.div>
  )
}

// ── Pending ──────────────────────────────────────────────────────────────────

function PendingView({ data }: { data: PaymentData }) {
  const net = NETWORK_META[data.network]
  return (
    <motion.div key="pending" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.2 }} className="flex flex-col items-center gap-6 py-10 text-center">
      <Spinner size="lg" className="w-20 h-20" color={net?.color} />
      <div>
        <p className="text-lg font-semibold text-ink">Broadcasting Transaction…</p>
        <p className="text-sm text-ink-muted mt-2 max-w-xs leading-relaxed">
          Your payment is being submitted to the {net?.label} network. This usually takes a few seconds.
        </p>
      </div>
      <p className="text-xs text-ink-faint bg-surface px-4 py-2 rounded-lg">Do not close this window</p>
    </motion.div>
  )
}

// ── Success ───────────────────────────────────────────────────────────────────

function SuccessView({ data, txHash, onDone }: { data: PaymentData; txHash: string; onDone: () => void }) {
  const net = NETWORK_META[data.network]
  const amountFmt = parseFloat(data.amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  const shortHash = `${txHash.slice(0, 10)}...${txHash.slice(-8)}`

  return (
    <motion.div key="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.25 }} className="flex flex-col items-center gap-5 py-6 text-center">
      <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, duration: 0.4, type: 'spring', stiffness: 200 }} className="w-16 h-16 rounded-full bg-success-subtle flex items-center justify-center">
        <CheckCircleIcon className="w-9 h-9 text-success-accent" />
      </motion.div>
      <div>
        <p className="text-xl font-bold text-ink">Payment Sent!</p>
        <p className="text-sm text-ink-muted mt-1.5 leading-relaxed max-w-xs">
          <span className="font-semibold text-ink">{amountFmt}</span> has been submitted to the {net?.label} blockchain.
        </p>
      </div>
      <div className="w-full bg-surface/60 rounded-xl p-4 text-left">
        <DetailRow label="Amount"  value={amountFmt} />
        <DetailRow label="Network" value={net?.label} />
        <div className="py-2.5 border-b border-line-subtle last:border-0 text-sm">
          <div className="flex items-start justify-between gap-3">
            <span className="text-ink-muted shrink-0">Tx Hash</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs text-ink">{shortHash}</span>
              <CopyButton text={txHash} />
            </div>
          </div>
        </div>
      </div>
      <p className="text-xs text-ink-muted leading-relaxed max-w-xs">
        Confirmations may take 1–5 minutes depending on network load. Save your transaction hash as proof of payment.
      </p>
      <button type="button" onClick={onDone} className="w-full px-4 py-2.5 bg-brand text-white rounded-xl text-sm font-semibold hover:bg-brand-dark transition-colors">
        Done
      </button>
    </motion.div>
  )
}

// ── Failed ────────────────────────────────────────────────────────────────────

function FailedView({ onRetry, onClose }: { onRetry: () => void; onClose: () => void }) {
  return (
    <motion.div key="failed" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.25 }} className="flex flex-col items-center gap-5 py-6 text-center">
      <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, duration: 0.4, type: 'spring', stiffness: 200 }} className="w-16 h-16 rounded-full bg-danger-subtle flex items-center justify-center">
        <ExclamationTriangleIcon className="w-9 h-9 text-danger-accent" />
      </motion.div>
      <div>
        <p className="text-xl font-bold text-danger">Transaction Failed</p>
        <p className="text-sm text-ink-muted mt-1.5 leading-relaxed max-w-xs">
          The network couldn't process this transaction. This is usually caused by network congestion or insufficient gas fees.
        </p>
      </div>
      <div className="w-full bg-danger-subtle/60 border border-danger-border rounded-xl px-4 py-3 text-left">
        <p className="text-xs leading-relaxed text-danger">
          <span className="font-semibold">Tip:</span> Try switching to Polygon or Solana for significantly lower fees, or retry during off-peak hours.
        </p>
      </div>
      <div className="flex gap-3 w-full">
        <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-line text-ink-muted rounded-xl text-sm font-medium hover:bg-surface hover:text-ink transition-colors">
          Cancel
        </button>
        <button type="button" onClick={onRetry} className="flex-1 px-4 py-2.5 bg-brand text-white rounded-xl text-sm font-semibold hover:bg-brand-dark transition-colors">
          Try Again
        </button>
      </div>
    </motion.div>
  )
}

// ── Main modal ────────────────────────────────────────────────────────────────

export default function SendPaymentModal({ isOpen, onClose, onSuccess, paymentData }: { isOpen: boolean; onClose: () => void; onSuccess?: () => void; paymentData: PaymentData | null }) {
  const [status, setStatus]   = useState('review')
  const [txHash, setTxHash]   = useState('')

  const handleClose = useCallback(() => {
    setStatus('review')
    setTxHash('')
    onClose()
  }, [onClose])

  const handleDone = () => {
    handleClose()
    onSuccess?.()
  }

  const handleConfirm = () => {
    setStatus('pending')
    const hash = generateTxHash()
    setTimeout(() => {
      if (Math.random() < 0.2) {
        setStatus('failed')
      } else {
        setTxHash(hash)
        setStatus('success')
        toast.success('Payment confirmed on blockchain!')
      }
    }, 2500)
  }

  const handleCancel = () => {
    toast.info('Payment cancelled')
    handleClose()
  }

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => { if (e.key === 'Escape' && status === 'review') handleClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, status, handleClose])

  if (!paymentData) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget && status === 'review') handleClose() }}
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
            {/* Header — only on review state */}
            {status === 'review' && (
              <div className="px-6 py-4 border-b border-line flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-ink">Confirm Payment</h2>
                  <p className="text-xs text-ink-muted mt-0.5">Review all details carefully before confirming.</p>
                </div>
                <button type="button" onClick={handleClose} className="p-1.5 rounded-lg text-ink-faint hover:text-ink hover:bg-surface transition-colors shrink-0 mt-0.5" aria-label="Close">
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Body */}
            <div className="px-6 py-5 max-h-[85vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                {status === 'review'  && <ReviewView  data={paymentData} onConfirm={handleConfirm} onCancel={handleCancel} />}
                {status === 'pending' && <PendingView data={paymentData} />}
                {status === 'success' && <SuccessView data={paymentData} txHash={txHash} onDone={handleDone} />}
                {status === 'failed'  && <FailedView  onRetry={() => setStatus('review')} onClose={handleClose} />}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

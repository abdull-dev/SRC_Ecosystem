import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { transactions } from '../../shared/data/mockData'
import { NETWORKS } from '../../shared/data/networksConfig'
import TransactionTable from '../../shared/components/ui/TransactionTable'
import SendPaymentModal from './components/SendPaymentModal'
import NetworkSelect from '../../shared/components/ui/NetworkSelect'
import {
  TransactionsIcon, PaperAirplaneIcon,
  ExclamationTriangleIcon, CheckCircleIcon, ShieldCheckIcon,
} from '../../shared/components/icons'

// ── Page ──────────────────────────────────────────────────────────────────────

const EMPTY_FORM = { amount: '', address: '', network: '' }

export default function TransactionsPage() {
  const [tab, setTab] = useState('history')

  const [form, setForm]               = useState(EMPTY_FORM)
  const [errors, setErrors]           = useState({})
  const [modalOpen, setModalOpen]     = useState(false)
  const [paymentData, setPaymentData] = useState(null)

  const selectedNetwork = NETWORKS.find(n => n.id === form.network)
  const amountNum    = parseFloat(form.amount)
  const validAmount  = !isNaN(amountNum) && amountNum > 0
  const validAddress = form.address.length >= 26

  const setField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
  }

  const handleReview = () => {
    const e = {}
    if (!form.amount || !validAmount) e.amount  = 'Please enter a valid amount greater than $0'
    if (!form.address)                e.address = 'Wallet address is required'
    else if (!validAddress)           e.address = 'Address must be at least 26 characters'
    if (!form.network)                e.network = 'Please select a network'
    if (Object.keys(e).length) { setErrors(e); return }
    setPaymentData({ amount: form.amount, address: form.address, network: form.network, fee: selectedNetwork.fee })
    setModalOpen(true)
  }

  const stats = useMemo(() => {
    const completed = transactions.filter(t => t.status === 'completed').length
    const pending   = transactions.filter(t => t.status === 'pending').length
    const failed    = transactions.filter(t => t.status === 'failed').length
    const volume    = transactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + parseFloat(t.amount.replace(/[$,]/g, '')), 0)
    return { completed, pending, failed, volume }
  }, [])

  const STAT_CARDS = [
    {
      label: 'Volume Sent',
      value: stats.volume.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
      sub: 'from completed transactions',
      valueClass: 'text-brand',
    },
    { label: 'Completed', value: stats.completed, sub: 'successful payments',   valueClass: 'text-success'  },
    { label: 'Pending',   value: stats.pending,   sub: 'awaiting confirmation', valueClass: 'text-warning'  },
    { label: 'Failed',    value: stats.failed,    sub: 'require attention',     valueClass: 'text-danger'   },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      {/* ── Tab switcher ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-1 bg-surface rounded-xl p-1 border border-line/60">
          {[
            { id: 'history', label: 'Transaction History', Icon: TransactionsIcon  },
            { id: 'send',    label: 'Send Payment',        Icon: PaperAirplaneIcon },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                tab === id
                  ? 'bg-card text-ink shadow-sm ring-1 ring-line/50'
                  : 'text-ink-muted hover:text-ink-2'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {tab === 'history' && (
          <span className="text-sm text-ink-muted">{transactions.length} transactions this period</span>
        )}
      </div>

      {/* ── Tab panels ─────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">

        {/* History tab */}
        {tab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {STAT_CARDS.map(card => (
                <div key={card.label} className="bg-card rounded-xl border border-line/80 px-5 py-4 shadow-sm">
                  <p className="text-xs text-ink-muted mb-2">{card.label}</p>
                  <p className={`text-2xl font-bold font-tabular ${card.valueClass}`}>{card.value}</p>
                  <p className="text-xs text-ink-faint mt-1">{card.sub}</p>
                </div>
              ))}
            </div>

            <TransactionTable transactions={transactions} />
          </motion.div>
        )}

        {/* Send tab */}
        {tab === 'send' && (
          <motion.div
            key="send"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
          >
            {/* ── Form card ──────────────────────────────────────────────── */}
            <div className="lg:col-span-2 bg-card rounded-2xl border border-line/80 shadow-sm p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-ink">New Payment</h2>
                <p className="text-sm text-ink-muted mt-0.5">Send a cross-border payment to any blockchain wallet.</p>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">
                  Amount <span className="text-danger">*</span>
                </label>
                <div className={`flex items-center rounded-xl border overflow-hidden transition-all ${
                  errors.amount
                    ? 'border-danger'
                    : 'border-line focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20'
                }`}>
                  <span className="px-4 py-3.5 text-xs font-semibold text-ink-muted bg-surface border-r border-line uppercase tracking-wide">USD</span>
                  <span className="px-3 py-3.5 text-sm text-ink-muted bg-surface border-r border-line">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={e => setField('amount', e.target.value)}
                    className="flex-1 px-4 py-3.5 text-sm bg-transparent text-ink outline-none placeholder:text-ink-faint tabular-nums"
                  />
                  {validAmount && (
                    <span className="px-3">
                      <CheckCircleIcon className="w-4 h-4 text-success-accent" />
                    </span>
                  )}
                </div>
                {errors.amount
                  ? <p className="text-xs text-danger mt-1.5">{errors.amount}</p>
                  : <p className="text-xs text-ink-faint mt-1.5">Enter the exact amount to send in US dollars</p>
                }
              </div>

              {/* Recipient address */}
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">
                  Recipient Wallet Address <span className="text-danger">*</span>
                </label>
                <div className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 transition-all ${
                  errors.address
                    ? 'border-danger bg-danger-subtle/20'
                    : 'border-line bg-surface focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 focus-within:bg-card'
                }`}>
                  <input
                    type="text"
                    placeholder="0x... or blockchain wallet address"
                    value={form.address}
                    onChange={e => setField('address', e.target.value)}
                    className="flex-1 text-sm bg-transparent text-ink outline-none placeholder:text-ink-faint font-mono min-w-0"
                  />
                  {validAddress && <CheckCircleIcon className="w-4 h-4 text-success-accent shrink-0" />}
                  {form.address.length > 0 && !validAddress && <ExclamationTriangleIcon className="w-4 h-4 text-warning-accent shrink-0" />}
                </div>
                {errors.address
                  ? <p className="text-xs text-danger mt-1.5">{errors.address}</p>
                  : form.address.length > 0 && !validAddress
                    ? <p className="text-xs text-warning mt-1.5">Address looks too short — please verify it</p>
                    : <p className="text-xs text-ink-faint mt-1.5">Paste the full wallet address of the recipient</p>
                }
              </div>

              {/* Network selector */}
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">
                  Blockchain Network <span className="text-danger">*</span>
                </label>
                <NetworkSelect
                  value={form.network}
                  onChange={v => setField('network', v)}
                  error={errors.network}
                />
                {!errors.network && (
                  <p className="text-xs text-ink-faint mt-1.5">Each network has different fees and confirmation speeds</p>
                )}
              </div>

              {/* Live fee preview */}
              <AnimatePresence>
                {selectedNetwork && validAmount && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-xl border border-line bg-surface p-4">
                      <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider mb-3">Transaction Summary</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-ink-muted">Payment Amount</span>
                          <span className="font-medium text-ink tabular-nums">
                            {amountNum.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-ink-muted">Network Fee</span>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ background: selectedNetwork.color }} />
                            <span className="font-medium text-ink tabular-nums">{selectedNetwork.feeDisplay}</span>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm pt-2.5 mt-0.5 border-t border-line">
                          <span className="font-semibold text-ink">Total You Pay</span>
                          <span className="font-bold text-ink tabular-nums">
                            {(amountNum + selectedNetwork.fee).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button
                type="button"
                onClick={handleReview}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-brand text-white rounded-xl text-sm font-semibold hover:bg-brand-dark transition-colors shadow-sm"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
                Review Transaction
              </button>
            </div>

            {/* ── Help sidebar ────────────────────────────────────────────── */}
            <div className="lg:col-span-1 space-y-4">

              <div className="bg-card rounded-2xl border border-line/80 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-ink mb-4">How it works</h3>
                <div className="space-y-4">
                  {[
                    { n: '01', title: 'Fill in the details',  desc: 'Enter the amount, recipient address, and select your blockchain network.' },
                    { n: '02', title: 'Review the summary',   desc: 'Check all details in the confirmation screen. Blockchain payments are irreversible.' },
                    { n: '03', title: 'Confirm & broadcast',  desc: 'Once confirmed, your payment is submitted to the blockchain immediately.' },
                    { n: '04', title: 'Get confirmation',     desc: 'A transaction hash is generated as verifiable proof of your payment.' },
                  ].map(({ n, title, desc }) => (
                    <div key={n} className="flex gap-3">
                      <span className="w-7 h-7 rounded-full bg-brand-subtle text-brand text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {n}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-ink">{title}</p>
                        <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-line/80 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheckIcon className="w-4 h-4 text-success-accent shrink-0" />
                  <h3 className="text-sm font-semibold text-ink">Security Notice</h3>
                </div>
                <ul className="space-y-2.5">
                  {[
                    'Verify the wallet address character by character before confirming',
                    'SRC will never ask for your private key or seed phrase',
                    'Use trusted devices only when sending large amounts',
                    'Payments cannot be reversed once confirmed on-chain',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-ink-muted leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-card rounded-2xl border border-line/80 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-ink mb-3">Network fee guide</h3>
                <div className="space-y-2.5">
                  {NETWORKS.map(n => (
                    <div key={n.id} className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ background: n.color }} />
                      <span className="flex-1 text-xs font-medium text-ink">{n.label}</span>
                      <span className="text-xs text-ink-muted font-mono bg-surface px-2 py-0.5 rounded-md border border-line">
                        {n.feeDisplay}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-ink-faint mt-3 leading-relaxed">
                  Polygon and Solana offer the lowest fees. Use Ethereum for maximum compatibility.
                </p>
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>

      <SendPaymentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setForm(EMPTY_FORM)}
        paymentData={paymentData}
      />
    </motion.div>
  )
}

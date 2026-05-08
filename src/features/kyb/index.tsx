import { motion } from 'framer-motion'
import { ShieldCheckIcon } from '../../shared/components/icons'

export default function KYBPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-brand-subtle flex items-center justify-center">
        <ShieldCheckIcon className="w-7 h-7 text-brand" />
      </div>
      <div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-subtle text-warning ring-1 ring-warning-border mb-3">
          Coming Soon
        </span>
        <h2 className="text-xl font-semibold text-ink">KYB Reviews</h2>
        <p className="text-sm text-ink-muted mt-1.5 max-w-xs leading-relaxed">
          Document review queue, approvals, and compliance tracking will be available here.
        </p>
      </div>
    </motion.div>
  )
}

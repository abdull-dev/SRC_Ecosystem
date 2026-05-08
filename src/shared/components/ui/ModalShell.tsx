import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { XMarkIcon } from '../icons'

interface ModalShellProps {
  isOpen: boolean
  onClose: () => void
  canClose?: boolean
  title?: string
  subtitle?: string
  children: React.ReactNode
}

export default function ModalShell({
  isOpen, onClose, canClose = true, title, subtitle, children,
}: ModalShellProps) {
  const handleClose = useCallback(() => {
    if (canClose) onClose()
  }, [canClose, onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, handleClose])

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
          onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
        >
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="w-full max-w-md bg-card rounded-2xl border border-line/80 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="px-6 py-4 border-b border-line flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-ink">{title}</h2>
                  {subtitle && <p className="text-xs text-ink-muted mt-0.5">{subtitle}</p>}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-ink-faint hover:text-ink hover:bg-surface transition-colors shrink-0 mt-0.5"
                  aria-label="Close modal"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="px-6 py-5 max-h-[85vh] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

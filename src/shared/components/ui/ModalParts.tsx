import { useState } from 'react'
import { toast } from 'sonner'
import { ClipboardIcon, CheckCircleIcon } from '../icons'

export function CopyButton({ text, ariaLabel = 'Copy to clipboard' }: { text: string; ariaLabel?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy to clipboard')
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-ink-muted border border-line rounded-md hover:bg-surface hover:text-ink transition-colors shrink-0"
      aria-label={ariaLabel}
    >
      {copied
        ? <CheckCircleIcon className="w-3.5 h-3.5 text-success-accent" />
        : <ClipboardIcon className="w-3.5 h-3.5" />
      }
      <span>{copied ? 'Copied!' : 'Copy'}</span>
    </button>
  )
}

export function DetailRow({
  label,
  value,
  mono = false,
  highlight = false,
}: {
  label: string
  value: React.ReactNode
  mono?: boolean
  highlight?: boolean
}) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-line-subtle last:border-0 gap-4 text-sm">
      <span className="text-ink-muted shrink-0">{label}</span>
      <span className={`text-right break-all ${mono ? 'font-mono text-xs' : 'font-medium'} ${highlight ? 'text-ink font-semibold' : 'text-ink'}`}>
        {value}
      </span>
    </div>
  )
}

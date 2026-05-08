import { useRef } from 'react'
import { CloudArrowUpIcon, CheckCircleIcon, ExclamationTriangleIcon } from '../icons'
import Tooltip from './Tooltip'

interface FileUploadBoxProps {
  label?: string
  description?: string
  fileName?: string
  onChange: (file: File | null) => void
  error?: string
  accept?: string
  required?: boolean
  tooltip?: string
}

export default function FileUploadBox({
  label, description, fileName, onChange, error,
  accept = '.pdf,.png,.jpg,.jpeg', required = false, tooltip,
}: FileUploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => inputRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onChange(file)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      {label && (
        <div className="flex items-center mb-1.5">
          <p className="text-sm font-medium text-ink-2">
            {label}
            {required && <span className="text-danger ml-0.5">*</span>}
          </p>
          {tooltip && <Tooltip content={tooltip} />}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={handleClick}
        className={`w-full border-2 border-dashed rounded-xl p-5 text-left transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand/20 ${
          error
            ? 'border-danger/40 bg-danger-subtle/20 hover:border-danger/60'
            : fileName
            ? 'border-success-border bg-success-subtle/40 hover:border-success-accent/60'
            : 'border-line bg-card hover:border-brand/50 hover:bg-brand-subtle/20'
        }`}
      >
        {fileName ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-success-subtle flex items-center justify-center shrink-0">
              <CheckCircleIcon className="w-5 h-5 text-success-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink truncate">{fileName}</p>
              <p className="text-xs text-ink-muted mt-0.5">File attached · Click to replace</p>
            </div>
            <span
              role="button"
              onClick={handleRemove}
              className="text-ink-faint hover:text-danger transition-colors text-xl leading-none px-1 shrink-0"
            >
              ×
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-subtle flex items-center justify-center shrink-0">
              <CloudArrowUpIcon className="w-5 h-5 text-brand" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Click to upload</p>
              <p className="text-xs text-ink-muted mt-0.5">
                {description || 'PDF, PNG, JPG · Max 10 MB'}
              </p>
            </div>
          </div>
        )}
      </button>
      {error && (
        <p className="mt-1.5 text-xs text-danger flex items-center gap-1">
          <ExclamationTriangleIcon className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

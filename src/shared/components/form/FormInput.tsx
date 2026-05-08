import { ExclamationTriangleIcon } from '../icons'
import Tooltip from './Tooltip'

interface FormInputProps {
  label: string
  name: string
  value: string
  onChange: (name: string, value: string) => void
  error?: string
  placeholder?: string
  helper?: string
  type?: string
  required?: boolean
  tooltip?: string
}

export default function FormInput({
  label, name, value, onChange, error, placeholder,
  helper, type = 'text', required = false, tooltip,
}: FormInputProps) {
  return (
    <div>
      <div className="flex items-center mb-1.5">
        <label htmlFor={name} className="text-sm font-medium text-ink-2">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
        {tooltip && <Tooltip content={tooltip} />}
      </div>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={e => onChange(name, e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-card border rounded-lg px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 transition-all duration-150 ${
          error
            ? 'border-danger/50 focus:ring-danger/20 focus:border-danger/50'
            : 'border-line focus:ring-brand/25 focus:border-brand/50'
        }`}
      />
      {error ? (
        <p className="mt-1.5 text-xs text-danger flex items-center gap-1">
          <ExclamationTriangleIcon className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      ) : helper ? (
        <p className="mt-1.5 text-xs text-ink-muted">{helper}</p>
      ) : null}
    </div>
  )
}

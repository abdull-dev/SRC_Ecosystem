import { ChevronDownIcon, ExclamationTriangleIcon } from '../icons'
import Tooltip from './Tooltip'

type SelectOption = string | { value: string; label: string }

interface SelectInputProps {
  label: string
  name: string
  value: string
  onChange: (name: string, value: string) => void
  error?: string
  placeholder?: string
  options?: SelectOption[]
  helper?: string
  required?: boolean
  tooltip?: string
}

export default function SelectInput({
  label, name, value, onChange, error,
  placeholder = 'Select an option', options = [],
  helper, required = false, tooltip,
}: SelectInputProps) {
  return (
    <div>
      <div className="flex items-center mb-1.5">
        <label htmlFor={name} className="text-sm font-medium text-ink-2">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
        {tooltip && <Tooltip content={tooltip} />}
      </div>
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={e => onChange(name, e.target.value)}
          className={`w-full appearance-none bg-card border rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 transition-all duration-150 ${
            error
              ? 'border-danger/50 focus:ring-danger/20 focus:border-danger/50'
              : 'border-line focus:ring-brand/25 focus:border-brand/50'
          } ${value ? 'text-ink' : 'text-ink-faint'}`}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map(opt => {
            const val = typeof opt === 'string' ? opt : opt.value
            const lbl = typeof opt === 'string' ? opt : opt.label
            return <option key={val} value={val}>{lbl}</option>
          })}
        </select>
        <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint pointer-events-none" />
      </div>
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

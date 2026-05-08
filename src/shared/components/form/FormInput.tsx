import type { InputHTMLAttributes } from 'react'
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
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'name' | 'type' | 'value' | 'onChange' | 'placeholder' | 'className'>
}

export default function FormInput({
  label, name, value, onChange, error, placeholder,
  helper, type = 'text', required = false, tooltip,
  prefix, suffix, inputProps,
}: FormInputProps) {
  const borderClass = error
    ? 'border-danger'
    : 'border-line'
  const focusClass = error
    ? ''
    : 'focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20'

  const inputEl = (
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={e => onChange(name, e.target.value)}
      placeholder={placeholder}
      {...inputProps}
      className={
        prefix || suffix
          ? 'flex-1 px-4 py-3.5 text-sm bg-transparent text-ink outline-none placeholder:text-ink-faint tabular-nums'
          : `w-full bg-card border rounded-lg px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 transition-all duration-150 ${
              error
                ? 'border-danger/50 focus:ring-danger/20 focus:border-danger/50'
                : 'border-line focus:ring-brand/25 focus:border-brand/50'
            }`
      }
    />
  )

  return (
    <div>
      <div className="flex items-center mb-1.5">
        <label htmlFor={name} className="text-sm font-medium text-ink-2">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
        {tooltip && <Tooltip content={tooltip} />}
      </div>

      {prefix || suffix ? (
        <div className={`flex items-center rounded-xl border overflow-hidden transition-all ${borderClass} ${focusClass}`}>
          {prefix}
          {inputEl}
          {suffix}
        </div>
      ) : inputEl}

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

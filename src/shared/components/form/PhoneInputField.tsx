import PhoneInput, { type Country } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { ExclamationTriangleIcon } from '../icons'
import Tooltip from './Tooltip'

interface PhoneInputFieldProps {
  label?: string
  name: string
  value: string
  onChange: (name: string, value: string) => void
  error?: string
  required?: boolean
  tooltip?: string
  defaultCountry?: string
}

export default function PhoneInputField({
  label, name, value, onChange, error,
  required = false, tooltip, defaultCountry = 'US',
}: PhoneInputFieldProps) {
  return (
    <div>
      {label && (
        <div className="flex items-center mb-1.5">
          <label className="text-sm font-medium text-ink-2">
            {label}
            {required && <span className="text-danger ml-0.5">*</span>}
          </label>
          {tooltip && <Tooltip content={tooltip} />}
        </div>
      )}
      <div className={`phone-field${error ? ' phone-field--error' : ''}`}>
        <PhoneInput
          international
          defaultCountry={defaultCountry as Country}
          value={value}
          onChange={val => onChange(name, val ?? '')}
          placeholder="Enter phone number"
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-danger flex items-center gap-1">
          <ExclamationTriangleIcon className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

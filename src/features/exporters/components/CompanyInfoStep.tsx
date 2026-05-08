import FormInput from '../../../shared/components/form/FormInput'
import SelectInput from '../../../shared/components/form/SelectInput'
import PhoneInputField from '../../../shared/components/form/PhoneInputField'

const COUNTRIES = [
  'Australia', 'Bangladesh', 'Brazil', 'Canada', 'Chile', 'China',
  'Colombia', 'Egypt', 'France', 'Germany', 'Ghana', 'India',
  'Indonesia', 'Italy', 'Japan', 'Kenya', 'Malaysia', 'Mexico',
  'Morocco', 'Netherlands', 'Nigeria', 'Pakistan', 'Philippines',
  'Saudi Arabia', 'Singapore', 'South Africa', 'South Korea',
  'Spain', 'Sri Lanka', 'Taiwan', 'Thailand', 'Turkey',
  'United Arab Emirates', 'United Kingdom', 'United States', 'Vietnam',
]

const BUSINESS_TYPES = [
  'Manufacturer',
  'Trading Company',
  'Logistics Provider',
  'Agricultural Exporter',
  'Other',
]

const COUNTRY_TO_ISO = {
  'Australia': 'AU', 'Bangladesh': 'BD', 'Brazil': 'BR', 'Canada': 'CA',
  'Chile': 'CL', 'China': 'CN', 'Colombia': 'CO', 'Egypt': 'EG',
  'France': 'FR', 'Germany': 'DE', 'Ghana': 'GH', 'India': 'IN',
  'Indonesia': 'ID', 'Italy': 'IT', 'Japan': 'JP', 'Kenya': 'KE',
  'Malaysia': 'MY', 'Mexico': 'MX', 'Morocco': 'MA', 'Netherlands': 'NL',
  'Nigeria': 'NG', 'Pakistan': 'PK', 'Philippines': 'PH',
  'Saudi Arabia': 'SA', 'Singapore': 'SG', 'South Africa': 'ZA',
  'South Korea': 'KR', 'Spain': 'ES', 'Sri Lanka': 'LK', 'Taiwan': 'TW',
  'Thailand': 'TH', 'Turkey': 'TR', 'United Arab Emirates': 'AE',
  'United Kingdom': 'GB', 'United States': 'US', 'Vietnam': 'VN',
}

interface CompanyInfoFormData {
  companyName: string
  businessEmail: string
  phoneNumber: string
  country: string
  registrationNumber: string
  businessType: string
}

interface CompanyInfoStepProps {
  formData: CompanyInfoFormData
  errors: Partial<Record<keyof CompanyInfoFormData, string>>
  onChange: (name: string, value: string) => void
}

export default function CompanyInfoStep({ formData, errors, onChange }: CompanyInfoStepProps) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-ink">Company Information</h3>
        <p className="text-sm text-ink-muted mt-1">
          Enter your registered business details exactly as they appear on official documents.
        </p>
      </div>

      <FormInput
        label="Company Name"
        name="companyName"
        value={formData.companyName}
        onChange={onChange}
        error={errors.companyName}
        placeholder="e.g. Pacific Rim Trading Co. Ltd."
        tooltip="Use your full legal registered name as it appears on your certificate of incorporation or business registration."
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          label="Business Email"
          name="businessEmail"
          type="email"
          value={formData.businessEmail}
          onChange={onChange}
          error={errors.businessEmail}
          placeholder="contact@yourcompany.com"
          tooltip="Use an actively monitored email address. KYB status updates and approval notifications will be sent here."
          required
        />
        <PhoneInputField
          label="Business Phone"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={onChange}
          error={errors.phoneNumber}
          defaultCountry={COUNTRY_TO_ISO[formData.country as keyof typeof COUNTRY_TO_ISO] ?? 'US'}
          tooltip="Primary contact phone number for your business. Used for KYB verification and urgent account notifications."
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectInput
          label="Country of Registration"
          name="country"
          value={formData.country}
          onChange={onChange}
          error={errors.country}
          placeholder="Select country"
          options={COUNTRIES}
          tooltip="The country where your business entity is legally registered — this may differ from your operating location."
          required
        />
        <FormInput
          label="Registration Number"
          name="registrationNumber"
          value={formData.registrationNumber}
          onChange={onChange}
          error={errors.registrationNumber}
          placeholder="e.g. 202012345K"
          helper="As shown on your business registration certificate"
          tooltip="The unique identifier assigned to your company by the business registration authority in your country. Found on your registration certificate."
          required
        />
      </div>

      <SelectInput
        label="Business Type"
        name="businessType"
        value={formData.businessType}
        onChange={onChange}
        error={errors.businessType}
        placeholder="Select business type"
        options={BUSINESS_TYPES}
        tooltip="Select the category that best describes your primary export business activity. Used for compliance and risk classification."
        required
      />
    </div>
  )
}

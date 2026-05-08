import { CheckCircleIcon } from '../../../shared/components/icons'

const NETWORK_LABELS = {
  ethereum: 'Ethereum (ETH)',
  polygon:  'Polygon (MATIC)',
  bnb:      'BNB Smart Chain (BNB)',
  solana:   'Solana (SOL)',
}

function SummarySection({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div className="bg-surface rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-ink">{title}</h4>
        <button
          type="button"
          onClick={onEdit}
          className="text-xs font-medium text-brand hover:text-brand-dark transition-colors"
        >
          Edit
        </button>
      </div>
      {children}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="flex items-start justify-between py-1.5 border-b border-line-subtle last:border-0 text-sm gap-4">
      <span className="text-ink-muted shrink-0">{label}</span>
      <span className="text-ink font-medium text-right break-all">{value || '—'}</span>
    </div>
  )
}

const DOCS = [
  { key: 'registrationDoc', label: 'Business Registration' },
  { key: 'taxCertificate',  label: 'Tax Certificate' },
  { key: 'repId',           label: 'Representative ID' },
]

interface ReviewFormData {
  companyName: string
  businessEmail: string
  phoneNumber: string
  country: string
  registrationNumber: string
  businessType: string
  registrationDoc: File | null
  taxCertificate: File | null
  repId: File | null
  network: string
  walletAddress: string
}

export default function ReviewSubmitStep({ formData, onGoToStep }: { formData: ReviewFormData; onGoToStep: (step: number) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-ink">Review Your Application</h3>
        <p className="text-sm text-ink-muted mt-1">
          Check all details carefully before submitting. You can edit any section if needed.
        </p>
      </div>

      <SummarySection title="Company Information" onEdit={() => onGoToStep(1)}>
        <InfoRow label="Company Name"    value={formData.companyName} />
        <InfoRow label="Business Email"  value={formData.businessEmail} />
        <InfoRow label="Phone"           value={formData.phoneNumber} />
        <InfoRow label="Country"         value={formData.country} />
        <InfoRow label="Reg. Number"     value={formData.registrationNumber} />
        <InfoRow label="Business Type"   value={formData.businessType} />
      </SummarySection>

      <SummarySection title="KYC / KYB Documents" onEdit={() => onGoToStep(2)}>
        <div className="space-y-2.5 pt-1">
          {DOCS.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between gap-3 text-sm">
              <span className="text-ink-muted">{label}</span>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-ink font-medium truncate max-w-[180px]">
                  {(formData as unknown as Record<string, File | null>)[key]?.name}
                </span>
                <CheckCircleIcon className="w-4 h-4 text-success-accent shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </SummarySection>

      <SummarySection title="Wallet Connection" onEdit={() => onGoToStep(3)}>
        <InfoRow label="Network" value={NETWORK_LABELS[formData.network as keyof typeof NETWORK_LABELS]} />
        <InfoRow
          label="Wallet Address"
          value={
            formData.walletAddress
              ? `${formData.walletAddress.slice(0, 14)}···${formData.walletAddress.slice(-8)}`
              : '—'
          }
        />
      </SummarySection>

      <p className="text-xs text-ink-muted bg-surface rounded-lg px-4 py-3 leading-relaxed">
        By submitting, you confirm that all information provided is accurate and that you are authorized to represent this company. Our KYB team will review your application within{' '}
        <span className="font-medium text-ink-2">2–3 business days</span>.
      </p>
    </div>
  )
}

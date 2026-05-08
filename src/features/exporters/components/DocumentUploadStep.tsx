import FileUploadBox from '../../../shared/components/form/FileUploadBox'

interface DocFormData {
  registrationDoc: File | null
  taxCertificate: File | null
  repId: File | null
}

interface DocumentUploadStepProps {
  formData: DocFormData
  errors: Partial<Record<keyof DocFormData, string>>
  onChange: (name: string, value: File | null) => void
}

export default function DocumentUploadStep({ formData, errors, onChange }: DocumentUploadStepProps) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-ink">KYC / KYB Documents</h3>
        <p className="text-sm text-ink-muted mt-1">
          Upload clear, legible copies of your official business documents. All files are encrypted and securely stored.
        </p>
      </div>

      <div className="space-y-4">
        <FileUploadBox
          label="Business Registration Document"
          description="Certificate of incorporation or business registration · PDF, PNG, JPG · Max 10 MB"
          fileName={formData.registrationDoc?.name}
          onChange={file => onChange('registrationDoc', file)}
          error={errors.registrationDoc}
          tooltip="Official certificate of incorporation or company registration issued by your country's business registration authority."
          required
        />
        <FileUploadBox
          label="Tax Certificate"
          description="Tax identification or VAT registration certificate · PDF, PNG, JPG · Max 10 MB"
          fileName={formData.taxCertificate?.name}
          onChange={file => onChange('taxCertificate', file)}
          error={errors.taxCertificate}
          tooltip="Tax registration or VAT certificate issued by your country's revenue authority, confirming your registered tax status."
          required
        />
        <FileUploadBox
          label="Authorized Representative ID"
          description="Government-issued ID of the company's authorized signatory · PDF, PNG, JPG · Max 10 MB"
          fileName={formData.repId?.name}
          onChange={file => onChange('repId', file)}
          error={errors.repId}
          tooltip="Valid government-issued photo ID (passport or national ID card) of the person legally authorized to sign on behalf of the company."
          required
        />
      </div>
    </div>
  )
}

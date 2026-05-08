import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'sonner'
import Stepper from '../../shared/components/form/Stepper'
import { STEPS, HELP } from './content'
import { STEP_SCHEMAS, INITIAL_FORM, step3Schema } from './schemas'
import CompanyInfoStep from './components/CompanyInfoStep'
import DocumentUploadStep from './components/DocumentUploadStep'
import WalletConnectionStep from './components/WalletConnectionStep'
import ReviewSubmitStep from './components/ReviewSubmitStep'
import { CheckCircleIcon } from '../../shared/components/icons'
import Spinner from '../../shared/components/ui/Spinner'

const stepVariants = {
  enter:  (dir: number) => ({ x: dir * 40, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit:   (dir: number) => ({ x: dir * -40, opacity: 0, transition: { duration: 0.18, ease: 'easeIn' } }),
}

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep]             = useState(1)
  const [direction, setDirection]                 = useState(1)
  const [formData, setFormData]                   = useState(INITIAL_FORM)
  const [errors, setErrors]                       = useState<Record<string, string>>({})
  const [walletConnected, setWalletConnected]     = useState(false)
  const [isConnectingWallet, setIsConnectingWallet] = useState(false)
  const [isSubmitting, setIsSubmitting]           = useState(false)
  const [isSubmitted, setIsSubmitted]             = useState(false)

  const handleChange = (field: string, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
    if ((field === 'walletAddress' || field === 'network') && walletConnected) {
      setWalletConnected(false)
    }
  }

  const validate = (step: number) => {
    const schema = STEP_SCHEMAS[step]
    if (!schema) return {}
    const result = schema.safeParse(formData)
    const e = result.success
      ? {}
      : Object.fromEntries(
          Object.entries(result.error.flatten().fieldErrors).map(([k, v]) => [k, v[0]])
        )
    if (step === 3 && !walletConnected) e.walletConnect = 'Please connect your wallet before continuing'
    return e
  }

  const handleNext = () => {
    const e = validate(currentStep)
    if (Object.keys(e).length) { setErrors(e); return }
    setDirection(1)
    setCurrentStep(s => s + 1)
    setErrors({})
  }

  const handleBack = () => {
    setDirection(-1)
    setCurrentStep(s => s - 1)
    setErrors({})
  }

  const handleGoToStep = (step: number) => {
    setDirection(step < currentStep ? -1 : 1)
    setCurrentStep(step)
    setErrors({})
  }

  const handleConnectWallet = () => {
    const result = step3Schema.safeParse(formData)
    if (!result.success) {
      const e = Object.fromEntries(
        Object.entries(result.error.flatten().fieldErrors).map(([k, v]) => [k, v[0]])
      )
      setErrors(e)
      return
    }

    setIsConnectingWallet(true)
    setTimeout(() => {
      setIsConnectingWallet(false)
      setWalletConnected(true)
      toast.success('Wallet connected successfully')
    }, 1500)
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 2000)
  }

  const handleReset = () => {
    setFormData(INITIAL_FORM)
    setErrors({})
    setCurrentStep(1)
    setDirection(1)
    setWalletConnected(false)
    setIsSubmitted(false)
  }

  const help = HELP[currentStep - 1]

  // ── Success screen ───────────────────────────────────────────────────────────
  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-xl mx-auto"
      >
        <div className="bg-card rounded-2xl border border-line/80 shadow-sm px-8 py-12 text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 rounded-full bg-success-subtle flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircleIcon className="w-9 h-9 text-success-accent" />
          </motion.div>

          <h2
            className="text-2xl font-bold text-ink mb-3"
          >
            Application Submitted!
          </h2>
          <p className="text-ink-muted mb-2">
            Your onboarding application for{' '}
            <span className="font-semibold text-ink">{formData.companyName}</span> has been received.
          </p>
          <p className="text-sm text-ink-muted mb-8">
            Our KYB review team will verify your documents within{' '}
            <span className="font-medium text-ink-2">2–3 business days</span>. A confirmation will be sent to{' '}
            <span className="font-medium text-ink-2">{formData.businessEmail}</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2.5 bg-brand text-white rounded-lg text-sm font-semibold hover:bg-brand-dark transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 border border-line text-ink-muted rounded-lg text-sm font-medium hover:bg-surface hover:text-ink transition-colors"
            >
              Submit Another
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  // ── Main onboarding flow ─────────────────────────────────────────────────────
  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h2
          className="text-2xl font-bold text-ink"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          Exporter Onboarding
        </h2>
        <p className="text-sm text-ink-muted mt-1">
          Complete company verification and wallet setup to start receiving payments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* ── Form card ── */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-line/80 shadow-sm overflow-hidden">
          {/* Stepper */}
          <div className="px-6 py-5 border-b border-line">
            <Stepper steps={STEPS} currentStep={currentStep} />
          </div>

          {/* Step content */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="px-6 py-6"
              >
                {currentStep === 1 && (
                  <CompanyInfoStep formData={formData} errors={errors} onChange={handleChange} />
                )}
                {currentStep === 2 && (
                  <DocumentUploadStep formData={formData} errors={errors} onChange={handleChange} />
                )}
                {currentStep === 3 && (
                  <WalletConnectionStep
                    formData={formData}
                    errors={errors}
                    onChange={handleChange}
                    walletConnected={walletConnected}
                    isConnecting={isConnectingWallet}
                    onConnectWallet={handleConnectWallet}
                  />
                )}
                {currentStep === 4 && (
                  <ReviewSubmitStep formData={formData} onGoToStep={handleGoToStep} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="px-6 py-4 border-t border-line bg-canvas/50 flex items-center justify-between gap-3">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1.5 px-5 py-2.5 border border-line text-ink-muted hover:bg-surface hover:text-ink rounded-lg text-sm font-medium transition-colors"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-brand text-white hover:bg-brand-dark rounded-lg text-sm font-semibold transition-colors"
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-brand text-white hover:bg-brand-dark rounded-lg text-sm font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <><Spinner /> Submitting…</> : 'Submit Application'}
              </button>
            )}
          </div>
        </div>

        {/* ── Help card ── */}
        <div className="hidden lg:block lg:col-span-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="bg-card rounded-2xl border border-line/80 shadow-sm p-6 sticky top-6"
            >
              <h4 className="text-sm font-semibold text-ink mb-2">{help.title}</h4>

              {help.body && (
                <p className="text-sm text-ink-muted mb-4 leading-relaxed">{help.body}</p>
              )}

              {help.items && (
                <ul className="space-y-2 mb-4">
                  {help.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-ink-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {help.note && (
                <p className="text-xs text-ink-muted bg-surface rounded-lg px-3 py-2.5 leading-relaxed">
                  🔒 {help.note}
                </p>
              )}

              {help.timeline && (
                <div className="space-y-4">
                  {help.timeline.map(({ num, label, desc }) => (
                    <div key={num} className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-full bg-brand-subtle text-brand text-xs font-bold flex items-center justify-center shrink-0">
                        {num}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-ink">{label}</p>
                        <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

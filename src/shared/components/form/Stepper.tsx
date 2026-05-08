interface StepperStep {
  id: string | number
  title: string
  subtitle?: string
}

export default function Stepper({ steps, currentStep }: { steps: StepperStep[]; currentStep: number }) {
  return (
    <>
      {/* Desktop horizontal stepper */}
      <div className="hidden sm:flex items-center">
        {steps.map((step, i) => {
          const num = i + 1
          const isCompleted = num < currentStep
          const isActive = num === currentStep

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-3 shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-brand text-white'
                      : isActive
                      ? 'bg-brand text-white ring-4 ring-brand/20'
                      : 'bg-surface text-ink-faint border border-line'
                  }`}
                >
                  {isCompleted ? (
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                    </svg>
                  ) : num}
                </div>
                <div className="hidden xl:block min-w-0 max-w-[120px]">
                  <p className={`text-xs font-semibold leading-none transition-colors ${isActive ? 'text-brand' : isCompleted ? 'text-ink-2' : 'text-ink-faint'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-ink-faint mt-0.5">{step.subtitle}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mx-4 transition-colors duration-500 ${num < currentStep ? 'bg-brand' : 'bg-line'}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile compact bar */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-brand">Step {currentStep} of {steps.length}</span>
          <span className="text-xs text-ink-muted font-medium">{steps[currentStep - 1]?.title}</span>
        </div>
        <div className="h-1.5 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-brand rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </>
  )
}

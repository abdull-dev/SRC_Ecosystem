import { useState } from 'react'
import { motion } from 'framer-motion'
import { CopyButton } from '../../shared/components/ui/ModalParts'
import { ShieldCheckIcon, BellIcon, CheckCircleIcon, SettingsIcon } from '../../shared/components/icons'

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <motion.div variants={sectionVariants} className="bg-card rounded-2xl border border-line/60 p-6">
      <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-line-subtle">
        <div className="w-8 h-8 rounded-lg bg-brand-subtle flex items-center justify-center shrink-0 text-brand">
          {icon}
        </div>
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
      </div>
      {children}
    </motion.div>
  )
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-line-subtle last:border-0 gap-4">
      <span className="text-sm text-ink-muted shrink-0">{label}</span>
      <span className="text-sm font-medium text-ink text-right">{value}</span>
    </div>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-brand' : 'bg-line'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

function ToggleRow({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-line-subtle last:border-0">
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="text-xs text-ink-muted mt-0.5">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  )
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    payments: true,
    kyb: true,
    marketing: false,
  })

  const toggle = (key: keyof typeof notifications) =>
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))

  const MASKED_API_KEY = 'src_live_••••••••••••••••••••••••••••4f2a'
  const REAL_API_KEY   = 'src_live_k9Xm2pQ8rL5nB3vYwZ7aJ1dC6uT0eF4f2a'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="space-y-6 max-w-3xl mx-auto"
    >
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-ink">Settings</h1>
        <p className="text-sm text-ink-muted mt-0.5">Manage your account, preferences, and security.</p>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-5">

        {/* Profile */}
        <SectionCard title="Profile" icon={<SettingsIcon className="w-4 h-4" />}>
          <FieldRow label="Full Name"    value="Abdullah Tanveer" />
          <FieldRow label="Email"        value="abdullah@srcecosystem.io" />
          <FieldRow label="Company"      value="SRC Ecosystem" />
          <FieldRow label="Role"         value="Platform Admin" />
          <div className="pt-4">
            <button
              type="button"
              className="px-4 py-2 border border-line text-sm font-medium text-ink rounded-lg hover:bg-surface transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </SectionCard>

        {/* Notifications */}
        <SectionCard title="Notifications" icon={<BellIcon className="w-4 h-4" />}>
          <ToggleRow
            label="Email Notifications"
            description="Receive account activity summaries via email"
            checked={notifications.email}
            onChange={() => toggle('email')}
          />
          <ToggleRow
            label="Payment Confirmations"
            description="Get notified when transactions are confirmed on-chain"
            checked={notifications.payments}
            onChange={() => toggle('payments')}
          />
          <ToggleRow
            label="KYB Status Updates"
            description="Alerts when exporter KYB applications change status"
            checked={notifications.kyb}
            onChange={() => toggle('kyb')}
          />
          <ToggleRow
            label="Marketing & Product Updates"
            description="News about new features and platform announcements"
            checked={notifications.marketing}
            onChange={() => toggle('marketing')}
          />
        </SectionCard>

        {/* Security */}
        <SectionCard title="Security" icon={<ShieldCheckIcon className="w-4 h-4" />}>
          {/* 2FA */}
          <div className="flex items-center justify-between py-3 border-b border-line-subtle gap-4">
            <div>
              <p className="text-sm font-medium text-ink">Two-Factor Authentication</p>
              <p className="text-xs text-ink-muted mt-0.5">Add an extra layer of security to your account</p>
            </div>
            <button
              type="button"
              className="px-3 py-1.5 border border-brand text-brand rounded-lg text-xs font-semibold hover:bg-brand hover:text-white transition-colors shrink-0"
            >
              Enable 2FA
            </button>
          </div>

          {/* Active sessions */}
          <div className="flex items-center justify-between py-3 border-b border-line-subtle gap-4">
            <div>
              <p className="text-sm font-medium text-ink">Active Sessions</p>
              <p className="text-xs text-ink-muted mt-0.5">
                <span className="inline-flex items-center gap-1">
                  <CheckCircleIcon className="w-3.5 h-3.5 text-success-accent" />
                  2 active sessions
                </span>
              </p>
            </div>
            <button
              type="button"
              className="px-3 py-1.5 border border-danger-border text-danger rounded-lg text-xs font-semibold hover:bg-danger-subtle transition-colors shrink-0"
            >
              Sign Out All
            </button>
          </div>

          {/* API key */}
          <div className="py-3">
            <p className="text-sm font-medium text-ink mb-1">API Key</p>
            <p className="text-xs text-ink-muted mb-2">Use this key to authenticate API requests from your systems</p>
            <div className="flex items-center gap-2 bg-surface/60 rounded-lg px-3 py-2.5">
              <span className="font-mono text-xs text-ink-muted flex-1 truncate">{MASKED_API_KEY}</span>
              <CopyButton text={REAL_API_KEY} ariaLabel="Copy API key" />
            </div>
          </div>
        </SectionCard>

        {/* Preferences */}
        <SectionCard title="Preferences" icon={<SettingsIcon className="w-4 h-4" />}>
          {[
            { label: 'Currency Display', value: 'USD — US Dollar',    options: ['USD — US Dollar', 'EUR — Euro', 'GBP — British Pound'] },
            { label: 'Timezone',         value: 'UTC+0 (London)',      options: ['UTC+0 (London)', 'UTC+8 (Singapore)', 'UTC-5 (New York)'] },
            { label: 'Language',         value: 'English (US)',        options: ['English (US)', 'Arabic', 'Chinese (Simplified)'] },
          ].map(({ label, value, options }) => (
            <div key={label} className="flex items-center justify-between py-2.5 border-b border-line-subtle last:border-0 gap-4">
              <span className="text-sm text-ink-muted shrink-0">{label}</span>
              <select
                defaultValue={value}
                className="text-sm font-medium text-ink bg-transparent border border-line rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-brand/30 cursor-pointer"
              >
                {options.map(opt => <option key={opt}>{opt}</option>)}
              </select>
            </div>
          ))}
        </SectionCard>

      </motion.div>
    </motion.div>
  )
}

import { useLocation } from 'react-router-dom'
import { SunIcon, MoonIcon, MenuIcon, SearchIcon, BellIcon, ChevronDownIcon } from '../icons'

const PAGE_META = {
  dashboard:    { title: 'Dashboard',    subtitle: 'Monitor exporter activity, payments, and verification status' },
  exporters:    { title: 'Exporters',    subtitle: 'Onboard and manage your exporter network' },
  transactions: { title: 'Transactions', subtitle: 'View and manage all cross-border payments' },
  kyb:          { title: 'KYB Reviews',  subtitle: 'Review and approve exporter verification documents' },
  wallets:      { title: 'Wallets',      subtitle: 'Manage connected wallets and network settings' },
  settings:     { title: 'Settings',     subtitle: 'Configure platform preferences and integrations' },
}

interface TopbarProps {
  setSidebarOpen: (open: boolean) => void
  isDark: boolean
  toggleDark: () => void
}

export default function Topbar({ setSidebarOpen, isDark, toggleDark }: TopbarProps) {
  const { pathname } = useLocation()
  const pageKey = pathname.replace(/^\//, '') || 'dashboard'
  const { title, subtitle } = PAGE_META[pageKey as keyof typeof PAGE_META] ?? PAGE_META.dashboard

  return (
    <header className="h-16 bg-card border-b border-line flex items-center justify-between px-4 lg:px-8 shrink-0 gap-4">
      {/* Left */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-lg text-ink-muted hover:bg-surface hover:text-ink-2"
          aria-label="Open menu"
        >
          <MenuIcon className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-ink leading-none">{title}</h1>
          <p className="text-xs text-ink-muted mt-0.5 hidden sm:block truncate">{subtitle}</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-surface rounded-lg px-3 py-2 hover:bg-surface/80 focus-within:ring-2 focus-within:ring-brand/30 focus-within:bg-card mr-1">
          <SearchIcon className="w-4 h-4 text-ink-faint shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-ink-2 outline-none placeholder:text-ink-faint w-36 lg:w-52"
          />
        </div>

        {/* Dark / Light toggle */}
        <button
          onClick={toggleDark}
          className="p-2 rounded-lg text-ink-muted hover:bg-surface hover:text-ink-2"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-ink-muted hover:bg-surface hover:text-ink-2" aria-label="Notifications">
          <BellIcon className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand rounded-full ring-2 ring-card" />
        </button>

        {/* User */}
        <button className="flex items-center gap-2.5 pl-1.5 pr-2 py-1 rounded-lg hover:bg-surface">
          <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold shrink-0">
            AT
          </div>
          <div className="hidden lg:flex flex-col items-start">
            <span className="text-sm font-medium text-ink-2 leading-none">Abdullah Tanveer</span>
            <span className="text-xs text-ink-muted mt-0.5">Admin</span>
          </div>
          <ChevronDownIcon className="w-3.5 h-3.5 text-ink-faint hidden lg:block" />
        </button>
      </div>
    </header>
  )
}

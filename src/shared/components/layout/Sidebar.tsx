import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { navItems } from '../../data/mockData'
import {
  BrandLogoIcon,
  DashboardIcon,
  ExportersIcon,
  TransactionsIcon,
  ShieldCheckIcon,
  WalletsIcon,
  SettingsIcon,
  DotsCircleIcon,
} from '../icons'

const navContainerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
}

const navItemVariants = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
}

const navIconMap = {
  dashboard:    DashboardIcon,
  exporters:    ExportersIcon,
  transactions: TransactionsIcon,
  kyb:          ShieldCheckIcon,
  wallets:      WalletsIcon,
  settings:     SettingsIcon,
}

function SidebarContent({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-white/10 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center shrink-0">
          <BrandLogoIcon className="w-5 h-5 text-white" />
        </div>
        <span className="text-white font-semibold text-base tracking-tight">
          SRC Ecosystem
        </span>
      </div>

      {/* Navigation */}
      <motion.nav
        variants={navContainerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto"
      >
        {navItems.map(item => {
          const Icon = navIconMap[item.id]
          return (
            <motion.div key={item.id} variants={navItemVariants}>
              <NavLink
                to={`/${item.id}`}
                onClick={onClose}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? 'bg-brand text-white'
                      : 'text-ink-faint hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                {item.label}
                {item.id === 'kyb' && (
                  <span className="ml-auto bg-warning-accent text-white text-xs font-semibold rounded-full px-1.5 py-0.5 leading-none">
                    17
                  </span>
                )}
              </NavLink>
            </motion.div>
          )
        })}
      </motion.nav>

      {/* User profile */}
      <div className="p-3 border-t border-white/10 shrink-0">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold shrink-0">
            AT
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Abdullah Tanveer</p>
            <p className="text-xs text-ink-faint truncate">Admin</p>
          </div>
          <DotsCircleIcon className="w-4 h-4 text-ink-faint shrink-0" />
        </div>
      </div>
    </div>
  )
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: { sidebarOpen: boolean; setSidebarOpen: (open: boolean) => void }) {
  const close = () => setSidebarOpen(false)

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 bg-sidebar z-30">
        <SidebarContent onClose={() => {}} />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
          onClick={close}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-sidebar z-40 flex flex-col lg:hidden transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent onClose={close} />
      </div>
    </>
  )
}

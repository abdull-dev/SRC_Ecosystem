import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import Sidebar from './shared/components/layout/Sidebar'
import Topbar from './shared/components/layout/Topbar'
import DashboardPage    from './features/dashboard'
import ExportersPage    from './features/exporters'
import TransactionsPage from './features/transactions'
import KYBPage          from './features/kyb'
import WalletsPage      from './features/wallets'
import SettingsPage     from './features/settings'
import './App.css'

function RootLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('src-theme')
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('src-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <Toaster
        position="bottom-right"
        theme={isDark ? 'dark' : 'light'}
        richColors
        closeButton
      />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden lg:ml-64">
        <Topbar
          setSidebarOpen={setSidebarOpen}
          isDark={isDark}
          toggleDark={() => setIsDark(d => !d)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index                  element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"       element={<DashboardPage />} />
        <Route path="exporters"       element={<ExportersPage />} />
        <Route path="transactions"    element={<TransactionsPage />} />
        <Route path="kyb"             element={<KYBPage />} />
        <Route path="wallets"         element={<WalletsPage />} />
        <Route path="settings"        element={<SettingsPage />} />
        <Route path="*"               element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}

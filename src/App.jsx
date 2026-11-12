import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Home, Trophy, Crown, QrCode, Megaphone, BookOpen, Menu, X, Bell, ChevronRight, Package, Sun, Moon } from 'lucide-react'
import { useState } from 'react'
import { useApp } from './context/AppContext.jsx'
import { useTheme } from './context/ThemeContext.jsx'

import MasterDashboard  from './pages/MasterDashboard.jsx'
import HouseManagement  from './pages/HouseManagement.jsx'
import EventsScoring    from './pages/EventsScoring.jsx'
import QRAttendance     from './pages/QRAttendance.jsx'
import Announcements    from './pages/Announcements.jsx'
import PointsLedger     from './pages/PointsLedger.jsx'
import LostFound        from './pages/LostFound.jsx'

const NAV = [
  { to: '/',             icon: LayoutDashboard, label: 'CISC Arena',       sub: 'Overview & Standings' },
  { to: '/houses',       icon: Home,            label: 'House Management', sub: 'Members & Profiles' },
  { to: '/events',       icon: Trophy,          label: 'Events & Scoring', sub: 'Competitions' },
  { to: '/attendance',   icon: QrCode,          label: 'QR Attendance',    sub: 'Check-In System' },
  { to: '/announcements',icon: Megaphone,       label: 'Announcements',    sub: 'Posts & Notices' },
  { to: '/points',       icon: BookOpen,        label: 'Points Ledger',    sub: 'Scoring & Audit' },
  { to: '/lostfound',    icon: Package,         label: 'Lost & Found',     sub: 'FindIT — Item Tracking' },
]

function Sidebar({ open, onClose }) {
  const { sortedHouses } = useApp()
  const RANK_COLORS = ['#F59E0B', '#94A3B8', '#B45309']

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/70 z-20 lg:hidden backdrop-blur-sm" onClick={onClose} />}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 flex flex-col transition-transform duration-300 sidebar-panel
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo area */}
        <div className="px-5 pt-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.065)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="arena-brand-mark">
                <Trophy size={19} className="relative z-10" />
              </div>
              <div>
                <p className="font-display font-bold text-sm text-white leading-tight">CISC Arena</p>
                <p className="text-[11px] text-slate-500 leading-tight">System AY 2025–2026</p>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden text-slate-500 hover:text-white transition-colors p-1">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">Navigation</p>
          {NAV.map(({ to, icon: Icon, label, sub }) => (
            <NavLink
              key={to} to={to} end={to === '/'} onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden
                ${isActive ? 'text-white' : 'text-slate-500 hover:text-slate-200'}`
              }
              style={({ isActive }) => isActive ? {
                background: 'linear-gradient(135deg, rgba(124,58,237,0.28), rgba(124,58,237,0.12))',
                border: '1px solid rgba(124,58,237,0.35)',
                boxShadow: '0 2px 14px rgba(124,58,237,0.22)',
              } : { border: '1px solid transparent' }}
            >
              {({ isActive }) => (
                <>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${isActive ? 'bg-purple-500/20' : 'group-hover:bg-white/5'}`}>
                    <Icon size={16} className={isActive ? 'text-purple-400' : 'text-slate-500 group-hover:text-slate-300'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight truncate">{label}</p>
                    <p className="text-[11px] text-slate-600 leading-tight truncate">{sub}</p>
                  </div>
                  <ChevronRight size={12} className={`transition-all ${isActive ? 'opacity-60 text-purple-400' : 'opacity-0 group-hover:opacity-30'}`} />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* House quick standings */}
        <div className="px-4 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.065)' }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-2">Live Standings</p>
          <div className="space-y-1.5">
            {sortedHouses.map((h, i) => (
              <div key={h.id} className="flex items-center gap-2 px-2.5 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-[11px] font-bold w-4 flex-shrink-0" style={{ color: RANK_COLORS[i] }}>
                  {i === 0 ? <Crown size={10} style={{ color: '#F59E0B' }} /> : `#${i + 1}`}
                </span>
                <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0" style={{ background: h.bgGradient }}>
                  {h.logo && <img src={h.logo} className="w-full h-full object-cover" alt="" />}
                </div>
                <span className="text-xs text-slate-400 flex-1 truncate">{h.shortName}</span>
                <span className="text-xs font-bold" style={{ color: h.color }}>{h.points.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}

function Header({ onMenuClick }) {
  const location = useLocation()
  const { theme, toggle } = useTheme()
  const current = NAV.find(n =>
    location.pathname === '/' ? n.to === '/' : location.pathname.startsWith(n.to) && n.to !== '/'
  ) || NAV[0]

  return (
    <header className="h-14 flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-10 header-glass">
      <button onClick={onMenuClick} className="lg:hidden text-slate-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5">
        <Menu size={20} />
      </button>
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold truncate font-display" style={{ color: 'var(--text-1)' }}>{current.label}</h1>
      </div>
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button onClick={toggle}
          className="p-2 rounded-xl transition-all hover:scale-110 relative"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
          {theme === 'dark'
            ? <Sun size={16} className="text-amber-400" />
            : <Moon size={16} style={{ color: '#7C3AED' }} />
          }
        </button>
        {/* Bell */}
        <button className="relative p-2 rounded-xl transition-colors hover:bg-white/5"
          style={{ color: 'var(--text-2)' }}>
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
        </button>
        {/* Admin avatar */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}>AD</div>
          <span className="text-sm hidden sm:block font-medium" style={{ color: 'var(--text-2)' }}>Admin</span>
        </div>
      </div>
    </header>
  )
}

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden" style={{ background: 'var(--bg)' }}>
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Routes>
            <Route path="/"              element={<MasterDashboard />} />
            <Route path="/houses"        element={<HouseManagement />} />
            <Route path="/events"        element={<EventsScoring />} />
            <Route path="/attendance"    element={<QRAttendance />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/points"        element={<PointsLedger />} />
            <Route path="/lostfound"     element={<LostFound />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}

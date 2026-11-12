import { useRef, useState, useEffect } from 'react'
import { Trophy, Users, Zap, CalendarCheck, TrendingUp, Activity, Crown, Star, Flame, BarChart2, Dumbbell, Palette, Wifi, Flag, Target, Award, CheckCircle2, AlertTriangle, XOctagon, Home } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { trendData, events, dashStats } from '../data/mock.js'
import { useApp } from '../context/AppContext.jsx'
import AnimatedCounter from '../components/AnimatedCounter.jsx'

const RANK_COLORS = ['#F59E0B', '#94A3B8', '#B45309']
const CAT_ICONS = { Sports: Dumbbell, Arts: Palette, Online: Wifi, Opening: Flag, 'Larong Pinoy': Target }

const LogoDot = ({ cx, cy, houseId, houses }) => {
  if (!cx || !cy) return null
  const h = houses?.find(h => h.id === houseId)
  if (!h) return null
  const r = 11
  const id = `ld-${houseId}-${Math.round(cx)}`
  return (
    <g>
      <defs>
        <clipPath id={id}><circle cx={cx} cy={cy} r={r} /></clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r + 3} fill={h.color} opacity={0.15} />
      <image href={h.logo} x={cx - r} y={cy - r} width={r * 2} height={r * 2}
        clipPath={`url(#${id})`} preserveAspectRatio="xMidYMid slice" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={h.color} strokeWidth={2} />
    </g>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-2xl px-4 py-3 text-sm" style={{ background: 'var(--bg-modal)', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
      <p className="font-semibold mb-1.5" style={{ color: 'var(--text-1)' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} className="font-medium" style={{ color: p.color }}>{p.name}: {p.value.toLocaleString()} pts</p>
      ))}
    </div>
  )
}

function HouseChampionCard({ house, rank }) {
  const isFirst = rank === 0
  const ref = useRef(null)
  const { sortedHouses } = useApp()
  const maxPts = sortedHouses[0]?.points || 1

  const handleMove = e => {
    const el = ref.current
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px) scale(1.02)`
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    el.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }
  const handleLeave = () => {
    const el = ref.current
    el.style.transform = ''
    el.style.removeProperty('--mx')
    el.style.removeProperty('--my')
  }

  return (
    <div className="relative" style={{ paddingTop: '56px' }}>
      {/* Logo pops above the card — animates in on load with stagger */}
      <div className="absolute inset-x-0 flex justify-center z-10" style={{ top: 0, transform: 'translateY(-50%)' }}>
        <div className="animate-pop-logo relative" style={{ animationDelay: `${rank * 160}ms` }}>
          <div className={`house-medal-ribbon medal-rank-${rank + 1}`} aria-hidden="true" />
          <div className={`w-28 h-28 rounded-full overflow-hidden relative house-emblem ${isFirst ? 'animate-float' : ''}`}
            style={{
              background: house.bgGradient,
              boxShadow: isFirst
                ? `0 12px 40px ${house.glow}, 0 0 0 4px #F59E0B, 0 0 0 8px ${house.color}50`
                : `0 4px 16px ${house.glow}, 0 0 0 3px ${RANK_COLORS[rank]}aa`,
            }}>
            <img src={house.logo} alt={house.name} className="w-full h-full object-cover" />
            {isFirst && <div className="absolute inset-0 opacity-20 animate-spin-slow" style={{ background: 'conic-gradient(from 0deg, transparent 60%, rgba(255,255,255,0.4) 80%, transparent 100%)' }} />}
          </div>
        </div>
      </div>

      {/* Card */}
      <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave}
        className={`glass-card tilt-card relative flex flex-col ${isFirst ? `glass-${house.id.toLowerCase()}` : ''}`}
        style={{ overflow: 'visible', ...(isFirst ? { background: `linear-gradient(135deg, ${house.color}18, ${house.color}08)`, borderColor: `${house.color}45` } : {}) }}>

        {isFirst && <div className="absolute top-0 inset-x-0 h-0.5 rounded-t-[18px]" style={{ background: `linear-gradient(90deg, transparent, ${house.color}, transparent)` }} />}

        {/* House name — padded to clear the popped logo */}
        <div className="pt-14 pb-3 flex flex-col items-center gap-1 text-center px-4">
          <p className="font-display font-bold text-white text-lg leading-tight">{house.name}</p>
          <p className="text-sm mt-0.5 font-medium" style={{ color: house.color }}>{house.description}</p>
        </div>

        {/* Points */}
        <div className="px-5 pb-5 flex flex-col items-center">
          <div className="text-4xl font-bold font-display"
            style={{ background: `linear-gradient(135deg, ${house.colorLight}, ${house.color})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            <AnimatedCounter value={house.points} duration={1600} />
          </div>
          <p className="text-sm text-slate-500 mt-0.5">season points</p>
          <div className="w-full h-2 rounded-full mt-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${(house.points / maxPts) * 100}%`, background: `linear-gradient(90deg, ${house.color}, ${house.colorLight})` }} />
          </div>
          <div className="w-full flex justify-between mt-2">
            <span className="text-sm text-slate-500"><span className="text-white font-semibold">{house.members}</span> members</span>
            <span className="text-sm font-bold" style={{ color: RANK_COLORS[rank] }}>Rank #{rank + 1}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function RankingBars() {
  const { sortedHouses } = useApp()
  const [ready, setReady] = useState(false)
  const max = sortedHouses[0]?.points || 1

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 400)
    return () => clearTimeout(t)
  }, [])

  const RANK_CFG = [
    { bg: 'rgba(245,158,11,0.15)',  fg: '#F59E0B', shadow: '0 0 16px rgba(245,158,11,0.35)' },
    { bg: 'rgba(148,163,184,0.1)',  fg: '#94A3B8', shadow: 'none' },
    { bg: 'rgba(180,83,9,0.12)',    fg: '#B45309', shadow: 'none' },
  ]

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-5">
        <BarChart2 size={16} className="text-purple-400" />
        <h3 className="font-display font-semibold text-base" style={{ color: 'var(--text-1)' }}>Points Comparison</h3>
        <span className="text-xs font-mono ml-auto" style={{ color: 'var(--text-3)' }}>Season Total</span>
      </div>
      <div className="space-y-5">
        {sortedHouses.map((h, i) => {
          const pct = (h.points / max) * 100
          const cfg = RANK_CFG[i]
          return (
            <div key={h.id}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center font-black text-[11px] flex-shrink-0"
                  style={{ background: cfg.bg, color: cfg.fg, border: `1px solid ${cfg.fg}35` }}>
                  {i + 1}
                </div>
                <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0" style={{ background: h.bgGradient, boxShadow: `0 2px 8px ${h.glow}` }}>
                  <img src={h.logo} className="w-full h-full object-cover" alt="" />
                </div>
                <span className="text-sm font-semibold flex-1 truncate" style={{ color: 'var(--text-1)' }}>{h.name}</span>
                <span className="text-xs font-semibold tabular-nums w-8 text-right" style={{ color: cfg.fg }}>{pct.toFixed(0)}%</span>
                <span className="text-sm font-bold tabular-nums w-16 text-right" style={{ color: h.color }}>{h.points.toLocaleString()}</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <div className="h-full rounded-full"
                  style={{
                    width: ready ? `${pct}%` : '0%',
                    background: `linear-gradient(90deg, ${h.color}cc, ${h.colorLight})`,
                    boxShadow: i === 0 ? cfg.shadow : 'none',
                    transition: `width 1.2s cubic-bezier(0.16,1,0.3,1) ${i * 150}ms`,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function MasterDashboard() {
  const { sortedHouses, pointsLog, houses } = useApp()
  const upcoming  = events.filter(e => e.status === 'upcoming').slice(0, 3)
  const recent    = pointsLog.slice(0, 6)
  const totalPts  = houses.reduce((s, h) => s + h.points, 0)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-2xl px-6 py-6"
        style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(217,119,6,0.08) 50%, rgba(220,38,38,0.1) 100%)', border: '1px solid var(--border)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="relative flex flex-wrap gap-4 items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Flame size={16} className="text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">{dashStats.academicYear} · {dashStats.semester}</span>
            </div>
            <h2 className="font-display text-3xl font-bold leading-tight" style={{ color: 'var(--text-1)' }}>CISC Arena</h2>
            <p className="text-base mt-1" style={{ color: 'var(--text-2)' }}>House Competition · Season 2025–2026</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {[
              { label: 'Students',  value: dashStats.totalStudents,    icon: Users,        color: '#7C3AED' },
              { label: 'Events',    value: dashStats.totalEvents,      icon: Trophy,       color: '#D97706' },
              { label: 'Pts Total', value: totalPts,                   icon: Star,         color: '#F59E0B' },
              { label: 'Ongoing',   value: dashStats.ongoingEvents,    icon: Zap,          color: '#10B981' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Icon size={16} style={{ color }} />
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-3)' }}>{label}</p>
                  <p className="text-base font-bold text-white"><AnimatedCounter value={value} /></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* House Standings */}
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <Crown size={18} className="text-amber-400" />
          <h2 className="font-display text-lg font-bold" style={{ color: 'var(--text-1)' }}>House Standings</h2>
          <span className="badge badge-live ml-2 text-xs">● LIVE</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {sortedHouses.map((h, i) => <HouseChampionCard key={h.id} house={h} rank={i} />)}
        </div>
      </div>

      {/* Ranking Bars */}
      <RankingBars />

      {/* Trend + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-purple-400" />
            <h3 className="font-display font-semibold text-base" style={{ color: 'var(--text-1)' }}>Points Trend</h3>
            <span className="text-sm ml-auto" style={{ color: 'var(--text-3)' }}>Aug – Nov 2026</span>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={trendData} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              {sortedHouses.map(h => (
                <Line key={h.id} type="monotone" dataKey={h.shortName} stroke={h.color}
                  strokeWidth={3}
                  dot={(p) => <LogoDot key={`${h.id}-${p.index}`} {...p} houseId={h.id} houses={sortedHouses} />}
                  activeDot={(p) => <LogoDot {...p} houseId={h.id} houses={sortedHouses} />} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <CalendarCheck size={15} className="text-emerald-400" />
              <h3 className="text-base font-semibold" style={{ color: 'var(--text-1)' }}>Upcoming Events</h3>
            </div>
            <div className="space-y-2">
              {upcoming.map(e => (
                <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.2)' }}>
                    {(() => { const I = CAT_ICONS[e.category] || Trophy; return <I size={15} className="text-purple-400" /> })()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-1)' }}>{e.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>{e.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity size={15} style={{ color: 'var(--text-2)' }} />
              <h3 className="text-base font-semibold" style={{ color: 'var(--text-1)' }}>Recent Points</h3>
            </div>
            <div className="space-y-2">
              {recent.map(p => {
                const h = sortedHouses.find(h => h.id === p.houseId)
                const isDeduction = p.points < 0
                return (
                  <div key={p.id} className="flex items-center gap-2.5 py-1.5">
                    <div className="w-6 h-6 rounded-full flex-shrink-0 overflow-hidden" style={{ background: h?.bgGradient }}>
                      {h?.logo && <img src={h.logo} className="w-full h-full object-cover" alt="" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate" style={{ color: 'var(--text-2)' }}>{h?.shortName} · {p.event.length > 25 ? p.event.slice(0, 25) + '…' : p.event}</p>
                    </div>
                    <span className={`text-sm font-bold ${isDeduction ? 'text-red-400' : 'text-emerald-400'}`}>
                      {isDeduction ? '' : '+'}{p.points}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Points System Reference */}
      <div className="glass-card p-5">
        <h3 className="font-display font-semibold text-base mb-4 flex items-center gap-2" style={{ color: 'var(--text-1)' }}>
          <Star size={16} className="text-amber-400" /> Points System Reference
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Award,         label: '1st Place',          pts: '+15', color: '#F59E0B' },
            { icon: Award,         label: '2nd Place',          pts: '+10', color: '#94A3B8' },
            { icon: Award,         label: '3rd Place',          pts: '+5',  color: '#B45309' },
            { icon: CheckCircle2,  label: '100% Attendance',    pts: '+5',  color: '#10B981' },
            { icon: Users,         label: 'Mentoring Session',  pts: '+5',  color: '#6366F1' },
            { icon: Home,          label: 'Community Work',     pts: '+10', color: '#8B5CF6' },
            { icon: AlertTriangle, label: 'Misconduct',         pts: '-2',  color: '#DC2626' },
            { icon: XOctagon,      label: 'Falsified Attendance',pts: '-5', color: '#EF4444' },
          ].map(({ icon: Icon, label, pts, color }) => (
            <div key={label} className="flex items-center justify-between px-4 py-3 rounded-xl"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <span className="text-sm flex items-center gap-2" style={{ color: 'var(--text-2)' }}>
                <Icon size={13} style={{ color, flexShrink: 0 }} /> {label}
              </span>
              <span className="text-base font-bold ml-2 flex-shrink-0" style={{ color }}>{pts}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { QrCode, CheckCircle2, XCircle, Clock, Search, AlertTriangle, Info } from 'lucide-react'
import { attendanceDeductionTable, members, events } from '../data/mock.js'
import { useApp } from '../context/AppContext.jsx'
import { useToast } from '../components/Toast.jsx'

const STATUS_CFG = {
  present: { badge: 'badge-green',  icon: CheckCircle2, label: 'Present' },
  absent:  { badge: 'badge-red',    icon: XCircle,      label: 'Absent'  },
  late:    { badge: 'badge-yellow', icon: Clock,        label: 'Late'    },
}

export default function QRAttendance() {
  const { attendance, addAttendance, houses } = useApp()
  const toast = useToast()

  const [search, setSearch]      = useState('')
  const [houseFilter, setHF]     = useState('All')
  const [manualId, setManualId]  = useState('')
  const [scanResult, setScanResult] = useState(null)
  const [activeEvent, setActiveEvent] = useState(events.find(e => e.status === 'ongoing')?.id || events[0]?.id)
  const [statusOverride, setStatus] = useState('present')

  const counts = {
    present: attendance.filter(a => a.status === 'present').length,
    absent:  attendance.filter(a => a.status === 'absent').length,
    late:    attendance.filter(a => a.status === 'late').length,
  }

  const filtered = attendance.filter(a =>
    (houseFilter === 'All' || a.houseId === houseFilter) &&
    (a.name.toLowerCase().includes(search.toLowerCase()) || a.studentId.toLowerCase().includes(search.toLowerCase()))
  )

  const handleCheckIn = e => {
    e.preventDefault()
    const student = members.find(m => m.id.toLowerCase() === manualId.toLowerCase())
    if (student) {
      const h = houses.find(h => h.id === student.houseId)
      setScanResult({ success: true, name: student.name, house: h?.shortName, houseColor: h?.color, section: student.section, role: student.role })
      const entry = {
        id: 'A' + Date.now(),
        studentId: student.id,
        name: student.name,
        houseId: student.houseId,
        event: events.find(ev => ev.id === activeEvent)?.title || activeEvent,
        date: new Date().toISOString().slice(0, 10),
        time: new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
        status: statusOverride,
      }
      addAttendance(entry)
      toast('Attendance Recorded', `${student.name} marked as ${statusOverride}.`, statusOverride === 'present' ? 'success' : statusOverride === 'late' ? 'info' : 'error')
    } else {
      setScanResult({ success: false, error: `No student found with ID "${manualId}"` })
      toast('Not Found', `No student with ID "${manualId}".`, 'error')
    }
    setManualId('')
    setTimeout(() => setScanResult(null), 5000)
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { key: 'present', label: 'Present', color: '#10B981' },
          { key: 'late',    label: 'Late',    color: '#F59E0B' },
          { key: 'absent',  label: 'Absent',  color: '#DC2626' },
        ].map(({ key, label, color }) => {
          const { icon: Icon } = STATUS_CFG[key]
          return (
            <div key={key} className="glass-card flex items-center gap-3 p-5">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: 'var(--text-3)' }}>{label}</p>
                <p className="text-2xl font-bold font-display" style={{ color }}>{counts[key]}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* QR Panel */}
        <div className="glass-card p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <QrCode size={16} className="text-purple-400" />
            <h2 className="font-display font-semibold text-base" style={{ color: 'var(--text-1)' }}>QR Check-In</h2>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-2">Active Event</label>
            <select className="input-field text-sm" value={activeEvent} onChange={e => setActiveEvent(e.target.value)}>
              {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
            </select>
          </div>

          {/* QR placeholder */}
          <div className="w-full aspect-square max-w-[180px] mx-auto rounded-2xl flex flex-col items-center justify-center gap-3 relative overflow-hidden"
            style={{ background: 'rgba(124,58,237,0.06)', border: '2px dashed rgba(124,58,237,0.3)' }}>
            <div className="absolute inset-0 shimmer opacity-40" />
            <QrCode size={44} className="text-purple-500 opacity-60 relative z-10" />
            <p className="text-xs text-slate-500 text-center relative z-10 px-3">Camera unavailable<br/>Use manual entry below</p>
          </div>

          {/* Status override */}
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-2">Mark As</label>
            <div className="grid grid-cols-3 gap-1.5">
              {['present', 'late', 'absent'].map(s => (
                <button key={s} onClick={() => setStatus(s)}
                  className="py-2 rounded-xl text-xs font-medium capitalize transition-all"
                  style={statusOverride === s
                    ? { background: STATUS_CFG[s].badge === 'badge-green' ? 'rgba(16,185,129,0.25)' : STATUS_CFG[s].badge === 'badge-yellow' ? 'rgba(245,158,11,0.25)' : 'rgba(220,38,38,0.25)',
                        color: 'white', border: `1px solid ${STATUS_CFG[s].badge === 'badge-green' ? 'rgba(16,185,129,0.4)' : STATUS_CFG[s].badge === 'badge-yellow' ? 'rgba(245,158,11,0.4)' : 'rgba(220,38,38,0.4)'}` }
                    : { background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border)' }
                  }>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Manual entry */}
          <form onSubmit={handleCheckIn} className="space-y-2">
            <label className="text-xs font-bold text-slate-500 block">Manual Student ID</label>
            <div className="flex gap-2">
              <input className="input-field flex-1 text-sm" placeholder="e.g. S001" value={manualId}
                onChange={e => setManualId(e.target.value)} />
              <button type="submit" className="btn-primary px-4 text-sm">Check In</button>
            </div>
          </form>

          {/* Result */}
          {scanResult && (
            <div className={`p-3.5 rounded-xl text-sm animate-bounce-in`}
              style={scanResult.success
                ? { background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }
                : { background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)' }}>
              {scanResult.success ? (
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-emerald-400">{scanResult.name}</p>
                    <p style={{ color: 'var(--text-2)' }}>{scanResult.section} · <span style={{ color: scanResult.houseColor }}>{scanResult.house}</span></p>
                    <p style={{ color: 'var(--text-3)' }}>{scanResult.role}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-400">
                  <XCircle size={15} /> {scanResult.error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Attendance log */}
        <div className="lg:col-span-2 glass-card overflow-hidden">
          <div className="px-5 py-3.5 flex flex-wrap gap-3 items-center" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="relative flex-1 min-w-36">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input className="input-field pl-9 text-sm" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="input-field w-auto text-sm" value={houseFilter} onChange={e => setHF(e.target.value)}>
              <option value="All">All Houses</option>
              {houses.map(h => <option key={h.id} value={h.id}>{h.shortName}</option>)}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--table-border)' }}>
                  {['Student', 'ID', 'House', 'Time', 'Status'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest whitespace-nowrap" style={{ color: 'var(--text-3)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-14 text-sm" style={{ color: 'var(--text-3)' }}>No records found.</td></tr>
                )}
                {filtered.map(a => {
                  const h = houses.find(h => h.id === a.houseId)
                  const cfg = STATUS_CFG[a.status]
                  const Icon = cfg.icon
                  return (
                    <tr key={a.id} className="table-row">
                      <td className="px-5 py-3.5 font-medium text-sm" style={{ color: 'var(--text-1)' }}>{a.name}</td>
                      <td className="px-5 py-3.5 font-mono text-xs" style={{ color: 'var(--text-3)' }}>{a.studentId}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0" style={{ background: h?.bgGradient }}>
                            {h?.logo && <img src={h.logo} className="w-full h-full object-cover" alt="" />}
                          </div>
                          <span className="text-sm font-medium" style={{ color: h?.colorLight }}>{h?.shortName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-2)' }}>{a.time}</td>
                      <td className="px-5 py-3.5">
                        <span className={`${cfg.badge} badge flex items-center gap-1 w-fit text-xs`}>
                          <Icon size={10} /> {cfg.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Deduction rules */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={16} className="text-amber-400" />
          <h3 className="font-display font-semibold text-base" style={{ color: 'var(--text-1)' }}>Attendance-Based Point Deduction</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-3)' }}>Absentees per Event</th>
                <th className="text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-3)' }}>Point Deduction</th>
              </tr>
            </thead>
            <tbody>
              {attendanceDeductionTable.map((r, i) => (
                <tr key={i} className="table-row">
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-1)' }}>{r.absentees}</td>
                  <td className="px-4 py-3">
                    <span className="badge badge-red font-bold text-sm">−{r.deduction} pts</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-start gap-2 p-3.5 rounded-xl"
          style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
          <Info size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <span className="text-sm" style={{ color: 'var(--text-2)' }}>+5 bonus points for 100% attendance in any official event. Falsifying attendance results in −5 points and disciplinary action.</span>
        </div>
      </div>
    </div>
  )
}

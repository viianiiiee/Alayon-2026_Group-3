import { useState } from 'react'
import { Plus, Search, TrendingUp, Shield, Trophy, Crown, Users, AlertTriangle } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { useToast } from '../components/Toast.jsx'
import Confetti from '../components/Confetti.jsx'

const CAT_BADGE = {
  Sports:       'badge-blue',
  Arts:         'badge-purple',
  Online:       'badge-blue',
  Volunteerism: 'badge-green',
  Attendance:   'badge-green',
  Deduction:    'badge-red',
}
const PLACE_BADGE = { 1: 'points-badge-1st', 2: 'points-badge-2nd', 3: 'points-badge-3rd' }
const PLACE_LABEL = { 1: '1st', 2: '2nd', 3: '3rd' }

export default function PointsLedger() {
  const { sortedHouses, houses, pointsLog, auditLog, awardPoints } = useApp()
  const toast = useToast()

  const [tab, setTab]           = useState('ledger')
  const [search, setSearch]     = useState('')
  const [houseFilter, setHF]    = useState('All')
  const [catFilter, setCF]      = useState('All')
  const [modal, setModal]       = useState(false)
  const [form, setForm]         = useState({ houseId: 'PERL', event: '', category: 'Sports', place: '1', customPoints: '', note: '', type: 'competition' })
  const [confetti, setConfetti] = useState({ active: false, x: 0, y: 0 })

  const getHouse = id => houses.find(h => h.id === id)

  const filteredLedger = pointsLog.filter(p =>
    (houseFilter === 'All' || p.houseId === houseFilter) &&
    (catFilter   === 'All' || p.category === catFilter) &&
    (getHouse(p.houseId)?.shortName.toLowerCase().includes(search.toLowerCase()) ||
     p.event.toLowerCase().includes(search.toLowerCase()))
  )

  const filteredAudit = (auditLog || []).filter(a =>
    a.action.toLowerCase().includes(search.toLowerCase()) ||
    a.target.toLowerCase().includes(search.toLowerCase()) ||
    a.actor.toLowerCase().includes(search.toLowerCase())
  )

  const getPoints = () => {
    if (form.type === 'competition') return { 1: 15, 2: 10, 3: 5 }[Number(form.place)] || 5
    if (form.type === 'deduction') return -2
    return Number(form.customPoints) || 0
  }

  const handleAward = e => {
    if (!form.event.trim()) {
      toast('Missing field', 'Please enter an event or reason.', 'error')
      return
    }
    const pts = getPoints()
    const entry = {
      id: 'P' + Date.now(),
      houseId: form.houseId,
      event: form.event,
      category: form.category,
      place: form.type === 'competition' ? Number(form.place) : null,
      points: pts,
      awardedBy: 'Admin',
      date: new Date().toISOString().slice(0, 10),
      note: form.note,
    }
    awardPoints(form.houseId, pts, entry)

    // Trigger confetti for positive awards
    if (pts > 0) {
      const rect = e.currentTarget.closest('.modal-panel')?.getBoundingClientRect()
      setConfetti({ active: true, x: rect ? rect.left + rect.width / 2 : window.innerWidth / 2, y: rect ? rect.top + 60 : 200 })
      setTimeout(() => setConfetti(c => ({ ...c, active: false })), 1200)
    }

    const h = getHouse(form.houseId)
    toast(pts > 0 ? 'Points Awarded!' : 'Deduction Applied',
      `${h?.shortName} ${pts > 0 ? '+' : ''}${pts} pts — ${form.event}`,
      pts > 0 ? 'award' : 'error'
    )
    setModal(false)
    setForm(f => ({ ...f, event: '', note: '', customPoints: '' }))
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <Confetti {...confetti} />

      {/* House totals */}
      <div className="grid grid-cols-3 gap-3">
        {sortedHouses.map((h, i) => (
          <div key={h.id} className="glass-card p-5 overflow-hidden relative"
            style={i === 0 ? { borderColor: `${h.color}45`, boxShadow: `0 6px 30px ${h.glow}` } : {}}>
            {i === 0 && <div className="absolute top-0 inset-x-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${h.color}, transparent)` }} />}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0" style={{ background: h.bgGradient, boxShadow: `0 2px 10px ${h.glow}` }}>
                <img src={h.logo} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: 'var(--text-1)' }}>{h.shortName}</p>
                {i === 0 && <span className="badge badge-gold text-[10px] flex items-center gap-1"><Crown size={9} /> Leading</span>}
              </div>
            </div>
            <p className="text-3xl font-bold font-display" style={{ color: h.color }}>{h.points.toLocaleString()}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>season points</p>
            <div className="mt-2.5 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${(h.points / sortedHouses[0].points) * 100}%`, background: `linear-gradient(90deg, ${h.color}, ${h.colorLight})` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        {[
          { key: 'ledger', icon: TrendingUp, label: 'Points Ledger' },
          { key: 'audit',  icon: Shield,     label: 'Audit Trail' },
        ].map(({ key, icon: Icon, label }) => (
          <button key={key} onClick={() => { setTab(key); setSearch('') }}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === key ? 'text-white' : 'text-slate-500 hover:text-slate-200'}`}
            style={tab === key ? { background: 'rgba(124,58,237,0.3)', border: '1px solid rgba(124,58,237,0.4)' } : {}}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {tab === 'ledger' && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-48">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input className="input-field pl-9 text-sm" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="input-field w-auto text-sm" value={houseFilter} onChange={e => setHF(e.target.value)}>
              <option value="All">All Houses</option>
              {houses.map(h => <option key={h.id} value={h.id}>{h.shortName}</option>)}
            </select>
            <select className="input-field w-auto text-sm" value={catFilter} onChange={e => setCF(e.target.value)}>
              <option value="All">All Categories</option>
              {['Sports', 'Arts', 'Online', 'Volunteerism', 'Attendance', 'Deduction'].map(c => <option key={c}>{c}</option>)}
            </select>
            <button onClick={() => setModal(true)} className="btn-gold flex items-center gap-1.5 text-sm">
              <Plus size={15} /> Award Points
            </button>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--table-border)' }}>
                    {['Ref', 'House', 'Event', 'Category', 'Place', 'Points', 'By', 'Date', 'Note'].map(h => (
                      <th key={h} className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest whitespace-nowrap" style={{ color: 'var(--text-3)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLedger.length === 0 && (
                    <tr><td colSpan={9} className="text-center py-14 text-sm" style={{ color: 'var(--text-3)' }}>No records found.</td></tr>
                  )}
                  {filteredLedger.map(p => {
                    const h = getHouse(p.houseId)
                    const isDeduction = p.points < 0
                    return (
                      <tr key={p.id} className="table-row">
                        <td className="px-5 py-3.5 font-mono text-xs" style={{ color: 'var(--text-3)' }}>{p.id}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0" style={{ background: h?.bgGradient }}>
                              {h?.logo && <img src={h.logo} className="w-full h-full object-cover" alt="" />}
                            </div>
                            <span className="text-sm font-bold" style={{ color: h?.colorLight }}>{h?.shortName}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-sm max-w-[160px] truncate" style={{ color: 'var(--text-2)' }}>{p.event}</td>
                        <td className="px-5 py-3.5"><span className={`${CAT_BADGE[p.category] || 'badge-gray'} badge text-xs`}>{p.category}</span></td>
                        <td className="px-5 py-3.5 text-sm">{p.place ? <span className={PLACE_BADGE[p.place]}>{PLACE_LABEL[p.place]}</span> : <span style={{ color: 'var(--text-3)' }}>—</span>}</td>
                        <td className="px-5 py-3.5">
                          <span className={`text-base font-bold ${isDeduction ? 'text-red-400' : 'text-emerald-400'}`}>
                            {isDeduction ? '' : '+'}{p.points}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-3)' }}>{p.awardedBy}</td>
                        <td className="px-5 py-3.5 text-sm whitespace-nowrap" style={{ color: 'var(--text-3)' }}>{p.date}</td>
                        <td className="px-5 py-3.5 text-sm max-w-[120px] truncate" style={{ color: 'var(--text-3)' }}>{p.note || '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'audit' && (
        <div className="space-y-3">
          <div className="relative max-w-sm">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input className="input-field pl-9 text-sm" placeholder="Search audit logs…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--table-border)' }}>
                    {['Ref', 'Action', 'Actor', 'Target', 'Timestamp'].map(h => (
                      <th key={h} className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredAudit.map(a => (
                    <tr key={a.id} className="table-row">
                      <td className="px-5 py-3.5 font-mono text-xs" style={{ color: 'var(--text-3)' }}>{a.id}</td>
                      <td className="px-5 py-3.5"><span className="badge badge-purple text-xs">{a.action}</span></td>
                      <td className="px-5 py-3.5 text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{a.actor}</td>
                      <td className="px-5 py-3.5 text-sm max-w-[200px] truncate" style={{ color: 'var(--text-2)' }} title={a.target}>{a.target}</td>
                      <td className="px-5 py-3.5 text-sm whitespace-nowrap" style={{ color: 'var(--text-3)' }}>{a.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Award Points Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal-panel max-w-md" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <Trophy size={18} className="text-amber-400" />
              <h3 className="font-display font-semibold text-base" style={{ color: 'var(--text-1)' }}>Award Points</h3>
              <button onClick={() => setModal(false)} className="ml-auto text-slate-500 hover:text-slate-200 text-xl leading-none">✕</button>
            </div>

            {/* Points preview */}
            <div className="mx-6 mt-5 p-4 rounded-xl flex items-center justify-between"
              style={{ background: getPoints() < 0 ? 'rgba(220,38,38,0.1)' : 'rgba(16,185,129,0.1)', border: `1px solid ${getPoints() < 0 ? 'rgba(220,38,38,0.3)' : 'rgba(16,185,129,0.3)'}` }}>
              <span className="text-sm" style={{ color: 'var(--text-2)' }}>Points to award:</span>
              <span className={`text-3xl font-bold font-display ${getPoints() < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {getPoints() > 0 ? '+' : ''}{getPoints()}
              </span>
            </div>

            <div className="modal-body space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-2">Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { v: 'competition', label: 'Competition',  icon: Trophy,         color: 'rgba(245,158,11,0.25)' },
                    { v: 'volunteerism', label: 'Volunteerism', icon: Users,          color: 'rgba(16,185,129,0.25)' },
                    { v: 'deduction',   label: 'Deduction',    icon: AlertTriangle,  color: 'rgba(220,38,38,0.25)' },
                  ].map(({ v, label, icon: Icon, color }) => (
                    <button key={v} onClick={() => setForm(p => ({ ...p, type: v }))}
                      className="py-2.5 px-2 rounded-xl text-xs font-semibold transition-all text-center flex flex-col items-center gap-1"
                      style={form.type === v ? { background: color, color: 'white', border: `1px solid ${color}` } : { background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border)' }}>
                      <Icon size={14} /> {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-2">House</label>
                <select className="input-field text-sm" value={form.houseId} onChange={e => setForm(p => ({ ...p, houseId: e.target.value }))}>
                  {houses.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-2">Event / Reason</label>
                <input className="input-field text-sm" placeholder="e.g. Basketball Finals" value={form.event} onChange={e => setForm(p => ({ ...p, event: e.target.value }))} />
              </div>
              {form.type === 'competition' && (
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-2">Placement</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[['1','1st — +15 pts'], ['2','2nd — +10 pts'], ['3','3rd — +5 pts']].map(([v, l]) => (
                      <button key={v} onClick={() => setForm(p => ({ ...p, place: v }))}
                        className="py-2.5 px-2 rounded-xl text-xs font-medium transition-all"
                        style={form.place === v
                          ? { background: 'rgba(245,158,11,0.2)', color: '#FCD34D', border: '1px solid rgba(245,158,11,0.3)' }
                          : { background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border)' }}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {form.type === 'volunteerism' && (
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-2">Points (+5 mentoring / +10 community)</label>
                  <input type="number" className="input-field text-sm" value={form.customPoints} onChange={e => setForm(p => ({ ...p, customPoints: e.target.value }))} placeholder="5 or 10" min="1" />
                </div>
              )}
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-2">Note (optional)</label>
                <input className="input-field text-sm" placeholder="e.g. 1st place — Best choreography" value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={handleAward} className="btn-gold flex-1 text-sm">Confirm Award</button>
              <button onClick={() => setModal(false)} className="btn-secondary flex-1 text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

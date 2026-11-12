import { useState } from 'react'
import { Plus, Trophy, Calendar, Edit3, Flame, CheckCircle2, Clock, Dumbbell, Palette, Wifi, Flag, Target, Crown } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { useToast } from '../components/Toast.jsx'

const STATUS_CONFIG = {
  upcoming:  { badge: 'badge-blue',   label: 'Upcoming',  icon: Clock },
  ongoing:   { badge: 'badge-live',   label: '● Live',    icon: Flame },
  completed: { badge: 'badge-green',  label: 'Completed', icon: CheckCircle2 },
}
const CAT_ICON = { Sports: Dumbbell, Arts: Palette, Online: Wifi, Opening: Flag, 'Larong Pinoy': Target }
function CatIcon({ category, size = 18 }) {
  const Icon = CAT_ICON[category] || Trophy
  return <Icon size={size} />
}

const POINTS_FOR_PLACE = { 1: 15, 2: 10, 3: 5 }

export default function EventsScoring() {
  const { events, saveEventScores, houses } = useApp()
  const toast = useToast()

  const [filter, setFilter]   = useState('All')
  const [selected, setSelected] = useState(null)
  const [scores, setScores]   = useState({})
  const [newEventModal, setNEM] = useState(false)
  const [newEvent, setNewEvent] = useState({ title: '', category: 'Sports', date: '', notes: '' })

  const filtered = events.filter(e => filter === 'All' || e.status === filter)
  const sortedHouses = [...houses].sort((a, b) => b.points - a.points)

  const handleSaveScores = () => {
    if (Object.keys(scores).length === 0) {
      toast('No scores entered', 'Please enter scores for at least one house.', 'error')
      return
    }
    saveEventScores(selected.id, scores)
    toast('Scores Saved!', `${selected.title} — results finalized and points awarded.`, 'award')
    setSelected(null)
    setScores({})
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          {['All', 'upcoming', 'ongoing', 'completed'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${filter === f ? 'text-white' : 'text-slate-500 hover:text-slate-200'}`}
              style={filter === f ? { background: 'rgba(124,58,237,0.3)', border: '1px solid rgba(124,58,237,0.4)' } : {}}>
              {f === 'All' ? 'All Events' : STATUS_CONFIG[f]?.label}
            </button>
          ))}
        </div>
        <button onClick={() => setNEM(true)} className="btn-primary flex items-center gap-2 text-sm ml-auto">
          <Plus size={15} /> New Event
        </button>
      </div>

      {/* Points reference */}
      <div className="flex flex-wrap gap-3 px-5 py-3 rounded-xl text-sm"
        style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
        <span className="text-amber-400 font-bold flex items-center gap-1.5"><Trophy size={14} /> Points System:</span>
        <span className="text-amber-300">1st = <strong>+15</strong></span>
        <span style={{ color: 'var(--text-3)' }}>·</span>
        <span style={{ color: 'var(--text-2)' }}>2nd = <strong>+10</strong></span>
        <span style={{ color: 'var(--text-3)' }}>·</span>
        <span style={{ color: 'var(--text-2)' }}>3rd = <strong>+5</strong></span>
      </div>

      {/* Events grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(ev => {
          const cfg = STATUS_CONFIG[ev.status]
          const hasScores = Object.keys(ev.scores).length > 0
          const scoredSorted = hasScores
            ? Object.entries(ev.scores).sort((a, b) => b[1] - a[1])
            : []

          return (
            <div key={ev.id} className="glass-card flex flex-col overflow-hidden">
              <div className="h-1" style={{
                background: ev.status === 'ongoing'
                  ? 'linear-gradient(90deg, #10B981, #34D399)'
                  : ev.status === 'completed'
                  ? 'linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3), rgba(255,255,255,0.1))'
                  : 'linear-gradient(90deg, rgba(99,102,241,0.6), rgba(139,92,246,0.6))'
              }} />

              <div className="p-5 flex flex-col gap-3 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)' }}>
                      <CatIcon category={ev.category} size={16} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm leading-tight" style={{ color: 'var(--text-1)' }}>{ev.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>{ev.category}</p>
                    </div>
                  </div>
                  <span className={`${cfg?.badge} badge flex-shrink-0 text-xs`}>{cfg?.label}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-3)' }}>
                  <Calendar size={11} />
                  <span>{ev.date}</span>
                  {ev.notes && <span className="ml-1 truncate">— {ev.notes}</span>}
                </div>

                {hasScores && (
                  <div className="pt-2">
                    {/* Podium: 2nd | 1st | 3rd */}
                    <div className="flex items-end justify-center gap-1.5 h-40">
                      {[1, 0, 2].map((si, pi) => {
                        if (!scoredSorted[si]) return null
                        const [hId, score] = scoredSorted[si]
                        const h = houses.find(h => h.id === hId)
                        if (!h) return null
                        const podH = ['68px', '90px', '52px'][pi]
                        const lbl = ['2nd', '1st', '3rd'][pi]
                        const lc = ['#94A3B8', '#F59E0B', '#B45309'][pi]
                        return (
                          <div key={hId} className="flex flex-col items-center flex-1">
                            {pi === 1 && <Crown size={13} className="text-amber-400 mb-0.5 animate-crown" />}
                            <div className={`${pi === 1 ? 'w-14 h-14' : 'w-12 h-12'} rounded-full overflow-hidden mb-2 flex-shrink-0`}
                              style={{ background: h.bgGradient, boxShadow: `0 0 0 3px ${lc}, 0 8px 20px ${h.glow}` }}>
                              <img src={h.logo} className="w-full h-full object-cover" alt={h.name} />
                            </div>
                            <div className="w-full rounded-t-xl flex flex-col items-center pt-1.5 pb-1 gap-0.5"
                              style={{ background: `${h.color}18`, border: `1px solid ${h.color}25`, borderBottom: 'none', height: podH }}>
                              <span className="text-[10px] font-black leading-none" style={{ color: lc }}>{lbl}</span>
                              <span className="text-[10px] font-semibold leading-none mt-auto" style={{ color: h.colorLight }}>{h.shortName}</span>
                              <span className="text-xs font-bold leading-none" style={{ color: h.color }}>{score}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {ev.status === 'ongoing' && !hasScores && (
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-emerald-400"
                    style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <Flame size={13} /> Scoring in progress…
                  </div>
                )}

                <div className="flex gap-2 mt-auto pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                  <button onClick={() => { setSelected(ev); setScores(ev.scores || {}) }}
                    className="btn-secondary flex-1 text-xs py-2 flex items-center justify-center gap-1.5">
                    <Edit3 size={12} /> {ev.status === 'upcoming' ? 'Edit' : 'Manage Scores'}
                  </button>
                  {ev.status !== 'completed' && (
                    <button onClick={() => { setSelected(ev); setScores(ev.scores || {}) }}
                      className="btn-gold flex-1 text-xs py-2">
                      {ev.status === 'upcoming' ? 'Start Event' : 'Finalize'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Score Entry Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-panel max-w-md" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="font-display font-semibold text-base" style={{ color: 'var(--text-1)' }}>{selected.title}</h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>{selected.date} · {selected.category}</p>
              </div>
              <button onClick={() => setSelected(null)} className="ml-auto text-slate-500 hover:text-slate-200 text-xl leading-none">✕</button>
            </div>
            <div className="modal-body space-y-3">
              <p className="text-sm" style={{ color: 'var(--text-2)' }}>Enter raw competition scores per house. Points (+15/+10/+5) will be awarded based on rank.</p>
              {houses.map(h => (
                <div key={h.id} className="flex items-center gap-3 p-3.5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0" style={{ background: h.bgGradient }}>
                    <img src={h.logo} className="w-full h-full object-cover" alt="" />
                  </div>
                  <span className="flex-1 text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{h.shortName}</span>
                  <input type="number" min="0" className="input-field w-24 text-center text-sm py-2"
                    placeholder="0" value={scores[h.id] ?? (selected.scores?.[h.id] ?? '')}
                    onChange={e => setScores(p => ({ ...p, [h.id]: Number(e.target.value) }))} />
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button onClick={handleSaveScores} className="btn-gold flex-1">Save & Award Points</button>
              <button onClick={() => setSelected(null)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* New Event Modal */}
      {newEventModal && (
        <div className="modal-overlay" onClick={() => setNEM(false)}>
          <div className="modal-panel max-w-md" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <Trophy size={18} className="text-purple-400" />
              <h3 className="font-display font-semibold text-base" style={{ color: 'var(--text-1)' }}>New Event</h3>
              <button onClick={() => setNEM(false)} className="ml-auto text-slate-500 hover:text-slate-200 text-xl leading-none">✕</button>
            </div>
            <div className="modal-body space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-2">Event Title</label>
                <input className="input-field text-sm" placeholder="e.g. Volleyball Women" value={newEvent.title} onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-2">Category</label>
                  <select className="input-field text-sm" value={newEvent.category} onChange={e => setNewEvent(p => ({ ...p, category: e.target.value }))}>
                    {['Sports', 'Arts', 'Online', 'Larong Pinoy', 'Opening'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-2">Date</label>
                  <input type="date" className="input-field text-sm" value={newEvent.date} onChange={e => setNewEvent(p => ({ ...p, date: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-2">Notes</label>
                <input className="input-field text-sm" placeholder="Optional notes…" value={newEvent.notes} onChange={e => setNewEvent(p => ({ ...p, notes: e.target.value }))} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-primary flex-1" onClick={() => {
                if (!newEvent.title || !newEvent.date) { toast('Missing fields', 'Fill in title and date.', 'error'); return }
                // In a real app, would add to events via context
                toast('Event Created', `"${newEvent.title}" added to the schedule.`, 'success')
                setNewEvent({ title: '', category: 'Sports', date: '', notes: '' })
                setNEM(false)
              }}>Create Event</button>
              <button onClick={() => setNEM(false)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

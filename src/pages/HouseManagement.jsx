import { useState, useRef } from 'react'
import { Search, Shield, Crown, Star, UserPlus, X } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { useToast } from '../components/Toast.jsx'
import { members as initMembers } from '../data/mock.js'

const ROLE_STYLE = {
  'House Leader': { class: 'badge-purple', icon: Crown },
  'Secretary':    { class: 'badge-blue',   icon: Star },
  'Year Rep':     { class: 'badge-yellow', icon: Shield },
  'Member':       { class: 'badge-gray',   icon: null },
}
const ROLE_ORDER = ['House Leader', 'Secretary', 'Year Rep', 'Member']
const BLANK_MEMBER = { name: '', id: '', section: '', yearLevel: '1', role: 'Member', gender: 'F' }

function HouseCard({ h, isActive, maxPts, onClick }) {
  const ref = useRef(null)
  const handleMove = e => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px) scale(1.02)`
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    el.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }
  const handleLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = ''
    el.style.removeProperty('--mx')
    el.style.removeProperty('--my')
  }
  return (
    <button ref={ref} onClick={onClick} onMouseMove={handleMove} onMouseLeave={handleLeave}
      className={`glass-card tilt-card p-5 text-left transition-all duration-300 ${isActive ? `glass-${h.id.toLowerCase()}` : ''}`}
      style={isActive ? { borderColor: `${h.color}55`, boxShadow: `0 6px 30px ${h.glow}` } : {}}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0" style={{ background: h.bgGradient, boxShadow: `0 4px 14px ${h.glow}` }}>
          <img src={h.logo} alt={h.name} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0">
          <p className="font-display font-bold text-sm leading-tight" style={{ color: 'var(--text-1)' }}>{h.name}</p>
          <p className="text-xs mt-0.5" style={{ color: h.color }}>{h.description}</p>
        </div>
      </div>
      <div className="flex justify-between text-sm">
        <span style={{ color: 'var(--text-3)' }}><span className="font-bold" style={{ color: 'var(--text-1)' }}>{h.members}</span> members</span>
        <span className="font-bold" style={{ color: h.color }}>{h.points.toLocaleString()} pts</span>
      </div>
      <div className="mt-2.5 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${(h.points / maxPts) * 100}%`, background: `linear-gradient(90deg, ${h.color}, ${h.colorLight})` }} />
      </div>
    </button>
  )
}

export default function HouseManagement() {
  const { houses } = useApp()
  const toast = useToast()

  const [activeId, setActiveId]   = useState('PERL')
  const [search, setSearch]       = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [members, setMembers]     = useState(initMembers)
  const [addModal, setAddModal]   = useState(false)
  const [form, setForm]           = useState(BLANK_MEMBER)

  const house = houses.find(h => h.id === activeId)
  const houseMembers = members.filter(m =>
    m.houseId === activeId &&
    (roleFilter === 'All' || m.role === roleFilter) &&
    (m.name.toLowerCase().includes(search.toLowerCase()) || m.id.toLowerCase().includes(search.toLowerCase()))
  ).sort((a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role))

  const maxPts = [...houses].sort((a, b) => b.points - a.points)[0]?.points || 1

  const handleAddMember = () => {
    if (!form.name || !form.id) {
      toast('Missing fields', 'Please enter a name and ID.', 'error')
      return
    }
    const newMember = {
      ...form,
      houseId: activeId,
      yearLevel: Number(form.yearLevel),
      avatar: form.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
    }
    setMembers(m => [...m, newMember])
    toast('Member Added', `${form.name} added to ${house?.shortName}.`, 'success')
    setForm(BLANK_MEMBER)
    setAddModal(false)
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* House selector */}
      <div className="grid grid-cols-3 gap-3">
        {houses.map(h => (
          <HouseCard key={h.id} h={h} isActive={activeId === h.id} maxPts={maxPts} onClick={() => setActiveId(h.id)} />
        ))}
      </div>

      {/* House detail */}
      {house && (
        <div className="glass-card overflow-hidden">
          {/* Banner */}
          <div className="relative px-6 py-8 overflow-hidden min-h-[260px]" style={{ background: `linear-gradient(120deg, #12121c 0%, #181823 72%, ${house.color}18 100%)`, borderBottom: `1px solid ${house.color}30` }}>
            <div className="absolute inset-0 opacity-5" style={{ background: house.bgGradient }} />
            <img src={house.logo} alt="" className="house-detail-watermark" />
            <div className="relative flex flex-wrap gap-6 items-start z-[2]">
              <div className="flex-1 min-w-0 lg:pr-80">
                <h2 className="font-display text-3xl font-bold leading-tight text-white">{house.name}</h2>
                <p className="text-sm mt-1 mb-6 text-white/75">{house.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: '4th Yr Leader', value: house.leader4th },
                    { label: '3rd Yr Leader', value: house.leader3rd },
                    { label: 'Secretary',     value: house.secretary },
                    { label: 'House Parent',  value: house.houseParent },
                    { label: 'House Master',  value: house.houseMaster },
                    { label: 'Total Members', value: house.members },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-xl px-3 py-2.5 backdrop-blur-sm" style={{ background: 'rgba(5,5,12,.3)', border: '1px solid rgba(255,255,255,.12)' }}>
                      <p className="text-xs text-white/55">{label}</p>
                      <p className="text-sm font-bold mt-0.5 text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-display text-4xl font-bold text-white">{house.points.toLocaleString()}</p>
                <p className="text-sm text-white/55">season points</p>
                <div className="mt-2 flex items-center gap-1.5 justify-end">
                  <Crown size={14} style={{ color: '#F59E0B' }} />
                  <span className="text-sm font-bold" style={{ color: '#F59E0B' }}>Rank #{house.rank}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Year Reps */}
          <div className="px-6 py-3 flex flex-wrap gap-2 items-center" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
            <span className="text-xs font-bold uppercase tracking-wide mr-1" style={{ color: 'var(--text-3)' }}>Year Reps:</span>
            {house.yearReps.map(r => (
              <span key={r} className="badge badge-gray text-xs">{r}</span>
            ))}
          </div>

          {/* Toolbar */}
          <div className="px-6 py-3.5 flex flex-wrap gap-3 items-center" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="relative flex-1 min-w-48">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input className="input-field pl-9 text-sm" placeholder="Search members…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              {['All', 'House Leader', 'Secretary', 'Year Rep', 'Member'].map(r => (
                <button key={r} onClick={() => setRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${roleFilter === r ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  style={roleFilter === r ? { background: `${house.color}30`, border: `1px solid ${house.color}50` } : {}}>
                  {r}
                </button>
              ))}
            </div>
            <button onClick={() => { setForm(BLANK_MEMBER); setAddModal(true) }}
              className="btn-primary flex items-center gap-1.5 text-sm py-2.5">
              <UserPlus size={14} /> Add Member
            </button>
          </div>

          {/* Members table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--table-border)' }}>
                  {['Member', 'ID', 'Year & Section', 'Role', 'Gender'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {houseMembers.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-14 text-sm" style={{ color: 'var(--text-3)' }}>No members found.</td></tr>
                )}
                {houseMembers.map(m => {
                  const roleStyle = ROLE_STYLE[m.role]
                  const RoleIcon = roleStyle?.icon
                  return (
                    <tr key={m.id} className="table-row">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{ background: `linear-gradient(135deg, ${house.color}, ${house.colorLight})` }}>
                            {m.avatar}
                          </div>
                          <span className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{m.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs" style={{ color: 'var(--text-3)' }}>{m.id}</td>
                      <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-2)' }}>{m.yearLevel}st Year · {m.section}</td>
                      <td className="px-5 py-3.5">
                        <span className={`${roleStyle?.class || 'badge-gray'} badge flex items-center gap-1 w-fit text-xs`}>
                          {RoleIcon && <RoleIcon size={10} />} {m.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-2)' }}>{m.gender === 'F' ? '♀ Female' : '♂ Male'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 text-sm" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-3)' }}>
            Showing {houseMembers.length} of {members.filter(m => m.houseId === activeId).length} members
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {addModal && (
        <div className="modal-overlay" onClick={() => setAddModal(false)}>
          <div className="modal-panel max-w-md" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <UserPlus size={18} className="text-purple-400" />
              <h3 className="font-display font-semibold text-base" style={{ color: 'var(--text-1)' }}>Add Member to {house?.shortName}</h3>
              <button onClick={() => setAddModal(false)} className="ml-auto text-slate-500 hover:text-slate-200 text-xl leading-none">✕</button>
            </div>
            <div className="modal-body space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-500 block mb-2">Full Name <span className="text-red-400">*</span></label>
                  <input className="input-field text-sm" placeholder="e.g. Juan Dela Cruz" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-2">Student ID <span className="text-red-400">*</span></label>
                  <input className="input-field text-sm" placeholder="e.g. S020" value={form.id} onChange={e => setForm(p => ({ ...p, id: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-2">Year Level</label>
                  <select className="input-field text-sm" value={form.yearLevel} onChange={e => setForm(p => ({ ...p, yearLevel: e.target.value }))}>
                    {['1','2','3','4'].map(y => <option key={y} value={y}>{y}st/nd/rd/th Year</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-500 block mb-2">Section</label>
                  <input className="input-field text-sm" placeholder="e.g. BSCS 1-A" value={form.section} onChange={e => setForm(p => ({ ...p, section: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-2">Role</label>
                  <select className="input-field text-sm" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                    {ROLE_ORDER.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-2">Gender</label>
                  <select className="input-field text-sm" value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}>
                    <option value="F">Female</option>
                    <option value="M">Male</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={handleAddMember} className="btn-primary flex-1">Add Member</button>
              <button onClick={() => setAddModal(false)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

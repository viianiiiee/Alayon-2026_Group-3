import { useState } from 'react'
import { Package, Search, Plus, CheckCircle2, XCircle, Clock, ArrowRight, Tag, MapPin, User, Calendar, RefreshCw, Laptop, FileText, Briefcase, BookOpen, Box } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { useToast } from '../components/Toast.jsx'
import { HOUSES } from '../data/mock.js'

const CATEGORIES = ['All', 'Electronics', 'Documents', 'Accessories', 'Books', 'Clothing', 'Other']
const STATUS_LABELS = { unclaimed: 'Unclaimed', claimed: 'Claimed', verified: 'Verified', returned: 'Returned' }
const STATUS_ICON  = { unclaimed: Clock, claimed: User, verified: CheckCircle2, returned: RefreshCw }
const CAT_ICON = { Electronics: Laptop, Documents: FileText, Accessories: Briefcase, Books: BookOpen, Clothing: Tag, Other: Box }
function CatIcon({ category, size = 18 }) {
  const Icon = CAT_ICON[category] || Package
  return <Icon size={size} style={{ color: 'var(--text-2)' }} />
}

const BLANK_REPORT = { item: '', description: '', category: 'Electronics', foundAt: '', foundBy: '', foundByHouse: 'JAVA', foundDate: '' }
const BLANK_CLAIM  = { claimedBy: '', claimedById: '', reason: '' }

export default function LostFound() {
  const { lostFound, setLF } = useApp()
  const toast = useToast()

  const [tab, setTab]           = useState('All')
  const [catFilter, setCat]     = useState('All')
  const [search, setSearch]     = useState('')
  const [reportModal, setRM]    = useState(false)
  const [claimModal, setCM]     = useState(null)   // item being claimed
  const [form, setForm]         = useState(BLANK_REPORT)
  const [claimForm, setClaimForm] = useState(BLANK_CLAIM)

  const filtered = lostFound.filter(item => {
    const matchStatus = tab === 'All' || item.status === tab.toLowerCase()
    const matchCat    = catFilter === 'All' || item.category === catFilter
    const matchSearch = !search || item.item.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.foundAt.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchCat && matchSearch
  })

  const counts = {
    total:     lostFound.length,
    unclaimed: lostFound.filter(i => i.status === 'unclaimed').length,
    claimed:   lostFound.filter(i => i.status === 'claimed' || i.status === 'verified').length,
    returned:  lostFound.filter(i => i.status === 'returned').length,
  }

  const handleReport = () => {
    if (!form.item || !form.foundAt || !form.foundBy || !form.foundDate) {
      toast('Missing fields', 'Please fill in all required fields.', 'error')
      return
    }
    const newItem = { ...form, id: 'LF' + Date.now(), type: 'found', status: 'unclaimed', claimedBy: null, claimDate: null, returnDate: null }
    setLF(p => [newItem, ...p])
    toast('Item Reported', `"${form.item}" has been logged in FindIT.`, 'success')
    setForm(BLANK_REPORT)
    setRM(false)
  }

  const handleClaim = () => {
    if (!claimForm.claimedBy) {
      toast('Missing info', 'Enter the claimant name.', 'error')
      return
    }
    setLF(items => items.map(i => i.id === claimModal.id
      ? { ...i, status: 'claimed', claimedBy: `${claimForm.claimedBy} (${claimForm.claimedById || 'walk-in'})`, claimDate: new Date().toISOString().slice(0, 10) }
      : i
    ))
    toast('Claim Submitted', `${claimForm.claimedBy} has claimed "${claimModal.item}". Pending admin verification.`, 'info')
    setClaimForm(BLANK_CLAIM)
    setCM(null)
  }

  const handleVerify = id => {
    setLF(items => items.map(i => i.id === id ? { ...i, status: 'verified' } : i))
    toast('Claim Verified', 'Claim approved. Ready for physical handover.', 'award')
  }

  const handleReturn = id => {
    const item = lostFound.find(i => i.id === id)
    setLF(items => items.map(i => i.id === id ? { ...i, status: 'returned', returnDate: new Date().toISOString().slice(0, 10) } : i))
    toast('Item Returned', `"${item?.item}" marked as returned to owner.`, 'success')
  }

  const handleReject = id => {
    setLF(items => items.map(i => i.id === id ? { ...i, status: 'unclaimed', claimedBy: null, claimDate: null } : i))
    toast('Claim Rejected', 'Claim has been rejected. Item is unclaimed again.', 'error')
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Items',  value: counts.total,     color: '#7C3AED', icon: Package },
          { label: 'Unclaimed',    value: counts.unclaimed, color: '#F59E0B', icon: Clock },
          { label: 'Claimed',      value: counts.claimed,   color: '#3B82F6', icon: User },
          { label: 'Returned',     value: counts.returned,  color: '#10B981', icon: CheckCircle2 },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-2xl font-bold font-display" style={{ color }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Status tabs */}
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          {['All', 'Unclaimed', 'Claimed', 'Verified', 'Returned'].map(s => (
            <button key={s} onClick={() => setTab(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${tab === s ? 'text-white' : 'text-slate-500 hover:text-slate-200'}`}
              style={tab === s ? { background: 'rgba(124,58,237,0.3)', border: '1px solid rgba(124,58,237,0.4)' } : {}}>
              {s}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input className="input-field pl-9 text-sm w-52" placeholder="Search items…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-field w-auto text-sm" value={catFilter} onChange={e => setCat(e.target.value)}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <button onClick={() => { setForm(BLANK_REPORT); setRM(true) }} className="btn-primary flex items-center gap-2 ml-auto">
          <Plus size={15} /> Report Found Item
        </button>
      </div>

      {/* Items grid */}
      {filtered.length === 0 ? (
        <div className="glass-card p-14 text-center">
          <Package size={40} className="mx-auto mb-3 text-slate-600" />
          <p className="text-slate-400 text-base font-medium">No items found</p>
          <p className="text-slate-600 text-sm mt-1">Try adjusting your filters or report a new item.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(item => {
            const StatusIcon = STATUS_ICON[item.status]
            const houseColor = HOUSES.find(h => h.id === item.foundByHouse)?.color || '#7C3AED'
            return (
              <div key={item.id} className="glass-card flex flex-col overflow-hidden group">
                {/* Status accent bar */}
                <div className="h-1" style={{
                  background:
                    item.status === 'returned'  ? 'linear-gradient(90deg, #10B981, #34D399)' :
                    item.status === 'verified'  ? 'linear-gradient(90deg, #F59E0B, #FBBF24)' :
                    item.status === 'claimed'   ? 'linear-gradient(90deg, #3B82F6, #60A5FA)' :
                    'linear-gradient(90deg, rgba(100,116,139,0.4), rgba(100,116,139,0.6))'
                }} />

                <div className="p-5 flex flex-col gap-3 flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                        <CatIcon category={item.category} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm leading-tight" style={{ color: 'var(--text-1)' }}>{item.item}</p>
                        <span className="badge badge-gray text-[10px]">{item.category}</span>
                      </div>
                    </div>
                    <span className={`status-${item.status} flex-shrink-0 flex items-center gap-1`}>
                      <StatusIcon size={10} /> {STATUS_LABELS[item.status]}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--text-2)' }}>{item.description}</p>

                  {/* Meta info */}
                  <div className="space-y-1.5 text-xs" style={{ color: 'var(--text-2)' }}>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={11} className="flex-shrink-0 text-slate-500" />
                      <span>Found at: <span className="font-medium" style={{ color: 'var(--text-1)' }}>{item.foundAt}</span></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User size={11} className="flex-shrink-0 text-slate-500" />
                      <span>Reported by: <span className="font-medium" style={{ color: houseColor }}>{item.foundBy}</span></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={11} className="flex-shrink-0 text-slate-500" />
                      <span>{item.foundDate}</span>
                      <span className="font-mono text-[10px] text-slate-600">{item.id}</span>
                    </div>
                    {item.claimedBy && (
                      <div className="flex items-center gap-1.5 mt-1 px-2.5 py-1.5 rounded-lg"
                        style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}>
                        <Tag size={11} className="text-blue-400 flex-shrink-0" />
                        <span className="text-blue-400 font-medium">Claimed by: {item.claimedBy}</span>
                      </div>
                    )}
                    {item.returnDate && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                        style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
                        <CheckCircle2 size={11} className="text-emerald-400 flex-shrink-0" />
                        <span className="text-emerald-400 font-medium">Returned on {item.returnDate}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-auto pt-3 flex gap-2" style={{ borderTop: '1px solid var(--border)' }}>
                    {item.status === 'unclaimed' && (
                      <button onClick={() => { setClaimForm(BLANK_CLAIM); setCM(item) }}
                        className="btn-primary flex-1 text-xs py-2 flex items-center justify-center gap-1.5">
                        <ArrowRight size={13} /> Submit Claim
                      </button>
                    )}
                    {item.status === 'claimed' && (
                      <>
                        <button onClick={() => handleVerify(item.id)} className="btn-success flex-1 text-xs py-2 flex items-center justify-center gap-1.5">
                          <CheckCircle2 size={13} /> Verify Claim
                        </button>
                        <button onClick={() => handleReject(item.id)} className="btn-danger text-xs py-2 px-3 flex items-center gap-1">
                          <XCircle size={13} />
                        </button>
                      </>
                    )}
                    {item.status === 'verified' && (
                      <button onClick={() => handleReturn(item.id)} className="btn-gold flex-1 text-xs py-2 flex items-center justify-center gap-1.5">
                        <RefreshCw size={13} /> Mark Returned
                      </button>
                    )}
                    {item.status === 'returned' && (
                      <div className="flex-1 text-center text-xs text-emerald-400 py-2 font-semibold">
                        ✓ Item returned to owner
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Report Found Item Modal */}
      {reportModal && (
        <div className="modal-overlay" onClick={() => setRM(false)}>
          <div className="modal-panel max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <Package size={18} className="text-purple-400" />
              <h3 className="font-display font-semibold text-base" style={{ color: 'var(--text-1)' }}>Report Found Item</h3>
              <button onClick={() => setRM(false)} className="ml-auto text-slate-500 hover:text-slate-200 text-xl leading-none">✕</button>
            </div>
            <div className="modal-body space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">Item Name <span className="text-red-400">*</span></label>
                  <input className="input-field" placeholder="e.g. Black HP Laptop" value={form.item} onChange={e => setForm(p => ({ ...p, item: e.target.value }))} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">Description</label>
                  <textarea className="input-field resize-none text-sm" rows={3} placeholder="Describe the item (color, brand, distinguishing marks…)"
                    value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">Category</label>
                  <select className="input-field text-sm" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">Date Found <span className="text-red-400">*</span></label>
                  <input type="date" className="input-field text-sm" value={form.foundDate} onChange={e => setForm(p => ({ ...p, foundDate: e.target.value }))} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">Location Found <span className="text-red-400">*</span></label>
                  <input className="input-field text-sm" placeholder="e.g. Library 2nd Floor, Room 302" value={form.foundAt} onChange={e => setForm(p => ({ ...p, foundAt: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">Reported By <span className="text-red-400">*</span></label>
                  <input className="input-field text-sm" placeholder="Name of finder" value={form.foundBy} onChange={e => setForm(p => ({ ...p, foundBy: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">House</label>
                  <select className="input-field text-sm" value={form.foundByHouse} onChange={e => setForm(p => ({ ...p, foundByHouse: e.target.value }))}>
                    {HOUSES.map(h => <option key={h.id} value={h.id}>{h.shortName}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={handleReport} className="btn-primary flex-1">Submit Report</button>
              <button onClick={() => setRM(false)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Claim Modal */}
      {claimModal && (
        <div className="modal-overlay" onClick={() => setCM(null)}>
          <div className="modal-panel max-w-md" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <Tag size={18} className="text-blue-400" />
              <h3 className="font-display font-semibold text-base" style={{ color: 'var(--text-1)' }}>Submit Ownership Claim</h3>
              <button onClick={() => setCM(null)} className="ml-auto text-slate-500 hover:text-slate-200 text-xl leading-none">✕</button>
            </div>
            <div className="modal-body space-y-4">
              <div className="p-3 rounded-xl" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
                <p className="text-xs text-blue-400 font-semibold">{claimModal.item}</p>
                <p className="text-xs text-slate-400 mt-0.5">{claimModal.description}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">Your Full Name <span className="text-red-400">*</span></label>
                <input className="input-field" placeholder="e.g. Juan Dela Cruz" value={claimForm.claimedBy} onChange={e => setClaimForm(p => ({ ...p, claimedBy: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">Student ID</label>
                <input className="input-field" placeholder="e.g. S034" value={claimForm.claimedById} onChange={e => setClaimForm(p => ({ ...p, claimedById: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">Proof of Ownership (describe)</label>
                <textarea className="input-field resize-none text-sm" rows={3} placeholder="Describe something specific about the item that proves it's yours…"
                  value={claimForm.reason} onChange={e => setClaimForm(p => ({ ...p, reason: e.target.value }))} />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={handleClaim} className="btn-primary flex-1">Submit Claim</button>
              <button onClick={() => setCM(null)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { Plus, Pin, Edit3, Trash2, Megaphone, Eye, AlertCircle } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { useToast } from '../components/Toast.jsx'

const BLANK = { title: '', body: '', target: 'All Houses', status: 'draft', pinned: false, urgent: false }

export default function Announcements() {
  const { announcements: items, setAnn } = useApp()
  const toast = useToast()

  const [editing, setEditing] = useState(null)
  const [preview, setPreview] = useState(null)
  const [form, setForm]       = useState(BLANK)
  const [filter, setFilter]   = useState('All')

  const setItems = setAnn

  const filtered = [...items]
    .filter(a => filter === 'All' || a.status === filter.toLowerCase())
    .sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0) || (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))

  const save = () => {
    if (!form.title) { toast('Missing title', 'Please enter a title.', 'error'); return }
    if (editing === 'new') {
      setItems(p => [{ id: 'AN' + Date.now(), ...form, author: 'Admin', date: new Date().toISOString().slice(0, 10) }, ...p])
      toast('Announcement Created', `"${form.title}" saved as ${form.status}.`, 'success')
    } else {
      setItems(p => p.map(a => a.id === editing ? { ...a, ...form } : a))
      toast('Announcement Updated', `"${form.title}" has been updated.`, 'success')
    }
    setEditing(null)
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          {['All', 'Published', 'Draft'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f ? 'text-white' : 'text-slate-500 hover:text-slate-200'}`}
              style={filter === f ? { background: 'rgba(124,58,237,0.3)', border: '1px solid rgba(124,58,237,0.4)' } : {}}>
              {f}
            </button>
          ))}
        </div>
        <button onClick={() => { setForm(BLANK); setEditing('new') }}
          className="btn-primary flex items-center gap-2 text-sm ml-auto">
          <Plus size={15} /> New Announcement
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="glass-card p-14 text-center text-sm" style={{ color: 'var(--text-3)' }}>No announcements found.</div>
        )}
        {filtered.map(ann => (
          <div key={ann.id} className={`glass-card overflow-hidden transition-all hover:-translate-y-0.5`}
            style={ann.urgent ? { borderColor: 'rgba(220,38,38,0.35)', boxShadow: '0 2px 20px rgba(220,38,38,0.1)' }
              : ann.pinned ? { borderColor: 'rgba(124,58,237,0.3)' } : {}}>
            <div className="h-1" style={{
              background: ann.urgent
                ? 'linear-gradient(90deg, #DC2626, #EF4444)'
                : ann.pinned ? 'linear-gradient(90deg, #7C3AED, #A78BFA)' : 'transparent'
            }} />
            <div className="p-5 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  {ann.urgent && <span className="badge badge-red flex items-center gap-1 text-xs"><AlertCircle size={11} /> Urgent</span>}
                  {ann.pinned && <span className="badge badge-purple flex items-center gap-1 text-xs"><Pin size={11} /> Pinned</span>}
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text-1)' }}>{ann.title}</h3>
                  <span className={ann.status === 'published' ? 'badge badge-green text-xs' : 'badge badge-yellow text-xs'}>
                    {ann.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--text-2)' }}>{ann.body}</p>
                <p className="text-xs" style={{ color: 'var(--text-3)' }}>{ann.author} · {ann.date} · {ann.target}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0 self-start">
                <button onClick={() => setPreview(ann)} className="p-2.5 rounded-xl transition-colors hover:bg-white/5" style={{ color: 'var(--text-3)' }} title="Preview">
                  <Eye size={15} />
                </button>
                <button onClick={() => { setForm({ ...ann }); setEditing(ann.id) }} className="p-2.5 rounded-xl transition-colors hover:bg-white/5" style={{ color: 'var(--text-3)' }} title="Edit">
                  <Edit3 size={15} />
                </button>
                <button onClick={() => setItems(p => p.map(a => a.id === ann.id ? { ...a, pinned: !a.pinned } : a))}
                  className={`p-2.5 rounded-xl transition-colors ${ann.pinned ? 'text-purple-400 bg-purple-500/10' : 'hover:bg-white/5'}`}
                  style={!ann.pinned ? { color: 'var(--text-3)' } : {}} title="Pin">
                  <Pin size={15} />
                </button>
                {ann.status === 'draft' && (
                  <button onClick={() => { setItems(p => p.map(a => a.id === ann.id ? { ...a, status: 'published' } : a)); toast('Published!', `"${ann.title}" is now live.`, 'success') }}
                    className="btn-gold text-xs py-1.5 px-3">Publish</button>
                )}
                <button onClick={() => { setItems(p => p.filter(a => a.id !== ann.id)); toast('Deleted', `"${ann.title}" removed.`, 'info') }}
                  className="p-2.5 rounded-xl transition-colors hover:bg-red-500/10 hover:text-red-400"
                  style={{ color: 'var(--text-3)' }} title="Delete">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editing !== null && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal-panel max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <Megaphone size={18} className="text-purple-400" />
              <h3 className="font-display font-semibold text-base" style={{ color: 'var(--text-1)' }}>{editing === 'new' ? 'New Announcement' : 'Edit Announcement'}</h3>
              <button onClick={() => setEditing(null)} className="ml-auto text-slate-500 hover:text-slate-200 text-xl leading-none">✕</button>
            </div>
            <div className="modal-body space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-2">Title</label>
                <input className="input-field text-sm" placeholder="Announcement title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-2">Message</label>
                <textarea className="input-field resize-none text-sm" rows={5} value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} placeholder="Write your announcement…" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-2">Target</label>
                  <select className="input-field text-sm" value={form.target} onChange={e => setForm(p => ({ ...p, target: e.target.value }))}>
                    <option>All Houses</option>
                    <option>House of Java</option>
                    <option>House of Python</option>
                    <option>House of Perl</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-2">Status</label>
                  <select className="input-field text-sm" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <div className={`w-10 h-5.5 rounded-full transition-colors relative ${form.pinned ? 'bg-purple-500' : 'bg-white/10'}`}
                    style={{ width: 40, height: 22 }}
                    onClick={() => setForm(p => ({ ...p, pinned: !p.pinned }))}>
                    <div className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-all`}
                      style={{ width: 18, height: 18, left: form.pinned ? 20 : 2 }} />
                  </div>
                  <span className="text-sm" style={{ color: 'var(--text-2)' }}>Pin to top</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <div className={`rounded-full transition-colors relative ${form.urgent ? 'bg-red-500' : 'bg-white/10'}`}
                    style={{ width: 40, height: 22 }}
                    onClick={() => setForm(p => ({ ...p, urgent: !p.urgent }))}>
                    <div className="absolute top-0.5 rounded-full bg-white transition-all"
                      style={{ width: 18, height: 18, left: form.urgent ? 20 : 2 }} />
                  </div>
                  <span className="text-sm" style={{ color: 'var(--text-2)' }}>Mark as urgent</span>
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={save} className="btn-primary flex-1">Save</button>
              <button onClick={() => setEditing(null)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {preview && (
        <div className="modal-overlay" onClick={() => setPreview(null)}>
          <div className="modal-panel max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="h-1" style={{ background: preview.urgent ? 'linear-gradient(90deg, #DC2626, #EF4444)' : 'linear-gradient(90deg, #7C3AED, #A78BFA)' }} />
            <div className="px-6 py-5">
              <div className="flex items-center gap-2 mb-2">
                {preview.urgent && <span className="badge badge-red text-xs">Urgent</span>}
                {preview.pinned && <span className="badge badge-purple text-xs">Pinned</span>}
              </div>
              <h3 className="font-display text-xl font-bold mb-2" style={{ color: 'var(--text-1)' }}>{preview.title}</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-3)' }}>{preview.author} · {preview.date} · {preview.target}</p>
              <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-2)' }}>{preview.body}</p>
            </div>
            <div className="px-6 py-4" style={{ borderTop: '1px solid var(--border)' }}>
              <button onClick={() => setPreview(null)} className="btn-secondary w-full">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

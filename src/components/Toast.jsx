import { useState, useCallback, createContext, useContext } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, AlertCircle, Info, Trophy, X } from 'lucide-react'

const ToastCtx = createContext(() => {})

const ICONS = {
  success: CheckCircle2,
  error:   AlertCircle,
  info:    Info,
  award:   Trophy,
}
const COLORS = {
  success: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)',  text: '#6EE7B7' },
  error:   { bg: 'rgba(220,38,38,0.15)',  border: 'rgba(220,38,38,0.3)',   text: '#FCA5A5' },
  info:    { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)',  text: '#93C5FD' },
  award:   { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)',  text: '#FCD34D' },
}

function ToastItem({ toast, onDismiss }) {
  const Icon = ICONS[toast.type] || Info
  const c = COLORS[toast.type] || COLORS.info
  return (
    <div className="toast-item" style={{
      display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px',
      borderRadius: 16, minWidth: 280, maxWidth: 380,
      background: c.bg, border: `1px solid ${c.border}`,
      backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      animation: 'toast-in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
    }}>
      <Icon size={18} style={{ color: c.text, flexShrink: 0, marginTop: 1 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        {toast.title && <p style={{ fontSize: 14, fontWeight: 600, color: c.text, lineHeight: 1.3 }}>{toast.title}</p>}
        {toast.message && <p style={{ fontSize: 13, color: 'rgba(203,213,225,0.9)', marginTop: 2, lineHeight: 1.4 }}>{toast.message}</p>}
      </div>
      <button onClick={onDismiss} style={{ color: 'rgba(148,163,184,0.7)', background: 'none', border: 'none', cursor: 'pointer', padding: 2, flexShrink: 0 }}>
        <X size={14} />
      </button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const show = useCallback((title, message, type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts(p => [...p, { id, title, message, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4500)
  }, [])

  const dismiss = id => setToasts(p => p.filter(t => t.id !== id))

  return (
    <ToastCtx.Provider value={show}>
      {children}
      {createPortal(
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
          {toasts.map(t => <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />)}
        </div>,
        document.body
      )}
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)

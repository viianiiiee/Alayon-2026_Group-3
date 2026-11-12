import { createContext, useContext, useState } from 'react'
import { HOUSES, events as initEvents, pointsLog as initLog, auditLog as initAudit, announcements as initAnn, attendanceLogs as initAtt, lostFoundItems as initLF } from '../data/mock.js'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [houses, setHouses]       = useState(HOUSES)
  const [events, setEvents]       = useState(initEvents)
  const [pointsLog, setLog]       = useState(initLog)
  const [announcements, setAnn]   = useState(initAnn)
  const [attendance, setAtt]      = useState(initAtt)
  const [auditLog, setAudit]      = useState(initAudit)
  const [lostFound, setLF]        = useState(initLF)

  const sortedHouses = [...houses].sort((a, b) => b.points - a.points)

  const awardPoints = (houseId, pts, entry) => {
    setHouses(hs => hs.map(h => h.id === houseId ? { ...h, points: h.points + pts } : h))
    setLog(l => [entry, ...l])
  }

  const saveEventScores = (eventId, scores) => {
    setEvents(es => es.map(e => e.id === eventId ? { ...e, scores, status: 'completed' } : e))
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])
    const pts = { 1: 15, 2: 10, 3: 5 }
    sorted.forEach(([houseId], i) => {
      const p = pts[i + 1]
      if (p) {
        awardPoints(houseId, p, {
          id: `P${Date.now()}_${i}`,
          houseId,
          event: events.find(e => e.id === eventId)?.title || eventId,
          category: events.find(e => e.id === eventId)?.category || 'Sports',
          place: i + 1,
          points: p,
          awardedBy: 'Admin',
          date: new Date().toISOString().slice(0, 10),
          note: `${['1st', '2nd', '3rd'][i]} Place`,
        })
      }
    })
  }

  const addAttendance = entry => setAtt(a => [entry, ...a])

  const updateLostFound = fn => setLF(typeof fn === 'function' ? fn : () => fn)

  return (
    <AppContext.Provider value={{
      houses, sortedHouses, events, pointsLog, auditLog, announcements, attendance, lostFound,
      setHouses, setEvents, setLog, setAudit, setAnn, setAtt, setLF,
      awardPoints, saveEventScores, addAttendance, updateLostFound,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)

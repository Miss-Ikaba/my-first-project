import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useJournal } from '../hooks/useJournal'
import CalendarGrid from '../components/calendar/CalendarGrid'
import DayDetail from '../components/calendar/DayDetail'

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

export default function CalendarPage() {
  const today = new Date()
  const [year,  setYear]  = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const { entries, loading } = useJournal()

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  // Entries for selected date
  const dayEntries = selectedDate
    ? entries.filter(e => e.date === selectedDate)
    : []

  return (
    <div>
      {/* Month navigator */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '16px',
      }}>
        <button onClick={prevMonth} style={{
          background: 'white', border: 'none', cursor: 'pointer',
          padding: '8px', borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)', color: '#ec4899',
        }}>
          <ChevronLeft size={20} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1f2937' }}>
            {MONTHS[month]}
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af' }}>{year}</p>
        </div>

        <button onClick={nextMonth} style={{
          background: 'white', border: 'none', cursor: 'pointer',
          padding: '8px', borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)', color: '#ec4899',
        }}>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Calendar grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}>
          <div className="w-7 h-7 border-2 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
        </div>
      ) : (
        <CalendarGrid
          year={year}
          month={month}
          entries={entries}
          selectedDate={selectedDate}
          onSelectDate={date => setSelectedDate(date === selectedDate ? null : date)}
        />
      )}

      {/* Monthly summary */}
      {!loading && (
        <div style={{
          marginTop: '16px', backgroundColor: 'white',
          borderRadius: '16px', padding: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}>
          <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            This month
          </p>
          {(() => {
            const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`
            const monthEntries = entries.filter(e => e.date.startsWith(monthStr))
            const daily  = monthEntries.filter(e => e.type === 'daily').length
            const weekly = monthEntries.filter(e => e.type === 'weekly').length
            return (
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ textAlign: 'center', flex: 1, backgroundColor: '#fdf2f8', borderRadius: '12px', padding: '12px' }}>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#ec4899' }}>{daily}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>Daily entries</p>
                </div>
                <div style={{ textAlign: 'center', flex: 1, backgroundColor: '#f5f3ff', borderRadius: '12px', padding: '12px' }}>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#7c3aed' }}>{weekly}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>Weekly entries</p>
                </div>
                <div style={{ textAlign: 'center', flex: 1, backgroundColor: '#fef9c3', borderRadius: '12px', padding: '12px' }}>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#d97706' }}>{daily + weekly}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>Total</p>
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* Day detail modal */}
      {selectedDate && (
        <DayDetail
          date={selectedDate}
          entries={dayEntries}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  )
}

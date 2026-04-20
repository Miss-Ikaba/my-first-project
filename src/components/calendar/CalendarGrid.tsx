import type { JournalEntry } from '../../types'

interface Props {
  year: number
  month: number  // 0-indexed
  entries: JournalEntry[]
  selectedDate: string | null
  onSelectDate: (date: string) => void
}

const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

export default function CalendarGrid({ year, month, entries, selectedDate, onSelectDate }: Props) {
  const today     = new Date()
  const firstDay  = new Date(year, month, 1).getDay()   // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Build set of dates that have entries e.g. "2026-04-20"
  const entryDates = new Set(entries.map(e => e.date))

  // Build grid cells (nulls = empty leading slots)
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  function toISO(day: number) {
    const m = String(month + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    return `${year}-${m}-${d}`
  }

  const isToday = (day: number) =>
    today.getFullYear() === year &&
    today.getMonth()    === month &&
    today.getDate()     === day

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '8px' }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '11px', fontWeight: 600, color: '#9ca3af', padding: '4px 0' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />

          const iso      = toISO(day)
          const hasEntry = entryDates.has(iso)
          const isSelected = selectedDate === iso
          const isTodayDate = isToday(day)

          return (
            <button
              key={iso}
              onClick={() => onSelectDate(iso)}
              style={{
                position: 'relative',
                aspectRatio: '1',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: isTodayDate || isSelected ? 700 : 400,
                backgroundColor: isSelected
                  ? '#ec4899'
                  : isTodayDate
                  ? '#fce7f3'
                  : 'transparent',
                color: isSelected ? 'white' : isTodayDate ? '#ec4899' : '#374151',
                transition: 'all 0.15s',
              }}
            >
              {day}
              {/* Dot indicator for entries */}
              {hasEntry && (
                <span style={{
                  position: 'absolute',
                  bottom: '3px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: isSelected ? 'white' : '#ec4899',
                }} />
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px', justifyContent: 'center' }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ec4899', display: 'inline-block' }} />
        <span style={{ fontSize: '11px', color: '#9ca3af' }}>Has journal entry</span>
      </div>
    </div>
  )
}

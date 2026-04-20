import { X } from 'lucide-react'
import type { JournalEntry } from '../../types'

interface Props {
  date: string
  entries: JournalEntry[]
  onClose: () => void
}

export default function DayDetail({ date, entries, onClose }: Props) {
  const formatted = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })

  return (
    <div style={{
      position: 'fixed', inset: 0,
      backgroundColor: 'rgba(0,0,0,0.45)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
    }}>
      <div style={{
        backgroundColor: 'white',
        width: '100%',
        maxWidth: '448px',
        borderRadius: '24px 24px 0 0',
        maxHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px 16px',
          borderBottom: '1px solid #fce7f3',
          flexShrink: 0,
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 600, color: '#1f2937' }}>
              📅 {formatted}
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9ca3af' }}>
              {entries.length === 0
                ? 'No entries this day'
                : `${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}`}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#9ca3af', padding: '6px', borderRadius: '8px',
          }}>
            <X size={20} />
          </button>
        </div>

        {/* Entries list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 32px' }}>
          {entries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌸</div>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>Nothing written for this day yet.</p>
            </div>
          ) : (
            entries.map(entry => (
              <div key={entry.id} style={{
                backgroundColor: entry.type === 'daily' ? '#fdf2f8' : '#f5f3ff',
                borderRadius: '14px',
                padding: '14px',
                marginBottom: '12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{
                    fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px',
                    backgroundColor: entry.type === 'daily' ? '#fce7f3' : '#ede9fe',
                    color: entry.type === 'daily' ? '#ec4899' : '#7c3aed',
                  }}>
                    {entry.type === 'daily' ? '📅 Daily' : '📆 Weekly'}
                  </span>
                  {entry.mood && <span style={{ fontSize: '16px' }}>{entry.mood}</span>}
                </div>
                <h3 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 600, color: '#1f2937' }}>
                  {entry.title}
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', lineHeight: '1.6' }}>
                  {entry.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

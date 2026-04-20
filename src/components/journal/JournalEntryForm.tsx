import { useState } from 'react'
import { X } from 'lucide-react'
import type { JournalEntry } from '../../types'

const MOODS = ['😊', '🥰', '😌', '🤩', '🥳', '😴', '😢', '😰', '😤', '😡']

interface Props {
  entry?: JournalEntry | null
  onSave: (data: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  onClose: () => void
}

export default function JournalEntryForm({ entry, onSave, onClose }: Props) {
  const [type, setType] = useState<'daily' | 'weekly'>(entry?.type ?? 'daily')
  const [title, setTitle] = useState(entry?.title ?? '')
  const [content, setContent] = useState(entry?.content ?? '')
  const [mood, setMood] = useState(entry?.mood ?? '')
  const [date, setDate] = useState(entry?.date ?? new Date().toISOString().split('T')[0])
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    setSaving(true)
    try {
      await onSave({ type, title: title.trim(), content: content.trim(), mood, date })
      onClose()
    } catch (err) {
      console.error('Failed to save entry:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    /* Full-screen overlay */
    <div style={{
      position: 'fixed', inset: 0,
      backgroundColor: 'rgba(0,0,0,0.45)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
    }}>
      {/* Modal card — explicit height so flex children work */}
      <div style={{
        backgroundColor: 'white',
        width: '100%',
        maxWidth: '448px',
        borderRadius: '24px 24px 0 0',
        height: '88vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>

        {/* ── HEADER (never scrolls) ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px 12px',
          borderBottom: '1px solid #fce7f3',
          flexShrink: 0,
        }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1f2937' }}>
            {entry ? 'Edit Entry' : '✨ New Entry'}
          </h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#9ca3af', padding: '6px', borderRadius: '8px',
          }}>
            <X size={20} />
          </button>
        </div>

        {/* ── SCROLLABLE FORM FIELDS ── */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {/* Daily / Weekly toggle */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['daily', 'weekly'] as const).map(t => (
                <button key={t} type="button" onClick={() => setType(t)} style={{
                  flex: 1, padding: '10px', borderRadius: '12px', border: 'none',
                  cursor: 'pointer', fontSize: '14px', fontWeight: 500,
                  backgroundColor: type === t ? '#ec4899' : '#fdf2f8',
                  color: type === t ? 'white' : '#f472b6',
                  transition: 'all 0.15s',
                }}>
                  {t === 'daily' ? '📅 Daily' : '📆 Weekly'}
                </button>
              ))}
            </div>

            {/* Date */}
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{
              width: '100%', padding: '10px 14px', borderRadius: '12px',
              border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
            }} />

            {/* Title */}
            <input
              type="text" placeholder="Give your entry a title..."
              value={title} onChange={e => setTitle(e.target.value)} required style={{
                width: '100%', padding: '10px 14px', borderRadius: '12px',
                border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
              }}
            />

            {/* Mood */}
            <div>
              <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>
                How are you feeling?
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {MOODS.map(m => (
                  <button key={m} type="button" onClick={() => setMood(prev => prev === m ? '' : m)} style={{
                    fontSize: '22px', padding: '6px', borderRadius: '10px', border: 'none',
                    cursor: 'pointer', background: mood === m ? '#fce7f3' : 'transparent',
                    transform: mood === m ? 'scale(1.15)' : 'scale(1)',
                    transition: 'all 0.15s',
                  }}>
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <textarea
              placeholder="Write your thoughts here... 🌸"
              value={content} onChange={e => setContent(e.target.value)}
              required rows={4} style={{
                width: '100%', padding: '12px 14px', borderRadius: '12px',
                border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none',
                resize: 'none', lineHeight: '1.6', boxSizing: 'border-box', fontFamily: 'inherit',
              }}
            />
          </div>

          {/* ── SAVE BUTTON (never scrolls, always visible) ── */}
          <div style={{
            flexShrink: 0,
            padding: '12px 24px 24px',
            borderTop: '1px solid #fce7f3',
            backgroundColor: 'white',
          }}>
            <button type="submit" disabled={saving} style={{
              width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
              backgroundColor: saving ? '#f9a8d4' : '#ec4899',
              color: 'white', fontSize: '15px', fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s',
            }}>
              {saving ? 'Saving... 🌸' : entry ? 'Update Entry ✏️' : 'Save Entry ✨'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

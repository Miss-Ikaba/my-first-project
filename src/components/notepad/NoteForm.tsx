import { useState } from 'react'
import { X } from 'lucide-react'
import type { Note } from '../../types'

const COLORS = [
  { hex: '#fef9c3', label: 'Yellow'  },
  { hex: '#fce7f3', label: 'Pink'    },
  { hex: '#dbeafe', label: 'Blue'    },
  { hex: '#dcfce7', label: 'Green'   },
  { hex: '#ede9fe', label: 'Purple'  },
  { hex: '#ffedd5', label: 'Peach'   },
  { hex: '#f1f5f9', label: 'White'   },
  { hex: '#fef08a', label: 'Lime'    },
]

interface Props {
  note?: Note | null
  onSave: (data: Omit<Note, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  onClose: () => void
}

export default function NoteForm({ note, onSave, onClose }: Props) {
  const [title, setTitle]     = useState(note?.title ?? '')
  const [content, setContent] = useState(note?.content ?? '')
  const [color, setColor]     = useState(note?.color ?? '#fef9c3')
  const [pinned, setPinned]   = useState(note?.pinned ?? false)
  const [saving, setSaving]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setSaving(true)
    try {
      await onSave({ title: title.trim() || 'Untitled', content: content.trim(), color, pinned })
      onClose()
    } catch (err) {
      console.error('Failed to save note:', err)
    } finally {
      setSaving(false)
    }
  }

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
        backgroundColor: color,
        width: '100%',
        maxWidth: '448px',
        borderRadius: '24px 24px 0 0',
        height: '85vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px 12px',
          flexShrink: 0,
        }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1f2937' }}>
            {note ? '✏️ Edit Note' : '📝 New Note'}
          </h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#6b7280', padding: '6px', borderRadius: '8px',
          }}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Color picker */}
            <div>
              <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>Note colour</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {COLORS.map(c => (
                  <button key={c.hex} type="button" onClick={() => setColor(c.hex)} title={c.label} style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    backgroundColor: c.hex,
                    border: color === c.hex ? '3px solid #ec4899' : '2px solid #e5e7eb',
                    cursor: 'pointer',
                    transition: 'transform 0.1s',
                    transform: color === c.hex ? 'scale(1.2)' : 'scale(1)',
                  }} />
                ))}
              </div>
            </div>

            {/* Title */}
            <input
              type="text"
              placeholder="Title (optional)"
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.1)', fontSize: '14px',
                outline: 'none', backgroundColor: 'rgba(255,255,255,0.6)',
                boxSizing: 'border-box', fontFamily: 'inherit',
              }}
            />

            {/* Content */}
            <textarea
              placeholder="Write your note here..."
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              rows={8}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.1)', fontSize: '14px',
                outline: 'none', resize: 'none', lineHeight: '1.7',
                backgroundColor: 'rgba(255,255,255,0.6)',
                boxSizing: 'border-box', fontFamily: 'inherit',
              }}
            />

            {/* Pin toggle */}
            <button type="button" onClick={() => setPinned(p => !p)} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '14px', color: pinned ? '#f59e0b' : '#9ca3af',
              fontWeight: 500, padding: '4px 0',
            }}>
              <span style={{ fontSize: '16px' }}>📌</span>
              {pinned ? 'Pinned to top' : 'Pin this note'}
            </button>
          </div>

          {/* Save button — always visible */}
          <div style={{
            flexShrink: 0,
            padding: '12px 24px 28px',
            borderTop: '1px solid rgba(0,0,0,0.06)',
            backgroundColor: color,
          }}>
            <button type="submit" disabled={saving} style={{
              width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
              backgroundColor: saving ? '#f9a8d4' : '#ec4899',
              color: 'white', fontSize: '15px', fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s',
            }}>
              {saving ? 'Saving... 🌸' : note ? 'Update Note ✏️' : 'Save Note 📝'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

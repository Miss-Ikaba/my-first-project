import { Pin, Trash2, Edit2 } from 'lucide-react'
import type { Note } from '../../types'

interface Props {
  note: Note
  onEdit: (note: Note) => void
  onDelete: (id: string) => void
  onTogglePin: (id: string, pinned: boolean) => void
}

export default function NoteCard({ note, onEdit, onDelete, onTogglePin }: Props) {
  const updated = new Date(note.updated_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <div style={{
      backgroundColor: note.color ?? '#fef9c3',
      borderRadius: '16px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      position: 'relative',
      minHeight: '120px',
    }}>
      {/* Pin badge */}
      {note.pinned && (
        <div style={{
          position: 'absolute', top: '10px', right: '10px',
          fontSize: '14px', transform: 'rotate(30deg)',
        }}>
          📌
        </div>
      )}

      {/* Title */}
      {note.title && note.title !== 'Untitled' && (
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#1f2937', paddingRight: '24px' }}>
          {note.title}
        </h3>
      )}

      {/* Content */}
      <p style={{
        margin: 0, fontSize: '13px', color: '#374151',
        lineHeight: '1.6', flex: 1,
        display: '-webkit-box', WebkitLineClamp: 5,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {note.content || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Empty note</span>}
      </p>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
        <span style={{ fontSize: '11px', color: '#6b7280' }}>{updated}</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button onClick={() => onTogglePin(note.id, note.pinned)} title={note.pinned ? 'Unpin' : 'Pin'} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
            borderRadius: '8px', color: note.pinned ? '#f59e0b' : '#9ca3af',
            fontSize: '13px',
          }}>
            <Pin size={14} />
          </button>
          <button onClick={() => onEdit(note)} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
            borderRadius: '8px', color: '#9ca3af',
          }}>
            <Edit2 size={14} />
          </button>
          <button onClick={() => onDelete(note.id)} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
            borderRadius: '8px', color: '#9ca3af',
          }}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { PenLine } from 'lucide-react'
import { useNotes } from '../hooks/useNotes'
import NoteCard from '../components/notepad/NoteCard'
import NoteForm from '../components/notepad/NoteForm'
import type { Note } from '../types'

export default function NotepadPage() {
  const { notes, loading, error, createNote, updateNote, deleteNote, togglePin } = useNotes()
  const [showForm, setShowForm]       = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)

  function handleEdit(note: Note) {
    setEditingNote(note)
    setShowForm(true)
  }

  function handleClose() {
    setShowForm(false)
    setEditingNote(null)
  }

  async function handleSave(data: Omit<Note, 'id' | 'created_at' | 'updated_at'>) {
    if (editingNote) {
      await updateNote(editingNote.id, data)
    } else {
      await createNote(data)
    }
  }

  async function handleDelete(id: string) {
    if (window.confirm('Delete this note?')) {
      await deleteNote(id)
    }
  }

  const pinned   = notes.filter(n => n.pinned)
  const unpinned = notes.filter(n => !n.pinned)

  return (
    <div>
      {/* Error */}
      {error && (
        <div style={{
          backgroundColor: '#fef2f2', border: '1px solid #fecaca',
          color: '#ef4444', borderRadius: '12px', padding: '12px 16px',
          fontSize: '14px', marginBottom: '16px',
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}>
          <div className="w-7 h-7 border-2 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!loading && notes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 0' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>📝</div>
          <h2 style={{ color: '#ec4899', fontSize: '18px', fontWeight: 600, margin: '0 0 8px' }}>No notes yet</h2>
          <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>Tap the button below to write your first note!</p>
        </div>
      )}

      {/* Pinned section */}
      {!loading && pinned.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
            📌 Pinned
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {pinned.map(note => (
              <NoteCard key={note.id} note={note} onEdit={handleEdit} onDelete={handleDelete} onTogglePin={togglePin} />
            ))}
          </div>
        </div>
      )}

      {/* All notes section */}
      {!loading && unpinned.length > 0 && (
        <div>
          {pinned.length > 0 && (
            <p style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
              All notes
            </p>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {unpinned.map(note => (
              <NoteCard key={note.id} note={note} onEdit={handleEdit} onDelete={handleDelete} onTogglePin={togglePin} />
            ))}
          </div>
        </div>
      )}

      {/* Floating action button */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-pink-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-pink-600 active:scale-95 transition-all z-40"
        aria-label="New note"
      >
        <PenLine size={22} />
      </button>

      {/* Note form modal */}
      {showForm && (
        <NoteForm
          note={editingNote}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
    </div>
  )
}

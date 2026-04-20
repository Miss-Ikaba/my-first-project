import { useState } from 'react'
import { PenLine } from 'lucide-react'
import { useJournal } from '../hooks/useJournal'
import JournalEntryCard from '../components/journal/JournalEntryCard'
import JournalEntryForm from '../components/journal/JournalEntryForm'
import type { JournalEntry } from '../types'

export default function JournalPage() {
  const { entries, loading, error, createEntry, updateEntry, deleteEntry } = useJournal()
  const [showForm, setShowForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)

  function handleEdit(entry: JournalEntry) {
    setEditingEntry(entry)
    setShowForm(true)
  }

  function handleClose() {
    setShowForm(false)
    setEditingEntry(null)
  }

  async function handleSave(data: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>) {
    if (editingEntry) {
      await updateEntry(editingEntry.id, data)
    } else {
      await createEntry(data)
    }
  }

  async function handleDelete(id: string) {
    if (window.confirm('Delete this entry? This cannot be undone.')) {
      await deleteEntry(id)
    }
  }

  return (
    <div>
      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
          ⚠️ {error}
        </div>
      )}

      {/* Loading spinner */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-7 h-7 border-2 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!loading && entries.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="text-6xl mb-4">📖</span>
          <h2 className="text-lg font-semibold text-pink-500 mb-2">No entries yet</h2>
          <p className="text-gray-400 text-sm">Tap the pink button below to write your first entry!</p>
        </div>
      )}

      {/* Filter tabs */}
      {!loading && entries.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-3">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </p>
        </div>
      )}

      {/* Entry cards */}
      {!loading && entries.map(entry => (
        <JournalEntryCard
          key={entry.id}
          entry={entry}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}

      {/* Floating action button */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-pink-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-pink-600 active:scale-95 transition-all z-40"
        aria-label="New journal entry"
      >
        <PenLine size={22} />
      </button>

      {/* Entry form modal */}
      {showForm && (
        <JournalEntryForm
          entry={editingEntry}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
    </div>
  )
}

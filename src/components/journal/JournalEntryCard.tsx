import { Trash2, Edit2 } from 'lucide-react'
import type { JournalEntry } from '../../types'

interface Props {
  entry: JournalEntry
  onEdit: (entry: JournalEntry) => void
  onDelete: (id: string) => void
}

export default function JournalEntryCard({ entry, onEdit, onDelete }: Props) {
  const date = new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100 mb-3">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              entry.type === 'daily'
                ? 'bg-pink-100 text-pink-600'
                : 'bg-purple-100 text-purple-600'
            }`}>
              {entry.type === 'daily' ? '📅 Daily' : '📆 Weekly'}
            </span>
            {entry.mood && <span className="text-base">{entry.mood}</span>}
          </div>
          <h3 className="font-semibold text-gray-800 text-base truncate">{entry.title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{date}</p>
        </div>
        <div className="flex gap-1 ml-2 shrink-0">
          <button
            onClick={() => onEdit(entry)}
            className="p-1.5 text-gray-400 hover:text-pink-500 transition-colors rounded-lg hover:bg-pink-50"
          >
            <Edit2 size={15} />
          </button>
          <button
            onClick={() => onDelete(entry.id)}
            className="p-1.5 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-50"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{entry.content}</p>
    </div>
  )
}

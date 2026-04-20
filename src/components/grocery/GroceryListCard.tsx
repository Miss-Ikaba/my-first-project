import { Trash2, ChevronRight } from 'lucide-react'
import type { GroceryList } from '../../types'

interface Props {
  list: GroceryList
  onOpen:   (list: GroceryList) => void
  onDelete: (id: string) => void
}

export default function GroceryListCard({ list, onOpen, onDelete }: Props) {
  const items       = list.items ?? []
  const total       = items.reduce((sum, i) => sum + (i.price * i.quantity), 0)
  const checkedCount = items.filter(i => i.checked).length
  const date = new Date(list.date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })

  return (
    <div style={{
      backgroundColor: 'white', borderRadius: '16px',
      padding: '16px', marginBottom: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      display: 'flex', alignItems: 'center', gap: '12px',
    }}>
      {/* Icon */}
      <div style={{
        width: '44px', height: '44px', borderRadius: '12px',
        backgroundColor: '#fdf2f8', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: '22px', flexShrink: 0,
      }}>
        🛒
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }} onClick={() => onOpen(list)} role="button" style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}>
        <h3 style={{ margin: '0 0 2px', fontSize: '15px', fontWeight: 600, color: '#1f2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {list.name}
        </h3>
        <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>
          {date} · {items.length} items · {checkedCount}/{items.length} checked
        </p>
      </div>

      {/* Total + actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <span style={{ fontSize: '15px', fontWeight: 700, color: '#ec4899' }}>
          KSh {total.toFixed(2)}
        </span>
        <button onClick={() => onDelete(list.id)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#d1d5db', padding: '4px', borderRadius: '8px',
        }}>
          <Trash2 size={15} />
        </button>
        <button onClick={() => onOpen(list)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#ec4899', padding: '4px',
        }}>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

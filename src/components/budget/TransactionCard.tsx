import { Trash2 } from 'lucide-react'
import type { Transaction } from '../../types'

interface Props {
  transaction: Transaction
  onDelete: (id: string) => void
}

export default function TransactionCard({ transaction: t, onDelete }: Props) {
  const date = new Date(t.date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })

  const isIncome = t.type === 'income'

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      backgroundColor: 'white', borderRadius: '14px', padding: '14px',
      marginBottom: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    }}>
      {/* Category icon bubble */}
      <div style={{
        width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0,
        backgroundColor: isIncome ? '#f0fdf4' : '#fef2f2',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
      }}>
        {t.category.split(' ')[0]}
      </div>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: 600, color: '#1f2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {t.category.split(' ').slice(1).join(' ')}
        </p>
        <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>
          {date} · {t.period} {t.description ? `· ${t.description}` : ''}
        </p>
      </div>

      {/* Amount */}
      <span style={{
        fontSize: '15px', fontWeight: 700, flexShrink: 0,
        color: isIncome ? '#16a34a' : '#ef4444',
      }}>
        {isIncome ? '+' : '-'} KSh {t.amount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
      </span>

      {/* Delete */}
      <button onClick={() => onDelete(t.id)} style={{
        background: 'none', border: 'none', cursor: 'pointer', color: '#d1d5db', padding: '4px', flexShrink: 0,
      }}>
        <Trash2 size={14} />
      </button>
    </div>
  )
}

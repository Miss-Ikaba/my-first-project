import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useBudget } from '../hooks/useBudget'
import TransactionCard from '../components/budget/TransactionCard'
import TransactionForm from '../components/budget/TransactionForm'
import type { BudgetPeriod } from '../types'

const PERIOD_LABELS: Record<BudgetPeriod, string> = {
  daily:   '📅 Today',
  weekly:  '📆 This Week',
  monthly: '🗓️ This Month',
}

export default function BudgetPage() {
  const { loading, error, addTransaction, deleteTransaction, getByPeriod, getSummary } = useBudget()
  const [activePeriod, setActivePeriod] = useState<BudgetPeriod>('monthly')
  const [showForm, setShowForm] = useState(false)

  const filtered = getByPeriod(activePeriod)
  const { income, expense, balance } = getSummary(filtered)

  async function handleDelete(id: string) {
    if (window.confirm('Delete this transaction?')) {
      await deleteTransaction(id)
    }
  }

  return (
    <div>
      {error && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', marginBottom: '16px' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Period tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
        {(Object.keys(PERIOD_LABELS) as BudgetPeriod[]).map(p => (
          <button key={p} onClick={() => setActivePeriod(p)} style={{
            flex: 1, padding: '8px 4px', borderRadius: '12px', border: 'none', cursor: 'pointer',
            fontSize: '12px', fontWeight: 600,
            backgroundColor: activePeriod === p ? '#ec4899' : 'white',
            color: activePeriod === p ? 'white' : '#6b7280',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            transition: 'all 0.15s',
          }}>
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#f0fdf4', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#6b7280', fontWeight: 600 }}>INCOME</p>
          <p style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#16a34a' }}>
            KSh {income.toLocaleString('en-KE', { minimumFractionDigits: 0 })}
          </p>
        </div>
        <div style={{ backgroundColor: '#fef2f2', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#6b7280', fontWeight: 600 }}>SPENT</p>
          <p style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#ef4444' }}>
            KSh {expense.toLocaleString('en-KE', { minimumFractionDigits: 0 })}
          </p>
        </div>
        <div style={{ backgroundColor: balance >= 0 ? '#fdf2f8' : '#fef2f2', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#6b7280', fontWeight: 600 }}>BALANCE</p>
          <p style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: balance >= 0 ? '#ec4899' : '#ef4444' }}>
            KSh {balance.toLocaleString('en-KE', { minimumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      {/* Progress bar (expense vs income) */}
      {income > 0 && (
        <div style={{ backgroundColor: 'white', borderRadius: '14px', padding: '14px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>Spent {income > 0 ? Math.round((expense / income) * 100) : 0}% of income</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: expense > income ? '#ef4444' : '#16a34a' }}>
              {expense > income ? '⚠️ Over budget' : '✅ On track'}
            </span>
          </div>
          <div style={{ backgroundColor: '#f3f4f6', borderRadius: '99px', height: '8px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '99px', transition: 'width 0.4s ease',
              width: `${Math.min((expense / income) * 100, 100)}%`,
              backgroundColor: expense > income ? '#ef4444' : '#ec4899',
            }} />
          </div>
        </div>
      )}

      {/* Transactions list */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
          <div className="w-7 h-7 border-2 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>💰</div>
          <h2 style={{ color: '#ec4899', fontSize: '16px', fontWeight: 600, margin: '0 0 6px' }}>No transactions yet</h2>
          <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>Tap + to add your first income or expense!</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div>
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
            {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
          </p>
          {filtered.map(t => (
            <TransactionCard key={t.id} transaction={t} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-pink-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-pink-600 active:scale-95 transition-all z-40"
        aria-label="Add transaction"
      >
        <Plus size={22} />
      </button>

      {/* Form modal */}
      {showForm && (
        <TransactionForm
          onSave={addTransaction}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}

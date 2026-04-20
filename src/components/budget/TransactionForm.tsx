import { useState } from 'react'
import { X } from 'lucide-react'
import type { Transaction, BudgetPeriod, TransactionType } from '../../types'

const EXPENSE_CATEGORIES = ['🛒 Groceries','🍽️ Food & Dining','🚗 Transport','💊 Health','👗 Clothing','🏠 Rent / Bills','📱 Airtime / Data','🎉 Entertainment','📚 Education','💅 Beauty','💰 Savings','❓ Other']
const INCOME_CATEGORIES  = ['💼 Salary','💸 Freelance','🎁 Gift','📈 Investment','💰 Business','❓ Other']

interface Props {
  onSave:  (t: Omit<Transaction, 'id' | 'created_at'>) => Promise<void>
  onClose: () => void
}

export default function TransactionForm({ onSave, onClose }: Props) {
  const [type,        setType]        = useState<TransactionType>('expense')
  const [amount,      setAmount]      = useState('')
  const [category,    setCategory]    = useState('')
  const [description, setDescription] = useState('')
  const [date,        setDate]        = useState(new Date().toISOString().split('T')[0])
  const [period,      setPeriod]      = useState<BudgetPeriod>('daily')
  const [saving,      setSaving]      = useState(false)

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!amount || !category) return
    setSaving(true)
    try {
      await onSave({ type, amount: parseFloat(amount), category, description, date, period })
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)',
      zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      <div style={{
        backgroundColor: 'white', width: '100%', maxWidth: '448px',
        borderRadius: '24px 24px 0 0', height: '88vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px 14px', borderBottom: '1px solid #f3f4f6', flexShrink: 0 }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1f2937' }}>
            ➕ New Transaction
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px' }}>
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {/* Income / Expense toggle */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['expense', 'income'] as TransactionType[]).map(t => (
                <button key={t} type="button" onClick={() => { setType(t); setCategory('') }} style={{
                  flex: 1, padding: '10px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                  fontSize: '14px', fontWeight: 600,
                  backgroundColor: type === t ? (t === 'expense' ? '#fef2f2' : '#f0fdf4') : '#f9fafb',
                  color: type === t ? (t === 'expense' ? '#ef4444' : '#16a34a') : '#9ca3af',
                  transition: 'all 0.15s',
                }}>
                  {t === 'expense' ? '💸 Expense' : '💰 Income'}
                </button>
              ))}
            </div>

            {/* Amount */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '6px' }}>Amount (KSh)</label>
              <input
                type="number" placeholder="0.00" min="0" step="0.01"
                value={amount} onChange={e => setAmount(e.target.value)} required
                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '20px', fontWeight: 700, outline: 'none', boxSizing: 'border-box', color: type === 'expense' ? '#ef4444' : '#16a34a' }}
              />
            </div>

            {/* Period */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '6px' }}>Period</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['daily', 'weekly', 'monthly'] as BudgetPeriod[]).map(p => (
                  <button key={p} type="button" onClick={() => setPeriod(p)} style={{
                    flex: 1, padding: '8px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                    fontSize: '13px', fontWeight: 500,
                    backgroundColor: period === p ? '#ec4899' : '#f9fafb',
                    color: period === p ? 'white' : '#6b7280',
                    transition: 'all 0.15s',
                  }}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '6px' }}>Category</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {categories.map(c => (
                  <button key={c} type="button" onClick={() => setCategory(c)} style={{
                    padding: '6px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                    fontSize: '13px',
                    backgroundColor: category === c ? '#ec4899' : '#f3f4f6',
                    color: category === c ? 'white' : '#374151',
                    transition: 'all 0.15s',
                  }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '6px' }}>Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* Description */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '6px' }}>Note (optional)</label>
              <input type="text" placeholder="e.g. Bought vegetables at market"
                value={description} onChange={e => setDescription(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Save — always visible */}
          <div style={{ flexShrink: 0, padding: '12px 24px 28px', borderTop: '1px solid #f3f4f6', backgroundColor: 'white' }}>
            <button type="submit" disabled={saving || !amount || !category} style={{
              width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
              backgroundColor: saving || !amount || !category ? '#f9a8d4' : '#ec4899',
              color: 'white', fontSize: '15px', fontWeight: 700,
              cursor: saving || !amount || !category ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s',
            }}>
              {saving ? 'Saving...' : 'Save Transaction ✨'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

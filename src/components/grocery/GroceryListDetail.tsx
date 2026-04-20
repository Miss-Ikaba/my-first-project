import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import type { GroceryList, GroceryItem } from '../../types'

interface Props {
  list: GroceryList
  onClose:      () => void
  onAddItem:    (listId: string, item: Omit<GroceryItem, 'id' | 'list_id'>) => Promise<void>
  onToggleItem: (listId: string, itemId: string, checked: boolean) => Promise<void>
  onDeleteItem: (listId: string, itemId: string) => Promise<void>
}

export default function GroceryListDetail({ list, onClose, onAddItem, onToggleItem, onDeleteItem }: Props) {
  const [name,     setName]     = useState('')
  const [qty,      setQty]      = useState('1')
  const [price,    setPrice]    = useState('')
  const [adding,   setAdding]   = useState(false)
  const [showForm, setShowForm] = useState(false)

  const items   = list.items ?? []
  const total   = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const checked = items.filter(i => i.checked).reduce((sum, i) => sum + i.price * i.quantity, 0)
  const remaining = total - checked

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setAdding(true)
    try {
      await onAddItem(list.id, {
        name: name.trim(),
        quantity: parseFloat(qty) || 1,
        price: parseFloat(price) || 0,
        checked: false,
      })
      setName(''); setQty('1'); setPrice('')
      setShowForm(false)
    } finally {
      setAdding(false)
    }
  }

  const date = new Date(list.date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  return (
    <div style={{
      position: 'fixed', inset: 0,
      backgroundColor: 'rgba(0,0,0,0.45)',
      zIndex: 200,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      <div style={{
        backgroundColor: 'white', width: '100%', maxWidth: '448px',
        borderRadius: '24px 24px 0 0', height: '90vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>

        {/* Header */}
        <div style={{
          padding: '20px 24px 14px', flexShrink: 0,
          borderBottom: '1px solid #f3f4f6',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <h2 style={{ margin: '0 0 2px', fontSize: '18px', fontWeight: 700, color: '#1f2937' }}>
              🛒 {list.name}
            </h2>
            <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>{date}</p>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px',
          }}>
            <X size={22} />
          </button>
        </div>

        {/* Running total bar */}
        <div style={{
          display: 'flex', gap: '8px', padding: '12px 24px',
          backgroundColor: '#fdf2f8', flexShrink: 0,
        }}>
          <div style={{ flex: 1, textAlign: 'center', backgroundColor: 'white', borderRadius: '12px', padding: '10px' }}>
            <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>Total</p>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1f2937' }}>KSh {total.toFixed(2)}</p>
          </div>
          <div style={{ flex: 1, textAlign: 'center', backgroundColor: 'white', borderRadius: '12px', padding: '10px' }}>
            <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>In trolley ✅</p>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#10b981' }}>KSh {checked.toFixed(2)}</p>
          </div>
          <div style={{ flex: 1, textAlign: 'center', backgroundColor: 'white', borderRadius: '12px', padding: '10px' }}>
            <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>Still needed</p>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#ec4899' }}>KSh {remaining.toFixed(2)}</p>
          </div>
        </div>

        {/* Items list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 24px' }}>
          {items.length === 0 && !showForm && (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#9ca3af', fontSize: '14px' }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>🛍️</div>
              No items yet — tap + to add one!
            </div>
          )}

          {items.map(item => (
            <div key={item.id} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 0', borderBottom: '1px solid #f9fafb',
            }}>
              {/* Checkbox */}
              <button onClick={() => onToggleItem(list.id, item.id, item.checked)} style={{
                width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
                border: item.checked ? 'none' : '2px solid #d1d5db',
                backgroundColor: item.checked ? '#ec4899' : 'transparent',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {item.checked && <span style={{ color: 'white', fontSize: '13px' }}>✓</span>}
              </button>

              {/* Item name + qty */}
              <div style={{ flex: 1 }}>
                <p style={{
                  margin: 0, fontSize: '14px', fontWeight: 500,
                  color: item.checked ? '#9ca3af' : '#1f2937',
                  textDecoration: item.checked ? 'line-through' : 'none',
                }}>
                  {item.name}
                </p>
                <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>
                  Qty: {item.quantity} × KSh {item.price.toFixed(2)}
                </p>
              </div>

              {/* Line total */}
              <span style={{ fontSize: '14px', fontWeight: 600, color: item.checked ? '#10b981' : '#1f2937', flexShrink: 0 }}>
                R {(item.price * item.quantity).toFixed(2)}
              </span>

              {/* Delete */}
              <button onClick={() => onDeleteItem(list.id, item.id)} style={{
                background: 'none', border: 'none', cursor: 'pointer', color: '#d1d5db', padding: '4px',
              }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          {/* Add item form */}
          {showForm && (
            <form onSubmit={handleAdd} style={{
              backgroundColor: '#fdf2f8', borderRadius: '14px',
              padding: '14px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px',
            }}>
              <input
                autoFocus type="text" placeholder="Item name (e.g. Milk)"
                value={name} onChange={e => setName(e.target.value)} required
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #fce7f3', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="number" placeholder="Qty" min="0.1" step="0.1"
                  value={qty} onChange={e => setQty(e.target.value)}
                  style={{ width: '80px', padding: '10px 12px', borderRadius: '10px', border: '1px solid #fce7f3', fontSize: '14px', outline: 'none' }}
                />
                <input
                  type="number" placeholder="Price (KSh)" min="0" step="0.01"
                  value={price} onChange={e => setPrice(e.target.value)}
                  style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', border: '1px solid #fce7f3', fontSize: '14px', outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" onClick={() => setShowForm(false)} style={{
                  flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #e5e7eb',
                  backgroundColor: 'white', cursor: 'pointer', fontSize: '14px', color: '#6b7280',
                }}>
                  Cancel
                </button>
                <button type="submit" disabled={adding} style={{
                  flex: 2, padding: '10px', borderRadius: '10px', border: 'none',
                  backgroundColor: '#ec4899', color: 'white', cursor: 'pointer',
                  fontSize: '14px', fontWeight: 600,
                }}>
                  {adding ? 'Adding...' : 'Add Item'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Add item button — always visible */}
        {!showForm && (
          <div style={{ flexShrink: 0, padding: '12px 24px 28px', borderTop: '1px solid #f3f4f6' }}>
            <button onClick={() => setShowForm(true)} style={{
              width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
              backgroundColor: '#ec4899', color: 'white', fontSize: '15px',
              fontWeight: 600, cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
              <Plus size={18} /> Add Item
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

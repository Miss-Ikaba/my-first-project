import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useGrocery } from '../hooks/useGrocery'
import GroceryListCard from '../components/grocery/GroceryListCard'
import GroceryListDetail from '../components/grocery/GroceryListDetail'
import type { GroceryList } from '../types'

export default function GroceryPage() {
  const { lists, loading, error, createList, deleteList, addItem, toggleItem, deleteItem } = useGrocery()
  const [activeList, setActiveList]   = useState<GroceryList | null>(null)
  const [showNewForm, setShowNewForm] = useState(false)
  const [listName, setListName]       = useState('')
  const [listDate, setListDate]       = useState(new Date().toISOString().split('T')[0])
  const [creating, setCreating]       = useState(false)

  async function handleCreateList(e: React.FormEvent) {
    e.preventDefault()
    if (!listName.trim()) return
    setCreating(true)
    try {
      await createList(listName.trim(), listDate)
      setListName(''); setShowNewForm(false)
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id: string) {
    if (window.confirm('Delete this grocery list and all its items?')) {
      await deleteList(id)
    }
  }

  // Keep active list in sync with latest state
  const currentList = activeList ? lists.find(l => l.id === activeList.id) ?? null : null

  return (
    <div>
      {error && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', marginBottom: '16px' }}>
          ⚠️ {error}
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}>
          <div className="w-7 h-7 border-2 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
        </div>
      )}

      {/* New list form */}
      {showNewForm && (
        <form onSubmit={handleCreateList} style={{
          backgroundColor: 'white', borderRadius: '16px',
          padding: '16px', marginBottom: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          display: 'flex', flexDirection: 'column', gap: '10px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#1f2937' }}>New Shopping List</h3>
            <button type="button" onClick={() => setShowNewForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
              <X size={18} />
            </button>
          </div>
          <input
            autoFocus type="text" placeholder="List name (e.g. Weekly Shop)"
            value={listName} onChange={e => setListName(e.target.value)} required
            style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
          />
          <input
            type="date" value={listDate} onChange={e => setListDate(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
          />
          <button type="submit" disabled={creating} style={{
            width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
            backgroundColor: '#ec4899', color: 'white', fontSize: '14px',
            fontWeight: 600, cursor: 'pointer',
          }}>
            {creating ? 'Creating...' : 'Create List 🛒'}
          </button>
        </form>
      )}

      {/* Empty state */}
      {!loading && lists.length === 0 && !showNewForm && (
        <div style={{ textAlign: 'center', padding: '64px 0' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🛒</div>
          <h2 style={{ color: '#ec4899', fontSize: '18px', fontWeight: 600, margin: '0 0 8px' }}>No lists yet</h2>
          <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>Tap the button below to create your first shopping list!</p>
        </div>
      )}

      {/* Lists */}
      {!loading && lists.map(list => (
        <GroceryListCard
          key={list.id}
          list={list}
          onOpen={setActiveList}
          onDelete={handleDelete}
        />
      ))}

      {/* FAB */}
      <button
        onClick={() => setShowNewForm(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-pink-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-pink-600 active:scale-95 transition-all z-40"
        aria-label="New grocery list"
      >
        <Plus size={22} />
      </button>

      {/* Detail modal */}
      {currentList && (
        <GroceryListDetail
          list={currentList}
          onClose={() => setActiveList(null)}
          onAddItem={addItem}
          onToggleItem={toggleItem}
          onDeleteItem={deleteItem}
        />
      )}
    </div>
  )
}

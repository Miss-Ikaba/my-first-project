// ─── Journal ────────────────────────────────────────────────────────────────
export interface JournalEntry {
  id: string
  type: 'daily' | 'weekly'
  title: string
  content: string
  mood?: string          // emoji e.g. "😊"
  date: string           // ISO date "2024-01-15"
  created_at: string
  updated_at: string
}

// ─── Notes ──────────────────────────────────────────────────────────────────
export interface Note {
  id: string
  title: string
  content: string
  color?: string         // background colour for widget
  pinned: boolean
  created_at: string
  updated_at: string
}

// ─── Grocery ─────────────────────────────────────────────────────────────────
export interface GroceryItem {
  id: string
  list_id: string
  name: string
  quantity: number
  price: number
  checked: boolean
}

export interface GroceryList {
  id: string
  name: string
  date: string
  items: GroceryItem[]
  created_at: string
}

// ─── Budget ──────────────────────────────────────────────────────────────────
export type BudgetPeriod = 'daily' | 'weekly' | 'monthly'
export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  type: TransactionType
  category: string
  amount: number
  description: string
  date: string
  period: BudgetPeriod
  created_at: string
}

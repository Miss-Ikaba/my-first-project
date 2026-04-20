import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Transaction, BudgetPeriod } from '../types'

export function useBudget() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => { fetchTransactions() }, [])

  async function fetchTransactions() {
    setLoading(true)
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })

    if (error) setError(error.message)
    else setTransactions(data ?? [])
    setLoading(false)
  }

  async function addTransaction(t: Omit<Transaction, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('transactions')
      .insert(t)
      .select()
      .single()

    if (error) throw error
    setTransactions(prev => [data, ...prev])
    return data
  }

  async function deleteTransaction(id: string) {
    const { error } = await supabase
      .from('transactions')
      .delete().eq('id', id)
    if (error) throw error
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  // Filter helpers
  function getByPeriod(period: BudgetPeriod, referenceDate = new Date()) {
    return transactions.filter(t => {
      if (t.period !== period) return false
      const d = new Date(t.date)
      if (period === 'daily') {
        return t.date === referenceDate.toISOString().split('T')[0]
      }
      if (period === 'weekly') {
        const startOfWeek = new Date(referenceDate)
        startOfWeek.setDate(referenceDate.getDate() - referenceDate.getDay())
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        return d >= startOfWeek && d <= endOfWeek
      }
      if (period === 'monthly') {
        return d.getMonth() === referenceDate.getMonth() &&
               d.getFullYear() === referenceDate.getFullYear()
      }
      return false
    })
  }

  function getSummary(items: Transaction[]) {
    const income   = items.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expense  = items.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    return { income, expense, balance: income - expense }
  }

  return { transactions, loading, error, addTransaction, deleteTransaction, getByPeriod, getSummary }
}

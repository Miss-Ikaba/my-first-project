import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { JournalEntry } from '../types'

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEntries()
  }, [])

  async function fetchEntries() {
    setLoading(true)
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .order('date', { ascending: false })

    if (error) setError(error.message)
    else setEntries(data ?? [])
    setLoading(false)
  }

  async function createEntry(entry: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('journal_entries')
      .insert(entry)
      .select()
      .single()

    if (error) throw error
    setEntries(prev => [data, ...prev])
    return data
  }

  async function updateEntry(id: string, updates: Partial<JournalEntry>) {
    const { data, error } = await supabase
      .from('journal_entries')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    setEntries(prev => prev.map(e => e.id === id ? data : e))
    return data
  }

  async function deleteEntry(id: string) {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id)

    if (error) throw error
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  return { entries, loading, error, createEntry, updateEntry, deleteEntry, refetch: fetchEntries }
}

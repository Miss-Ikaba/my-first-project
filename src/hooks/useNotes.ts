import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Note } from '../types'

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNotes()
  }, [])

  async function fetchNotes() {
    setLoading(true)
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else setNotes(data ?? [])
    setLoading(false)
  }

  async function createNote(note: Omit<Note, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('notes')
      .insert(note)
      .select()
      .single()

    if (error) throw error
    setNotes(prev => [data, ...prev])
    return data
  }

  async function updateNote(id: string, updates: Partial<Note>) {
    const { data, error } = await supabase
      .from('notes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    setNotes(prev => prev.map(n => n.id === id ? data : n))
    return data
  }

  async function deleteNote(id: string) {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)

    if (error) throw error
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  async function togglePin(id: string, pinned: boolean) {
    return updateNote(id, { pinned: !pinned })
  }

  return { notes, loading, error, createNote, updateNote, deleteNote, togglePin }
}

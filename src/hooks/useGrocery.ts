import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { GroceryList, GroceryItem } from '../types'

export function useGrocery() {
  const [lists, setLists]     = useState<GroceryList[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => { fetchLists() }, [])

  async function fetchLists() {
    setLoading(true)
    const { data, error } = await supabase
      .from('grocery_lists')
      .select('*, items:grocery_items(*)')
      .order('date', { ascending: false })

    if (error) setError(error.message)
    else setLists((data ?? []) as GroceryList[])
    setLoading(false)
  }

  async function createList(name: string, date: string) {
    const { data, error } = await supabase
      .from('grocery_lists')
      .insert({ name, date })
      .select('*, items:grocery_items(*)')
      .single()

    if (error) throw error
    const newList = { ...data, items: [] } as GroceryList
    setLists(prev => [newList, ...prev])
    return newList
  }

  async function deleteList(id: string) {
    const { error } = await supabase
      .from('grocery_lists')
      .delete().eq('id', id)
    if (error) throw error
    setLists(prev => prev.filter(l => l.id !== id))
  }

  async function addItem(listId: string, item: Omit<GroceryItem, 'id' | 'list_id'>) {
    const { data, error } = await supabase
      .from('grocery_items')
      .insert({ ...item, list_id: listId })
      .select().single()

    if (error) throw error
    setLists(prev => prev.map(l =>
      l.id === listId ? { ...l, items: [...(l.items ?? []), data] } : l
    ))
    return data
  }

  async function toggleItem(listId: string, itemId: string, checked: boolean) {
    const { data, error } = await supabase
      .from('grocery_items')
      .update({ checked: !checked })
      .eq('id', itemId).select().single()

    if (error) throw error
    setLists(prev => prev.map(l =>
      l.id === listId
        ? { ...l, items: l.items.map(i => i.id === itemId ? data : i) }
        : l
    ))
  }

  async function deleteItem(listId: string, itemId: string) {
    const { error } = await supabase
      .from('grocery_items')
      .delete().eq('id', itemId)

    if (error) throw error
    setLists(prev => prev.map(l =>
      l.id === listId
        ? { ...l, items: l.items.filter(i => i.id !== itemId) }
        : l
    ))
  }

  async function updateItem(listId: string, itemId: string, updates: Partial<GroceryItem>) {
    const { data, error } = await supabase
      .from('grocery_items')
      .update(updates)
      .eq('id', itemId).select().single()

    if (error) throw error
    setLists(prev => prev.map(l =>
      l.id === listId
        ? { ...l, items: l.items.map(i => i.id === itemId ? data : i) }
        : l
    ))
  }

  return { lists, loading, error, createList, deleteList, addItem, toggleItem, deleteItem, updateItem }
}

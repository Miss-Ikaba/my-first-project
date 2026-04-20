import { useLocation } from 'react-router-dom'

const titles: Record<string, { label: string; emoji: string }> = {
  '/':         { label: 'My Journal',    emoji: '📖' },
  '/notepad':  { label: 'Notepad',       emoji: '📝' },
  '/calendar': { label: 'Calendar',      emoji: '📅' },
  '/grocery':  { label: 'Grocery List',  emoji: '🛒' },
  '/budget':   { label: 'Budget',        emoji: '💰' },
}

export default function Header() {
  const location = useLocation()
  const current = titles[location.pathname] ?? { label: 'My Diary', emoji: '🌸' }

  return (
    <header className="bg-white border-b border-pink-100 px-4 py-4 sticky top-0 z-40 shadow-sm">
      <h1 className="text-xl font-semibold text-pink-500 tracking-tight">
        {current.emoji} {current.label}
      </h1>
    </header>
  )
}

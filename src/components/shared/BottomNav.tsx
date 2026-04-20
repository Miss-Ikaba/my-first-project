import { NavLink } from 'react-router-dom'
import { BookOpen, FileText, Calendar, ShoppingCart, Wallet } from 'lucide-react'

const navItems = [
  { path: '/',         icon: BookOpen,      label: 'Journal'  },
  { path: '/notepad',  icon: FileText,      label: 'Notes'    },
  { path: '/calendar', icon: Calendar,      label: 'Calendar' },
  { path: '/grocery',  icon: ShoppingCart,  label: 'Grocery'  },
  { path: '/budget',   icon: Wallet,        label: 'Budget'   },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-pink-100 flex items-center justify-around pt-2 pb-5 px-2 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      {navItems.map(({ path, icon: Icon, label }) => (
        <NavLink
          key={path}
          to={path}
          end={path === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[11px] font-medium transition-colors px-2 py-1 rounded-xl ${
              isActive
                ? 'text-pink-500 bg-pink-50'
                : 'text-gray-400 hover:text-pink-400'
            }`
          }
        >
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

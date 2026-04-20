import type { ReactNode } from 'react'
import Header from './Header'
import BottomNav from './BottomNav'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-pink-50 relative">
      <Header />
      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-4">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}

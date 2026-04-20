import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/shared/Layout'
import JournalPage from './pages/JournalPage'
import NotepadPage from './pages/NotepadPage'
import CalendarPage from './pages/CalendarPage'
import GroceryPage from './pages/GroceryPage'
import BudgetPage from './pages/BudgetPage'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<JournalPage />} />
          <Route path="/notepad" element={<NotepadPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/grocery" element={<GroceryPage />} />
          <Route path="/budget" element={<BudgetPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

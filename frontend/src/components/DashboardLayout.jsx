import { useNavigate } from 'react-router-dom'
import { LogOut, User } from 'lucide-react'
import Sidebar from './Sidebar'
import { useState } from 'react'

function DashboardLayout({ children, setAuth }) {
  const navigate = useNavigate()
  const [user] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'))

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setAuth(false)
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-card border-b border-border px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Bienvenue</h2>
            <p className="text-sm text-muted-foreground">{user.name || 'Utilisateur'}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-muted rounded-lg">
              <User size={20} className="text-muted-foreground" />
              <span className="text-sm text-foreground">{user.email || 'user@billz.com'}</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Déconnexion</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout



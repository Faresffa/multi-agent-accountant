import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  Receipt,
  TrendingUp,
  Settings,
  Sparkles
} from 'lucide-react'

function Sidebar() {
  const location = useLocation()

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/dashboard' 
    },
    { 
      icon: FileText, 
      label: 'Factures', 
      path: '/factures' 
    },
    { 
      icon: CreditCard, 
      label: 'Transactions', 
      path: '/transactions' 
    },
    { 
      icon: Receipt, 
      label: 'TVA', 
      path: '/tva' 
    },
    { 
      icon: TrendingUp, 
      label: 'Optimisation', 
      path: '/optimisation' 
    }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="w-80 h-screen bg-sidebar-background border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center glow-primary">
            <Sparkles className="text-white" size={18} />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Bill'z
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${active 
                  ? 'bg-gradient-primary text-white glow-primary shadow-lg' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }
              `}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Settings (bottom) */}
      <div className="p-4 border-t border-sidebar-border">
        <Link
          to="/settings"
          className={`
            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
            ${isActive('/settings')
              ? 'bg-gradient-primary text-white glow-primary' 
              : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            }
          `}
        >
          <Settings size={20} />
          <span className="font-medium">Paramètres</span>
        </Link>
      </div>
    </div>
  )
}

export default Sidebar



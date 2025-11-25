import DashboardLayout from '../components/DashboardLayout'
import { Settings as SettingsIcon, User, Mail, Bell, Lock } from 'lucide-react'

function Settings({ setAuth }) {
  return (
    <DashboardLayout setAuth={setAuth}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
          <p className="text-muted-foreground mt-1">Gérez votre compte et vos préférences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <User className="text-primary" size={24} />
              <h2 className="text-xl font-semibold text-foreground">Profil</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nom complet</label>
                <input type="text" className="input-field" placeholder="Votre nom" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input type="email" className="input-field" placeholder="votre@email.com" />
              </div>
              <button className="btn-primary w-full">Sauvegarder</button>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="text-destructive" size={24} />
              <h2 className="text-xl font-semibold text-foreground">Sécurité</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Mot de passe actuel</label>
                <input type="password" className="input-field" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nouveau mot de passe</label>
                <input type="password" className="input-field" placeholder="••••••••" />
              </div>
              <button className="btn-secondary w-full">Changer le mot de passe</button>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="text-secondary" size={24} />
              <h2 className="text-xl font-semibold text-foreground">Connexions</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-foreground">Gmail</span>
                <button className="text-sm text-primary hover:text-secondary">Connecter</button>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-foreground">Compte bancaire</span>
                <button className="text-sm text-primary hover:text-secondary">Connecter</button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="text-warning" size={24} />
              <h2 className="text-xl font-semibold text-foreground">Notifications</h2>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-muted rounded-lg cursor-pointer">
                <span className="text-foreground">Factures reçues</span>
                <input type="checkbox" className="w-5 h-5" defaultChecked />
              </label>
              <label className="flex items-center justify-between p-3 bg-muted rounded-lg cursor-pointer">
                <span className="text-foreground">Transactions détectées</span>
                <input type="checkbox" className="w-5 h-5" defaultChecked />
              </label>
              <label className="flex items-center justify-between p-3 bg-muted rounded-lg cursor-pointer">
                <span className="text-foreground">Rappels TVA</span>
                <input type="checkbox" className="w-5 h-5" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Settings



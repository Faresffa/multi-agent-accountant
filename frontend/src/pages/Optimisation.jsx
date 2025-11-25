import DashboardLayout from '../components/DashboardLayout'
import { TrendingUp, Lightbulb } from 'lucide-react'

function Optimisation({ setAuth }) {
  return (
    <DashboardLayout setAuth={setAuth}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Optimisation fiscale</h1>
          <p className="text-muted-foreground mt-1">Recommandations intelligentes pour optimiser votre fiscalité</p>
        </div>

        <div className="card bg-info/10 border-info">
          <div className="flex gap-3">
            <Lightbulb className="text-info flex-shrink-0" size={24} />
            <div>
              <h3 className="font-semibold text-info-foreground mb-1">Fonctionnalité à venir</h3>
              <p className="text-sm text-muted-foreground">
                Notre IA analysera vos dépenses et vous proposera des optimisations fiscales personnalisées.
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <TrendingUp className="mx-auto text-muted-foreground mb-4" size={64} />
              <h3 className="text-xl font-semibold text-foreground mb-2">Bientôt disponible</h3>
              <p className="text-muted-foreground">L'agent d'optimisation fiscale est en cours de développement</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Optimisation



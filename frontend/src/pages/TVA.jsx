import DashboardLayout from '../components/DashboardLayout'
import { Receipt, Calculator } from 'lucide-react'

function TVA({ setAuth }) {
  return (
    <DashboardLayout setAuth={setAuth}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">TVA</h1>
            <p className="text-muted-foreground mt-1">Calculs et déclarations TVA automatiques</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Calculator size={20} />
            Calculer la TVA
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <p className="text-sm text-muted-foreground mb-1">TVA collectée</p>
            <p className="text-2xl font-bold text-success">0.00 €</p>
          </div>
          <div className="card">
            <p className="text-sm text-muted-foreground mb-1">TVA déductible</p>
            <p className="text-2xl font-bold text-info">0.00 €</p>
          </div>
          <div className="card">
            <p className="text-sm text-muted-foreground mb-1">TVA due</p>
            <p className="text-2xl font-bold text-primary">0.00 €</p>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Receipt className="mx-auto text-muted-foreground mb-4" size={64} />
              <h3 className="text-xl font-semibold text-foreground mb-2">Aucune donnée TVA</h3>
              <p className="text-muted-foreground">Les calculs apparaîtront automatiquement avec vos factures</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default TVA



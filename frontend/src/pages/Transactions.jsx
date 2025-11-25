import DashboardLayout from '../components/DashboardLayout'
import { CreditCard, Download } from 'lucide-react'

function Transactions({ setAuth }) {
  return (
    <DashboardLayout setAuth={setAuth}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Transactions bancaires</h1>
            <p className="text-muted-foreground mt-1">Toutes vos transactions synchronisées automatiquement</p>
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Download size={20} />
            Exporter
          </button>
        </div>

        <div className="card">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <CreditCard className="mx-auto text-muted-foreground mb-4" size={64} />
              <h3 className="text-xl font-semibold text-foreground mb-2">Aucune transaction</h3>
              <p className="text-muted-foreground">Connectez votre compte bancaire pour voir vos transactions</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Transactions



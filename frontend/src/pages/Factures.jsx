import DashboardLayout from '../components/DashboardLayout'
import { FileText, Upload, Search } from 'lucide-react'

function Factures({ setAuth }) {
  return (
    <DashboardLayout setAuth={setAuth}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Factures</h1>
            <p className="text-muted-foreground mt-1">Gérez toutes vos factures entrantes et sortantes</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Upload size={20} />
            Ajouter une facture
          </button>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Search size={20} className="text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Rechercher une facture..." 
              className="input-field"
            />
          </div>

          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <FileText className="mx-auto text-muted-foreground mb-4" size={64} />
              <h3 className="text-xl font-semibold text-foreground mb-2">Aucune facture</h3>
              <p className="text-muted-foreground">Commencez par ajouter votre première facture</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Factures



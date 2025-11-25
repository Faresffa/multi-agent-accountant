import { 
  FileText, 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  AlertCircle 
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import DashboardLayout from '../components/DashboardLayout'

// Mock data minimaliste
const mockInvoices = [
  { id: 1, supplier: 'Amazon', amount: 105.00, date: '2025-11-20', category: 'Fournitures', type: 'entrante' },
  { id: 2, supplier: 'OVH', amount: 89.99, date: '2025-11-18', category: 'Hébergement', type: 'entrante' },
  { id: 3, supplier: 'Client ABC', amount: 1200.00, date: '2025-11-15', category: 'Prestation', type: 'sortante' },
]

const mockTransactions = [
  { id: 1, label: 'OPENAI INC', amount: -91.03, date: '2025-11-21', category: 'SaaS' },
  { id: 2, label: 'Virement Client XYZ', amount: 1500.00, date: '2025-11-19', category: 'Revenu' },
  { id: 3, label: 'SNCF CONNECT', amount: -75.00, date: '2025-11-17', category: 'Transport' },
]

const chartData = [
  { mois: 'Sept', revenus: 3200, depenses: 1400 },
  { mois: 'Oct', revenus: 4100, depenses: 1800 },
  { mois: 'Nov', revenus: 2700, depenses: 950 },
]

function Dashboard({ setAuth }) {
  const totalRevenus = mockTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)

  const totalDepenses = Math.abs(
    mockTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0)
  )

  return (
    <DashboardLayout setAuth={setAuth}>
      <div className="space-y-6">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card glow-secondary hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Revenus ce mois</p>
                <p className="text-2xl font-bold text-success">
                  {totalRevenus.toFixed(2)} €
                </p>
              </div>
              <div className="bg-success/20 p-3 rounded-full">
                <TrendingUp className="text-success" size={24} />
              </div>
            </div>
          </div>

          <div className="card hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Dépenses ce mois</p>
                <p className="text-2xl font-bold text-destructive">
                  {totalDepenses.toFixed(2)} €
                </p>
              </div>
              <div className="bg-destructive/20 p-3 rounded-full">
                <TrendingDown className="text-destructive" size={24} />
              </div>
            </div>
          </div>

          <div className="card glow-primary hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Bénéfice net</p>
                <p className="text-2xl font-bold text-primary">
                  {(totalRevenus - totalDepenses).toFixed(2)} €
                </p>
              </div>
              <div className="bg-primary/20 p-3 rounded-full">
                <FileText className="text-primary" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Graphique */}
        <div className="card">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Évolution revenus / dépenses
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="mois" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Legend />
              <Bar dataKey="revenus" fill="hsl(var(--success))" name="Revenus" />
              <Bar dataKey="depenses" fill="hsl(var(--destructive))" name="Dépenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Factures récentes */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="text-primary" size={20} />
              <h2 className="text-lg font-semibold text-foreground">
                Factures récentes
              </h2>
            </div>
            
            <div className="space-y-3">
              {mockInvoices.map((invoice) => (
                <div 
                  key={invoice.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/70 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-foreground">{invoice.supplier}</p>
                    <p className="text-sm text-muted-foreground">
                      {invoice.category} • {invoice.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      invoice.type === 'sortante' ? 'text-success' : 'text-foreground'
                    }`}>
                      {invoice.type === 'sortante' ? '+' : ''}{invoice.amount.toFixed(2)} €
                    </p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      invoice.type === 'sortante' 
                        ? 'bg-success/20 text-success' 
                        : 'bg-info/20 text-info'
                    }`}>
                      {invoice.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transactions bancaires */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="text-secondary" size={20} />
              <h2 className="text-lg font-semibold text-foreground">
                Transactions récentes
              </h2>
            </div>
            
            <div className="space-y-3">
              {mockTransactions.map((transaction) => (
                <div 
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/70 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-foreground">{transaction.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.category} • {transaction.date}
                    </p>
                  </div>
                  <p className={`font-semibold ${
                    transaction.amount > 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)} €
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alert */}
        <div className="card bg-warning/10 border-warning">
          <div className="flex gap-3">
            <AlertCircle className="text-warning flex-shrink-0" size={24} />
            <div>
              <h3 className="font-semibold text-warning-foreground mb-1">
                Mode démonstration
              </h3>
              <p className="text-sm text-muted-foreground">
                Vous visualisez des données de démonstration. 
                Connectez vos comptes pour voir vos vraies données.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard


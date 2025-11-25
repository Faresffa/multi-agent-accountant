import { Link } from 'react-router-dom'
import { 
  Sparkles, 
  Zap, 
  Shield, 
  ArrowRight,
  FileText,
  CreditCard,
  Bot,
  Users,
  Check
} from 'lucide-react'

function Landing() {
  const team = [
    'BENAMARA Farid',
    'ASBANE Amine', 
    'HAFIANE Fares',
    'HARIGA Skander'
  ]

  const features = [
    {
      icon: FileText,
      title: 'Agent Facture',
      description: 'Lecture automatique des emails et extraction intelligente des données (montant, TVA, date) via OCR et LLM.'
    },
    {
      icon: CreditCard,
      title: 'Agent Banque',
      description: 'Analyse des relevés bancaires, catégorisation des transactions et matching automatique avec les factures.'
    },
    {
      icon: Bot,
      title: 'Orchestrateur',
      description: 'Coordination intelligente des agents, gestion des erreurs et automatisation complète du workflow.'
    }
  ]

  const benefits = [
    'Automatisation de 80-90% des tâches comptables',
    'Extraction automatique depuis Gmail',
    'Matching intelligent factures ↔ paiements',
    'Dashboard temps réel',
    'Rapprochement bancaire automatisé',
    'Gain de temps considérable'
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center glow-primary">
                <Sparkles className="text-white" size={20} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Bill'z
              </span>
            </div>
            <div className="flex gap-3">
              <Link to="/login">
                <button className="text-muted-foreground hover:text-foreground transition-colors px-4 py-2">
                  Connexion
                </button>
              </Link>
              <Link to="/signup">
                <button className="btn-primary">
                  Commencer gratuitement
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 gradient-primary opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8">
              <Sparkles className="text-primary" size={16} />
              <span className="text-sm text-primary font-medium">Projet Multi-Agents MD5</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Comptabilité automatique
              </span>
              <br />
              <span className="text-foreground">pour indépendants & PME</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Bill'z simplifie radicalement votre comptabilité. Notre système multi-agents 
              automatise le traitement des factures, analyse les relevés bancaires et fait 
              le rapprochement automatique.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/signup">
                <button className="btn-primary text-lg px-8 py-4 flex items-center gap-2 group">
                  Essayer gratuitement
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link to="/login">
                <button className="btn-secondary text-lg px-8 py-4">
                  Se connecter
                </button>
              </Link>
            </div>

            {/* Team */}
            <div className="inline-flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
              <Users size={16} />
              <span>Créé par:</span>
              {team.map((member, index) => (
                <span key={member}>
                  <span className="text-foreground font-medium">{member}</span>
                  {index < team.length - 1 && <span className="mx-1">•</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Les agents du système
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Trois agents intelligents travaillent 24/7 pour automatiser votre comptabilité
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="card hover:scale-105 transition-all duration-300 group"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card bg-gradient-card glow-primary">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-secondary/20 rounded-lg">
                <Zap className="text-secondary" size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2 text-foreground">
Comment Bill'z transforme votre quotidien                </h2>
                <p className="text-muted-foreground"></p>
              </div>
            </div>
            
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Un jeune entrepreneur ouvre Bill'z pour la première fois. Depuis des mois, 
                il repousse sa comptabilité, faute de temps et d'énergie.
              </p>
              <p>
                Le soir, après une longue journée, il connecte sa boîte mail et son compte 
                bancaire. Pendant qu'il se repose, <span className="text-primary font-semibold">Bill'z lit 
                automatiquement ses factures</span>, reconnaît les montants, analyse les relevés 
                bancaires, devine quelles opérations correspondent à quels paiements et lui 
                prépare un résumé clair.
              </p>
              <p className="text-foreground font-medium text-lg">
                Le lendemain matin, il découvre son tableau de bord : tout est trié, classé, 
                rapproché. Il lui reste seulement à valider quelques lignes.
              </p>
              <p className="text-secondary font-semibold">
                Bill'z lui donne quelque chose de précieux : du temps, et l'impression que 
                sa gestion n'est plus un poids mais un partenaire qui travaille pour lui.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Pourquoi choisir Bill'z ?
                </span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Notre système multi-agents transforme une tâche lourde et répétitive 
                en un simple contrôle rapide.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 group">
                    <div className="mt-1 p-1 bg-success/20 rounded-full group-hover:scale-110 transition-transform">
                      <Check className="text-success" size={16} />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

             <div className="card glow-secondary">
               <div className="flex items-center gap-3 mb-6">
                 <Shield className="text-secondary" size={32} />
                 <h3 className="text-2xl font-bold text-foreground">Intelligence Artificielle</h3>
               </div>
               
               <div className="space-y-4 text-sm">
                 <div className="p-4 bg-muted/50 rounded-lg border border-border">
                   <p className="font-semibold text-foreground mb-2">👁️ Pixtral (OCR & Vision)</p>
                   <p className="text-muted-foreground">Extraction intelligente des données depuis factures PDF et images</p>
                 </div>
                 
                 <div className="p-4 bg-muted/50 rounded-lg border border-border">
                   <p className="font-semibold text-foreground mb-2">🧠 LLM (Classification)</p>
                   <p className="text-muted-foreground">
                     Analyse des libellés bancaires et catégorisation automatique
                   </p>
                 </div>
                 
                 <div className="p-4 bg-muted/50 rounded-lg border border-border">
                   <p className="font-semibold text-foreground mb-2">🎯 Vector Matching</p>
                   <p className="text-muted-foreground">
                     Embeddings + cosine similarity pour rapprochement factures ↔ paiements
                   </p>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card gradient-primary glow-primary">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Prêt à automatiser votre comptabilité ?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Rejoignez les entrepreneurs qui ont choisi la simplicité
            </p>
            
            <Link to="/signup">
              <button className="bg-white text-primary hover:bg-white/90 font-bold text-lg px-10 py-4 rounded-lg transition-all inline-flex items-center gap-2 group">
                Commencer maintenant
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary" size={20} />
              <span className="font-semibold text-foreground">Bill'z</span>
              <span className="text-muted-foreground">• Projet Multi-Agents MD5</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Bill'z. Comptabilité automatique.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing


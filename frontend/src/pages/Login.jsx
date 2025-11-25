import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'

function Login({ setAuth }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Mock authentification (à remplacer par API plus tard)
    setTimeout(() => {
      if (formData.email && formData.password) {
        localStorage.setItem('token', 'mock-jwt-token')
        localStorage.setItem('user', JSON.stringify({ 
          email: formData.email, 
          name: 'Utilisateur Test' 
        }))
        setAuth(true)
        navigate('/dashboard')
      } else {
        setError('Email et mot de passe requis')
      }
      setLoading(false)
    }, 800)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-primary">
      <div className="w-full max-w-md px-4">
        <div className="card glow-primary">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4 glow-primary">
              <LogIn className="text-primary-foreground" size={32} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Bill'z</h1>
            <p className="text-muted-foreground mt-2">Comptabilité automatique</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive-foreground px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="votre@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Pas encore de compte ?{' '}
              <Link to="/signup" className="text-primary hover:text-secondary font-semibold transition-colors">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login


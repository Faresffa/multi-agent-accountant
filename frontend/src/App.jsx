import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Factures from './pages/Factures'
import Transactions from './pages/Transactions'
import TVA from './pages/TVA'
import Optimisation from './pages/Optimisation'
import Settings from './pages/Settings'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté (localStorage)
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup setAuth={setIsAuthenticated} />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard setAuth={setIsAuthenticated} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/factures" 
          element={
            <ProtectedRoute>
              <Factures setAuth={setIsAuthenticated} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/transactions" 
          element={
            <ProtectedRoute>
              <Transactions setAuth={setIsAuthenticated} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tva" 
          element={
            <ProtectedRoute>
              <TVA setAuth={setIsAuthenticated} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/optimisation" 
          element={
            <ProtectedRoute>
              <Optimisation setAuth={setIsAuthenticated} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings setAuth={setIsAuthenticated} />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  )
}

export default App


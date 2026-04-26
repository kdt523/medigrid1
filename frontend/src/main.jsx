import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import LandingPage from './pages/LandingPage.jsx'
import CitizenLogin from './pages/CitizenLogin.jsx'
import CitizenRegister from './pages/CitizenRegister.jsx'
import CitizenApp from './pages/CitizenApp.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import { CitizenRoute, AdminRoute } from './components/RouteGuard.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<CitizenLogin />} />
        <Route path="/register" element={<CitizenRegister />} />

        {/* Citizen Protected Route */}
        <Route path="/app" element={
          <CitizenRoute>
            <CitizenApp />
          </CitizenRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <App />
          </AdminRoute>
        } />

        {/* Catch-all → landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

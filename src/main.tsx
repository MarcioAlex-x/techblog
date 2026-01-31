import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './services/AuthContext.tsx'
import { RouterProvider } from 'react-router-dom'
import { AppRouter } from './components/AppRouter.tsx'

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <RouterProvider router={AppRouter} />
  </AuthProvider>,
)

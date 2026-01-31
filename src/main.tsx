
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './services/AuthContext.tsx'
import { RouterProvider } from 'react-router-dom'
import { AppRouter } from './components/AppRouter.tsx'

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <RouterProvider router={AppRouter} />
  </AuthProvider>,
)

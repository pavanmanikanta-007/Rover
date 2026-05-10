import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CreateTrip from './create-trip/index.jsx'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import Header from './components/custom/header.jsx'
import { Toaster } from 'sonner'
import { GoogleOAuthProvider } from '@react-oauth/google';
import ViewTrip from './viewTrip/[tripId]/index.jsx';
import MyTrips from './my-trips/index.jsx'
import { AuthProvider } from './services/AuthProvider.jsx'

const Layout = () => (
  <>
    <Header />
    <Toaster />
    <Outlet />
  </>
)

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <App />
      },
      {
        path: "/create-trip",
        element: <CreateTrip />
      },
      {
        path: '/viewTrip/:tripId',
        element: <ViewTrip />
      },
      {
        path: '/my-trips',
        element: <MyTrips />
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId = {import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <AuthProvider>
      <RouterProvider router={router} />
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
)

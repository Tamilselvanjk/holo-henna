import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext' // Update import

// Component imports
import Login from './components/Login/Login'
import Header from './components/Home/Header/Header'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import Shop from './pages/Shop'
import UserProfile from './components/UserProfile/UserProfile'
import OrderSuccess from './components/ShopingPage/OrderSuccess/OrderSuccess'
import OrdersPage from './components/ShopingPage/OrdersPage/OrdersPage'

// Styles
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return null

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: window.location.pathname }} />
  )
}

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <CartProvider>
          <div className="app">
            <Header />
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/shop" element={<Shop />} />
                <Route
                  path="/order-success/:orderId"
                  element={<OrderSuccess />}
                />
                <Route path="/orders" element={<OrdersPage />} />

                {/* Protected Profile Route */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <ToastContainer position="top-center" limit={3} />
          </div>
        </CartProvider>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import api from '../utils/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          setUser(response.data)
        }
      } catch (error) {
        localStorage.removeItem('token')
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (token) => {
    try {
      localStorage.setItem('token', token)
      const response = await api.get('/auth/profile')
      setUser(response.data)
      return response.data
    } catch (error) {
      localStorage.removeItem('token')
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

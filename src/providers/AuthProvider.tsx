import type { AuthContextType, User } from '@/types/auth'
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Token VA user ma'lumotlarini tekshiramiz
    const token = localStorage.getItem('access_token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = (userData: User, token: string) => {
    localStorage.setItem('access_token', token)
    localStorage.setItem('user', JSON.stringify(userData)) 
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user') 
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

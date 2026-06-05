'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AuthContextType {
  isAdmin: boolean
  isLoading: boolean
  login: (password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedAuth = localStorage.getItem('tpog_admin_auth')
    if (savedAuth === 'true') {
      setIsAdmin(true)
    }
    setIsLoading(false)
  }, [])

  const login = async (password: string) => {
    const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin'
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('tpog_admin_auth', 'true')
      setIsAdmin(true)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem('tpog_admin_auth')
    setIsAdmin(false)
  }

  return (
    <AuthContext.Provider value={{ isAdmin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

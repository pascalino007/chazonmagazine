'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api } from '@/lib/api'

const AUTH_KEY = 'chanzon_token'

type AuthContextValue = {
  isAuthenticated: boolean
  hasChecked: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  error: string | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function getStored(): boolean {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem(AUTH_KEY)
}

function setStored(value: string | null) {
  if (typeof window === 'undefined') return
  if (value) {
    localStorage.setItem(AUTH_KEY, value)
  } else {
    localStorage.removeItem(AUTH_KEY)
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsAuthenticated(getStored())
    setHasChecked(true)
  }, [])

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    setError(null)
    try {
      const res = await api.auth.login(username, password)
      setStored(res.access_token)
      setIsAuthenticated(true)
      return true
    } catch (e: any) {
      setError(e.message || 'Login failed')
      return false
    }
  }, [])

  const logout = useCallback(() => {
    setIsAuthenticated(false)
    setStored(null)
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, hasChecked, login, logout, error, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

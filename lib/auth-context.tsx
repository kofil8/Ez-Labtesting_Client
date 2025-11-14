'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, AuthState } from '@/types/user'

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ requiresMFA: boolean }>
  verifyMFA: (code: string) => Promise<boolean>
  signup: (userData: Partial<User> & { password: string }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    // Check for stored auth on mount
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      setAuthState({
        user: JSON.parse(storedUser),
        token: storedToken,
        isAuthenticated: true,
        isLoading: false,
      })
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  const login = async (email: string, password: string): Promise<{ requiresMFA: boolean }> => {
    // Mock login logic
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock user data
    const mockUser: User = {
      id: 'user-1',
      email,
      firstName: 'John',
      lastName: 'Doe',
      role: email.includes('admin') ? 'admin' : 'customer',
      createdAt: new Date().toISOString(),
      mfaEnabled: email.includes('mfa'),
    }
    
    const requiresMFA = mockUser.mfaEnabled
    
    if (!requiresMFA) {
      const token = `token-${Date.now()}`
      localStorage.setItem('auth_token', token)
      localStorage.setItem('user', JSON.stringify(mockUser))
      
      setAuthState({
        user: mockUser,
        token,
        isAuthenticated: true,
        isLoading: false,
      })
    } else {
      // Store temporary user data for MFA verification
      sessionStorage.setItem('temp_user', JSON.stringify(mockUser))
    }
    
    return { requiresMFA }
  }

  const verifyMFA = async (code: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock MFA verification (accept any 6-digit code)
    if (code.length === 6) {
      const tempUser = sessionStorage.getItem('temp_user')
      if (tempUser) {
        const user = JSON.parse(tempUser)
        const token = `token-${Date.now()}`
        
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user', JSON.stringify(user))
        sessionStorage.removeItem('temp_user')
        
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        })
        
        return true
      }
    }
    
    return false
  }

  const signup = async (userData: Partial<User> & { password: string }): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: userData.email!,
      firstName: userData.firstName!,
      lastName: userData.lastName!,
      phone: userData.phone,
      role: 'customer',
      createdAt: new Date().toISOString(),
      mfaEnabled: false,
    }
    
    const token = `token-${Date.now()}`
    localStorage.setItem('auth_token', token)
    localStorage.setItem('user', JSON.stringify(newUser))
    
    setAuthState({
      user: newUser,
      token,
      isAuthenticated: true,
      isLoading: false,
    })
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('temp_user')
    
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }

  return (
    <AuthContext.Provider value={{ ...authState, login, verifyMFA, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}


export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  dateOfBirth?: string
  role: 'customer' | 'admin'
  createdAt: string
  mfaEnabled: boolean
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}


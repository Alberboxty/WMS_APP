import { createContext } from 'react'
import type { AuthUser } from '@/types/auth.types'

export interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  obtenerPerfil: () => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
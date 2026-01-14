import type { User } from '@/lib/types/database'

/**
 * Contexto de autenticação armazenado por request
 */
export interface AuthContext {
  user: User | null
  timestamp: number
}

/**
 * Resultado de verificação de autenticação
 */
export interface AuthResult {
  user: User | null
  isAuthenticated: boolean
  isSuperAdmin: boolean
  isActive: boolean
}

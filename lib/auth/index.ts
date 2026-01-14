/**
 * Auth Module - Refatorado
 * 
 * Este módulo centraliza toda a lógica de autenticação e autorização.
 * 
 * Arquitetura:
 * - context.ts: Request-scoped cache usando AsyncLocalStorage
 * - helpers.ts: Funções principais (getCurrentUser, requireAuth, etc)
 * - types.ts: Tipos TypeScript
 * 
 * Uso:
 * ```ts
 * import { getCurrentUser, requireAuth, requireSuperAdmin } from '@/lib/auth'
 * ```
 */

export { getCurrentUser, requireAuth, requireSuperAdmin, isSuperAdmin, requireRole } from './helpers'
export { getAuthContext, setAuthContext, runWithAuthContext, clearAuthContext } from './context'
export type { AuthContext, AuthResult } from './types'

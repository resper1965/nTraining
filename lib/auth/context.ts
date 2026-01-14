import { AsyncLocalStorage } from 'async_hooks'
import type { AuthContext } from './types'

/**
 * AsyncLocalStorage para armazenar contexto de autenticação por request
 * 
 * Isso permite que múltiplas chamadas getCurrentUser() no mesmo request
 * compartilhem o mesmo resultado, evitando queries duplicadas.
 */
const authContextStorage = new AsyncLocalStorage<AuthContext>()

/**
 * Obtém o contexto de autenticação atual do request
 * 
 * @returns Contexto de autenticação ou undefined se não houver contexto
 */
export function getAuthContext(): AuthContext | undefined {
  return authContextStorage.getStore()
}

/**
 * Define o contexto de autenticação para o request atual
 * 
 * @param context Contexto de autenticação a ser definido
 */
export function setAuthContext(context: AuthContext): void {
  authContextStorage.enterWith(context)
}

/**
 * Executa uma função com um contexto de autenticação específico
 * 
 * @param context Contexto de autenticação
 * @param fn Função a ser executada com o contexto
 * @returns Resultado da função
 */
export async function runWithAuthContext<T>(
  context: AuthContext,
  fn: () => Promise<T>
): Promise<T> {
  return authContextStorage.run(context, fn)
}

/**
 * Limpa o contexto de autenticação (útil para testes)
 */
export function clearAuthContext(): void {
  // AsyncLocalStorage não tem método clear, então definimos um contexto vazio
  setAuthContext({ user: null, timestamp: Date.now() })
}

// ============================================================================
// Supabase Mock Helper
// ============================================================================
// Mock robusto do Supabase que suporta encadeamento profundo de métodos
// ============================================================================

import { vi } from 'vitest'

// ============================================================================
// Create Chainable Mock
// ============================================================================

/**
 * Cria um mock encadeável do Supabase Query Builder
 * Cada método retorna o mesmo objeto, permitindo encadeamento infinito
 */
export function createSupabaseQueryMock(data: any = null, error: any = null) {
  const mockQuery = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    like: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    contains: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data, error }),
    maybeSingle: vi.fn().mockResolvedValue({ data, error }),
    then: vi.fn((onResolve) => {
      return Promise.resolve({ data, error }).then(onResolve)
    }),
  }

  return mockQuery
}

// ============================================================================
// Create Supabase Client Mock
// ============================================================================

/**
 * Cria um mock completo do Supabase Client
 */
export function createSupabaseClientMock() {
  const defaultQuery = createSupabaseQueryMock()

  const mockClient = {
    from: vi.fn().mockReturnValue(defaultQuery),
    rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
    storage: {
      from: vi.fn().mockReturnValue({
        upload: vi.fn().mockResolvedValue({ data: null, error: null }),
        download: vi.fn().mockResolvedValue({ data: null, error: null }),
        getPublicUrl: vi.fn().mockReturnValue({
          data: { publicUrl: 'https://example.com/file.pdf' },
        }),
        remove: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    },
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signInWithPassword: vi.fn().mockResolvedValue({
        data: { user: null, session: null },
        error: null,
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      signUp: vi.fn().mockResolvedValue({
        data: { user: null, session: null },
        error: null,
      }),
    },
  }

  return mockClient
}

// ============================================================================
// Vitest Setup - Global Mocks
// ============================================================================
// Configuração global para mocks de Supabase, OpenAI e Next.js
// ============================================================================

import '@testing-library/jest-dom'
import { vi } from 'vitest'

// ============================================================================
// Mock Next.js Navigation
// ============================================================================

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`)
  }),
}))

// ============================================================================
// Mock Next.js Headers/Cookies
// ============================================================================

vi.mock('next/headers', () => ({
  cookies: () => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
    has: vi.fn(),
    getAll: vi.fn(() => []),
  }),
  headers: () => ({
    get: vi.fn(),
    set: vi.fn(),
    has: vi.fn(),
    getAll: vi.fn(() => []),
  }),
}))

// ============================================================================
// Mock Supabase Client
// ============================================================================

const mockSupabaseClient = {
  from: vi.fn(() => mockSupabaseClient),
  select: vi.fn(() => mockSupabaseClient),
  insert: vi.fn(() => mockSupabaseClient),
  update: vi.fn(() => mockSupabaseClient),
  delete: vi.fn(() => mockSupabaseClient),
  eq: vi.fn(() => mockSupabaseClient),
  neq: vi.fn(() => mockSupabaseClient),
  gt: vi.fn(() => mockSupabaseClient),
  gte: vi.fn(() => mockSupabaseClient),
  lt: vi.fn(() => mockSupabaseClient),
  lte: vi.fn(() => mockSupabaseClient),
  like: vi.fn(() => mockSupabaseClient),
  ilike: vi.fn(() => mockSupabaseClient),
  is: vi.fn(() => mockSupabaseClient),
  in: vi.fn(() => mockSupabaseClient),
  contains: vi.fn(() => mockSupabaseClient),
  order: vi.fn(() => mockSupabaseClient),
  limit: vi.fn(() => mockSupabaseClient),
  range: vi.fn(() => mockSupabaseClient),
  single: vi.fn(() => Promise.resolve({ data: null, error: null })),
  maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
  then: vi.fn((onResolve) => {
    const result = { data: null, error: null }
    return Promise.resolve(result).then(onResolve)
  }),
  rpc: vi.fn(() => Promise.resolve({ data: null, error: null })),
  storage: {
    from: vi.fn(() => ({
      upload: vi.fn(() => Promise.resolve({ data: null, error: null })),
      download: vi.fn(() => Promise.resolve({ data: null, error: null })),
      getPublicUrl: vi.fn(() => ({
        data: { publicUrl: 'https://example.com/file.pdf' },
      })),
      remove: vi.fn(() => Promise.resolve({ data: null, error: null })),
    })),
  },
  auth: {
    getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
    signInWithPassword: vi.fn(() =>
      Promise.resolve({ data: { user: null, session: null }, error: null })
    ),
    signOut: vi.fn(() => Promise.resolve({ error: null })),
    signUp: vi.fn(() =>
      Promise.resolve({ data: { user: null, session: null }, error: null })
    ),
  },
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => mockSupabaseClient),
  getCurrentUser: vi.fn(() => Promise.resolve(null)),
  requireAuth: vi.fn(() => Promise.reject(new Error('Not authenticated'))),
  requireSuperAdmin: vi.fn(() => Promise.reject(new Error('Not authorized'))),
}))

// ============================================================================
// Mock OpenAI/Helicone Client
// ============================================================================

const mockOpenAI = {
  embeddings: {
    create: vi.fn(() =>
      Promise.resolve({
        data: [
          {
            embedding: new Array(1536).fill(0).map(() => Math.random()),
            index: 0,
          },
        ],
      })
    ),
  },
  chat: {
    completions: {
      create: vi.fn(() =>
        Promise.resolve({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  title: 'Test Course',
                  description: 'Test Description',
                  modules: [],
                }),
              },
            },
          ],
        })
      ),
    },
  },
}

vi.mock('openai', () => ({
  default: vi.fn(() => mockOpenAI),
}))

vi.mock('@/lib/services/ai-client', () => ({
  generateEmbedding: vi.fn(() => Promise.resolve(new Array(1536).fill(0.5))),
  generateEmbeddingsBatch: vi.fn((texts: string[]) =>
    Promise.resolve(texts.map(() => new Array(1536).fill(0.5)))
  ),
  chat: vi.fn(() =>
    Promise.resolve(
      JSON.stringify({
        title: 'Test Course',
        description: 'Test Description',
        objectives: ['Objective 1'],
        level: 'beginner',
        estimatedDurationHours: 10,
        modules: [],
      })
    )
  ),
  chatWithStructuredOutput: vi.fn((messages, schema) =>
    Promise.resolve({
      title: 'Test Course',
      description: 'Test Description',
      objectives: ['Objective 1'],
      level: 'beginner',
      estimatedDurationHours: 10,
      modules: [],
    })
  ),
}))

// ============================================================================
// Mock PDF Parse
// ============================================================================

vi.mock('pdf-parse', () => ({
  default: vi.fn(() =>
    Promise.resolve({
      text: 'Sample PDF text content',
      numPages: 1,
      info: {},
      metadata: {},
    })
  ),
}))

// ============================================================================
// Export Mock Objects for Use in Tests
// ============================================================================

export { mockSupabaseClient, mockOpenAI }

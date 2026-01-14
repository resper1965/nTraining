# 🔧 Implementação Detalhada da Refatoração

## Arquitetura Proposta

```
┌─────────────────────────────────────────────────────────┐
│                    MIDDLEWARE                           │
│  - Apenas verifica supabase.auth.getUser()             │
│  - Redireciona para /auth/login se não autenticado     │
│  - NÃO faz queries na tabela users                     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              LAYOUTS (Guards)                          │
│  - Admin Layout: verifica superadmin                   │
│  - Main Layout: verifica auth básica                   │
│  - Usam getCurrentUser() com cache                     │
│  - Redirecionam se necessário                           │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│           AUTH CONTEXT (Request-Scoped)                │
│  - AsyncLocalStorage para cache por request             │
│  - getCurrentUser() faz 1 query e cacheia               │
│  - Todas as chamadas subsequentes usam cache            │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              PAGES & ACTIONS                            │
│  - Usam getCurrentUser() ou requireAuth()               │
│  - Sempre usam cache (nunca query duplicada)            │
└─────────────────────────────────────────────────────────┘
```

## Implementação Passo a Passo

### 1. Criar Auth Context (Request-Scoped)

```typescript
// lib/auth/context.ts
import { AsyncLocalStorage } from 'async_hooks'
import type { User } from '@/lib/types/database'

interface AuthContext {
  user: User | null
  timestamp: number
}

const authContextStorage = new AsyncLocalStorage<AuthContext>()

export function getAuthContext(): AuthContext | undefined {
  return authContextStorage.getStore()
}

export function setAuthContext(context: AuthContext): void {
  authContextStorage.enterWith(context)
}

export async function runWithAuthContext<T>(
  context: AuthContext,
  fn: () => Promise<T>
): Promise<T> {
  return authContextStorage.run(context, fn)
}
```

### 2. Refatorar getCurrentUser() com Cache Request-Scoped

```typescript
// lib/auth/helpers.ts
import { createClient } from '@/lib/supabase/server'
import { getAuthContext, setAuthContext } from './context'
import type { User } from '@/lib/types/database'

export async function getCurrentUser(): Promise<User | null> {
  // Verificar cache do contexto primeiro
  const context = getAuthContext()
  if (context?.user) {
    return context.user
  }

  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    setAuthContext({ user: null, timestamp: Date.now() })
    return null
  }

  // Query única na tabela users
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (userError || !userData) {
    setAuthContext({ user: null, timestamp: Date.now() })
    return null
  }

  const fullUser = userData as User
  setAuthContext({ user: fullUser, timestamp: Date.now() })
  return fullUser
}
```

### 3. Middleware Simplificado

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get: (name) => request.cookies.get(name)?.value,
      set: (name, value, options) => {
        request.cookies.set({ name, value, ...options })
      },
      remove: (name, options) => {
        request.cookies.set({ name, value: '', ...options })
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()

  // Protected routes
  const protectedPaths = ['/dashboard', '/courses', '/admin', '/profile', '/search', '/certificates', '/notifications']
  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))

  // Auth routes
  const authPaths = ['/auth/login', '/auth/signup']
  const isAuthPath = authPaths.some(path => request.nextUrl.pathname.startsWith(path))

  // Redirect to login if accessing protected route without auth
  if (isProtectedPath && !user) {
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect away from auth pages if logged in
  if (isAuthPath && user) {
    // Deixar layout decidir para onde redirecionar
    return NextResponse.next()
  }

  return NextResponse.next()
}
```

### 4. Layout Admin Refatorado

```typescript
// app/admin/layout.tsx
import { getCurrentUser } from '@/lib/auth/helpers'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export const revalidate = 30

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/login')
  }

  if (!user.is_superadmin) {
    redirect('/unauthorized')
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        {/* Header e conteúdo */}
        {children}
      </div>
    </div>
  )
}
```

### 5. Layout Main Refatorado

```typescript
// app/(main)/layout.tsx
import { getCurrentUser } from '@/lib/auth/helpers'
import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/header'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Verificar is_active
  if (!user.is_active && !user.is_superadmin) {
    redirect('/auth/waiting-room')
  }

  // Superadmin não deve estar em rotas main
  if (user.is_superadmin && !request.nextUrl.pathname.startsWith('/admin')) {
    redirect('/admin')
  }

  return (
    <>
      <Header />
      {children}
    </>
  )
}
```

## Vantagens desta Abordagem

1. **Single Query**: `getCurrentUser()` faz apenas 1 query por request
2. **Cache Eficiente**: AsyncLocalStorage garante cache request-scoped
3. **Middleware Simples**: Apenas verifica auth básica
4. **Lógica Centralizada**: Toda lógica de auth nos layouts
5. **Sem Loops**: Não há múltiplas verificações causando loops
6. **Fácil Debug**: Cada camada tem responsabilidade clara

## Migração Gradual

1. Criar novos arquivos sem quebrar código existente
2. Atualizar middleware gradualmente
3. Atualizar layouts um por um
4. Atualizar server actions gradualmente
5. Remover código antigo

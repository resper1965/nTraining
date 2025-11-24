# Remoção de Autenticação - Sistema de Convites

## Mudanças Realizadas

### ✅ Removido
- Páginas de autenticação (`/auth/login`, `/auth/signup`, `/auth/forgot-password`)
- Middleware de autenticação (simplificado)
- Dependência de Supabase Auth para identificação de usuários

### ✅ Novo Sistema
- Usuários identificados diretamente do banco de dados
- Identificação via cookie `user_id` ou query param `userId`
- Funções helper atualizadas:
  - `getCurrentUser()` - busca usuário do cookie
  - `getUserById(userId)` - busca usuário por ID
  - `requireUser(userId?)` - retorna usuário ou null
  - `requireRole(role, userId?)` - verifica role, retorna null se não tiver

### ⚠️ Arquivos que ainda precisam ser atualizados

1. `app/actions/courses.ts` - substituir `requireAuth()` por `getCurrentUser()`
2. `app/actions/progress.ts` - substituir `requireAuth()` por `getCurrentUser()`
3. `app/courses/[slug]/page.tsx` - remover `requireAuth()`
4. `app/courses/[slug]/[moduleId]/[lessonId]/page.tsx` - remover `requireAuth()`
5. `app/admin/users/page.tsx` - atualizar `requireRole()`
6. `app/admin/courses/page.tsx` - atualizar `requireRole()`
7. `app/admin/courses/new/page.tsx` - atualizar `requireRole()`
8. `app/admin/courses/[id]/edit/page.tsx` - atualizar `requireRole()`

### 📝 Como usar

**Identificar usuário em páginas:**
```typescript
import { getCurrentUser, getUserById } from '@/lib/supabase/server'

// Via cookie
const user = await getCurrentUser()

// Via query param
const user = searchParams.userId ? await getUserById(searchParams.userId) : null
```

**Verificar role:**
```typescript
import { requireRole } from '@/lib/supabase/server'

const admin = await requireRole('platform_admin', userId)
if (!admin) {
  // Não tem permissão
}
```


# Análise do Fluxo de Erro - Dashboard Admin

## Rotina Central do Erro

### Fluxo Completo:

```
1. REQUEST → /admin
   ↓
2. MIDDLEWARE (middleware.ts:4)
   - Verifica autenticação básica (supabase.auth.getUser)
   - Se está em /admin, PULA query do users table (linha 103-105)
   - Deixa o layout verificar
   ↓
3. LAYOUT ADMIN (app/admin/layout.tsx:18)
   - Chama requireSuperAdmin()
   ↓
4. requireSuperAdmin() (lib/supabase/server.ts:120)
   - Chama requireAuth()
   ↓
5. requireAuth() (lib/supabase/server.ts:95)
   - Chama getCurrentUser()
   ↓
6. getCurrentUser() (lib/supabase/server.ts:44) ⚠️ ROTINA CENTRAL
   - Query 1: supabase.auth.getUser() (linha 48)
   - Query 2: supabase.from('users').select('*').eq('id', user.id).single() (linha 55-59)
   ↓
7. Se getCurrentUser() retorna null ou falha:
   - requireAuth() faz redirect('/auth/login') (linha 101)
   - Isso lança NEXT_REDIRECT exception
   ↓
8. PÁGINA ADMIN (app/admin/page.tsx:31)
   - Chama getDashboardMetrics() e getRecentActivities()
   - Essas funções NÃO verificam auth (removido para evitar loops)
   - Mas podem falhar se houver problema de conexão
```

## Problema Identificado

### A Rotina Central é: `getCurrentUser()` (lib/supabase/server.ts:44-70)

**Por quê?**
1. É chamada múltiplas vezes:
   - No middleware (quando não está em /admin)
   - No layout admin via `requireSuperAdmin()`
   - Potencialmente em outros lugares

2. Faz 2 queries sequenciais:
   - `supabase.auth.getUser()` - pode falhar se sessão expirou
   - `supabase.from('users').select('*')` - pode falhar se:
     - Tabela users não existe
     - Usuário não existe na tabela users
     - Permissões RLS bloqueiam acesso
     - Timeout de conexão

3. Se falhar silenciosamente (retorna null):
   - `requireAuth()` faz redirect
   - Redirect lança NEXT_REDIRECT
   - Isso pode causar loop se não for tratado corretamente

## Pontos de Falha

1. **getCurrentUser() linha 55-59**: Query do users table pode falhar
2. **requireAuth() linha 101**: Redirect pode causar loop se middleware também redireciona
3. **Middleware linha 103-105**: Pula verificação mas layout ainda verifica - pode causar race condition

## Solução Recomendada

1. Adicionar cache para getCurrentUser() para evitar múltiplas queries
2. Melhorar tratamento de erro em getCurrentUser() para logar detalhes
3. Sincronizar middleware e layout para não fazer queries duplicadas

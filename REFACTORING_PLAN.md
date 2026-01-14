# 🎯 Plano de Refatoração Completa - Sistema de Autenticação

## 📊 Análise dos Problemas Fundamentais

### 1. **Arquitetura de Autenticação Fragmentada**
- ❌ Middleware faz queries e redirects
- ❌ Layouts fazem queries e redirects  
- ❌ Páginas fazem queries e redirects
- ❌ Server Actions fazem queries
- **Resultado**: Queries duplicadas, loops de redirect, "piscar" na UI

### 2. **Falta de Single Source of Truth**
- ❌ `getCurrentUser()` chamado em 200+ lugares
- ❌ Cada chamada faz 2 queries (auth.getUser + users.select)
- ❌ Cache por request não funciona entre middleware e server components
- **Resultado**: Performance ruim, loops, inconsistências

### 3. **Middleware Sobrecarregado**
- ❌ 300+ linhas de lógica complexa
- ❌ Múltiplas queries condicionais
- ❌ Timeouts e workarounds
- ❌ Lógica de redirect espalhada
- **Resultado**: Difícil de manter, bugs frequentes

### 4. **RLS Policies Problemáticas**
- ❌ Recursão infinita (mesmo após correções)
- ❌ Políticas conflitantes de diferentes migrations
- ❌ Funções helper podem não estar sendo usadas corretamente
- **Resultado**: Erros de acesso, queries falhando

## 🎯 Solução: Arquitetura em Camadas

### Camada 1: Auth Context (Request-Scoped)
```
lib/auth/context.ts
- Single source of truth para dados do usuário
- Cache compartilhado entre middleware e server components
- Usa AsyncLocalStorage para request-scoped cache
```

### Camada 2: Middleware Simplificado
```
middleware.ts
- Apenas verifica auth básica (supabase.auth.getUser)
- Redireciona para login se não autenticado
- Passa dados do usuário via headers (se disponível)
- NÃO faz queries na tabela users
```

### Camada 3: Auth Helpers (Server Components)
```
lib/auth/helpers.ts
- getCurrentUser() - com cache request-scoped
- requireAuth() - usa getCurrentUser
- requireSuperAdmin() - usa getCurrentUser
- requireRole() - usa getCurrentUser
```

### Camada 4: Layout Guards
```
app/(main)/layout.tsx
app/admin/layout.tsx
- Usam helpers para verificar auth
- Redirecionam se necessário
- Passam dados do usuário via props/context
```

### Camada 5: Server Actions
```
app/actions/*.ts
- Usam helpers para verificar auth
- Não fazem queries duplicadas
```

## 📋 Plano de Implementação

### Fase 1: Criar Auth Context (Request-Scoped)
- [ ] Criar `lib/auth/context.ts` com AsyncLocalStorage
- [ ] Implementar cache request-scoped
- [ ] Criar função `getAuthContext()`

### Fase 2: Refatorar getCurrentUser()
- [ ] Mover para `lib/auth/helpers.ts`
- [ ] Usar Auth Context para cache
- [ ] Remover cache global (requestCache Map)
- [ ] Garantir que só faz 1 query por request

### Fase 3: Simplificar Middleware
- [ ] Remover todas as queries da tabela users
- [ ] Apenas verificar `supabase.auth.getUser()`
- [ ] Redirecionar para login se não autenticado
- [ ] Passar user.id via header (opcional)
- [ ] Remover toda lógica de is_active/is_superadmin

### Fase 4: Mover Lógica para Layouts
- [ ] Layout admin verifica superadmin
- [ ] Layout main verifica auth básica
- [ ] Redirecionamentos feitos nos layouts
- [ ] Passar dados do usuário via props

### Fase 5: Atualizar Server Actions
- [ ] Todas usam helpers do Auth Context
- [ ] Remover queries duplicadas
- [ ] Garantir que usam cache

### Fase 6: Corrigir RLS Policies
- [ ] Aplicar migração final
- [ ] Verificar que funções helper estão corretas
- [ ] Testar todas as queries

## 🔧 Estrutura de Arquivos Proposta

```
lib/
  auth/
    context.ts          # Request-scoped cache usando AsyncLocalStorage
    helpers.ts          # getCurrentUser, requireAuth, requireSuperAdmin
    types.ts            # Tipos TypeScript
  supabase/
    server.ts           # Apenas createClient (sem auth logic)
    migrations/         # Migrations SQL
middleware.ts           # Simplificado (apenas auth básica)
app/
  (main)/
    layout.tsx          # Verifica auth, redireciona se necessário
  admin/
    layout.tsx           # Verifica superadmin, redireciona se necessário
```

## ✅ Benefícios Esperados

1. **Performance**: 1 query por request (não 2-5)
2. **Confiabilidade**: Sem loops de redirect
3. **Manutenibilidade**: Código organizado em camadas
4. **Debugging**: Fácil rastrear problemas
5. **Testabilidade**: Cada camada pode ser testada isoladamente

## 🚨 Pontos de Atenção

1. **AsyncLocalStorage**: Pode não funcionar em edge runtime
   - Solução: Usar headers ou cookies para passar dados
   
2. **Cache invalidation**: Quando atualizar dados do usuário
   - Solução: Invalidar cache após updates
   
3. **RLS Policies**: Garantir que não há recursão
   - Solução: Usar apenas funções SECURITY DEFINER

## 📝 Próximos Passos

1. Criar estrutura de arquivos
2. Implementar Auth Context
3. Refatorar getCurrentUser
4. Simplificar middleware
5. Atualizar layouts
6. Testar tudo
7. Aplicar em produção

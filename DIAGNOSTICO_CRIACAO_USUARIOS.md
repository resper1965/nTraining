# 🔍 Diagnóstico: Supabase Não Permite Criar Novos Usuários

## ⚠️ Problema
O Supabase não está permitindo criar novos usuários, mesmo usando service role ou via painel admin.

## 🔍 Possíveis Causas

### 1. Política RLS Bloqueando INSERT

A política RLS para INSERT pode estar muito restritiva ou conflitante.

**Verificar políticas atuais:**
```sql
-- Listar todas as políticas da tabela users
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'users';
```

### 2. Políticas Conflitantes

Pode haver múltiplas políticas de INSERT que estão conflitando.

**Solução:**
```sql
-- Remover todas as políticas de INSERT
DROP POLICY IF EXISTS "Service role can insert users" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Allow user insert" ON users;

-- Criar política permissiva única
CREATE POLICY "Allow user insert"
  ON users FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role' OR
    id = auth.uid() OR
    auth.uid() IS NULL
  );
```

### 3. RLS Habilitado Sem Política Adequada

Se RLS está habilitado mas não há política que permita INSERT, todas as inserções serão bloqueadas.

**Verificar se RLS está habilitado:**
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'users';
```

**Se `rowsecurity = true` mas não há política de INSERT, criar uma:**
```sql
-- Ver migração: lib/supabase/migrations/013_fix_users_insert_policy.sql
```

### 4. Constraint ou Trigger Falhando

Pode haver um constraint ou trigger que está falhando silenciosamente.

**Verificar constraints:**
```sql
SELECT 
  conname AS constraint_name,
  contype AS constraint_type,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'users'::regclass;
```

**Verificar triggers:**
```sql
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users';
```

### 5. Foreign Key Constraint

A tabela `users` tem foreign key para `auth.users(id)`. Se o usuário não existe em `auth.users` primeiro, a inserção falhará.

**Ordem correta:**
1. Criar em `auth.users` primeiro (via Supabase Auth)
2. Depois criar em `users` com o mesmo ID

## 🚀 Solução Rápida

### Aplicar Migração de Correção

1. **Acesse o Supabase SQL Editor:**
   - https://supabase.com/dashboard/project/qaekhnagfzpwprvaxqwt/sql/new

2. **Execute a migração:**
   - Abra: `lib/supabase/migrations/013_fix_users_insert_policy.sql`
   - Copie e cole no SQL Editor
   - Execute

### Ou Execute Este SQL Direto:

```sql
-- Remover políticas de INSERT problemáticas
DROP POLICY IF EXISTS "Service role can insert users" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Allow user insert" ON users;

-- Criar política permissiva
CREATE POLICY "Allow user insert"
  ON users FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role' OR
    id = auth.uid() OR
    auth.uid() IS NULL
  );
```

## 🔍 Verificação

Após aplicar a correção, teste criando um usuário:

```sql
-- Teste de inserção (requer service role)
-- Isso deve funcionar após aplicar a correção
INSERT INTO users (id, email, full_name, role, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'teste@example.com',
  'Usuário Teste',
  'student',
  true
);
```

**Se funcionar:** A política está correta
**Se não funcionar:** Verifique se está usando service role ou se há outros problemas

## 📋 Checklist de Diagnóstico

- [ ] Verificou políticas RLS da tabela users
- [ ] Verificou se há múltiplas políticas de INSERT conflitantes
- [ ] Verificou se RLS está habilitado
- [ ] Verificou constraints e triggers
- [ ] Verificou se usuário existe em auth.users antes de criar em users
- [ ] Aplicou migração de correção
- [ ] Testou criação de usuário

## 🆘 Se Ainda Não Funcionar

1. **Desabilitar RLS temporariamente (apenas para teste):**
```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

2. **Testar criação:**
   - Tente criar um usuário via `/admin/users/new`
   - Se funcionar, o problema é RLS
   - Se não funcionar, o problema é outro (constraint, trigger, etc.)

3. **Reabilitar RLS e aplicar política correta:**
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- Aplicar política correta (ver migração 013)
```

---

**Recomendação:** Execute a migração `013_fix_users_insert_policy.sql` primeiro! 🚀

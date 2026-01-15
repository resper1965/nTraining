# 🔄 Como Apagar e Recriar Conta de Usuário

## ⚠️ Importante

Ao apagar e recriar uma conta, você precisa:
1. Deletar do Supabase Auth (`auth.users`)
2. Deletar da tabela `users`
3. Recriar a conta
4. Definir como superadmin (se necessário)

## 🗑️ Passo 1: Apagar Conta Existente

### Via SQL no Supabase

1. **Acesse o Supabase SQL Editor:**
   - https://supabase.com/dashboard/project/qaekhnagfzpwprvaxqwt/sql/new

2. **Primeiro, encontre o ID do usuário:**

```sql
-- Buscar usuário por email
SELECT id, email, full_name, is_superadmin
FROM users
WHERE email = 'resper@ness.com.br';
```

3. **Anote o ID** (ex: `d53930be-453c-425c-b11b-a295451e9d78`)

4. **Deletar da tabela users:**

```sql
-- Deletar da tabela users
DELETE FROM users
WHERE email = 'resper@ness.com.br';
```

5. **Deletar do Supabase Auth:**

```sql
-- Deletar do auth.users (requer service role)
-- NOTA: Isso só funciona via Supabase Dashboard Admin ou API
-- Vá em: Authentication → Users → Encontre o usuário → Delete
```

**Ou via Dashboard:**
- Acesse: https://supabase.com/dashboard/project/qaekhnagfzpwprvaxqwt/auth/users
- Busque pelo email `resper@ness.com.br`
- Clique em "..." → "Delete user"

## ➕ Passo 2: Recriar a Conta

### Opção 1: Via Painel Admin (Recomendado)

1. **Acesse:** https://n-training.vercel.app/admin/users/new
2. **Preencha:**
   - Email: `resper@ness.com.br`
   - Nome: Seu nome completo
   - Senha: (escolha uma senha forte)
   - Papel: `platform_admin` ou `student`
   - Organização: Selecione ou deixe "Nenhuma"
   - **Superadmin**: Marque a opção (se disponível)

3. **Clique em "Criar Usuário"**

### Opção 2: Via Signup Público

1. **Acesse:** https://n-training.vercel.app/auth/signup
2. **Preencha o formulário**
3. **Aguarde aprovação** (será criado com `is_active = false`)
4. **Aprove no painel admin:** `/admin/users/pending`

### Opção 3: Via SQL (Avançado)

**⚠️ ATENÇÃO:** Isso cria apenas o registro na tabela `users`, mas NÃO cria no `auth.users`. Você ainda precisará criar no Supabase Auth.

```sql
-- Isso NÃO funciona sozinho - precisa criar no auth.users primeiro
-- Use uma das opções acima
```

## 🔧 Passo 3: Definir como Superadmin (Se Necessário)

Após recriar a conta, se não for superadmin automaticamente:

### Via SQL:

```sql
-- Definir como superadmin
UPDATE users 
SET is_superadmin = TRUE 
WHERE email = 'resper@ness.com.br';

-- Verificar
SELECT id, email, full_name, is_superadmin, is_active
FROM users
WHERE email = 'resper@ness.com.br';
```

### Via Script:

```bash
npx tsx scripts/set-superadmin.ts resper@ness.com.br
```

## ✅ Verificação Final

Execute esta query para verificar tudo:

```sql
SELECT 
  id,
  email,
  full_name,
  role,
  is_superadmin,
  is_active,
  organization_id,
  created_at
FROM users
WHERE email = 'resper@ness.com.br';
```

**Resultado esperado:**
- `is_superadmin = true` ✅
- `is_active = true` ✅
- Email correto ✅

## 🔄 Processo Completo (Tudo de Uma Vez)

Se preferir fazer tudo via SQL (requer acesso ao Supabase Dashboard Admin):

```sql
-- 1. Deletar da tabela users
DELETE FROM users WHERE email = 'resper@ness.com.br';

-- 2. Deletar do auth.users (via Dashboard: Authentication → Users → Delete)

-- 3. Após recriar via /admin/users/new ou signup:

-- 4. Definir como superadmin
UPDATE users 
SET is_superadmin = TRUE 
WHERE email = 'resper@ness.com.br';

-- 5. Verificar
SELECT id, email, is_superadmin, is_active
FROM users
WHERE email = 'resper@ness.com.br';
```

## 📝 Checklist

- [ ] Usuário deletado da tabela `users`
- [ ] Usuário deletado do `auth.users` (via Dashboard)
- [ ] Conta recriada (via admin ou signup)
- [ ] Definido como superadmin (se necessário)
- [ ] Verificado que `is_superadmin = true`
- [ ] Verificado que `is_active = true`
- [ ] Testado login com nova senha

---

**Recomendação:** Use a **Opção 1 (Via Painel Admin)** para recriar, pois cria tudo automaticamente! 🚀

# 🔍 Como Verificar se um Usuário é Superadmin

## ⚠️ Importante: Email vs UID

**No código da aplicação:**
- A verificação é feita pelo **UID (User ID)** - o UUID do Supabase Auth
- O sistema busca o usuário na tabela `users` usando `.eq('id', user.id)`
- O campo `is_superadmin` está na tabela `users` e é verificado pelo ID

**Para verificação manual:**
- Você pode usar **email** OU **ID** - ambos funcionam
- Email é mais fácil de lembrar
- ID é mais preciso (único e imutável)

## Método 1: Via SQL no Supabase (Mais Rápido)

1. **Acesse o Supabase SQL Editor:**
   - Acesse: https://supabase.com/dashboard/project/qaekhnagfzpwprvaxqwt/sql/new
   - Ou vá em: **SQL Editor** → **New Query**

2. **Execute esta query (por email):**

```sql
SELECT 
  id,
  email,
  full_name,
  role,
  is_superadmin,
  is_active,
  created_at
FROM users
WHERE email = 'resper@ness.com.br';
```

**Ou por ID (se você souber o UUID):**

```sql
SELECT 
  id,
  email,
  full_name,
  role,
  is_superadmin,
  is_active,
  created_at
FROM users
WHERE id = 'd53930be-453c-425c-b11b-a295451e9d78';
```

3. **Verifique o resultado:**
   - Se `is_superadmin = true` → ✅ É superadmin
   - Se `is_superadmin = false` ou `NULL` → ❌ Não é superadmin

## Método 2: Via Supabase Dashboard (Interface Gráfica)

1. **Acesse o Supabase Dashboard:**
   - Acesse: https://supabase.com/dashboard/project/qaekhnagfzpwprvaxqwt
   - Vá em: **Table Editor** → **users**

2. **Busque pelo email:**
   - Use o filtro de busca
   - Digite: `resper@ness.com.br`
   - Verifique a coluna `is_superadmin`

## Método 3: Via Script TypeScript (Requer Variáveis de Ambiente)

**Pré-requisito:** Configure as variáveis de ambiente no `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://qaekhnagfzpwprvaxqwt.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

**Execute o script:**

```bash
npx tsx scripts/check-superadmin.ts resper@ness.com.br
```

## Método 4: Definir como Superadmin (Se Não For)

Se o usuário **NÃO** for superadmin e você quiser torná-lo superadmin:

### Via SQL (por email):

```sql
-- Definir como superadmin
UPDATE users 
SET is_superadmin = TRUE 
WHERE email = 'resper@ness.com.br';

-- Verificar se foi atualizado
SELECT 
  id,
  email,
  full_name,
  role,
  is_superadmin,
  is_active
FROM users
WHERE email = 'resper@ness.com.br';
```

### Via SQL (por ID):

```sql
-- Definir como superadmin
UPDATE users 
SET is_superadmin = TRUE 
WHERE id = 'd53930be-453c-425c-b11b-a295451e9d78';

-- Verificar se foi atualizado
SELECT 
  id,
  email,
  full_name,
  role,
  is_superadmin,
  is_active
FROM users
WHERE id = 'd53930be-453c-425c-b11b-a295451e9d78';
```

### Via Script:

```bash
npx tsx scripts/set-superadmin.ts resper@ness.com.br
```

## 📋 Informações Importantes

- **Campo verificado:** `is_superadmin` (BOOLEAN) na tabela `users`
- **Valor esperado:** `true` para ser superadmin
- **Localização:** Tabela `public.users` no Supabase
- **Impacto:** Superadmins têm acesso total ao sistema, incluindo `/admin`

## 🔍 Verificação Completa

Para verificar TUDO sobre o usuário (incluindo auth.users):

```sql
-- Verificar na tabela users
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

-- Verificar em auth.users (requer service role)
-- Isso só funciona via API ou Dashboard Admin
```

## ✅ Resultado Esperado

Se o usuário **É** superadmin, você verá:

```
is_superadmin: true
```

Se o usuário **NÃO É** superadmin, você verá:

```
is_superadmin: false
```

ou

```
is_superadmin: NULL
```

---

**Recomendação:** Use o **Método 1 (SQL)** para verificação rápida e direta! 🚀

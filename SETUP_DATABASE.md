# 🗄️ Setup do Banco de Dados - nTraining

## ⚠️ Erro Encontrado

```
Error: Failed to run sql query: ERROR: 42P01: relation "users" does not exist
```

Isso indica que o schema do banco de dados ainda não foi aplicado no Supabase.

## 📋 Passos para Resolver

### 1. Aplicar o Schema Base

1. **Acesse o Supabase SQL Editor:**
   - Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
   - Selecione seu projeto
   - Navegue até **SQL Editor** no menu lateral

2. **Execute o schema.sql completo:**
   - Abra o arquivo: `lib/supabase/schema.sql`
   - Copie TODO o conteúdo
   - Cole no SQL Editor do Supabase
   - Clique em "Run" ou pressione Ctrl+Enter

⚠️ **IMPORTANTE**: Execute o schema completo de uma vez para evitar erros de dependências.

### 2. Adicionar Coluna is_superadmin

Após aplicar o schema base, execute este SQL para adicionar a coluna `is_superadmin`:

```sql
-- Adicionar coluna is_superadmin se não existir
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_superadmin BOOLEAN DEFAULT FALSE;

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_users_is_superadmin ON users(is_superadmin) WHERE is_superadmin = TRUE;
```

### 3. Definir Usuário como Superadmin

Depois que o usuário `resper@ness.com.br` for criado (via `/admin/users/new` ou diretamente no Supabase Auth), execute:

```sql
-- Definir usuário como superadmin
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

## 🔄 SQL Completo (Tudo de Uma Vez)

Se preferir, você pode executar este SQL completo que:
1. Adiciona a coluna `is_superadmin` (se não existir)
2. Define o usuário como superadmin (se existir)

```sql
-- Adicionar coluna is_superadmin
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_superadmin BOOLEAN DEFAULT FALSE;

-- Criar índice
CREATE INDEX IF NOT EXISTS idx_users_is_superadmin ON users(is_superadmin) WHERE is_superadmin = TRUE;

-- Definir usuário como superadmin (se existir)
UPDATE users 
SET is_superadmin = TRUE 
WHERE email = 'resper@ness.com.br';

-- Verificar resultado
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

## ✅ Checklist

- [ ] Schema base aplicado (`lib/supabase/schema.sql`)
- [ ] Coluna `is_superadmin` adicionada à tabela `users`
- [ ] Usuário `resper@ness.com.br` criado no Supabase Auth
- [ ] Usuário definido como superadmin
- [ ] Verificado que `is_superadmin = TRUE`

## 📝 Notas

- O usuário precisa existir no Supabase Auth (`auth.users`) antes de poder ser definido como superadmin
- Se o usuário não existir, crie primeiro via `/admin/users/new` ou diretamente no Supabase Dashboard
- A coluna `is_superadmin` não está no schema.sql base, precisa ser adicionada manualmente ou via migration

## 🆘 Troubleshooting

### Erro: "relation users does not exist"
**Solução**: Execute o `schema.sql` primeiro

### Erro: "column is_superadmin does not exist"
**Solução**: Execute o ALTER TABLE para adicionar a coluna

### Erro: "0 rows affected" no UPDATE
**Solução**: O usuário não existe. Crie primeiro no Supabase Auth
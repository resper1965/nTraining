# 🔍 Troubleshooting: Login do Usuário Específico

## 📋 Informações do Usuário

- **ID**: `d53930be-453c-425c-b11b-a295451e9d78`
- **Email**: `resper@ness.com.br`
- **Nome**: Ricardo Esper
- **Status**: ✅ Ativo (`is_active: true`)
- **Superadmin**: ✅ Sim (`is_superadmin: true`)

## ✅ Verificações Realizadas

### 1. Tabela `users` ✅
O usuário **existe** na tabela `users` e está ativo.

### 2. Tabela `auth.users` ❓
**PRECISA VERIFICAR**: O usuário pode não existir em `auth.users` do Supabase.

## 🔍 Possíveis Problemas

### Problema 1: Usuário não existe em `auth.users`

**Sintoma**: Erro "Invalid login credentials" ou "User not found"

**Causa**: O usuário foi criado apenas na tabela `users` mas não em `auth.users`.

**Solução**:
1. Acesse o Supabase Dashboard: https://supabase.com/dashboard/project/dcigykpfdehqbtbaxzak/auth/users
2. Verifique se existe um usuário com email `resper@ness.com.br`
3. Se não existir, você precisa:
   - Criar o usuário em `auth.users` via Supabase Dashboard
   - OU usar o script de criação de usuário que sincroniza ambos

### Problema 2: Senha Incorreta

**Sintoma**: Erro "Invalid login credentials"

**Solução**:
1. Verifique se está usando a senha correta
2. Se não lembrar, você pode:
   - Resetar a senha via Supabase Dashboard
   - OU criar uma nova senha para o usuário

### Problema 3: Variáveis de Ambiente

**Sintoma**: Erro genérico ou "Missing Supabase environment variables"

**Solução**:
1. Verifique se as variáveis estão configuradas no Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
2. Faça um redeploy após verificar

## 🛠️ Como Verificar e Corrigir

### Opção 1: Via Supabase Dashboard (Recomendado)

1. **Verificar usuário em auth.users**:
   - Acesse: https://supabase.com/dashboard/project/dcigykpfdehqbtbaxzak/auth/users
   - Procure por `resper@ness.com.br`
   - Se não existir, clique em "Add User" e crie

2. **Resetar senha (se necessário)**:
   - Encontre o usuário
   - Clique nos três pontos (⋯)
   - Selecione "Reset Password"
   - Uma nova senha será gerada

### Opção 2: Criar/Atualizar via SQL

Se você tiver acesso ao Supabase SQL Editor:

```sql
-- Verificar se existe em auth.users
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'resper@ness.com.br';

-- Se não existir, você precisará criar via Supabase Dashboard
-- ou usar a API do Supabase Auth
```

### Opção 3: Usar Script de Criação

Se houver um script de criação de usuário que sincroniza `auth.users` e `users`:
```bash
# Exemplo (ajuste conforme seu script)
npm run create-user -- email=resper@ness.com.br password=suaSenha
```

## 📝 Próximos Passos

1. **Verifique no Supabase Dashboard** se o usuário existe em `auth.users`
2. **Se não existir**, crie o usuário com o mesmo email
3. **Se existir mas não conseguir fazer login**, reset a senha
4. **Teste novamente** o login em produção

## 🔐 Credenciais de Teste

Se precisar criar credenciais de teste:
- Email: `resper@ness.com.br`
- Senha: (defina uma senha segura)

---

**Após verificar e corrigir, o login deve funcionar!** ✅

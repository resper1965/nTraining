# 🔍 Diagnóstico de Problemas de Login

## Problema Atual
Não consegue entrar na aplicação mesmo com credenciais corretas.

## Checklist de Diagnóstico

### 1. Verificar se o usuário existe no Supabase

Execute via MCP ou SQL Editor:

```sql
SELECT id, email, full_name, is_superadmin, is_active, organization_id 
FROM users 
WHERE email = 'resper@ness.com.br';
```

**Esperado:**
- ID: `a36bc46f-c972-4ef8-b91b-842efd4120ef`
- Email: `resper@ness.com.br`
- is_superadmin: `true`
- is_active: `true`

### 2. Verificar se o usuário existe no auth.users

```sql
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'resper@ness.com.br';
```

**Esperado:**
- Email confirmado: `true` (email_confirmed_at não nulo)
- ID deve corresponder ao ID na tabela `users`

### 3. Verificar RLS Policies

```sql
SELECT 
  policyname, 
  cmd, 
  qual 
FROM pg_policies 
WHERE tablename = 'users';
```

**Esperado:**
- Policy "Users can view appropriate users" permite SELECT para:
  - Próprio usuário (id = auth.uid())
  - Superadmins podem ver todos
  - Usuários da mesma organização

### 4. Testar Login Diretamente

Tente fazer login com:
- **Email:** `resper@ness.com.br`
- **Senha:** `Gordinh@29`

**Se falhar, verifique:**
1. Mensagem de erro específica na tela
2. Console do navegador (F12) para erros JavaScript
3. Network tab para ver requisições falhando

### 5. Verificar Variáveis de Ambiente

No Vercel ou `.env.local`, verifique:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://srrbomtdkghjxdhpeyel.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_IF--qr-d2KBPKWlq_-Bs8Q_PG4Rq-9f
SUPABASE_SERVICE_ROLE_KEY=sb_secret_1yvM2jcbLElHL1ATwPcadg_Mb4rGpaQ
```

### 6. Verificar Cookies

Após tentar login, verifique no DevTools (Application > Cookies):
- `sb-srrbomtdkghjxdhpeyel-auth-token` existe?
- `sb-srrbomtdkghjxdhpeyel-auth-token-code-verifier` existe?

**Se não existirem:**
- A sessão não está sendo criada
- Pode ser problema com configuração do Supabase client

### 7. Verificar Logs do Supabase

No Dashboard do Supabase:
- Vá em **Logs** → **Auth Logs**
- Procure por tentativas de login recentes
- Verifique se há erros registrados

## Problemas Comuns e Soluções

### Erro: "Invalid login credentials"
- **Causa:** Senha incorreta ou email não existe no auth.users
- **Solução:** Verificar se o usuário existe no `auth.users` e se a senha está correta

### Erro: "Email not confirmed"
- **Causa:** Email não foi confirmado no Supabase Auth
- **Solução:** Confirmar email manualmente no Dashboard ou criar usuário com `email_confirm: true`

### Erro: "User profile not found"
- **Causa:** Usuário existe no `auth.users` mas não na tabela `users`
- **Solução:** Verificar trigger `handle_new_user()` ou criar registro manualmente

### Erro: "RLS Error" ou "Permission denied"
- **Causa:** RLS bloqueando acesso após login
- **Solução:** Verificar se as funções `is_user_superadmin()` e `get_user_organization_id()` estão funcionando

### Login funciona mas redireciona para /auth/login
- **Causa:** Middleware não está reconhecendo a sessão
- **Solução:** Verificar se cookies estão sendo setados corretamente

## Teste Rápido

1. Abra o console do navegador (F12)
2. Vá para a aba **Network**
3. Tente fazer login
4. Verifique:
   - Requisição para `/auth/login` retorna status 200?
   - Há redirecionamento para `/dashboard`?
   - Se houver erro, qual é a mensagem?

## Próximos Passos

Se ainda não funcionar após seguir este checklist:

1. Compartilhe a mensagem de erro exata
2. Compartilhe logs do console do navegador
3. Compartilhe logs do Supabase Auth

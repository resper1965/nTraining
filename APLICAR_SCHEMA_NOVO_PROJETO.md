# Aplicar Schema no Novo Projeto Supabase

## ✅ Credenciais Configuradas

- **URL:** `https://srrbomtdkghjxdhpeyel.supabase.co`
- **Publishable Key:** `sb_publishable_IF--qr-d2KBPKWlq_-Bs8Q_PG4Rq-9f`
- **Service Role Key:** `sb_secret_1yvM2jcbLElHL1ATwPcadg_Mb4rGpaQ`

## 📋 Passo 1: Aplicar Schema Completo (TUDO DE UMA VEZ)

### Via SQL Editor do Supabase (Recomendado)

1. **Acesse o SQL Editor:**
   - Vá para: https://supabase.com/dashboard/project/srrbomtdkghjxdhpeyel/sql/new

2. **Copie e cole o arquivo consolidado:**
   - Abra o arquivo: `lib/supabase/migrations/000_setup_completo_novo_projeto.sql`
   - Copie TODO o conteúdo
   - Cole no SQL Editor

3. **Execute:**
   - Clique em "Run" ou pressione `Ctrl+Enter`
   - Aguarde a execução completar (pode levar alguns segundos)

4. **Verifique se não há erros:**
   - Se houver erros, me envie a mensagem de erro
   - Se tudo estiver OK, você verá "Success. No rows returned"

**Este arquivo único contém:**
- ✅ Schema base completo (todas as tabelas)
- ✅ Sistema de notificações
- ✅ Organizações e acesso a cursos
- ✅ RLS policies configuradas corretamente
- ✅ Triggers e funções helper
- ✅ Trigger `handle_new_user` para criar perfil automaticamente

## 📋 Passo 3: Criar Usuários Iniciais

Após aplicar todas as migrações, execute:

```bash
# Criar resper@ness.com.br (superadmin)
npx tsx scripts/create-user-admin.ts \
  "resper@ness.com.br" \
  "Gordinh@29" \
  "Ricardo Esper" \
  true \
  "platform_admin" \
  null \
  "5511983397196"

# Criar myoshida@ness.com.br
npx tsx scripts/create-user-admin.ts \
  "myoshida@ness.com.br" \
  "Pip0c@64" \
  "Monica Yoshida" \
  false \
  "platform_admin" \
  null \
  null
```

## 📋 Passo 4: Configurar Google OAuth

1. **No Google Cloud Console:**
   - Adicione as URLs do novo projeto:
     - **Authorized JavaScript origins:**
       - `https://srrbomtdkghjxdhpeyel.supabase.co`
       - `https://n-training.vercel.app`
       - `http://localhost:3000`
     
     - **Authorized redirect URIs:**
       - `https://srrbomtdkghjxdhpeyel.supabase.co/auth/v1/callback`
       - `https://n-training.vercel.app/auth/callback`
       - `http://localhost:3000/auth/callback`

2. **No Supabase Dashboard:**
   - Vá em Authentication → Providers → Google
   - Configure Client ID e Secret

## 📋 Passo 5: Atualizar Vercel

1. **Atualizar variáveis de ambiente no Vercel:**
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://srrbomtdkghjxdhpeyel.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `sb_publishable_IF--qr-d2KBPKWlq_-Bs8Q_PG4Rq-9f`
   - `SUPABASE_SERVICE_ROLE_KEY` = `sb_secret_1yvM2jcbLElHL1ATwPcadg_Mb4rGpaQ`

2. **Fazer redeploy**

## ✅ Checklist

- [ ] **Schema completo aplicado** (`lib/supabase/migrations/000_setup_completo_novo_projeto.sql`)
- [ ] **Usuários iniciais criados** (via scripts)
- [ ] **Google OAuth configurado** (novas URLs do projeto)
- [ ] **Variáveis de ambiente atualizadas no Vercel**
- [ ] **Teste de login funcionando**

## 🎯 Próximo Passo

Após aplicar o schema, me avise e eu:
1. Criarei os usuários iniciais via script
2. Verificarei se tudo está funcionando
3. Testarei a autenticação

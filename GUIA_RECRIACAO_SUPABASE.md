# Guia de Recriação do Projeto Supabase - n.training

## 📋 Checklist de Configuração

### 1. Criar Novo Projeto no Supabase
- [ ] Criar novo projeto no Supabase Dashboard
- [ ] Anotar as novas credenciais:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

### 2. Atualizar Variáveis de Ambiente

#### Local (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://[novo-projeto-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[nova-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[nova-service-role-key]
```

#### Vercel (Production)
- [ ] Atualizar variáveis de ambiente no Vercel Dashboard
- [ ] Fazer redeploy após atualizar

### 3. Aplicar Migrações Essenciais

**⚠️ IMPORTANTE:** Aplicar na ordem exata abaixo!

1. **Schema Base** (PRIMEIRO)
   - Arquivo: `lib/supabase/schema.sql`
   - Cria todas as tabelas, enums e índices básicos
   - Execute TODO o arquivo de uma vez

2. **Sistema de Notificações**
   - Arquivo: `lib/supabase/migrations/002_notifications.sql`
   - Cria tabelas de notificações

3. **Organizações e Acesso**
   - Arquivo: `lib/supabase/migrations/001_organization_courses.sql`
   - Cria sistema de licenças por organização

4. **AI Course Architect** (OPCIONAL - apenas se for usar)
   - Arquivo: `lib/supabase/migrations/012_setup_ai_course_architect.sql`
   - Habilita extensão `vector` e tabelas de conhecimento

5. **RLS e Triggers** (DEPOIS de todas as tabelas)
   - Ver arquivo `MIGRACOES_ESSENCIAIS.md` para SQL completo
   - Configura RLS policies corretamente desde o início
   - Cria trigger `handle_new_user` para criar perfil automaticamente

### 4. Configurar Autenticação

#### Google OAuth
- [ ] Configurar OAuth no Google Cloud Console
- [ ] Adicionar URLs no Supabase:
  - **Authorized JavaScript origins:**
    - `https://[novo-projeto-id].supabase.co`
    - `https://n-training.vercel.app`
    - `http://localhost:3000`
  
  - **Authorized redirect URIs:**
    - `https://[novo-projeto-id].supabase.co/auth/v1/callback`
    - `https://n-training.vercel.app/auth/callback`
    - `http://localhost:3000/auth/callback`

- [ ] Configurar Client ID e Secret no Supabase Dashboard

### 5. Criar Usuários Iniciais

Usar o script `scripts/create-user-admin.ts` para criar:
- [ ] `resper@ness.com.br` (superadmin)
- [ ] `myoshida@ness.com.br` (platform_admin)

### 6. Criar Organizações

- [ ] Criar organização "ness."
- [ ] Criar organização "Ionic Health" (se necessário)

### 7. Verificar Configurações

- [ ] Testar login com email/senha
- [ ] Testar login com Google OAuth
- [ ] Verificar RLS policies
- [ ] Verificar triggers funcionando
- [ ] Verificar se não há warnings de segurança

## 🔧 Scripts Úteis

### Criar Usuário Admin
```bash
npx tsx scripts/create-user-admin.ts \
  "resper@ness.com.br" \
  "Gordinh@29" \
  "Ricardo Esper" \
  true \
  "platform_admin" \
  null \
  "5511983397196"
```

### Verificar Status do Projeto
```bash
npx tsx scripts/check-user-auth-status.ts resper@ness.com.br
```

## ⚠️ Importante

1. **Não aplicar migrações antigas** - Apenas as essenciais listadas acima
2. **Configurar RLS corretamente** - Desde o início, não depois
3. **Testar autenticação** - Antes de fazer deploy
4. **Backup de dados** - Se houver dados importantes, fazer backup antes

## 📝 Notas

- O projeto antigo tinha 47 migrações, muitas delas correções
- O novo projeto deve começar limpo, aplicando apenas o necessário
- Focar nas tabelas do n.training, ignorar tabelas antigas (condomínios, projetos, etc.)

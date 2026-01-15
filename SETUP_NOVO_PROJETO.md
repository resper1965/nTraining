# Setup do Novo Projeto Supabase

## ✅ Credenciais Recebidas

- **URL:** `https://srrbomtdkghjxdhpeyel.supabase.co`
- **Publishable Key:** `sb_publishable_IF--qr-d2KBPKWlq_-Bs8Q_PG4Rq-9f`

## ⚠️ Ainda Necessário

Você precisa fornecer a **SUPABASE_SERVICE_ROLE_KEY**:

1. Acesse: https://supabase.com/dashboard/project/srrbomtdkghjxdhpeyel/settings/api
2. Copie a chave `service_role` (não a `anon` ou `publishable`)
3. Me passe essa chave para eu atualizar o `.env.local`

## 📋 Próximos Passos (Após Receber Service Role Key)

1. ✅ Atualizar `.env.local` com todas as credenciais
2. Aplicar schema base (`lib/supabase/schema.sql`)
3. Aplicar migrações essenciais
4. Configurar RLS e triggers
5. Criar usuários iniciais
6. Configurar Google OAuth
7. Testar autenticação

## 🔧 Comandos Úteis

### Verificar conexão com novo projeto
```bash
npx tsx scripts/check-user-auth-status.ts resper@ness.com.br
```

### Criar usuário admin
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

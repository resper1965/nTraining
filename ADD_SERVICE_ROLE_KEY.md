# ⚠️ Adicionar SUPABASE_SERVICE_ROLE_KEY

## ✅ Variáveis já configuradas:
- ✅ `NEXT_PUBLIC_SUPABASE_URL` (Production, Preview, Development)
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Production, Preview, Development)

## ⚠️ Variável pendente:
- ⚠️ `SUPABASE_SERVICE_ROLE_KEY` - **OBRIGATÓRIA**

## Como obter a Service Role Key:

1. Acesse o Supabase Dashboard:
   https://supabase.com/dashboard/project/dcigykpfdehqbtbaxzak/settings/api

2. Na seção "Project API keys", encontre a chave `service_role`
   - ⚠️ **ATENÇÃO**: Use a chave `service_role`, NÃO a `anon` key
   - Esta chave é **PRIVADA** e só deve ser usada server-side

3. Adicione via CLI do Vercel:
```bash
cd /home/resper/nTraining

# Para Production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
# Cole a service_role key quando solicitado

# Para Preview
vercel env add SUPABASE_SERVICE_ROLE_KEY preview
# Cole a service_role key quando solicitado

# Para Development
vercel env add SUPABASE_SERVICE_ROLE_KEY development
# Cole a service_role key quando solicitado
```

## Ou adicione manualmente no Dashboard:

1. Acesse: https://vercel.com/dashboard
2. Vá em seu projeto → Settings → Environment Variables
3. Clique em "Add New"
4. Key: `SUPABASE_SERVICE_ROLE_KEY`
5. Value: (cole a service_role key do Supabase)
6. Marque: Production, Preview, Development
7. Clique em "Save"

## Após adicionar:

Faça um **redeploy** para aplicar as variáveis:
```bash
vercel --prod
```

Ou via Dashboard:
- Deployments → Três pontos (⋯) → Redeploy

---

**Importante**: A Service Role Key é necessária para operações server-side como criação de usuários, atualizações de perfil, etc.


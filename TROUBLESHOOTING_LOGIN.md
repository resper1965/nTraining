# 🔍 Troubleshooting: Problema de Login na Produção

## ⚠️ Problema Comum: Variáveis de Ambiente Não Configuradas

O problema mais comum ao não conseguir fazer login em produção é a falta de variáveis de ambiente no Vercel.

## ✅ Checklist de Verificação

### 1. Verificar Variáveis de Ambiente no Vercel

Acesse o dashboard do Vercel e verifique se todas as variáveis estão configuradas:

1. Vá para: https://vercel.com/dashboard
2. Selecione o projeto `n-training`
3. Vá em **Settings** → **Environment Variables**
4. Verifique se existem estas 3 variáveis:

   - ✅ `NEXT_PUBLIC_SUPABASE_URL`
   - ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - ✅ `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **CRÍTICA**

### 2. Valores Esperados

#### NEXT_PUBLIC_SUPABASE_URL
```
https://dcigykpfdehqbtbaxzak.supabase.co
```

#### NEXT_PUBLIC_SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaWd5a3BmZGVocWJ0YmF4emFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NDEzNTYsImV4cCI6MjA3ODExNzM1Nn0.bHxC87Sox8vwNTqREljvO2FJRveplINwggOMrF8k0IE
```

#### SUPABASE_SERVICE_ROLE_KEY
⚠️ **OBRIGATÓRIA** - Obtenha no Supabase Dashboard:
- Acesse: https://supabase.com/dashboard/project/dcigykpfdehqbtbaxzak/settings/api
- Copie a chave `service_role` (NÃO a `anon` key)

### 3. Como Adicionar Variáveis

#### Via Dashboard (Recomendado)

1. No Vercel Dashboard, vá em **Settings** → **Environment Variables**
2. Clique em **"Add New"**
3. Para cada variável:
   - Digite o **Key** (nome da variável)
   - Cole o **Value** (valor)
   - Marque os ambientes: **Production**, **Preview**, **Development**
   - Clique em **Save**

#### Via CLI

```bash
# Adicionar NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_URL production preview development
# Cole: https://dcigykpfdehqbtbaxzak.supabase.co

# Adicionar NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production preview development
# Cole: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaWd5a3BmZGVocWJ0YmF4emFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NDEzNTYsImV4cCI6MjA3ODExNzM1Nn0.bHxC87Sox8vwNTqREljvO2FJRveplINwggOMrF8k0IE

# Adicionar SUPABASE_SERVICE_ROLE_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY production preview development
# Cole a service_role key do Supabase Dashboard
```

### 4. ⚠️ IMPORTANTE: Fazer Redeploy

**Após adicionar as variáveis, você DEVE fazer um redeploy!**

As variáveis de ambiente só são aplicadas em novos deployments.

#### Via Dashboard:
1. Vá em **Deployments**
2. Clique nos **três pontos** (⋯) do último deployment
3. Selecione **Redeploy**

#### Via CLI:
```bash
vercel --prod
```

## 🔍 Outros Problemas Possíveis

### Erro: "Missing Supabase environment variables"

**Causa**: Variáveis não configuradas ou não aplicadas ao deployment.

**Solução**:
1. Verifique se as variáveis estão no Vercel Dashboard
2. Certifique-se de que marcou **Production** ao adicionar
3. Faça um **redeploy** após adicionar

### Erro: "Invalid API key" ou "Authentication failed"

**Causa**: Chaves incorretas ou expiradas.

**Solução**:
1. Verifique se copiou as chaves corretamente
2. A `anon` key e `service_role` key são diferentes!
3. Obtenha novas chaves no Supabase Dashboard se necessário

### Login funciona localmente mas não em produção

**Causa**: Variáveis de ambiente não configuradas no Vercel.

**Solução**:
1. Verifique se todas as variáveis estão no Vercel
2. Certifique-se de que fez um redeploy após adicionar

### Erro de CORS ou cookies

**Causa**: Configuração de cookies no ambiente de produção.

**Solução**:
1. Verifique se a URL do Supabase está correta
2. Verifique se o domínio está configurado no Supabase Dashboard
3. Verifique os logs do Vercel para mais detalhes

## 📝 Verificação Rápida

Execute este comando para verificar as variáveis configuradas:

```bash
vercel env ls
```

Você deve ver as 3 variáveis listadas para Production, Preview e Development.

## 🆘 Ainda com Problemas?

1. **Verifique os logs do Vercel**:
   - Vá em **Deployments** → Selecione o deployment → **View Function Logs**
   - Procure por erros relacionados ao Supabase

2. **Teste localmente com as mesmas variáveis**:
   - Crie um arquivo `.env.local` com as variáveis
   - Execute `npm run dev`
   - Teste o login localmente

3. **Verifique o Supabase Dashboard**:
   - Confirme que o projeto está ativo
   - Verifique se há limites de API atingidos
   - Verifique os logs de autenticação

---

**Após seguir estes passos, o login deve funcionar corretamente!** ✅

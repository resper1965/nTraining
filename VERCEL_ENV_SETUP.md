# 🔧 Configuração de Variáveis de Ambiente no Vercel

## ⚠️ IMPORTANTE: Variáveis Necessárias

Você precisa configurar **3 variáveis de ambiente** no Vercel para que a aplicação funcione corretamente.

## 📋 Variáveis a Configurar

### 1. NEXT_PUBLIC_SUPABASE_URL
```
https://dcigykpfdehqbtbaxzak.supabase.co
```

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaWd5a3BmZGVocWJ0YmF4emFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NDEzNTYsImV4cCI6MjA3ODExNzM1Nn0.bHxC87Sox8vwNTqREljvO2FJRveplINwggOMrF8k0IE
```

### 3. SUPABASE_SERVICE_ROLE_KEY
⚠️ **OBRIGATÓRIA** - Obtenha no Supabase Dashboard:
- Acesse: https://supabase.com/dashboard/project/dcigykpfdehqbtbaxzak/settings/api
- Copie a chave `service_role` (NÃO a `anon` key)

## 🚀 Como Configurar (Passo a Passo)

### Método 1: Via Dashboard do Vercel (Mais Fácil)

1. **Acesse o Dashboard do Vercel**
   - Vá para: https://vercel.com/dashboard
   - Encontre o projeto `nTraining` (ou o nome que você deu)

2. **Acesse as Configurações**
   - Clique no projeto
   - Vá em **Settings** (Configurações)
   - Clique em **Environment Variables** (Variáveis de Ambiente)

3. **Adicione cada variável:**
   
   **Para NEXT_PUBLIC_SUPABASE_URL:**
   - Clique em **"Add New"**
   - **Key**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: `https://dcigykpfdehqbtbaxzak.supabase.co`
   - **Environments**: Marque todas (Production, Preview, Development)
   - Clique em **Save**

   **Para NEXT_PUBLIC_SUPABASE_ANON_KEY:**
   - Clique em **"Add New"**
   - **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaWd5a3BmZGVocWJ0YmF4emFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NDEzNTYsImV4cCI6MjA3ODExNzM1Nn0.bHxC87Sox8vwNTqREljvO2FJRveplINwggOMrF8k0IE`
   - **Environments**: Marque todas (Production, Preview, Development)
   - Clique em **Save**

   **Para SUPABASE_SERVICE_ROLE_KEY:**
   - Clique em **"Add New"**
   - **Key**: `SUPABASE_SERVICE_ROLE_KEY`
   - **Value**: (Cole a service_role key do Supabase Dashboard)
   - **Environments**: Marque todas (Production, Preview, Development)
   - Clique em **Save**

4. **Faça um Redeploy**
   - Vá para a aba **Deployments**
   - Clique nos **três pontos** (⋯) do último deployment
   - Selecione **Redeploy**
   - Aguarde o deploy completar

### Método 2: Via CLI do Vercel

```bash
# 1. Instalar Vercel CLI (se ainda não tiver)
npm i -g vercel

# 2. Login no Vercel
vercel login

# 3. Navegar até o diretório do projeto
cd /home/resper/nTraining

# 4. Link do projeto (se ainda não estiver linkado)
vercel link

# 5. Adicionar variáveis de ambiente
vercel env add NEXT_PUBLIC_SUPABASE_URL production preview development
# Quando solicitado, cole: https://dcigykpfdehqbtbaxzak.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production preview development
# Quando solicitado, cole: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaWd5a3BmZGVocWJ0YmF4emFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NDEzNTYsImV4cCI6MjA3ODExNzM1Nn0.bHxC87Sox8vwNTqREljvO2FJRveplINwggOMrF8k0IE

vercel env add SUPABASE_SERVICE_ROLE_KEY production preview development
# Quando solicitado, cole a service_role key do Supabase

# 6. Fazer redeploy
vercel --prod
```

## ✅ Verificação

Após configurar as variáveis e fazer o redeploy:

1. **Verifique no Dashboard:**
   - Vá em **Settings** → **Environment Variables**
   - Confirme que todas as 3 variáveis estão listadas

2. **Teste a aplicação:**
   - Acesse a URL do deployment
   - Tente fazer login/signup
   - Se funcionar, as variáveis estão corretas!

3. **Verifique os logs:**
   - Se houver erros, vá em **Deployments** → **View Function Logs**
   - Procure por erros relacionados ao Supabase

## 🔍 Troubleshooting

### ❌ Erro: "Missing Supabase environment variables"
- **Solução**: Verifique se todas as 3 variáveis estão configuradas
- Certifique-se de que fez um **redeploy** após adicionar as variáveis

### ❌ Erro: "Invalid API key"
- **Solução**: Verifique se copiou as chaves corretamente
- A `anon` key e `service_role` key são diferentes!

### ❌ Variáveis não aparecem no deployment
- **Solução**: 
  1. Verifique se selecionou os ambientes corretos (Production, Preview, Development)
  2. Faça um novo deploy após adicionar as variáveis
  3. Variáveis adicionadas após o deploy não são aplicadas automaticamente

### ❌ Build funciona mas aplicação não conecta ao Supabase
- **Solução**: 
  1. Verifique se a URL do Supabase está correta
  2. Confirme que as chaves estão corretas
  3. Verifique os logs do runtime no Vercel

## 📝 Checklist Final

- [ ] NEXT_PUBLIC_SUPABASE_URL configurada
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY configurada
- [ ] SUPABASE_SERVICE_ROLE_KEY configurada
- [ ] Todas as variáveis marcadas para Production, Preview e Development
- [ ] Redeploy realizado após adicionar as variáveis
- [ ] Aplicação testada e funcionando

---

**Após configurar, sua aplicação estará totalmente funcional!** 🎉


# 🔍 Diagnóstico: Erro ao Autenticar com Google

## ⚠️ Erro Atual
**Mensagem:** "Erro ao autenticar com Google"

Este erro pode ter várias causas. Siga os passos abaixo para identificar e corrigir.

---

## 🔴 Causas Possíveis

### 1. RedirectTo não Autorizado no Supabase (MUITO COMUM)

**Problema:** A URL de callback que estamos passando não está na lista de URLs permitidas do Supabase.

**Como Verificar:**
1. Abra o Console do Navegador (F12)
2. Veja os logs: `[GoogleSignIn] RedirectTo: ...`
3. Anote a URL exata que está sendo usada

**Solução:**
A URL deve estar autorizada no Supabase Dashboard:
- Acesse: https://supabase.com/dashboard/project/srrbomtdkghjxdhpeyel
- Vá em: **Authentication** → **URL Configuration**
- No campo **Redirect URLs**, adicione:
  ```
  https://n-training.vercel.app/**
  http://localhost:3000/**
  ```

### 2. Google OAuth não Configurado no Supabase

**Problema:** As credenciais do Google não estão configuradas no Supabase.

**Como Verificar:**
1. Acesse: https://supabase.com/dashboard/project/srrbomtdkghjxdhpeyel
2. Vá em: **Authentication** → **Providers** → **Google**
3. Verifique se o **Client ID** e **Client Secret** estão preenchidos

**Solução:**
Se não estiverem configurados:
1. Obtenha as credenciais do Google Cloud Console:
   - Client ID
   - Client Secret
2. Cole no Supabase e salve

### 3. OAuth Consent Screen não Publicado

**Problema:** O OAuth Consent Screen está em modo "Testing" e você não está na lista de testadores.

**Como Verificar:**
1. Acesse: https://console.cloud.google.com/apis/credentials/consent?project=ntraining-484414
2. Verifique o status (deve estar "In production" ou você deve estar na lista de testadores)

**Solução:**
- **Opção A:** Adicione seu email à lista de "Test users"
- **Opção B:** Publique o app (muda status para "In production")

### 4. URLs do Google Cloud Console Incorretas

**Problema:** As URLs de redirect no Google Cloud Console não correspondem.

**Como Verificar:**
1. Acesse: https://console.cloud.google.com/apis/credentials?project=ntraining-484414
2. Clique no OAuth Client (`n.training Web Client`)
3. Verifique as **URIs de Redirecionamento Autorizadas**

**Devem Estar:**
```
https://srrbomtdkghjxdhpeyel.supabase.co/auth/v1/callback
https://n-training.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

### 5. Site URL no Supabase Incorreta

**Problema:** A Site URL padrão no Supabase está configurada como localhost.

**Como Verificar:**
1. Acesse: https://supabase.com/dashboard/project/srrbomtdkghjxdhpeyel
2. Vá em: **Authentication** → **URL Configuration**
3. Verifique o campo **Site URL**

**Deve Estar:**
```
https://n-training.vercel.app
```

---

## ✅ Passos para Resolver

### Passo 1: Verificar Console do Navegador

1. Abra o Console (F12)
2. Clique em "Continuar com Google"
3. Veja os logs:
   - `[GoogleSignIn] Origin: ...`
   - `[GoogleSignIn] RedirectTo: ...`
4. Se houver um erro, anote a mensagem completa

### Passo 2: Verificar Logs da Vercel

1. Acesse: https://vercel.com/nessbr-projects/n-training
2. Vá em: **Deployments** → Último deployment → **Functions**
3. Procure por erros em `/auth/callback`
4. Veja os logs: `[OAuth Callback] ...`

### Passo 3: Verificar Configuração do Supabase

Siga todos os itens da seção "Causas Possíveis" acima.

---

## 🔧 Correções no Código (Já Implementadas)

✅ Logs detalhados adicionados
✅ Tratamento de erro melhorado
✅ Mensagens de erro mais descritivas

---

## 📋 Checklist

- [ ] Console do navegador mostra a URL exata usada
- [ ] Redirect URLs no Supabase incluem `https://n-training.vercel.app/**`
- [ ] Site URL no Supabase é `https://n-training.vercel.app`
- [ ] Google OAuth está configurado no Supabase (Client ID e Secret)
- [ ] OAuth Consent Screen está publicado ou você está na lista de testadores
- [ ] URLs no Google Cloud Console estão corretas
- [ ] Deploy na Vercel foi realizado com as últimas correções

---

## 🚨 Próximos Passos

1. **Faça deploy das correções:**
   ```bash
   vercel --prod
   ```

2. **Teste novamente:**
   - Abra o Console do Navegador (F12)
   - Clique em "Continuar com Google"
   - Veja os logs e o erro específico

3. **Compartilhe o erro específico:**
   - Copie a mensagem de erro completa do console
   - Verifique os logs da Vercel
   - Isso ajudará a identificar a causa exata

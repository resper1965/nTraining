# 🔍 Verificação: URL de Redirect OAuth

## ⚠️ Problema Identificado

Você informou que a URL de redirect está **duplicada**:
```
https://srrbomtdkghjxdhpeyel.supabase.co/auth/v1/callback
https://srrbomtdkghjxdhpeyel.supabase.co/auth/v1/callback
```

## 🔍 Como o Fluxo OAuth Funciona

### Fluxo Atual:

1. **Usuário clica "Continuar com Google"**
   - Código: `components/auth/google-signin-button.tsx`
   - Chama: `supabase.auth.signInWithOAuth()`
   - RedirectTo configurado: `${window.location.origin}/auth/callback`

2. **Supabase processa o OAuth**
   - Supabase internamente redireciona para: `https://srrbomtdkghjxdhpeyel.supabase.co/auth/v1/callback`
   - O Google OAuth verifica se esta URL está nas "URIs de redirecionamento autorizadas"

3. **Google autentica e redireciona**
   - Google redireciona para: `https://srrbomtdkghjxdhpeyel.supabase.co/auth/v1/callback?code=...`
   - Supabase processa e então redireciona para: `/auth/callback?next=...`

## ✅ URLs Necessárias no OAuth Client

No Google Cloud Console → OAuth Client, você precisa ter **APENAS UMA** entrada para cada URL:

### URIs de Redirecionamento Autorizadas:

```
https://srrbomtdkghjxdhpeyel.supabase.co/auth/v1/callback
https://n-training.vercel.app/auth/callback
https://ntraining.ness.com.br/auth/callback
```

**NÃO deve haver duplicatas!**

## 🔧 Correção Imediata

### Passo 1: Remover Duplicata

1. **Acesse:** https://console.cloud.google.com/apis/credentials?project=ntraining-484414
2. **Clique no OAuth Client** (`n.training Web Client`)
3. **Na seção "URIs de redirecionamento autorizadas":**
   - **REMOVA** uma das URLs duplicadas `https://srrbomtdkghjxdhpeyel.supabase.co/auth/v1/callback`
   - **DEIXE APENAS UMA** entrada desta URL
4. **Clique em "SAVE"**

### Passo 2: Verificar Outras URLs

Certifique-se de que as URLs estão corretas e não duplicadas:

**URIs de Redirecionamento Autorizadas (devem ser EXATAMENTE):**
```
https://srrbomtdkghjxdhpeyel.supabase.co/auth/v1/callback
https://n-training.vercel.app/auth/callback
https://ntraining.ness.com.br/auth/callback
```

**Origens JavaScript Autorizadas (devem ser):**
```
https://srrbomtdkghjxdhpeyel.supabase.co
https://n-training.vercel.app
https://ntraining.ness.com.br
```

### Passo 3: Verificar Credenciais no Supabase

1. **Acesse:** https://supabase.com/dashboard/project/srrbomtdkghjxdhpeyel/auth/providers
2. **Clique em "Google"**
3. **Verifique:**
   - ✅ Enable Google provider: **ON**
   - ✅ Client ID corresponde ao Google Cloud Console
   - ✅ Client Secret corresponde ao Google Cloud Console
4. **Se não corresponderem, atualize e salve**

### Passo 4: Limpar e Testar

1. **Aguarde 2-3 minutos** após salvar as alterações
2. **Limpe cookies do navegador** (ou use modo anônimo)
3. **Teste novamente** o login com Google

---

## 🔍 Por Que a Duplicata Pode Causar Problemas

- Alguns sistemas OAuth podem ter problemas com URLs duplicadas
- Pode causar ambiguidade no processo de validação
- Melhor prática: uma URL, uma entrada

---

## ✅ Checklist Final

- [ ] Removida URL duplicada do OAuth Client
- [ ] Todas as URLs estão corretas (sem duplicatas)
- [ ] Client ID/Secret no Supabase correspondem ao Google Cloud
- [ ] Google Provider habilitado no Supabase
- [ ] Aguardou 2-3 minutos após alterações
- [ ] Limpou cookies e testou novamente

---

**A duplicata da URL pode estar causando o erro "acesso bloqueado". Remova e teste novamente!**

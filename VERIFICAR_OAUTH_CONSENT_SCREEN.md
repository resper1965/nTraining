# ✅ Verificar OAuth Consent Screen - CRÍTICO

## ⚠️ IMPORTANTE

A **verificação do app** (✅ verde que você viu) é diferente do **status do OAuth Consent Screen**.

O erro "acesso bloqueado" é causado pelo **status do OAuth Consent Screen**, não pela verificação.

---

## 🔍 Onde Verificar o Status do OAuth Consent Screen

### Passo 1: Acessar OAuth Consent Screen

1. **No menu lateral esquerdo**, clique em:
   - **"Branding"** OU
   - **"Público-alvo"** (Audience) OU
   - Acesse diretamente: https://console.cloud.google.com/apis/credentials/consent?project=ntraining-484414

### Passo 2: Verificar o Status

No topo da página do OAuth Consent Screen, você verá uma das seguintes opções:

#### ✅ Se mostrar "In production":
- ✅ App está publicado e qualquer usuário pode fazer login
- **Se ainda dá erro, verifique outros problemas abaixo**

#### ⚠️ Se mostrar "Testing" ou "Em teste":
- ❌ **ESTE É O PROBLEMA!**
- Apenas usuários na lista de "Test users" podem fazer login
- Você precisa adicionar seu email aos test users OU publicar o app

---

## 🔧 Como Corrigir se Estiver em "Testing"

### Opção 1: Adicionar como Test User (Rápido - 2 minutos)

1. **Na mesma página** do OAuth Consent Screen
2. **Role até a seção "Test users"**
3. **Clique em "+ ADD USERS"** ou **"+ ADICIONAR USUÁRIOS"**
4. **Digite:** `resper@ness.com.br`
5. **Clique em "SAVE"** ou **"SALVAR"**
6. **Aguarde 1-2 minutos** e teste novamente

### Opção 2: Publicar o App (Recomendado para produção)

1. **Na mesma página** do OAuth Consent Screen
2. **Role até o final da página**
3. **Procure por "PUBLISH APP"** ou **"PUBLICAR APP"**
4. **Clique e confirme**
5. **Aguarde 1-2 minutos** e teste novamente

---

## 📋 Checklist Completo

Depois de verificar o OAuth Consent Screen, verifique também:

### 1. OAuth Consent Screen Status
- [ ] Status é "In production" OU você está em "Test users"

### 2. Authorized Domains
Na mesma página do OAuth Consent Screen, verifique "Authorized domains":
- [ ] `srrbomtdkghjxdhpeyel.supabase.co`
- [ ] `n-training.vercel.app`
- [ ] `ntraining.ness.com.br`
- [ ] `ness.com.br`

### 3. OAuth Client URLs
Acesse: https://console.cloud.google.com/apis/credentials?project=ntraining-484414

Clique no OAuth Client e verifique:

**Origens JavaScript autorizadas:**
- [ ] `https://srrbomtdkghjxdhpeyel.supabase.co`
- [ ] `https://n-training.vercel.app`
- [ ] `https://ntraining.ness.com.br`

**URIs de redirecionamento autorizadas:**
- [ ] `https://srrbomtdkghjxdhpeyel.supabase.co/auth/v1/callback`
- [ ] `https://n-training.vercel.app/auth/callback`
- [ ] `https://ntraining.ness.com.br/auth/callback`

### 4. Supabase Configuration
Acesse: https://supabase.com/dashboard/project/srrbomtdkghjxdhpeyel/auth/providers

- [ ] Google provider está habilitado (ON)
- [ ] Client ID corresponde ao Google Cloud Console
- [ ] Client Secret corresponde ao Google Cloud Console

---

## 🎯 Próximos Passos

1. **Acesse:** https://console.cloud.google.com/apis/credentials/consent?project=ntraining-484414
2. **Verifique o status** no topo da página
3. **Se estiver em "Testing":**
   - Adicione `resper@ness.com.br` aos Test users
   - OU publique o app
4. **Aguarde 2-3 minutos**
5. **Teste novamente** o login com Google

---

**O status do OAuth Consent Screen é o que determina se o erro "acesso bloqueado" ocorre ou não!**

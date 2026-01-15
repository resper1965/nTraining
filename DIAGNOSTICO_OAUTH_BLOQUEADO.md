# 🔍 Diagnóstico: OAuth "Acesso Bloqueado"

## ⚠️ Erro Atual
**Erro:** "Acesso bloqueado" - `flowName=GeneralOAuthFlow`

Este erro geralmente indica que o Google está bloqueando o fluxo OAuth por uma das seguintes razões:

---

## 🔴 Possíveis Causas

### 1. Tela de Consentimento Não Publicada (MUITO COMUM)
**Problema:** OAuth Consent Screen está em modo "Testing" e você não está na lista de testadores

**Solução:**
1. Acesse: https://console.cloud.google.com/apis/credentials/consent?project=ntraining-484414
2. Verifique o status da tela de consentimento
3. Se estiver em "Testing":
   - **Opção A:** Adicione seu email (`resper@ness.com.br`) à lista de "Test users"
   - **Opção B:** Publique o app (muda status para "In production")

### 2. Domínios Não Autorizados
**Problema:** Algum domínio usado não está na lista de "Domínios autorizados"

**Verificar:**
1. Acesse: https://console.cloud.google.com/apis/credentials/consent?project=ntraining-484414
2. Vá em "Domínios autorizados"
3. Certifique-se de que todos os domínios usados estão lá:
   - `srrbomtdkghjxdhpeyel.supabase.co`
   - `n-training.vercel.app`
   - `ntraining.ness.com.br`
   - `ness.com.br`

### 3. Client ID/Secret Incorretos no Supabase
**Problema:** As credenciais no Supabase não correspondem ao OAuth client

**Verificar:**
1. No Google Cloud Console, copie o **Client ID** e **Client Secret**
2. No Supabase Dashboard → Authentication → Providers → Google
3. Verifique se correspondem exatamente

### 4. URLs de Redirect Não Correspondem
**Problema:** A URL de redirect no código não está nas "URIs de redirecionamento autorizadas"

**Verificar:**
- OAuth Client deve ter: `https://srrbomtdkghjxdhpeyel.supabase.co/auth/v1/callback`
- Código usa: `/auth/callback` (que redireciona para o Supabase internamente)

---

## ✅ Solução Passo a Passo

### Passo 1: Verificar Tela de Consentimento

1. **Acesse:** https://console.cloud.google.com/apis/credentials/consent?project=ntraining-484414

2. **Verifique o status:**
   - Se for "Testing" (em teste):
     - Role até "Test users"
     - Clique em "+ ADD USERS"
     - Adicione: `resper@ness.com.br`
     - Clique em "SAVE"
   
   - **OU** publique o app:
     - Role até o final
     - Clique em "PUBLISH APP"
     - Confirme a publicação

### Passo 2: Verificar Domínios Autorizados

1. **Na mesma página** (OAuth Consent Screen)
2. **Role até "Authorized domains"**
3. **Certifique-se de que contém:**
   ```
   srrbomtdkghjxdhpeyel.supabase.co
   n-training.vercel.app
   ntraining.ness.com.br
   ness.com.br
   ```
4. **Se faltar algum, adicione** (Google só permite domínios verificados)

### Passo 3: Verificar OAuth Client

1. **Acesse:** https://console.cloud.google.com/apis/credentials?project=ntraining-484414

2. **Clique no OAuth Client** (`n.training Web Client`)

3. **Verifique "Origens JavaScript autorizadas":**
   ```
   https://srrbomtdkghjxdhpeyel.supabase.co
   https://n-training.vercel.app
   https://ntraining.ness.com.br
   ```

4. **Verifique "URIs de redirecionamento autorizadas":**
   ```
   https://srrbomtdkghjxdhpeyel.supabase.co/auth/v1/callback
   https://n-training.vercel.app/auth/callback
   https://ntraining.ness.com.br/auth/callback
   ```

5. **Clique em "SALVAR"** se fez alterações

### Passo 4: Verificar Supabase

1. **Acesse:** https://supabase.com/dashboard/project/srrbomtdkghjxdhpeyel/auth/providers

2. **Clique em "Google"**

3. **Verifique:**
   - ✅ Enable Google provider: **ON**
   - ✅ Client ID: Copie do Google Cloud Console e compare
   - ✅ Client Secret: Copie do Google Cloud Console e compare

4. **Se não corresponderem:**
   - Cole o Client ID correto
   - Cole o Client Secret correto
   - Clique em "SAVE"

### Passo 5: Limpar Cache e Testar

1. **Limpe cookies do navegador** (ou use modo anônimo)
2. **Acesse:** https://n-training.vercel.app/auth/login
3. **Clique em "Continuar com Google"**
4. **Faça login com:** `resper@ness.com.br`

---

## 🎯 Checklist Rápido

- [ ] OAuth Consent Screen está "In production" OU você está na lista de "Test users"
- [ ] Todos os domínios estão em "Authorized domains"
- [ ] OAuth Client tem todas as URLs corretas
- [ ] Client ID no Supabase corresponde ao Google Cloud Console
- [ ] Client Secret no Supabase corresponde ao Google Cloud Console
- [ ] Google Provider está habilitado no Supabase
- [ ] Limpou cache/cookies do navegador

---

## ⚠️ Erro Mais Comum

**O erro mais comum é a Tela de Consentimento estar em "Testing" sem o usuário na lista de testadores.**

**Solução Rápida:**
1. Vá em: https://console.cloud.google.com/apis/credentials/consent?project=ntraining-484414
2. Role até "Test users"
3. Adicione `resper@ness.com.br`
4. Salve e tente novamente

---

## 📞 Se Ainda Não Funcionar

Compartilhe:
1. Status da OAuth Consent Screen (Testing ou In production?)
2. Você está na lista de Test users?
3. Quais domínios estão em "Authorized domains"?
4. Qual a mensagem de erro exata que aparece ao tentar login?

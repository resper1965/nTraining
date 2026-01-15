# 🔍 Diagnóstico: OAuth "acesso bloqueado" com App em Produção

## ✅ Status Verificado

- ✅ OAuth Consent Screen: **"Em produção"** (In production)
- ✅ App verificado pelo Google
- ✅ Tipo: **Externo** (External)

**O problema NÃO é o status do OAuth Consent Screen.**

---

## 🔴 Outras Causas Possíveis

### 1. URLs de Redirect Não Correspondem ⚠️

**Problema:** As URLs de redirect no código não correspondem exatamente às URLs no OAuth Client.

**Verificar:**
1. Acesse: https://console.cloud.google.com/apis/credentials?project=ntraining-484414
2. Clique no OAuth Client `n.training Web Client`
3. Verifique **exatamente** as URLs em "URIs de redirecionamento autorizadas"

**Deve conter EXATAMENTE:**
```
https://srrbomtdkghjxdhpeyel.supabase.co/auth/v1/callback
https://n-training.vercel.app/auth/callback
https://ntraining.ness.com.br/auth/callback
```

**O código usa:** `/auth/callback` (que internamente redireciona para o Supabase)

**Importante:** A URL que o Supabase retorna ao Google deve estar EXATAMENTE na lista acima.

### 2. Client ID/Secret Incorretos no Supabase ⚠️

**Problema:** Credenciais no Supabase não correspondem ao OAuth Client.

**Verificar:**
1. No Google Cloud Console, copie o **Client ID** e **Client Secret**
2. Acesse: https://supabase.com/dashboard/project/srrbomtdkghjxdhpeyel/auth/providers
3. Clique em "Google"
4. Compare:
   - Client ID no Supabase = Client ID no Google Cloud?
   - Client Secret no Supabase = Client Secret no Google Cloud?
5. Se não corresponderem, **cole as credenciais corretas** e salve

### 3. Domínios Não Autorizados ⚠️

**Problema:** Algum domínio usado não está na lista de "Authorized domains".

**Verificar:**
1. Acesse: https://console.cloud.google.com/apis/credentials/consent?project=ntraining-484414
2. Role até "Authorized domains"
3. Certifique-se de que contém:
   ```
   srrbomtdkghjxdhpeyel.supabase.co
   n-training.vercel.app
   ntraining.ness.com.br
   ness.com.br
   ```

### 4. Escopos Não Aprovados ⚠️

**Problema:** O app está solicitando escopos que não foram aprovados na verificação.

**Verificar:**
- O código usa apenas: `email`, `profile`, `openid` (escopos básicos)
- Se houver outros escopos, podem precisar ser aprovados

### 5. Limite de Usuários OAuth ⚠️

**Observação:** Vi que há "0 usuário / limite de 100 usuários"

- Este limite só se aplica quando usando escopos confidenciais/restritos não aprovados
- Para escopos básicos (`email`, `profile`, `openid`), o limite não deve se aplicar
- Mas se o erro ocorre, pode ser que algum escopo adicional esteja sendo solicitado

---

## ✅ Solução Passo a Passo

### PASSO 1: Verificar e Corrigir URLs de Redirect

1. **Acesse:** https://console.cloud.google.com/apis/credentials?project=ntraining-484414
2. **Clique no OAuth Client** (`n.training Web Client`)
3. **Verifique "URIs de redirecionamento autorizadas"**

**Deve conter EXATAMENTE:**
```
https://srrbomtdkghjxdhpeyel.supabase.co/auth/v1/callback
https://n-training.vercel.app/auth/callback
https://ntraining.ness.com.br/auth/callback
```

4. **Se faltar alguma ou estiver diferente, corrija e salve**

### PASSO 2: Verificar e Corrigir Credenciais no Supabase

1. **No Google Cloud Console**, copie:
   - Client ID
   - Client Secret (se necessário, recrie ou veja novamente)

2. **Acesse:** https://supabase.com/dashboard/project/srrbomtdkghjxdhpeyel/auth/providers

3. **Clique em "Google"**

4. **Compare e atualize:**
   - ✅ Enable Google provider: **ON**
   - ✅ Client ID (for OAuth): Cole do Google Cloud Console
   - ✅ Client Secret (for OAuth): Cole do Google Cloud Console

5. **Clique em "SAVE"**

### PASSO 3: Verificar Domínios Autorizados

1. **Acesse:** https://console.cloud.google.com/apis/credentials/consent?project=ntraining-484414
2. **Role até "Authorized domains"**
3. **Adicione os domínios se faltarem:**
   - `srrbomtdkghjxdhpeyel.supabase.co`
   - `n-training.vercel.app`
   - `ntraining.ness.com.br`
   - `ness.com.br`

### PASSO 4: Testar Novamente

1. **Limpe cookies do navegador** (ou use modo anônimo)
2. **Aguarde 2-3 minutos** após fazer alterações
3. **Acesse:** https://n-training.vercel.app/auth/login
4. **Clique em "Continuar com Google"**
5. **Observe o erro exato** que aparece

---

## 🔍 Informações para Debug

Se ainda não funcionar, me informe:

1. **Mensagem de erro exata** que aparece no navegador
2. **Console do navegador** (F12 → Console) - há erros JavaScript?
3. **Network tab** (F12 → Network) - qual requisição falha?
4. **Client ID** usado no Supabase (primeiros 20 caracteres)
5. **URL exata** que aparece quando clica em "Continuar com Google"

---

**Com o app em produção, o problema mais comum é URLs de redirect incorretas ou credenciais incorretas no Supabase.**

# 🔧 Recriar Cliente OAuth do Google - Guia Rápido

## ⚠️ Problema
**Erro:** `The OAuth client was deleted. Error 401: deleted_client`

O cliente OAuth foi deletado no Google Cloud Console e precisa ser recriado.

## 🚀 Solução Rápida

### Passo 1: Acessar Google Cloud Console

1. Acesse: https://console.cloud.google.com/apis/credentials?project=ntraining-484414
2. Certifique-se de que o projeto **`ntraining-484414`** está selecionado

### Passo 2: Criar Novo OAuth Client ID

1. Clique em **"+ CREATE CREDENTIALS"** ou **"+ CRIAR CREDENCIAIS"**
2. Selecione **"OAuth client ID"** ou **"ID do cliente OAuth"**

### Passo 3: Preencher Formulário

**Application type:**
- Selecione: **"Web application"** ou **"Aplicativo da Web"**

**Name:**
- Digite: `n.training Web Client`

**Authorized JavaScript origins:**
Clique em **"+ ADD URI"** e adicione **uma por vez** (3 URLs):

```
https://srrbomtdkghjxdhpeyel.supabase.co
https://n-training.vercel.app
http://localhost:3000
```

**Authorized redirect URIs:**
Clique em **"+ ADD URI"** e adicione **uma por vez** (3 URLs):

```
https://srrbomtdkghjxdhpeyel.supabase.co/auth/v1/callback
https://n-training.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

### Passo 4: Copiar Credenciais

1. Clique em **"CREATE"** ou **"CRIAR"**
2. **IMPORTANTE**: Uma janela popup aparecerá com:
   - **Your Client ID**: Copie e salve este valor
   - **Your Client Secret**: Copie e salve este valor (só aparece UMA VEZ!)

⚠️ **CRÍTICO**: Salve as credenciais antes de fechar a janela!

### Passo 5: Atualizar no Supabase

1. Acesse o Supabase Dashboard:
   - Vá em: **Authentication** → **Providers** → **Google**
   - Ou acesse diretamente: https://supabase.com/dashboard/project/srrbomtdkghjxdhpeyel/auth/providers

2. Configure:
   - **Enable Google provider**: Ative (toggle ON)
   - **Client ID (for OAuth)**: Cole o novo Client ID
   - **Client Secret (for OAuth)**: Cole o novo Client Secret

3. Clique em **"Save"**

### Passo 6: Testar

1. Acesse: https://n-training.vercel.app/auth/login
2. Clique em **"Continuar com Google"**
3. Verifique se o login funciona

## 📋 Checklist

- [ ] Novo OAuth Client ID criado no Google Cloud Console
- [ ] 3 JavaScript origins adicionadas corretamente
- [ ] 3 Redirect URIs adicionadas corretamente
- [ ] Client ID copiado
- [ ] Client Secret copiado e salvo
- [ ] Credenciais atualizadas no Supabase
- [ ] Login com Google testado e funcionando

## 🔍 Verificação

Se ainda houver problemas:

1. **Verifique o OAuth Consent Screen:**
   - Acesse: https://console.cloud.google.com/apis/credentials/consent?project=ntraining-484414
   - Certifique-se de que está configurado como **"External"**

2. **Verifique as URLs:**
   - JavaScript origins: apenas domínios (sem caminhos)
   - Redirect URIs: URLs completas com caminhos

3. **Aguarde alguns minutos:**
   - Mudanças no Google Cloud podem levar alguns minutos para propagar

---

**Após seguir estes passos, o login com Google deve funcionar novamente!** ✅

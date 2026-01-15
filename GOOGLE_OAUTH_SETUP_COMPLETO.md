# 🔐 Configuração Google OAuth - Guia Completo

## 📋 Informações do Projeto

- **Projeto GCP**: `ntraining-484414` (nTraining)
- **URL Supabase**: `https://qaekhnagfzpwprvaxqwt.supabase.co`
- **URL Produção**: `https://n-training.vercel.app`

## 🚀 Passo a Passo Detalhado

### Passo 1: Acessar Credentials

1. Acesse: https://console.cloud.google.com/apis/credentials?project=ntraining-484414
2. Certifique-se de que o projeto `ntraining-484414` está selecionado

### Passo 2: Criar OAuth Client ID

1. Clique em **"+ CREATE CREDENTIALS"** ou **"+ CRIAR CREDENCIAIS"**
2. Selecione **"OAuth client ID"** ou **"ID do cliente OAuth"**

### Passo 3: Preencher o Formulário

**Application type (Tipo de aplicação):**
- Selecione: **"Web application"** ou **"Aplicativo da Web"**

**Name (Nome):**
- Digite: `n.training Web Client`

**Authorized JavaScript origins (Origens JavaScript Autorizadas):**
Clique em **"+ ADD URI"** e adicione **uma por vez**:

```
https://qaekhnagfzpwprvaxqwt.supabase.co
https://n-training.vercel.app
http://localhost:3000
```

⚠️ **ATENÇÃO**: 
- Estas são as **origens** (domínios base)
- **NÃO** inclua caminhos como `/auth/callback`
- Use `https://` para produção, `http://` apenas para localhost

**Authorized redirect URIs (URIs de Redirecionamento Autorizadas):**
Clique em **"+ ADD URI"** e adicione **uma por vez**:

```
https://qaekhnagfzpwprvaxqwt.supabase.co/auth/v1/callback
https://n-training.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

⚠️ **ATENÇÃO**:
- Estas são as **URLs completas** incluindo o caminho
- O Supabase usa `/auth/v1/callback`
- Sua aplicação usa `/auth/callback`
- Localhost usa `/auth/callback` para desenvolvimento

### Passo 4: Criar e Copiar Credenciais

1. Clique em **"CREATE"** ou **"CRIAR"**
2. Uma janela popup aparecerá com:
   - **Your Client ID**: Copie este valor
   - **Your Client Secret**: Copie este valor

⚠️ **CRÍTICO**: O Client Secret só aparece **UMA VEZ**! Salve antes de fechar.

### Passo 5: Configurar no Supabase

1. Acesse o Supabase Dashboard e vá em: **Authentication** → **Providers** → **Google**
   (Ou acesse diretamente: https://supabase.com/dashboard/project/[seu-project-id]/auth/providers)
2. Clique em **"Google"**
3. Preencha:
   - **Enable Google provider**: Ative (toggle ON)
   - **Client ID (for OAuth)**: Cole o Client ID
   - **Client Secret (for OAuth)**: Cole o Client Secret
4. Clique em **"Save"**

## 📝 Resumo das URLs

### Authorized JavaScript origins:
```
https://qaekhnagfzpwprvaxqwt.supabase.co
https://n-training.vercel.app
http://localhost:3000
```

### Authorized redirect URIs:
```
https://qaekhnagfzpwprvaxqwt.supabase.co/auth/v1/callback
https://n-training.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

## ✅ Checklist

- [ ] OAuth Consent Screen configurado (se solicitado)
- [ ] OAuth Client ID criado
- [ ] 3 JavaScript origins adicionadas
- [ ] 3 Redirect URIs adicionadas
- [ ] Client ID copiado
- [ ] Client Secret copiado e salvo
- [ ] Credenciais configuradas no Supabase
- [ ] Teste de login realizado

---

**Após seguir estes passos, o login com Google deve funcionar!** ✅

# 🔐 Configuração Google OAuth - Guia Simplificado

## 🎯 Objetivo Final

Obter **Client ID** e **Client Secret** do Google para configurar no Supabase.

## 📍 URLs Importantes

- **Google Cloud Console**: https://console.cloud.google.com/?project=ntraining-484414
- **Supabase Auth Providers**: Acesse o Dashboard → Authentication → Providers → Google

## 🔑 URLs de Redirect que Você Precisa

Quando criar as credenciais OAuth, adicione estas URLs de redirect:

```
https://qaekhnagfzpwprvaxqwt.supabase.co/auth/v1/callback
https://n-training.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

## 📝 Passos Genéricos

### 1. Encontrar "APIs & Services" ou "APIs e Serviços"

No Google Cloud Console, procure no menu lateral por:
- "APIs & Services"
- "APIs e Serviços" 
- "APIs"
- Ou use a busca no topo: digite "OAuth" ou "Credentials"

### 2. Configurar OAuth Consent Screen (Tela de Consentimento)

Procure por:
- "OAuth consent screen"
- "Tela de consentimento OAuth"
- "Consent screen"

**O que você precisa preencher:**
- Tipo de usuário: **External** (para permitir qualquer usuário Google)
- Nome do app: `n.training`
- Email de suporte: seu email
- Escopos: `email`, `profile`, `openid`

### 3. Criar Credenciais OAuth

Procure por:
- "Credentials" ou "Credenciais"
- "Create Credentials" ou "Criar Credenciais"
- "OAuth client ID" ou "ID do cliente OAuth"

**Quando criar:**
- Tipo: **Web application** ou **Aplicativo da Web**
- Nome: `n.training Web Client`

**Authorized JavaScript origins (Origens JavaScript Autorizadas):**
Adicione estas URLs (uma por linha):
```
https://dcigykpfdehqbtbaxzak.supabase.co
https://n-training.vercel.app
http://localhost:3000
```

**Authorized redirect URIs (URIs de Redirecionamento Autorizadas):**
Adicione estas URLs (uma por linha):
```
https://qaekhnagfzpwprvaxqwt.supabase.co/auth/v1/callback
https://n-training.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

⚠️ **IMPORTANTE**: 
- Não inclua o caminho `/auth/v1/callback` nas JavaScript origins
- Inclua o caminho completo nas redirect URIs
- Não adicione espaços ou barras no final

### 4. Copiar Credenciais

Após criar, você verá:
- **Client ID**: Copie este valor
- **Client Secret**: Copie este valor (só aparece uma vez!)

### 5. Configurar no Supabase

1. Acesse o Supabase Dashboard → Authentication → Providers → Google
2. Clique em **"Google"**
3. Ative o toggle **"Enable Google provider"**
4. Cole o **Client ID**
5. Cole o **Client Secret**
6. Clique em **"Save"**

## 🆘 Me Ajude a Ajudar Você!

Para criar um guia mais preciso, me diga:

1. **O que você vê quando acessa o Google Cloud Console?**
   - Quais menus aparecem no lado esquerdo?
   - Há uma barra de busca no topo?

2. **Onde você está tentando criar as credenciais?**
   - Consegue encontrar "APIs & Services"?
   - Vê alguma opção relacionada a "OAuth" ou "Credentials"?

3. **Qual é a estrutura de menus que você vê?**
   - Por exemplo: "Home" → "APIs" → "Credentials"?
   - Ou algo diferente?

Com essas informações, posso criar um guia passo a passo exato para o que você está vendo! 🎯

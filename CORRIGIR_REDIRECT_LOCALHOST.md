# 🔧 Corrigir Redirecionamento para Localhost:3000

## ⚠️ Problema

Após a autenticação OAuth com Google, você está sendo redirecionado para `http://localhost:3000` ao invés de permanecer na URL da Vercel (`https://n-training.vercel.app`).

## 🔍 Causa Provável

O problema pode estar na **configuração do Supabase Dashboard** onde o OAuth está configurado para usar `localhost:3000` como Site URL padrão.

## ✅ Soluções

### Solução 1: Verificar e Corrigir Site URL no Supabase

1. **Acesse o Supabase Dashboard:**
   - URL: https://supabase.com/dashboard/project/srrbomtdkghjxdhpeyel
   - Vá em: **Authentication** → **URL Configuration**

2. **Verifique/Configure as URLs:**
   
   **Site URL** (URL base da aplicação):
   ```
   https://n-training.vercel.app
   ```
   ⚠️ **NÃO use `http://localhost:3000` aqui em produção!**
   
   **Redirect URLs** (URLs autorizadas para redirecionamento após OAuth):
   ```
   https://n-training.vercel.app/**
   http://localhost:3000/**
   ```
   
   ⚠️ **Importante:** O `**` no final permite qualquer caminho abaixo da URL base.

3. **Salve as alterações**

### Solução 2: Verificar Google Cloud Console

Certifique-se de que as URLs no Google Cloud Console estão corretas:

**Authorized redirect URIs:**
```
https://srrbomtdkghjxdhpeyel.supabase.co/auth/v1/callback
https://n-training.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

### Solução 3: Verificar Código (Já Corrigido)

O código já foi corrigido para:
- ✅ Usar sempre `window.location.origin` no cliente
- ✅ Usar sempre `requestUrl.origin` no callback route
- ✅ Normalizar o parâmetro `next` para sempre ser um caminho relativo

## 🔍 Como Verificar se Está Funcionando

1. **Faça deploy das mudanças:**
   ```bash
   vercel --prod
   ```

2. **Abra o Console do Navegador** (F12 → Console) e verifique os logs:
   - `[GoogleSignIn] RedirectTo URL:` deve mostrar `https://n-training.vercel.app/auth/callback?...`
   - `[OAuth Callback] Request Origin:` deve mostrar `https://n-training.vercel.app`

3. **Teste o fluxo completo:**
   - Acesse: https://n-training.vercel.app/auth/login
   - Clique em "Continuar com Google"
   - Após autenticar, verifique a URL final no navegador
   - Deve ser: `https://n-training.vercel.app/dashboard`

## 📋 Checklist

- [ ] Site URL no Supabase configurada como `https://n-training.vercel.app`
- [ ] Redirect URLs no Supabase incluem `https://n-training.vercel.app/**`
- [ ] URLs do Google Cloud Console estão corretas
- [ ] Deploy na Vercel realizado com as últimas correções
- [ ] Testado o fluxo completo após deploy

## 🚨 Se Ainda Não Funcionar

Se após seguir todos os passos acima o problema persistir:

1. **Limpe o cache do navegador:**
   - Ctrl+Shift+Del (Windows/Linux)
   - Cmd+Shift+Del (Mac)
   - Limpar cookies e cache

2. **Teste em uma janela anônima/privada**

3. **Verifique os logs do Supabase:**
   - Dashboard → Logs → Authentication
   - Procure por erros relacionados a redirect

4. **Verifique os logs da Vercel:**
   - Dashboard → Deployments → Funções
   - Procure por erros no `/auth/callback`
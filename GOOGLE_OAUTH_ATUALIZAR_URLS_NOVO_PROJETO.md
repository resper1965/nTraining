# 🔧 Atualizar Google OAuth para Novo Projeto Supabase

## ⚠️ Problema Atual
**Erro:** `The OAuth client was deleted. Error 401: deleted_client`

O projeto Supabase foi recriado, então as URLs mudaram e precisam ser atualizadas no Google Cloud Console.

## 📋 URLs do Novo Projeto

- **Novo URL Supabase**: `https://srrbomtdkghjxdhpeyel.supabase.co`
- **URL Produção**: `https://n-training.vercel.app`
- **URL Localhost**: `http://localhost:3000`

## 🔧 Solução: Atualizar URLs no Cliente OAuth Existente

### Opção 1: Editar o Cliente OAuth Existente (Recomendado)

Se o cliente OAuth já existe no Google Cloud Console, você pode **editar** as URLs ao invés de criar um novo:

1. **Acesse o Google Cloud Console:**
   - Vá para: https://console.cloud.google.com/apis/credentials?project=ntraining-484414
   - Certifique-se de que o projeto `ntraining-484414` está selecionado

2. **Encontre o Cliente OAuth:**
   - Na lista de "OAuth 2.0 Client IDs", encontre o cliente `n.training Web Client`
   - Clique no **ícone de edição (lápis)** ao lado do cliente

3. **Atualize as URLs:**

   **Authorized JavaScript origins:**
   - Remova URLs antigas se houver (referentes ao projeto antigo)
   - Adicione/Atualize para:
     ```
     https://srrbomtdkghjxdhpeyel.supabase.co
     https://n-training.vercel.app
     http://localhost:3000
     ```

   **Authorized redirect URIs:**
   - Remova URLs antigas se houver
   - Adicione/Atualize para:
     ```
     https://srrbomtdkghjxdhpeyel.supabase.co/auth/v1/callback
     https://n-training.vercel.app/auth/callback
     http://localhost:3000/auth/callback
     ```

4. **Clique em "SAVE" (Salvar)**

5. **Copie as Credenciais:**
   - **Client ID**: Deve estar visível na lista
   - **Client Secret**: Se precisar ver novamente, clique no ícone de olho 👁️ ou recrie

### Opção 2: Criar Novo Cliente OAuth

Se preferir criar um novo cliente:

1. **Acesse:** https://console.cloud.google.com/apis/credentials?project=ntraining-484414
2. **Clique em:** "+ CREATE CREDENTIALS" → "OAuth client ID"
3. **Tipo:** Web application
4. **Nome:** `n.training Web Client (Novo Projeto)`
5. **Adicione as URLs** (listadas acima)
6. **Copie Client ID e Client Secret**

## ⚙️ Atualizar Credenciais no Supabase

1. **Acesse o Supabase Dashboard:**
   - Vá para: https://supabase.com/dashboard/project/srrbomtdkghjxdhpeyel/auth/providers
   - Ou: Dashboard → Authentication → Providers → Google

2. **Configure o Provider:**
   - **Enable Google provider**: Ative (toggle ON)
   - **Client ID (for OAuth)**: Cole o Client ID (do cliente atualizado ou novo)
   - **Client Secret (for OAuth)**: Cole o Client Secret
   - Clique em **"Save"**

## ✅ Checklist

- [ ] URLs atualizadas no Google Cloud Console (JavaScript origins)
- [ ] URLs atualizadas no Google Cloud Console (Redirect URIs)
- [ ] Client ID copiado do Google Cloud Console
- [ ] Client Secret copiado do Google Cloud Console
- [ ] Credenciais atualizadas no Supabase
- [ ] Provider Google habilitado no Supabase
- [ ] Teste de login realizado

## 🔍 Verificar URLs Atuais no Google Cloud Console

Para verificar as URLs configuradas:

1. Acesse: https://console.cloud.google.com/apis/credentials?project=ntraining-484414
2. Clique no cliente OAuth para ver os detalhes
3. Verifique se as URLs listadas acima estão presentes

## ⚠️ Importante

- **JavaScript origins** devem ser apenas domínios (sem caminhos)
- **Redirect URIs** devem incluir o caminho completo
- O novo projeto Supabase usa: `srrbomtdkghjxdhpeyel` (não mais `qaekhnagfzpwprvaxqwt`)

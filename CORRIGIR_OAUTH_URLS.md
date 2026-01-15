# 🔧 Correção Urgente: URLs OAuth no Google Cloud Console

## ⚠️ PROBLEMA IDENTIFICADO

O OAuth client no Google Cloud Console está usando **URLs do projeto antigo** misturadas com o projeto novo!

### URLs Atuais (INCORRETAS):
- ❌ `https://qaekhnagfzpwprvaxqwt.supabase.co` (projeto antigo)
- ✅ `https://srrbomtdkghjxdhpeyel.supabase.co` (projeto novo - presente apenas nos redirects)

### Projeto Atual:
- **Novo Projeto:** `srrbomtdkghjxdhpeyel`
- **Projeto Antigo:** `qaekhnagfzpwprvaxqwt` (DELETADO)

---

## ✅ CORREÇÃO NECESSÁRIA

### Passo 1: Editar OAuth Client

No Google Cloud Console, você deve **ATUALIZAR** as URLs para usar apenas o projeto novo:

#### Origens JavaScript Autorizadas:
**REMOVER:**
- ❌ `https://qaekhnagfzpwprvaxqwt.supabase.co`

**MANTER/ADICIONAR:**
- ✅ `https://srrbomtdkghjxdhpeyel.supabase.co`
- ✅ `https://n-training.vercel.app`
- ✅ `http://localhost:3000`

#### URIs de Redirecionamento Autorizadas:
**REMOVER:**
- ❌ `https://qaekhnagfzpwprvaxqwt.supabase.co/auth/v1/callback`

**MANTER:**
- ✅ `https://srrbomtdkghjxdhpeyel.supabase.co/auth/v1/callback` (já está presente)
- ✅ `https://n-training.vercel.app/auth/callback`
- ✅ `http://localhost:3000/auth/callback`

**OPCIONAL (se necessário):**
- ⚠️ `https://ntraining.ness.com.br/auth/callback` (verificar se este domínio está correto)

---

## 📋 URLs FINAIS CORRETAS

### Origens JavaScript Autorizadas (3 URLs):
```
https://srrbomtdkghjxdhpeyel.supabase.co
https://n-training.vercel.app
http://localhost:3000
```

### URIs de Redirecionamento Autorizadas (3 URLs):
```
https://srrbomtdkghjxdhpeyel.supabase.co/auth/v1/callback
https://n-training.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

---

## 🚀 Passo a Passo Rápido

1. **No Google Cloud Console, clique no OAuth Client para editar**

2. **Na seção "Origens JavaScript autorizadas":**
   - Remova: `https://qaekhnagfzpwprvaxqwt.supabase.co`
   - Adicione (se não existir): `https://srrbomtdkghjxdhpeyel.supabase.co`
   - Mantenha: `https://n-training.vercel.app`
   - Mantenha/Adicione: `http://localhost:3000`

3. **Na seção "URIs de redirecionamento autorizadas":**
   - Remova: `https://qaekhnagfzpwprvaxqwt.supabase.co/auth/v1/callback`
   - Mantenha: `https://srrbomtdkghjxdhpeyel.supabase.co/auth/v1/callback`
   - Mantenha: `https://n-training.vercel.app/auth/callback`
   - Mantenha/Adicione: `http://localhost:3000/auth/callback`

4. **Clique em "SALVAR"**

5. **Teste o login com Google novamente**

---

## ⚠️ IMPORTANTE

- **NÃO delete o OAuth client**, apenas **edite as URLs**
- O Client ID e Client Secret permanecem os mesmos
- Após salvar, pode levar alguns minutos para propagar
- Teste imediatamente após salvar

---

**Após fazer essas correções, o login com Google deve funcionar! ✅**

# 🔧 Configuração OAuth - Supabase Callback URL

## 📋 URLs do OAuth Flow

### 1. Callback URL do Supabase (interno)
Esta URL é usada pelo Google OAuth para retornar ao Supabase:
```
https://srrbomtdkghjxdhpeyel.supabase.co/auth/v1/callback
```

**Esta URL deve estar no Google Cloud Console** nas "URIs de redirecionamento autorizadas".

### 2. Redirect URL da Aplicação (depois do Supabase)
Esta é a URL para onde o Supabase redireciona após processar o OAuth:
```
https://n-training.vercel.app/auth/callback
https://ntraining.ness.com.br/auth/callback
http://localhost:3000/auth/callback (desenvolvimento)
```

**Esta URL deve estar autorizada no Supabase Dashboard** em:
- Authentication → URL Configuration → Redirect URLs

## ✅ Como Configurar Corretamente

### Passo 1: Google Cloud Console
1. Acesse: https://console.cloud.google.com/apis/credentials
2. Clique no OAuth Client (`n.training Web Client`)
3. Em "URIs de redirecionamento autorizadas", adicione:
   ```
   https://srrbomtdkghjxdhpeyel.supabase.co/auth/v1/callback
   ```
4. Salve

### Passo 2: Supabase Dashboard
1. Acesse: https://supabase.com/dashboard/project/srrbomtdkghjxdhpeyel/auth/url-configuration
2. Em "Redirect URLs", adicione:
   ```
   https://n-training.vercel.app/auth/callback
   https://ntraining.ness.com.br/auth/callback
   http://localhost:3000/auth/callback
   ```
3. Salve

### Passo 3: Verificar Configuração
O código em `components/auth/google-signin-button.tsx` já configura corretamente:
```typescript
const callbackUrl = `${currentOrigin}/auth/callback?next=${encodeURIComponent(redirectPath)}`

await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: callbackUrl, // Esta URL deve estar autorizada no Supabase
  },
})
```

## 🐛 Problema: Redirecionamento para Landing Page

Se após OAuth você está sendo redirecionado para `/landing` em vez de `/dashboard`, isso pode indicar:

1. **URL não autorizada no Supabase**: O `redirectTo` não está nas URLs permitidas
2. **Supabase redireciona para `/`**: Quando a URL não é autorizada, o Supabase pode redirecionar para a raiz
3. **`app/page.tsx` redireciona para `/landing`**: Quando não há usuário autenticado

### Como Verificar
1. Verifique o console do navegador após tentar login OAuth
2. Veja qual URL está sendo chamada
3. Verifique se há erros relacionados a "redirect URL not authorized"

## 🔍 Debug

Para debug, adicione logs no `google-signin-button.tsx`:
```typescript
console.log('[GoogleSignIn] Callback URL:', callbackUrl)
console.log('[GoogleSignIn] Origin:', currentOrigin)
```

E verifique o callback:
```typescript
// No app/auth/callback/page.tsx
console.log('[OAuth Callback] URL:', window.location.href)
console.log('[OAuth Callback] Search params:', searchParams.toString())
```

## ✅ Checklist

- [ ] URL do Supabase (`https://srrbomtdkghjxdhpeyel.supabase.co/auth/v1/callback`) está no Google Cloud Console
- [ ] URLs da aplicação estão autorizadas no Supabase Dashboard
- [ ] `redirectTo` está sendo passado corretamente no `signInWithOAuth`
- [ ] Logs mostram a URL correta sendo usada

# 🔐 URLs Corretas para Google OAuth

## ✅ URLs Atualizadas

Use estas URLs ao configurar o OAuth no Google Cloud Console:

### Authorized JavaScript origins (Origens JavaScript Autorizadas):

Adicione estas 3 URLs (uma por vez):

```
https://qaekhnagfzpwprvaxqwt.supabase.co
https://n-training.vercel.app
http://localhost:3000
```

### Authorized redirect URIs (URIs de Redirecionamento Autorizadas):

Adicione estas 3 URLs (uma por vez):

```
https://qaekhnagfzpwprvaxqwt.supabase.co/auth/v1/callback
https://n-training.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

## 📋 Resumo Visual

No formulário do Google Cloud Console, você verá:

**Authorized JavaScript origins:**
```
[+ ADD URI]
  ✓ https://qaekhnagfzpwprvaxqwt.supabase.co
  ✓ https://n-training.vercel.app
  ✓ http://localhost:3000
```

**Authorized redirect URIs:**
```
[+ ADD URI]
  ✓ https://qaekhnagfzpwprvaxqwt.supabase.co/auth/v1/callback
  ✓ https://n-training.vercel.app/auth/callback
  ✓ http://localhost:3000/auth/callback
```

## ⚠️ Importante

- **JavaScript origins**: Apenas o domínio (sem caminhos)
- **Redirect URIs**: URL completa com o caminho `/auth/v1/callback` ou `/auth/callback`
- Não adicione espaços ou barras no final
- Use `https://` para produção, `http://` apenas para localhost

---

**Copie e cole estas URLs exatamente como estão acima!** ✅

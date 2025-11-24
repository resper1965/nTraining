# 🔐 Sistema de Autenticação - n.training

## ✅ Implementação Completa

Sistema de autenticação restaurado com **login apenas** (sem signup). Usuários são criados diretamente no banco de dados via painel administrativo.

## 📋 Arquitetura

### Autenticação
- ✅ **Login**: `/auth/login` - Usuários fazem login com email/senha
- ❌ **Signup**: Removido - Usuários não podem se cadastrar
- ✅ **Logout**: Funcional via `signOut()`
- ✅ **Middleware**: Protege rotas e redireciona para login quando necessário

### Criação de Usuários
- ✅ **Admin Panel**: `/admin/users/new` - Superadmins criam usuários
- ✅ **Função `createUser()`**: Usa Supabase Admin API com Service Role Key
- ✅ **Auto-confirmação**: Email confirmado automaticamente
- ✅ **Sincronização**: Cria em `auth.users` e `users` simultaneamente

## 🔑 Fluxo de Autenticação

### 1. Login
```
Usuário acessa /auth/login
  ↓
Preenche email/senha
  ↓
signIn() valida credenciais
  ↓
Atualiza last_login_at
  ↓
Redireciona para /dashboard ou URL de redirect
```

### 2. Criação de Usuário (Admin)
```
Superadmin acessa /admin/users/new
  ↓
Preenche dados do usuário
  ↓
createUser() usa Service Role Key
  ↓
Cria em auth.users (email confirmado)
  ↓
Cria em users table
  ↓
Usuário pode fazer login imediatamente
```

## 🛡️ Proteção de Rotas

### Middleware
- Protege rotas: `/dashboard`, `/courses`, `/admin`
- Redireciona não autenticados para `/auth/login`
- Mantém sessão do Supabase Auth

### Helpers de Autenticação
- `requireAuth()` - Requer autenticação, redireciona se não autenticado
- `requireRole(role)` - Requer role específico
- `requireSuperAdmin()` - Requer superadmin
- `getCurrentUser()` - Retorna usuário atual ou null

## 📝 Páginas Implementadas

### Autenticação
- ✅ `/auth/login` - Página de login

### Admin
- ✅ `/admin/users` - Lista de usuários
- ✅ `/admin/users/new` - Criar novo usuário
- ✅ `/admin/tenants` - Gerenciar tenants
- ✅ `/admin/courses` - Gerenciar cursos

### Usuário
- ✅ `/dashboard` - Dashboard do usuário
- ✅ `/courses` - Lista de cursos
- ✅ `/courses/[slug]` - Detalhes do curso

## 🔧 Configuração Necessária

### Variáveis de Ambiente
```env
NEXT_PUBLIC_SUPABASE_URL=https://dcigykpfdehqbtbaxzak.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Necessário para criar usuários
```

### Service Role Key
- **Obrigatório** para criar usuários via admin
- Configurar no Vercel: Settings → Environment Variables
- **Nunca** expor no client-side

## 🚀 Como Usar

### Criar Usuário (Superadmin)
1. Acesse `/admin/users/new`
2. Preencha:
   - Nome completo
   - E-mail
   - Senha (mínimo 8 caracteres)
   - Papel (student, org_manager, platform_admin)
   - Organização (opcional)
3. Clique em "Criar Usuário"
4. Usuário pode fazer login imediatamente

### Login
1. Acesse `/auth/login`
2. Digite email e senha
3. Será redirecionado para `/dashboard`

### Logout
- Botão "Sair" no dashboard/admin
- Redireciona para home page

## 📚 Funções Disponíveis

### `app/actions/auth.ts`
- `signIn(formData)` - Fazer login
- `signOut()` - Fazer logout
- `createUser(formData)` - Criar usuário (admin only)

### `lib/supabase/server.ts`
- `getCurrentUser()` - Obter usuário atual
- `requireAuth()` - Requer autenticação
- `requireRole(role)` - Requer role específico
- `requireSuperAdmin()` - Requer superadmin
- `getUserById(userId)` - Buscar usuário por ID

## ⚠️ Importante

1. **Service Role Key**: Deve estar configurado no Vercel para criar usuários
2. **Sem Signup**: Usuários não podem se cadastrar sozinhos
3. **Admin Only**: Apenas superadmins podem criar usuários
4. **Email Auto-confirmado**: Usuários criados via admin não precisam confirmar email

---

**Status**: ✅ Sistema completo e funcional


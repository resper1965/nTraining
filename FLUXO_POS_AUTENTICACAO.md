# 🔄 Fluxo Normal Após Autenticação - n.training

## 📋 Visão Geral

Este documento descreve o fluxo completo que um usuário segue após fazer login na plataforma n.training.

---

## 🔐 1. Autenticação (Login)

### 1.1 Acesso à Página de Login
- **URL**: `/auth/login`
- Usuário acessa a página de login
- Formulário com campos: **Email** e **Senha**

### 1.2 Processo de Login
```typescript
// app/actions/auth.ts - signIn()
1. Valida email e senha
2. Chama supabase.auth.signInWithPassword()
3. Se sucesso:
   - Atualiza last_login_at na tabela users
   - Redireciona para /dashboard (ou URL de redirect)
4. Se erro:
   - Redireciona de volta para /auth/login com mensagem de erro
```

### 1.3 Middleware de Proteção
```typescript
// middleware.ts
- Verifica autenticação em todas as requisições
- Rotas protegidas: /dashboard, /courses, /admin
- Se não autenticado → redireciona para /auth/login
- Se autenticado e acessando /auth/login → redireciona para /dashboard
```

---

## 🏠 2. Dashboard (Página Principal)

### 2.1 Redirecionamento Após Login
- **URL padrão**: `/dashboard`
- **URL customizada**: Se havia um `redirect` param, vai para aquela URL

### 2.2 O que o Dashboard Mostra

#### **Header**
- Mensagem de boas-vindas: "Welcome back, {nome}!"
- Botão "Sair" (logout)

#### **Estatísticas (Cards)**
1. **Courses in Progress** - Quantidade de cursos em andamento
2. **Completed Courses** - Quantidade de cursos completados
3. **Available Courses** - Total de cursos disponíveis

#### **Cursos em Progresso**
- Lista dos 3 primeiros cursos em andamento
- Mostra:
  - Título do curso
  - Porcentagem de conclusão
  - Barra de progresso visual
  - Botão "Continue" para retomar

#### **Cursos Disponíveis**
- Lista dos 6 primeiros cursos publicados
- Mostra:
  - Título e descrição
  - Nível (beginner/intermediate/advanced)
  - Duração em horas
  - Botão "Start Course" ou "Continue" (se já iniciado)
- Link "View All" para ver todos os cursos

### 2.3 Dados Carregados
```typescript
// app/dashboard/page.tsx
- requireAuth() → Verifica autenticação
- getUserProgress() → Busca progresso do usuário
- getCoursesWithProgress() → Busca cursos com progresso
```

---

## 📚 3. Navegação para Cursos

### 3.1 Lista de Cursos
- **URL**: `/courses`
- **Acesso**: Clicando em "View All" no dashboard ou navegação direta

#### **Funcionalidades**
- **Filtros Laterais**:
  - Por nível (Beginner, Intermediate, Advanced)
  - Por área (ex: Cybersecurity, Cloud, Development)
  - Busca por texto (título/descrição)

- **Grid de Cursos**:
  - Cards com informações do curso
  - Mostra progresso se já iniciado
  - Link para detalhes do curso

### 3.2 Detalhes do Curso
- **URL**: `/courses/[slug]`
- **Acesso**: Clicando em um curso na lista

#### **Informações Exibidas**
- **Header do Curso**:
  - Thumbnail
  - Título e descrição completa
  - Metadados: nível, duração, área
  - Barra de progresso (se inscrito)
  - Botão "Enroll Now" ou "Continue Course"

- **Objetivos do Curso**:
  - Lista de objetivos de aprendizado

- **Conteúdo do Curso**:
  - Lista de módulos
  - Lista de aulas dentro de cada módulo
  - Links para cada aula

### 3.3 Player de Aula
- **URL**: `/courses/[slug]/[moduleId]/[lessonId]`
- **Acesso**: Clicando em uma aula específica

#### **Funcionalidades**
- **Player de Conteúdo**:
  - Vídeo, texto, PDF ou quiz (dependendo do tipo)
  - Controles de reprodução
  - Rastreamento de progresso automático

- **Navegação**:
  - Botão "Previous Lesson" (se houver)
  - Botão "Next Lesson" (se houver)
  - Botão "Mark as Complete" (quando terminar)

- **Sidebar**:
  - Título do curso
  - Barra de progresso geral
  - Lista completa de módulos e aulas
  - Indicação de aulas completadas

---

## 🔄 4. Fluxo de Progresso

### 4.1 Rastreamento Automático
```typescript
// Quando usuário assiste uma aula:
1. updateLessonProgress() → Atualiza tempo assistido
2. markLessonComplete() → Marca aula como completa
3. updateCourseProgressFromLessons() → Recalcula progresso do curso
```

### 4.2 Atualização em Tempo Real
- Progresso é salvo automaticamente
- Dashboard atualiza ao retornar
- Barra de progresso reflete status atual

---

## 👤 5. Perfis de Usuário

### 5.1 Estudante (Student)
**Acesso:**
- ✅ Dashboard
- ✅ Lista de cursos
- ✅ Detalhes de cursos
- ✅ Player de aulas
- ✅ Seu próprio progresso

**Restrições:**
- ❌ Não pode criar/editar cursos
- ❌ Não pode acessar área admin
- ❌ Não pode ver progresso de outros usuários

### 5.2 Gerente de Organização (Org Manager)
**Acesso:**
- ✅ Tudo que estudante tem acesso
- ✅ Gerenciar usuários da sua organização
- ✅ Ver relatórios da organização

**Restrições:**
- ❌ Não pode criar/editar cursos globalmente
- ❌ Não pode acessar admin completo

### 5.3 Administrador da Plataforma (Platform Admin)
**Acesso:**
- ✅ Tudo que outros perfis têm acesso
- ✅ `/admin/courses` - Gerenciar cursos
- ✅ `/admin/users` - Gerenciar usuários
- ✅ `/admin/tenants` - Gerenciar organizações
- ✅ Criar/editar/deletar cursos
- ✅ Criar usuários diretamente

### 5.4 Superadmin
**Acesso:**
- ✅ Tudo que Platform Admin tem acesso
- ✅ Acesso total ao sistema
- ✅ Bypass de verificações de role
- ✅ Criar usuários via `/admin/users/new`

---

## 🚪 6. Logout

### 6.1 Processo de Logout
- **Botão**: "Sair" no dashboard ou admin
- **Ação**: `signOut()` em `app/actions/auth.ts`

```typescript
1. Chama supabase.auth.signOut()
2. Limpa sessão/cookies
3. Redireciona para home page (/)
```

### 6.2 Após Logout
- Usuário volta para home page
- Sessão é completamente limpa
- Tentativas de acessar rotas protegidas → redireciona para login

---

## 🔒 7. Proteção de Rotas

### 7.1 Middleware (Nível de Requisição)
```typescript
// middleware.ts
- Executa em TODAS as requisições
- Verifica autenticação via cookies
- Redireciona não autenticados para /auth/login
- Mantém sessão do Supabase atualizada
```

### 7.2 Server Components (Nível de Página)
```typescript
// Cada página protegida usa:
const user = await requireAuth()
// Se não autenticado → redirect automático para /auth/login
```

### 7.3 Server Actions (Nível de Ação)
```typescript
// Actions que precisam de autenticação:
const user = await requireAuth()
// Garante que usuário está autenticado antes de executar ação
```

---

## 📊 8. Fluxo Completo Visual

```
┌─────────────────┐
│   Home Page (/) │
└────────┬────────┘
         │
         │ Clica "Entrar"
         ▼
┌─────────────────┐
│  /auth/login    │
│  (Login Form)    │
└────────┬────────┘
         │
         │ Submit com credenciais
         ▼
┌─────────────────┐
│  signIn()       │
│  - Valida       │
│  - Autentica    │
│  - Atualiza DB  │
└────────┬────────┘
         │
         │ Sucesso
         ▼
┌─────────────────┐
│  /dashboard     │◄──┐
│  - Stats        │   │
│  - Progress     │   │
│  - Courses      │   │
└────────┬────────┘   │
         │            │
         │            │ Navegação
         ▼            │
┌─────────────────┐   │
│  /courses       │   │
│  - Lista        │   │
│  - Filtros      │   │
└────────┬────────┘   │
         │            │
         │ Clica curso│
         ▼            │
┌─────────────────┐   │
│  /courses/[slug]│   │
│  - Detalhes     │   │
│  - Módulos      │   │
└────────┬────────┘   │
         │            │
         │ Clica aula │
         ▼            │
┌─────────────────┐   │
│  /courses/.../  │   │
│  [lessonId]     │   │
│  - Player       │   │
│  - Progress     │   │
└────────┬────────┘   │
         │            │
         │            │
         └────────────┘
```

---

## 🎯 9. Casos de Uso Comuns

### Caso 1: Usuário Novo (Primeiro Acesso)
1. Login → Dashboard
2. Dashboard mostra "0 cursos em progresso"
3. Vê lista de cursos disponíveis
4. Clica em um curso → Detalhes
5. Clica "Enroll Now" → Inscrito
6. Clica "Start Course" → Primeira aula
7. Assistir aula → Progresso atualizado

### Caso 2: Usuário Retornando
1. Login → Dashboard
2. Dashboard mostra cursos em progresso
3. Clica "Continue" em um curso
4. Vai para última aula assistida
5. Continua de onde parou

### Caso 3: Admin Criando Curso
1. Login como superadmin → Dashboard
2. Navega para `/admin/courses`
3. Clica "New Course"
4. Preenche formulário
5. Salva → Curso criado
6. Publica curso → Disponível para estudantes

---

## ⚙️ 10. Detalhes Técnicos

### 10.1 Verificação de Autenticação
```typescript
// lib/supabase/server.ts
getCurrentUser() → Busca usuário do Supabase Auth
requireAuth() → Se não autenticado, redirect para /auth/login
```

### 10.2 Atualização de Progresso
```typescript
// app/actions/progress.ts
updateLessonProgress() → Salva tempo assistido
markLessonComplete() → Marca como completo
updateCourseProgressFromLessons() → Recalcula % do curso
```

### 10.3 Busca de Dados
```typescript
// app/actions/courses.ts
getCourses() → Lista cursos (filtrados por role)
getCoursesWithProgress() → Cursos + progresso do usuário
getCourseBySlug() → Detalhes completos do curso
```

---

## 📝 Resumo

**Fluxo Principal:**
1. Login → `/auth/login`
2. Dashboard → `/dashboard` (visão geral)
3. Cursos → `/courses` (explorar)
4. Detalhes → `/courses/[slug]` (inscrever-se)
5. Aula → `/courses/[slug]/[moduleId]/[lessonId]` (aprender)
6. Progresso → Atualizado automaticamente
7. Retorno → Dashboard mostra onde parou

**Proteção:**
- Middleware verifica todas as rotas
- Server Components usam `requireAuth()`
- Server Actions verificam autenticação
- Redirecionamento automático se não autenticado

**Experiência do Usuário:**
- Login simples e direto
- Dashboard informativo
- Navegação intuitiva
- Progresso sempre visível
- Retomada fácil de onde parou

---

**Última atualização**: 2024-11-24


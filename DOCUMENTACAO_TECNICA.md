# 📋 Documentação Técnica - n.training Platform

**Versão:** 1.0.0  
**Data:** 2026-01-14  
**Framework:** Next.js 14 (App Router)  
**Linguagem:** TypeScript  
**Banco de Dados:** Supabase (PostgreSQL)  
**Arquitetura:** Service Layer + Validation Layer (Layered Architecture)

---

## 1. Visão Geral do Projeto

### 1.1 Propósito

**n.training** é uma plataforma corporativa de EAD (Ensino a Distância) focada em treinamentos de Segurança da Informação. A aplicação oferece:

- **Gestão Multi-tenant**: Suporte a múltiplas organizações (tenants) com isolamento completo de dados
- **Sistema de Cursos**: Criação, personalização e distribuição de cursos por organização
- **Trilhas de Aprendizado**: Organização de cursos em sequências estruturadas
- **Sistema de Progresso**: Rastreamento detalhado de progresso por usuário, curso e aula
- **Quizzes e Avaliações**: Sistema completo de questionários com múltiplas tentativas
- **Certificados**: Geração automática de certificados em PDF
- **Notificações**: Sistema in-app e por email (via Resend)
- **Painel Administrativo**: Gestão completa de organizações, usuários, cursos e licenças

### 1.2 Entry Points

- **`app/page.tsx`**: Página raiz que redireciona baseado no status do usuário (superadmin → `/admin`, ativo → `/dashboard`, pendente → `/auth/waiting-room`)
- **`app/layout.tsx`**: Layout raiz com configuração de fontes (Inter, Montserrat), ErrorBoundary e Toaster
- **`middleware.ts`**: Middleware Next.js para proteção de rotas e autenticação básica
- **`app/actions/*.ts`**: Server Actions (Control Layer) - orquestram o fluxo: Auth → Validation → Service → Response
- **`lib/services/*.service.ts`**: Service Layer - contém toda lógica de negócio e queries ao banco
- **`lib/validators/*.schema.ts`**: Validation Layer - schemas Zod para validação de inputs

---

## 2. Stack Tecnológico

### 2.1 Framework e Runtime

- **Next.js**: `^14.2.0` (App Router)
- **React**: `^18.3.0`
- **TypeScript**: `^5.5.0`
- **Node.js**: Implícito (Next.js 14 requer Node.js 18+)

### 2.2 Banco de Dados e Autenticação

- **Supabase**: `@supabase/supabase-js@^2.39.0`
  - PostgreSQL como banco de dados
  - Supabase Auth para autenticação
  - Row Level Security (RLS) para isolamento multi-tenant
  - Storage para arquivos (vídeos, PDFs, imagens)
- **Supabase SSR**: `@supabase/ssr@^0.7.0` (Server-Side Rendering)

### 2.3 UI e Estilização

- **Tailwind CSS**: `^3.4.4`
- **shadcn/ui**: Componentes baseados em Radix UI
  - `@radix-ui/react-*`: Componentes acessíveis (dialog, dropdown, tabs, etc.)
- **Lucide React**: `^0.400.0` (Ícones)
- **Sonner**: `^2.0.7` (Toast notifications)

### 2.4 Utilitários e Bibliotecas

- **date-fns**: `^4.1.0` (Manipulação de datas)
- **zod**: `^4.1.12` (Validação de schemas)
- **class-variance-authority**: `^0.7.0` (Variantes de componentes)
- **@dnd-kit**: `^6.3.1` (Drag and drop para reordenação)
- **@react-pdf/renderer**: `^4.3.1` (Geração de PDFs para certificados)
- **resend**: `^6.5.2` (Envio de emails)

### 2.5 Desenvolvimento

- **ESLint**: `^8.57.0` (com `eslint-config-next`)
- **PostCSS**: `^8.4.39`
- **Autoprefixer**: `^10.4.19`

---

## 3. Arquitetura de Pastas

### 3.1 Estrutura Geral

```
n.training/
├── app/                    # Next.js App Router
│   ├── (main)/             # Grupo de rotas para usuários autenticados
│   │   ├── dashboard/      # Dashboard do usuário
│   │   ├── courses/       # Listagem e visualização de cursos
│   │   ├── certificates/  # Certificados do usuário
│   │   ├── notifications/  # Notificações
│   │   ├── paths/         # Trilhas de aprendizado
│   │   ├── profile/       # Perfil do usuário
│   │   ├── search/        # Busca
│   │   └── layout.tsx      # Layout com Header para usuários autenticados
│   ├── (admin)/            # Painel administrativo (superadmin)
│   │   └── admin/          # Admin route group
│   │       ├── courses/   # CRUD de cursos
│   │       ├── organizations/ # CRUD de organizações
│   │       ├── users/     # Gestão de usuários
│   │       ├── licenses/  # Gestão de licenças
│   │       ├── paths/     # CRUD de trilhas
│   │       ├── quizzes/   # CRUD de quizzes
│   │       └── layout.tsx # Layout admin com sidebar
│   ├── actions/            # Server Actions (Control Layer)
│   │   ├── auth.ts         # Autenticação (usa AuthService)
│   │   ├── courses.ts      # Cursos (usa CourseService)
│   │   ├── users.ts        # Usuários (usa UserService)
│   │   ├── modules.ts      # Módulos (usa ContentService)
│   │   ├── lessons.ts      # Aulas (usa ContentService)
│   │   ├── quizzes.ts      # Quizzes (usa QuizService)
│   │   ├── organizations.ts # Organizações (usa OrganizationService)
│   │   └── ...             # Outras actions
│   ├── auth/               # Autenticação
│   │   ├── login/         # Página de login
│   │   ├── signup/        # Página de cadastro
│   │   └── waiting-room/  # Sala de espera (usuários pendentes)
│   ├── api/                # API Routes (mínimo uso)
│   │   └── profile/       # API para perfil (notificações)
│   ├── layout.tsx          # Layout raiz
│   └── page.tsx             # Página inicial (redirecionamento)
├── components/              # Componentes React
│   ├── ui/                 # Componentes shadcn/ui (Button, Card, etc.)
│   ├── admin/              # Componentes específicos do admin
│   ├── layout/             # Header, Sidebar, etc.
│   ├── lesson-player/      # Player de aulas
│   ├── quiz/               # Componentes de quiz
│   ├── certificates/       # Componentes de certificados
│   └── notifications/      # Componentes de notificações
├── lib/                     # Bibliotecas e utilitários
│   ├── auth/               # Helpers de autenticação
│   │   ├── helpers.ts     # getCurrentUser, requireAuth, requireSuperAdmin
│   │   ├── context.ts     # AsyncLocalStorage para cache request-scoped
│   │   ├── types.ts       # Tipos de autenticação
│   │   └── index.ts       # Public exports
│   ├── services/           # Service Layer (Lógica de Negócio)
│   │   ├── auth.service.ts      # Autenticação service
│   │   ├── course.service.ts    # Cursos service
│   │   ├── user.service.ts      # Usuários service
│   │   ├── content.service.ts   # Módulos & Aulas service
│   │   ├── quiz.service.ts      # Quizzes service
│   │   └── organization.service.ts # Organizações service
│   ├── validators/         # Validation Layer (Zod Schemas)
│   │   ├── auth.schema.ts        # Validação de autenticação
│   │   ├── course.schema.ts      # Validação de cursos
│   │   ├── user.schema.ts        # Validação de usuários
│   │   ├── content.schema.ts     # Validação de módulos & aulas
│   │   ├── quiz.schema.ts        # Validação de quizzes
│   │   └── organization.schema.ts # Validação de organizações
│   ├── supabase/           # Cliente Supabase
│   │   ├── server.ts      # createClient() para server-side (com wrappers de compatibilidade)
│   │   ├── database.types.ts # Tipos TypeScript do banco
│   │   ├── schema.sql     # Schema completo do banco
│   │   └── migrations/    # Migrações SQL (11 arquivos)
│   ├── email/              # Templates de email (Resend)
│   ├── certificates/      # Geração de PDFs
│   ├── notifications/      # Triggers de notificações
│   └── types/              # Tipos TypeScript compartilhados
├── hooks/                   # React Hooks customizados
├── public/                   # Arquivos estáticos
├── scripts/                  # Scripts utilitários
└── middleware.ts             # Middleware Next.js (proteção de rotas)
```

### 3.2 Padrão Arquitetural: Layered Architecture

O projeto segue uma **arquitetura em camadas (Layered Architecture)** com separação clara de responsabilidades:

#### 3.2.1 Camadas da Arquitetura

1. **Control Layer** (`app/actions/*.ts`)
   - Server Actions que orquestram o fluxo
   - Responsabilidades:
     - ✅ Verificação de autenticação/autorização
     - ✅ Extração de dados de `FormData`
     - ✅ Validação de inputs (chama Validation Layer)
     - ✅ Chamada de services (Service Layer)
     - ✅ `revalidatePath()` e `redirect()` quando necessário
   - ❌ **NÃO** contém lógica de negócio
   - ❌ **NÃO** faz queries diretas ao banco

2. **Validation Layer** (`lib/validators/*.schema.ts`)
   - Schemas Zod para validação de inputs
   - Responsabilidades:
     - ✅ Validação de tipos e formatos
     - ✅ Sanitização de inputs (previne SQL Injection)
     - ✅ Mensagens de erro em português
     - ✅ Exporta tipos TypeScript inferidos
   - Exemplo: `CourseCreateSchema`, `UserFiltersSchema`

3. **Service Layer** (`lib/services/*.service.ts`)
   - Lógica de negócio e acesso ao banco de dados
   - Responsabilidades:
     - ✅ Todas as queries ao banco de dados
     - ✅ Lógica de negócio (cálculos, transformações)
     - ✅ Tratamento de erros tipados
     - ✅ Retorna dados puros ou lança erros
   - ❌ **NUNCA** recebe `FormData`
   - ❌ **NUNCA** usa `redirect()` ou `revalidatePath()`
   - ❌ **NUNCA** faz validação (delegada para Validation Layer)

4. **Data Layer** (Supabase)
   - PostgreSQL via Supabase
   - Row Level Security (RLS) para isolamento multi-tenant

#### 3.2.2 Fluxo de Execução

```
Client Component
    ↓ (formAction)
Server Action (Control Layer)
    ↓ (1. Auth Check)
Auth Helpers
    ↓ (2. Validate)
Zod Schema (Validation Layer)
    ↓ (3. Service Call)
Service (Service Layer)
    ↓ (4. Query)
Supabase (Data Layer)
    ↓ (5. Response)
Server Action
    ↓ (6. revalidatePath/redirect)
Client Component
```

### 3.3 Características Arquiteturais

- **Layered Architecture**: Separação clara em 3 camadas (Control, Validation, Service)
- **Server-First**: Maioria da lógica roda no servidor (Server Components e Server Actions)
- **Type-Safe**: TypeScript em todo o código, com tipos gerados do Supabase e Zod
- **Multi-tenant**: Isolamento por `organization_id` e RLS policies
- **Cache Request-Scoped**: `AsyncLocalStorage` para cache de autenticação por request
- **Clean Code**: Código testável, manutenível e sem duplicação

---

## 4. Banco de Dados e Modelagem

### 4.1 Tecnologia

- **PostgreSQL** (via Supabase)
- **Row Level Security (RLS)**: Habilitado em todas as tabelas críticas
- **Supabase Auth**: Tabela `auth.users` (gerenciada pelo Supabase)
- **Extensões**: `uuid-ossp` para geração de UUIDs

### 4.2 Principais Entidades

#### 4.2.1 Organizações (Multi-tenant)

```sql
organizations (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  slug VARCHAR(100) UNIQUE,
  cnpj VARCHAR(20),
  industry VARCHAR(100),
  max_users INTEGER DEFAULT 50,
  settings JSONB,
  stripe_customer_id VARCHAR(255), -- Integração futura
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

#### 4.2.2 Usuários

```sql
users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email VARCHAR(255) UNIQUE,
  full_name VARCHAR(255),
  role user_role, -- 'platform_admin' | 'org_manager' | 'student'
  organization_id UUID REFERENCES organizations(id),
  is_active BOOLEAN DEFAULT true,
  is_superadmin BOOLEAN DEFAULT false,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

#### 4.2.3 Cursos

```sql
courses (
  id UUID PRIMARY KEY,
  title VARCHAR(255),
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  level course_level, -- 'beginner' | 'intermediate' | 'advanced'
  status course_status, -- 'draft' | 'published' | 'archived'
  organization_id UUID REFERENCES organizations(id), -- NULL = curso global
  is_public BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

#### 4.2.4 Estrutura Hierárquica de Conteúdo

```
courses
  └── modules (order_index)
      └── lessons (order_index, content_type: video|text|pdf|quiz|embed)
          └── lesson_materials (arquivos complementares)
```

#### 4.2.5 Quizzes

```sql
quizzes (
  id UUID PRIMARY KEY,
  course_id UUID REFERENCES courses(id),
  lesson_id UUID REFERENCES lessons(id), -- Opcional
  title VARCHAR(255),
  passing_score INTEGER DEFAULT 70,
  max_attempts INTEGER DEFAULT 3,
  time_limit_minutes INTEGER,
  created_at TIMESTAMPTZ
)

quiz_questions (
  id UUID PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id),
  question_text TEXT,
  question_type question_type, -- 'multiple_choice' | 'true_false' | 'scenario'
  points INTEGER DEFAULT 1,
  order_index INTEGER
)

question_options (
  id UUID PRIMARY KEY,
  question_id UUID REFERENCES quiz_questions(id),
  option_text TEXT,
  is_correct BOOLEAN,
  order_index INTEGER
)
```

#### 4.2.6 Progresso do Usuário

```sql
user_course_progress (
  user_id UUID,
  course_id UUID,
  status assignment_status, -- 'not_started' | 'in_progress' | 'completed' | 'overdue'
  completion_percentage INTEGER,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ
)

user_lesson_progress (
  user_id UUID,
  lesson_id UUID,
  watched_duration_seconds INTEGER,
  last_position_seconds INTEGER,
  is_completed BOOLEAN,
  completed_at TIMESTAMPTZ
)

user_quiz_attempts (
  id UUID PRIMARY KEY,
  user_id UUID,
  quiz_id UUID,
  attempt_number INTEGER,
  score INTEGER,
  percentage INTEGER,
  passed BOOLEAN,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
)
```

#### 4.2.7 Trilhas de Aprendizado

```sql
learning_paths (
  id UUID PRIMARY KEY,
  title VARCHAR(255),
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  organization_id UUID REFERENCES organizations(id),
  is_mandatory BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ
)

path_courses (
  path_id UUID REFERENCES learning_paths(id),
  course_id UUID REFERENCES courses(id),
  order_index INTEGER,
  is_required BOOLEAN,
  UNIQUE(path_id, course_id)
)

user_path_assignments (
  user_id UUID,
  path_id UUID,
  organization_id UUID,
  status assignment_status,
  deadline TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
)
```

#### 4.2.8 Sistema de Licenças (Multi-tenant)

```sql
organization_course_access (
  organization_id UUID,
  course_id UUID,
  access_type VARCHAR(50), -- 'licensed' | 'unlimited' | 'trial'
  total_licenses INTEGER, -- NULL = ilimitado
  used_licenses INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ, -- NULL = sem expiração
  is_mandatory BOOLEAN DEFAULT false,
  auto_enroll BOOLEAN DEFAULT false,
  UNIQUE(organization_id, course_id)
)

course_customizations (
  organization_id UUID,
  course_id UUID,
  custom_title VARCHAR(255),
  custom_description TEXT,
  custom_thumbnail_url TEXT,
  custom_settings JSONB
)

organization_course_assignments (
  user_id UUID,
  organization_id UUID,
  course_id UUID,
  assigned_by UUID,
  assigned_at TIMESTAMPTZ,
  deadline TIMESTAMPTZ,
  status assignment_status
)
```

#### 4.2.9 Certificados

```sql
certificates (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  course_id UUID REFERENCES courses(id),
  verification_code VARCHAR(255) UNIQUE,
  issued_at TIMESTAMPTZ,
  pdf_url TEXT,
  metadata JSONB
)
```

#### 4.2.10 Notificações

```sql
notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type notification_type, -- 'course_assigned' | 'deadline_approaching' | etc.
  title VARCHAR(255),
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ
)

notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  email_enabled BOOLEAN DEFAULT true,
  in_app_enabled BOOLEAN DEFAULT true,
  frequency notification_frequency -- 'instant' | 'daily' | 'weekly'
)
```

#### 4.2.11 Logs de Atividade

```sql
activity_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  organization_id UUID REFERENCES organizations(id),
  event_type VARCHAR(100),
  event_data JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ
)
```

### 4.3 Relacionamentos Principais

- **Organizations ↔ Users**: 1:N (um usuário pertence a uma organização)
- **Organizations ↔ Courses**: 1:N (cursos podem ser globais ou por organização)
- **Courses ↔ Modules**: 1:N
- **Modules ↔ Lessons**: 1:N
- **Courses ↔ Quizzes**: 1:N (quizzes podem estar em curso ou aula)
- **Users ↔ Courses**: N:N via `user_course_progress` e `organization_course_assignments`
- **Users ↔ Learning Paths**: N:N via `user_path_assignments`
- **Organizations ↔ Courses**: N:N via `organization_course_access` (licenças)

### 4.4 Row Level Security (RLS)

Todas as tabelas críticas possuem políticas RLS que garantem:

1. **Isolamento por Organização**: Usuários veem apenas dados de sua organização
2. **Superadmin Bypass**: Superadmins (`is_superadmin = true`) veem todos os dados
3. **Funções SECURITY DEFINER**: `get_user_organization_id()` e `is_user_superadmin()` para evitar recursão em políticas RLS

**Exemplo de Política RLS:**

```sql
CREATE POLICY "Users can view appropriate users"
ON users FOR SELECT
USING (
  id = (select auth.uid()) OR
  is_user_superadmin((select auth.uid())) OR
  organization_id = get_user_organization_id((select auth.uid()))
);
```

---

## 5. API e Rotas

### 5.1 Estrutura de Rotas (Next.js App Router)

#### 5.1.1 Rotas Públicas

- `/` → Redirecionamento baseado em autenticação
- `/auth/login` → Página de login
- `/auth/signup` → Página de cadastro (seleção de organização)
- `/certificates/verify/[code]` → Verificação pública de certificados

#### 5.1.2 Rotas Protegidas (Usuários Autenticados)

- `/dashboard` → Dashboard do usuário
- `/courses` → Listagem de cursos disponíveis
- `/courses/[slug]` → Detalhes do curso
- `/courses/[slug]/[moduleId]/[lessonId]` → Player de aula
- `/courses/[slug]/quiz/[quizId]` → Quiz
- `/paths` → Trilhas de aprendizado
- `/paths/[slug]` → Detalhes da trilha
- `/certificates` → Certificados do usuário
- `/notifications` → Notificações
- `/profile` → Perfil do usuário
- `/search` → Busca

#### 5.1.3 Rotas Administrativas (Superadmin)

- `/admin` → Dashboard administrativo
- `/admin/organizations` → CRUD de organizações
- `/admin/users` → Gestão de usuários
- `/admin/users/pending` → Aprovação de usuários pendentes
- `/admin/courses` → CRUD de cursos
- `/admin/courses/[id]/edit` → Edição de curso
- `/admin/courses/[id]/modules` → Gestão de módulos
- `/admin/paths` → CRUD de trilhas
- `/admin/quizzes` → CRUD de quizzes
- `/admin/licenses` → Gestão de licenças
- `/admin/reports` → Relatórios
- `/admin/activity` → Logs de atividade

### 5.2 Arquitetura em Camadas

O projeto **não usa API Routes tradicionais**. Toda a lógica segue o padrão **Layered Architecture**:

#### 5.2.1 Control Layer: Server Actions (`app/actions/*.ts`)

Server Actions orquestram o fluxo: **Auth → Validation → Service → Response**

**Exemplo de Server Action (Orquestração):**

```typescript
// app/actions/courses.ts
export async function createCourse(formData: FormData) {
  try {
    // 1. Auth Check
    await requireRole('platform_admin')
    
    // 2. Extract & Validate
    const rawInput = { title: formData.get('title'), ... }
    const validatedInput = validateCourseCreate(rawInput)
    
    // 3. Service Call
    const service = new CourseService()
    const course = await service.createCourse(validatedInput, user.id, user.organization_id)
    
    // 4. Response/Effect
    revalidatePath('/admin/courses')
    return { success: true, data: course }
  } catch (error) {
    // Error handling
  }
}
```

#### 5.2.2 Validation Layer: Zod Schemas (`lib/validators/*.schema.ts`)

Schemas Zod para validação e sanitização de inputs:

```typescript
// lib/validators/course.schema.ts
export const CourseCreateSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug inválido'),
  // ...
})

export function validateCourseCreate(data: unknown): CourseCreateInput {
  return CourseCreateSchema.parse(data)
}
```

#### 5.2.3 Service Layer: Business Logic (`lib/services/*.service.ts`)

Services contêm toda lógica de negócio e queries:

```typescript
// lib/services/course.service.ts
export class CourseService {
  async createCourse(input: CourseCreateInput, createdBy: string, orgId: string | null) {
    const { data, error } = await this.supabase
      .from('courses')
      .insert({ ...input, created_by: createdBy, organization_id: orgId })
      .select()
      .single()
    
    if (error) {
      throw new CourseServiceError(`Erro ao criar curso: ${error.message}`)
    }
    
    return data as Course
  }
}
```

#### 5.2.4 Server Actions por Domínio

**Autenticação** (`app/actions/auth.ts` - usa `AuthService`):
- `signIn(formData)` → Login (usa `AuthService.signIn`)
- `signOut()` → Logout (usa `AuthService.signOut`)
- `signUp(formData)` → Cadastro público (usa `AuthService.signUp`)
- `createUser(formData)` → Criação de usuário admin (usa `AuthService.createUser`)

**Cursos** (`app/actions/courses.ts` - usa `CourseService`):
- `getCourses(filters?)` → Lista cursos (usa `CourseService.getCourses`)
- `getCourseBySlug(slug)` → Busca curso por slug (usa `CourseService.getCourseBySlug`)
- `createCourse(formData)` → Cria curso (usa `CourseService.createCourse`)
- `updateCourse(id, formData)` → Atualiza curso (usa `CourseService.updateCourse`)
- `deleteCourse(id)` → Deleta curso (usa `CourseService.deleteCourse`)

**Módulos e Aulas** (`app/actions/modules.ts`, `app/actions/lessons.ts` - usa `ContentService`):
- `getModulesByCourse(courseId)` → (usa `ContentService.getModulesByCourse`)
- `createModule(courseId, input)` → (usa `ContentService.createModule`)
- `updateModule(id, input)` → (usa `ContentService.updateModule`)
- `deleteModule(id)` → (usa `ContentService.deleteModule`)
- `getLessonsByModule(moduleId)` → (usa `ContentService.getLessonsByModule`)
- `createLesson(moduleId, input)` → (usa `ContentService.createLesson`)
- `updateLesson(id, input)` → (usa `ContentService.updateLesson`)
- `deleteLesson(id)` → (usa `ContentService.deleteLesson`)

#### 5.2.4 Progresso (`app/actions/progress.ts`, `app/actions/course-progress.ts`)

- `getUserProgress(userId?)` → Progresso geral
- `getCourseProgress(courseId)` → Progresso em curso específico
- `updateLessonProgress(lessonId, progress)` → Atualiza progresso de aula
- `markLessonComplete(lessonId)` → Marca aula como completa

**Quizzes** (`app/actions/quizzes.ts` - usa `QuizService`):
- `getQuizzes(courseId?)` → (usa `QuizService.getQuizzes`)
- `getQuizById(quizId)` → (usa `QuizService.getQuizById`)
- `createQuiz(input)` → (usa `QuizService.createQuiz`)
- `updateQuiz(id, input)` → (usa `QuizService.updateQuiz`)
- `deleteQuiz(id)` → (usa `QuizService.deleteQuiz`)

**Organizações** (`app/actions/organizations.ts` - usa `OrganizationService`):
- `getPublicOrganizations()` → (usa `OrganizationService.getPublicOrganizations`)
- `getAllOrganizations(filters?)` → (usa `OrganizationService.getAllOrganizations`)
- `getOrganizationById(id)` → (usa `OrganizationService.getOrganizationById`)
- `updateOrganization(id, input)` → (usa `OrganizationService.updateOrganization`)
- `deleteOrganization(id)` → (usa `OrganizationService.deleteOrganization`)

**Usuários** (`app/actions/users.ts` - usa `UserService`):
- `getUsers(filters?)` → (usa `UserService.getUsers`)
- `getPendingUsers()` → (usa `UserService.getPendingUsers`)
- `approveUser(userId)` → (usa `UserService.approveUser`)
- `rejectUser(userId)` → (usa `UserService.rejectUser`)

#### 5.2.8 Licenças (`app/actions/license-management.ts`, `app/actions/organization-courses.ts`)

- `assignCourseToOrganization(orgId, courseId, config)` → Atribui curso a organização
- `getOrganizationCourses(orgId)` → Lista cursos de uma organização
- `getLicenseUsage(orgId, courseId)` → Uso de licenças

#### 5.2.9 Notificações (`app/actions/notifications.ts`)

- `getNotifications()` → Lista notificações do usuário
- `markNotificationAsRead(id)` → Marca como lida
- `markAllNotificationsAsRead()` → Marca todas como lidas
- `createNotification(data)` → Cria notificação (sistema)

#### 5.2.10 Certificados (`app/actions/certificates.ts`)

- `getUserCertificates()` → Lista certificados do usuário
- `generateCertificate(courseId)` → Gera certificado em PDF
- `verifyCertificate(code)` → Verifica certificado (público)

### 5.3 API Routes (Mínimo Uso)

Apenas uma rota API tradicional existe:

- `/api/profile/notifications` → Endpoint para notificações (usado por componente client-side)

### 5.4 Separação Cliente Externo vs. Uso Interno

**Não há separação explícita de rotas**. A diferenciação é feita por:

1. **Autenticação**: Middleware verifica autenticação em rotas protegidas
2. **Autorização**: Server Actions verificam `is_superadmin` e `role`:
   - `requireSuperAdmin()` → Apenas superadmins
   - `requireRole('platform_admin' | 'org_manager' | 'student')` → Verifica role
3. **RLS Policies**: Banco de dados garante isolamento por organização
4. **Layout Guards**: Layouts (`app/admin/layout.tsx`, `app/(main)/layout.tsx`) verificam permissões

**Exemplo de Autorização em Server Action:**

```typescript
export async function createCourse(formData: FormData) {
  const supabase = createClient()
  const user = await requireRole('platform_admin') // Verifica role
  
  // Lógica de criação...
}
```

---

## 6. Fluxos Críticos e Lógica de Negócio

### 6.1 Autenticação e Autorização

#### 6.1.1 Fluxo de Login

1. **Middleware** (`middleware.ts`):
   - Verifica autenticação básica (`supabase.auth.getUser()`)
   - Redireciona para `/auth/login` se não autenticado em rotas protegidas
   - **NÃO** faz queries na tabela `users` (evita loops)

2. **Server Action `signIn`** (`app/actions/auth.ts`):
   - Autentica via `supabase.auth.signInWithPassword()`
   - Busca dados completos do usuário na tabela `users`
   - **Verifica `is_superadmin` ANTES de `is_active`**:
     - Se `is_superadmin = true` → Redireciona para `/admin` (mesmo se `is_active = false`)
     - Se `is_active = false` → Redireciona para `/auth/waiting-room`
     - Se ativo → Redireciona para `/dashboard` ou `redirectTo`
   - Atualiza `last_login_at`

3. **Layouts** (`app/(main)/layout.tsx`, `app/admin/layout.tsx`):
   - `app/(main)/layout.tsx`: Verifica `is_superadmin` → redireciona para `/admin` se true
   - `app/admin/layout.tsx`: Usa `requireSuperAdmin()` → redireciona se não for superadmin

#### 6.1.2 Fluxo de Cadastro (Signup)

1. Usuário preenche formulário em `/auth/signup`
2. Seleciona organização (obrigatório)
3. Server Action `signUp`:
   - Cria usuário no Supabase Auth
   - Cria registro na tabela `users` com `is_active = false`
   - Redireciona para `/auth/waiting-room`
4. Admin aprova via `/admin/users/pending`
5. Usuário recebe notificação e pode acessar

#### 6.1.3 Cache Request-Scoped

- **`lib/auth/context.ts`**: Usa `AsyncLocalStorage` para cache por request
- **`lib/auth/helpers.ts`**: `getCurrentUser()` verifica cache antes de fazer query
- **Benefício**: Evita múltiplas queries no mesmo request

### 6.2 Multi-tenancy e Isolamento

#### 6.2.1 Isolamento por Organização

- **RLS Policies**: Todas as queries são filtradas automaticamente por `organization_id`
- **Superadmin Bypass**: Superadmins veem todos os dados via função `is_user_superadmin()`
- **Server Actions**: Verificam `user.organization_id` antes de queries

**Exemplo:**

```typescript
export async function getCourses() {
  const user = await requireAuth()
  
  if (user.is_superadmin) {
    // Superadmin vê todos os cursos
    return await supabase.from('courses').select('*')
  }
  
  // Usuário normal vê apenas cursos de sua organização
  // RLS policy garante isolamento
  return await supabase
    .from('courses')
    .select('*')
    .eq('organization_id', user.organization_id)
}
```

#### 6.2.2 Sistema de Licenças

- **`organization_course_access`**: Controla quais cursos uma organização pode acessar
- **`total_licenses` / `used_licenses`**: Controle de estoque
- **`is_mandatory`**: Cursos obrigatórios
- **`auto_enroll`**: Auto-inscrição de novos usuários

### 6.3 Progresso e Conclusão

#### 6.3.1 Progresso de Aula

1. Usuário assiste aula (vídeo, texto, PDF)
2. `updateLessonProgress()` atualiza `user_lesson_progress`:
   - `watched_duration_seconds`
   - `last_position_seconds` (para vídeos)
   - `is_completed` (quando 100% assistido)
3. Trigger ou Server Action atualiza `user_course_progress.completion_percentage`

#### 6.3.2 Conclusão de Curso

- Quando todas as aulas obrigatórias estão completas:
  - `user_course_progress.status` → `'completed'`
  - `user_course_progress.completed_at` → timestamp
  - Notificação é criada
  - Certificado pode ser gerado

### 6.4 Geração de Certificados

1. Usuário completa curso
2. `generateCertificate(courseId)`:
   - Gera PDF usando `@react-pdf/renderer`
   - Faz upload para Supabase Storage
   - Cria registro em `certificates` com `verification_code`
   - Retorna URL do PDF

### 6.5 Sistema de Notificações

- **Triggers**: `lib/notifications/triggers.ts` cria notificações automaticamente:
  - `notifyWelcome()` → Boas-vindas
  - `notifyCourseAssigned()` → Curso atribuído
  - `notifyDeadlineApproaching()` → Prazo se aproximando
- **Email**: Integração com Resend (`lib/email/client.ts`)
- **In-App**: Bell icon no header mostra notificações não lidas

### 6.6 Onde Reside a Lógica de Negócio?

**Arquitetura em Camadas (Layered Architecture):**

1. **Control Layer** (`app/actions/*.ts`):
   - ✅ Orquestração do fluxo (Auth → Validation → Service → Response)
   - ✅ Verificação de permissões (`requireAuth`, `requireRole`, `requireSuperAdmin`)
   - ✅ Extração de dados de `FormData`
   - ✅ Chamada de services
   - ✅ `revalidatePath()` e `redirect()` quando necessário
   - ❌ **NÃO** contém lógica de negócio
   - ❌ **NÃO** faz queries diretas ao banco

2. **Validation Layer** (`lib/validators/*.schema.ts`):
   - ✅ Validação de inputs usando Zod
   - ✅ Sanitização de dados (previne SQL Injection)
   - ✅ Mensagens de erro em português
   - ✅ Exporta tipos TypeScript inferidos

3. **Service Layer** (`lib/services/*.service.ts`):
   - ✅ **TODA** lógica de negócio
   - ✅ **TODAS** as queries ao banco de dados
   - ✅ Transformação de dados
   - ✅ Criação de notificações (via triggers)
   - ✅ Geração de certificados
   - ✅ Tratamento de erros tipados
   - ❌ **NUNCA** recebe `FormData`
   - ❌ **NUNCA** usa `redirect()` ou `revalidatePath()`

**Componentes** são "burros" (apresentação apenas):
- Recebem dados via props
- Chamam Server Actions via `formAction` ou `action`
- Não fazem queries diretas ao banco

**Exceção**: Componentes client-side (`'use client'`) podem fazer queries via hooks, mas isso é raro.

---

## 7. Pontos de Atenção (Análise Estática)

### 7.1 Problemas Identificados

#### 7.1.1 Arquitetura

- ✅ **Arquitetura em Camadas**: Implementada com Service Layer + Validation Layer
- ✅ **Separação de Responsabilidades**: Control Layer apenas orquestra, Service Layer contém lógica
- ✅ **Cache Request-Scoped**: `getCurrentUser()` otimizado com `AsyncLocalStorage`
- ⚠️ **Queries Duplicadas**: Algumas queries podem ser otimizadas (ex: listagens com progresso)

#### 7.1.2 Banco de Dados

- ⚠️ **RLS Recursion**: Já corrigido com funções `SECURITY DEFINER`, mas requer atenção em novas políticas
- ⚠️ **Índices Faltantes**: Alguns foreign keys não têm índices (já corrigido parcialmente na migration `008`)
- ⚠️ **Queries N+1**: Algumas listagens podem gerar queries N+1 (ex: listar cursos com progresso)

#### 7.1.3 Código

- ⚠️ **Tratamento de Erros Inconsistente**: Algumas Server Actions usam `throw new Error()`, outras usam `redirect()` com query params
- ⚠️ **TypeScript `any`**: Alguns lugares usam `as any` (ex: `lib/supabase/server.ts` linha 45)
- ⚠️ **Arquivos Grandes**: `app/actions/admin.ts` tem 273 linhas (métricas do dashboard)
- ⚠️ **Imports Circulares Potenciais**: `lib/supabase/server.ts` importa `lib/auth/helpers.ts` que importa `lib/supabase/server.ts` (verificar)

#### 7.1.4 Performance

- ⚠️ **Sem Paginação em Algumas Listagens**: `getCourses()` pode retornar muitos registros
- ⚠️ **Queries sem `select()` Específico**: Algumas queries fazem `select('*')` quando poderiam selecionar apenas campos necessários
- ⚠️ **Falta de Cache**: Não há cache de queries (exceto `getCurrentUser()`)

#### 7.1.5 Segurança

- ✅ **RLS Habilitado**: Todas as tabelas críticas têm RLS
- ✅ **Validação de Permissões**: Server Actions verificam permissões
- ⚠️ **SQL Injection**: Queries usam Supabase client (seguro), mas algumas queries dinâmicas podem ser vulneráveis (ex: `query.or()` com interpolação de strings)
- ⚠️ **XSS**: Componentes React escapam HTML por padrão, mas verificar uso de `dangerouslySetInnerHTML`

#### 7.1.6 Manutenibilidade

- ⚠️ **Documentação Inline**: Algumas funções têm documentação, outras não
- ⚠️ **Nomes de Variáveis**: Alguns nomes são genéricos (ex: `data`, `error`)
- ⚠️ **Magic Numbers/Strings**: Alguns valores hardcoded (ex: `passing_score = 70`, `max_attempts = 3`)

### 7.2 Padrões Problemáticos

#### 7.2.1 Queries SQL Dinâmicas

**✅ RESOLVIDO**: Busca agora é feita em memória após query segura:

```typescript
// lib/services/course.service.ts
// Busca segura: primeiro busca dados, depois filtra em memória
if (search) {
  const searchLower = search.toLowerCase()
  courses = courses.filter(
    (c) =>
      c.title?.toLowerCase().includes(searchLower) ||
      c.description?.toLowerCase().includes(searchLower)
  )
}
```

**Benefício**: Previne SQL Injection completamente, pois não há interpolação de strings na query.

#### 7.2.2 Redirects em Server Actions

```typescript
// app/actions/auth.ts
if (error) {
  redirect(`/auth/login?error=${encodeURIComponent(error.message)}`)
}
```

**Problema**: `redirect()` lança exceção especial (`NEXT_REDIRECT`), mas pode ser confuso.

**Solução**: Documentar que `redirect()` nunca retorna.

#### 7.2.3 Type Assertions

```typescript
// lib/supabase/server.ts linha 45
return createServerClient<Database>(...) as any;
```

**Problema**: `as any` remove type safety.

**Solução**: Corrigir tipos do Supabase ou usar type assertion mais específica.

### 7.3 Oportunidades de Melhoria

1. ✅ **Camada de Serviço**: **IMPLEMENTADO** - `lib/services/` com 6 services principais
2. ✅ **Validação Centralizada**: **IMPLEMENTADO** - Zod schemas em `lib/validators/`
3. ⚠️ **Error Handling Unificado**: Criar `lib/errors/` com classes de erro customizadas (parcialmente implementado nos services)
4. ⚠️ **Cache Strategy**: Implementar cache para queries frequentes (ex: Redis ou in-memory) - apenas `getCurrentUser()` tem cache
5. ✅ **Paginação Padrão**: Implementado nos services (ex: `CourseService.getCourses` retorna `GetCoursesResult` com paginação)
6. ✅ **Logging Estruturado**: Logs condicionados com `NODE_ENV === 'development'` - melhorias aplicadas
7. ⚠️ **Testes**: Adicionar testes unitários e de integração (atualmente não há testes)

---

## 8. Conclusão

O projeto **n.training** é uma aplicação Next.js 14 moderna com arquitetura baseada em Server Actions, multi-tenancy robusto via RLS, e isolamento completo de dados por organização. A estrutura é sólida, mas há oportunidades de melhoria em organização de código, tratamento de erros, e performance.

**Pontos Fortes:**
- ✅ Arquitetura moderna (Next.js 14 App Router)
- ✅ **Arquitetura em Camadas** (Service Layer + Validation Layer)
- ✅ Type-safe (TypeScript + tipos do Supabase + Zod)
- ✅ Multi-tenancy bem implementado (RLS)
- ✅ Cache request-scoped para autenticação
- ✅ Separação clara entre apresentação e lógica
- ✅ Código limpo e testável (services isolados)
- ✅ Validação centralizada com Zod
- ✅ Prevenção de SQL Injection (busca em memória)

**Pontos de Atenção:**
- ⚠️ Tratamento de erros pode ser mais unificado (classes de erro customizadas)
- ⚠️ Algumas queries podem ser otimizadas (queries N+1 em listagens)
- ⚠️ Falta de testes automatizados
- ⚠️ Migração gradual: 76 arquivos ainda usam wrappers de compatibilidade (pode migrar para `lib/auth/helpers` diretamente)

---

**Documento atualizado para refletir a arquitetura em camadas (Service Layer + Validation Layer).**  
**Última atualização:** 2026-01-14

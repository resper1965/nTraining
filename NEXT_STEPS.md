# Próximos Passos - nTraining Platform

## ✅ O que já está pronto

- [x] Estrutura base do projeto (Next.js 14 + TypeScript)
- [x] Design System ness configurado (cores, tipografia)
- [x] shadcn/ui instalado e configurado
- [x] Schema completo do banco de dados (schema.sql)
- [x] Configuração do Supabase (client e server)
- [x] Types TypeScript do banco de dados
- [x] Server Actions para cursos e progresso
- [x] Sistema de autenticação base (helpers de role e auth)

## 🚀 Próximos Passos Prioritários

### 1. Sistema de Autenticação (Alta Prioridade)

**Arquivos a criar:**
- `app/auth/login/page.tsx` - Página de login
- `app/auth/signup/page.tsx` - Página de cadastro
- `app/actions/auth.ts` - Server actions para autenticação
- `middleware.ts` - Middleware para proteger rotas

**Funcionalidades:**
- Login com email/senha
- Cadastro de novos usuários
- Logout
- Proteção de rotas por role
- Redirecionamento após login

### 2. Páginas Principais (Alta Prioridade)

**Dashboard do Estudante:**
- `app/dashboard/page.tsx` - Dashboard principal
- Mostrar cursos em progresso
- Estatísticas de aprendizado
- Próximos cursos recomendados

**Página de Cursos:**
- `app/courses/page.tsx` - Lista de cursos
- `app/courses/[slug]/page.tsx` - Detalhes do curso
- `app/courses/[slug]/[moduleId]/[lessonId]/page.tsx` - Player de aula

**Componentes necessários:**
- `components/course-card.tsx` - Card de curso
- `components/progress-bar.tsx` - Barra de progresso
- `components/lesson-player.tsx` - Player de vídeo/texto

### 3. Middleware de Autenticação

**Arquivo:**
- `middleware.ts` na raiz do projeto

**Funcionalidades:**
- Verificar autenticação em rotas protegidas
- Redirecionar não autenticados para `/auth/login`
- Verificar roles para rotas admin
- Manter sessão do Supabase

### 4. Páginas de Admin (Média Prioridade)

**Admin de Cursos:**
- `app/admin/courses/page.tsx` - Lista de cursos (admin)
- `app/admin/courses/new/page.tsx` - Criar curso
- `app/admin/courses/[id]/edit/page.tsx` - Editar curso

**Admin de Usuários:**
- `app/admin/users/page.tsx` - Lista de usuários
- `app/admin/users/[id]/page.tsx` - Detalhes do usuário

**Componentes:**
- `components/admin/course-form.tsx` - Formulário de curso
- `components/admin/user-table.tsx` - Tabela de usuários

### 5. Componentes de UI Específicos

**Componentes de Curso:**
- `components/course-card.tsx` - Card com thumbnail, título, progresso
- `components/course-filters.tsx` - Filtros (área, nível, busca)
- `components/module-list.tsx` - Lista de módulos do curso
- `components/lesson-item.tsx` - Item de aula na lista

**Componentes de Progresso:**
- `components/progress-bar.tsx` - Barra de progresso reutilizável
- `components/progress-stats.tsx` - Estatísticas de progresso
- `components/certificate-card.tsx` - Card de certificado

**Componentes de Player:**
- `components/lesson-player/video-player.tsx` - Player de vídeo
- `components/lesson-player/text-viewer.tsx` - Visualizador de texto
- `components/lesson-player/pdf-viewer.tsx` - Visualizador de PDF
- `components/lesson-player/quiz-viewer.tsx` - Visualizador de quiz

### 6. Funcionalidades Adicionais

**Sistema de Notas:**
- Componente para criar/editar notas durante as aulas
- Salvar notas vinculadas ao timestamp do vídeo

**Sistema de Certificados:**
- Geração de certificados PDF
- Página de verificação pública de certificados
- Download de certificados

**Sistema de Trilhas (Learning Paths):**
- Visualização de trilhas
- Progresso em trilhas
- Atribuição de trilhas para usuários

## 📋 Ordem Recomendada de Implementação

1. **Fase 1: Autenticação** (1-2 dias)
   - Middleware
   - Páginas de login/signup
   - Server actions de auth

2. **Fase 2: Dashboard e Lista de Cursos** (2-3 dias)
   - Dashboard básico
   - Página de listagem de cursos
   - Componentes de card e filtros

3. **Fase 3: Player de Aulas** (3-4 dias)
   - Página de detalhes do curso
   - Player de vídeo/texto
   - Sistema de progresso

4. **Fase 4: Admin** (2-3 dias)
   - CRUD de cursos
   - Gerenciamento de usuários

5. **Fase 5: Funcionalidades Avançadas** (3-5 dias)
   - Certificados
   - Trilhas
   - Notas
   - Quizzes

## 🔧 Configurações Necessárias

### Variáveis de Ambiente

Certifique-se de ter configurado no Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Banco de Dados

1. Execute o `schema.sql` no Supabase
2. Configure as políticas RLS (já estão no schema.sql)
3. Execute o `seed.sql` para dados de teste (opcional)

### Supabase Storage (para uploads)

Configure buckets no Supabase:
- `course-thumbnails` - Para thumbnails de cursos
- `lesson-materials` - Para materiais das aulas
- `certificates` - Para PDFs de certificados

## 📚 Recursos Úteis

- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [shadcn/ui Components](https://ui.shadcn.com/docs/components)

## 🎨 Design System

Lembre-se de seguir o design system ness:
- Cores: Primary #00ade8, Background slate-950
- Tipografia: Inter (corpo), Montserrat (títulos)
- Espaçamento: múltiplos de 4px
- Line-height: tight (1.25) para títulos, relaxed (1.625) para corpo


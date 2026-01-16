# Project Overview

## Summary

**n.training** é uma plataforma completa de treinamento corporativo focada em Segurança da Informação. Desenvolvida com Next.js 14 (App Router) e TypeScript, utiliza uma arquitetura em camadas (Service Layer + Repository Pattern simplificado) para garantir código limpo, testável e manutenível.

**Powered by [ness.](https://ness.com.br)**

## Architecture

- **Models**: 44 symbols
- **Utils**: 81 symbols (depends on: Repositories)
- **Repositories**: 62 symbols
- **Services**: 33 symbols
- **Controllers**: 1 symbols
- **Components**: 136 symbols
- **Generators**: 3 symbols

## Key Components

### Core Services

1. **AuthService** (`lib/services/auth.service.ts`)
   - Autenticação de usuários
   - Gerenciamento de sessões
   - Integração com Supabase Auth

2. **UserService** (`lib/services/user.service.ts`)
   - Gerenciamento de usuários
   - Aprovação de contas
   - Gestão de roles e permissões

3. **CourseService** (`lib/services/course.service.ts`)
   - CRUD de cursos
   - Gestão de módulos e aulas
   - Progresso de cursos

4. **QuizService** (`lib/services/quiz.service.ts`)
   - Criação e gerenciamento de quizzes
   - Tentativas e avaliações
   - Resultados e estatísticas

5. **OrganizationService** (`lib/services/organization.service.ts`)
   - Gestão multi-tenant
   - Isolamento de dados por organização
   - Licenças e acessos

6. **AICourseService** (`lib/services/ai-course.service.ts`)
   - Geração de cursos com IA
   - Estruturação automática de conteúdo
   - Integração com OpenAI

### Main Features

- 🎓 **Gestão de Cursos**: Criação, edição e publicação de cursos com módulos e aulas
- 👥 **Gestão de Usuários**: Sistema de aprovação, roles e organizações
- 📊 **Dashboard Administrativo**: Métricas e relatórios em tempo real
- 🎯 **Quizzes Interativos**: Sistema completo de avaliações com múltiplas tentativas
- 📜 **Certificados PDF**: Geração automática de certificados em PDF
- 🔔 **Notificações Inteligentes**: Sistema de notificações com rate limiting
- 🌐 **Multi-tenant**: Suporte a múltiplas organizações
- 🔐 **Autenticação Robusta**: Sistema de autenticação com aprovação de administradores
- 🤖 **IA para Cursos**: Geração automática de cursos usando OpenAI

## Target Users/Audience

1. **Superadmins**: Gestão completa da plataforma
2. **Admins de Organização**: Gestão de usuários e cursos da sua organização
3. **Estudantes**: Consumo de cursos e trilhas de aprendizado
4. **Instrutores**: Criação e edição de conteúdo educacional

## Key Dependencies and Integrations

### Core Stack
- **Next.js 14.2**: Framework React com App Router
- **TypeScript 5.5**: Tipagem estática
- **Supabase**: Backend-as-a-Service (PostgreSQL + Auth + Storage)
- **Tailwind CSS**: Estilização
- **Radix UI**: Componentes acessíveis

### Integrations
- **OpenAI**: Geração de conteúdo educacional
- **Resend**: Envio de emails transacionais
- **Google OAuth**: Autenticação social
- **Vercel**: Deploy e hosting

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm ou yarn
- Conta Supabase
- Variáveis de ambiente configuradas

### Installation

```bash
# Clone o repositório
git clone <repository-url>

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Execute o servidor de desenvolvimento
npm run dev
```

### Environment Variables

Veja `.env.example` para lista completa. Principais:
- `NEXT_PUBLIC_SUPABASE_URL`: URL do projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave pública do Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço (server-side)
- `OPENAI_API_KEY`: Chave da API OpenAI
- `RESEND_API_KEY`: Chave da API Resend

---

*Generated from codebase analysis. Review and enhance with specific details.*

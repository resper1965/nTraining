# 📋 Planejamento Completo do Sistema n.training
## Metodologia Spec-Kit: Desenvolvimento Orientado por Especificações

---

## 🎯 Princípios do Projeto (Constitution)

### Princípios Fundamentais

1. **Multi-tenancy First**
   - Todas as features devem considerar isolamento por organização
   - RLS (Row Level Security) obrigatório em todas as tabelas
   - Superadmin tem acesso total, mas pode visualizar contexto de qualquer organização

2. **Segurança e Privacidade**
   - Autenticação obrigatória para todas as rotas protegidas
   - Dados isolados por organização
   - Validação de permissões em todas as operações
   - Auditoria de ações administrativas

3. **Experiência do Usuário**
   - Interface intuitiva e responsiva
   - Feedback claro em todas as ações
   - Performance otimizada (lazy loading, paginação)
   - Acessibilidade (WCAG 2.1 AA)

4. **Escalabilidade**
   - Queries otimizadas com índices apropriados
   - Paginação em todas as listas
   - Cache quando apropriado
   - Arquitetura preparada para crescimento

5. **Manutenibilidade**
   - Código TypeScript tipado
   - Componentes reutilizáveis
   - Server Actions bem organizadas
   - Documentação inline

---

## 📦 Features Principais (Módulos)

### 1. 🔐 Autenticação e Autorização (AUTH)

**Status:** ✅ Implementado parcialmente

#### Especificações

**AUTH-001: Login de Usuário**
- **Descrição:** Usuários autenticados podem fazer login com email/senha
- **Critérios de Aceitação:**
  - [x] Formulário de login funcional
  - [x] Validação de credenciais
  - [x] Redirecionamento baseado em role (superadmin → /admin, outros → /dashboard)
  - [x] Atualização de `last_login_at`
  - [ ] Recuperação de senha (forgot password)
  - [ ] Autenticação de dois fatores (2FA)
- **Arquivos:**
  - `app/auth/login/page.tsx` ✅
  - `app/actions/auth.ts` ✅
- **Tarefas Pendentes:**
  - [ ] Implementar recuperação de senha
  - [ ] Implementar 2FA
  - [ ] Implementar "Lembrar-me"

**AUTH-002: Criação de Usuário (Admin Only)**
- **Descrição:** Apenas admins podem criar usuários diretamente no sistema
- **Critérios de Aceitação:**
  - [x] Formulário de criação de usuário
  - [x] Validação de email único
  - [x] Criação via Supabase Admin API
  - [x] Atribuição de role e organização
  - [ ] Envio de email de boas-vindas
  - [ ] Geração de senha temporária
- **Arquivos:**
  - `app/admin/users/new/page.tsx` ✅
  - `app/actions/auth.ts` (createUser) ✅
- **Tarefas Pendentes:**
  - [ ] Email de boas-vindas
  - [ ] Senha temporária com expiração

**AUTH-003: Gestão de Sessão**
- **Descrição:** Sistema de sessão seguro com Supabase
- **Critérios de Aceitação:**
  - [x] Middleware de autenticação
  - [x] Proteção de rotas
  - [x] Logout funcional
  - [ ] Refresh token automático
  - [ ] Sessão expira após inatividade
- **Arquivos:**
  - `middleware.ts` ✅
  - `lib/supabase/server.ts` ✅

**AUTH-004: Controle de Acesso Baseado em Roles**
- **Descrição:** Sistema de permissões granular por role
- **Critérios de Aceitação:**
  - [x] Roles: superadmin, platform_admin, org_manager, student
  - [x] Verificação de permissões em Server Actions
  - [x] RLS policies no banco
  - [ ] Permissões customizadas por organização
  - [ ] Auditoria de acesso
- **Arquivos:**
  - `lib/supabase/server.ts` (requireRole, requireSuperAdmin) ✅

---

### 2. 🏢 Multi-Tenancy (TENANT)

**Status:** ✅ Implementado parcialmente

#### Especificações

**TENANT-001: Gestão de Organizações**
- **Descrição:** Superadmin pode criar, editar e gerenciar organizações
- **Critérios de Aceitação:**
  - [x] CRUD completo de organizações
  - [x] Validação de CNPJ único
  - [x] Máscara de CNPJ (99.999.999/9999-99)
  - [x] Lista com filtros e busca
  - [x] Página de detalhes com abas
  - [ ] Upload de logo
  - [ ] Configurações avançadas por organização
- **Arquivos:**
  - `app/admin/organizations/page.tsx` ✅
  - `app/admin/organizations/[id]/page.tsx` ✅
  - `app/actions/organizations.ts` ✅
- **Tarefas Pendentes:**
  - [ ] Upload de logo
  - [ ] Página de edição completa
  - [ ] Configurações avançadas

**TENANT-002: Visualização de Organização (Backstage)**
- **Descrição:** Superadmin pode "visitar" organizações para ver perspectiva do tenant
- **Critérios de Aceitação:**
  - [x] Página de visualização (`/admin/organizations/[id]/view`)
  - [x] Header com contexto da organização
  - [x] Visualização de cursos disponíveis
  - [x] Visualização de usuários
  - [ ] Dashboard da organização (métricas específicas)
  - [ ] Navegação como se fosse usuário da organização
- **Arquivos:**
  - `app/admin/organizations/[id]/view/page.tsx` ✅
- **Tarefas Pendentes:**
  - [ ] Dashboard específico da organização
  - [ ] Modo "impersonate" (opcional)

**TENANT-003: Isolamento de Dados**
- **Descrição:** Dados isolados por organização via RLS
- **Critérios de Aceitação:**
  - [x] RLS habilitado em todas as tabelas
  - [x] Policies para isolamento por organização
  - [x] Superadmin bypass de RLS quando necessário
  - [ ] Testes de isolamento
- **Arquivos:**
  - `lib/supabase/migrations/001_organization_courses.sql` ✅

---

### 3. 📚 Gestão de Cursos (COURSES)

**Status:** ⚠️ Implementado parcialmente

#### Especificações

**COURSES-001: CRUD de Cursos**
- **Descrição:** Admins podem criar, editar e gerenciar cursos
- **Critérios de Aceitação:**
  - [x] Lista de cursos
  - [x] Criar curso (parcial)
  - [ ] Editar curso completo
  - [ ] Deletar curso (soft delete)
  - [ ] Duplicar curso
  - [ ] Versionamento de cursos
- **Arquivos:**
  - `app/admin/courses/page.tsx` ✅
  - `app/actions/courses.ts` ✅
- **Tarefas Pendentes:**
  - [ ] Página de edição completa
  - [ ] Upload de thumbnail
  - [ ] Editor de conteúdo rico
  - [ ] Preview de curso

**COURSES-002: Estrutura de Conteúdo**
- **Descrição:** Cursos têm módulos, módulos têm aulas
- **Critérios de Aceitação:**
  - [x] Tabelas: courses, modules, lessons
  - [x] Relacionamentos corretos
  - [ ] Interface para gerenciar módulos
  - [ ] Interface para gerenciar aulas
  - [ ] Reordenação drag-and-drop
  - [ ] Upload de vídeos/arquivos
- **Arquivos:**
  - Schema ✅
  - `app/admin/courses/[id]/modules/page.tsx` ❌
- **Tarefas Pendentes:**
  - [ ] CRUD de módulos
  - [ ] CRUD de aulas
  - [ ] Upload de mídia
  - [ ] Player de vídeo

**COURSES-003: Tipos de Conteúdo**
- **Descrição:** Suporte a múltiplos tipos de conteúdo (vídeo, texto, PDF, quiz, embed)
- **Critérios de Aceitação:**
  - [x] Enum content_type definido
  - [ ] Player de vídeo integrado
  - [ ] Visualizador de PDF
  - [ ] Editor de texto rico
  - [ ] Suporte a embeds (YouTube, Vimeo, etc.)
  - [ ] Quizzes interativos
- **Arquivos:**
  - Schema ✅
  - `components/lesson-player/` ❌
- **Tarefas Pendentes:**
  - [ ] Componentes de player
  - [ ] Integração com serviços de vídeo
  - [ ] Visualizador de PDF

**COURSES-004: Status e Publicação**
- **Descrição:** Cursos têm estados (draft, published, archived)
- **Critérios de Aceitação:**
  - [x] Enum course_status
  - [x] Publicar curso
  - [ ] Arquivar curso
  - [ ] Agendar publicação
  - [ ] Validação antes de publicar (mínimo de conteúdo)
- **Arquivos:**
  - `app/actions/courses.ts` (publishCourse) ✅

---

### 4. 🎓 Sistema de Cursos x Tenant (ORG_COURSES)

**Status:** ✅ Estrutura criada, implementação parcial

#### Especificações

**ORG_COURSES-001: Estoque de Cursos**
- **Descrição:** Organizações têm acesso a cursos através de licenças
- **Critérios de Aceitação:**
  - [x] Tabela `organization_course_access`
  - [x] Tipos: licensed, unlimited, trial
  - [x] Controle de licenças (total, usado, disponível)
  - [x] Validade de acesso
  - [ ] Interface para comprar/adicionar licenças
  - [ ] Alertas de expiração
  - [ ] Renovação automática
- **Arquivos:**
  - `lib/supabase/migrations/001_organization_courses.sql` ✅
  - `app/actions/organization-courses.ts` ✅
- **Tarefas Pendentes:**
  - [ ] Interface de gestão de licenças
  - [ ] Sistema de alertas
  - [ ] Integração com pagamento (Stripe)

**ORG_COURSES-002: Cursos Obrigatórios**
- **Descrição:** Organizações podem marcar cursos como obrigatórios
- **Critérios de Aceitação:**
  - [x] Campo `is_mandatory` em `organization_course_access`
  - [x] Campo `is_mandatory` em `organization_course_assignments`
  - [x] Dashboard mostra cursos obrigatórios
  - [ ] Notificações de cursos obrigatórios
  - [ ] Relatórios de compliance
  - [ ] Auto-enroll em cursos obrigatórios
- **Arquivos:**
  - Schema ✅
  - `app/dashboard/page.tsx` (mandatory courses) ✅
- **Tarefas Pendentes:**
  - [ ] Sistema de notificações
  - [ ] Relatórios de compliance

**ORG_COURSES-003: Personalização de Cursos**
- **Descrição:** Organizações podem personalizar cursos globais
- **Critérios de Aceitação:**
  - [x] Tabela `course_customizations`
  - [x] Campos: custom_title, custom_description, custom_thumbnail
  - [x] Customização de módulos/aulas (JSONB)
  - [ ] Interface de personalização
  - [ ] Preview de personalização
  - [ ] Versionamento de personalizações
- **Arquivos:**
  - Schema ✅
  - `app/actions/organization-courses.ts` (customizeCourse) ✅
- **Tarefas Pendentes:**
  - [ ] Interface visual de personalização
  - [ ] Editor de conteúdo customizado

**ORG_COURSES-004: Atribuição de Cursos**
- **Descrição:** Cursos podem ser atribuídos a usuários específicos
- **Critérios de Aceitação:**
  - [x] Tabela `organization_course_assignments`
  - [x] Campos: deadline, is_mandatory, status
  - [x] Server Action para atribuir
  - [ ] Interface de atribuição em massa
  - [ ] Notificações de atribuição
  - [ ] Lembretes de deadline
- **Arquivos:**
  - Schema ✅
  - `app/actions/organization-courses.ts` (assignCourseToUser) ✅
- **Tarefas Pendentes:**
  - [ ] Interface de atribuição
  - [ ] Sistema de notificações

---

### 5. 📊 Dashboard e Progresso (PROGRESS)

**Status:** ✅ Implementado parcialmente

#### Especificações

**PROGRESS-001: Dashboard do Estudante**
- **Descrição:** Usuários veem seu progresso e cursos disponíveis
- **Critérios de Aceitação:**
  - [x] Estatísticas básicas (cursos em progresso, completos)
  - [x] Lista de cursos disponíveis
  - [x] Cursos obrigatórios destacados
  - [ ] Gráficos de progresso
  - [ ] Recomendações de cursos
  - [ ] Próximas aulas
- **Arquivos:**
  - `app/dashboard/page.tsx` ✅
- **Tarefas Pendentes:**
  - [ ] Gráficos e visualizações
  - [ ] Sistema de recomendações
  - [ ] Timeline de aprendizado

**PROGRESS-002: Rastreamento de Progresso**
- **Descrição:** Sistema rastreia progresso em cursos e aulas
- **Critérios de Aceitação:**
  - [x] Tabelas: user_course_progress, user_lesson_progress
  - [x] Cálculo de porcentagem de conclusão
  - [x] Status: not_started, in_progress, completed, overdue
  - [ ] Progresso por módulo
  - [ ] Tempo de estudo
  - [ ] Histórico de atividades
- **Arquivos:**
  - Schema ✅
  - `app/actions/progress.ts` ✅
- **Tarefas Pendentes:**
  - [ ] Métricas avançadas
  - [ ] Histórico detalhado

**PROGRESS-003: Player de Aulas**
- **Descrição:** Interface para assistir aulas e marcar progresso
- **Critérios de Aceitação:**
  - [ ] Página de player (`/courses/[slug]/[moduleId]/[lessonId]`)
  - [ ] Player de vídeo com controles
  - [ ] Marcação automática de progresso
  - [ ] Navegação entre aulas
  - [ ] Notas durante a aula
  - [ ] Material complementar
- **Arquivos:**
  - `app/courses/[slug]/[moduleId]/[lessonId]/page.tsx` ❌
- **Tarefas Pendentes:**
  - [ ] Implementar player completo
  - [ ] Sistema de notas
  - [ ] Download de materiais

---

### 6. 🏆 Certificados (CERTIFICATES)

**Status:** ⚠️ Estrutura criada, implementação pendente

#### Especificações

**CERT-001: Geração de Certificados**
- **Descrição:** Sistema gera certificados quando curso é completado
- **Critérios de Aceitação:**
  - [x] Tabela `certificates`
  - [x] Tabela `certificate_templates`
  - [ ] Lógica de geração automática
  - [ ] Geração de PDF
  - [ ] Código de verificação único
  - [ ] Assinatura digital
- **Arquivos:**
  - Schema ✅
  - `app/actions/certificates.ts` ❌
- **Tarefas Pendentes:**
  - [ ] Server Actions para certificados
  - [ ] Geração de PDF
  - [ ] Templates customizáveis

**CERT-002: Templates de Certificado**
- **Descrição:** Organizações podem ter templates customizados
- **Critérios de Aceitação:**
  - [x] Tabela `certificate_templates`
  - [x] Campos: template_html, template_css, design_config
  - [ ] Editor visual de templates
  - [ ] Preview de template
  - [ ] Campos dinâmicos (nome, curso, data, etc.)
- **Arquivos:**
  - Schema ✅
- **Tarefas Pendentes:**
  - [ ] Interface de criação de templates
  - [ ] Editor visual

**CERT-003: Verificação de Certificados**
- **Descrição:** Certificados podem ser verificados publicamente
- **Critérios de Aceitação:**
  - [x] Campo `verification_code` único
  - [ ] Página pública de verificação (`/certificates/verify/[code]`)
  - [ ] API de verificação
  - [ ] Download de PDF
  - [ ] Compartilhamento em redes sociais
- **Arquivos:**
  - Schema ✅
  - `app/certificates/verify/[code]/page.tsx` ❌
- **Tarefas Pendentes:**
  - [ ] Página de verificação
  - [ ] API pública

---

### 7. 📝 Quizzes e Avaliações (QUIZZES)

**Status:** ⚠️ Estrutura criada, implementação pendente

#### Especificações

**QUIZ-001: Criação de Quizzes**
- **Descrição:** Admins podem criar quizzes para cursos/aulas
- **Critérios de Aceitação:**
  - [x] Tabelas: quizzes, quiz_questions, question_options
  - [ ] Interface de criação de quiz
  - [ ] Tipos de questão: múltipla escolha, verdadeiro/falso, cenário
  - [ ] Configurações: passing_score, max_attempts, time_limit
  - [ ] Banco de questões reutilizáveis
- **Arquivos:**
  - Schema ✅
  - `app/admin/quizzes/` ❌
- **Tarefas Pendentes:**
  - [ ] CRUD completo de quizzes
  - [ ] Interface de criação
  - [ ] Banco de questões

**QUIZ-002: Realização de Quizzes**
- **Descrição:** Usuários podem fazer quizzes e receber feedback
- **Critérios de Aceitação:**
  - [x] Tabelas: user_quiz_attempts, user_answers
  - [ ] Interface de quiz interativa
  - [ ] Timer (se aplicável)
  - [ ] Feedback imediato
  - [ ] Exibição de respostas corretas
  - [ ] Histórico de tentativas
- **Arquivos:**
  - Schema ✅
  - `app/courses/[slug]/quiz/[quizId]/page.tsx` ❌
- **Tarefas Pendentes:**
  - [ ] Player de quiz
  - [ ] Sistema de pontuação
  - [ ] Feedback visual

**QUIZ-003: Análise de Resultados**
- **Descrição:** Admins podem analisar resultados de quizzes
- **Critérios de Aceitação:**
  - [ ] Estatísticas por questão
  - [ ] Taxa de acerto
  - [ ] Tempo médio de resposta
  - [ ] Relatórios por usuário/organização
  - [ ] Exportação de dados
- **Arquivos:**
  - `app/admin/quizzes/[id]/analytics/page.tsx` ❌
- **Tarefas Pendentes:**
  - [ ] Dashboard de analytics
  - [ ] Relatórios

---

### 8. 🛣️ Trilhas de Aprendizado (LEARNING_PATHS)

**Status:** ⚠️ Estrutura criada, implementação pendente

#### Especificações

**PATH-001: Criação de Trilhas**
- **Descrição:** Admins podem criar trilhas de aprendizado (sequência de cursos)
- **Critérios de Aceitação:**
  - [x] Tabelas: learning_paths, path_courses
  - [ ] Interface de criação de trilha
  - [ ] Ordenação de cursos na trilha
  - [ ] Pré-requisitos entre cursos
  - [ ] Badges/conquistas
- **Arquivos:**
  - Schema ✅
  - `app/admin/paths/` ❌
- **Tarefas Pendentes:**
  - [ ] CRUD de trilhas
  - [ ] Interface visual

**PATH-002: Progresso em Trilhas**
- **Descrição:** Usuários podem ver e acompanhar progresso em trilhas
- **Critérios de Aceitação:**
  - [x] Tabela `user_path_assignments`
  - [ ] Visualização de trilha (timeline)
  - [ ] Progresso por curso na trilha
  - [ ] Certificado de conclusão da trilha
  - [ ] Recomendações baseadas em trilhas
- **Arquivos:**
  - Schema ✅
  - `app/paths/[slug]/page.tsx` ❌
- **Tarefas Pendentes:**
  - [ ] Visualização de trilha
  - [ ] Cálculo de progresso

---

### 9. 👥 Gestão de Usuários (USERS)

**Status:** ✅ Implementado parcialmente

#### Especificações

**USER-001: Lista de Usuários**
- **Descrição:** Admins podem ver e gerenciar usuários
- **Critérios de Aceitação:**
  - [x] Lista de usuários com filtros
  - [x] Busca por nome/email
  - [x] Filtros por role/organização/status
  - [ ] Ações em massa
  - [ ] Exportação de lista
  - [ ] Importação via CSV
- **Arquivos:**
  - `app/admin/users/page.tsx` ✅
- **Tarefas Pendentes:**
  - [ ] Ações em massa
  - [ ] Importação/exportação

**USER-002: Perfil de Usuário**
- **Descrição:** Usuários podem ver e editar seu perfil
- **Critérios de Aceitação:**
  - [ ] Página de perfil (`/profile`)
  - [ ] Edição de informações básicas
  - [ ] Upload de avatar
  - [ ] Alteração de senha
  - [ ] Preferências de notificação
  - [ ] Histórico de atividades
- **Arquivos:**
  - `app/profile/page.tsx` ❌
- **Tarefas Pendentes:**
  - [ ] Página de perfil completa
  - [ ] Upload de avatar
  - [ ] Preferências

**USER-003: Gestão de Usuários por Organização**
- **Descrição:** Org managers podem gerenciar usuários da organização
- **Critérios de Aceitação:**
  - [x] Lista de usuários da organização
  - [x] Criar usuário na organização
  - [ ] Atribuir cursos a usuários
  - [ ] Ver progresso de usuários
  - [ ] Relatórios por usuário
- **Arquivos:**
  - `app/admin/organizations/[id]/page.tsx` (aba users) ✅
- **Tarefas Pendentes:**
  - [ ] Interface de atribuição de cursos
  - [ ] Dashboard de progresso por usuário

---

### 10. 📈 Relatórios e Analytics (REPORTS)

**Status:** ⚠️ Estrutura criada, implementação pendente

#### Especificações

**REPORT-001: Dashboard de Relatórios**
- **Descrição:** Admins podem acessar relatórios e analytics
- **Critérios de Aceitação:**
  - [x] Página base (`/admin/reports`)
  - [ ] Gráficos interativos
  - [ ] Filtros por período/organização
  - [ ] Exportação (PDF, CSV, Excel)
  - [ ] Agendamento de relatórios
- **Arquivos:**
  - `app/admin/reports/page.tsx` ✅ (placeholder)
- **Tarefas Pendentes:**
  - [ ] Implementar relatórios reais
  - [ ] Gráficos (Recharts/Chart.js)
  - [ ] Exportação

**REPORT-002: Relatórios de Cursos**
- **Descrição:** Analytics de cursos (acesso, conclusão, tempo médio)
- **Critérios de Aceitação:**
  - [ ] Taxa de conclusão por curso
  - [ ] Tempo médio de conclusão
  - [ ] Taxa de abandono
  - [ ] Cursos mais populares
  - [ ] Análise por módulo/aula
- **Arquivos:**
  - `app/admin/reports/courses/page.tsx` ❌
- **Tarefas Pendentes:**
  - [ ] Queries de analytics
  - [ ] Visualizações

**REPORT-003: Relatórios de Usuários**
- **Descrição:** Analytics de engajamento e progresso de usuários
- **Critérios de Aceitação:**
  - [ ] Usuários mais engajados
  - [ ] Taxa de atividade
  - [ ] Progresso médio
  - [ ] Usuários inativos
  - [ ] Distribuição por organização
- **Arquivos:**
  - `app/admin/reports/users/page.tsx` ❌
- **Tarefas Pendentes:**
  - [ ] Métricas de engajamento
  - [ ] Relatórios

**REPORT-004: Relatórios de Organizações**
- **Descrição:** Performance e uso por organização
- **Critérios de Aceitação:**
  - [ ] Uso de licenças
  - [ ] Taxa de conclusão por organização
  - [ ] ROI por organização
  - [ ] Comparação entre organizações
  - [ ] Relatórios customizados
- **Arquivos:**
  - `app/admin/reports/organizations/page.tsx` ❌
- **Tarefas Pendentes:**
  - [ ] Métricas por organização
  - [ ] Comparações

---

### 11. 🔔 Notificações (NOTIFICATIONS)

**Status:** ❌ Não implementado

#### Especificações

**NOTIF-001: Sistema de Notificações**
- **Descrição:** Sistema de notificações in-app e por email
- **Critérios de Aceitação:**
  - [ ] Tabela de notificações
  - [ ] Notificações in-app
  - [ ] Notificações por email
  - [ ] Preferências de notificação
  - [ ] Templates de email
  - [ ] Fila de processamento
- **Arquivos:**
  - Schema ❌
  - `app/actions/notifications.ts` ❌
- **Tarefas Pendentes:**
  - [ ] Criar schema
  - [ ] Sistema de notificações
  - [ ] Integração com email (Resend/SendGrid)

**NOTIF-002: Tipos de Notificações**
- **Descrição:** Diferentes tipos de notificações
- **Critérios de Aceitação:**
  - [ ] Curso atribuído
  - [ ] Curso obrigatório disponível
  - [ ] Deadline próximo
  - [ ] Curso completado
  - [ ] Certificado disponível
  - [ ] Novo curso disponível
- **Arquivos:**
  - `lib/types/notifications.ts` ❌
- **Tarefas Pendentes:**
  - [ ] Definir tipos
  - [ ] Implementar handlers

---

### 12. 🔍 Busca e Filtros (SEARCH)

**Status:** ⚠️ Implementado parcialmente

#### Especificações

**SEARCH-001: Busca Global**
- **Descrição:** Busca unificada em cursos, usuários, organizações
- **Critérios de Aceitação:**
  - [x] Busca básica em listas
  - [ ] Busca global (barra de busca no header)
  - [ ] Busca com autocomplete
  - [ ] Busca com filtros avançados
  - [ ] Histórico de buscas
  - [ ] Busca por tags/categorias
- **Arquivos:**
  - `app/search/page.tsx` ❌
- **Tarefas Pendentes:**
  - [ ] Componente de busca global
  - [ ] API de busca
  - [ ] Autocomplete

**SEARCH-002: Filtros Avançados**
- **Descrição:** Sistema de filtros reutilizável
- **Critérios de Aceitação:**
  - [x] Filtros básicos em listas
  - [ ] Filtros salvos
  - [ ] Filtros por múltiplos critérios
  - [ ] Filtros por data/período
  - [ ] Filtros por tags
- **Arquivos:**
  - `components/filters/` ❌
- **Tarefas Pendentes:**
  - [ ] Componente de filtros reutilizável
  - [ ] Filtros salvos

---

### 13. 📱 Responsividade e Mobile (MOBILE)

**Status:** ⚠️ Implementado parcialmente

#### Especificações

**MOBILE-001: Design Responsivo**
- **Descrição:** Interface adaptável para mobile, tablet e desktop
- **Critérios de Aceitação:**
  - [x] Layout responsivo básico
  - [x] Sidebar colapsável
  - [ ] Menu mobile otimizado
  - [ ] Touch gestures
  - [ ] PWA (Progressive Web App)
  - [ ] Offline support
- **Arquivos:**
  - Layouts ✅
- **Tarefas Pendentes:**
  - [ ] Menu hamburger mobile
  - [ ] PWA manifest
  - [ ] Service worker

**MOBILE-002: Player Mobile**
- **Descrição:** Player de vídeo otimizado para mobile
- **Critérios de Aceitação:**
  - [ ] Player responsivo
  - [ ] Controles touch-friendly
  - [ ] Picture-in-picture
  - [ ] Download para offline
- **Arquivos:**
  - `components/lesson-player/video-player.tsx` ❌
- **Tarefas Pendentes:**
  - [ ] Player mobile-first

---

### 14. 🌐 Internacionalização (I18N)

**Status:** ⚠️ Estrutura criada, implementação pendente

#### Especificações

**I18N-001: Suporte Multi-idioma**
- **Descrição:** Sistema suporta múltiplos idiomas
- **Critérios de Aceitação:**
  - [x] Enum locale (pt, en, es)
  - [ ] Traduções de interface
  - [ ] Traduções de conteúdo
  - [ ] Seletor de idioma
  - [ ] Detecção automática de idioma
- **Arquivos:**
  - Schema ✅
  - `lib/i18n/` ❌
- **Tarefas Pendentes:**
  - [ ] Sistema de traduções
  - [ ] Arquivos de tradução
  - [ ] Seletor de idioma

---

### 15. 🔐 Segurança e Compliance (SECURITY)

**Status:** ⚠️ Implementado parcialmente

#### Especificações

**SEC-001: Auditoria e Logs**
- **Descrição:** Sistema registra todas as ações importantes
- **Critérios de Aceitação:**
  - [x] Tabela `activity_logs` (schema)
  - [ ] Logging de ações administrativas
  - [ ] Logging de ações de usuários
  - [ ] Visualização de logs
  - [ ] Exportação de logs
  - [ ] Retenção de logs
- **Arquivos:**
  - Schema ✅
  - `app/admin/activity/page.tsx` ✅ (placeholder)
- **Tarefas Pendentes:**
  - [ ] Sistema de logging
  - [ ] Visualização de logs

**SEC-002: Políticas de Segurança**
- **Descrição:** Implementação de políticas de segurança
- **Critérios de Aceitação:**
  - [x] RLS em todas as tabelas
  - [x] Validação de permissões
  - [ ] Política de senha forte
  - [ ] Rate limiting
  - [ ] CSRF protection
  - [ ] XSS protection
- **Arquivos:**
  - Middleware ✅
- **Tarefas Pendentes:**
  - [ ] Políticas de senha
  - [ ] Rate limiting
  - [ ] Validação de inputs

**SEC-003: LGPD Compliance**
- **Descrição:** Conformidade com LGPD
- **Critérios de Aceitação:**
  - [ ] Consentimento de cookies
  - [ ] Política de privacidade
  - [ ] Exportação de dados do usuário
  - [ ] Exclusão de dados (right to be forgotten)
  - [ ] Anonimização de dados
- **Arquivos:**
  - `app/privacy/page.tsx` ❌
- **Tarefas Pendentes:**
  - [ ] Páginas de compliance
  - [ ] Funcionalidades LGPD

---

### 16. 💳 Integrações e Pagamentos (INTEGRATIONS)

**Status:** ⚠️ Estrutura criada, implementação pendente

#### Especificações

**INT-001: Integração com Stripe**
- **Descrição:** Sistema de pagamentos para licenças
- **Critérios de Aceitação:**
  - [x] Campos Stripe no schema (stripe_customer_id, stripe_subscription_id)
  - [ ] Webhook de pagamento
  - [ ] Criação de customer
  - [ ] Gerenciamento de subscription
  - [ ] Histórico de pagamentos
- **Arquivos:**
  - Schema ✅
  - `app/api/stripe/` ❌
- **Tarefas Pendentes:**
  - [ ] Integração Stripe
  - [ ] Webhooks
  - [ ] Interface de pagamento

**INT-002: Integração com Email**
- **Descrição:** Envio de emails transacionais
- **Critérios de Aceitação:**
  - [ ] Configuração de SMTP/API
  - [ ] Templates de email
  - [ ] Emails transacionais (boas-vindas, recuperação, etc.)
  - [ ] Emails de notificação
  - [ ] Fila de emails
- **Arquivos:**
  - `lib/email/` ❌
- **Tarefas Pendentes:**
  - [ ] Integração Resend/SendGrid
  - [ ] Templates
  - [ ] Sistema de fila

**INT-003: Webhooks e APIs**
- **Descrição:** APIs para integrações externas
- **Critérios de Aceitação:**
  - [ ] API REST
  - [ ] Autenticação via API key
  - [ ] Webhooks para eventos
  - [ ] Documentação da API
  - [ ] Rate limiting
- **Arquivos:**
  - `app/api/` ❌
- **Tarefas Pendentes:**
  - [ ] Endpoints da API
  - [ ] Documentação (OpenAPI)

---

### 17. 🎨 Design System e UI (UI)

**Status:** ✅ Implementado parcialmente

#### Especificações

**UI-001: Componentes Base**
- **Descrição:** Biblioteca de componentes reutilizáveis
- **Critérios de Aceitação:**
  - [x] shadcn/ui instalado
  - [x] Componentes básicos (Button, Card, Input, etc.)
  - [ ] Componentes customizados (CourseCard, ProgressBar, etc.)
  - [ ] Storybook para documentação
  - [ ] Testes de componentes
- **Arquivos:**
  - `components/ui/` ✅
  - `components/admin/` ✅ (parcial)
- **Tarefas Pendentes:**
  - [ ] Mais componentes customizados
  - [ ] Storybook
  - [ ] Testes

**UI-002: Design System ness**
- **Descrição:** Aplicação consistente do design system ness
- **Critérios de Aceitação:**
  - [x] Cores (slate-950, primary #00ade8)
  - [x] Tipografia (Inter, Montserrat)
  - [x] Tema dark obrigatório
  - [ ] Tokens de design
  - [ ] Guia de estilo
  - [ ] Componentes documentados
- **Arquivos:**
  - `tailwind.config.ts` ✅
- **Tarefas Pendentes:**
  - [ ] Documentação do design system
  - [ ] Tokens centralizados

**UI-003: Acessibilidade**
- **Descrição:** Conformidade com WCAG 2.1 AA
- **Critérios de Aceitação:**
  - [ ] Navegação por teclado
  - [ ] Screen reader friendly
  - [ ] Contraste adequado
  - [ ] Labels descritivos
  - [ ] ARIA attributes
  - [ ] Testes de acessibilidade
- **Arquivos:**
  - Componentes (parcial)
- **Tarefas Pendentes:**
  - [ ] Auditoria de acessibilidade
  - [ ] Correções

---

### 18. ⚡ Performance e Otimização (PERF)

**Status:** ⚠️ Implementado parcialmente

#### Especificações

**PERF-001: Otimização de Queries**
- **Descrição:** Queries otimizadas e eficientes
- **Critérios de Aceitação:**
  - [x] Índices em tabelas principais
  - [ ] Análise de queries lentas
  - [ ] Otimização de N+1 queries
  - [ ] Cache de queries frequentes
  - [ ] Paginação em todas as listas
- **Arquivos:**
  - Schema ✅
- **Tarefas Pendentes:**
  - [ ] Análise de performance
  - [ ] Cache (React Cache, Redis)

**PERF-002: Otimização de Frontend**
- **Descrição:** Performance otimizada no cliente
- **Critérios de Aceitação:**
  - [x] Server Components
  - [ ] Code splitting
  - [ ] Lazy loading de componentes
  - [ ] Otimização de imagens
  - [ ] Bundle size otimizado
  - [ ] Lighthouse score > 90
- **Arquivos:**
  - Next.js config ✅
- **Tarefas Pendentes:**
  - [ ] Análise de bundle
  - [ ] Otimizações

**PERF-003: CDN e Cache**
- **Descrição:** Cache estratégico para performance
- **Critérios de Aceitação:**
  - [ ] Cache de assets estáticos
  - [ ] Cache de API responses
  - [ ] CDN para mídia
  - [ ] Cache headers apropriados
  - [ ] Invalidação de cache
- **Arquivos:**
  - `next.config.js` ✅
- **Tarefas Pendentes:**
  - [ ] Estratégia de cache
  - [ ] Configuração CDN

---

### 19. 🧪 Testes (TESTING)

**Status:** ❌ Não implementado

#### Especificações

**TEST-001: Testes Unitários**
- **Descrição:** Testes de funções e componentes isolados
- **Critérios de Aceitação:**
  - [ ] Setup de Jest/Vitest
  - [ ] Testes de Server Actions
  - [ ] Testes de componentes
  - [ ] Testes de utilitários
  - [ ] Coverage > 70%
- **Arquivos:**
  - `__tests__/` ❌
- **Tarefas Pendentes:**
  - [ ] Setup de testes
  - [ ] Testes críticos

**TEST-002: Testes de Integração**
- **Descrição:** Testes de fluxos completos
- **Critérios de Aceitação:**
  - [ ] Testes de autenticação
  - [ ] Testes de CRUD
  - [ ] Testes de permissões
  - [ ] Testes E2E (Playwright)
- **Arquivos:**
  - `tests/` ❌
- **Tarefas Pendentes:**
  - [ ] Setup E2E
  - [ ] Testes principais

**TEST-003: Testes de Performance**
- **Descrição:** Testes de carga e performance
- **Critérios de Aceitação:**
  - [ ] Testes de carga (k6)
  - [ ] Monitoramento de performance
  - [ ] Alertas de degradação
- **Arquivos:**
  - `tests/performance/` ❌
- **Tarefas Pendentes:**
  - [ ] Setup de testes de performance

---

### 20. 📚 Documentação (DOCS)

**Status:** ⚠️ Parcial

#### Especificações

**DOCS-001: Documentação Técnica**
- **Descrição:** Documentação completa do sistema
- **Critérios de Aceitação:**
  - [x] README básico
  - [x] Planejamentos (Admin, Cursos)
  - [ ] Documentação de API
  - [ ] Guia de desenvolvimento
  - [ ] Arquitetura documentada
  - [ ] Diagramas
- **Arquivos:**
  - `README.md` ✅
  - `PLANEJAMENTO_*.md` ✅
- **Tarefas Pendentes:**
  - [ ] Documentação completa
  - [ ] Diagramas de arquitetura

**DOCS-002: Documentação de Usuário**
- **Descrição:** Guias para usuários finais
- **Critérios de Aceitação:**
  - [ ] Guia do estudante
  - [ ] Guia do admin
  - [ ] FAQ
  - [ ] Tutoriais em vídeo
- **Arquivos:**
  - `docs/user/` ❌
- **Tarefas Pendentes:**
  - [ ] Criar documentação de usuário

---

## 📊 Matriz de Prioridades

### Prioridade Crítica (P0) - MVP
1. ✅ Autenticação básica
2. ✅ Dashboard administrativo
3. ✅ Gestão de organizações
4. ⚠️ CRUD completo de cursos
5. ⚠️ Player de aulas básico
6. ⚠️ Sistema de progresso
7. ⚠️ Certificados básicos

### Prioridade Alta (P1) - Fase 1
1. ⚠️ Quizzes funcionais
2. ⚠️ Relatórios básicos
3. ⚠️ Notificações essenciais
4. ⚠️ Busca global
5. ⚠️ Perfil de usuário

### Prioridade Média (P2) - Fase 2
1. ❌ Trilhas de aprendizado
2. ❌ Personalização avançada
3. ❌ Analytics avançados
4. ❌ Integração Stripe
5. ❌ I18N completo

### Prioridade Baixa (P3) - Fase 3
1. ❌ PWA
2. ❌ Testes completos
3. ❌ Documentação completa
4. ❌ APIs públicas
5. ❌ Webhooks

---

## 🗓️ Roadmap de Implementação

### Fase 1: MVP (4-6 semanas)
**Objetivo:** Sistema funcional básico

**Sprint 1-2:**
- ✅ Autenticação e autorização
- ✅ Dashboard administrativo
- ✅ Gestão de organizações
- ✅ Gestão básica de usuários

**Sprint 3-4:**
- ⚠️ CRUD completo de cursos
- ⚠️ Gerenciamento de módulos e aulas
- ⚠️ Player de aulas básico
- ⚠️ Sistema de progresso

**Sprint 5-6:**
- ⚠️ Certificados básicos
- ⚠️ Quizzes básicos
- ⚠️ Relatórios essenciais

### Fase 2: Features Avançadas (6-8 semanas)
**Objetivo:** Funcionalidades avançadas e melhorias

**Sprint 7-8:**
- ❌ Notificações
- ❌ Busca global
- ❌ Perfil de usuário completo
- ❌ Analytics avançados

**Sprint 9-10:**
- ❌ Trilhas de aprendizado
- ❌ Personalização avançada
- ❌ Templates de certificado
- ❌ Sistema de badges

**Sprint 11-12:**
- ❌ Integração Stripe
- ❌ Emails transacionais
- ❌ I18N completo

### Fase 3: Polimento e Escala (4-6 semanas)
**Objetivo:** Performance, testes, documentação

**Sprint 13-14:**
- ❌ Testes (unitários, integração, E2E)
- ❌ Otimizações de performance
- ❌ PWA
- ❌ Acessibilidade completa

**Sprint 15-16:**
- ❌ Documentação completa
- ❌ APIs públicas
- ❌ Monitoramento e alertas
- ❌ LGPD compliance

---

## 📐 Arquitetura Técnica

### Stack Tecnológico

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Server Components
- Server Actions

**Backend:**
- Supabase (PostgreSQL)
- Row Level Security (RLS)
- Server Actions (Next.js)
- Edge Functions (futuro)

**Infraestrutura:**
- Vercel (hosting)
- Supabase (database, auth, storage)
- CDN (Vercel Edge Network)

### Padrões de Código

**Estrutura de Arquivos:**
```
app/
├── (auth)/              # Rotas de autenticação
├── (dashboard)/         # Rotas do dashboard
├── admin/               # Rotas administrativas
├── api/                 # API routes (futuro)
└── actions/             # Server Actions

components/
├── ui/                  # Componentes base (shadcn)
├── admin/               # Componentes administrativos
└── course/              # Componentes de cursos

lib/
├── supabase/            # Clientes Supabase
├── types/               # TypeScript types
└── utils/               # Utilitários
```

**Convenções:**
- Server Components por padrão
- Client Components apenas quando necessário ('use client')
- Server Actions para mutações
- TypeScript strict mode
- Nomes em português para usuários, inglês para código

---

## 🔄 Fluxos Principais

### Fluxo 1: Criação e Disponibilização de Curso

```
1. Superadmin cria curso global
   ↓
2. Curso publicado (status: published)
   ↓
3. Superadmin atribui curso a organização
   (organization_course_access)
   ↓
4. Configura licenças e acesso
   ↓
5. Curso disponível para usuários da organização
   ↓
6. Org Manager pode personalizar curso
   (course_customizations)
   ↓
7. Org Manager atribui curso a usuários específicos
   (organization_course_assignments)
   ↓
8. Usuários veem curso no dashboard
```

### Fluxo 2: Progresso e Certificação

```
1. Usuário inicia curso
   ↓
2. Sistema cria user_course_progress
   ↓
3. Usuário assiste aulas
   ↓
4. Sistema atualiza user_lesson_progress
   ↓
5. Sistema calcula completion_percentage
   ↓
6. Usuário completa curso (100%)
   ↓
7. Sistema verifica requisitos (quiz, etc.)
   ↓
8. Sistema gera certificado automaticamente
   ↓
9. Certificado disponível para download
```

### Fluxo 3: Gestão Administrativa

```
1. Superadmin acessa /admin
   ↓
2. Vê dashboard com métricas
   ↓
3. Navega para organizações
   ↓
4. Seleciona organização
   ↓
5. Vê detalhes (usuários, cursos, licenças)
   ↓
6. Pode "visitar" organização (modo visualização)
   ↓
7. Pode editar configurações
   ↓
8. Pode atribuir cursos/licenças
```

---

## 📋 Checklist de Features por Módulo

### Módulo: Autenticação
- [x] Login
- [x] Logout
- [x] Criação de usuário (admin)
- [ ] Recuperação de senha
- [ ] 2FA
- [ ] Sessão persistente

### Módulo: Multi-Tenancy
- [x] CRUD de organizações
- [x] Visualização de organização
- [x] Isolamento de dados (RLS)
- [ ] Upload de logo
- [ ] Configurações avançadas

### Módulo: Cursos
- [x] Lista de cursos
- [x] Criar curso (básico)
- [ ] Editar curso completo
- [ ] Gerenciar módulos
- [ ] Gerenciar aulas
- [ ] Upload de mídia
- [ ] Player de vídeo

### Módulo: Cursos x Tenant
- [x] Atribuir curso a organização
- [x] Controle de licenças
- [x] Cursos obrigatórios
- [x] Personalização básica
- [ ] Interface de personalização
- [ ] Atribuição em massa

### Módulo: Progresso
- [x] Rastreamento básico
- [x] Dashboard com progresso
- [ ] Player de aulas
- [ ] Notas durante aula
- [ ] Histórico detalhado

### Módulo: Certificados
- [x] Schema de certificados
- [x] Schema de templates
- [ ] Geração de PDF
- [ ] Editor de templates
- [ ] Verificação pública

### Módulo: Quizzes
- [x] Schema completo
- [ ] CRUD de quizzes
- [ ] Player de quiz
- [ ] Analytics de resultados

### Módulo: Relatórios
- [x] Estrutura básica
- [ ] Relatórios reais
- [ ] Gráficos
- [ ] Exportação

### Módulo: Notificações
- [ ] Schema
- [ ] Sistema de notificações
- [ ] Emails transacionais

---

## 🎯 Métricas de Sucesso

### Métricas Técnicas
- **Performance:** Lighthouse score > 90
- **Disponibilidade:** Uptime > 99.9%
- **Tempo de resposta:** < 200ms (p95)
- **Coverage de testes:** > 70%

### Métricas de Negócio
- **Taxa de conclusão de cursos:** > 60%
- **Engajamento:** > 70% usuários ativos mensalmente
- **Satisfação:** NPS > 50
- **Adoção:** > 80% organizações usando sistema

---

## 🚀 Próximos Passos Imediatos

### Prioridade 1 (Esta Semana)
1. Completar CRUD de cursos
2. Implementar gerenciamento de módulos/aulas
3. Criar player de aulas básico
4. Implementar sistema de certificados básico

### Prioridade 2 (Próximas 2 Semanas)
1. Quizzes funcionais
2. Relatórios básicos
3. Notificações essenciais
4. Perfil de usuário

### Prioridade 3 (Próximo Mês)
1. Analytics avançados
2. Personalização avançada
3. Integração Stripe
4. I18N completo

---

**Documento criado em:** 2024-11-25
**Última atualização:** 2024-11-25
**Versão:** 1.0


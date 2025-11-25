# 🚀 Plano de Implementação Completo - n.training Platform

## 📋 Visão Geral

Este documento apresenta um plano detalhado e executável para implementar todas as funcionalidades avançadas da plataforma n.training, organizado em fases, sprints e tarefas específicas.

**Duração Total Estimada:** 16-20 semanas (4-5 meses)
**Equipe Recomendada:** 2-3 desenvolvedores full-stack

---

## 🎯 Estrutura do Plano

- **Fase 1: MVP Completo** (4-6 semanas) - Funcionalidades essenciais
- **Fase 2: Features Avançadas Core** (6-8 semanas) - Funcionalidades principais
- **Fase 3: Integrações e Polimento** (4-6 semanas) - Integrações e refinamentos
- **Fase 4: Escala e Otimização** (2 semanas) - Performance e testes

---

## 📅 FASE 1: MVP Completo (4-6 semanas)

### Objetivo
Completar todas as funcionalidades básicas essenciais para o sistema funcionar end-to-end.

---

### Sprint 1.1: CRUD Completo de Cursos (1 semana)

#### Tarefas

**TAREFA-001: Página de Criação de Curso**
- [ ] Criar `app/admin/courses/new/page.tsx`
- [ ] Formulário completo com campos:
  - Título, slug, descrição, objetivos
  - Thumbnail (upload)
  - Nível, área, duração
  - Status (draft/published)
- [ ] Validação de formulário
- [ ] Server Action `createCourse` em `app/actions/courses.ts`
- [ ] Redirecionamento após criação
- **Estimativa:** 8 horas
- **Prioridade:** P0

**TAREFA-002: Página de Edição de Curso**
- [ ] Criar `app/admin/courses/[id]/edit/page.tsx`
- [ ] Carregar dados do curso existente
- [ ] Formulário pré-preenchido
- [ ] Server Action `updateCourse`
- [ ] Upload de nova thumbnail
- [ ] Validação e feedback
- **Estimativa:** 8 horas
- **Prioridade:** P0

**TAREFA-003: Upload de Thumbnail**
- [ ] Configurar Supabase Storage bucket `course-thumbnails`
- [ ] Componente de upload de imagem
- [ ] Preview da imagem antes de salvar
- [ ] Redimensionamento automático (opcional)
- [ ] Server Action para upload
- **Estimativa:** 6 horas
- **Prioridade:** P0

**TAREFA-004: Gerenciamento de Módulos**
- [ ] Criar `app/admin/courses/[id]/modules/page.tsx`
- [ ] Lista de módulos com drag-and-drop para reordenar
- [ ] Criar novo módulo (modal/form)
- [ ] Editar módulo existente
- [ ] Deletar módulo (com confirmação)
- [ ] Server Actions: `createModule`, `updateModule`, `deleteModule`, `reorderModules`
- **Estimativa:** 12 horas
- **Prioridade:** P0

**TAREFA-005: Gerenciamento de Aulas**
- [ ] Criar `app/admin/courses/[id]/modules/[moduleId]/lessons/page.tsx`
- [ ] Lista de aulas com drag-and-drop
- [ ] Criar nova aula (modal com tipo de conteúdo)
- [ ] Editar aula existente
- [ ] Deletar aula
- [ ] Upload de vídeo/arquivo para aula
- [ ] Server Actions: `createLesson`, `updateLesson`, `deleteLesson`, `reorderLessons`
- **Estimativa:** 16 horas
- **Prioridade:** P0

**TAREFA-006: Upload de Mídia**
- [ ] Configurar Supabase Storage bucket `lesson-materials`
- [ ] Componente de upload de vídeo
- [ ] Componente de upload de PDF
- [ ] Progress bar para uploads grandes
- [ ] Validação de tipo e tamanho de arquivo
- **Estimativa:** 10 horas
- **Prioridade:** P0

**Total Sprint 1.1:** ~60 horas (1.5 semanas)

---

### Sprint 1.2: Player de Aulas (1 semana)

#### Tarefas

**TAREFA-007: Página de Detalhes do Curso**
- [ ] Criar `app/courses/[slug]/page.tsx`
- [ ] Exibir informações do curso
- [ ] Lista de módulos e aulas
- [ ] Progresso do usuário
- [ ] Botão "Iniciar Curso" ou "Continuar"
- [ ] Verificar acesso do usuário ao curso
- **Estimativa:** 8 horas
- **Prioridade:** P0

**TAREFA-008: Player de Vídeo**
- [ ] Criar `app/courses/[slug]/[moduleId]/[lessonId]/page.tsx`
- [ ] Componente `components/lesson-player/video-player.tsx`
- [ ] Integração com player de vídeo (ex: Video.js ou React Player)
- [ ] Controles: play, pause, volume, fullscreen
- [ ] Marcação automática de progresso (a cada 10%)
- [ ] Navegação entre aulas (anterior/próxima)
- [ ] Sidebar com lista de módulos/aulas
- **Estimativa:** 16 horas
- **Prioridade:** P0

**TAREFA-009: Visualizador de PDF**
- [ ] Componente `components/lesson-player/pdf-viewer.tsx`
- [ ] Integração com react-pdf ou similar
- [ ] Controles: zoom, navegação de páginas
- [ ] Download do PDF
- [ ] Marcação de progresso ao visualizar
- **Estimativa:** 8 horas
- **Prioridade:** P0

**TAREFA-010: Visualizador de Texto**
- [ ] Componente `components/lesson-player/text-viewer.tsx`
- [ ] Renderização de markdown/HTML
- [ ] Estilização consistente
- [ ] Marcação de progresso ao rolar
- **Estimativa:** 4 horas
- **Prioridade:** P0

**TAREFA-011: Sistema de Progresso em Tempo Real**
- [ ] Atualizar `app/actions/progress.ts`:
  - `updateLessonProgress` (chamado periodicamente)
  - `markLessonComplete`
  - `updateCourseProgressFromLessons`
- [ ] Debounce para evitar muitas chamadas
- [ ] Otimistic updates no frontend
- [ ] Sincronização de progresso entre dispositivos
- **Estimativa:** 10 horas
- **Prioridade:** P0

**TAREFA-012: Navegação entre Aulas**
- [ ] Botões "Aula Anterior" / "Próxima Aula"
- [ ] Desabilitar navegação se pré-requisito não completado
- [ ] Indicador visual de aulas completadas
- [ ] Breadcrumb com módulo/curso
- **Estimativa:** 6 horas
- **Prioridade:** P0

**Total Sprint 1.2:** ~52 horas (1.3 semanas)

---

### Sprint 1.3: Certificados Básicos (1 semana)

#### Tarefas

**TAREFA-013: Geração Automática de Certificados**
- [ ] Criar `app/actions/certificates.ts`
- [ ] Função `generateCertificate`:
  - Verificar requisitos de conclusão
  - Gerar código de verificação único
  - Criar registro na tabela `certificates`
  - Chamar geração de PDF
- [ ] Trigger no banco para gerar automaticamente ao completar curso
- **Estimativa:** 8 horas
- **Prioridade:** P0

**TAREFA-014: Geração de PDF**
- [ ] Instalar biblioteca (ex: `@react-pdf/renderer` ou `pdfkit`)
- [ ] Criar template básico de certificado
- [ ] Função `generateCertificatePDF`:
  - Layout do certificado
  - Dados do usuário e curso
  - Código de verificação
  - Data de emissão
- [ ] Upload do PDF para Supabase Storage
- [ ] Retornar URL do PDF
- **Estimativa:** 12 horas
- **Prioridade:** P0

**TAREFA-015: Página de Certificados do Usuário**
- [ ] Criar `app/certificates/page.tsx`
- [ ] Lista de certificados do usuário
- [ ] Card de certificado com:
  - Nome do curso
  - Data de emissão
  - Botão de download
  - Botão de verificação
- [ ] Server Action `getUserCertificates`
- **Estimativa:** 6 horas
- **Prioridade:** P0

**TAREFA-016: Download de Certificado**
- [ ] Endpoint ou Server Action para download
- [ ] Verificar permissões do usuário
- [ ] Retornar arquivo PDF
- [ ] Headers apropriados para download
- **Estimativa:** 4 horas
- **Prioridade:** P0

**TAREFA-017: Página de Verificação Pública**
- [ ] Criar `app/certificates/verify/[code]/page.tsx`
- [ ] Buscar certificado por código
- [ ] Exibir informações:
  - Nome do usuário
  - Nome do curso
  - Data de emissão
  - Status (válido/inválido)
- [ ] Design público e profissional
- [ ] Compartilhamento em redes sociais (meta tags)
- **Estimativa:** 8 horas
- **Prioridade:** P0

**Total Sprint 1.3:** ~38 horas (1 semana)

---

### Sprint 1.4: Quizzes Básicos (1 semana)

#### Tarefas

**TAREFA-018: CRUD de Quizzes**
- [ ] Criar `app/admin/quizzes/page.tsx` (lista)
- [ ] Criar `app/admin/quizzes/new/page.tsx` (criar)
- [ ] Criar `app/admin/quizzes/[id]/edit/page.tsx` (editar)
- [ ] Formulário de quiz:
  - Título, descrição
  - Curso ou aula associada
  - Nota mínima, tentativas máximas, tempo limite
- [ ] Server Actions: `createQuiz`, `updateQuiz`, `deleteQuiz`
- **Estimativa:** 12 horas
- **Prioridade:** P0

**TAREFA-019: CRUD de Questões**
- [ ] Criar `app/admin/quizzes/[id]/questions/page.tsx`
- [ ] Interface para adicionar questões:
  - Tipo (múltipla escolha, verdadeiro/falso, cenário)
  - Texto da questão
  - Opções de resposta
  - Resposta correta
  - Explicação
  - Pontos
- [ ] Reordenar questões (drag-and-drop)
- [ ] Editar/deletar questões
- [ ] Server Actions: `createQuestion`, `updateQuestion`, `deleteQuestion`
- **Estimativa:** 16 horas
- **Prioridade:** P0

**TAREFA-020: Player de Quiz**
- [ ] Criar `app/courses/[slug]/quiz/[quizId]/page.tsx`
- [ ] Exibir questões uma por vez ou todas
- [ ] Timer (se configurado)
- [ ] Seleção de respostas
- [ ] Botão "Finalizar Quiz"
- [ ] Validação antes de finalizar
- **Estimativa:** 12 horas
- **Prioridade:** P0

**TAREFA-021: Correção e Feedback**
- [ ] Função `submitQuiz` em `app/actions/quizzes.ts`
- [ ] Calcular pontuação
- [ ] Salvar tentativa em `user_quiz_attempts`
- [ ] Salvar respostas em `user_answers`
- [ ] Exibir resultado:
  - Pontuação total
  - Questões corretas/incorretas
  - Explicações (se configurado)
- [ ] Verificar se passou (nota mínima)
- [ ] Atualizar progresso do curso se necessário
- **Estimativa:** 10 horas
- **Prioridade:** P0

**TAREFA-022: Histórico de Tentativas**
- [ ] Exibir tentativas anteriores do usuário
- [ ] Mostrar pontuação de cada tentativa
- [ ] Data/hora de cada tentativa
- [ ] Limite de tentativas máximas
- **Estimativa:** 6 horas
- **Prioridade:** P0

**Total Sprint 1.4:** ~56 horas (1.4 semanas)

---

### Sprint 1.5: Melhorias e Polimento MVP (1 semana)

#### Tarefas

**TAREFA-023: Perfil de Usuário**
- [ ] Criar `app/profile/page.tsx`
- [ ] Editar informações básicas (nome, avatar)
- [ ] Upload de avatar
- [ ] Alteração de senha
- [ ] Preferências de notificação (básico)
- **Estimativa:** 10 horas
- **Prioridade:** P1

**TAREFA-024: Busca Básica**
- [ ] Componente de busca no header
- [ ] Busca em cursos (título, descrição)
- [ ] Resultados em tempo real
- [ ] Página de resultados `/search?q=termo`
- **Estimativa:** 8 horas
- **Prioridade:** P1

**TAREFA-025: Filtros Básicos**
- [ ] Componente de filtros em `/courses`
- [ ] Filtros: área, nível, status
- [ ] Aplicar múltiplos filtros
- [ ] Limpar filtros
- **Estimativa:** 6 horas
- **Prioridade:** P1

**TAREFA-026: Melhorias de UI/UX**
- [ ] Loading states em todas as páginas
- [ ] Error boundaries
- [ ] Mensagens de erro amigáveis
- [ ] Confirmações para ações destrutivas
- [ ] Toasts para feedback de ações
- **Estimativa:** 8 horas
- **Prioridade:** P1

**TAREFA-027: Testes Básicos**
- [ ] Setup de testes (Jest + React Testing Library)
- [ ] Testes de Server Actions críticas
- [ ] Testes de componentes principais
- [ ] Coverage mínimo de 40%
- **Estimativa:** 12 horas
- **Prioridade:** P1

**Total Sprint 1.5:** ~44 horas (1.1 semanas)

---

## 📅 FASE 2: Features Avançadas Core (6-8 semanas)

### Objetivo
Implementar funcionalidades avançadas que diferenciam a plataforma.

---

### Sprint 2.1: Sistema de Cursos x Tenant Completo (2 semanas)

#### Tarefas

**TAREFA-028: Interface de Atribuição de Cursos**
- [ ] Criar `app/admin/courses/assign/page.tsx`
- [ ] Selecionar curso
- [ ] Selecionar organização
- [ ] Configurar tipo de acesso (licensed/unlimited/trial)
- [ ] Configurar número de licenças
- [ ] Configurar validade
- [ ] Marcar como obrigatório
- [ ] Configurar auto-enroll
- [ ] Server Action `assignCourseToOrganization`
- **Estimativa:** 12 horas
- **Prioridade:** P0

**TAREFA-029: Dashboard de Licenças**
- [ ] Criar `app/admin/licenses/page.tsx`
- [ ] Lista de cursos por organização
- [ ] Métricas: total, usado, disponível
- [ ] Alertas de licenças acabando
- [ ] Alertas de expiração
- [ ] Gráficos de utilização
- **Estimativa:** 16 horas
- **Prioridade:** P0

**TAREFA-030: Gestão de Licenças**
- [ ] Adicionar/remover licenças
- [ ] Renovar acesso
- [ ] Histórico de compras/utilização
- [ ] Exportar relatório de licenças
- **Estimativa:** 10 horas
- **Prioridade:** P0

**TAREFA-031: Interface de Personalização**
- [ ] Criar `app/admin/courses/[id]/customize/page.tsx`
- [ ] Selecionar organização
- [ ] Personalizar título, descrição, thumbnail
- [ ] Selecionar módulos/aulas a incluir
- [ ] Reordenar módulos/aulas
- [ ] Preview da personalização
- [ ] Server Action `customizeCourse`
- **Estimativa:** 20 horas
- **Prioridade:** P0

**TAREFA-032: Aplicação de Personalizações**
- [ ] Modificar `getCoursesWithProgress` para aplicar customizações
- [ ] Mostrar título/descrição customizados
- [ ] Mostrar apenas módulos/aulas selecionados
- [ ] Manter ordem customizada
- **Estimativa:** 12 horas
- **Prioridade:** P0

**TAREFA-033: Atribuição de Cursos a Usuários**
- [ ] Criar `app/admin/organizations/[id]/assign-courses/page.tsx`
- [ ] Selecionar usuários (múltipla seleção)
- [ ] Selecionar cursos
- [ ] Configurar deadline
- [ ] Marcar como obrigatório
- [ ] Server Action `assignCourseToUser` (em massa)
- **Estimativa:** 14 horas
- **Prioridade:** P0

**TAREFA-034: Cursos Obrigatórios no Dashboard**
- [ ] Melhorar exibição de cursos obrigatórios
- [ ] Badge destacado
- [ ] Contador de dias até deadline
- [ ] Alertas visuais
- [ ] Filtro para ver apenas obrigatórios
- **Estimativa:** 8 horas
- **Prioridade:** P0

**Total Sprint 2.1:** ~92 horas (2.3 semanas)

---

### Sprint 2.2: Sistema de Notificações (1.5 semanas)

#### Tarefas

**TAREFA-035: Schema de Notificações**
- [ ] Criar migration para tabela `notifications`
- [ ] Campos: user_id, type, title, message, read, metadata, created_at
- [ ] Índices apropriados
- [ ] RLS policies
- **Estimativa:** 4 horas
- **Prioridade:** P1

**TAREFA-036: Sistema de Notificações In-App**
- [ ] Componente de notificações no header
- [ ] Badge com contador de não lidas
- [ ] Dropdown com lista de notificações
- [ ] Marcar como lida
- [ ] Marcar todas como lidas
- [ ] Link para ação relacionada
- **Estimativa:** 12 horas
- **Prioridade:** P1

**TAREFA-037: Criação de Notificações**
- [ ] Criar `app/actions/notifications.ts`
- [ ] Função `createNotification`
- [ ] Tipos de notificação:
  - Curso atribuído
  - Deadline próximo
  - Curso completado
  - Certificado disponível
  - Novo conteúdo
- [ ] Criar notificações automaticamente em eventos
- **Estimativa:** 10 horas
- **Prioridade:** P1

**TAREFA-038: Integração com Email (Resend)**
- [ ] Configurar Resend API
- [ ] Criar templates de email:
  - Boas-vindas
  - Curso atribuído
  - Deadline próximo
  - Curso completado
  - Certificado disponível
- [ ] Função `sendEmail` em `lib/email/`
- [ ] Fila de processamento (opcional)
- **Estimativa:** 16 horas
- **Prioridade:** P1

**TAREFA-039: Preferências de Notificação**
- [ ] Adicionar campos em `users` ou tabela separada
- [ ] Interface em `/profile` para configurar
- [ ] Tipos: email, in-app, push
- [ ] Frequência: imediato, diário, semanal
- [ ] Horários de silêncio
- **Estimativa:** 10 horas
- **Prioridade:** P1

**TAREFA-040: Notificações Inteligentes**
- [ ] Agrupamento de notificações similares
- [ ] Priorização automática
- [ ] Evitar spam (rate limiting)
- [ ] Aprender com comportamento do usuário
- **Estimativa:** 12 horas
- **Prioridade:** P2

**Total Sprint 2.2:** ~64 horas (1.6 semanas)

---

### Sprint 2.3: Trilhas de Aprendizado (1.5 semanas)

#### Tarefas

**TAREFA-041: CRUD de Trilhas**
- [ ] Criar `app/admin/paths/page.tsx` (lista)
- [ ] Criar `app/admin/paths/new/page.tsx` (criar)
- [ ] Criar `app/admin/paths/[id]/edit/page.tsx` (editar)
- [ ] Formulário: título, descrição, thumbnail
- [ ] Adicionar cursos à trilha (drag-and-drop)
- [ ] Definir pré-requisitos entre cursos
- [ ] Server Actions: `createPath`, `updatePath`, `deletePath`
- **Estimativa:** 16 horas
- **Prioridade:** P1

**TAREFA-042: Visualização de Trilha**
- [ ] Criar `app/paths/[slug]/page.tsx`
- [ ] Timeline visual da trilha
- [ ] Cursos com status:
  - Completo (verde)
  - Em progresso (amarelo)
  - Bloqueado (cinza) - aguardando pré-requisito
  - Disponível (azul)
- [ ] Progresso geral da trilha (%)
- [ ] Próximo curso disponível destacado
- **Estimativa:** 14 horas
- **Prioridade:** P1

**TAREFA-043: Atribuição de Trilhas**
- [ ] Atribuir trilha a usuário/organização
- [ ] Auto-enroll em primeiro curso
- [ ] Desbloquear cursos conforme pré-requisitos são completados
- [ ] Server Action `assignPathToUser`
- **Estimativa:** 10 horas
- **Prioridade:** P1

**TAREFA-044: Certificação de Trilha**
- [ ] Verificar conclusão de todos os cursos
- [ ] Gerar certificado especial da trilha
- [ ] Badge/conquista desbloqueada
- [ ] Notificação de conclusão
- **Estimativa:** 8 horas
- **Prioridade:** P1

**TAREFA-045: Progresso em Trilhas**
- [ ] Calcular progresso geral
- [ ] Exibir no dashboard
- [ ] Recomendações baseadas em trilhas
- [ ] Histórico de trilhas completadas
- **Estimativa:** 8 horas
- **Prioridade:** P1

**Total Sprint 2.3:** ~56 horas (1.4 semanas)

---

### Sprint 2.4: Templates de Certificado (1 semana)

#### Tarefas

**TAREFA-046: CRUD de Templates**
- [ ] Criar `app/admin/settings/certificates/page.tsx`
- [ ] Lista de templates
- [ ] Criar novo template
- [ ] Editar template existente
- [ ] Deletar template
- [ ] Marcar como padrão
- **Estimativa:** 12 horas
- **Prioridade:** P1

**TAREFA-047: Editor Visual de Templates**
- [ ] Componente de editor (ex: react-dnd ou similar)
- [ ] Adicionar elementos:
  - Texto (com campos dinâmicos)
  - Imagem/logo
  - Linhas/bordas
  - Assinatura
- [ ] Configurar cores, fontes, tamanhos
- [ ] Preview em tempo real
- [ ] Salvar template (HTML/CSS ou JSON)
- **Estimativa:** 20 horas
- **Prioridade:** P1

**TAREFA-048: Aplicação de Templates**
- [ ] Modificar geração de PDF para usar template
- [ ] Substituir campos dinâmicos:
  - {{user_name}}
  - {{course_name}}
  - {{completion_date}}
  - {{verification_code}}
- [ ] Aplicar branding da organização
- **Estimativa:** 10 horas
- **Prioridade:** P1

**TAREFA-049: Templates por Organização**
- [ ] Organizações podem ter templates próprios
- [ ] Template padrão da plataforma
- [ ] Seleção de template ao atribuir curso
- **Estimativa:** 6 horas
- **Prioridade:** P1

**Total Sprint 2.4:** ~48 horas (1.2 semanas)

---

### Sprint 2.5: Analytics e Relatórios (1.5 semanas)

#### Tarefas

**TAREFA-050: Dashboard de Analytics**
- [ ] Criar `app/admin/reports/page.tsx` completo
- [ ] Instalar biblioteca de gráficos (Recharts)
- [ ] Gráficos principais:
  - Taxa de conclusão ao longo do tempo
  - Distribuição de cursos por área
  - Engajamento de usuários
  - Utilização de licenças
- [ ] Filtros: período, organização
- **Estimativa:** 16 horas
- **Prioridade:** P1

**TAREFA-051: Relatórios de Cursos**
- [ ] Criar `app/admin/reports/courses/page.tsx`
- [ ] Métricas por curso:
  - Taxa de conclusão
  - Tempo médio de conclusão
  - Taxa de abandono
  - Pontos de abandono (em qual aula)
- [ ] Gráficos e tabelas
- [ ] Exportar para PDF/CSV
- **Estimativa:** 14 horas
- **Prioridade:** P1

**TAREFA-052: Relatórios de Usuários**
- [ ] Criar `app/admin/reports/users/page.tsx`
- [ ] Métricas por usuário:
  - Cursos completados
  - Tempo total de estudo
  - Taxa de aprovação em quizzes
  - Engajamento (dias ativos)
- [ ] Rankings
- [ ] Identificar usuários inativos
- **Estimativa:** 12 horas
- **Prioridade:** P1

**TAREFA-053: Relatórios de Organizações**
- [ ] Criar `app/admin/reports/organizations/page.tsx`
- [ ] Métricas por organização:
  - Utilização de licenças
  - Taxa de conclusão
  - ROI (se aplicável)
  - Comparação entre organizações
- [ ] Gráficos comparativos
- **Estimativa:** 12 horas
- **Prioridade:** P1

**TAREFA-054: Relatórios Customizáveis**
- [ ] Interface para criar relatórios customizados
- [ ] Selecionar métricas
- [ ] Selecionar filtros
- [ ] Agendar envio automático
- [ ] Salvar relatórios favoritos
- **Estimativa:** 16 horas
- **Prioridade:** P2

**TAREFA-055: Exportação de Relatórios**
- [ ] Exportar para PDF (react-pdf)
- [ ] Exportar para CSV
- [ ] Exportar para Excel (xlsx)
- [ ] Email automático de relatórios agendados
- **Estimativa:** 10 horas
- **Prioridade:** P1

**Total Sprint 2.5:** ~80 horas (2 semanas)

---

### Sprint 2.6: Busca e Filtros Avançados (1 semana)

#### Tarefas

**TAREFA-056: Busca Global Melhorada**
- [ ] Busca em múltiplas entidades (cursos, usuários, organizações)
- [ ] Autocomplete inteligente
- [ ] Busca por tags/categorias
- [ ] Histórico de buscas
- [ ] Sugestões baseadas em histórico
- **Estimativa:** 12 horas
- **Prioridade:** P1

**TAREFA-057: Filtros Avançados**
- [ ] Componente reutilizável de filtros
- [ ] Filtros múltiplos combinados
- [ ] Filtros por data/período
- [ ] Filtros por tags
- [ ] Filtros salvos
- **Estimativa:** 10 horas
- **Prioridade:** P1

**TAREFA-058: Busca com Filtros**
- [ ] Combinar busca textual com filtros
- [ ] Resultados ordenados por relevância
- [ ] Paginação de resultados
- [ ] Contador de resultados
- **Estimativa:** 8 horas
- **Prioridade:** P1

**Total Sprint 2.6:** ~30 horas (0.75 semanas)

---

## 📅 FASE 3: Integrações e Polimento (4-6 semanas)

### Objetivo
Integrar com serviços externos e polir a experiência do usuário.

---

### Sprint 3.1: Integração Stripe (1.5 semanas)

#### Tarefas

**TAREFA-059: Setup Stripe**
- [ ] Instalar SDK do Stripe
- [ ] Configurar variáveis de ambiente
- [ ] Criar produtos no Stripe (cursos)
- [ ] Configurar webhooks
- **Estimativa:** 6 horas
- **Prioridade:** P1

**TAREFA-060: Checkout de Licenças**
- [ ] Criar `app/admin/licenses/purchase/page.tsx`
- [ ] Selecionar curso
- [ ] Selecionar número de licenças
- [ ] Calcular preço
- [ ] Integrar Stripe Checkout
- [ ] Processar pagamento
- **Estimativa:** 12 horas
- **Prioridade:** P1

**TAREFA-061: Webhooks do Stripe**
- [ ] Criar `app/api/stripe/webhook/route.ts`
- [ ] Processar eventos:
  - payment_intent.succeeded
  - checkout.session.completed
  - customer.subscription.created/updated/deleted
- [ ] Atualizar licenças automaticamente
- [ ] Enviar confirmação por email
- **Estimativa:** 10 horas
- **Prioridade:** P1

**TAREFA-062: Assinaturas Recorrentes**
- [ ] Criar planos de assinatura
- [ ] Gerenciar assinaturas
- [ ] Renovação automática
- [ ] Cancelamento
- [ ] Histórico de pagamentos
- **Estimativa:** 14 horas
- **Prioridade:** P2

**Total Sprint 3.1:** ~42 horas (1.05 semanas)

---

### Sprint 3.2: APIs e Webhooks (1 semana)

#### Tarefas

**TAREFA-063: API REST Básica**
- [ ] Criar estrutura de API routes (`app/api/`)
- [ ] Autenticação via API key
- [ ] Rate limiting
- [ ] Documentação básica (Swagger/OpenAPI)
- **Estimativa:** 12 horas
- **Prioridade:** P2

**TAREFA-064: Endpoints Principais**
- [ ] GET /api/courses
- [ ] GET /api/courses/[id]
- [ ] GET /api/users/[id]/progress
- [ ] POST /api/certificates/verify
- [ ] GET /api/organizations/[id]/stats
- **Estimativa:** 16 horas
- **Prioridade:** P2

**TAREFA-065: Sistema de Webhooks**
- [ ] Criar tabela `webhooks` (URLs, eventos, secretos)
- [ ] Interface para configurar webhooks
- [ ] Disparar webhooks em eventos:
  - curso_completado
  - certificado_emitido
  - usuario_criado
  - licenca_expirada
- [ ] Retry logic para falhas
- **Estimativa:** 14 horas
- **Prioridade:** P2

**TAREFA-066: Documentação da API**
- [ ] Criar `/api-docs` ou usar Swagger UI
- [ ] Documentar todos os endpoints
- [ ] Exemplos de requisições/respostas
- [ ] Guia de autenticação
- **Estimativa:** 8 horas
- **Prioridade:** P2

**Total Sprint 3.2:** ~50 horas (1.25 semanas)

---

### Sprint 3.3: Gamificação (1 semana)

#### Tarefas

**TAREFA-067: Sistema de Badges**
- [ ] Criar tabela `badges`
- [ ] Definir badges padrão:
  - Primeiro curso
  - Estudante dedicado (7 dias seguidos)
  - Perfeccionista (100% em quiz)
  - Especialista (trilha completa)
- [ ] Lógica de desbloqueio
- [ ] Interface para ver badges
- **Estimativa:** 12 horas
- **Prioridade:** P2

**TAREFA-068: Sistema de Pontos**
- [ ] Adicionar campo `points` em `users`
- [ ] Atribuir pontos em eventos:
  - Completar curso: +100
  - Completar quiz: +50
  - Estudo diário: +10
- [ ] Calcular níveis baseados em pontos
- [ ] Exibir pontos e nível no perfil
- **Estimativa:** 10 horas
- **Prioridade:** P2

**TAREFA-069: Rankings**
- [ ] Criar `app/leaderboard/page.tsx`
- [ ] Rankings:
  - Por organização
  - Por departamento
  - Global (opcional)
- [ ] Métricas: pontos, cursos completados, tempo
- [ ] Atualização em tempo real
- **Estimativa:** 12 horas
- **Prioridade:** P2

**Total Sprint 3.3:** ~34 horas (0.85 semanas)

---

### Sprint 3.4: Melhorias de UX/UI (1 semana)

#### Tarefas

**TAREFA-070: Responsividade Mobile**
- [ ] Testar e ajustar todas as páginas em mobile
- [ ] Menu hamburger otimizado
- [ ] Touch gestures
- [ ] Player mobile-friendly
- **Estimativa:** 12 horas
- **Prioridade:** P1

**TAREFA-071: Acessibilidade**
- [ ] Auditoria de acessibilidade (WCAG 2.1 AA)
- [ ] Navegação por teclado
- [ ] Screen reader friendly
- [ ] Contraste adequado
- [ ] ARIA labels
- **Estimativa:** 10 horas
- **Prioridade:** P1

**TAREFA-072: Performance**
- [ ] Otimização de imagens (next/image)
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Cache estratégico
- [ ] Lighthouse score > 90
- **Estimativa:** 12 horas
- **Prioridade:** P1

**TAREFA-073: PWA (Progressive Web App)**
- [ ] Manifest.json
- [ ] Service worker
- [ ] Offline support básico
- [ ] Install prompt
- **Estimativa:** 10 horas
- **Prioridade:** P2

**Total Sprint 3.4:** ~44 horas (1.1 semanas)

---

## 📅 FASE 4: Escala e Otimização (2 semanas)

### Objetivo
Garantir que o sistema está pronto para produção em escala.

---

### Sprint 4.1: Testes Completos (1 semana)

#### Tarefas

**TAREFA-074: Testes Unitários**
- [ ] Testes de Server Actions
- [ ] Testes de utilitários
- [ ] Testes de componentes isolados
- [ ] Coverage > 70%
- **Estimativa:** 20 horas
- **Prioridade:** P1

**TAREFA-075: Testes de Integração**
- [ ] Testes de fluxos completos:
  - Autenticação
  - Criação de curso
  - Inscrição em curso
  - Progresso
  - Certificado
- **Estimativa:** 16 horas
- **Prioridade:** P1

**TAREFA-076: Testes E2E**
- [ ] Setup Playwright ou Cypress
- [ ] Testes críticos:
  - Login → Dashboard → Curso → Certificado
  - Admin: Criar curso → Atribuir → Ver progresso
- [ ] CI/CD com testes automáticos
- **Estimativa:** 14 horas
- **Prioridade:** P1

**TAREFA-077: Testes de Performance**
- [ ] Testes de carga (k6 ou similar)
- [ ] Identificar gargalos
- [ ] Otimizar queries lentas
- [ ] Monitoramento de performance
- **Estimativa:** 10 horas
- **Prioridade:** P1

**Total Sprint 4.1:** ~60 horas (1.5 semanas)

---

### Sprint 4.2: Documentação e Deploy (0.5 semanas)

#### Tarefas

**TAREFA-078: Documentação Técnica**
- [ ] README completo
- [ ] Guia de desenvolvimento
- [ ] Arquitetura documentada
- [ ] Diagramas (arquitetura, fluxos)
- **Estimativa:** 8 horas
- **Prioridade:** P1

**TAREFA-079: Documentação de Usuário**
- [ ] Guia do estudante
- [ ] Guia do admin
- [ ] FAQ
- [ ] Tutoriais em vídeo (opcional)
- **Estimativa:** 8 horas
- **Prioridade:** P2

**TAREFA-080: Deploy e Configuração**
- [ ] Configurar variáveis de ambiente em produção
- [ ] Configurar domínio
- [ ] SSL/HTTPS
- [ ] Monitoramento (Sentry, LogRocket)
- [ ] Backup automático do banco
- **Estimativa:** 6 horas
- **Prioridade:** P0

**Total Sprint 4.2:** ~22 horas (0.55 semanas)

---

## 📊 Resumo do Plano

### Totais por Fase

| Fase | Duração | Horas | Prioridade |
|------|---------|-------|------------|
| **Fase 1: MVP Completo** | 4-6 semanas | ~250h | P0 |
| **Fase 2: Features Avançadas** | 6-8 semanas | ~360h | P1 |
| **Fase 3: Integrações** | 4-6 semanas | ~170h | P1/P2 |
| **Fase 4: Escala** | 2 semanas | ~82h | P1 |
| **TOTAL** | **16-22 semanas** | **~862h** | - |

### Distribuição por Tipo de Trabalho

- **Backend/Server Actions:** ~300h (35%)
- **Frontend/UI:** ~280h (32%)
- **Integrações:** ~100h (12%)
- **Testes:** ~60h (7%)
- **Documentação:** ~50h (6%)
- **DevOps/Deploy:** ~30h (3%)
- **Outros:** ~42h (5%)

---

## 🎯 Priorização e Sequenciamento

### Ordem Recomendada de Implementação

1. **Sprint 1.1-1.2** (CRUD Cursos + Player) - **CRÍTICO**
2. **Sprint 1.3** (Certificados Básicos) - **CRÍTICO**
3. **Sprint 1.4** (Quizzes Básicos) - **CRÍTICO**
4. **Sprint 2.1** (Cursos x Tenant) - **ALTA PRIORIDADE**
5. **Sprint 2.2** (Notificações) - **ALTA PRIORIDADE**
6. **Sprint 2.3** (Trilhas) - **MÉDIA PRIORIDADE**
7. **Sprint 2.4** (Templates) - **MÉDIA PRIORIDADE**
8. **Sprint 2.5** (Analytics) - **ALTA PRIORIDADE**
9. **Sprint 3.1** (Stripe) - **MÉDIA PRIORIDADE**
10. **Sprint 3.2-3.4** (APIs, Gamificação, UX) - **BAIXA PRIORIDADE**
11. **Sprint 4.1-4.2** (Testes, Deploy) - **CRÍTICO**

---

## 📋 Checklist de Dependências

### Antes de Começar

- [ ] Ambiente de desenvolvimento configurado
- [ ] Supabase configurado e migrações aplicadas
- [ ] Variáveis de ambiente configuradas
- [ ] Repositório Git configurado
- [ ] Equipe alinhada com o plano

### Dependências Técnicas

- [ ] Biblioteca de player de vídeo escolhida
- [ ] Biblioteca de PDF escolhida
- [ ] Biblioteca de gráficos escolhida
- [ ] Serviço de email configurado (Resend)
- [ ] Stripe account criado (se aplicável)
- [ ] Storage buckets configurados no Supabase

---

## 🚨 Riscos e Mitigações

### Riscos Identificados

1. **Complexidade de Personalização**
   - **Risco:** Alto
   - **Mitigação:** Começar com personalização simples, iterar

2. **Performance com Muitos Dados**
   - **Risco:** Médio
   - **Mitigação:** Paginação, índices, cache

3. **Integração Stripe**
   - **Risco:** Médio
   - **Mitigação:** Testar extensivamente em sandbox

4. **Tempo de Desenvolvimento**
   - **Risco:** Alto
   - **Mitigação:** Priorizar features críticas, iterar

---

## 📈 Métricas de Sucesso

### KPIs Técnicos

- [ ] Lighthouse score > 90
- [ ] Tempo de resposta < 200ms (p95)
- [ ] Coverage de testes > 70%
- [ ] Uptime > 99.9%

### KPIs de Funcionalidades

- [ ] 100% das features MVP implementadas
- [ ] 80% das features avançadas implementadas
- [ ] 0 bugs críticos em produção
- [ ] Documentação completa

---

## 🔄 Processo de Desenvolvimento

### Metodologia

- **Sprints:** 1-2 semanas
- **Daily Standups:** Diário (15 min)
- **Code Reviews:** Obrigatório antes de merge
- **Deploy:** Contínuo (após cada sprint)

### Ferramentas

- **Gestão:** GitHub Projects ou Jira
- **CI/CD:** GitHub Actions
- **Monitoramento:** Sentry, Vercel Analytics
- **Comunicação:** Slack/Discord

---

## 📝 Notas Finais

- Este plano é um guia e pode ser ajustado conforme necessário
- Priorize features baseadas em feedback de usuários
- Mantenha documentação atualizada
- Faça deploy frequente para validar com usuários reais
- Reserve tempo para refatoração e melhorias

---

**Documento criado em:** 2024-11-25
**Versão:** 1.0
**Próxima revisão:** Após Sprint 1.1


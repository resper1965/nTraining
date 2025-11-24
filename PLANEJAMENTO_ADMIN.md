# Planejamento: Dashboard Administrativo Completo

## 📋 Visão Geral

Sistema administrativo completo para gestão da plataforma n.training, incluindo:
- Dashboard com métricas e visão geral
- Gestão de organizações (tenants)
- Gestão de cursos e conteúdo
- Gestão de usuários
- Gestão de licenças e acesso a cursos
- Relatórios e analytics
- Configurações da plataforma

---

## 🎯 Objetivos

1. **Centralizar todas as operações administrativas** em um ambiente único e intuitivo
2. **Facilitar gestão multi-tenant** com controle granular de permissões
3. **Fornecer visão completa** do estado da plataforma através de métricas e dashboards
4. **Automatizar processos** de atribuição e gestão de cursos
5. **Garantir segurança** através de controle de acesso baseado em roles

---

## 🏗️ Arquitetura e Estrutura

### Layout Administrativo

```
app/admin/
├── layout.tsx                    # Layout principal com sidebar e header
├── page.tsx                      # Dashboard principal (overview)
│
├── organizations/                # Gestão de Organizações (Tenants)
│   ├── page.tsx                  # Lista de organizações
│   ├── new/page.tsx              # Criar nova organização
│   ├── [id]/
│   │   ├── page.tsx              # Detalhes da organização
│   │   ├── edit/page.tsx         # Editar organização
│   │   ├── users/page.tsx        # Usuários da organização
│   │   ├── courses/page.tsx      # Cursos disponíveis para a organização
│   │   └── analytics/page.tsx    # Analytics da organização
│
├── courses/                      # Gestão de Cursos
│   ├── page.tsx                  # Lista de cursos
│   ├── new/page.tsx              # Criar novo curso
│   ├── [id]/
│   │   ├── page.tsx              # Detalhes do curso
│   │   ├── edit/page.tsx         # Editar curso
│   │   ├── modules/page.tsx       # Gerenciar módulos
│   │   ├── assignments/page.tsx  # Ver atribuições do curso
│   │   └── analytics/page.tsx    # Analytics do curso
│
├── users/                        # Gestão de Usuários
│   ├── page.tsx                  # Lista de usuários
│   ├── new/page.tsx              # Criar novo usuário
│   ├── [id]/
│   │   ├── page.tsx              # Detalhes do usuário
│   │   ├── edit/page.tsx         # Editar usuário
│   │   ├── courses/page.tsx       # Cursos do usuário
│   │   └── progress/page.tsx     # Progresso do usuário
│
├── licenses/                     # Gestão de Licenças
│   ├── page.tsx                  # Visão geral de licenças
│   ├── assignments/page.tsx      # Atribuições de cursos
│   └── [organizationId]/
│       └── page.tsx              # Licenças de uma organização
│
├── reports/                      # Relatórios e Analytics
│   ├── page.tsx                  # Dashboard de relatórios
│   ├── courses/page.tsx          # Relatórios de cursos
│   ├── users/page.tsx            # Relatórios de usuários
│   ├── organizations/page.tsx   # Relatórios de organizações
│   └── certificates/page.tsx     # Relatórios de certificados
│
├── settings/                     # Configurações da Plataforma
│   ├── page.tsx                  # Configurações gerais
│   ├── certificates/page.tsx     # Templates de certificados
│   ├── integrations/page.tsx     # Integrações
│   └── security/page.tsx         # Segurança e permissões
│
└── activity/                     # Log de Atividades
    └── page.tsx                  # Log de ações administrativas
```

---

## 📊 Dashboard Principal (`/admin`)

### Métricas Principais (Cards)

1. **Visão Geral da Plataforma**
   - Total de organizações ativas
   - Total de usuários
   - Total de cursos publicados
   - Total de certificados emitidos

2. **Estatísticas de Uso**
   - Cursos em progresso (total)
   - Cursos completados (últimos 30 dias)
   - Taxa de conclusão média
   - Usuários ativos (últimos 7 dias)

3. **Licenças e Acesso**
   - Licenças utilizadas vs disponíveis
   - Organizações próximas do limite
   - Cursos mais populares
   - Taxa de renovação de licenças

4. **Alertas e Notificações**
   - Licenças expirando em breve
   - Cursos obrigatórios não iniciados
   - Usuários inativos há muito tempo
   - Problemas técnicos recentes

### Gráficos e Visualizações

1. **Gráfico de Linha**: Crescimento de usuários ao longo do tempo
2. **Gráfico de Pizza**: Distribuição de cursos por área/categoria
3. **Gráfico de Barras**: Top 10 cursos mais acessados
4. **Gráfico de Área**: Taxa de conclusão por mês
5. **Mapa de Calor**: Atividade por dia da semana/hora

### Tabelas Rápidas

1. **Últimas Atividades**: Log de ações recentes
2. **Organizações Recentes**: Últimas organizações criadas
3. **Cursos Recentes**: Últimos cursos publicados
4. **Usuários Recentes**: Últimos usuários cadastrados

---

## 🏢 Gestão de Organizações (`/admin/organizations`)

### Lista de Organizações

**Filtros:**
- Status (ativa, inativa, suspensa)
- Plano/subscription
- Data de criação
- Número de usuários
- Busca por nome/CNPJ

**Colunas da Tabela:**
- Nome/Razão Social
- CNPJ (mascarado)
- Status
- Total de usuários
- Total de cursos disponíveis
- Licenças utilizadas/disponíveis
- Data de criação
- Ações (ver, editar, gerenciar)

**Ações em Massa:**
- Ativar/Desativar múltiplas organizações
- Exportar lista
- Enviar email em massa

### Detalhes da Organização (`/admin/organizations/[id]`)

**Aba: Visão Geral**
- Informações básicas (nome, CNPJ, contato)
- Status e plano
- Estatísticas (usuários, cursos, progresso)
- Gráfico de atividade

**Aba: Usuários**
- Lista de usuários da organização
- Criar novo usuário
- Importar usuários (CSV)
- Atribuir roles
- Ativar/Desativar usuários

**Aba: Cursos**
- Cursos disponíveis para a organização
- Adicionar curso (com configuração de licenças)
- Personalizar curso
- Ver atribuições
- Configurar cursos obrigatórios

**Aba: Licenças**
- Visão geral de licenças
- Adicionar/renovar licenças
- Histórico de licenças
- Alertas de expiração

**Aba: Analytics**
- Métricas específicas da organização
- Gráficos de progresso
- Relatórios customizados

**Aba: Configurações**
- Editar informações básicas
- Configurar auto-enroll
- Configurar certificados
- Integrações (se houver)

---

## 📚 Gestão de Cursos (`/admin/courses`)

### Lista de Cursos

**Filtros:**
- Status (draft, published, archived)
- Área/categoria
- Nível (beginner, intermediate, advanced)
- Tipo (global, organization, customized)
- Busca por título/descrição

**Colunas:**
- Título
- Status
- Área
- Nível
- Duração
- Organizações com acesso
- Total de inscritos
- Taxa de conclusão
- Ações

**Ações em Massa:**
- Publicar/Arquivar múltiplos cursos
- Atribuir a organizações
- Exportar lista

### Detalhes do Curso (`/admin/courses/[id]`)

**Aba: Informações**
- Dados básicos do curso
- Objetivos e descrição
- Thumbnail e mídia
- Configurações de certificado
- Requisitos de conclusão

**Aba: Módulos e Aulas**
- Árvore de módulos e aulas
- Adicionar/editar/remover módulos
- Reordenar conteúdo
- Upload de vídeos/arquivos

**Aba: Atribuições**
- Organizações com acesso
- Usuários específicos atribuídos
- Cursos obrigatórios por organização
- Histórico de atribuições

**Aba: Analytics**
- Estatísticas de acesso
- Taxa de conclusão
- Tempo médio de conclusão
- Feedback e avaliações

**Aba: Personalizações**
- Ver personalizações por organização
- Criar personalização
- Comparar versões

---

## 👥 Gestão de Usuários (`/admin/users`)

### Lista de Usuários

**Filtros:**
- Role (platform_admin, org_manager, student)
- Organização
- Status (ativo, inativo)
- Último acesso
- Busca por nome/email

**Colunas:**
- Nome
- Email
- Role
- Organização
- Status
- Último acesso
- Cursos em progresso
- Ações

**Ações em Massa:**
- Ativar/Desativar múltiplos usuários
- Atribuir role
- Enviar email em massa
- Exportar lista

### Detalhes do Usuário (`/admin/users/[id]`)

**Aba: Perfil**
- Informações básicas
- Foto/avatar
- Role e permissões
- Organização
- Status e última atividade

**Aba: Cursos**
- Cursos atribuídos
- Cursos em progresso
- Cursos completados
- Cursos obrigatórios pendentes
- Atribuir novo curso

**Aba: Progresso**
- Visão geral do progresso
- Gráfico de conclusão
- Certificados obtidos
- Histórico de atividades

**Aba: Atividades**
- Log de ações do usuário
- Histórico de login
- Cursos acessados
- Tempo de estudo

---

## 🎫 Gestão de Licenças (`/admin/licenses`)

### Visão Geral

**Dashboard de Licenças:**
- Total de licenças vendidas
- Licenças utilizadas vs disponíveis
- Taxa de utilização por organização
- Alertas de expiração

**Tabela de Licenças:**
- Organização
- Curso
- Tipo de acesso (licensed, unlimited, trial)
- Total de licenças
- Utilizadas
- Disponíveis
- Expira em
- Status

**Ações:**
- Adicionar licenças
- Renovar licenças
- Alterar tipo de acesso
- Exportar relatório

### Atribuições (`/admin/licenses/assignments`)

- Ver todas as atribuições de cursos
- Filtrar por organização/curso/usuário
- Criar atribuição manual
- Editar atribuição (deadline, obrigatório)
- Remover atribuição

---

## 📈 Relatórios e Analytics (`/admin/reports`)

### Dashboard de Relatórios

**Relatórios Disponíveis:**

1. **Relatório de Cursos**
   - Cursos mais populares
   - Taxa de conclusão por curso
   - Tempo médio de conclusão
   - Taxa de abandono

2. **Relatório de Usuários**
   - Usuários mais engajados
   - Distribuição por organização
   - Taxa de atividade
   - Usuários inativos

3. **Relatório de Organizações**
   - Performance por organização
   - Uso de licenças
   - Taxa de renovação
   - ROI por organização

4. **Relatório de Certificados**
   - Certificados emitidos
   - Taxa de certificação
   - Certificados por curso
   - Validação de certificados

**Funcionalidades:**
- Filtrar por período
- Exportar (PDF, CSV, Excel)
- Agendar relatórios automáticos
- Comparar períodos
- Gráficos interativos

---

## ⚙️ Configurações (`/admin/settings`)

### Configurações Gerais

- Informações da plataforma
- Logo e branding
- Configurações de email
- Configurações de notificações
- Limites e quotas

### Templates de Certificados

- Lista de templates
- Criar/editar template
- Preview do template
- Configurar campos dinâmicos
- Atribuir template padrão

### Integrações

- APIs e webhooks
- Integrações de terceiros
- Configurações de SSO (se aplicável)

### Segurança

- Políticas de senha
- Configurações de sessão
- Logs de segurança
- Auditoria

---

## 🎨 Componentes Reutilizáveis

### Componentes de UI

1. **AdminLayout**
   - Sidebar com navegação
   - Header com breadcrumbs e ações
   - Footer (opcional)

2. **DataTable**
   - Tabela com paginação, filtros, ordenação
   - Ações em massa
   - Exportação

3. **StatsCard**
   - Card de métrica com ícone
   - Comparação com período anterior
   - Link para detalhes

4. **ChartCard**
   - Card com gráfico
   - Filtros de período
   - Exportação

5. **FilterBar**
   - Barra de filtros reutilizável
   - Busca
   - Filtros avançados

6. **BulkActions**
   - Barra de ações em massa
   - Contador de selecionados
   - Menu de ações

7. **Tabs**
   - Navegação por abas
   - Persistência de estado

8. **Modal**
   - Modal reutilizável
   - Formulários inline
   - Confirmações

### Componentes Específicos

1. **OrganizationCard**
   - Card de organização
   - Status e métricas rápidas
   - Ações rápidas

2. **CourseCard**
   - Card de curso
   - Status e estatísticas
   - Ações rápidas

3. **UserCard**
   - Card de usuário
   - Avatar e informações básicas
   - Status e última atividade

4. **LicenseCard**
   - Card de licença
   - Progresso de utilização
   - Alertas

5. **ActivityLog**
   - Lista de atividades
   - Filtros por tipo/data
   - Detalhes expandíveis

---

## 🔐 Permissões e Segurança

### Roles e Permissões

**Superadmin (`is_superadmin = true`):**
- Acesso total ao sistema administrativo
- Pode gerenciar todas as organizações
- Pode criar/editar/deletar qualquer recurso
- Acesso a todas as configurações

**Platform Admin (`role = 'platform_admin'`):**
- Acesso ao dashboard administrativo
- Pode gerenciar cursos globais
- Pode criar/editar usuários
- Acesso limitado a configurações

**Org Manager (`role = 'org_manager'`):**
- Acesso ao dashboard da organização
- Pode gerenciar usuários da organização
- Pode atribuir cursos aos usuários
- Acesso limitado a relatórios da organização

### Proteção de Rotas

- Middleware verifica `is_superadmin` ou `role` apropriado
- Server Actions validam permissões
- RLS policies no banco de dados
- Componentes condicionais baseados em permissões

---

## 📱 Responsividade

- Layout adaptável para desktop, tablet e mobile
- Sidebar colapsável em telas menores
- Tabelas com scroll horizontal quando necessário
- Cards empilhados em mobile
- Menu hamburger para navegação mobile

---

## 🚀 Fases de Implementação

### Fase 1: Estrutura Base (Prioridade Alta)
- [ ] Layout administrativo com sidebar
- [ ] Dashboard principal com métricas básicas
- [ ] Navegação entre páginas
- [ ] Proteção de rotas

### Fase 2: Gestão de Organizações (Prioridade Alta)
- [ ] Lista de organizações
- [ ] Criar/editar organização
- [ ] Detalhes da organização
- [ ] Gestão de usuários da organização

### Fase 3: Gestão de Cursos (Prioridade Alta)
- [ ] Lista de cursos
- [ ] Criar/editar curso
- [ ] Gerenciar módulos e aulas
- [ ] Atribuir cursos a organizações

### Fase 4: Gestão de Usuários (Prioridade Média)
- [ ] Lista de usuários
- [ ] Criar/editar usuário
- [ ] Detalhes do usuário
- [ ] Atribuir cursos a usuários

### Fase 5: Gestão de Licenças (Prioridade Média)
- [ ] Dashboard de licenças
- [ ] Atribuir licenças
- [ ] Renovar licenças
- [ ] Alertas de expiração

### Fase 6: Relatórios (Prioridade Baixa)
- [ ] Dashboard de relatórios
- [ ] Relatórios básicos
- [ ] Exportação de dados
- [ ] Gráficos interativos

### Fase 7: Configurações (Prioridade Baixa)
- [ ] Configurações gerais
- [ ] Templates de certificados
- [ ] Integrações
- [ ] Segurança

---

## 🎯 Métricas de Sucesso

1. **Usabilidade**
   - Tempo médio para completar tarefas administrativas
   - Taxa de erro em ações administrativas
   - Satisfação do usuário (feedback)

2. **Performance**
   - Tempo de carregamento das páginas
   - Tempo de resposta das ações
   - Uso de recursos (CPU, memória)

3. **Adoção**
   - Taxa de uso do dashboard administrativo
   - Frequência de uso por funcionalidade
   - Redução de suporte manual

---

## 📝 Notas Técnicas

### Tecnologias Utilizadas
- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase (banco de dados)
- Recharts ou Chart.js (gráficos)
- React Hook Form (formulários)
- Zod (validação)

### Performance
- Server Components para dados estáticos
- Client Components apenas quando necessário
- Paginação em todas as listas
- Lazy loading de componentes pesados
- Cache de queries frequentes

### Acessibilidade
- Navegação por teclado
- Screen reader friendly
- Contraste adequado
- Labels descritivos
- ARIA attributes

---

## ✅ Checklist de Implementação

- [ ] Estrutura de pastas criada
- [ ] Layout administrativo implementado
- [ ] Dashboard principal com métricas
- [ ] Gestão de organizações completa
- [ ] Gestão de cursos completa
- [ ] Gestão de usuários completa
- [ ] Gestão de licenças completa
- [ ] Relatórios básicos
- [ ] Configurações básicas
- [ ] Testes de permissões
- [ ] Responsividade testada
- [ ] Performance otimizada
- [ ] Documentação atualizada

---

**Próximo Passo:** Revisar este planejamento e aprovar para iniciar a implementação.


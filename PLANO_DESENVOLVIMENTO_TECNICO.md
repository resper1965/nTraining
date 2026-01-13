# 🚀 Plano de Desenvolvimento Técnico - nTraining

**Objetivo:** Completar funcionalidades pendentes da aplicação
**Status Atual:** ~44% completo
**Meta:** 100% funcional para produção
**Prazo Estimado:** 2-3 semanas

---

## 📊 Status Atual

### ✅ Implementado
- ✅ Sistema de autenticação multi-tenant
- ✅ CRUD completo de cursos/módulos/aulas
- ✅ Player de aulas (vídeo, texto, PDF, embed)
- ✅ Sistema de quizzes completo
- ✅ Certificados em PDF (básico)
- ✅ Sistema de notificações (in-app + email)
- ✅ Gestão de licenças por organização
- ✅ Dashboard administrativo com métricas
- ✅ CRUD de trilhas de aprendizado
- ✅ **Visualização de trilhas** (já implementado!)
- ✅ Perfil do usuário
- ✅ Busca de cursos

### ⏳ Pendente (~56%)
- ❌ Página de Relatórios (placeholder vazio)
- ❌ Página de Log de Atividades (placeholder vazio)
- ❌ Melhorias de estabilidade e error handling
- ❌ Validações e mensagens de erro consistentes
- ❌ Testes manuais completos
- ❌ Otimizações de performance

---

## 🎯 SPRINT 1: Relatórios Admin (Semana 1)

### Objetivo
Implementar página de relatórios com métricas essenciais para gestão.

### Tarefa 1.1: Server Actions para Métricas
**Arquivo:** `app/actions/reports.ts` (criar)
**Duração:** 6 horas

```typescript
// Implementar:
- getOverallStats() - Estatísticas gerais
- getCourseCompletionStats() - Taxa de conclusão por curso
- getUserActivityStats() - Usuários ativos vs inativos
- getCoursePopularityStats() - Cursos mais acessados
- getProgressByDepartment() - Progresso por área (opcional)
- getCompletionTrendsByPeriod() - Tendências por período
```

**Métricas necessárias:**
- Total de usuários ativos/inativos
- Total de cursos publicados
- Total de certificados emitidos
- Taxa média de conclusão
- Tempo médio de conclusão
- Cursos mais populares (por inscrições)
- Cursos com melhor taxa de aprovação
- Tendências (últimos 7d, 30d, 90d)

### Tarefa 1.2: Componente de Relatórios
**Arquivo:** `app/admin/reports/page.tsx` (reescrever)
**Duração:** 8 horas

**Estrutura:**
1. **Cabeçalho**
   - Título e descrição
   - Filtros de período (7d, 30d, 90d, ano, customizado)
   - Botão de exportar CSV

2. **Cards de Métricas Principais** (Grid 2x2)
   - Total de Usuários (com % ativos)
   - Total de Cursos Publicados
   - Certificados Emitidos
   - Taxa Média de Conclusão

3. **Gráfico de Conclusões** (opcional, se houver tempo)
   - Usar Recharts
   - Linha do tempo de conclusões
   - Últimos 30 dias

4. **Tabela: Taxa de Conclusão por Curso**
   - Nome do curso
   - Usuários inscritos
   - Usuários que completaram
   - Taxa de conclusão (%)
   - Tempo médio de conclusão
   - Ordenação por coluna

5. **Tabela: Cursos Mais Populares**
   - Nome do curso
   - Total de inscrições
   - Avaliação média (se implementado)

6. **Exportação CSV**
   - Função para exportar dados em CSV
   - Nome arquivo: `relatorio_ntraining_YYYY-MM-DD.csv`

### Tarefa 1.3: Componentes Reutilizáveis
**Arquivos:** `components/admin/stats-card.tsx`, `components/admin/reports-table.tsx`
**Duração:** 4 horas

- `StatsCard`: Card com métrica (número, label, trend)
- `ReportsTable`: Tabela genérica para relatórios
- `ExportButton`: Botão de exportar CSV

**Total Sprint 1:** ~18 horas (3 dias)

---

## 🎯 SPRINT 2: Log de Atividades (Semana 1-2)

### Objetivo
Implementar sistema de log de atividades para auditoria.

### Tarefa 2.1: Melhorar Tabela activity_logs
**Arquivo:** `lib/supabase/migrations/` (verificar/criar)
**Duração:** 2 horas

**Verificar se existe:**
```sql
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  organization_id UUID REFERENCES organizations(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_org ON activity_logs(organization_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at DESC);
```

### Tarefa 2.2: Server Actions para Logs
**Arquivo:** `app/actions/activity-logs.ts` (criar/melhorar)
**Duração:** 4 horas

```typescript
// Implementar:
- getActivityLogs(filters) - Buscar logs com filtros
- createActivityLog(data) - Criar log (já deve existir)
- getActivityTypes() - Listar tipos de atividade
```

**Tipos de atividade a logar:**
- `user.login` - Usuário fez login
- `user.created` - Usuário criado
- `course.created` - Curso criado
- `course.published` - Curso publicado
- `course.completed` - Usuário completou curso
- `quiz.completed` - Usuário completou quiz
- `certificate.issued` - Certificado emitido
- `user.assigned_course` - Curso atribuído a usuário
- `path.completed` - Trilha completada

### Tarefa 2.3: Página de Atividades
**Arquivo:** `app/admin/activity/page.tsx` (reescrever)
**Duração:** 6 horas

**Estrutura:**
1. **Cabeçalho**
   - Título e descrição
   - Filtros:
     - Por tipo de atividade (dropdown)
     - Por usuário (busca/autocomplete)
     - Por data (range)

2. **Tabela de Atividades**
   - Timestamp (ordenado por mais recente)
   - Usuário (nome + email)
   - Tipo de atividade (badge colorido)
   - Descrição/detalhes
   - Entidade relacionada (link se aplicável)
   - Organização

3. **Paginação**
   - 50 itens por página
   - Navegação anterior/próxima

4. **Auto-refresh** (opcional)
   - Atualizar a cada 30s se estiver na página

### Tarefa 2.4: Adicionar Logging Automático
**Arquivos:** Diversos Server Actions
**Duração:** 4 horas

**Adicionar logs em:**
- `app/actions/courses.ts` - Ao criar/publicar curso
- `app/actions/users.ts` - Ao criar usuário
- `app/actions/certificates.ts` - Ao emitir certificado
- `app/actions/quizzes.ts` - Ao completar quiz
- `app/actions/course-progress.ts` - Ao completar curso/trilha

**Padrão:**
```typescript
await createActivityLog({
  user_id: user.id,
  organization_id: user.organization_id,
  action: 'course.completed',
  entity_type: 'course',
  entity_id: courseId,
  metadata: { course_title: course.title }
})
```

**Total Sprint 2:** ~16 horas (2-3 dias)

---

## 🎯 SPRINT 3: Estabilidade e Error Handling (Semana 2)

### Objetivo
Melhorar robustez, error handling e experiência do usuário.

### Tarefa 3.1: Error Boundaries
**Arquivos:** `components/error-boundary.tsx`, layouts
**Duração:** 4 horas

**Criar:**
- `ErrorBoundary` component genérico
- Aplicar em layouts principais:
  - `app/(main)/layout.tsx`
  - `app/admin/layout.tsx`
- Adicionar em páginas críticas:
  - Player de aulas
  - Formulários de criação

**Features:**
- Capturar erros em runtime
- Exibir UI amigável
- Botão "Tentar Novamente"
- Log de erro (console + sentry se configurado)

### Tarefa 3.2: Validações Consistentes
**Arquivos:** Diversos forms
**Duração:** 6 horas

**Melhorar validações em:**
- `app/admin/courses/new/client-form.tsx`
- `app/admin/courses/[id]/edit/client-form.tsx`
- `app/admin/users/new/page.tsx`
- `components/admin/learning-path-form.tsx`
- `components/profile/edit-profile-form.tsx`

**Implementar:**
- Validação com Zod schemas
- Mensagens de erro claras em português
- Validação em tempo real (on blur)
- Highlights visuais de campos com erro
- Disable submit enquanto inválido

### Tarefa 3.3: Loading States
**Arquivos:** Diversos componentes
**Duração:** 4 horas

**Adicionar loading states em:**
- Formulários (botões com spinner)
- Listas de dados (skeleton loading)
- Dashboards (skeleton cards)
- Player de aulas

**Usar:**
- `loading.tsx` files para páginas
- `Skeleton` components do shadcn/ui
- `isLoading` states em botões

### Tarefa 3.4: Toast Notifications Consistentes
**Arquivos:** Server Actions
**Duração:** 3 horas

**Padronizar:**
- Sucesso: Toast verde com ícone de check
- Erro: Toast vermelho com mensagem clara
- Warning: Toast amarelo
- Info: Toast azul

**Mensagens claras:**
- ✅ "Curso criado com sucesso!"
- ✅ "Usuário atualizado com sucesso!"
- ❌ "Erro ao criar curso. Verifique os dados."
- ❌ "Você não tem permissão para essa ação."

### Tarefa 3.5: Empty States
**Arquivos:** Páginas de listagem
**Duração:** 3 horas

**Melhorar empty states em:**
- `/admin/courses` - Quando não há cursos
- `/admin/users` - Quando não há usuários
- `/admin/tenants` - Quando não há organizações
- `/dashboard` - Quando usuário não tem cursos
- `/certificates` - Quando não tem certificados

**Pattern:**
- Ícone ilustrativo
- Mensagem amigável
- Call-to-action (botão)

**Total Sprint 3:** ~20 horas (3 dias)

---

## 🎯 SPRINT 4: Melhorias de UX e Performance (Semana 2-3)

### Objetivo
Otimizar experiência do usuário e performance.

### Tarefa 4.1: Responsividade Mobile
**Arquivos:** Diversos componentes
**Duração:** 6 horas

**Testar e ajustar:**
- Dashboard (grid responsivo)
- Listagem de cursos (cards empilhados)
- Player de aulas (fullscreen mobile)
- Formulários (inputs full width)
- Tabelas (scroll horizontal ou cards)
- Menu admin (drawer mobile)

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Tarefa 4.2: Otimização de Imagens
**Arquivos:** Componentes com imagens
**Duração:** 3 horas

**Implementar:**
- Usar `next/image` em todos os lugares
- Definir width/height adequados
- Lazy loading automático
- Placeholder blur

**Lugares:**
- Thumbnails de cursos
- Avatares de usuários
- Imagens de aulas
- Logos de organizações

### Tarefa 4.3: Performance de Queries
**Arquivos:** Server Actions
**Duração:** 4 horas

**Otimizar:**
- Adicionar `select()` específicos (evitar `select('*')`)
- Usar índices no banco (já criados)
- Cache de queries frequentes
- Evitar N+1 queries (usar joins)

**Queries críticas:**
- `getCourses()` - Dashboard
- `getUserProgress()` - Dashboard
- `getLearningPaths()` - Trilhas

### Tarefa 4.4: Acessibilidade Básica
**Arquivos:** Componentes
**Duração:** 4 horas

**Implementar:**
- Labels em todos inputs
- ARIA labels em ícones
- Focus visible consistente
- Navegação por teclado (Tab)
- Alt text em imagens
- Contraste adequado (já tem)

**Testar com:**
- Navegação por teclado
- Screen reader (NVDA/VoiceOver)

**Total Sprint 4:** ~17 horas (2-3 dias)

---

## 🎯 SPRINT 5: Testes e Correções (Semana 3)

### Objetivo
Testar aplicação completa e corrigir bugs encontrados.

### Tarefa 5.1: Criar Checklist de Testes
**Arquivo:** `TESTING_CHECKLIST.md` (criar)
**Duração:** 2 horas

**Fluxos a testar:**

**Superadmin:**
- [ ] Login como superadmin
- [ ] Criar organização
- [ ] Criar usuário (student, org_manager)
- [ ] Criar curso completo (com módulos, aulas, quiz)
- [ ] Publicar curso
- [ ] Atribuir curso a organização
- [ ] Ver relatórios
- [ ] Ver log de atividades
- [ ] Criar trilha de aprendizado
- [ ] Atribuir trilha a organização

**Student:**
- [ ] Login como estudante
- [ ] Ver dashboard (cursos disponíveis)
- [ ] Acessar curso
- [ ] Assistir aula (vídeo, texto, PDF)
- [ ] Marcar aula como concluída
- [ ] Fazer quiz
- [ ] Passar no quiz
- [ ] Ver certificado
- [ ] Download certificado
- [ ] Ver trilha de aprendizado
- [ ] Navegar entre cursos da trilha
- [ ] Completar trilha
- [ ] Editar perfil
- [ ] Ver notificações
- [ ] Buscar cursos

**Org Manager:**
- [ ] Ver usuários da organização
- [ ] Ver progresso de usuários
- [ ] Ver cursos disponíveis

### Tarefa 5.2: Testes Manuais - Happy Path
**Duração:** 8 horas

**Executar checklist completo em:**
- Chrome Desktop
- Firefox Desktop
- Safari Desktop
- Chrome Mobile (Android)
- Safari Mobile (iOS)

**Documentar:**
- Bugs encontrados (criar lista)
- Screenshots de problemas
- Passos para reproduzir

### Tarefa 5.3: Correção de Bugs Críticos (P0)
**Duração:** 12 horas

**Priorizar bugs que:**
- Impedem uso da aplicação
- Causam perda de dados
- Quebram fluxos principais
- Erros 500

**Correções:**
- Criar issues no repositório (ou documento)
- Implementar correções
- Re-testar

### Tarefa 5.4: Correção de Bugs Importantes (P1)
**Duração:** 8 horas

**Bugs não críticos mas importantes:**
- Problemas de UX
- Erros de validação
- Mensagens confusas
- Layout quebrado

### Tarefa 5.5: Smoke Tests em Produção
**Duração:** 2 horas

**Antes do deploy final:**
- [ ] Build passa sem erros
- [ ] Variáveis de ambiente configuradas
- [ ] Login funciona
- [ ] Criar curso funciona
- [ ] Player funciona
- [ ] Certificado funciona
- [ ] Email funciona (Resend)
- [ ] Upload funciona (Supabase Storage)

**Total Sprint 5:** ~32 horas (4 dias)

---

## 📊 Resumo Executivo

| Sprint | Foco | Duração | Horas |
|--------|------|---------|-------|
| Sprint 1 | Relatórios Admin | 3 dias | 18h |
| Sprint 2 | Log de Atividades | 2-3 dias | 16h |
| Sprint 3 | Estabilidade & Errors | 3 dias | 20h |
| Sprint 4 | UX & Performance | 2-3 dias | 17h |
| Sprint 5 | Testes & Bugs | 4 dias | 32h |
| **TOTAL** | **Aplicação Completa** | **14-16 dias** | **103h** |

**Estimativa: 2-3 semanas de desenvolvimento**

---

## 🚀 Próximos Passos Imediatos

### Esta Semana (Dias 1-5)
1. ✅ Plano criado
2. ⏳ **SPRINT 1: Começar Relatórios**
   - Criar `app/actions/reports.ts`
   - Implementar métricas principais
   - Reescrever `app/admin/reports/page.tsx`

### Semana 2 (Dias 6-10)
1. ⏳ Finalizar Relatórios (se necessário)
2. ⏳ **SPRINT 2: Log de Atividades**
3. ⏳ **SPRINT 3: Estabilidade**
   - Error boundaries
   - Validações
   - Loading states

### Semana 3 (Dias 11-16)
1. ⏳ **SPRINT 4: UX & Performance**
2. ⏳ **SPRINT 5: Testes Completos**
3. ⏳ Correção de bugs
4. ⏳ Deploy para produção

---

## 📋 Ordem de Implementação Recomendada

### Alta Prioridade (Fazer Primeiro)
1. **Relatórios** - Essencial para ness monitorar compliance
2. **Log de Atividades** - Auditoria e compliance
3. **Error Handling** - Prevenir bugs em produção
4. **Validações** - Prevenir dados inválidos

### Média Prioridade (Depois)
5. **Loading States** - Melhorar UX
6. **Empty States** - Melhorar UX
7. **Toast Notifications** - Consistência
8. **Responsividade** - Acesso mobile

### Baixa Prioridade (Se houver tempo)
9. **Performance** - Já está razoável
10. **Acessibilidade** - Nice to have
11. **Gráficos** - Visual (pode ser depois)

---

## 🛠️ Ferramentas e Libs Necessárias

### Já Instaladas ✅
- Next.js 14
- Supabase
- Tailwind CSS
- shadcn/ui
- Zod
- date-fns

### A Instalar (Se Necessário) 📦
```bash
# Para gráficos (opcional)
npm install recharts

# Para exportação CSV
npm install papaparse
npm install @types/papaparse --save-dev
```

---

## ✅ Critérios de Conclusão

A aplicação estará **100% pronta** quando:

- [ ] Página de Relatórios funcional com métricas principais
- [ ] Página de Log de Atividades funcional com filtros
- [ ] Error boundaries em todas as páginas críticas
- [ ] Validações consistentes em todos os forms
- [ ] Loading states em todas as operações assíncronas
- [ ] Toast notifications padronizadas
- [ ] Empty states em todas as listagens
- [ ] Responsividade em mobile testada
- [ ] Todos os fluxos críticos testados
- [ ] Zero bugs P0 (críticos)
- [ ] Bugs P1 corrigidos ou documentados
- [ ] Build de produção passando
- [ ] Smoke tests em produção OK

---

## 🎯 Entregáveis Finais

### Código
- ✅ Todas as funcionalidades implementadas
- ✅ Código revisado e limpo
- ✅ Commits organizados
- ✅ Branch atualizado

### Documentação
- ✅ README atualizado
- ✅ TESTING_CHECKLIST.md criado
- ✅ Runbook de operações
- ✅ Changelog de features

### Testes
- ✅ Checklist de testes preenchido
- ✅ Lista de bugs conhecidos (P2/P3)
- ✅ Screenshots de funcionalidades

---

## 📝 Notas de Implementação

### Padrões de Código
- Server Actions para lógica backend
- Server Components sempre que possível
- Client Components apenas quando necessário
- Validação com Zod
- TypeScript strict mode
- Error handling com try/catch

### Estrutura de Arquivos
```
app/
├── actions/
│   ├── reports.ts (CRIAR)
│   ├── activity-logs.ts (MELHORAR)
│   └── ...
├── admin/
│   ├── reports/
│   │   └── page.tsx (REESCREVER)
│   └── activity/
│       └── page.tsx (REESCREVER)
components/
├── admin/
│   ├── stats-card.tsx (CRIAR)
│   ├── reports-table.tsx (CRIAR)
│   └── export-button.tsx (CRIAR)
└── error-boundary.tsx (CRIAR)
```

### Convenções
- Mensagens em português
- Dates com date-fns
- Cores do tema (slate-950, primary)
- Icons do lucide-react
- Consistência UI com shadcn/ui

---

**Documento criado:** 2026-01-13
**Versão:** 1.0
**Owner:** Tech Lead / Developer
**Próxima revisão:** Após Sprint 3

---

## 🚀 Comando para Começar

```bash
# 1. Criar branch de desenvolvimento
git checkout -b feat/complete-admin-features

# 2. Criar arquivo de reports
touch app/actions/reports.ts

# 3. Começar implementação!
```

Vamos começar? 💪

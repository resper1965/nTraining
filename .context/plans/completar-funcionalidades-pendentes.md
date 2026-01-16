---
status: filled
generated: 2026-01-16
updated: 2026-01-16
agents:
  - type: "feature-developer"
    role: "Implementar funcionalidades pendentes de trilhas e relatórios"
  - type: "test-writer"
    role: "Escrever testes para validar funcionalidades"
  - type: "bug-fixer"
    role: "Corrigir bugs encontrados durante testes"
  - type: "documentation-writer"
    role: "Documentar funcionalidades implementadas"
  - type: "performance-optimizer"
    role: "Otimizar performance e adicionar error boundaries"
docs:
  - "STATUS_PROJETO.md"
  - "PLANO_FINALIZACAO_NESS.md"
  - "TESTING_CHECKLIST.md"
phases:
  - id: "phase-1"
    name: "Análise e Planejamento"
    prevc: "P"
  - id: "phase-2"
    name: "Implementação de Funcionalidades"
    prevc: "E"
  - id: "phase-3"
    name: "Testes e Validação"
    prevc: "V"
---

# Completar Funcionalidades Pendentes n.training

> Plano para completar funcionalidades críticas pendentes: trilhas, relatórios, testes e polimento

## Task Snapshot

- **Primary goal:** Completar funcionalidades críticas pendentes do projeto n.training para torná-lo 100% funcional para produção
- **Success signal:** 
  - Todas as funcionalidades P0 implementadas e testadas
  - Build passando sem erros
  - Testes manuais executados e documentados
  - Zero bugs críticos
- **Key references:**
  - [Status do Projeto](../STATUS_PROJETO.md)
  - [Plano de Finalização ness](../PLANO_FINALIZACAO_NESS.md)
  - [Checklist de Testes](../TESTING_CHECKLIST.md)

## Codebase Context

- **Arquitetura:** Next.js 14 (App Router) + TypeScript + Supabase
- **Padrões:** Service Layer + Repository Pattern
- **Status atual:** ~60% completo, funcionalidades core 100% implementadas
- **Melhorias frontend:** 100% concluídas (4 fases)

### Funcionalidades Já Implementadas
- ✅ Autenticação completa (OAuth Google)
- ✅ CRUD completo de Cursos/Módulos/Aulas
- ✅ Player de aulas (vídeo, texto, PDF, embed)
- ✅ Sistema de progresso e certificados
- ✅ Quizzes completos
- ✅ Sistema de notificações (in-app + email)
- ✅ Gestão multi-tenant
- ✅ Dashboard administrativo
- ✅ CRUD de trilhas de aprendizado
- ✅ Visualização básica de trilhas (parcialmente implementada)

### Funcionalidades Pendentes (P0)
- ⏳ Progresso automático em trilhas (cálculo e atualização)
- ⏳ Atribuição de trilhas a organizações
- ⏳ Certificação de trilha completa
- ⏳ Melhorias na página de relatórios (já existe, precisa melhorias)
- ⏳ Log de atividades completo
- ⏳ Error boundaries e tratamento de erros robusto
- ⏳ Testes manuais completos

## Agent Lineup

| Agent | Role in this plan | Playbook | First responsibility focus |
| --- | --- | --- | --- |
| Feature Developer | Implementar funcionalidades pendentes de trilhas e melhorias de relatórios | [Feature Developer](../agents/feature-developer.md) | Completar progresso em trilhas e atribuição |
| Test Writer | Escrever e executar testes manuais completos | [Test Writer](../agents/test-writer.md) | Executar checklist de testes e documentar resultados |
| Bug Fixer | Corrigir bugs encontrados durante implementação e testes | [Bug Fixer](../agents/bug-fixer.md) | Identificar e corrigir issues críticos |
| Documentation Writer | Documentar funcionalidades implementadas | [Documentation Writer](../agents/documentation-writer.md) | Atualizar documentação técnica e de usuário |
| Performance Optimizer | Adicionar error boundaries e melhorar tratamento de erros | [Performance Optimizer](../agents/performance-optimizer.md) | Implementar error boundaries e loading states consistentes |

## Documentation Touchpoints

| Guide | File | Primary Inputs |
| --- | --- | --- |
| Status do Projeto | [STATUS_PROJETO.md](../../STATUS_PROJETO.md) | Atualizar com progresso das funcionalidades |
| Plano de Finalização | [PLANO_FINALIZACAO_NESS.md](../../PLANO_FINALIZACAO_NESS.md) | Referência para tarefas prioritárias |
| Checklist de Testes | [TESTING_CHECKLIST.md](../../TESTING_CHECKLIST.md) | Executar e documentar resultados |

## Risk Assessment

### Identified Risks

| Risk | Probability | Impact | Mitigation Strategy | Owner |
| --- | --- | --- | --- | --- |
| Complexidade do cálculo de progresso em trilhas | Medium | High | Implementar de forma incremental, testar cada etapa | Feature Developer |
| Performance com muitas trilhas/cursos | Low | Medium | Usar batch loading e cache onde apropriado | Performance Optimizer |
| Bugs não detectados em testes | Medium | High | Executar checklist completo, testar em diferentes navegadores | Test Writer |
| Regressões em funcionalidades existentes | Low | High | Testes de regressão após cada mudança | Bug Fixer |

### Dependencies

- **Internal:** 
  - Sistema de progresso de cursos (já implementado)
  - Sistema de certificados (já implementado)
  - Sistema de atribuição de cursos (já implementado)
- **External:** 
  - Supabase (banco de dados e auth)
  - Vercel (deploy)
- **Technical:** 
  - Next.js 14 App Router
  - TypeScript
  - Supabase client/server

### Assumptions

- Schema do banco de dados está estável (tabelas `learning_paths`, `path_courses`, `user_path_assignments` já existem)
- Sistema de progresso de cursos funciona corretamente
- Sistema de certificados funciona corretamente
- Não haverá mudanças significativas no design system durante implementação

## Resource Estimation

### Time Allocation

| Phase | Estimated Effort | Calendar Time | Team Size |
| --- | --- | --- | --- |
| Phase 1 - Análise | 4 horas | 1 dia | 1 pessoa |
| Phase 2 - Implementação | 24 horas | 3-4 dias | 1-2 pessoas |
| Phase 3 - Testes | 16 horas | 2-3 dias | 1 pessoa |
| **Total** | **44 horas** | **6-8 dias** | **1-2 pessoas** |

### Required Skills

- React/Next.js (App Router)
- TypeScript
- Supabase (PostgreSQL, RLS)
- Testes manuais
- Debugging

## Working Phases

### Phase 1 — Análise e Planejamento

**Objetivo:** Analisar estado atual e definir escopo preciso das implementações

**Steps:**
1. **Análise do código existente** (Feature Developer)
   - Revisar `app/(main)/paths/[slug]/page.tsx` - verificar o que já está implementado
   - Revisar `app/actions/path-progress.ts` - verificar funções de progresso
   - Revisar `app/actions/learning-paths.ts` - verificar funções de trilhas
   - Identificar gaps na implementação atual

2. **Definir escopo preciso** (Feature Developer)
   - Listar funcionalidades que realmente faltam (não duplicar o que já existe)
   - Priorizar tarefas por impacto e dependências
   - Estimar esforço para cada tarefa

3. **Planejar implementação** (Feature Developer)
   - Definir ordem de implementação
   - Identificar componentes/arquivos a criar/modificar
   - Documentar decisões de design

**Deliverables:**
- Lista detalhada de funcionalidades a implementar
- Plano de implementação com ordem de tarefas
- Identificação de arquivos a modificar/criar

**Commit Checkpoint:**
```bash
git commit -m "chore(plan): complete phase 1 analysis - define implementation scope"
```

### Phase 2 — Implementação de Funcionalidades

**Objetivo:** Implementar funcionalidades pendentes de forma incremental

**Steps:**

1. **Progresso Automático em Trilhas** (Feature Developer - 8h)
   - Implementar cálculo automático de progresso em `app/actions/path-progress.ts`
   - Atualizar progresso ao completar cursos
   - Desbloquear próximos cursos automaticamente
   - Adicionar trigger para atualizar progresso da trilha
   - Testar com diferentes cenários

2. **Atribuição de Trilhas a Organizações** (Feature Developer - 6h)
   - Criar interface em admin para atribuir trilhas
   - Implementar server action `assignPathToOrganization`
   - Adicionar validações (licenças, permissões)
   - Testar atribuição e acesso

3. **Certificação de Trilha** (Feature Developer - 4h)
   - Implementar lógica para gerar certificado ao completar trilha
   - Reutilizar sistema de certificados existente
   - Adicionar tipo de certificado "trilha"
   - Testar geração de certificado

4. **Melhorias na Página de Relatórios** (Feature Developer - 4h)
   - Adicionar filtros por período (7d, 30d, 90d, ano)
   - Melhorar visualização de dados
   - Adicionar gráficos (opcional, se tempo permitir)
   - Testar performance com muitos dados

5. **Error Boundaries e Tratamento de Erros** (Performance Optimizer - 2h)
   - Adicionar error boundaries em páginas críticas
   - Melhorar mensagens de erro em Server Actions
   - Adicionar loading states consistentes
   - Validar tratamento de edge cases

**Deliverables:**
- Funcionalidades implementadas e testadas
- Código revisado e sem erros de build
- Documentação técnica atualizada

**Commit Checkpoint:**
```bash
git commit -m "feat(paths): implement automatic progress calculation and path assignment"
git commit -m "feat(certificates): add path completion certificates"
git commit -m "feat(reports): improve reports page with filters and better UX"
git commit -m "feat(error-handling): add error boundaries and improve error messages"
```

### Phase 3 — Testes e Validação

**Objetivo:** Garantir qualidade e estabilidade antes de produção

**Steps:**

1. **Testes Funcionais Manuais** (Test Writer - 8h)
   - Executar checklist completo de `TESTING_CHECKLIST.md`
   - Testar fluxo completo de trilhas:
     - Criar trilha
     - Atribuir trilha a organização
     - Usuário acessa trilha
     - Progresso é calculado corretamente
     - Cursos são desbloqueados sequencialmente
     - Certificado é gerado ao completar trilha
   - Testar melhorias de relatórios
   - Testar error boundaries
   - Documentar bugs encontrados

2. **Correção de Bugs** (Bug Fixer - 6h)
   - Priorizar bugs por severidade (P0, P1, P2)
   - Corrigir bugs críticos
   - Re-testar correções
   - Documentar soluções

3. **Testes de Regressão** (Test Writer - 2h)
   - Testar funcionalidades existentes para garantir que não quebraram
   - Verificar build e lint
   - Validar performance básica

**Deliverables:**
- Relatório de testes com resultados
- Lista de bugs corrigidos
- Evidência de que funcionalidades críticas funcionam

**Commit Checkpoint:**
```bash
git commit -m "test: complete manual testing and fix critical bugs"
git commit -m "docs: update project status with completed features"
```

## Rollback Plan

### Rollback Triggers

When to initiate rollback:
- Bugs críticos que impedem uso básico da plataforma
- Performance degradada além do aceitável
- Problemas de segurança detectados
- Perda de dados ou inconsistências no banco

### Rollback Procedures

#### Phase 1 Rollback
- **Action:** Descartar branch de planejamento, manter estado atual
- **Data Impact:** Nenhum (apenas planejamento)
- **Estimated Time:** < 30 minutos

#### Phase 2 Rollback
- **Action:** Reverter commits específicos usando `git revert`
- **Data Impact:** Possível inconsistência temporária em progresso de trilhas (resolver com script de correção se necessário)
- **Estimated Time:** 1-2 horas

#### Phase 3 Rollback
- **Action:** Reverter para versão estável anterior
- **Data Impact:** Nenhum (apenas código)
- **Estimated Time:** 30 minutos - 1 hora

### Post-Rollback Actions

1. Documentar motivo do rollback
2. Analisar causa raiz
3. Atualizar plano com lições aprendidas
4. Planejar nova tentativa com mitigação de riscos

## Evidence & Follow-up

### Artifacts to Collect

- [ ] Commits com implementações
- [ ] Screenshots de funcionalidades implementadas
- [ ] Relatório de testes manuais
- [ ] Lista de bugs corrigidos
- [ ] Métricas de performance (se aplicável)
- [ ] Documentação atualizada

### Follow-up Actions

- [ ] Atualizar `STATUS_PROJETO.md` com progresso
- [ ] Criar PR com todas as mudanças
- [ ] Revisar código antes de merge
- [ ] Fazer deploy em staging para validação final
- [ ] Planejar próximas melhorias (P1)

---

**Documento criado:** 2026-01-16  
**Versão:** 1.0  
**Status:** Pronto para execução

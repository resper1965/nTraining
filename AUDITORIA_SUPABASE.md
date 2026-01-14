# 🔍 Auditoria Completa do Projeto Supabase - n.training

**Data da Auditoria:** 14 de Janeiro de 2025  
**Projeto:** n.training  
**Status Geral:** ⚠️ Requer Atenção

---

## 📊 Resumo Executivo

### Estatísticas Gerais
- **Total de Tabelas:** 52 tabelas
- **Tabelas com RLS Habilitado:** 52 (100%)
- **Tabelas sem Políticas RLS:** 34 (65%) ⚠️ **CRÍTICO**
- **Políticas RLS Ativas:** 18 políticas
- **Funções Customizadas:** 20 funções
- **Extensões Instaladas:** 3 (uuid-ossp, pgcrypto, vector, pg_stat_statements, pg_graphql, supabase_vault)
- **Migrações Aplicadas:** 33 migrações

---

## 🔴 PROBLEMAS CRÍTICOS DE SEGURANÇA

### 1. Tabelas com RLS Habilitado mas SEM Políticas (34 tabelas)

**RISCO:** Todas essas tabelas estão bloqueadas - nenhum usuário pode acessá-las, mesmo autenticado!

#### Tabelas do Sistema n.training (sem políticas):
- `analises_conformidade`
- `ativos`
- `chamadas_ia`
- `descricoes_operacionais_raw`
- `dificuldades_operacionais`
- `indicadores`
- `iniciativas`
- `learning_paths` ⚠️ **IMPORTANTE**
- `lesson_materials`
- `lessons` ⚠️ **IMPORTANTE**
- `modules` ⚠️ **IMPORTANTE**
- `path_courses`
- `permissoes`
- `processo_etapas`
- `processos_normalizados`
- `projetos`
- `question_options`
- `questionarios`
- `questoes`
- `quiz_questions`
- `quizzes` ⚠️ **IMPORTANTE**
- `requisitos_framework`
- `respostas_questao`
- `respostas_questionario`
- `riscos`
- `sites`
- `stakeholders`
- `user_answers`
- `user_lesson_progress` ⚠️ **IMPORTANTE**
- `user_notes`
- `user_path_assignments` ⚠️ **IMPORTANTE**
- `user_quiz_attempts` ⚠️ **IMPORTANTE**
- `usuarios`
- `workarounds`

**AÇÃO NECESSÁRIA:** Criar políticas RLS para todas essas tabelas ou desabilitar RLS se acesso público for intencional.

---

### 2. Políticas RLS Permissivas (Bypass de Segurança)

#### Tabela `clientes`:
- ❌ `Usuários autenticados podem atualizar clientes` - `USING (true)` e `WITH CHECK (true)`
- ❌ `Usuários autenticados podem deletar clientes` - `USING (true)`
- ❌ `Usuários autenticados podem inserir clientes` - `WITH CHECK (true)`

**RISCO:** Qualquer usuário autenticado pode fazer qualquer operação na tabela `clientes`.

#### Tabela `empresas`:
- ❌ `update_empresas` - `USING (true)` e `WITH CHECK (true)`
- ❌ `delete_empresas` - `USING (true)`
- ❌ `insert_empresas` - `WITH CHECK (true)`

**RISCO:** Qualquer usuário autenticado pode fazer qualquer operação na tabela `empresas`.

#### Tabela `users`:
- ⚠️ `Service role can insert users` - `WITH CHECK (true)` - **Aceitável se for apenas para service role**

**AÇÃO NECESSÁRIA:** Restringir essas políticas para verificar permissões adequadas (organização, role, etc).

---

### 3. Funções sem `SET search_path` (Risco de SQL Injection)

**RISCO:** Funções vulneráveis a ataques de search_path manipulation.

#### Funções Afetadas:
- `search_knowledge_base_hybrid`
- `normalize_license_plate`
- `update_updated_at_column`
- `keyword_search`
- `refactor_process`
- `normalize_vehicle_license_plate`
- `match_documents`
- `find_related_processes`
- `log_ticket_changes`
- `process_segurados_batch`
- `submit_process_for_approval`
- `get_organization_by_email`
- `get_next_version_number`
- `search_knowledge_base`
- `check_and_update_process_status`
- `get_segurado_contracts`

**AÇÃO NECESSÁRIA:** Adicionar `SET search_path = public` em todas essas funções.

---

### 4. Autenticação - Configurações de Segurança

#### ⚠️ Proteção de Senha Vazada Desabilitada
- **Status:** Desabilitado
- **Risco:** Usuários podem usar senhas comprometidas
- **Recomendação:** Habilitar verificação contra HaveIBeenPwned.org

#### ⚠️ Opções de MFA Insuficientes
- **Status:** Poucas opções de MFA habilitadas
- **Risco:** Segurança de conta reduzida
- **Recomendação:** Habilitar mais métodos de MFA (TOTP, SMS, etc)

---

## ⚡ PROBLEMAS DE PERFORMANCE

### 1. Foreign Keys sem Índices (5 casos)

**Impacto:** Queries de JOIN podem ser lentas.

#### Tabelas Afetadas:
- `courses.created_by` → `users.id`
- `learning_paths.created_by` → `users.id`
- `user_answers.selected_option_id` → `question_options.id`
- `user_path_assignments.assigned_by` → `users.id`
- `user_path_assignments.organization_id` → `organizations.id`

**AÇÃO NECESSÁRIA:** Criar índices nessas colunas.

---

### 2. Políticas RLS com Re-avaliação por Linha (18 casos)

**Impacto:** `auth.uid()` e `current_setting()` são re-avaliados para cada linha, causando lentidão.

#### Políticas Afetadas:
- `condominiums`: 3 políticas
- `pets`: 3 políticas
- `suppliers`: 3 políticas
- `courses`: 1 política
- `user_course_progress`: 2 políticas
- `activity_logs`: 1 política
- `users`: 2 políticas
- `organizations`: 1 política
- `units`: 3 políticas
- `vehicles`: 3 políticas

**SOLUÇÃO:** Substituir `auth.uid()` por `(select auth.uid())` nas políticas.

**Exemplo:**
```sql
-- ❌ ANTES (lento)
USING (id = auth.uid())

-- ✅ DEPOIS (rápido)
USING (id = (select auth.uid()))
```

---

### 3. Índices Não Utilizados (100+ índices)

**Impacto:** Espaço desperdiçado e lentidão em INSERT/UPDATE.

**OBSERVAÇÃO:** Muitos índices nunca foram usados. Isso pode indicar:
- Tabelas vazias ou pouco utilizadas
- Queries não otimizadas
- Índices criados prematuramente

**AÇÃO RECOMENDADA:** 
- Monitorar uso dos índices por mais tempo antes de remover
- Remover apenas índices claramente desnecessários
- Focar em criar índices para foreign keys sem cobertura

---

## ✅ PONTOS POSITIVOS

### 1. RLS Habilitado em Todas as Tabelas
✅ Todas as 52 tabelas têm RLS habilitado - boa prática de segurança.

### 2. Funções Helper para Evitar Recursão
✅ Funções `get_user_organization_id()` e `is_user_superadmin()` criadas com `SECURITY DEFINER` para evitar recursão infinita.

### 3. Políticas RLS Corrigidas
✅ Políticas de `users` e `organizations` foram corrigidas para evitar recursão.

### 4. Estrutura de Dados Bem Organizada
✅ Foreign keys bem definidas, constraints adequadas, triggers funcionando.

### 5. Extensões Úteis Instaladas
✅ `vector` para busca vetorial, `pg_stat_statements` para monitoramento.

---

## 📋 PLANO DE AÇÃO RECOMENDADO

### Prioridade ALTA (Segurança)

1. **Criar Políticas RLS para Tabelas Críticas do n.training**
   - `learning_paths`, `lessons`, `modules`, `quizzes`
   - `user_lesson_progress`, `user_path_assignments`, `user_quiz_attempts`
   - **Prazo:** Imediato

2. **Corrigir Políticas Permissivas**
   - Restringir acesso em `clientes` e `empresas`
   - Adicionar verificação de organização/role
   - **Prazo:** Imediato

3. **Adicionar `SET search_path` em Funções**
   - Todas as 16 funções listadas
   - **Prazo:** Esta semana

4. **Habilitar Proteção de Senha Vazada**
   - Configurar no painel do Supabase
   - **Prazo:** Esta semana

### Prioridade MÉDIA (Performance)

5. **Criar Índices para Foreign Keys**
   - 5 foreign keys sem índices
   - **Prazo:** Próximas 2 semanas

6. **Otimizar Políticas RLS**
   - Substituir `auth.uid()` por `(select auth.uid())` em 18 políticas
   - **Prazo:** Próximas 2 semanas

### Prioridade BAIXA (Otimização)

7. **Revisar Índices Não Utilizados**
   - Monitorar por mais tempo
   - Remover apenas os claramente desnecessários
   - **Prazo:** Próximo mês

8. **Habilitar Mais Opções de MFA**
   - Configurar TOTP, SMS, etc
   - **Prazo:** Próximo mês

---

## 📝 NOTAS TÉCNICAS

### Funções Helper Criadas (Corrigidas)
- ✅ `get_user_organization_id(user_id UUID)` - SECURITY DEFINER
- ✅ `is_user_superadmin(user_id UUID)` - SECURITY DEFINER

### Políticas RLS Ativas (18 políticas)
- `users`: 3 políticas (SELECT, UPDATE, INSERT)
- `organizations`: 1 política (SELECT)
- `certificates`: 1 política (SELECT público)
- `courses`: 1 política (SELECT)
- `user_course_progress`: 2 políticas (SELECT, UPDATE)
- `activity_logs`: 1 política (SELECT)
- `clientes`: 4 políticas (todas permissivas - precisa corrigir)
- `empresas`: 4 políticas (todas permissivas - precisa corrigir)
- `condominiums`: 4 políticas
- `pets`: 4 políticas
- `suppliers`: 4 políticas
- `units`: 4 políticas
- `vehicles`: 4 políticas

### Triggers Ativos (17 triggers)
- 14 triggers de `update_updated_at_column()`
- 2 triggers de `normalize_vehicle_license_plate()`
- 1 trigger de `handle_new_user()` (provavelmente)

---

## 🔗 Links Úteis

- [Documentação RLS do Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Otimização de Políticas RLS](https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select)
- [Proteção de Senha Vazada](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)
- [MFA no Supabase](https://supabase.com/docs/guides/auth/auth-mfa)

---

**Próximos Passos:** Focar nas correções de segurança (Prioridade ALTA) antes de otimizar performance.

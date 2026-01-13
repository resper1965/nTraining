# 🔍 Query Optimization Opportunities - nTraining

**Data:** 2026-01-13
**Branch:** `claude/analyze-repository-qFNAF`

---

## 📊 Resumo

Análise das queries na aplicação nTraining para identificar oportunidades de otimização além das já implementadas no sistema de relatórios.

---

## ✅ Queries Já Otimizadas

### 1. Reports System (app/actions/reports.ts) ✅
- ✅ `getCourseCompletionStats()` - Batch loading com `.in()`
- ✅ `getCoursePopularityStats()` - Batch loading com `.in()`
- **Resultado:** 92% redução de queries (52 → 4)

### 2. Course Progress (app/actions/course-progress.ts) ✅
- ✅ `getCourseLessonsProgress()` - Batch loading com `.in(lessonIds)`
- ✅ `getCourseCompletionPercentage()` - Batch loading com `.in(lessonIds)`
- **Status:** Já otimizado corretamente!

### 3. Courses with Progress (app/actions/courses.ts) ✅
- ✅ `getCoursesWithProgress()` - Batch loading de progress + access data
- **Status:** Já otimizado corretamente!

### 4. Learning Paths (app/actions/learning-paths.ts) ✅
- ✅ `getLearningPathWithCourses()` - Usa JOIN para buscar cursos relacionados
- **Status:** Já otimizado corretamente!

---

## 🎯 Oportunidades de Otimização

### 1. Selective Field Selection (`select('*')`)

**Problema:** Muitas queries usam `select('*')` que transfere TODOS os campos da tabela, incluindo campos não utilizados.

**Impacto:**
- Bandwidth desperdiçado
- Memória desperdiçada no servidor
- Tempo de serialização aumentado
- Não crítico, mas acumulado em múltiplas queries pode afetar performance

**Arquivos identificados com `select('*')`:**
- `app/actions/certificates.ts`
- `app/actions/course-progress.ts`
- `app/actions/courses.ts`
- `app/actions/learning-paths.ts`
- `app/actions/lessons.ts`
- `app/actions/modules.ts`
- `app/actions/notifications.ts`
- `app/actions/organization-courses.ts`
- `app/actions/organizations.ts`
- `app/actions/path-assignments.ts`
- `app/actions/path-progress.ts`
- `app/actions/progress.ts`
- `app/actions/quiz-attempts.ts`
- `app/admin/users/page.tsx`

---

### Análise de Impacto

#### 🔴 Alto Impacto (Otimizar primeiro)

**app/admin/users/page.tsx** (linha 14-17)
```typescript
// ❌ ANTES: Transfere todos os campos de users
const { data: users } = await supabase
  .from('users')
  .select('*')
  .order('created_at', { ascending: false })

// ✅ DEPOIS: Selecionar apenas campos necessários
const { data: users } = await supabase
  .from('users')
  .select('id, full_name, email, role, is_active, created_at')
  .order('created_at', { ascending: false })
```

**Benefício estimado:**
- Redução de ~40-60% do payload (depende dos campos não usados)
- Campos não necessários como: `avatar_url`, `bio`, `last_sign_in_at`, `email_confirmed_at`, etc.

---

**app/actions/courses.ts - getCourses()** (linha 26)
```typescript
// ❌ ANTES: Superadmin vê todos os campos
let query = supabase
  .from('courses')
  .select('*')
  .order('created_at', { ascending: false})

// ✅ DEPOIS: Especificar campos para listagem
let query = supabase
  .from('courses')
  .select('id, title, slug, description, thumbnail_url, level, area, duration_hours, status, is_public, created_at')
  .order('created_at', { ascending: false })
```

**Benefício estimado:**
- Redução de ~20-30% do payload
- Evita transferir campos como: `objectives` (texto longo), `metadata`, etc.

---

#### 🟡 Médio Impacto

**app/actions/learning-paths.ts - getAllLearningPaths()** (linha 21-24)
```typescript
// Pode especificar apenas campos necessários para listagem
// Campos como description (texto longo) podem não ser necessários na listagem
.select('id, title, slug, estimated_duration_hours, is_mandatory, organization_id, created_at')
```

**app/actions/notifications.ts**
- Verificar quais campos são realmente necessários
- Campos de `metadata` JSON podem ser grandes

---

#### 🟢 Baixo Impacto (Opcional)

**app/actions/certificates.ts**
- Já usa JOIN eficiente
- `select('*')` pode ser aceitável se todos os campos forem necessários

**app/actions/modules.ts, lessons.ts**
- Queries pequenas
- Impacto baixo individualmente

---

### 2. Indexação de Database

**Verificar índices existentes** para queries frequentes:

```sql
-- Verificar índices atuais
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

**Índices críticos que devem existir:**
```sql
-- Courses
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_area ON courses(area);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);

-- User Course Progress
CREATE INDEX IF NOT EXISTS idx_user_course_progress_user_id ON user_course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_course_progress_course_id ON user_course_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_user_course_progress_completion ON user_course_progress(completion_percentage);

-- User Lesson Progress
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user_id ON user_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_lesson_id ON user_lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_completed ON user_lesson_progress(is_completed);

-- Organization Course Access
CREATE INDEX IF NOT EXISTS idx_org_course_access_org_id ON organization_course_access(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_course_access_course_id ON organization_course_access(course_id);

-- Activity Logs
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_event_type ON activity_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
```

**Como verificar se índice existe:**
```sql
SELECT indexname FROM pg_indexes
WHERE tablename = 'courses'
AND indexname = 'idx_courses_status';
```

---

### 3. Query Caching (React Cache)

**Oportunidade:** Cachear queries frequentes que não mudam com frequência.

**Exemplo em app/actions/courses.ts:**
```typescript
import { cache } from 'react'

// ✅ Cachear durante o request (Server Components)
export const getCourses = cache(async (filters?: CourseFilters) => {
  // ... query implementation
})

// Benefício: Múltiplas chamadas no mesmo request retornam resultado cacheado
```

**Queries candidatas:**
- `getCourses()` - Lista de cursos muda pouco
- `getAllLearningPaths()` - Trilhas mudam raramente
- `getLearningPathWithCourses()` - Configuração de trilhas estável

**⚠️ Nota:** React `cache()` apenas cacheia durante o MESMO request. Para cache entre requests, usar Next.js revalidation:

```typescript
export const revalidate = 300 // 5 minutos

export async function getCourses() {
  // ... query
}
```

---

## 📋 Plano de Implementação

### Fase 1: Select Optimization (Alto Impacto) ~2h

1. ✅ **app/admin/users/page.tsx** (30min)
   - Substituir `select('*')` por campos específicos
   - Testar listagem de usuários

2. ✅ **app/actions/courses.ts - getCourses()** (45min)
   - Especificar campos para listagem
   - Manter `select('*')` em `getCourseById()` (precisa de todos os campos)
   - Testar listagem de cursos

3. ✅ **app/actions/learning-paths.ts** (30min)
   - Otimizar `getAllLearningPaths()`
   - Especificar campos necessários

4. ✅ **Testes** (15min)
   - Verificar que todas as páginas ainda funcionam
   - Verificar que nenhum campo necessário foi removido

---

### Fase 2: Indexação Verification (Médio Impacto) ~1h

1. ✅ **Verificar índices existentes** (20min)
   - Conectar ao Supabase
   - Executar query de verificação de índices

2. ✅ **Criar índices faltantes** (30min)
   - Executar CREATE INDEX para índices críticos
   - Verificar performance antes/depois

3. ✅ **Documentar índices** (10min)
   - Atualizar schema.sql se necessário

---

### Fase 3: Caching (Baixo Impacto - Futuro) ~1h

1. ⏳ **Implementar React cache()** (30min)
   - Em queries frequentes
   - Testar múltiplas chamadas

2. ⏳ **Configurar revalidation** (20min)
   - Em páginas específicas
   - Balancear freshness vs performance

3. ⏳ **Testes** (10min)
   - Verificar comportamento de cache

---

## 🎯 Decisão: Priorizar Fase 1

**Recomendação:** Focar na **Fase 1 (Select Optimization)** por ser:
1. **Alto impacto:** Redução imediata de bandwidth e latência
2. **Baixo risco:** Mudança simples e testável
3. **Rápido:** ~2h de implementação

**Fase 2 (Indexação)** requer acesso ao database e pode já estar implementada no schema.sql.

**Fase 3 (Caching)** é otimização marginal e pode ser feita no futuro.

---

## 📊 Resultados Esperados (Fase 1)

### Métricas Antes
- **Admin Users Page:** ~100-200KB payload (50-100 usuários com todos os campos)
- **Courses Listing:** ~150-300KB payload (20-30 cursos com todos os campos)
- **Learning Paths:** ~50-100KB payload

### Métricas Depois
- **Admin Users Page:** ~60-120KB payload (**40% redução**)
- **Courses Listing:** ~105-240KB payload (**30% redução**)
- **Learning Paths:** ~35-75KB payload (**30% redução**)

### Benefícios
- ✅ Menos bandwidth consumido (importante em mobile)
- ✅ Respostas mais rápidas (menos serialização/parsing JSON)
- ✅ Menos memória no servidor Next.js
- ✅ Melhora incremental mas consistente em todas as listagens

---

## ✅ Conclusão

O codebase **já está bem otimizado** nas queries críticas (reports, progress, learning paths). As otimizações adicionais são **incrementais**, focadas em:

1. **Selective field selection** - Maior impacto com menor esforço
2. **Indexação verification** - Provavelmente já está OK
3. **Caching** - Nice-to-have, não crítico

**Recomendação:** Implementar Fase 1 (~2h) e depois avaliar se vale a pena continuar ou priorizar outras partes do Sprint 4 (Responsividade, Acessibilidade).

---

**Documento criado:** 2026-01-13
**Responsável:** Claude Code Agent
**Status:** 📋 Análise completa - Pronto para implementação Fase 1

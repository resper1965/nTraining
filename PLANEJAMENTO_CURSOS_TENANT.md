# 📚 Planejamento: Sistema de Cursos x Tenant (Organização)

## 🎯 Objetivo

Planejar e implementar um sistema completo de gestão de cursos por organização (tenant), incluindo:
- **Estoque de cursos** (licenças/acesso)
- **Cursos obrigatórios** por organização
- **Cursos personalizados** por organização
- **Disponibilização** de cursos para organizações
- **Certificações** por curso/organização

---

## 📊 Modelo Conceitual

### Tipos de Cursos

1. **Cursos Globais (Plataforma)**
   - Criados por superadmins
   - Disponíveis para todas as organizações
   - Podem ser adquiridos/licenciados por organizações

2. **Cursos por Organização**
   - Criados por org_manager ou platform_admin
   - Exclusivos para uma organização específica
   - Podem ser personalizados/modificados pela organização

3. **Cursos Personalizados**
   - Baseados em cursos globais
   - Customizados para uma organização específica
   - Mantém relação com curso original

---

## 🗄️ Estrutura de Dados Proposta

### 1. Tabela: `organization_course_access` (Estoque/Licenças)

```sql
CREATE TABLE organization_course_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  
  -- Tipo de acesso
  access_type VARCHAR(50) NOT NULL DEFAULT 'licensed', -- 'licensed', 'unlimited', 'trial'
  
  -- Licenças/Estoque
  total_licenses INTEGER DEFAULT NULL, -- NULL = ilimitado
  used_licenses INTEGER DEFAULT 0,
  available_licenses INTEGER GENERATED ALWAYS AS (total_licenses - used_licenses) STORED,
  
  -- Validade
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ DEFAULT NULL, -- NULL = sem expiração
  
  -- Configurações
  is_mandatory BOOLEAN DEFAULT false, -- Curso obrigatório para a organização
  auto_enroll BOOLEAN DEFAULT false, -- Auto-inscrever novos usuários
  allow_certificate BOOLEAN DEFAULT true, -- Permitir emissão de certificado
  
  -- Personalização
  custom_title VARCHAR(255), -- Título customizado
  custom_description TEXT, -- Descrição customizada
  custom_thumbnail_url TEXT, -- Thumbnail customizado
  custom_settings JSONB DEFAULT '{}', -- Configurações extras
  
  -- Metadados
  assigned_by UUID REFERENCES users(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(organization_id, course_id)
);

CREATE INDEX idx_org_course_access_org ON organization_course_access(organization_id);
CREATE INDEX idx_org_course_access_course ON organization_course_access(course_id);
CREATE INDEX idx_org_course_access_mandatory ON organization_course_access(organization_id, is_mandatory) WHERE is_mandatory = true;
CREATE INDEX idx_org_course_access_valid ON organization_course_access(valid_until) WHERE valid_until IS NOT NULL;
```

### 2. Tabela: `course_customizations` (Personalizações)

```sql
CREATE TABLE course_customizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  
  -- Personalizações de conteúdo
  custom_modules JSONB, -- Módulos customizados (pode omitir alguns)
  custom_lessons JSONB, -- Aulas customizadas
  custom_branding JSONB DEFAULT '{}', -- Cores, logos, etc.
  
  -- Configurações
  completion_requirements JSONB DEFAULT '{}', -- Requisitos customizados
  certificate_template_id UUID REFERENCES certificate_templates(id),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(organization_id, course_id)
);

CREATE INDEX idx_course_customizations_org ON course_customizations(organization_id);
CREATE INDEX idx_course_customizations_course ON course_customizations(course_id);
```

### 3. Tabela: `organization_course_assignments` (Atribuições)

```sql
CREATE TABLE organization_course_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Tipo de atribuição
  assignment_type VARCHAR(50) NOT NULL DEFAULT 'manual', -- 'manual', 'auto', 'mandatory'
  
  -- Configurações
  is_mandatory BOOLEAN DEFAULT false, -- Obrigatório para este usuário
  deadline TIMESTAMPTZ, -- Prazo para conclusão
  notify_on_deadline BOOLEAN DEFAULT true,
  
  -- Metadados
  assigned_by UUID REFERENCES users(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  UNIQUE(organization_id, course_id, user_id)
);

CREATE INDEX idx_org_course_assignments_org ON organization_course_assignments(organization_id);
CREATE INDEX idx_org_course_assignments_user ON organization_course_assignments(user_id);
CREATE INDEX idx_org_course_assignments_course ON organization_course_assignments(course_id);
CREATE INDEX idx_org_course_assignments_mandatory ON organization_course_assignments(user_id, is_mandatory) WHERE is_mandatory = true;
CREATE INDEX idx_org_course_assignments_deadline ON organization_course_assignments(deadline) WHERE deadline IS NOT NULL;
```

### 4. Atualização: Tabela `courses` (Campos Adicionais)

```sql
-- Adicionar campos à tabela courses existente
ALTER TABLE courses ADD COLUMN IF NOT EXISTS course_type VARCHAR(50) DEFAULT 'global'; 
-- 'global', 'organization', 'customized'

ALTER TABLE courses ADD COLUMN IF NOT EXISTS base_course_id UUID REFERENCES courses(id); 
-- Para cursos personalizados, referência ao curso base

ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_certifiable BOOLEAN DEFAULT true; 
-- Permite emissão de certificado

ALTER TABLE courses ADD COLUMN IF NOT EXISTS min_completion_percentage INTEGER DEFAULT 100; 
-- % mínimo para conclusão (padrão 100%)

ALTER TABLE courses ADD COLUMN IF NOT EXISTS requires_quiz BOOLEAN DEFAULT false; 
-- Requer quiz para conclusão

ALTER TABLE courses ADD COLUMN IF NOT EXISTS min_quiz_score INTEGER DEFAULT 70; 
-- Nota mínima no quiz (se requerido)
```

### 5. Atualização: Tabela `certificates` (Já existe, melhorar)

```sql
-- Verificar se já existe e adicionar campos se necessário
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS certificate_template_id UUID REFERENCES certificate_templates(id);
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS issued_by UUID REFERENCES users(id);
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS verification_code VARCHAR(100) UNIQUE;
```

### 6. Nova Tabela: `certificate_templates` (Templates de Certificado)

```sql
CREATE TABLE certificate_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE, -- NULL = template global
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Design do certificado (JSONB com configurações)
  design_config JSONB NOT NULL DEFAULT '{}', -- Cores, fontes, layout, etc.
  template_html TEXT, -- HTML do template
  template_css TEXT, -- CSS do template
  
  -- Campos dinâmicos
  fields JSONB DEFAULT '[]', -- Campos que podem ser preenchidos
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false, -- Template padrão
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cert_templates_org ON certificate_templates(organization_id);
CREATE INDEX idx_cert_templates_default ON certificate_templates(organization_id, is_default) WHERE is_default = true;
```

---

## 🔄 Fluxos de Funcionamento

### Fluxo 1: Disponibilização de Curso para Organização

```
1. Superadmin/Platform Admin cria curso global
   ↓
2. Curso publicado (status = 'published')
   ↓
3. Admin atribui curso para organização:
   - Define tipo de acesso (licensed/unlimited/trial)
   - Define quantidade de licenças (se licensed)
   - Define validade (se necessário)
   - Marca como obrigatório (se necessário)
   - Configura auto-enroll (se necessário)
   ↓
4. Registro criado em organization_course_access
   ↓
5. Curso disponível para usuários da organização
```

### Fluxo 2: Cursos Obrigatórios

```
1. Admin marca curso como obrigatório em organization_course_access
   (is_mandatory = true)
   ↓
2. Sistema cria atribuições automáticas:
   - Para todos os usuários ativos da organização
   - Ou apenas para novos usuários (se auto_enroll = true)
   ↓
3. Registros criados em organization_course_assignments
   (is_mandatory = true)
   ↓
4. Usuários veem curso como obrigatório no dashboard
   ↓
5. Sistema notifica sobre prazos (se deadline configurado)
```

### Fluxo 3: Personalização de Curso

```
1. Admin solicita personalização de curso global
   ↓
2. Sistema cria registro em course_customizations
   ↓
3. Admin pode:
   - Customizar título/descrição/thumbnail
   - Omitir módulos/aulas específicas
   - Adicionar conteúdo exclusivo
   - Customizar branding
   - Definir requisitos de conclusão
   ↓
4. Curso personalizado disponível apenas para a organização
   ↓
5. Usuários veem versão personalizada
```

### Fluxo 4: Estoque de Licenças

```
1. Organização adquire X licenças de um curso
   (total_licenses = X)
   ↓
2. Usuário se inscreve no curso
   ↓
3. Sistema verifica:
   - Há licenças disponíveis?
   - Curso está válido?
   - Usuário pertence à organização?
   ↓
4. Se sim:
   - Cria user_course_progress
   - Incrementa used_licenses
   - Decrementa available_licenses
   ↓
5. Se não:
   - Retorna erro: "Sem licenças disponíveis"
   ↓
6. Quando usuário completa curso:
   - Licença pode ser liberada (se configurado)
   - Ou mantida para histórico
```

### Fluxo 5: Certificação

```
1. Usuário completa curso (100% ou % mínimo configurado)
   ↓
2. Sistema verifica:
   - allow_certificate = true?
   - Requisitos atendidos? (quiz, etc.)
   ↓
3. Sistema gera certificado:
   - Usa template da organização (ou padrão)
   - Preenche dados do usuário e curso
   - Gera código de verificação único
   ↓
4. Certificado salvo em certificates
   ↓
5. Usuário pode:
   - Visualizar certificado
   - Baixar PDF
   - Compartilhar link de verificação
```

---

## 📋 Regras de Negócio

### 1. Visibilidade de Cursos

**Para Estudantes:**
- Veem apenas cursos disponíveis para sua organização
- Cursos obrigatórios aparecem destacados
- Cursos com prazo aparecem com alerta

**Para Org Managers:**
- Veem todos os cursos da organização
- Podem atribuir cursos a usuários
- Podem ver relatórios de progresso

**Para Platform Admins:**
- Veem todos os cursos (globais e por organização)
- Podem criar cursos globais
- Podem disponibilizar cursos para organizações

### 2. Estoque de Licenças

- **Licenciado (licensed)**: Controle de quantidade
  - `total_licenses` define limite
  - `used_licenses` rastreia uso
  - `available_licenses` calculado automaticamente

- **Ilimitado (unlimited)**: 
  - `total_licenses = NULL`
  - Sem controle de quantidade

- **Trial (trial)**:
  - Licenças limitadas por tempo
  - `valid_until` define expiração
  - Após expiração, acesso revogado

### 3. Cursos Obrigatórios

- Marcados com `is_mandatory = true` em `organization_course_access`
- Atribuídos automaticamente a todos os usuários (ou novos)
- Aparecem no dashboard com indicador especial
- Podem ter deadline configurado
- Notificações automáticas sobre prazos

### 4. Personalização

- Cursos podem ser personalizados por organização
- Personalizações não afetam curso original
- Cada organização vê sua versão personalizada
- Personalizações podem incluir:
  - Título/descrição customizados
  - Módulos/aulas omitidos ou adicionados
  - Branding (cores, logos)
  - Requisitos de conclusão

### 5. Certificações

- Emitidas apenas se `allow_certificate = true`
- Requisitos configuráveis:
  - % mínimo de conclusão
  - Quiz obrigatório (se `requires_quiz = true`)
  - Nota mínima no quiz
- Template customizável por organização
- Código de verificação único para cada certificado

---

## 🎨 Interface do Usuário

### Dashboard do Estudante

```
┌─────────────────────────────────────┐
│  Cursos Obrigatórios (2)           │
│  ⚠️  Segurança da Informação       │
│     Prazo: 30 dias                 │
│  ⚠️  Compliance LGPD               │
│     Prazo: 15 dias                 │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Meus Cursos (5)                    │
│  • Curso A - 60% completo          │
│  • Curso B - 100% completo ✅      │
│  • Curso C - 30% completo          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Cursos Disponíveis (12)            │
│  [Filtros: Nível, Área, Busca]     │
│  [Grid de cursos]                  │
└─────────────────────────────────────┘
```

### Painel Admin (Org Manager)

```
┌─────────────────────────────────────┐
│  Gestão de Cursos                   │
│  • Cursos Disponíveis (15)          │
│  • Cursos Obrigatórios (3)          │
│  • Licenças Utilizadas: 45/100      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Atribuir Curso                     │
│  • Selecionar curso                 │
│  • Selecionar usuários              │
│  • Marcar como obrigatório          │
│  • Definir prazo                    │
└─────────────────────────────────────┘
```

### Painel Superadmin

```
┌─────────────────────────────────────┐
│  Disponibilizar Curso                │
│  • Selecionar curso global           │
│  • Selecionar organização           │
│  • Tipo: [Licenciado/Ilimitado]     │
│  • Quantidade: [X licenças]         │
│  • Validade: [Data]                 │
│  • Obrigatório: [Sim/Não]           │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Personalizar Curso                  │
│  • Curso base: [Selecionar]         │
│  • Organização: [Selecionar]        │
│  • Customizar conteúdo              │
│  • Customizar branding              │
└─────────────────────────────────────┘
```

---

## 🔧 Implementação Técnica

### 1. Server Actions Necessárias

```typescript
// app/actions/organization-courses.ts

// Disponibilizar curso para organização
export async function assignCourseToOrganization(
  organizationId: string,
  courseId: string,
  config: {
    accessType: 'licensed' | 'unlimited' | 'trial';
    totalLicenses?: number;
    validUntil?: Date;
    isMandatory?: boolean;
    autoEnroll?: boolean;
  }
)

// Obter cursos disponíveis para organização
export async function getOrganizationCourses(
  organizationId: string,
  filters?: {
    mandatoryOnly?: boolean;
    availableOnly?: boolean;
  }
)

// Obter cursos obrigatórios do usuário
export async function getUserMandatoryCourses(userId: string)

// Verificar disponibilidade de licenças
export async function checkLicenseAvailability(
  organizationId: string,
  courseId: string
)

// Personalizar curso
export async function customizeCourse(
  organizationId: string,
  courseId: string,
  customizations: CourseCustomizations
)

// Atribuir curso a usuário específico
export async function assignCourseToUser(
  organizationId: string,
  courseId: string,
  userId: string,
  config: {
    isMandatory?: boolean;
    deadline?: Date;
  }
)
```

### 2. Queries SQL Importantes

```sql
-- Cursos disponíveis para organização
SELECT c.*, oca.*
FROM courses c
INNER JOIN organization_course_access oca ON c.id = oca.course_id
WHERE oca.organization_id = $1
  AND (oca.valid_until IS NULL OR oca.valid_until > NOW())
  AND (oca.total_licenses IS NULL OR oca.used_licenses < oca.total_licenses);

-- Cursos obrigatórios do usuário
SELECT c.*, oca.*, oca_assignment.deadline
FROM courses c
INNER JOIN organization_course_access oca ON c.id = oca.course_id
INNER JOIN organization_course_assignments oca_assignment 
  ON oca.course_id = oca_assignment.course_id
WHERE oca_assignment.user_id = $1
  AND oca_assignment.is_mandatory = true
  AND oca.organization_id = (SELECT organization_id FROM users WHERE id = $1);

-- Verificar licenças disponíveis
SELECT 
  total_licenses,
  used_licenses,
  (total_licenses - used_licenses) as available_licenses
FROM organization_course_access
WHERE organization_id = $1 AND course_id = $2;
```

### 3. RLS Policies Necessárias

```sql
-- organization_course_access
CREATE POLICY "Users can view courses available to their organization"
  ON organization_course_access FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

-- organization_course_assignments
CREATE POLICY "Users can view their own assignments"
  ON organization_course_assignments FOR SELECT
  USING (user_id = auth.uid());

-- course_customizations
CREATE POLICY "Users can view customizations for their organization"
  ON course_customizations FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );
```

---

## 📊 Exemplos de Uso

### Exemplo 1: Curso Obrigatório com Licenças Limitadas

```typescript
// Superadmin disponibiliza curso de Compliance para organização
await assignCourseToOrganization(
  'org-123',
  'course-compliance-lgpd',
  {
    accessType: 'licensed',
    totalLicenses: 50,
    isMandatory: true,
    autoEnroll: true,
    validUntil: new Date('2024-12-31')
  }
);

// Sistema automaticamente:
// 1. Cria organization_course_access
// 2. Atribui curso a todos os usuários ativos (50 usuários)
// 3. Usa 50 licenças (used_licenses = 50)
// 4. Marca como obrigatório para todos
```

### Exemplo 2: Curso Personalizado

```typescript
// Org Manager personaliza curso global
await customizeCourse(
  'org-123',
  'course-security-basics',
  {
    customTitle: 'Segurança da Informação - Empresa XYZ',
    customDescription: 'Versão customizada para nossa empresa...',
    customModules: {
      omit: ['module-advanced-topics'], // Omitir módulo avançado
      add: ['module-company-policies'] // Adicionar módulo específico
    },
    customBranding: {
      primaryColor: '#00ade8',
      logoUrl: 'https://...'
    }
  }
);
```

### Exemplo 3: Verificação de Licenças

```typescript
// Usuário tenta se inscrever em curso
const availability = await checkLicenseAvailability(
  user.organization_id,
  courseId
);

if (availability.available_licenses > 0) {
  // Inscrever usuário
  await enrollInCourse(courseId);
  // Incrementar used_licenses
} else {
  throw new Error('Sem licenças disponíveis. Entre em contato com o administrador.');
}
```

---

## ✅ Checklist de Implementação

### Fase 1: Estrutura de Dados
- [ ] Criar tabela `organization_course_access`
- [ ] Criar tabela `course_customizations`
- [ ] Criar tabela `organization_course_assignments`
- [ ] Criar tabela `certificate_templates`
- [ ] Atualizar tabela `courses` com novos campos
- [ ] Atualizar tabela `certificates` com novos campos
- [ ] Criar índices necessários
- [ ] Criar RLS policies

### Fase 2: Server Actions
- [ ] `assignCourseToOrganization()`
- [ ] `getOrganizationCourses()`
- [ ] `getUserMandatoryCourses()`
- [ ] `checkLicenseAvailability()`
- [ ] `customizeCourse()`
- [ ] `assignCourseToUser()`
- [ ] `releaseLicense()` (quando curso completo)

### Fase 3: Interface Admin
- [ ] Página de disponibilização de cursos
- [ ] Página de gestão de licenças
- [ ] Página de cursos obrigatórios
- [ ] Página de personalização de cursos
- [ ] Relatórios de uso de licenças

### Fase 4: Interface Usuário
- [ ] Dashboard com cursos obrigatórios destacados
- [ ] Lista de cursos disponíveis (filtrada por organização)
- [ ] Indicadores de prazo para cursos obrigatórios
- [ ] Visualização de certificados

### Fase 5: Certificações
- [ ] Sistema de templates de certificado
- [ ] Geração automática de certificados
- [ ] Código de verificação único
- [ ] Página pública de verificação

---

## 🚀 Próximos Passos

1. **Revisar e aprovar** este planejamento
2. **Criar migration SQL** com todas as tabelas
3. **Implementar Server Actions** básicas
4. **Criar interfaces** de admin e usuário
5. **Testar fluxos** completos
6. **Documentar** APIs e uso

---

**Última atualização**: 2024-11-24


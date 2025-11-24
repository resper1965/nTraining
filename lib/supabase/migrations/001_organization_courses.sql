-- ============================================================================
-- Migration: Organization Courses System
-- Description: Sistema de cursos por organização (tenant)
-- Date: 2024-11-24
-- ============================================================================

-- ============================================================================
-- 1. ORGANIZATION_COURSE_ACCESS (Estoque/Licenças)
-- ============================================================================

CREATE TABLE IF NOT EXISTS organization_course_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  
  -- Tipo de acesso
  access_type VARCHAR(50) NOT NULL DEFAULT 'licensed', -- 'licensed', 'unlimited', 'trial'
  
  -- Licenças/Estoque
  total_licenses INTEGER DEFAULT NULL, -- NULL = ilimitado
  used_licenses INTEGER DEFAULT 0,
  
  -- Validade
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ DEFAULT NULL, -- NULL = sem expiração
  
  -- Configurações
  is_mandatory BOOLEAN DEFAULT false, -- Curso obrigatório para a organização
  auto_enroll BOOLEAN DEFAULT false, -- Auto-inscrever novos usuários
  allow_certificate BOOLEAN DEFAULT true, -- Permitir emissão de certificado
  
  -- Personalização básica
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

-- Índices
CREATE INDEX IF NOT EXISTS idx_org_course_access_org ON organization_course_access(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_course_access_course ON organization_course_access(course_id);
CREATE INDEX IF NOT EXISTS idx_org_course_access_mandatory ON organization_course_access(organization_id, is_mandatory) WHERE is_mandatory = true;
CREATE INDEX IF NOT EXISTS idx_org_course_access_valid ON organization_course_access(valid_until) WHERE valid_until IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_org_course_access_type ON organization_course_access(access_type);

-- Função para calcular licenças disponíveis
CREATE OR REPLACE FUNCTION get_available_licenses(org_course_access_id UUID)
RETURNS INTEGER AS $$
DECLARE
  total INTEGER;
  used INTEGER;
BEGIN
  SELECT total_licenses, used_licenses INTO total, used
  FROM organization_course_access
  WHERE id = org_course_access_id;
  
  IF total IS NULL THEN
    RETURN NULL; -- Ilimitado
  END IF;
  
  RETURN GREATEST(0, total - used);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 2. COURSE_CUSTOMIZATIONS (Personalizações Avançadas)
-- ============================================================================

CREATE TABLE IF NOT EXISTS course_customizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  
  -- Personalizações de conteúdo
  custom_modules JSONB, -- Módulos customizados (pode omitir alguns)
  custom_lessons JSONB, -- Aulas customizadas
  custom_branding JSONB DEFAULT '{}', -- Cores, logos, etc.
  
  -- Configurações
  completion_requirements JSONB DEFAULT '{}', -- Requisitos customizados
  certificate_template_id UUID, -- Referência futura a certificate_templates
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(organization_id, course_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_course_customizations_org ON course_customizations(organization_id);
CREATE INDEX IF NOT EXISTS idx_course_customizations_course ON course_customizations(course_id);
CREATE INDEX IF NOT EXISTS idx_course_customizations_active ON course_customizations(is_active) WHERE is_active = true;

-- ============================================================================
-- 3. ORGANIZATION_COURSE_ASSIGNMENTS (Atribuições)
-- ============================================================================

CREATE TABLE IF NOT EXISTS organization_course_assignments (
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

-- Índices
CREATE INDEX IF NOT EXISTS idx_org_course_assignments_org ON organization_course_assignments(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_course_assignments_user ON organization_course_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_org_course_assignments_course ON organization_course_assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_org_course_assignments_mandatory ON organization_course_assignments(user_id, is_mandatory) WHERE is_mandatory = true;
CREATE INDEX IF NOT EXISTS idx_org_course_assignments_deadline ON organization_course_assignments(deadline) WHERE deadline IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_org_course_assignments_type ON organization_course_assignments(assignment_type);

-- ============================================================================
-- 4. CERTIFICATE_TEMPLATES (Templates de Certificado)
-- ============================================================================

CREATE TABLE IF NOT EXISTS certificate_templates (
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

-- Índices
CREATE INDEX IF NOT EXISTS idx_cert_templates_org ON certificate_templates(organization_id);
CREATE INDEX IF NOT EXISTS idx_cert_templates_default ON certificate_templates(organization_id, is_default) WHERE is_default = true;
CREATE INDEX IF NOT EXISTS idx_cert_templates_active ON certificate_templates(is_active) WHERE is_active = true;

-- Adicionar referência em course_customizations
ALTER TABLE course_customizations 
  ADD CONSTRAINT fk_cert_template 
  FOREIGN KEY (certificate_template_id) 
  REFERENCES certificate_templates(id) 
  ON DELETE SET NULL;

-- ============================================================================
-- 5. ATUALIZAR TABELA COURSES
-- ============================================================================

-- Adicionar campos à tabela courses existente
ALTER TABLE courses 
  ADD COLUMN IF NOT EXISTS course_type VARCHAR(50) DEFAULT 'global'; 
  -- 'global', 'organization', 'customized'

ALTER TABLE courses 
  ADD COLUMN IF NOT EXISTS base_course_id UUID REFERENCES courses(id); 
  -- Para cursos personalizados, referência ao curso base

ALTER TABLE courses 
  ADD COLUMN IF NOT EXISTS is_certifiable BOOLEAN DEFAULT true; 
  -- Permite emissão de certificado

ALTER TABLE courses 
  ADD COLUMN IF NOT EXISTS min_completion_percentage INTEGER DEFAULT 100; 
  -- % mínimo para conclusão (padrão 100%)

ALTER TABLE courses 
  ADD COLUMN IF NOT EXISTS requires_quiz BOOLEAN DEFAULT false; 
  -- Requer quiz para conclusão

ALTER TABLE courses 
  ADD COLUMN IF NOT EXISTS min_quiz_score INTEGER DEFAULT 70; 
  -- Nota mínima no quiz (se requerido)

-- Índices para novos campos
CREATE INDEX IF NOT EXISTS idx_courses_type ON courses(course_type);
CREATE INDEX IF NOT EXISTS idx_courses_base ON courses(base_course_id);
CREATE INDEX IF NOT EXISTS idx_courses_certifiable ON courses(is_certifiable) WHERE is_certifiable = true;

-- ============================================================================
-- 6. ATUALIZAR TABELA CERTIFICATES
-- ============================================================================

-- Verificar se tabela existe antes de adicionar campos
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'certificates') THEN
    ALTER TABLE certificates 
      ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL;
    
    ALTER TABLE certificates 
      ADD COLUMN IF NOT EXISTS certificate_template_id UUID REFERENCES certificate_templates(id) ON DELETE SET NULL;
    
    ALTER TABLE certificates 
      ADD COLUMN IF NOT EXISTS issued_by UUID REFERENCES users(id) ON DELETE SET NULL;
    
    ALTER TABLE certificates 
      ADD COLUMN IF NOT EXISTS verification_code VARCHAR(100) UNIQUE;
    
    -- Índices
    CREATE INDEX IF NOT EXISTS idx_certificates_org ON certificates(organization_id);
    CREATE INDEX IF NOT EXISTS idx_certificates_template ON certificates(certificate_template_id);
    CREATE INDEX IF NOT EXISTS idx_certificates_verification ON certificates(verification_code);
  END IF;
END $$;

-- ============================================================================
-- 7. TRIGGERS E FUNÇÕES AUXILIARES
-- ============================================================================

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em todas as novas tabelas
CREATE TRIGGER update_org_course_access_updated_at
  BEFORE UPDATE ON organization_course_access
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_customizations_updated_at
  BEFORE UPDATE ON course_customizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_certificate_templates_updated_at
  BEFORE UPDATE ON certificate_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função para incrementar used_licenses quando usuário se inscreve
CREATE OR REPLACE FUNCTION increment_used_licenses()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE organization_course_access
  SET used_licenses = used_licenses + 1
  WHERE organization_id = (
    SELECT organization_id FROM users WHERE id = NEW.user_id
  )
  AND course_id = NEW.course_id
  AND (total_licenses IS NULL OR used_licenses < total_licenses);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para incrementar licenças ao criar progresso
CREATE TRIGGER increment_license_on_enroll
  AFTER INSERT ON user_course_progress
  FOR EACH ROW
  EXECUTE FUNCTION increment_used_licenses();

-- ============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Habilitar RLS
ALTER TABLE organization_course_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_customizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_course_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificate_templates ENABLE ROW LEVEL SECURITY;

-- Policies para organization_course_access
CREATE POLICY "Users can view courses available to their organization"
  ON organization_course_access FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND is_superadmin = true
    )
  );

CREATE POLICY "Superadmins can manage organization course access"
  ON organization_course_access FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND is_superadmin = true
    )
  );

-- Policies para course_customizations
CREATE POLICY "Users can view customizations for their organization"
  ON course_customizations FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND is_superadmin = true
    )
  );

CREATE POLICY "Org managers and superadmins can manage customizations"
  ON course_customizations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND (role = 'org_manager' OR is_superadmin = true)
    )
  );

-- Policies para organization_course_assignments
CREATE POLICY "Users can view their own assignments"
  ON organization_course_assignments FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND (role IN ('org_manager', 'platform_admin') OR is_superadmin = true)
    )
  );

CREATE POLICY "Org managers and superadmins can manage assignments"
  ON organization_course_assignments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND (role IN ('org_manager', 'platform_admin') OR is_superadmin = true)
    )
  );

-- Policies para certificate_templates
CREATE POLICY "Users can view templates for their organization"
  ON certificate_templates FOR SELECT
  USING (
    organization_id IS NULL -- Templates globais
    OR organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND is_superadmin = true
    )
  );

CREATE POLICY "Org managers and superadmins can manage templates"
  ON certificate_templates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND (role IN ('org_manager', 'platform_admin') OR is_superadmin = true)
    )
  );

-- ============================================================================
-- 9. COMENTÁRIOS E DOCUMENTAÇÃO
-- ============================================================================

COMMENT ON TABLE organization_course_access IS 'Controla acesso e licenças de cursos por organização';
COMMENT ON TABLE course_customizations IS 'Personalizações de cursos por organização';
COMMENT ON TABLE organization_course_assignments IS 'Atribuições de cursos a usuários específicos';
COMMENT ON TABLE certificate_templates IS 'Templates de certificados customizáveis';

COMMENT ON COLUMN organization_course_access.access_type IS 'Tipo de acesso: licensed (limitado), unlimited (ilimitado), trial (trial)';
COMMENT ON COLUMN organization_course_access.total_licenses IS 'Total de licenças disponíveis. NULL = ilimitado';
COMMENT ON COLUMN organization_course_access.used_licenses IS 'Quantidade de licenças em uso';
COMMENT ON COLUMN organization_course_access.is_mandatory IS 'Se true, curso é obrigatório para todos os usuários da organização';


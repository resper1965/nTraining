-- ============================================================================
-- SETUP COMPLETO - Novo Projeto Supabase n.training
-- ============================================================================
-- Este arquivo contém TODAS as migrações essenciais em ordem
-- Aplicar este arquivo completo no SQL Editor do Supabase
-- ============================================================================

-- ============================================================================
-- PARTE 1: SCHEMA BASE (lib/supabase/schema.sql)
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUMS
CREATE TYPE user_role AS ENUM ('platform_admin', 'org_manager', 'student');
CREATE TYPE course_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE content_type AS ENUM ('video', 'text', 'pdf', 'quiz', 'embed');
CREATE TYPE question_type AS ENUM ('multiple_choice', 'true_false', 'scenario');
CREATE TYPE assignment_status AS ENUM ('not_started', 'in_progress', 'completed', 'overdue');
CREATE TYPE course_status AS ENUM ('draft', 'published', 'archived');

-- ORGANIZATIONS
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  cnpj VARCHAR(20),
  razao_social VARCHAR(255),
  industry VARCHAR(100),
  employee_count INTEGER,
  logo_url TEXT,
  settings JSONB DEFAULT '{}',
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  subscription_status VARCHAR(50),
  max_users INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_stripe ON organizations(stripe_customer_id);

-- USERS
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  role user_role DEFAULT 'student',
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  department VARCHAR(100),
  job_title VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  is_superadmin BOOLEAN DEFAULT false,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_superadmin ON users(is_superadmin) WHERE is_superadmin = TRUE;

-- COURSES
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  objectives TEXT,
  thumbnail_url TEXT,
  duration_hours DECIMAL(5,2),
  level course_level DEFAULT 'beginner',
  area VARCHAR(100),
  status course_status DEFAULT 'draft',
  created_by UUID REFERENCES users(id),
  organization_id UUID REFERENCES organizations(id),
  is_public BOOLEAN DEFAULT false,
  is_certifiable BOOLEAN DEFAULT false,
  requires_quiz BOOLEAN DEFAULT false,
  min_completion_percentage INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_area ON courses(area);
CREATE INDEX idx_courses_level ON courses(level);
CREATE INDEX idx_courses_organization ON courses(organization_id);
CREATE INDEX idx_courses_slug ON courses(slug);

-- MODULES
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_modules_course ON modules(course_id);
CREATE INDEX idx_modules_order ON modules(course_id, order_index);

-- LESSONS
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content_type content_type NOT NULL,
  content_url TEXT,
  content_text TEXT,
  duration_minutes INTEGER,
  order_index INTEGER NOT NULL,
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lessons_module ON lessons(module_id);
CREATE INDEX idx_lessons_order ON lessons(module_id, order_index);

-- LESSON MATERIALS
CREATE TABLE lesson_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50),
  file_size_bytes BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_materials_lesson ON lesson_materials(lesson_id);

-- QUIZZES
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  passing_score INTEGER DEFAULT 70,
  max_attempts INTEGER DEFAULT 3,
  time_limit_minutes INTEGER,
  show_correct_answers BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT quiz_belongs_to_course_or_lesson CHECK (
    (course_id IS NOT NULL AND lesson_id IS NULL) OR
    (course_id IS NULL AND lesson_id IS NOT NULL)
  )
);

CREATE INDEX idx_quizzes_course ON quizzes(course_id);
CREATE INDEX idx_quizzes_lesson ON quizzes(lesson_id);

-- QUIZ QUESTIONS
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type question_type DEFAULT 'multiple_choice',
  points INTEGER DEFAULT 1,
  explanation TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_questions_quiz ON quiz_questions(quiz_id);

-- QUESTION OPTIONS
CREATE TABLE question_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID REFERENCES quiz_questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  explanation TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_options_question ON question_options(question_id);

-- LEARNING PATHS
CREATE TABLE learning_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  estimated_duration_hours DECIMAL(5,2),
  is_mandatory BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_paths_organization ON learning_paths(organization_id);
CREATE INDEX idx_paths_slug ON learning_paths(slug);

-- PATH COURSES
CREATE TABLE path_courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(path_id, course_id)
);

CREATE INDEX idx_path_courses_path ON path_courses(path_id);
CREATE INDEX idx_path_courses_course ON path_courses(course_id);

-- USER PATH ASSIGNMENTS
CREATE TABLE user_path_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES users(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  deadline TIMESTAMPTZ,
  status assignment_status DEFAULT 'not_started',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, path_id)
);

CREATE INDEX idx_assignments_user ON user_path_assignments(user_id);
CREATE INDEX idx_assignments_path ON user_path_assignments(path_id);
CREATE INDEX idx_assignments_status ON user_path_assignments(status);
CREATE INDEX idx_assignments_deadline ON user_path_assignments(deadline);

-- USER COURSE PROGRESS
CREATE TABLE user_course_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  status assignment_status DEFAULT 'not_started',
  completion_percentage INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

CREATE INDEX idx_course_progress_user ON user_course_progress(user_id);
CREATE INDEX idx_course_progress_course ON user_course_progress(course_id);
CREATE INDEX idx_course_progress_status ON user_course_progress(status);

-- USER LESSON PROGRESS
CREATE TABLE user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  watched_duration_seconds INTEGER DEFAULT 0,
  last_position_seconds INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_lesson_progress_user ON user_lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson ON user_lesson_progress(lesson_id);

-- USER QUIZ ATTEMPTS
CREATE TABLE user_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL,
  score INTEGER,
  max_score INTEGER,
  percentage INTEGER,
  passed BOOLEAN,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  time_taken_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_attempts_user ON user_quiz_attempts(user_id);
CREATE INDEX idx_attempts_quiz ON user_quiz_attempts(quiz_id);
CREATE INDEX idx_attempts_user_quiz ON user_quiz_attempts(user_id, quiz_id);

-- USER ANSWERS
CREATE TABLE user_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID REFERENCES user_quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES quiz_questions(id) ON DELETE CASCADE,
  selected_option_id UUID REFERENCES question_options(id),
  is_correct BOOLEAN,
  points_earned INTEGER DEFAULT 0,
  answered_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_answers_attempt ON user_answers(attempt_id);
CREATE INDEX idx_answers_question ON user_answers(question_id);

-- CERTIFICATES
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  verification_code VARCHAR(100) UNIQUE NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  pdf_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_certificates_user ON certificates(user_id);
CREATE INDEX idx_certificates_course ON certificates(course_id);
CREATE INDEX idx_certificates_verification ON certificates(verification_code);

-- USER NOTES
CREATE TABLE user_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  note_text TEXT NOT NULL,
  timestamp_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notes_user ON user_notes(user_id);
CREATE INDEX idx_notes_lesson ON user_notes(lesson_id);

-- ACTIVITY LOGS
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_logs_user ON activity_logs(user_id);
CREATE INDEX idx_logs_organization ON activity_logs(organization_id);
CREATE INDEX idx_logs_event_type ON activity_logs(event_type);
CREATE INDEX idx_logs_created_at ON activity_logs(created_at);

-- TRIGGERS FOR UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON modules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON quizzes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_learning_paths_updated_at BEFORE UPDATE ON learning_paths FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_course_progress_updated_at BEFORE UPDATE ON user_course_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_lesson_progress_updated_at BEFORE UPDATE ON user_lesson_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_notes_updated_at BEFORE UPDATE ON user_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PARTE 2: SISTEMA DE NOTIFICAÇÕES (002_notifications.sql)
-- ============================================================================

-- Tabela de Notificações
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb,
    action_url TEXT,
    action_label VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT notifications_type_check CHECK (
        type IN (
            'course_assigned',
            'course_deadline_approaching',
            'course_deadline_passed',
            'course_completed',
            'certificate_available',
            'new_content',
            'quiz_available',
            'quiz_result',
            'welcome',
            'system',
            'organization_update'
        )
    )
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);

-- Tabela de Preferências de Notificação
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    email_enabled BOOLEAN DEFAULT TRUE,
    in_app_enabled BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT FALSE,
    frequency VARCHAR(20) DEFAULT 'immediate',
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT notification_preferences_frequency_check CHECK (
        frequency IN ('immediate', 'daily', 'weekly', 'never')
    )
);

CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON public.notification_preferences(user_id);

-- Trigger para updated_at de notificações
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_notifications_updated_at
    BEFORE UPDATE ON public.notifications
    FOR EACH ROW
    EXECUTE FUNCTION update_notifications_updated_at();

CREATE TRIGGER trigger_update_notification_preferences_updated_at
    BEFORE UPDATE ON public.notification_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_notifications_updated_at();

-- Funções de notificação
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_type VARCHAR(50),
    p_title VARCHAR(255),
    p_message TEXT,
    p_metadata JSONB DEFAULT '{}'::jsonb,
    p_action_url TEXT DEFAULT NULL,
    p_action_label VARCHAR(100) DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_notification_id UUID;
BEGIN
    INSERT INTO public.notifications (
        user_id,
        type,
        title,
        message,
        metadata,
        action_url,
        action_label
    ) VALUES (
        p_user_id,
        p_type,
        p_title,
        p_message,
        p_metadata,
        p_action_url,
        p_action_label
    )
    RETURNING id INTO v_notification_id;
    
    RETURN v_notification_id;
END;
$$;

CREATE OR REPLACE FUNCTION mark_notification_read(p_notification_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.notifications
    SET read = TRUE, updated_at = NOW()
    WHERE id = p_notification_id AND user_id = p_user_id;
    
    RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION mark_all_notifications_read(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_count INTEGER;
BEGIN
    UPDATE public.notifications
    SET read = TRUE, updated_at = NOW()
    WHERE user_id = p_user_id AND read = FALSE;
    
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$;

-- ============================================================================
-- PARTE 3: ORGANIZAÇÕES E ACESSO (001_organization_courses.sql - resumido)
-- ============================================================================

CREATE TABLE IF NOT EXISTS organization_course_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  access_type VARCHAR(50) NOT NULL DEFAULT 'licensed',
  total_licenses INTEGER DEFAULT NULL,
  used_licenses INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ DEFAULT NULL,
  is_mandatory BOOLEAN DEFAULT false,
  auto_enroll BOOLEAN DEFAULT false,
  allow_certificate BOOLEAN DEFAULT true,
  custom_title VARCHAR(255),
  custom_description TEXT,
  custom_thumbnail_url TEXT,
  custom_settings JSONB DEFAULT '{}',
  assigned_by UUID REFERENCES users(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_org_course_access_org ON organization_course_access(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_course_access_course ON organization_course_access(course_id);
CREATE INDEX IF NOT EXISTS idx_org_course_access_mandatory ON organization_course_access(organization_id, is_mandatory) WHERE is_mandatory = true;

CREATE TRIGGER update_organization_course_access_updated_at BEFORE UPDATE ON organization_course_access FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PARTE 4: RLS E TRIGGERS ESSENCIAIS
-- ============================================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE path_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_path_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_course_access ENABLE ROW LEVEL SECURITY;

-- Funções helper
CREATE OR REPLACE FUNCTION is_user_superadmin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = user_id AND is_superadmin = TRUE
  );
END;
$$;

CREATE OR REPLACE FUNCTION get_user_organization_id(user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (SELECT organization_id FROM users WHERE id = user_id);
END;
$$;

-- Trigger para criar perfil de usuário após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  default_org_id UUID;
  user_full_name TEXT;
BEGIN
  -- Get or create default organization
  SELECT id INTO default_org_id FROM organizations LIMIT 1;

  IF default_org_id IS NULL THEN
    INSERT INTO organizations (name, slug, industry, employee_count, max_users)
    VALUES ('Organização Padrão', 'organizacao-padrao', 'General', 1, 100)
    RETURNING id INTO default_org_id;
  END IF;

  -- Extract full_name from user_metadata, defaulting to email if not present
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email);

  -- Insert into public.users table
  INSERT INTO public.users (id, organization_id, email, full_name, role, is_active, is_superadmin)
  VALUES (NEW.id, default_org_id, NEW.email, user_full_name, 'student', TRUE, FALSE);

  RETURN NEW;
END;
$$;

-- Criar trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies para users
DROP POLICY IF EXISTS "Users can view appropriate users" ON users;
CREATE POLICY "Users can view appropriate users"
  ON users FOR SELECT
  USING (
    id = (select auth.uid()) OR
    is_user_superadmin((select auth.uid())) OR
    (
      organization_id IS NOT NULL AND
      get_user_organization_id((select auth.uid())) IS NOT NULL AND
      organization_id = get_user_organization_id((select auth.uid()))
    )
  );

DROP POLICY IF EXISTS "Allow user insert" ON users;
CREATE POLICY "Allow user insert"
  ON users FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role' OR
    id = (select auth.uid()) OR
    (select auth.uid()) IS NULL
  );

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

-- RLS Policies para organizations
DROP POLICY IF EXISTS "Users can view their organization" ON organizations;
CREATE POLICY "Users can view their organization"
  ON organizations FOR SELECT
  USING (
    is_user_superadmin((select auth.uid())) OR
    id = get_user_organization_id((select auth.uid()))
  );

-- RLS Policies para courses
DROP POLICY IF EXISTS "Users can view published courses" ON courses;
CREATE POLICY "Users can view published courses"
  ON courses FOR SELECT
  USING (
    is_user_superadmin((select auth.uid())) OR
    status = 'published' OR
    (
      organization_id IS NOT NULL AND
      organization_id = get_user_organization_id((select auth.uid()))
    ) OR
    created_by = (select auth.uid())
  );

-- RLS Policies para modules
DROP POLICY IF EXISTS "Users can view modules" ON modules;
CREATE POLICY "Users can view modules"
  ON modules FOR SELECT
  USING (
    is_user_superadmin((select auth.uid())) OR
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = modules.course_id AND (
        courses.status = 'published' OR
        courses.created_by = (select auth.uid()) OR
        courses.organization_id = get_user_organization_id((select auth.uid()))
      )
    )
  );

-- RLS Policies para lessons
DROP POLICY IF EXISTS "Users can view lessons" ON lessons;
CREATE POLICY "Users can view lessons"
  ON lessons FOR SELECT
  USING (
    is_user_superadmin((select auth.uid())) OR
    EXISTS (
      SELECT 1 FROM modules
      JOIN courses ON courses.id = modules.course_id
      WHERE modules.id = lessons.module_id AND (
        courses.status = 'published' OR
        courses.created_by = (select auth.uid()) OR
        courses.organization_id = get_user_organization_id((select auth.uid()))
      )
    )
  );

-- RLS Policies para quizzes
DROP POLICY IF EXISTS "Users can view quizzes" ON quizzes;
CREATE POLICY "Users can view quizzes"
  ON quizzes FOR SELECT
  USING (
    is_user_superadmin((select auth.uid())) OR
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = quizzes.course_id AND (
        courses.status = 'published' OR
        courses.created_by = (select auth.uid()) OR
        courses.organization_id = get_user_organization_id((select auth.uid()))
      )
    ) OR
    EXISTS (
      SELECT 1 FROM lessons
      JOIN modules ON modules.id = lessons.module_id
      JOIN courses ON courses.id = modules.course_id
      WHERE lessons.id = quizzes.lesson_id AND (
        courses.status = 'published' OR
        courses.created_by = (select auth.uid()) OR
        courses.organization_id = get_user_organization_id((select auth.uid()))
      )
    )
  );

-- RLS Policies para quiz_questions
DROP POLICY IF EXISTS "Users can view quiz questions" ON quiz_questions;
CREATE POLICY "Users can view quiz questions"
  ON quiz_questions FOR SELECT
  USING (
    is_user_superadmin((select auth.uid())) OR
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = quiz_questions.quiz_id
    )
  );

-- RLS Policies para question_options
DROP POLICY IF EXISTS "Users can view question options" ON question_options;
CREATE POLICY "Users can view question options"
  ON question_options FOR SELECT
  USING (
    is_user_superadmin((select auth.uid())) OR
    EXISTS (
      SELECT 1 FROM quiz_questions
      JOIN quizzes ON quizzes.id = quiz_questions.quiz_id
      WHERE quiz_questions.id = question_options.question_id
    )
  );

-- RLS Policies para user_lesson_progress
DROP POLICY IF EXISTS "Users can manage own lesson progress" ON user_lesson_progress;
CREATE POLICY "Users can manage own lesson progress"
  ON user_lesson_progress FOR ALL
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- RLS Policies para user_quiz_attempts
DROP POLICY IF EXISTS "Users can manage own quiz attempts" ON user_quiz_attempts;
CREATE POLICY "Users can manage own quiz attempts"
  ON user_quiz_attempts FOR ALL
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- RLS Policies para user_answers
DROP POLICY IF EXISTS "Users can manage own answers" ON user_answers;
CREATE POLICY "Users can manage own answers"
  ON user_answers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_quiz_attempts
      WHERE user_quiz_attempts.id = user_answers.attempt_id
      AND user_quiz_attempts.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_quiz_attempts
      WHERE user_quiz_attempts.id = user_answers.attempt_id
      AND user_quiz_attempts.user_id = (select auth.uid())
    )
  );

-- RLS Policies para user_course_progress
DROP POLICY IF EXISTS "Users can manage own course progress" ON user_course_progress;
CREATE POLICY "Users can manage own course progress"
  ON user_course_progress FOR ALL
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- RLS Policies para certificates
DROP POLICY IF EXISTS "Public certificate verification" ON certificates;
CREATE POLICY "Public certificate verification"
  ON certificates FOR SELECT
  USING (true);

-- RLS Policies para user_notes
DROP POLICY IF EXISTS "Users can manage own notes" ON user_notes;
CREATE POLICY "Users can manage own notes"
  ON user_notes FOR ALL
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- RLS Policies para activity_logs
DROP POLICY IF EXISTS "System can insert activity logs" ON activity_logs;
CREATE POLICY "System can insert activity logs"
  ON activity_logs FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role' OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (select auth.uid()) AND users.role = 'platform_admin'
    )
  );

DROP POLICY IF EXISTS "Admins can view organization logs" ON activity_logs;
CREATE POLICY "Admins can view organization logs"
  ON activity_logs FOR SELECT
  USING (
    is_user_superadmin((select auth.uid())) OR
    (
      organization_id IS NOT NULL AND
      organization_id = get_user_organization_id((select auth.uid())) AND
      EXISTS (
        SELECT 1 FROM users
        WHERE users.id = (select auth.uid()) AND users.role IN ('platform_admin', 'org_manager')
      )
    )
  );

-- RLS Policies para notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can create notifications" ON notifications;
CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- RLS Policies para notification_preferences
DROP POLICY IF EXISTS "Users can manage own notification preferences" ON notification_preferences;
CREATE POLICY "Users can manage own notification preferences"
  ON notification_preferences FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies para learning_paths
DROP POLICY IF EXISTS "Users can view learning paths" ON learning_paths;
CREATE POLICY "Users can view learning paths"
  ON learning_paths FOR SELECT
  USING (
    is_user_superadmin((select auth.uid())) OR
    organization_id = get_user_organization_id((select auth.uid())) OR
    created_by = (select auth.uid())
  );

-- RLS Policies para path_courses
DROP POLICY IF EXISTS "Users can view path courses" ON path_courses;
CREATE POLICY "Users can view path courses"
  ON path_courses FOR SELECT
  USING (
    is_user_superadmin((select auth.uid())) OR
    EXISTS (
      SELECT 1 FROM learning_paths
      WHERE learning_paths.id = path_courses.path_id AND (
        learning_paths.organization_id = get_user_organization_id((select auth.uid())) OR
        learning_paths.created_by = (select auth.uid())
      )
    )
  );

-- RLS Policies para user_path_assignments
DROP POLICY IF EXISTS "Users can view own path assignments" ON user_path_assignments;
CREATE POLICY "Users can view own path assignments"
  ON user_path_assignments FOR SELECT
  USING (
    user_id = (select auth.uid()) OR
    is_user_superadmin((select auth.uid())) OR
    (
      organization_id IS NOT NULL AND
      organization_id = get_user_organization_id((select auth.uid())) AND
      EXISTS (
        SELECT 1 FROM users
        WHERE users.id = (select auth.uid()) AND users.role IN ('platform_admin', 'org_manager')
      )
    )
  );

-- RLS Policies para lesson_materials
DROP POLICY IF EXISTS "Users can view lesson materials" ON lesson_materials;
CREATE POLICY "Users can view lesson materials"
  ON lesson_materials FOR SELECT
  USING (
    is_user_superadmin((select auth.uid())) OR
    EXISTS (
      SELECT 1 FROM lessons
      JOIN modules ON modules.id = lessons.module_id
      JOIN courses ON courses.id = modules.course_id
      WHERE lessons.id = lesson_materials.lesson_id AND (
        courses.status = 'published' OR
        courses.created_by = (select auth.uid()) OR
        courses.organization_id = get_user_organization_id((select auth.uid()))
      )
    )
  );

-- RLS Policies para organization_course_access
DROP POLICY IF EXISTS "Users can view organization course access" ON organization_course_access;
CREATE POLICY "Users can view organization course access"
  ON organization_course_access FOR SELECT
  USING (
    is_user_superadmin((select auth.uid())) OR
    organization_id = get_user_organization_id((select auth.uid()))
  );

-- ============================================================================
-- FIM DO SETUP
-- ============================================================================

COMMENT ON FUNCTION public.handle_new_user() IS 'Handles new user creation from auth.users, inserting a corresponding entry into public.users.';
COMMENT ON FUNCTION is_user_superadmin(UUID) IS 'Helper function to check if a user is superadmin';
COMMENT ON FUNCTION get_user_organization_id(UUID) IS 'Helper function to get organization_id of a user';

# Migrações Essenciais para Novo Projeto Supabase

## 📝 Ordem de Aplicação

### 1. Schema Base (lib/supabase/schema.sql)
**Aplicar PRIMEIRO** - Cria todas as tabelas, enums e índices básicos.

### 2. Sistema de Notificações
**Arquivo:** `lib/supabase/migrations/002_notifications.sql`
- Cria tabela `notifications`
- Cria tabela `notification_preferences`
- Configura RLS

### 3. Organizações e Acesso a Cursos
**Arquivo:** `lib/supabase/migrations/001_organization_courses.sql`
- Cria tabela `organization_course_access`
- Configura licenças e acesso por organização

### 4. AI Course Architect (Opcional)
**Arquivo:** `lib/supabase/migrations/012_setup_ai_course_architect.sql`
- Apenas se for usar a funcionalidade de IA para gerar cursos
- Cria tabelas `knowledge_sources` e `knowledge_vectors`
- Habilita extensão `vector`

### 5. RLS e Triggers (IMPORTANTE)
**Aplicar DEPOIS de todas as tabelas criadas**

Criar um arquivo SQL com:

```sql
-- ============================================================================
-- RLS Policies e Triggers Essenciais
-- ============================================================================

-- Habilitar RLS em todas as tabelas principais
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE path_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_path_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Função helper para verificar superadmin
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

-- Função helper para obter organization_id do usuário
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
    )
  );

-- Adicionar mais políticas conforme necessário...
-- (modules, lessons, quizzes, etc.)
```

## ⚠️ IMPORTANTE

1. **Aplicar na ordem correta** - Schema primeiro, depois migrações, depois RLS
2. **Testar cada etapa** - Verificar se não há erros antes de continuar
3. **Não aplicar migrações de "fix"** - Apenas as essenciais listadas acima
4. **Configurar RLS corretamente** - Desde o início, não depois

## 🔄 Após Aplicar Migrações

1. Criar usuários iniciais
2. Criar organizações
3. Configurar Google OAuth
4. Testar autenticação
5. Verificar RLS funcionando

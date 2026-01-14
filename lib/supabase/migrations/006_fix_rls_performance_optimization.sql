-- ============================================================================
-- FIX: Otimizar políticas RLS usando (select auth.uid())
-- ============================================================================
-- 
-- PROBLEMA: auth.uid() é re-avaliado para cada linha (lento)
-- SOLUÇÃO: Usar (select auth.uid()) para avaliar uma vez por query
-- ============================================================================

-- Remover políticas antigas
DROP POLICY IF EXISTS "Users can view appropriate users" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can view their organization" ON organizations;
DROP POLICY IF EXISTS "View published courses" ON courses;
DROP POLICY IF EXISTS "Users can view own progress" ON user_course_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_course_progress;
DROP POLICY IF EXISTS "View organization logs" ON activity_logs;

-- Recriar políticas otimizadas
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

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Users can view their organization"
  ON organizations FOR SELECT
  USING (
    id = get_user_organization_id((select auth.uid())) OR
    is_user_superadmin((select auth.uid()))
  );

CREATE POLICY "View published courses"
  ON courses FOR SELECT
  USING (
    (status = 'published'::course_status) OR
    created_by = (select auth.uid()) OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (select auth.uid())
      AND users.role = 'platform_admin'::user_role
    )
  );

CREATE POLICY "Users can view own progress"
  ON user_course_progress FOR SELECT
  USING (
    is_user_superadmin((select auth.uid())) OR
    user_id = (select auth.uid())
  );

CREATE POLICY "Users can update own progress"
  ON user_course_progress FOR UPDATE
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ============================================================================
-- FIX: Correções de Segurança e Performance
-- ============================================================================
-- 
-- PROBLEMAS CORRIGIDOS:
-- 1. Política RLS muito permissiva em activity_logs (segurança)
-- 2. Políticas RLS re-avaliando auth.uid() por linha (performance)
-- 3. Otimização de políticas críticas para melhor performance
-- ============================================================================

-- ============================================================================
-- 1. SEGURANÇA: Corrigir política permissiva de activity_logs
-- ============================================================================
-- A política atual permite INSERT irrestrito (WITH CHECK (true))
-- Restringir para apenas service_role e sistema interno
-- ============================================================================

DROP POLICY IF EXISTS "System can insert activity logs" ON activity_logs;

CREATE POLICY "System can insert activity logs"
  ON activity_logs FOR INSERT
  WITH CHECK (
    -- Apenas service_role pode inserir logs
    auth.role() = 'service_role' OR
    -- Ou quando inserido via trigger/função do sistema
    -- (não permite inserção direta por usuários)
    false
  );

COMMENT ON POLICY "System can insert activity logs" ON activity_logs IS 
  'Permite inserção de logs apenas via service_role ou funções do sistema. Restringe acesso direto por usuários.';

-- ============================================================================
-- 2. PERFORMANCE: Otimizar política "Allow user insert" em users
-- ============================================================================
-- Substituir auth.uid() por (select auth.uid()) para avaliar uma vez por query
-- ============================================================================

DROP POLICY IF EXISTS "Allow user insert" ON users;

CREATE POLICY "Allow user insert"
  ON users FOR INSERT
  WITH CHECK (
    -- Service role pode inserir qualquer usuário
    auth.role() = 'service_role' OR
    -- Usuário autenticado pode inserir seu próprio perfil (para triggers)
    id = (select auth.uid()) OR
    -- Permitir inserção quando não há usuário autenticado (signup público)
    (select auth.uid()) IS NULL
  );

COMMENT ON POLICY "Allow user insert" ON users IS 
  'Permite inserção de usuários via service role, triggers, ou durante signup público. Otimizada para performance.';

-- ============================================================================
-- 3. PERFORMANCE: Otimizar políticas críticas de user_quiz_attempts
-- ============================================================================
-- Estas políticas são muito usadas e precisam de otimização
-- ============================================================================

-- Ver tentativas próprias
DROP POLICY IF EXISTS "Users can view own quiz attempts" ON user_quiz_attempts;
CREATE POLICY "Users can view own quiz attempts"
  ON user_quiz_attempts FOR SELECT
  USING (user_id = (select auth.uid()));

-- Criar tentativas próprias
DROP POLICY IF EXISTS "Users can create own quiz attempts" ON user_quiz_attempts;
CREATE POLICY "Users can create own quiz attempts"
  ON user_quiz_attempts FOR INSERT
  WITH CHECK (user_id = (select auth.uid()));

-- Atualizar tentativas próprias
DROP POLICY IF EXISTS "Users can update own quiz attempts" ON user_quiz_attempts;
CREATE POLICY "Users can update own quiz attempts"
  ON user_quiz_attempts FOR UPDATE
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ============================================================================
-- 4. PERFORMANCE: Otimizar políticas críticas de user_answers
-- ============================================================================

-- Ver respostas próprias
DROP POLICY IF EXISTS "Users can view own answers" ON user_answers;
CREATE POLICY "Users can view own answers"
  ON user_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_quiz_attempts
      WHERE user_quiz_attempts.id = user_answers.attempt_id
      AND user_quiz_attempts.user_id = (select auth.uid())
    )
  );

-- Criar respostas próprias
DROP POLICY IF EXISTS "Users can create own answers" ON user_answers;
CREATE POLICY "Users can create own answers"
  ON user_answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_quiz_attempts
      WHERE user_quiz_attempts.id = user_answers.attempt_id
      AND user_quiz_attempts.user_id = (select auth.uid())
    )
  );

-- ============================================================================
-- 5. PERFORMANCE: Otimizar políticas críticas de user_lesson_progress
-- ============================================================================

-- Ver progresso próprio
DROP POLICY IF EXISTS "Users can view own lesson progress" ON user_lesson_progress;
CREATE POLICY "Users can view own lesson progress"
  ON user_lesson_progress FOR SELECT
  USING (user_id = (select auth.uid()));

-- Atualizar progresso próprio
DROP POLICY IF EXISTS "Users can update own lesson progress" ON user_lesson_progress;
CREATE POLICY "Users can update own lesson progress"
  ON user_lesson_progress FOR UPDATE
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- Inserir progresso próprio
DROP POLICY IF EXISTS "Users can insert own lesson progress" ON user_lesson_progress;
CREATE POLICY "Users can insert own lesson progress"
  ON user_lesson_progress FOR INSERT
  WITH CHECK (user_id = (select auth.uid()));

-- ============================================================================
-- 6. PERFORMANCE: Otimizar políticas críticas de quiz_questions
-- ============================================================================
-- NOTA: As políticas de quiz_questions usam lógica complexa que verifica
-- cursos e organizações. Vamos manter a lógica, apenas otimizando auth.uid()
-- Estas políticas serão otimizadas em uma migração futura mais específica
-- ============================================================================

-- ============================================================================
-- 7. PERFORMANCE: Otimizar políticas críticas de question_options
-- ============================================================================
-- NOTA: Similar a quiz_questions, estas políticas têm lógica complexa
-- que será otimizada em uma migração futura mais específica
-- ============================================================================

-- ============================================================================
-- NOTA: Outras políticas podem ser otimizadas posteriormente
-- Focamos nas mais críticas (mais usadas) primeiro
-- ============================================================================

-- ============================================================================
-- FIX: Criar índices para foreign keys sem cobertura
-- ============================================================================
-- 
-- PROBLEMA: Foreign keys sem índices causam lentidão em JOINs
-- SOLUÇÃO: Criar índices nas colunas de foreign keys
-- ============================================================================

-- Índice para courses.created_by
CREATE INDEX IF NOT EXISTS idx_courses_created_by 
  ON courses(created_by);

-- Índice para learning_paths.created_by
CREATE INDEX IF NOT EXISTS idx_learning_paths_created_by 
  ON learning_paths(created_by);

-- Índice para user_answers.selected_option_id
CREATE INDEX IF NOT EXISTS idx_user_answers_selected_option 
  ON user_answers(selected_option_id);

-- Índice para user_path_assignments.assigned_by
CREATE INDEX IF NOT EXISTS idx_user_path_assignments_assigned_by 
  ON user_path_assignments(assigned_by);

-- Índice para user_path_assignments.organization_id
CREATE INDEX IF NOT EXISTS idx_user_path_assignments_organization 
  ON user_path_assignments(organization_id);

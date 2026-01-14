-- ============================================================================
-- FIX: Criar políticas RLS para tabelas críticas do n.training
-- ============================================================================
-- 
-- PROBLEMA: Tabelas com RLS habilitado mas sem políticas = bloqueadas
-- SOLUÇÃO: Criar políticas adequadas para cada tabela
-- ============================================================================

-- ============================================================================
-- LEARNING PATHS
-- ============================================================================
CREATE POLICY "Users can view learning paths"
  ON learning_paths FOR SELECT
  USING (
    -- Superadmin vê tudo
    is_user_superadmin(auth.uid()) OR
    -- Usuário vê paths da sua organização
    (organization_id IS NOT NULL AND organization_id = get_user_organization_id(auth.uid())) OR
    -- Criador vê seus próprios paths
    created_by = auth.uid()
  );

CREATE POLICY "Admins can manage learning paths"
  ON learning_paths FOR INSERT
  WITH CHECK (
    is_user_superadmin(auth.uid()) OR
    (organization_id IS NOT NULL AND organization_id = get_user_organization_id(auth.uid()))
  );

CREATE POLICY "Admins can update learning paths"
  ON learning_paths FOR UPDATE
  USING (
    is_user_superadmin(auth.uid()) OR
    (organization_id IS NOT NULL AND organization_id = get_user_organization_id(auth.uid()))
  )
  WITH CHECK (
    is_user_superadmin(auth.uid()) OR
    (organization_id IS NOT NULL AND organization_id = get_user_organization_id(auth.uid()))
  );

CREATE POLICY "Admins can delete learning paths"
  ON learning_paths FOR DELETE
  USING (
    is_user_superadmin(auth.uid()) OR
    (organization_id IS NOT NULL AND organization_id = get_user_organization_id(auth.uid()))
  );

-- ============================================================================
-- MODULES
-- ============================================================================
CREATE POLICY "Users can view modules"
  ON modules FOR SELECT
  USING (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = modules.course_id
      AND (
        courses.created_by = auth.uid() OR
        is_user_superadmin(auth.uid()) OR
        (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
      )
    )
  );

CREATE POLICY "Admins can manage modules"
  ON modules FOR INSERT
  WITH CHECK (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = modules.course_id
      AND (
        courses.created_by = auth.uid() OR
        (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
      )
    )
  );

CREATE POLICY "Admins can update modules"
  ON modules FOR UPDATE
  USING (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = modules.course_id
      AND (
        courses.created_by = auth.uid() OR
        (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
      )
    )
  )
  WITH CHECK (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = modules.course_id
      AND (
        courses.created_by = auth.uid() OR
        (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
      )
    )
  );

CREATE POLICY "Admins can delete modules"
  ON modules FOR DELETE
  USING (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = modules.course_id
      AND (
        courses.created_by = auth.uid() OR
        (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
      )
    )
  );

-- ============================================================================
-- LESSONS
-- ============================================================================
CREATE POLICY "Users can view lessons"
  ON lessons FOR SELECT
  USING (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM modules
      JOIN courses ON courses.id = modules.course_id
      WHERE modules.id = lessons.module_id
      AND (
        courses.created_by = auth.uid() OR
        is_user_superadmin(auth.uid()) OR
        (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
      )
    )
  );

CREATE POLICY "Admins can manage lessons"
  ON lessons FOR INSERT
  WITH CHECK (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM modules
      JOIN courses ON courses.id = modules.course_id
      WHERE modules.id = lessons.module_id
      AND (
        courses.created_by = auth.uid() OR
        (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
      )
    )
  );

CREATE POLICY "Admins can update lessons"
  ON lessons FOR UPDATE
  USING (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM modules
      JOIN courses ON courses.id = modules.course_id
      WHERE modules.id = lessons.module_id
      AND (
        courses.created_by = auth.uid() OR
        (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
      )
    )
  )
  WITH CHECK (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM modules
      JOIN courses ON courses.id = modules.course_id
      WHERE modules.id = lessons.module_id
      AND (
        courses.created_by = auth.uid() OR
        (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
      )
    )
  );

CREATE POLICY "Admins can delete lessons"
  ON lessons FOR DELETE
  USING (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM modules
      JOIN courses ON courses.id = modules.course_id
      WHERE modules.id = lessons.module_id
      AND (
        courses.created_by = auth.uid() OR
        (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
      )
    )
  );

-- ============================================================================
-- QUIZZES
-- ============================================================================
CREATE POLICY "Users can view quizzes"
  ON quizzes FOR SELECT
  USING (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = quizzes.course_id
      AND (
        courses.created_by = auth.uid() OR
        is_user_superadmin(auth.uid()) OR
        (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
      )
    ) OR
    EXISTS (
      SELECT 1 FROM lessons
      JOIN modules ON modules.id = lessons.module_id
      JOIN courses ON courses.id = modules.course_id
      WHERE lessons.id = quizzes.lesson_id
      AND (
        courses.created_by = auth.uid() OR
        is_user_superadmin(auth.uid()) OR
        (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
      )
    )
  );

CREATE POLICY "Admins can manage quizzes"
  ON quizzes FOR INSERT
  WITH CHECK (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = quizzes.course_id
      AND (
        courses.created_by = auth.uid() OR
        (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
      )
    ) OR
    EXISTS (
      SELECT 1 FROM lessons
      JOIN modules ON modules.id = lessons.module_id
      JOIN courses ON courses.id = modules.course_id
      WHERE lessons.id = quizzes.lesson_id
      AND (
        courses.created_by = auth.uid() OR
        (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
      )
    )
  );

CREATE POLICY "Admins can update quizzes"
  ON quizzes FOR UPDATE
  USING (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = quizzes.course_id
      AND (
        courses.created_by = auth.uid() OR
        (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
      )
    ) OR
    EXISTS (
      SELECT 1 FROM lessons
      JOIN modules ON modules.id = lessons.module_id
      JOIN courses ON courses.id = modules.course_id
      WHERE lessons.id = quizzes.lesson_id
      AND (
        courses.created_by = auth.uid() OR
        (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
      )
    )
  )
  WITH CHECK (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = quizzes.course_id
      AND (
        courses.created_by = auth.uid() OR
        (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
      )
    ) OR
    EXISTS (
      SELECT 1 FROM lessons
      JOIN modules ON modules.id = lessons.module_id
      JOIN courses ON courses.id = modules.course_id
      WHERE lessons.id = quizzes.lesson_id
      AND (
        courses.created_by = auth.uid() OR
        (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
      )
    )
  );

CREATE POLICY "Admins can delete quizzes"
  ON quizzes FOR DELETE
  USING (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = quizzes.course_id
      AND (
        courses.created_by = auth.uid() OR
        (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
      )
    ) OR
    EXISTS (
      SELECT 1 FROM lessons
      JOIN modules ON modules.id = lessons.module_id
      JOIN courses ON courses.id = modules.course_id
      WHERE lessons.id = quizzes.lesson_id
      AND (
        courses.created_by = auth.uid() OR
        (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
      )
    )
  );

-- ============================================================================
-- USER LESSON PROGRESS
-- ============================================================================
CREATE POLICY "Users can view own lesson progress"
  ON user_lesson_progress FOR SELECT
  USING (
    is_user_superadmin(auth.uid()) OR
    user_id = auth.uid()
  );

CREATE POLICY "Users can update own lesson progress"
  ON user_lesson_progress FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can insert own lesson progress"
  ON user_lesson_progress FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- USER PATH ASSIGNMENTS
-- ============================================================================
CREATE POLICY "Users can view own path assignments"
  ON user_path_assignments FOR SELECT
  USING (
    is_user_superadmin(auth.uid()) OR
    user_id = auth.uid() OR
    (organization_id IS NOT NULL AND organization_id = get_user_organization_id(auth.uid()))
  );

CREATE POLICY "Admins can manage path assignments"
  ON user_path_assignments FOR INSERT
  WITH CHECK (
    is_user_superadmin(auth.uid()) OR
    (organization_id IS NOT NULL AND organization_id = get_user_organization_id(auth.uid()))
  );

CREATE POLICY "Admins can update path assignments"
  ON user_path_assignments FOR UPDATE
  USING (
    is_user_superadmin(auth.uid()) OR
    (organization_id IS NOT NULL AND organization_id = get_user_organization_id(auth.uid()))
  )
  WITH CHECK (
    is_user_superadmin(auth.uid()) OR
    (organization_id IS NOT NULL AND organization_id = get_user_organization_id(auth.uid()))
  );

CREATE POLICY "Admins can delete path assignments"
  ON user_path_assignments FOR DELETE
  USING (
    is_user_superadmin(auth.uid()) OR
    (organization_id IS NOT NULL AND organization_id = get_user_organization_id(auth.uid()))
  );

-- ============================================================================
-- USER QUIZ ATTEMPTS
-- ============================================================================
CREATE POLICY "Users can view own quiz attempts"
  ON user_quiz_attempts FOR SELECT
  USING (
    is_user_superadmin(auth.uid()) OR
    user_id = auth.uid()
  );

CREATE POLICY "Users can create own quiz attempts"
  ON user_quiz_attempts FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own quiz attempts"
  ON user_quiz_attempts FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- QUIZ QUESTIONS
-- ============================================================================
CREATE POLICY "Users can view quiz questions"
  ON quiz_questions FOR SELECT
  USING (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = quiz_questions.quiz_id
      AND (
        EXISTS (
          SELECT 1 FROM courses
          WHERE courses.id = quizzes.course_id
          AND (
            courses.created_by = auth.uid() OR
            is_user_superadmin(auth.uid()) OR
            (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
          )
        ) OR
        EXISTS (
          SELECT 1 FROM lessons
          JOIN modules ON modules.id = lessons.module_id
          JOIN courses ON courses.id = modules.course_id
          WHERE lessons.id = quizzes.lesson_id
          AND (
            courses.created_by = auth.uid() OR
            is_user_superadmin(auth.uid()) OR
            (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
          )
        )
      )
    )
  );

CREATE POLICY "Admins can manage quiz questions"
  ON quiz_questions FOR INSERT
  WITH CHECK (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = quiz_questions.quiz_id
      AND (
        EXISTS (
          SELECT 1 FROM courses
          WHERE courses.id = quizzes.course_id
          AND (
            courses.created_by = auth.uid() OR
            (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
          )
        ) OR
        EXISTS (
          SELECT 1 FROM lessons
          JOIN modules ON modules.id = lessons.module_id
          JOIN courses ON courses.id = modules.course_id
          WHERE lessons.id = quizzes.lesson_id
          AND (
            courses.created_by = auth.uid() OR
            (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
          )
        )
      )
    )
  );

CREATE POLICY "Admins can update quiz questions"
  ON quiz_questions FOR UPDATE
  USING (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = quiz_questions.quiz_id
      AND (
        EXISTS (
          SELECT 1 FROM courses
          WHERE courses.id = quizzes.course_id
          AND (
            courses.created_by = auth.uid() OR
            (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
          )
        ) OR
        EXISTS (
          SELECT 1 FROM lessons
          JOIN modules ON modules.id = lessons.module_id
          JOIN courses ON courses.id = modules.course_id
          WHERE lessons.id = quizzes.lesson_id
          AND (
            courses.created_by = auth.uid() OR
            (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
          )
        )
      )
    )
  )
  WITH CHECK (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = quiz_questions.quiz_id
      AND (
        EXISTS (
          SELECT 1 FROM courses
          WHERE courses.id = quizzes.course_id
          AND (
            courses.created_by = auth.uid() OR
            (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
          )
        ) OR
        EXISTS (
          SELECT 1 FROM lessons
          JOIN modules ON modules.id = lessons.module_id
          JOIN courses ON courses.id = modules.course_id
          WHERE lessons.id = quizzes.lesson_id
          AND (
            courses.created_by = auth.uid() OR
            (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
          )
        )
      )
    )
  );

CREATE POLICY "Admins can delete quiz questions"
  ON quiz_questions FOR DELETE
  USING (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = quiz_questions.quiz_id
      AND (
        EXISTS (
          SELECT 1 FROM courses
          WHERE courses.id = quizzes.course_id
          AND (
            courses.created_by = auth.uid() OR
            (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
          )
        ) OR
        EXISTS (
          SELECT 1 FROM lessons
          JOIN modules ON modules.id = lessons.module_id
          JOIN courses ON courses.id = modules.course_id
          WHERE lessons.id = quizzes.lesson_id
          AND (
            courses.created_by = auth.uid() OR
            (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
          )
        )
      )
    )
  );

-- ============================================================================
-- QUESTION OPTIONS
-- ============================================================================
CREATE POLICY "Users can view question options"
  ON question_options FOR SELECT
  USING (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM quiz_questions
      JOIN quizzes ON quizzes.id = quiz_questions.quiz_id
      WHERE quiz_questions.id = question_options.question_id
      AND (
        EXISTS (
          SELECT 1 FROM courses
          WHERE courses.id = quizzes.course_id
          AND (
            courses.created_by = auth.uid() OR
            is_user_superadmin(auth.uid()) OR
            (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
          )
        ) OR
        EXISTS (
          SELECT 1 FROM lessons
          JOIN modules ON modules.id = lessons.module_id
          JOIN courses ON courses.id = modules.course_id
          WHERE lessons.id = quizzes.lesson_id
          AND (
            courses.created_by = auth.uid() OR
            is_user_superadmin(auth.uid()) OR
            (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
          )
        )
      )
    )
  );

CREATE POLICY "Admins can manage question options"
  ON question_options FOR INSERT
  WITH CHECK (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM quiz_questions
      JOIN quizzes ON quizzes.id = quiz_questions.quiz_id
      WHERE quiz_questions.id = question_options.question_id
      AND (
        EXISTS (
          SELECT 1 FROM courses
          WHERE courses.id = quizzes.course_id
          AND (
            courses.created_by = auth.uid() OR
            (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
          )
        ) OR
        EXISTS (
          SELECT 1 FROM lessons
          JOIN modules ON modules.id = lessons.module_id
          JOIN courses ON courses.id = modules.course_id
          WHERE lessons.id = quizzes.lesson_id
          AND (
            courses.created_by = auth.uid() OR
            (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
          )
        )
      )
    )
  );

CREATE POLICY "Admins can update question options"
  ON question_options FOR UPDATE
  USING (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM quiz_questions
      JOIN quizzes ON quizzes.id = quiz_questions.quiz_id
      WHERE quiz_questions.id = question_options.question_id
      AND (
        EXISTS (
          SELECT 1 FROM courses
          WHERE courses.id = quizzes.course_id
          AND (
            courses.created_by = auth.uid() OR
            (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
          )
        ) OR
        EXISTS (
          SELECT 1 FROM lessons
          JOIN modules ON modules.id = lessons.module_id
          JOIN courses ON courses.id = modules.course_id
          WHERE lessons.id = quizzes.lesson_id
          AND (
            courses.created_by = auth.uid() OR
            (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
          )
        )
      )
    )
  )
  WITH CHECK (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM quiz_questions
      JOIN quizzes ON quizzes.id = quiz_questions.quiz_id
      WHERE quiz_questions.id = question_options.question_id
      AND (
        EXISTS (
          SELECT 1 FROM courses
          WHERE courses.id = quizzes.course_id
          AND (
            courses.created_by = auth.uid() OR
            (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
          )
        ) OR
        EXISTS (
          SELECT 1 FROM lessons
          JOIN modules ON modules.id = lessons.module_id
          JOIN courses ON courses.id = modules.course_id
          WHERE lessons.id = quizzes.lesson_id
          AND (
            courses.created_by = auth.uid() OR
            (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
          )
        )
      )
    )
  );

CREATE POLICY "Admins can delete question options"
  ON question_options FOR DELETE
  USING (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM quiz_questions
      JOIN quizzes ON quizzes.id = quiz_questions.quiz_id
      WHERE quiz_questions.id = question_options.question_id
      AND (
        EXISTS (
          SELECT 1 FROM courses
          WHERE courses.id = quizzes.course_id
          AND (
            courses.created_by = auth.uid() OR
            (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
          )
        ) OR
        EXISTS (
          SELECT 1 FROM lessons
          JOIN modules ON modules.id = lessons.module_id
          JOIN courses ON courses.id = modules.course_id
          WHERE lessons.id = quizzes.lesson_id
          AND (
            courses.created_by = auth.uid() OR
            (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
          )
        )
      )
    )
  );

-- ============================================================================
-- USER ANSWERS
-- ============================================================================
CREATE POLICY "Users can view own answers"
  ON user_answers FOR SELECT
  USING (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM user_quiz_attempts
      WHERE user_quiz_attempts.id = user_answers.attempt_id
      AND user_quiz_attempts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own answers"
  ON user_answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_quiz_attempts
      WHERE user_quiz_attempts.id = user_answers.attempt_id
      AND user_quiz_attempts.user_id = auth.uid()
    )
  );

-- ============================================================================
-- LESSON MATERIALS
-- ============================================================================
CREATE POLICY "Users can view lesson materials"
  ON lesson_materials FOR SELECT
  USING (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM lessons
      JOIN modules ON modules.id = lessons.module_id
      JOIN courses ON courses.id = modules.course_id
      WHERE lessons.id = lesson_materials.lesson_id
      AND (
        courses.created_by = auth.uid() OR
        is_user_superadmin(auth.uid()) OR
        (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
      )
    )
  );

CREATE POLICY "Admins can manage lesson materials"
  ON lesson_materials FOR INSERT
  WITH CHECK (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM lessons
      JOIN modules ON modules.id = lessons.module_id
      JOIN courses ON courses.id = modules.course_id
      WHERE lessons.id = lesson_materials.lesson_id
      AND (
        courses.created_by = auth.uid() OR
        (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
      )
    )
  );

CREATE POLICY "Admins can update lesson materials"
  ON lesson_materials FOR UPDATE
  USING (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM lessons
      JOIN modules ON modules.id = lessons.module_id
      JOIN courses ON courses.id = modules.course_id
      WHERE lessons.id = lesson_materials.lesson_id
      AND (
        courses.created_by = auth.uid() OR
        (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
      )
    )
  )
  WITH CHECK (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM lessons
      JOIN modules ON modules.id = lessons.module_id
      JOIN courses ON courses.id = modules.course_id
      WHERE lessons.id = lesson_materials.lesson_id
      AND (
        courses.created_by = auth.uid() OR
        (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
      )
    )
  );

CREATE POLICY "Admins can delete lesson materials"
  ON lesson_materials FOR DELETE
  USING (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM lessons
      JOIN modules ON modules.id = lessons.module_id
      JOIN courses ON courses.id = modules.course_id
      WHERE lessons.id = lesson_materials.lesson_id
      AND (
        courses.created_by = auth.uid() OR
        (courses.organization_id IS NOT NULL AND courses.organization_id = get_user_organization_id(auth.uid()))
      )
    )
  );

-- ============================================================================
-- PATH COURSES
-- ============================================================================
CREATE POLICY "Users can view path courses"
  ON path_courses FOR SELECT
  USING (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM learning_paths
      WHERE learning_paths.id = path_courses.path_id
      AND (
        is_user_superadmin(auth.uid()) OR
        (learning_paths.organization_id IS NOT NULL AND learning_paths.organization_id = get_user_organization_id(auth.uid())) OR
        learning_paths.created_by = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can manage path courses"
  ON path_courses FOR INSERT
  WITH CHECK (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM learning_paths
      WHERE learning_paths.id = path_courses.path_id
      AND (
        (learning_paths.organization_id IS NOT NULL AND learning_paths.organization_id = get_user_organization_id(auth.uid())) OR
        learning_paths.created_by = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can update path courses"
  ON path_courses FOR UPDATE
  USING (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM learning_paths
      WHERE learning_paths.id = path_courses.path_id
      AND (
        (learning_paths.organization_id IS NOT NULL AND learning_paths.organization_id = get_user_organization_id(auth.uid())) OR
        learning_paths.created_by = auth.uid()
      )
    )
  )
  WITH CHECK (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM learning_paths
      WHERE learning_paths.id = path_courses.path_id
      AND (
        (learning_paths.organization_id IS NOT NULL AND learning_paths.organization_id = get_user_organization_id(auth.uid())) OR
        learning_paths.created_by = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can delete path courses"
  ON path_courses FOR DELETE
  USING (
    is_user_superadmin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM learning_paths
      WHERE learning_paths.id = path_courses.path_id
      AND (
        (learning_paths.organization_id IS NOT NULL AND learning_paths.organization_id = get_user_organization_id(auth.uid())) OR
        learning_paths.created_by = auth.uid()
      )
    )
  );

-- ============================================================================
-- USER NOTES
-- ============================================================================
CREATE POLICY "Users can view own notes"
  ON user_notes FOR SELECT
  USING (
    is_user_superadmin(auth.uid()) OR
    user_id = auth.uid()
  );

CREATE POLICY "Users can manage own notes"
  ON user_notes FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own notes"
  ON user_notes FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own notes"
  ON user_notes FOR DELETE
  USING (user_id = auth.uid());

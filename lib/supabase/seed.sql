-- ============================================================================
-- nTraining Platform - Seed Data
-- Sample data for development and testing
-- ============================================================================

-- Insert demo organization
INSERT INTO organizations (id, name, slug, industry, employee_count, max_users, settings)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'ness Security', 'ness', 'Cybersecurity', 150, 200, '{"theme": "dark", "language": "pt-BR"}'),
  ('00000000-0000-0000-0000-000000000002', 'Acme Corporation', 'acme', 'Technology', 500, 100, '{"theme": "light", "language": "en-US"}');

-- Note: Users must be created via Supabase Auth first, then we can link them
-- This is a placeholder showing the structure
-- After creating users via auth.users, run:
-- UPDATE users SET role = 'platform_admin', organization_id = '00000000-0000-0000-0000-000000000001' WHERE email = 'admin@ness.com.br';

-- Insert sample courses
INSERT INTO courses (id, title, slug, description, objectives, duration_hours, level, area, status, created_by, is_public)
VALUES 
  (
    '10000000-0000-0000-0000-000000000001',
    'Fundamentos de Segurança da Informação',
    'fundamentos-seguranca-informacao',
    'Curso introdutório sobre os conceitos fundamentais de segurança da informação, abordando confidencialidade, integridade e disponibilidade.',
    'Compreender os pilares da segurança da informação; Identificar principais ameaças e vulnerabilidades; Aplicar boas práticas de segurança no dia a dia.',
    8.0,
    'beginner',
    'Segurança da Informação',
    'published',
    NULL,
    true
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'LGPD para Empresas',
    'lgpd-empresas',
    'Entenda a Lei Geral de Proteção de Dados e suas implicações para o ambiente corporativo.',
    'Conhecer os princípios da LGPD; Identificar dados pessoais e sensíveis; Implementar práticas de conformidade.',
    6.0,
    'intermediate',
    'Compliance',
    'published',
    NULL,
    true
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    'Phishing e Engenharia Social',
    'phishing-engenharia-social',
    'Aprenda a identificar e se proteger contra ataques de phishing e técnicas de engenharia social.',
    'Reconhecer tentativas de phishing; Entender táticas de engenharia social; Proteger informações confidenciais.',
    4.0,
    'beginner',
    'Segurança da Informação',
    'published',
    NULL,
    true
  );

-- Insert modules for "Fundamentos de Segurança da Informação"
INSERT INTO modules (id, course_id, title, description, order_index)
VALUES 
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Introdução à Segurança da Informação', 'Conceitos básicos e importância da segurança da informação', 1),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Ameaças e Vulnerabilidades', 'Principais tipos de ameaças e como identificá-las', 2),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Boas Práticas de Segurança', 'Práticas recomendadas para proteção de dados', 3);

-- Insert lessons for Module 1
INSERT INTO lessons (id, module_id, title, content_type, content_text, duration_minutes, order_index)
VALUES 
  (
    '30000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'O que é Segurança da Informação?',
    'text',
    '# O que é Segurança da Informação?\n\nSegurança da Informação é a prática de proteger informações contra acesso não autorizado, uso, divulgação, interrupção, modificação ou destruição.\n\n## Os Três Pilares (CIA Triad)\n\n### Confidencialidade\nGarantir que a informação seja acessível apenas para pessoas autorizadas.\n\n### Integridade\nAssegurar que a informação não seja alterada de forma não autorizada.\n\n### Disponibilidade\nGarantir que a informação esteja disponível quando necessário.',
    15,
    1
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000001',
    'Por que a Segurança é Importante?',
    'text',
    '# Por que a Segurança da Informação é Importante?\n\nNo mundo digital atual, dados são um dos ativos mais valiosos de uma organização.\n\n## Riscos de Não Proteger Informações\n\n- **Perda Financeira**: Vazamentos podem custar milhões\n- **Danos à Reputação**: Confiança do cliente é difícil de recuperar\n- **Penalidades Legais**: LGPD e outras regulamentações impõem multas pesadas\n- **Interrupção de Negócios**: Ataques podem paralisar operações',
    20,
    2
  );

-- Insert quiz for Module 1
INSERT INTO quizzes (id, course_id, title, description, passing_score, max_attempts)
VALUES 
  (
    '40000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'Avaliação: Fundamentos de Segurança',
    'Teste seus conhecimentos sobre os conceitos básicos de segurança da informação',
    70,
    3
  );

-- Insert quiz questions
INSERT INTO quiz_questions (id, quiz_id, question_text, question_type, points, explanation, order_index)
VALUES 
  (
    '50000000-0000-0000-0000-000000000001',
    '40000000-0000-0000-0000-000000000001',
    'Quais são os três pilares da segurança da informação (CIA Triad)?',
    'multiple_choice',
    1,
    'Os três pilares são Confidencialidade, Integridade e Disponibilidade.',
    1
  ),
  (
    '50000000-0000-0000-0000-000000000002',
    '40000000-0000-0000-0000-000000000001',
    'A confidencialidade garante que apenas pessoas autorizadas tenham acesso à informação.',
    'true_false',
    1,
    'Verdadeiro. Confidencialidade é sobre controlar quem pode acessar a informação.',
    2
  ),
  (
    '50000000-0000-0000-0000-000000000003',
    '40000000-0000-0000-0000-000000000001',
    'Qual das seguintes NÃO é uma consequência de falhas de segurança?',
    'multiple_choice',
    1,
    'Aumento de produtividade não é uma consequência de falhas de segurança.',
    3
  );

-- Insert question options
INSERT INTO question_options (question_id, option_text, is_correct, order_index)
VALUES 
  -- Question 1 options
  ('50000000-0000-0000-0000-000000000001', 'Confidencialidade, Integridade, Disponibilidade', true, 1),
  ('50000000-0000-0000-0000-000000000001', 'Criptografia, Autenticação, Autorização', false, 2),
  ('50000000-0000-0000-0000-000000000001', 'Firewall, Antivírus, Backup', false, 3),
  ('50000000-0000-0000-0000-000000000001', 'Segurança, Privacidade, Compliance', false, 4),
  
  -- Question 2 options (true/false)
  ('50000000-0000-0000-0000-000000000002', 'Verdadeiro', true, 1),
  ('50000000-0000-0000-0000-000000000002', 'Falso', false, 2),
  
  -- Question 3 options
  ('50000000-0000-0000-0000-000000000003', 'Perda financeira', false, 1),
  ('50000000-0000-0000-0000-000000000003', 'Danos à reputação', false, 2),
  ('50000000-0000-0000-0000-000000000003', 'Aumento de produtividade', true, 3),
  ('50000000-0000-0000-0000-000000000003', 'Penalidades legais', false, 4);

-- Insert learning path
INSERT INTO learning_paths (id, title, slug, description, estimated_duration_hours, is_mandatory, organization_id)
VALUES 
  (
    '60000000-0000-0000-0000-000000000001',
    'Trilha de Onboarding em Segurança',
    'onboarding-seguranca',
    'Trilha obrigatória para todos os novos colaboradores, cobrindo fundamentos de segurança da informação e proteção de dados.',
    18.0,
    true,
    '00000000-0000-0000-0000-000000000001'
  );

-- Link courses to learning path
INSERT INTO path_courses (path_id, course_id, order_index, is_required)
VALUES 
  ('60000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 1, true),
  ('60000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 2, true),
  ('60000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 3, true);

-- ============================================================================
-- FUNCTIONS FOR TESTING
-- ============================================================================

-- Function to calculate course completion percentage
CREATE OR REPLACE FUNCTION calculate_course_completion(p_user_id UUID, p_course_id UUID)
RETURNS INTEGER AS $$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
  completion_pct INTEGER;
BEGIN
  -- Count total required lessons in course
  SELECT COUNT(*)
  INTO total_lessons
  FROM lessons l
  JOIN modules m ON l.module_id = m.id
  WHERE m.course_id = p_course_id AND l.is_required = true;
  
  -- Count completed lessons
  SELECT COUNT(*)
  INTO completed_lessons
  FROM user_lesson_progress ulp
  JOIN lessons l ON ulp.lesson_id = l.id
  JOIN modules m ON l.module_id = m.id
  WHERE m.course_id = p_course_id 
    AND ulp.user_id = p_user_id 
    AND ulp.is_completed = true
    AND l.is_required = true;
  
  -- Calculate percentage
  IF total_lessons > 0 THEN
    completion_pct := (completed_lessons * 100) / total_lessons;
  ELSE
    completion_pct := 0;
  END IF;
  
  RETURN completion_pct;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user passed quiz
CREATE OR REPLACE FUNCTION check_quiz_passed(p_attempt_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  attempt_percentage INTEGER;
  required_percentage INTEGER;
  passed BOOLEAN;
BEGIN
  SELECT uqa.percentage, q.passing_score
  INTO attempt_percentage, required_percentage
  FROM user_quiz_attempts uqa
  JOIN quizzes q ON uqa.quiz_id = q.id
  WHERE uqa.id = p_attempt_id;
  
  passed := attempt_percentage >= required_percentage;
  
  RETURN passed;
END;
$$ LANGUAGE plpgsql;

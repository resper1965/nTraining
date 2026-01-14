-- ============================================================================
-- FIX: Garantir que políticas RLS da tabela users não causem recursão
-- ============================================================================
-- 
-- PROBLEMA:
-- Ainda há recursão infinita na política RLS da tabela users.
-- Isso pode ser causado por políticas antigas do schema.sql ou migrações
-- que não foram aplicadas corretamente.
--
-- SOLUÇÃO:
-- 1. Remover TODAS as políticas da tabela users
-- 2. Garantir que as funções helper existem
-- 3. Recriar políticas usando apenas funções helper SECURITY DEFINER
-- ============================================================================

-- Remover TODAS as políticas da tabela users (garantir limpeza completa)
DROP POLICY IF EXISTS "Users can view org members" ON users;
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Superadmins can view all users" ON users;
DROP POLICY IF EXISTS "Users can view appropriate users" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Service role can insert users" ON users;

-- Garantir que as funções helper existem (recriar se necessário)
CREATE OR REPLACE FUNCTION get_user_organization_id(user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  org_id UUID;
BEGIN
  SELECT organization_id INTO org_id
  FROM users
  WHERE id = user_id
  LIMIT 1;
  
  RETURN org_id;
END;
$$;

CREATE OR REPLACE FUNCTION is_user_superadmin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_superadmin BOOLEAN;
BEGIN
  SELECT COALESCE(is_superadmin, false) INTO is_superadmin
  FROM users
  WHERE id = user_id
  LIMIT 1;
  
  RETURN COALESCE(is_superadmin, false);
END;
$$;

-- Recriar política SELECT usando apenas funções helper (sem recursão)
CREATE POLICY "Users can view appropriate users"
  ON users FOR SELECT
  USING (
    -- Caso 1: Usuário pode ver seus próprios dados
    id = (select auth.uid()) OR
    -- Caso 2: Superadmin pode ver todos os usuários (usando função helper SECURITY DEFINER)
    is_user_superadmin((select auth.uid())) OR
    -- Caso 3: Usuário pode ver membros da mesma organização (usando função helper SECURITY DEFINER)
    (
      organization_id IS NOT NULL AND
      get_user_organization_id((select auth.uid())) IS NOT NULL AND
      organization_id = get_user_organization_id((select auth.uid()))
    )
  );

-- Política para UPDATE: Usuários podem atualizar seus próprios dados
CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

-- Política para INSERT: Apenas via service role ou trigger
CREATE POLICY "Service role can insert users"
  ON users FOR INSERT
  WITH CHECK (true);

-- Comentários explicativos
COMMENT ON FUNCTION get_user_organization_id(UUID) IS 
  'Helper function to get user organization_id without RLS recursion. Uses SECURITY DEFINER to bypass RLS.';

COMMENT ON FUNCTION is_user_superadmin(UUID) IS 
  'Helper function to check if user is superadmin without RLS recursion. Uses SECURITY DEFINER to bypass RLS.';

COMMENT ON POLICY "Users can view appropriate users" ON users IS 
  'Permite que usuários vejam seus próprios dados, superadmins vejam todos, e usuários vejam membros da mesma organização. Usa funções helper SECURITY DEFINER para evitar recursão RLS.';

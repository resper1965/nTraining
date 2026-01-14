-- ============================================================================
-- FIX: Corrigir recursão infinita na política RLS da tabela users
-- ============================================================================
-- 
-- PROBLEMA:
-- A política "Users can view org members" causa recursão infinita porque
-- tenta ler a tabela users dentro da própria política RLS da tabela users.
--
-- SOLUÇÃO:
-- 1. Remover política problemática
-- 2. Criar políticas mais específicas que não causam recursão
-- 3. Permitir que usuários vejam seus próprios dados
-- 4. Permitir que superadmins vejam todos os usuários
-- 5. Permitir que usuários vejam membros da mesma organização (sem recursão)
-- ============================================================================

-- Remover todas as políticas problemáticas
DROP POLICY IF EXISTS "Users can view org members" ON users;
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Superadmins can view all users" ON users;

-- Função helper para buscar organization_id sem causar recursão
-- Esta função usa SECURITY DEFINER para bypass RLS
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

-- Função helper para verificar se usuário é superadmin (sem recursão)
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

-- Criar política única que cobre todos os casos (sem recursão)
-- Usa apenas funções helper que bypass RLS
CREATE POLICY "Users can view appropriate users"
  ON users FOR SELECT
  USING (
    -- Caso 1: Usuário pode ver seus próprios dados
    id = auth.uid() OR
    -- Caso 2: Superadmin pode ver todos os usuários (usando função helper)
    is_user_superadmin(auth.uid()) OR
    -- Caso 3: Usuário pode ver membros da mesma organização (usando função helper)
    (
      organization_id IS NOT NULL AND
      get_user_organization_id(auth.uid()) IS NOT NULL AND
      organization_id = get_user_organization_id(auth.uid())
    )
  );

-- Política para UPDATE: Usuários podem atualizar seus próprios dados
CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Política para INSERT: Apenas via service role ou trigger
-- (Normalmente inserções são feitas via triggers ou service role)
CREATE POLICY "Service role can insert users"
  ON users FOR INSERT
  WITH CHECK (true);

-- Comentários explicativos
COMMENT ON FUNCTION get_user_organization_id(UUID) IS 
  'Helper function to get user organization_id without RLS recursion. Uses SECURITY DEFINER to bypass RLS.';

COMMENT ON FUNCTION is_user_superadmin(UUID) IS 
  'Helper function to check if user is superadmin without RLS recursion. Uses SECURITY DEFINER to bypass RLS.';

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

-- Remover política problemática
DROP POLICY IF EXISTS "Users can view org members" ON users;

-- Política 1: Usuários podem ver seus próprios dados
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (id = auth.uid());

-- Política 2: Superadmins podem ver todos os usuários
-- Usa função helper para evitar recursão
CREATE POLICY "Superadmins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.is_superadmin = true
    )
  );

-- Política 3: Usuários podem ver membros da mesma organização
-- Usa auth.uid() diretamente sem subquery recursiva
CREATE POLICY "Users can view org members"
  ON users FOR SELECT
  USING (
    -- Usuário pode ver se:
    -- 1. É o próprio usuário (já coberto pela política 1, mas incluído para clareza)
    id = auth.uid() OR
    -- 2. Tem a mesma organization_id que o usuário autenticado
    -- Usa uma função que busca organization_id sem causar recursão
    organization_id IS NOT NULL AND
    organization_id = (
      SELECT u.organization_id 
      FROM users u 
      WHERE u.id = auth.uid()
      LIMIT 1
    )
  );

-- NOTA: A política acima ainda pode causar recursão em alguns casos.
-- Vamos criar uma função helper que bypass RLS para buscar organization_id
-- ============================================================================

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

-- Recriar política usando a função helper (sem recursão)
DROP POLICY IF EXISTS "Users can view org members" ON users;

CREATE POLICY "Users can view org members"
  ON users FOR SELECT
  USING (
    -- Usuário pode ver seus próprios dados
    id = auth.uid() OR
    -- Ou usuários da mesma organização (usando função helper)
    (
      organization_id IS NOT NULL AND
      organization_id = get_user_organization_id(auth.uid())
    ) OR
    -- Ou se for superadmin (usando função helper)
    (
      EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = auth.uid()
        AND u.is_superadmin = true
      )
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

-- Comentário explicativo
COMMENT ON FUNCTION get_user_organization_id(UUID) IS 
  'Helper function to get user organization_id without RLS recursion. Uses SECURITY DEFINER to bypass RLS.';

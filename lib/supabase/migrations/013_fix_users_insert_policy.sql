-- ============================================================================
-- FIX: Corrigir política RLS para permitir inserção de usuários
-- ============================================================================
-- 
-- PROBLEMA:
-- A política RLS para INSERT na tabela users pode estar bloqueando
-- a criação de novos usuários, mesmo quando usando service role.
--
-- SOLUÇÃO:
-- 1. Remover política de INSERT existente (se houver problema)
-- 2. Criar política permissiva que permite inserção via service role
-- 3. Garantir que inserções funcionam tanto via service role quanto via triggers
-- ============================================================================

-- Remover política de INSERT existente (se houver problema)
DROP POLICY IF EXISTS "Service role can insert users" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Allow user insert" ON users;

-- Criar política permissiva para INSERT
-- Esta política permite inserção quando:
-- 1. Usando service role (auth.role() = 'service_role')
-- 2. Ou quando o ID corresponde ao usuário autenticado (para triggers)
CREATE POLICY "Allow user insert"
  ON users FOR INSERT
  WITH CHECK (
    -- Service role pode inserir qualquer usuário
    auth.role() = 'service_role' OR
    -- Usuário autenticado pode inserir seu próprio perfil (para triggers)
    id = auth.uid() OR
    -- Permitir inserção quando não há usuário autenticado (signup público)
    auth.uid() IS NULL
  );

-- Comentário explicativo
COMMENT ON POLICY "Allow user insert" ON users IS 
  'Permite inserção de usuários via service role, triggers, ou durante signup público. Política permissiva para garantir que criação de usuários funcione.';

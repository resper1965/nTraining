-- ============================================================================
-- FIX: Corrigir recursão infinita indireta na política RLS da tabela organizations
-- ============================================================================
-- 
-- PROBLEMA:
-- A política "Users can view their organization" causa recursão indireta porque
-- chama get_user_organization_id(auth.uid()) que lê a tabela users, que por sua
-- vez pode tentar ler organizations, criando um ciclo.
--
-- SOLUÇÃO:
-- Usar as funções helper SECURITY DEFINER que já foram criadas na migração 003
-- para evitar a recursão.
-- ============================================================================

-- Remover política problemática
DROP POLICY IF EXISTS "Users can view their organization" ON organizations;

-- Recriar política usando funções helper (já criadas na migração 003)
-- Essas funções usam SECURITY DEFINER para bypass RLS e evitar recursão
CREATE POLICY "Users can view their organization"
  ON organizations FOR SELECT
  USING (
    -- Superadmin pode ver todas as organizações
    is_user_superadmin(auth.uid()) OR
    -- Usuário pode ver sua própria organização
    id = get_user_organization_id(auth.uid())
  );

-- Comentário explicativo
COMMENT ON POLICY "Users can view their organization" ON organizations IS 
  'Permite que usuários vejam sua própria organização. Usa funções helper SECURITY DEFINER para evitar recursão RLS.';

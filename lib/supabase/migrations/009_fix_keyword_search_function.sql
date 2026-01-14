-- ============================================================================
-- FIX: Corrigir função keyword_search (remover e recriar)
-- ============================================================================

-- Remover função antiga
DROP FUNCTION IF EXISTS keyword_search(text, integer);

-- Recriar função com SET search_path
CREATE OR REPLACE FUNCTION keyword_search(search_query text, match_count integer DEFAULT 10)
RETURNS TABLE(id uuid, title text, content text, similarity double precision)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    requisitos_framework.id,
    requisitos_framework.titulo,
    requisitos_framework.descricao,
    1.0::double precision as similarity
  FROM requisitos_framework
  WHERE
    requisitos_framework.titulo ILIKE '%' || search_query || '%' OR
    requisitos_framework.descricao ILIKE '%' || search_query || '%' OR
    requisitos_framework.codigo ILIKE '%' || search_query || '%'
  LIMIT match_count;
END;
$$;

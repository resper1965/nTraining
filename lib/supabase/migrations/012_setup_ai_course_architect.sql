-- ============================================================================
-- AI Course Architect: Configuração de RAG (Retrieval-Augmented Generation)
-- ============================================================================
-- 
-- OBJETIVO:
-- Configurar infraestrutura de Vector Database para permitir que administradores
-- façam upload de documentos técnicos (PDFs) e utilizem como referência para
-- gerar estruturas completas de cursos automaticamente via IA.
--
-- STACK:
-- - Vector DB: Supabase pgvector (extensão vector)
-- - Embeddings: OpenAI text-embedding-3-small (1536 dimensões)
-- - Índices: HNSW para busca por similaridade de cosseno
-- ============================================================================

-- ============================================================================
-- 1. HABILITAR EXTENSÃO VECTOR
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================================
-- 2. TABELA: knowledge_sources (Documentos Fonte)
-- ============================================================================
-- Armazena metadados dos documentos PDFs enviados pelos administradores

CREATE TABLE IF NOT EXISTS knowledge_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  filename VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL, -- URL do arquivo no Supabase Storage
  file_size BIGINT, -- Tamanho em bytes
  mime_type VARCHAR(100) DEFAULT 'application/pdf',
  status VARCHAR(50) DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  error_message TEXT,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT knowledge_sources_title_not_empty CHECK (LENGTH(TRIM(title)) > 0),
  CONSTRAINT knowledge_sources_filename_not_empty CHECK (LENGTH(TRIM(filename)) > 0)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_knowledge_sources_organization_id 
  ON knowledge_sources(organization_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_sources_created_by 
  ON knowledge_sources(created_by);
CREATE INDEX IF NOT EXISTS idx_knowledge_sources_status 
  ON knowledge_sources(status);
CREATE INDEX IF NOT EXISTS idx_knowledge_sources_created_at 
  ON knowledge_sources(created_at DESC);

-- ============================================================================
-- 3. TABELA: knowledge_vectors (Chunks com Embeddings)
-- ============================================================================
-- Armazena chunks de texto extraídos dos PDFs com seus embeddings vetoriais

CREATE TABLE IF NOT EXISTS knowledge_vectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES knowledge_sources(id) ON DELETE CASCADE,
  content_chunk TEXT NOT NULL, -- Chunk de texto (~1000 tokens)
  chunk_index INTEGER NOT NULL, -- Ordem do chunk no documento
  token_count INTEGER, -- Número aproximado de tokens
  embedding vector(1536) NOT NULL, -- Embedding do OpenAI text-embedding-3-small
  metadata JSONB DEFAULT '{}', -- Metadados adicionais (página, seção, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT knowledge_vectors_content_not_empty CHECK (LENGTH(TRIM(content_chunk)) > 0),
  CONSTRAINT knowledge_vectors_chunk_index_positive CHECK (chunk_index >= 0)
);

-- Índice HNSW para busca por similaridade (performance crítica)
-- HNSW é mais eficiente que IVFFlat para buscas de similaridade
CREATE INDEX IF NOT EXISTS idx_knowledge_vectors_embedding_hnsw 
  ON knowledge_vectors 
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- Índices adicionais para queries relacionais
CREATE INDEX IF NOT EXISTS idx_knowledge_vectors_source_id 
  ON knowledge_vectors(source_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_vectors_chunk_index 
  ON knowledge_vectors(source_id, chunk_index);

-- ============================================================================
-- 4. FUNÇÃO RPC: match_documents (Busca por Similaridade)
-- ============================================================================
-- Busca documentos similares usando similaridade de cosseno
-- Retorna os chunks mais relevantes para um dado embedding de query

CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(1536),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 10,
  source_ids UUID[] DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  source_id UUID,
  content_chunk TEXT,
  chunk_index INTEGER,
  similarity FLOAT,
  metadata JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kv.id,
    kv.source_id,
    kv.content_chunk,
    kv.chunk_index,
    1 - (kv.embedding <=> query_embedding) AS similarity, -- Cosseno: 1 - distância
    kv.metadata
  FROM knowledge_vectors kv
  WHERE 
    -- Filtro por similaridade (cosseno >= threshold)
    1 - (kv.embedding <=> query_embedding) >= match_threshold
    -- Filtro opcional por source_ids
    AND (source_ids IS NULL OR kv.source_id = ANY(source_ids))
  ORDER BY kv.embedding <=> query_embedding -- Ordenar por distância (menor = mais similar)
  LIMIT match_count;
END;
$$;

-- Comentário explicativo
COMMENT ON FUNCTION match_documents IS 
  'Busca chunks de conhecimento por similaridade de cosseno. Retorna os N chunks mais relevantes para um embedding de query.';

-- ============================================================================
-- 5. POLÍTICAS RLS (Row Level Security)
-- ============================================================================
-- Garantir que apenas platform_admin e org_manager possam gerenciar KB

-- Habilitar RLS
ALTER TABLE knowledge_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_vectors ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- POLÍTICAS: knowledge_sources
-- ============================================================================

-- SELECT: Admins e org_managers podem ver sources da sua organização (ou todas se superadmin)
DROP POLICY IF EXISTS "Admins can view knowledge sources" ON knowledge_sources;
CREATE POLICY "Admins can view knowledge sources"
  ON knowledge_sources
  FOR SELECT
  USING (
    -- Superadmins veem tudo
    (SELECT is_superadmin FROM users WHERE id = (SELECT auth.uid())) = true
    OR
    -- Org managers veem apenas da sua organização
    (
      (SELECT role FROM users WHERE id = (SELECT auth.uid())) IN ('platform_admin', 'org_manager')
      AND organization_id = (SELECT organization_id FROM users WHERE id = (SELECT auth.uid()))
    )
  );

-- INSERT: Apenas admins e org_managers podem criar sources
DROP POLICY IF EXISTS "Admins can create knowledge sources" ON knowledge_sources;
CREATE POLICY "Admins can create knowledge sources"
  ON knowledge_sources
  FOR INSERT
  WITH CHECK (
    (SELECT role FROM users WHERE id = (SELECT auth.uid())) IN ('platform_admin', 'org_manager')
    AND (
      -- Superadmins podem criar para qualquer org
      (SELECT is_superadmin FROM users WHERE id = (SELECT auth.uid())) = true
      OR
      -- Org managers apenas para sua org
      organization_id = (SELECT organization_id FROM users WHERE id = (SELECT auth.uid()))
    )
    AND created_by = (SELECT auth.uid())
  );

-- UPDATE: Apenas quem criou ou superadmin pode atualizar
DROP POLICY IF EXISTS "Admins can update knowledge sources" ON knowledge_sources;
CREATE POLICY "Admins can update knowledge sources"
  ON knowledge_sources
  FOR UPDATE
  USING (
    (SELECT role FROM users WHERE id = (SELECT auth.uid())) IN ('platform_admin', 'org_manager')
    AND (
      (SELECT is_superadmin FROM users WHERE id = (SELECT auth.uid())) = true
      OR created_by = (SELECT auth.uid())
    )
  );

-- DELETE: Apenas quem criou ou superadmin pode deletar
DROP POLICY IF EXISTS "Admins can delete knowledge sources" ON knowledge_sources;
CREATE POLICY "Admins can delete knowledge sources"
  ON knowledge_sources
  FOR DELETE
  USING (
    (SELECT role FROM users WHERE id = (SELECT auth.uid())) IN ('platform_admin', 'org_manager')
    AND (
      (SELECT is_superadmin FROM users WHERE id = (SELECT auth.uid())) = true
      OR created_by = (SELECT auth.uid())
    )
  );

-- ============================================================================
-- POLÍTICAS: knowledge_vectors
-- ============================================================================

-- SELECT: Mesmas regras de knowledge_sources (herda acesso via source_id)
DROP POLICY IF EXISTS "Admins can view knowledge vectors" ON knowledge_vectors;
CREATE POLICY "Admins can view knowledge vectors"
  ON knowledge_vectors
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM knowledge_sources ks
      WHERE ks.id = knowledge_vectors.source_id
      AND (
        (SELECT is_superadmin FROM users WHERE id = (SELECT auth.uid())) = true
        OR
        (
          (SELECT role FROM users WHERE id = (SELECT auth.uid())) IN ('platform_admin', 'org_manager')
          AND ks.organization_id = (SELECT organization_id FROM users WHERE id = (SELECT auth.uid()))
        )
      )
    )
  );

-- INSERT: Apenas via service role (processamento automático)
-- Não permitir INSERT direto via RLS (usar service role)

-- UPDATE: Não permitir UPDATE (chunks são imutáveis)

-- DELETE: Apenas se puder deletar o source
DROP POLICY IF EXISTS "Admins can delete knowledge vectors" ON knowledge_vectors;
CREATE POLICY "Admins can delete knowledge vectors"
  ON knowledge_vectors
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM knowledge_sources ks
      WHERE ks.id = knowledge_vectors.source_id
      AND (
        (SELECT is_superadmin FROM users WHERE id = (SELECT auth.uid())) = true
        OR ks.created_by = (SELECT auth.uid())
      )
    )
  );

-- ============================================================================
-- 6. TRIGGERS: Atualização automática de updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_knowledge_sources_updated_at ON knowledge_sources;
CREATE TRIGGER update_knowledge_sources_updated_at
  BEFORE UPDATE ON knowledge_sources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 7. COMENTÁRIOS DOCUMENTAIS
-- ============================================================================

COMMENT ON TABLE knowledge_sources IS 
  'Armazena metadados de documentos PDFs enviados pelos administradores para a Base de Conhecimento (KB).';

COMMENT ON TABLE knowledge_vectors IS 
  'Armazena chunks de texto extraídos dos PDFs com seus embeddings vetoriais (1536 dimensões) para busca por similaridade.';

COMMENT ON COLUMN knowledge_vectors.embedding IS 
  'Embedding vetorial gerado pelo OpenAI text-embedding-3-small (1536 dimensões).';

COMMENT ON COLUMN knowledge_vectors.metadata IS 
  'Metadados adicionais do chunk (ex: número da página, seção, etc.).';

-- ============================================================================
-- FIM DA MIGRATION
-- ============================================================================

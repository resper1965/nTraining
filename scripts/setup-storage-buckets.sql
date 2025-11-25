-- ============================================================================
-- Setup Supabase Storage Buckets
-- Execute este script no SQL Editor do Supabase
-- ============================================================================

-- Criar bucket para thumbnails de cursos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-thumbnails',
  'course-thumbnails',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Criar bucket para materiais de aulas
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lesson-materials',
  'lesson-materials',
  true,
  104857600, -- 100MB
  ARRAY['video/mp4', 'video/webm', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- Criar bucket para certificados
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'certificates',
  'certificates',
  true,
  5242880, -- 5MB
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Políticas RLS para course-thumbnails
CREATE POLICY "Anyone can view course thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-thumbnails');

CREATE POLICY "Authenticated users can upload course thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'course-thumbnails' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own course thumbnails"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'course-thumbnails' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete their own course thumbnails"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'course-thumbnails' 
  AND auth.role() = 'authenticated'
);

-- Políticas RLS para lesson-materials
CREATE POLICY "Authenticated users can view lesson materials"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'lesson-materials' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can upload lesson materials"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'lesson-materials' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own lesson materials"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'lesson-materials' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete their own lesson materials"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'lesson-materials' 
  AND auth.role() = 'authenticated'
);

-- Políticas RLS para certificates
CREATE POLICY "Anyone can view certificates"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificates');

CREATE POLICY "Authenticated users can upload certificates"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'certificates' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own certificates"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'certificates' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete their own certificates"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'certificates' 
  AND auth.role() = 'authenticated'
);


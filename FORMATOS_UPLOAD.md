# 📤 Formatos de Upload - n.training Platform

## 📋 Resumo dos Formatos Suportados

---

## 🖼️ 1. Upload de Imagens (Thumbnails de Cursos)

### Bucket: `course-thumbnails`

**Formatos Aceitos:**
- `image/jpeg` (`.jpg`, `.jpeg`)
- `image/png` (`.png`)
- `image/webp` (`.webp`)

**Tamanho Máximo:**
- **5 MB** (5.242.880 bytes)

**Uso:**
- Thumbnails de cursos
- Imagens de capa dos cursos
- Aspect ratio recomendado: 16:9

**Componente:**
- `ImageUpload` em `components/admin/image-upload.tsx`

**Exemplo de Uso:**
```tsx
<ImageUpload
  label="Thumbnail do Curso"
  currentImageUrl={thumbnailUrl}
  onImageUploaded={(url) => setThumbnailUrl(url)}
  bucket="course-thumbnails"
  aspectRatio="16/9"
  maxSizeMB={5}
/>
```

---

## 🎥 2. Upload de Vídeos (Aulas)

### Bucket: `lesson-materials`

**Formatos Aceitos:**
- `video/mp4` (`.mp4`) - **Recomendado**
- `video/webm` (`.webm`)
- `video/ogg` (`.ogg`)

**Tamanho Máximo:**
- **500 MB** (configurado no componente)
- Bucket permite até **100 MB** (pode ser ajustado)

**Uso:**
- Vídeos de aulas
- Conteúdo de vídeo para módulos
- Organização: `course-{courseId}/module-{moduleId}/`

**Componente:**
- `FileUpload` com `fileType="video"` em `components/admin/file-upload.tsx`

**Exemplo de Uso:**
```tsx
<FileUpload
  label="Vídeo da Aula"
  currentFileUrl={fileUrl}
  onFileUploaded={(url) => setFileUrl(url)}
  bucket="lesson-materials"
  folder={`course-${courseId}/module-${moduleId}`}
  maxSizeMB={500}
  fileType="video"
/>
```

**Recursos:**
- Preview do vídeo antes de salvar
- Barra de progresso durante upload
- Validação de tipo e tamanho
- Suporte a URL externa como alternativa

---

## 📄 3. Upload de PDFs (Aulas)

### Bucket: `lesson-materials`

**Formatos Aceitos:**
- `application/pdf` (`.pdf`)

**Tamanho Máximo:**
- **50 MB** (configurado no componente)
- Bucket permite até **100 MB** (pode ser ajustado)

**Uso:**
- PDFs de aulas
- Materiais de leitura
- Documentos complementares
- Organização: `course-{courseId}/module-{moduleId}/`

**Componente:**
- `FileUpload` com `fileType="pdf"` em `components/admin/file-upload.tsx`

**Exemplo de Uso:**
```tsx
<FileUpload
  label="PDF da Aula"
  currentFileUrl={fileUrl}
  onFileUploaded={(url) => setFileUrl(url)}
  bucket="lesson-materials"
  folder={`course-${courseId}/module-${moduleId}`}
  maxSizeMB={50}
  fileType="pdf"
/>
```

**Recursos:**
- Validação de tipo PDF
- Barra de progresso durante upload
- Link para visualizar arquivo após upload
- Suporte a URL externa como alternativa

---

## 📑 4. Upload de Documentos (Futuro)

### Bucket: `lesson-materials`

**Formatos Aceitos:**
- `application/pdf` (`.pdf`)
- `application/msword` (`.doc`)
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (`.docx`)

**Tamanho Máximo:**
- **100 MB** (limite do bucket)

**Uso:**
- Documentos Word
- Materiais complementares
- Ainda não implementado na UI (preparado no bucket)

---

## 📜 5. Upload de Certificados

### Bucket: `certificates`

**Formatos Aceitos:**
- `application/pdf` (`.pdf`)

**Tamanho Máximo:**
- **5 MB** (5.242.880 bytes)

**Uso:**
- Certificados gerados
- PDFs de certificação
- Ainda não implementado na UI (preparado no bucket)

---

## 🔧 Configuração Técnica

### Estrutura de Pastas no Storage

```
lesson-materials/
├── course-{courseId}/
│   └── module-{moduleId}/
│       ├── {timestamp}-{random}.mp4
│       ├── {timestamp}-{random}.pdf
│       └── ...
```

### Nomenclatura de Arquivos

Os arquivos são nomeados automaticamente com:
- **Timestamp** (milissegundos desde 1970)
- **String aleatória** (7 caracteres)
- **Extensão original**

Exemplo: `1735123456789-a3b2c1d.pdf`

### Validações Implementadas

1. **Tipo de Arquivo:**
   - Validação por MIME type
   - Validação por extensão
   - Mensagens de erro específicas

2. **Tamanho:**
   - Validação em MB antes do upload
   - Limite configurável por componente
   - Mensagem de erro com limite máximo

3. **Preview:**
   - Imagens: Preview imediato
   - Vídeos: Player de vídeo com controles
   - PDFs: Nome do arquivo + link

---

## 📊 Limites por Bucket

| Bucket | Tamanho Máximo | Formatos | Público |
|--------|----------------|----------|---------|
| `course-thumbnails` | 5 MB | JPEG, PNG, WEBP | ✅ Sim |
| `lesson-materials` | 100 MB | MP4, WEBM, OGG, PDF, DOC, DOCX | ✅ Sim (autenticado) |
| `certificates` | 5 MB | PDF | ✅ Sim |

---

## 🚀 Como Funciona o Upload

### Fluxo de Upload

1. **Seleção do Arquivo:**
   - Usuário seleciona arquivo via input file
   - Validação imediata de tipo e tamanho

2. **Preview:**
   - Imagens: Preview visual
   - Vídeos: Player de vídeo
   - PDFs: Nome do arquivo

3. **Upload:**
   - FormData criado com arquivo
   - Enviado para Server Action `uploadFile()` ou `uploadImage()`
   - Barra de progresso (simulada, pode ser melhorada)

4. **Armazenamento:**
   - Upload para Supabase Storage
   - Geração de URL pública
   - Retorno da URL para o componente

5. **Salvamento:**
   - URL salva no campo `content_url` ou `thumbnail_url`
   - Persistência no banco de dados ao salvar formulário

### Server Actions

**`uploadImage()`** - Para imagens:
```typescript
export async function uploadImage(formData: FormData): Promise<string>
```

**`uploadFile()`** - Para arquivos (vídeo, PDF):
```typescript
export async function uploadFile(formData: FormData): Promise<string>
```

Ambos retornam a URL pública do arquivo no Supabase Storage.

---

## 🔒 Segurança

### Políticas RLS (Row Level Security)

- **course-thumbnails:** Qualquer um pode visualizar, apenas autenticados podem fazer upload
- **lesson-materials:** Apenas usuários autenticados podem visualizar e fazer upload
- **certificates:** Qualquer um pode visualizar, apenas autenticados podem fazer upload

### Validações de Segurança

- ✅ Autenticação obrigatória (`requireAuth()`)
- ✅ Validação de tipo MIME
- ✅ Validação de tamanho
- ✅ Nomes de arquivo únicos (evita sobrescrita)
- ✅ Políticas RLS no Supabase

---

## 📝 Notas Importantes

1. **URLs Externas:**
   - Todos os componentes suportam URLs externas como alternativa
   - Útil para vídeos hospedados em YouTube, Vimeo, etc.
   - Útil para PDFs hospedados externamente

2. **Progresso do Upload:**
   - Atualmente simulado (0-100%)
   - Pode ser melhorado com eventos reais do Supabase Storage

3. **Limites do Supabase:**
   - Free tier: 1 GB de storage
   - Arquivos grandes podem consumir espaço rapidamente
   - Considere usar CDN ou storage externo para produção

4. **Otimizações Futuras:**
   - Compressão de imagens antes do upload
   - Conversão de vídeos para formatos otimizados
   - Upload em chunks para arquivos grandes
   - Progresso real do upload

---

**Documento criado em:** 2024-11-25  
**Versão:** 1.0  
**Última atualização:** Sprint 1.1 - TAREFA-006


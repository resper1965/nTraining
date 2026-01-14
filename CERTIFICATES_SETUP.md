# 🎓 Configuração do Sistema de Certificados

## ✅ Implementação Completa

O sistema de geração de certificados em PDF está totalmente implementado e funcional.

## 📋 O que foi implementado

### 1. Geração de PDF
- ✅ Template profissional de certificado usando `@react-pdf/renderer`
- ✅ Função `generateCertificatePDFFile()` para gerar e fazer upload
- ✅ Renderização server-side com `renderToBuffer()`
- ✅ Upload automático para Supabase Storage

### 2. Componentes
- ✅ `CertificatePDF` - Template do certificado em PDF
- ✅ `CertificateDownloadButton` - Botão client-side para download
- ✅ Página de visualização do certificado
- ✅ Página de download do certificado

### 3. Arquivos Modificados
- `lib/certificates/pdf-generator.tsx` - Implementação completa
- `app/(main)/certificates/[id]/download/page.tsx` - Rota de download
- `components/certificates/download-button.tsx` - Novo componente

## 🔧 Configuração do Supabase Storage

### Passo 1: Criar Bucket

1. Acesse o Supabase Dashboard: https://supabase.com/dashboard
2. Vá para **Storage** no menu lateral
3. Clique em **New bucket**
4. Configure:
   - **Name**: `certificates`
   - **Public bucket**: ✅ Marcar (para permitir download público)
   - **File size limit**: 10MB (opcional)
   - **Allowed MIME types**: `application/pdf` (opcional)
5. Clique em **Create bucket**

### Passo 2: Configurar Políticas RLS

Execute no **SQL Editor** do Supabase:

```sql
-- Política: Usuários autenticados podem inserir certificados
CREATE POLICY "Authenticated users can upload certificates"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'certificates');

-- Política: Todos podem ler certificados (público)
CREATE POLICY "Anyone can view certificates"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'certificates');

-- Política: Apenas o dono pode deletar seu certificado
CREATE POLICY "Users can delete their own certificates"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'certificates'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

### Passo 3: Verificar Configuração

Teste fazendo upload manual:
1. No Supabase Dashboard, vá para **Storage > certificates**
2. Clique em **Upload file**
3. Faça upload de um PDF de teste
4. Clique no arquivo e copie a URL pública
5. Abra a URL no navegador - deve abrir o PDF

## 🎨 Template do Certificado

O certificado gerado inclui:
- ✅ Cabeçalho com logo (se configurado)
- ✅ Título "CERTIFICADO"
- ✅ Nome do aluno em destaque
- ✅ Nome do curso
- ✅ Área do curso (se informada)
- ✅ Carga horária
- ✅ Data de emissão
- ✅ Nome da organização
- ✅ Código de verificação
- ✅ Link para verificação pública
- ✅ Design profissional com cores do ness

## 🚀 Como Usar

### Gerar Certificado Automaticamente

O certificado é gerado automaticamente quando o usuário completa um curso. Para forçar a geração:

```typescript
import { generateCertificatePDFFile } from '@/lib/certificates/pdf-generator'

// Buscar certificado do banco
const certificate = await getCertificateById(certificateId)

// Gerar PDF e obter URL pública
const pdfUrl = await generateCertificatePDFFile(certificate)

console.log('Certificado gerado:', pdfUrl)
```

### Botão de Download (Client Component)

```tsx
import { CertificateDownloadButton } from '@/components/certificates/download-button'

<CertificateDownloadButton
  certificate={certificate}
  variant="default"
  size="default"
/>
```

### Link Direto para Download

```tsx
<Link href={`/certificates/${certificateId}/download`}>
  <Button>
    <Download className="h-4 w-4 mr-2" />
    Download PDF
  </Button>
</Link>
```

## 📊 Estrutura de Arquivos

```
lib/certificates/
  └── pdf-generator.tsx        # Template e função de geração

components/certificates/
  ├── download-button.tsx      # Botão client-side
  ├── certificate-viewer.tsx   # Preview do certificado
  └── share-button.tsx         # Compartilhamento

app/(main)/certificates/
  ├── [id]/
  │   ├── page.tsx            # Visualização do certificado
  │   └── download/
  │       └── page.tsx        # Rota de download
  ├── verify/
  │   └── [code]/
  │       └── page.tsx        # Verificação pública
  └── page.tsx                # Lista de certificados
```

## 🔐 Segurança

### Controle de Acesso
- ✅ Apenas o dono do certificado pode baixá-lo
- ✅ Platform admins podem baixar qualquer certificado
- ✅ Bucket público permite compartilhamento fácil
- ✅ Código de verificação único por certificado

### Verificação de Autenticidade
- Cada certificado tem um código único de verificação
- Qualquer pessoa pode verificar em `/certificates/verify/{code}`
- O código não pode ser alterado após emissão

## 📝 Personalização

### Customizar Template

Edite `lib/certificates/pdf-generator.tsx`:

```typescript
// Alterar cores
const styles = StyleSheet.create({
  userName: {
    color: '#00ade8', // Cor ness
  }
})

// Adicionar logo
<View style={styles.header}>
  {logoUrl && (
    <Image
      src={logoUrl}
      style={styles.logo}
    />
  )}
</View>
```

### Customizar Nome do Arquivo

Edite `components/certificates/download-button.tsx`:

```typescript
const fileName = `certificado-${course.slug}-${certificate.verification_code}.pdf`
```

## ⚠️ Troubleshooting

### Erro: "Bucket 'certificates' not found"
**Solução**: Criar o bucket no Supabase Storage (ver Passo 1)

### Erro: "Failed to upload certificate"
**Solução**:
1. Verificar políticas RLS do bucket
2. Verificar se o usuário está autenticado
3. Verificar logs do Supabase para mais detalhes

### PDF não está sendo gerado
**Solução**:
1. Verificar se `@react-pdf/renderer` está instalado
2. Verificar logs do servidor
3. Testar renderização localmente

### Download não funciona
**Solução**:
1. Verificar se o bucket é público
2. Verificar URL pública no Supabase Dashboard
3. Limpar cache do navegador

## 🎯 Próximos Passos

- [ ] Adicionar assinatura digital nos certificados
- [ ] Permitir templates customizados por organização
- [ ] Enviar certificado por email automaticamente
- [ ] Adicionar QR Code para verificação
- [ ] Suportar múltiplos idiomas nos certificados

---

**Sistema de certificados implementado e pronto para uso!** 🎉

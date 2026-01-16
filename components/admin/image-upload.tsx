'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, X, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { uploadImage } from '@/app/actions/storage'

interface ImageUploadProps {
  label?: string
  currentImageUrl?: string | null
  onImageUploaded: (url: string) => void
  bucket: 'course-thumbnails' | 'lesson-materials' | 'certificates'
  folder?: string
  maxSizeMB?: number
  aspectRatio?: '16/9' | '1/1' | '4/3'
}

export function ImageUpload({
  label = 'Imagem',
  currentImageUrl,
  onImageUploaded,
  bucket,
  folder = '',
  maxSizeMB = 5,
  aspectRatio = '16/9',
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validação de tipo
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione um arquivo de imagem')
      return
    }

    // Validação de tamanho
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSizeMB) {
      setError(`O arquivo é muito grande. Máximo: ${maxSizeMB}MB`)
      return
    }

    setError(null)
    setUploading(true)

    // Preview local
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    try {
      // Upload para Supabase Storage
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', bucket)
      if (folder) {
        formData.append('folder', folder)
      }

      const url = await uploadImage(formData)
      onImageUploaded(url)
      setError(null)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao fazer upload da imagem'
      )
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onImageUploaded('')
  }

  return (
    <div className="space-y-2">
      <Label className="text-slate-300">{label}</Label>
      
      {preview ? (
        <div className="relative group">
          <div
            className={`relative overflow-hidden rounded-lg border border-slate-800 bg-slate-800 ${
              aspectRatio === '16/9'
                ? 'aspect-video'
                : aspectRatio === '1/1'
                ? 'aspect-square'
                : 'aspect-[4/3]'
            }`}
          >
            <Image
              src={preview}
              alt={`Preview da ${label.toLowerCase()}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTFGMTgyNyIvPjwvc3ZnPg=="
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                disabled={uploading}
              >
                <X className="h-4 w-4 mr-2" />
                Remover
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed border-slate-700 rounded-lg p-8 text-center transition-colors hover:border-slate-600 ${
            aspectRatio === '16/9'
              ? 'aspect-video'
              : aspectRatio === '1/1'
              ? 'aspect-square'
              : 'aspect-[4/3]'
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full">
            <Upload className="h-12 w-12 text-slate-600 mb-4" />
            <p className="text-sm text-slate-400 mb-2">
              Clique para fazer upload ou arraste a imagem aqui
            </p>
            <p className="text-xs text-slate-500">
              PNG, JPG ou WEBP até {maxSizeMB}MB
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
          id={`image-upload-${bucket}`}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : preview ? (
            'Trocar Imagem'
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Selecionar Imagem
            </>
          )}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      {preview && !currentImageUrl && (
        <p className="text-xs text-slate-500">
          Lembre-se de salvar o curso para confirmar o upload
        </p>
      )}
    </div>
  )
}


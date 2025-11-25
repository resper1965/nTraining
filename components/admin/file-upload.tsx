'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, X, Loader2, File, Video, FileText } from 'lucide-react'
import { uploadFile } from '@/app/actions/storage'
import { Progress } from '@/components/ui/progress'

interface FileUploadProps {
  label?: string
  currentFileUrl?: string | null
  onFileUploaded: (url: string) => void
  bucket: 'lesson-materials' | 'certificates'
  folder?: string
  maxSizeMB?: number
  acceptedTypes?: string[]
  fileType: 'video' | 'pdf' | 'document'
}

export function FileUpload({
  label = 'Arquivo',
  currentFileUrl,
  onFileUploaded,
  bucket,
  folder = '',
  maxSizeMB = 100,
  acceptedTypes,
  fileType,
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentFileUrl || null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getIcon = () => {
    switch (fileType) {
      case 'video':
        return Video
      case 'pdf':
      case 'document':
        return FileText
      default:
        return File
    }
  }

  const getAcceptedTypes = () => {
    if (acceptedTypes) return acceptedTypes.join(',')
    
    switch (fileType) {
      case 'video':
        return 'video/mp4,video/webm,video/ogg'
      case 'pdf':
        return 'application/pdf'
      case 'document':
        return 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      default:
        return '*'
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validação de tipo
    const acceptedMimeTypes = getAcceptedTypes().split(',')
    if (!acceptedMimeTypes.includes(file.type) && acceptedMimeTypes[0] !== '*') {
      setError(`Tipo de arquivo não suportado. Tipos aceitos: ${acceptedMimeTypes.join(', ')}`)
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
    setUploadProgress(0)

    // Preview para vídeos
    if (fileType === 'video' && file.type.startsWith('video/')) {
      const videoUrl = URL.createObjectURL(file)
      setPreview(videoUrl)
    } else {
      setPreview(file.name)
    }

    try {
      // Upload para Supabase Storage com progresso simulado
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', bucket)
      if (folder) {
        formData.append('folder', folder)
      }

      // Simular progresso (em produção, usar eventos reais do Supabase)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const url = await uploadFile(formData)
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      onFileUploaded(url)
      setError(null)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao fazer upload do arquivo'
      )
      setPreview(null)
    } finally {
      setUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onFileUploaded('')
  }

  const Icon = getIcon()

  return (
    <div className="space-y-2">
      <Label className="text-slate-300">{label}</Label>
      
      {preview ? (
        <div className="relative group">
          {fileType === 'video' && preview.startsWith('blob:') ? (
            <div className="relative overflow-hidden rounded-lg border border-slate-800 bg-slate-800 aspect-video">
              <video
                src={preview}
                controls
                className="w-full h-full object-contain"
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
          ) : (
            <div className="flex items-center gap-3 p-4 border border-slate-800 bg-slate-800 rounded-lg">
              <div className="p-2 bg-slate-700 rounded-lg">
                <Icon className="h-6 w-6 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">
                  {typeof preview === 'string' && preview.startsWith('http') 
                    ? 'Arquivo carregado' 
                    : preview}
                </p>
                {currentFileUrl && (
                  <a
                    href={currentFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    Ver arquivo
                  </a>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center transition-colors hover:border-slate-600">
          <div className="flex flex-col items-center justify-center">
            <Icon className="h-12 w-12 text-slate-600 mb-4" />
            <p className="text-sm text-slate-400 mb-2">
              Clique para fazer upload ou arraste o arquivo aqui
            </p>
            <p className="text-xs text-slate-500">
              {fileType === 'video' && 'MP4, WEBM até '}
              {fileType === 'pdf' && 'PDF até '}
              {fileType === 'document' && 'PDF, DOC, DOCX até '}
              {maxSizeMB}MB
            </p>
          </div>
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="bg-slate-800" />
          <p className="text-xs text-slate-400 text-center">
            Enviando... {uploadProgress}%
          </p>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Input
          ref={fileInputRef}
          type="file"
          accept={getAcceptedTypes()}
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
          id={`file-upload-${bucket}-${fileType}`}
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
            'Trocar Arquivo'
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Selecionar Arquivo
            </>
          )}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      {preview && !currentFileUrl && (
        <p className="text-xs text-slate-500">
          Lembre-se de salvar a aula para confirmar o upload
        </p>
      )}
    </div>
  )
}


'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Camera, Loader2 } from 'lucide-react'
import { uploadAvatar } from '@/app/actions/profile'
import { toast } from 'sonner'
import Image from 'next/image'

interface AvatarUploadProps {
  currentAvatarUrl?: string
}

export function AvatarUpload({ currentAvatarUrl }: AvatarUploadProps) {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentAvatarUrl || null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 2MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const newAvatarUrl = await uploadAvatar(formData)
      toast.success('Foto de perfil atualizada!')
      setPreview(newAvatarUrl)
      router.refresh()
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast.error('Erro ao fazer upload da foto. Tente novamente.')
      setPreview(currentAvatarUrl || null)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden flex items-center justify-center">
          {preview ? (
            <Image
              src={preview}
              alt="Avatar"
              width={96}
              height={96}
              className="object-cover"
            />
          ) : (
            <div className="text-4xl text-slate-500 font-medium">
              {currentAvatarUrl ? '' : '?'}
            </div>
          )}
        </div>
        {isUploading && (
          <div className="absolute inset-0 bg-slate-900/80 rounded-full flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
          </div>
        )}
      </div>

      <div className="flex-1">
        <input
          type="file"
          id="avatar-upload"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />
        <label htmlFor="avatar-upload">
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            className="cursor-pointer"
            asChild
          >
            <span>
              <Camera className="h-4 w-4 mr-2" />
              {isUploading ? 'Enviando...' : 'Alterar Foto'}
            </span>
          </Button>
        </label>
        <p className="text-xs text-slate-500 mt-2">
          JPG, PNG ou GIF. Máximo 2MB.
        </p>
      </div>
    </div>
  )
}


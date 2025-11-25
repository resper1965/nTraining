'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/admin/image-upload'

interface CustomizeCourseFormProps {
  course: any
  organizations: Array<{ id: string; name: string }>
}

export function CustomizeCourseForm({ course, organizations }: CustomizeCourseFormProps) {
  const router = useRouter()
  const [selectedOrg, setSelectedOrg] = useState('')
  const [customTitle, setCustomTitle] = useState('')
  const [customDescription, setCustomDescription] = useState('')
  const [customThumbnailUrl, setCustomThumbnailUrl] = useState('')

  return (
    <div className="space-y-6">
      {/* Organization Selection */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="font-display text-xl text-white">
            Selecionar Organização
          </CardTitle>
          <CardDescription>
            Escolha a organização para a qual este curso será personalizado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="organization_id">Organização *</Label>
            <Select
              value={selectedOrg}
              onValueChange={setSelectedOrg}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma organização" />
              </SelectTrigger>
              <SelectContent>
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="organization_id" value={selectedOrg} />
          </div>
        </CardContent>
      </Card>

      {/* Customizations */}
      {selectedOrg && (
        <>
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="font-display text-xl text-white">
                Personalizações
              </CardTitle>
              <CardDescription>
                Personalize o título, descrição e thumbnail para esta organização
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Custom Title */}
              <div className="space-y-2">
                <Label htmlFor="custom_title">Título Personalizado</Label>
                <Input
                  id="custom_title"
                  name="custom_title"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder={course.title}
                />
                <p className="text-xs text-slate-400">
                  Deixe em branco para usar o título original
                </p>
              </div>

              {/* Custom Description */}
              <div className="space-y-2">
                <Label htmlFor="custom_description">Descrição Personalizada</Label>
                <Textarea
                  id="custom_description"
                  name="custom_description"
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder={course.description || ''}
                  rows={4}
                />
                <p className="text-xs text-slate-400">
                  Deixe em branco para usar a descrição original
                </p>
              </div>

              {/* Custom Thumbnail */}
              <div className="space-y-2">
                <Label>Thumbnail Personalizado</Label>
                <ImageUpload
                  currentImageUrl={customThumbnailUrl || course.thumbnail_url}
                  onImageUploaded={(url) => setCustomThumbnailUrl(url)}
                  bucket="course-thumbnails"
                  folder="customizations"
                />
                <input type="hidden" name="custom_thumbnail_url" value={customThumbnailUrl} />
                <p className="text-xs text-slate-400">
                  Deixe em branco para usar o thumbnail original
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href={`/admin/courses/${course.id}/edit`} className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" className="flex-1">
              Salvar Personalização
            </Button>
          </div>
        </>
      )}
    </div>
  )
}


'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { assignPathToUsers } from '@/app/actions/path-assignments'

interface AssignPathFormProps {
  pathId: string
  users: Array<{
    id: string
    full_name: string | null
    email: string
  }>
}

export function AssignPathForm({ pathId, users }: AssignPathFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const selectedUserIds = formData.getAll('user_ids') as string[]
    const isMandatory = formData.get('is_mandatory') === 'on'
    const autoEnroll = formData.get('auto_enroll') === 'on'
    const deadlineStr = formData.get('deadline') as string
    const deadline = deadlineStr ? new Date(deadlineStr) : undefined

    if (selectedUserIds.length === 0) {
      router.push(`/admin/paths/${pathId}/assign?error=Nenhum usuário selecionado`)
      setIsSubmitting(false)
      return
    }

    try {
      const result = await assignPathToUsers(selectedUserIds, pathId, {
        isMandatory,
        autoEnrollFirstCourse: autoEnroll,
        deadline,
      })

      router.push(
        `/admin/paths/${pathId}/assign?success=${result.successful} usuário(s) atribuído(s) com sucesso`
      )
      router.refresh()
    } catch (error: any) {
      router.push(`/admin/paths/${pathId}/assign?error=${error.message}`)
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Options */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center space-x-2">
          <Switch id="is_mandatory" name="is_mandatory" />
          <Label htmlFor="is_mandatory" className="text-white">
            Trilha obrigatória
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="auto_enroll" name="auto_enroll" defaultChecked />
          <Label htmlFor="auto_enroll" className="text-white">
            Auto-inscrever no primeiro curso
          </Label>
        </div>
        <div>
          <Label htmlFor="deadline" className="text-white mb-2 block">
            Prazo (opcional)
          </Label>
          <Input
            id="deadline"
            name="deadline"
            type="date"
            className="bg-slate-800 border-slate-700"
          />
        </div>
      </div>

      {/* User List */}
      <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
        {users.length === 0 ? (
          <p className="text-slate-400 text-center py-8">
            Nenhum usuário disponível
          </p>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
            >
              <Checkbox
                id={`user-${user.id}`}
                name="user_ids"
                value={user.id}
              />
              <Label
                htmlFor={`user-${user.id}`}
                className="flex-1 text-white cursor-pointer"
              >
                <div className="font-medium">{user.full_name || user.email}</div>
                <div className="text-sm text-slate-400">{user.email}</div>
              </Label>
            </div>
          ))
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button type="submit" disabled={users.length === 0 || isSubmitting}>
          {isSubmitting ? 'Atribuindo...' : 'Atribuir Trilha'}
        </Button>
      </div>
    </form>
  )
}


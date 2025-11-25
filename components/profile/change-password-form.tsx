'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { changePassword } from '@/app/actions/profile'
import { toast } from 'sonner'

export function ChangePasswordForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Senha atual é obrigatória'
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'Nova senha é obrigatória'
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'A senha deve ter pelo menos 8 caracteres'
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      })
      toast.success('Senha alterada com sucesso!')
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      router.refresh()
    } catch (error: any) {
      console.error('Error changing password:', error)
      toast.error(error.message || 'Erro ao alterar senha. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Senha Atual</Label>
        <Input
          id="currentPassword"
          type="password"
          value={formData.currentPassword}
          onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
          placeholder="Digite sua senha atual"
          required
        />
        {errors.currentPassword && (
          <p className="text-xs text-red-400">{errors.currentPassword}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">Nova Senha</Label>
        <Input
          id="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          placeholder="Mínimo 8 caracteres"
          required
        />
        {errors.newPassword && (
          <p className="text-xs text-red-400">{errors.newPassword}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          placeholder="Digite a nova senha novamente"
          required
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-400">{errors.confirmPassword}</p>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Alterando...' : 'Alterar Senha'}
        </Button>
      </div>
    </form>
  )
}


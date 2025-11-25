'use client'

import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Trash2 } from 'lucide-react'
import { deleteCourse } from '@/app/actions/courses'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface DeleteCourseButtonProps {
  courseId: string
}

export function DeleteCourseButton({ courseId }: DeleteCourseButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    try {
      await deleteCourse(courseId)
      router.push('/admin/courses?message=Curso deletado com sucesso')
    } catch (error) {
      console.error('Error deleting course:', error)
      setIsDeleting(false)
      // Error será tratado pelo redirect
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          type="button" 
          variant="destructive" 
          className="w-full"
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {isDeleting ? 'Deletando...' : 'Deletar Curso'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-slate-900 border-slate-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            Tem certeza?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400">
            Esta ação não pode ser desfeita. O curso será permanentemente
            deletado, incluindo todos os módulos, aulas e progresso associados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deletando...' : 'Deletar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}


'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

interface AssignCoursesToUsersFormProps {
  users: Array<{ id: string; email: string; full_name: string | null }>
  courses: Array<{ id: string; course_id: string; courses: { title: string } }>
}

export function AssignCoursesToUsersForm({
  users,
  courses,
}: AssignCoursesToUsersFormProps) {
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set())
  const [isMandatory, setIsMandatory] = useState(false)
  const [deadline, setDeadline] = useState('')

  const toggleUser = (userId: string) => {
    const newSet = new Set(selectedUsers)
    if (newSet.has(userId)) {
      newSet.delete(userId)
    } else {
      newSet.add(userId)
    }
    setSelectedUsers(newSet)
  }

  const toggleCourse = (courseId: string) => {
    const newSet = new Set(selectedCourses)
    if (newSet.has(courseId)) {
      newSet.delete(courseId)
    } else {
      newSet.add(courseId)
    }
    setSelectedCourses(newSet)
  }

  const selectAllUsers = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set())
    } else {
      setSelectedUsers(new Set(users.map((u) => u.id)))
    }
  }

  const selectAllCourses = () => {
    if (selectedCourses.size === courses.length) {
      setSelectedCourses(new Set())
    } else {
      setSelectedCourses(new Set(courses.map((c) => c.id)))
    }
  }

  return (
    <div className="space-y-6">
      {/* Users Selection */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-display text-xl text-white">
                Selecionar Usuários
              </CardTitle>
              <CardDescription>
                Escolha os usuários que receberão os cursos
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={selectAllUsers}
            >
              {selectedUsers.size === users.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded-lg"
              >
                <Checkbox
                  id={`user-${user.id}`}
                  checked={selectedUsers.has(user.id)}
                  onCheckedChange={() => toggleUser(user.id)}
                />
                <Label
                  htmlFor={`user-${user.id}`}
                  className="flex-1 cursor-pointer text-white"
                >
                  {user.full_name || user.email}
                </Label>
              </div>
            ))}
          </div>
          <input
            type="hidden"
            name="user_ids"
            value={Array.from(selectedUsers).join(',')}
          />
        </CardContent>
      </Card>

      {/* Courses Selection */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-display text-xl text-white">
                Selecionar Cursos
              </CardTitle>
              <CardDescription>
                Escolha os cursos a serem atribuídos
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={selectAllCourses}
            >
              {selectedCourses.size === courses.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {courses.map((orgCourse) => (
              <div
                key={orgCourse.id}
                className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded-lg"
              >
                <Checkbox
                  id={`course-${orgCourse.id}`}
                  checked={selectedCourses.has(orgCourse.course_id)}
                  onCheckedChange={() => toggleCourse(orgCourse.course_id)}
                />
                <Label
                  htmlFor={`course-${orgCourse.id}`}
                  className="flex-1 cursor-pointer text-white"
                >
                  {orgCourse.courses?.title || 'Curso não encontrado'}
                </Label>
              </div>
            ))}
          </div>
          <input
            type="hidden"
            name="course_ids"
            value={Array.from(selectedCourses).join(',')}
          />
        </CardContent>
      </Card>

      {/* Settings */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="font-display text-xl text-white">
            Configurações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="is_mandatory">Curso Obrigatório</Label>
              <p className="text-sm text-slate-400">
                Os usuários devem completar estes cursos
              </p>
            </div>
            <Switch
              id="is_mandatory"
              name="is_mandatory"
              checked={isMandatory}
              onCheckedChange={setIsMandatory}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Prazo (Opcional)</Label>
            <Input
              id="deadline"
              name="deadline"
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
            <p className="text-xs text-slate-400">
              Data limite para conclusão dos cursos
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => window.history.back()}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={selectedUsers.size === 0 || selectedCourses.size === 0}
        >
          Atribuir Cursos ({selectedUsers.size} usuário(s) × {selectedCourses.size} curso(s))
        </Button>
      </div>
    </div>
  )
}


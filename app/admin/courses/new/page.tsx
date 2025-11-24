import { createCourse } from '@/app/actions/courses'
import { requireRole } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function NewCoursePage() {
  await requireRole('platform_admin')

  async function createCourseAction(formData: FormData) {
    'use server'
    
    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const description = formData.get('description') as string
    const objectives = formData.get('objectives') as string
    const duration_hours = parseFloat(formData.get('duration_hours') as string)
    const level = formData.get('level') as 'beginner' | 'intermediate' | 'advanced'
    const area = formData.get('area') as string
    const is_public = formData.get('is_public') === 'on'

    await createCourse({
      title,
      slug,
      description,
      objectives,
      duration_hours,
      level,
      area,
      status: 'draft',
      is_public,
    })

    redirect('/admin/courses')
  }

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/courses"
            className="text-sm text-slate-400 hover:text-white mb-4 inline-block"
          >
            ← Back to Courses
          </Link>
          <h1 className="font-display text-4xl font-medium text-white mb-2">
            Create New Course
          </h1>
          <p className="text-slate-400">
            Fill in the details to create a new course
          </p>
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="font-display text-xl text-white">
              Course Information
            </CardTitle>
            <CardDescription className="text-slate-400">
              Basic information about your course
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createCourseAction} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="text-sm font-medium text-slate-300"
                >
                  Course Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Introduction to Cybersecurity"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="slug"
                  className="text-sm font-medium text-slate-300"
                >
                  URL Slug *
                </label>
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  required
                  pattern="[a-z0-9-]+"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="introduction-to-cybersecurity"
                />
                <p className="text-xs text-slate-500">
                  Lowercase letters, numbers, and hyphens only
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-slate-300"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="A comprehensive introduction to cybersecurity fundamentals..."
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="objectives"
                  className="text-sm font-medium text-slate-300"
                >
                  Learning Objectives
                </label>
                <textarea
                  id="objectives"
                  name="objectives"
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="• Understand basic security concepts&#10;• Identify common threats&#10;• Implement security best practices"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="duration_hours"
                    className="text-sm font-medium text-slate-300"
                  >
                    Duration (hours)
                  </label>
                  <input
                    id="duration_hours"
                    name="duration_hours"
                    type="number"
                    step="0.5"
                    min="0"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="10"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="level"
                    className="text-sm font-medium text-slate-300"
                  >
                    Level *
                  </label>
                  <select
                    id="level"
                    name="level"
                    required
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="area"
                  className="text-sm font-medium text-slate-300"
                >
                  Area / Category
                </label>
                <input
                  id="area"
                  name="area"
                  type="text"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Cybersecurity"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="is_public"
                  name="is_public"
                  type="checkbox"
                  className="w-4 h-4 bg-slate-800 border-slate-700 rounded focus:ring-primary"
                />
                <label
                  htmlFor="is_public"
                  className="text-sm text-slate-300"
                >
                  Make this course public
                </label>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button type="submit">Create Course</Button>
                <Link href="/admin/courses">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}


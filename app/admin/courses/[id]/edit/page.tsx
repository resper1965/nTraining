import { getCourseById, updateCourse, publishCourse } from '@/app/actions/courses'
import { requireRole } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'

export default async function EditCoursePage({
  params,
}: {
  params: { id: string }
}) {
  await requireRole('platform_admin')

  let course
  try {
    course = await getCourseById(params.id)
  } catch (error) {
    notFound()
  }

  async function updateCourseAction(formData: FormData) {
    'use server'

    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const description = formData.get('description') as string
    const objectives = formData.get('objectives') as string
    const duration_hours = parseFloat(formData.get('duration_hours') as string)
    const level = formData.get('level') as 'beginner' | 'intermediate' | 'advanced'
    const area = formData.get('area') as string
    const is_public = formData.get('is_public') === 'on'

    await updateCourse(params.id, {
      title,
      slug,
      description,
      objectives,
      duration_hours,
      level,
      area,
      is_public,
    })

    redirect('/admin/courses')
  }

  async function publishCourseAction() {
    'use server'
    await publishCourse(params.id)
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-4xl font-medium text-white mb-2">
                Edit Course
              </h1>
              <p className="text-slate-400">
                Update course information
              </p>
            </div>
            {course.status === 'draft' && (
              <form action={publishCourseAction}>
                <Button type="submit" variant="outline">
                  Publish Course
                </Button>
              </form>
            )}
          </div>
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="font-display text-xl text-white">
              Course Information
            </CardTitle>
            <CardDescription className="text-slate-400">
              Update the course details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateCourseAction} className="space-y-6">
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
                  defaultValue={course.title}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                  defaultValue={course.slug}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
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
                  defaultValue={course.description || ''}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                  defaultValue={course.objectives || ''}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                    defaultValue={course.duration_hours || ''}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                    defaultValue={course.level}
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
                  defaultValue={course.area || ''}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="is_public"
                  name="is_public"
                  type="checkbox"
                  defaultChecked={course.is_public}
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
                <Button type="submit">Update Course</Button>
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


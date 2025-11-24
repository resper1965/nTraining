import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Course, CourseWithProgress } from '@/lib/types/database'

interface CourseCardProps {
  course: Course | CourseWithProgress
  showProgress?: boolean
}

export function CourseCard({ course, showProgress = false }: CourseCardProps) {
  const progress = 'progress' in course ? course.progress : null
  const completionPercentage = progress?.completion_percentage || 0

  return (
    <Card className="bg-slate-900 border-slate-800 hover:border-primary/50 transition-colors group">
      {course.thumbnail_url && (
        <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
          <Image
            src={course.thumbnail_url}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="font-display text-lg text-white line-clamp-2 flex-1">
            {course.title}
          </CardTitle>
          {course.level && (
            <span className="text-xs text-slate-500 uppercase whitespace-nowrap">
              {course.level}
            </span>
          )}
        </div>
        <CardDescription className="text-slate-400 line-clamp-2">
          {course.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-slate-500">
          {course.duration_hours && (
            <span>{course.duration_hours}h</span>
          )}
          {course.area && (
            <span className="px-2 py-1 bg-slate-800 rounded text-xs">
              {course.area}
            </span>
          )}
        </div>

        {showProgress && progress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Progress</span>
              <span>{completionPercentage}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        )}

        <Link href={`/courses/${course.slug}`}>
          <Button className="w-full" variant={progress ? 'outline' : 'default'}>
            {progress?.status === 'completed' 
              ? 'Review Course' 
              : progress?.status === 'in_progress' 
              ? 'Continue Learning' 
              : 'Start Course'}
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}


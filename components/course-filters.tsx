'use client'

import { Suspense, memo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { useSearchParams, useRouter } from 'next/navigation'
import type { CourseLevel } from '@/lib/types/database'

const LEVELS: { value: CourseLevel | 'all'; label: string }[] = [
  { value: 'all', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

interface CourseFiltersProps {
  areas?: string[]
}

function CourseFiltersContent({ areas = [] }: CourseFiltersProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const currentLevel = (searchParams.get('level') as CourseLevel | 'all') || 'all'
  const currentArea = searchParams.get('area') || 'all'
  const currentSearch = searchParams.get('search') || ''

  const updateFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all' || value === '') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    params.delete('page') // Reset pagination
    router.push(`/courses?${params.toString()}`)
  }, [searchParams, router])

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search courses..."
          defaultValue={currentSearch}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Level Filter */}
      <div>
        <h3 className="text-sm font-medium text-slate-300 mb-3">Level</h3>
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((level) => (
            <Button
              key={level.value}
              variant={currentLevel === level.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateFilter('level', level.value)}
            >
              {level.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Area Filter */}
      {areas.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-slate-300 mb-3">Area</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={currentArea === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateFilter('area', 'all')}
            >
              All Areas
            </Button>
            {areas.map((area) => (
              <Button
                key={area}
                variant={currentArea === area ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateFilter('area', area)}
              >
                {area}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Clear Filters */}
      {(currentLevel !== 'all' || currentArea !== 'all' || currentSearch) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/courses')}
          className="w-full"
        >
          Clear Filters
        </Button>
      )}
    </div>
  )
}

const CourseFiltersContentMemo = memo(CourseFiltersContent)

export function CourseFilters({ areas = [] }: CourseFiltersProps) {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="Search courses..."
            disabled
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-500"
          />
        </div>
      </div>
    }>
      <CourseFiltersContentMemo areas={areas} />
    </Suspense>
  )
}

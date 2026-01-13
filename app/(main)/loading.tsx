import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function MainLoading() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-12 w-96 mb-4" />
          <Skeleton className="h-6 w-full max-w-2xl" />
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-slate-900 border-slate-800">
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <CardContent className="pt-4">
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

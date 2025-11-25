import { Suspense, ReactNode } from 'react'
import { Loading } from './loading'
import { Skeleton } from './skeleton'

interface SuspenseWrapperProps {
  children: ReactNode
  fallback?: ReactNode
  skeleton?: boolean
}

export function SuspenseWrapper({ 
  children, 
  fallback, 
  skeleton = false 
}: SuspenseWrapperProps) {
  if (skeleton) {
    return (
      <Suspense fallback={<Skeleton className="h-32 w-full" />}>
        {children}
      </Suspense>
    )
  }

  return (
    <Suspense fallback={fallback || <Loading />}>
      {children}
    </Suspense>
  )
}


import { Header } from '@/components/layout/header'
import { ErrorBoundary } from '@/components/error-boundary'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </>
  )
}


'use client'

import { useEffect, useState } from 'react'
import { Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { updateLessonProgress } from '@/app/actions/progress'
import { useDebouncedCallback } from 'use-debounce'

interface PDFViewerProps {
  src: string
  lessonId: string
  lessonTitle: string
  onComplete?: () => void
}

export function PDFViewer({
  src,
  lessonId,
  lessonTitle,
  onComplete,
}: PDFViewerProps) {
  const [zoom, setZoom] = useState(100)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [isViewing, setIsViewing] = useState(false)
  const iframeRef = useState<HTMLIFrameElement | null>(null)[0]

  // Track viewing progress
  useEffect(() => {
    if (!isViewing) return

    const handleScroll = () => {
      // Mark as viewed after 5 seconds of viewing
      const timer = setTimeout(async () => {
        try {
          await updateLessonProgress(lessonId, {
            watched_duration_seconds: 60, // 1 minute viewed
          })
        } catch (error) {
          console.error('Error updating progress:', error)
        }
      }, 5000)

      return () => clearTimeout(timer)
    }

    // Mark as complete when user views PDF for 30 seconds
    const completeTimer = setTimeout(async () => {
      try {
        await updateLessonProgress(lessonId, {
          is_completed: true,
          watched_duration_seconds: 60,
        })
        onComplete?.()
      } catch (error) {
        console.error('Error marking lesson complete:', error)
      }
    }, 30000)

    return () => {
      clearTimeout(completeTimer)
    }
  }, [isViewing, lessonId, onComplete])

  useEffect(() => {
    setIsViewing(true)
  }, [])

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50))
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = src
    link.download = `${lessonTitle}.pdf`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="w-full bg-slate-900 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-slate-400" />
          <span className="text-sm text-slate-300 font-medium">
            {lessonTitle}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-2 border-r border-slate-700 pr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="text-slate-300 hover:text-white"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-slate-400 min-w-[3rem] text-center">
              {zoom}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              className="text-slate-300 hover:text-white"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* Download */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="text-slate-300 hover:text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="relative w-full" style={{ height: '600px' }}>
        <iframe
          src={`${src}#zoom=${zoom}`}
          className="w-full h-full border-0"
          title={lessonTitle}
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
        />
      </div>

      {/* Info */}
      <div className="p-4 bg-slate-800 border-t border-slate-700">
        <p className="text-xs text-slate-400 text-center">
          Visualize o PDF acima. O progresso será salvo automaticamente após 30 segundos de visualização.
        </p>
      </div>
    </div>
  )
}


'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { updateLessonProgress } from '@/app/actions/progress'
import { useDebouncedCallback } from 'use-debounce'

interface VideoPlayerProps {
  src: string
  lessonId: string
  durationMinutes?: number
  initialProgress?: number
  onComplete?: () => void
}

export function VideoPlayer({
  src,
  lessonId,
  durationMinutes,
  initialProgress = 0,
  onComplete,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(initialProgress)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [buffered, setBuffered] = useState(0)

  // Debounced save progress (every 5 seconds or when paused)
  const debouncedSaveProgress = useDebouncedCallback(
    async (time: number, watched: number) => {
      try {
        await updateLessonProgress(lessonId, {
          last_position_seconds: time,
          watched_duration_seconds: watched,
        })
      } catch (error) {
        console.error('Error saving progress:', error)
      }
    },
    5000 // 5 seconds debounce
  )

  const handleComplete = async () => {
    if (videoRef.current) {
      const finalTime = Math.floor(videoRef.current.currentTime)
      try {
        await updateLessonProgress(lessonId, {
          is_completed: true,
          last_position_seconds: finalTime,
          watched_duration_seconds: finalTime,
        })
        onComplete?.()
      } catch (error) {
        console.error('Error marking lesson complete:', error)
      }
    }
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Set initial time
    if (initialProgress > 0) {
      video.currentTime = initialProgress
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    const handleTimeUpdate = () => {
      const current = Math.floor(video.currentTime)
      const total = Math.floor(video.duration)
      setCurrentTime(current)

      // Calculate watched duration
      const watched = Math.max(
        current,
        initialProgress || 0
      )

      // Save progress (debounced)
      debouncedSaveProgress(current, watched)

      // Check if video is complete (95% watched)
      if (total > 0 && current / total >= 0.95 && !video.ended) {
        handleComplete()
      }
    }

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1)
        const bufferedPercent = (bufferedEnd / video.duration) * 100
        setBuffered(bufferedPercent)
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      handleComplete()
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('progress', handleProgress)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('progress', handleProgress)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [src, initialProgress, lessonId, debouncedSaveProgress, onComplete])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newTime = value[0]
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = value[0]
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    if (isMuted) {
      video.volume = volume || 0.5
      setIsMuted(false)
    } else {
      video.volume = 0
      setIsMuted(true)
    }
  }

  const skipBackward = () => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = Math.max(0, video.currentTime - 10)
  }

  const skipForward = () => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = Math.min(duration, video.currentTime + 10)
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (!document.fullscreenElement) {
      video.requestFullscreen().then(() => setIsFullscreen(true))
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false))
    }
  }

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="relative w-full bg-slate-950 rounded-lg overflow-hidden group">
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        className="w-full aspect-video"
        playsInline
      />

      {/* Controls Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Progress Bar */}
        <div className="absolute bottom-16 left-0 right-0 px-4">
          <div className="relative">
            {/* Buffered Progress */}
            <div
              className="absolute h-1 bg-slate-600 rounded-full"
              style={{ width: `${buffered}%` }}
            />
            {/* Current Progress */}
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="relative"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-4">
          <div className="flex items-center gap-4">
            {/* Play/Pause */}
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              className="text-white hover:bg-white/20"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>

            {/* Skip Backward */}
            <Button
              variant="ghost"
              size="icon"
              onClick={skipBackward}
              className="text-white hover:bg-white/20"
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            {/* Skip Forward */}
            <Button
              variant="ghost"
              size="icon"
              onClick={skipForward}
              className="text-white hover:bg-white/20"
            >
              <SkipForward className="h-4 w-4" />
            </Button>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.1}
                onValueChange={handleVolumeChange}
                className="w-24"
              />
            </div>

            {/* Time */}
            <div className="flex-1 text-sm text-white font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            {/* Fullscreen */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Play Button Overlay (when paused) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlay}
            className="h-20 w-20 rounded-full bg-black/50 hover:bg-black/70 text-white"
          >
            <Play className="h-10 w-10 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}


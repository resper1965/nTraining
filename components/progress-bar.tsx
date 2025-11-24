interface ProgressBarProps {
  value: number
  max?: number
  showLabel?: boolean
  className?: string
}

export function ProgressBar({ 
  value, 
  max = 100, 
  showLabel = true,
  className = '' 
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}


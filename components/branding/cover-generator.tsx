'use client'

// ============================================================================
// Cover Generator Component
// ============================================================================
// Gerador de capas programáticas para cursos usando CSS/SVG
// 4 variantes visuais: Deep Focus, Fluid, Grid, Typography
// ============================================================================

import { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Sparkles, Shield, Users, BookOpen } from 'lucide-react'

// ============================================================================
// Types
// ============================================================================

export type CoverVariant = 1 | 2 | 3 | 4
export type CoverCategory = 'security' | 'hr' | 'compliance' | 'technology' | 'general'

export interface CoverGeneratorProps {
  title: string
  category?: CoverCategory
  variant?: CoverVariant
  className?: string
  width?: number
  height?: number
  onExport?: () => void // Para futura exportação como imagem
}

// ============================================================================
// Category Icons & Colors
// ============================================================================

const categoryConfig: Record<
  CoverCategory,
  { icon: typeof Shield; color: string; gradient: string }
> = {
  security: {
    icon: Shield,
    color: 'text-red-400',
    gradient: 'from-red-500/20 to-red-900/40',
  },
  hr: {
    icon: Users,
    color: 'text-blue-400',
    gradient: 'from-blue-500/20 to-blue-900/40',
  },
  compliance: {
    icon: BookOpen,
    color: 'text-green-400',
    gradient: 'from-green-500/20 to-green-900/40',
  },
  technology: {
    icon: Sparkles,
    color: 'text-violet-400',
    gradient: 'from-violet-500/20 to-violet-900/40',
  },
  general: {
    icon: Sparkles,
    color: 'text-zinc-400',
    gradient: 'from-zinc-500/20 to-zinc-900/40',
  },
}

// ============================================================================
// Variant 1: Deep Focus (Gradiente Radial + Noise Texture)
// ============================================================================

function DeepFocusVariant({
  title,
  category = 'general',
  width = 1200,
  height = 675,
}: {
  title: string
  category: CoverCategory
  width: number
  height: number
}) {
  const config = categoryConfig[category]
  const Icon = config.icon

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg',
        `bg-gradient-radial ${config.gradient}`
      )}
      style={{ width, height }}
    >
      {/* Noise Texture */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
        <Icon className={cn('h-24 w-24 mb-6 opacity-60', config.color)} />
        <h1 className="font-display text-5xl font-bold text-white tracking-tight max-w-4xl">
          {title}
        </h1>
      </div>

      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-zinc-900/60" />
    </div>
  )
}

// ============================================================================
// Variant 2: Fluid (Formas Orgânicas SVG + Glassmorphism)
// ============================================================================

function FluidVariant({
  title,
  category = 'general',
  width = 1200,
  height = 675,
}: {
  title: string
  category: CoverCategory
  width: number
  height: number
}) {
  const config = categoryConfig[category]
  const Icon = config.icon

  return (
    <div
      className="relative overflow-hidden rounded-lg bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900"
      style={{ width, height }}
    >
      {/* SVG Fluid Shapes */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 675"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="fluid1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        {/* Organic Blob 1 */}
        <path
          d="M0,200 Q300,100 600,150 T1200,200 L1200,675 L0,675 Z"
          fill="url(#fluid1)"
          className={config.color}
          opacity="0.4"
          style={{
            filter: 'blur(60px)',
          }}
        />
        {/* Organic Blob 2 */}
        <path
          d="M1200,400 Q900,300 600,350 T0,400 L0,675 L1200,675 Z"
          fill="url(#fluid1)"
          className={config.color}
          opacity="0.3"
          style={{
            filter: 'blur(80px)',
          }}
        />
      </svg>

      {/* Glassmorphism Content */}
      <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <Icon className={cn('h-16 w-16 mx-auto mb-4', config.color)} />
          <h1 className="font-display text-4xl font-bold text-white tracking-tight max-w-3xl">
            {title}
          </h1>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Variant 3: Grid (Padrão de Grade Técnica Minimalista)
// ============================================================================

function GridVariant({
  title,
  category = 'general',
  width = 1200,
  height = 675,
}: {
  title: string
  category: CoverCategory
  width: number
  height: number
}) {
  const config = categoryConfig[category]

  return (
    <div
      className="relative overflow-hidden rounded-lg bg-zinc-950"
      style={{ width, height }}
    >
      {/* Grid Pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className={config.color}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Diagonal Lines */}
      <div className="absolute inset-0">
        <div
          className={cn('absolute w-full h-px opacity-10', config.color)}
          style={{
            top: '20%',
            transform: 'rotate(45deg)',
            transformOrigin: 'left',
          }}
        />
        <div
          className={cn('absolute w-full h-px opacity-10', config.color)}
          style={{
            top: '60%',
            transform: 'rotate(-45deg)',
            transformOrigin: 'right',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-2">
            <div className={cn('h-1 w-12', config.color)} />
            <div className={cn('h-1 w-24 bg-current opacity-40', config.color)} />
            <div className={cn('h-1 w-12', config.color)} />
          </div>
          <h1 className="font-display text-5xl font-bold text-white tracking-tight max-w-4xl">
            {title}
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className={cn('h-1 w-12', config.color)} />
            <div className={cn('h-1 w-24 bg-current opacity-40', config.color)} />
            <div className={cn('h-1 w-12', config.color)} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Variant 4: Typography (Apenas Tipografia em Alto Contraste)
// ============================================================================

function TypographyVariant({
  title,
  category = 'general',
  width = 1200,
  height = 675,
}: {
  title: string
  category: CoverCategory
  width: number
  height: number
}) {
  const config = categoryConfig[category]

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg',
        'bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950'
      )}
      style={{ width, height }}
    >
      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
        <h1 className="font-display text-6xl md:text-7xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none max-w-5xl">
          {title.split(' ').map((word, index) => (
            <span key={index} className="block">
              {word}
            </span>
          ))}
        </h1>
        <div
          className={cn(
            'mt-8 h-2 w-32',
            config.color,
            'bg-current opacity-60'
          )}
        />
      </div>

      {/* Subtle Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 20px)`,
        }}
      />
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export function CoverGenerator({
  title,
  category = 'general',
  variant = 1,
  className,
  width = 1200,
  height = 675,
  onExport,
}: CoverGeneratorProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Adicionar suporte a exportação futura (html-to-image)
  useEffect(() => {
    if (onExport && containerRef.current) {
      // Placeholder para futura integração
    }
  }, [onExport])

  const renderVariant = () => {
    switch (variant) {
      case 1:
        return (
          <DeepFocusVariant
            title={title}
            category={category}
            width={width}
            height={height}
          />
        )
      case 2:
        return (
          <FluidVariant
            title={title}
            category={category}
            width={width}
            height={height}
          />
        )
      case 3:
        return (
          <GridVariant
            title={title}
            category={category}
            width={width}
            height={height}
          />
        )
      case 4:
        return (
          <TypographyVariant
            title={title}
            category={category}
            width={width}
            height={height}
          />
        )
      default:
        return (
          <DeepFocusVariant
            title={title}
            category={category}
            width={width}
            height={height}
          />
        )
    }
  }

  return (
    <div ref={containerRef} className={cn('inline-block', className)}>
      {renderVariant()}
    </div>
  )
}

// ============================================================================
// Helper: Gradient Radial (adicionar ao Tailwind se necessário)
// ============================================================================

// Nota: Adicione ao tailwind.config.ts se não funcionar:
// backgroundImage: {
//   'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
// }

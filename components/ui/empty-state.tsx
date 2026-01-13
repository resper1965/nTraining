import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export interface EmptyStateProps {
  /** Ícone a ser exibido (do lucide-react) */
  icon: LucideIcon
  /** Título principal */
  title: string
  /** Descrição/subtítulo */
  description: string
  /** Botão de ação (opcional) */
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  /** Sugestões/próximos passos (opcional) */
  suggestions?: string[]
  /** Tamanho do container (opcional) - padrão: 'default' */
  size?: 'compact' | 'default' | 'large'
}

/**
 * Componente EmptyState - Estado vazio padronizado
 *
 * Usado quando uma lista/página não tem dados para exibir.
 * Fornece feedback visual claro e ações recomendadas ao usuário.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={BookOpen}
 *   title="Nenhum curso encontrado"
 *   description="Você ainda não tem cursos atribuídos"
 *   action={{
 *     label: "Explorar Catálogo",
 *     href: "/courses"
 *   }}
 *   suggestions={[
 *     "Entre em contato com seu gestor",
 *     "Verifique a página de cursos disponíveis"
 *   ]}
 * />
 * ```
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  suggestions,
  size = 'default',
}: EmptyStateProps) {
  const sizeClasses = {
    compact: 'py-8',
    default: 'py-12',
    large: 'py-16',
  }

  const iconSizeClasses = {
    compact: 'h-12 w-12',
    default: 'h-16 w-16',
    large: 'h-20 w-20',
  }

  const content = (
    <div className={`text-center ${sizeClasses[size]}`}>
      {/* Icon */}
      <Icon
        className={`${iconSizeClasses[size]} text-slate-600 mx-auto mb-4`}
      />

      {/* Title */}
      <h3 className="font-display text-xl font-medium text-white mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-slate-400 mb-6 max-w-md mx-auto">{description}</p>

      {/* Action Button */}
      {action && (
        <div className="mb-6">
          {action.href ? (
            <Link href={action.href}>
              <Button>{action.label}</Button>
            </Link>
          ) : (
            <Button onClick={action.onClick}>{action.label}</Button>
          )}
        </div>
      )}

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="mt-6 max-w-md mx-auto">
          <p className="text-sm text-slate-500 mb-2">Sugestões:</p>
          <ul className="text-sm text-slate-400 space-y-1">
            {suggestions.map((suggestion, index) => (
              <li key={index}>• {suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardContent className="pt-6">{content}</CardContent>
    </Card>
  )
}

/**
 * EmptyState Inline - Versão mais compacta sem Card wrapper
 *
 * Use quando o empty state já está dentro de um Card ou container
 */
export function EmptyStateInline({
  icon: Icon,
  title,
  description,
  action,
  suggestions,
  size = 'compact',
}: EmptyStateProps) {
  const sizeClasses = {
    compact: 'py-6',
    default: 'py-10',
    large: 'py-14',
  }

  const iconSizeClasses = {
    compact: 'h-10 w-10',
    default: 'h-14 w-14',
    large: 'h-18 w-18',
  }

  return (
    <div className={`text-center ${sizeClasses[size]}`}>
      <Icon
        className={`${iconSizeClasses[size]} text-slate-600 mx-auto mb-3`}
      />
      <h4 className="font-display text-lg font-medium text-white mb-2">
        {title}
      </h4>
      <p className="text-sm text-slate-400 mb-4 max-w-sm mx-auto">
        {description}
      </p>

      {action && (
        <div className="mb-4">
          {action.href ? (
            <Link href={action.href}>
              <Button size="sm" variant="outline">
                {action.label}
              </Button>
            </Link>
          ) : (
            <Button size="sm" variant="outline" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      )}

      {suggestions && suggestions.length > 0 && (
        <div className="mt-4 max-w-sm mx-auto">
          <ul className="text-xs text-slate-500 space-y-1">
            {suggestions.map((suggestion, index) => (
              <li key={index}>• {suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

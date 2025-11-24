import { formatCNPJ } from '@/lib/utils/cnpj'

interface CNPJDisplayProps {
  cnpj: string | null | undefined
  className?: string
}

/**
 * Componente para exibir CNPJ formatado
 * Sempre aplica máscara: 99.999.999/9999-99
 */
export function CNPJDisplay({ cnpj, className }: CNPJDisplayProps) {
  if (!cnpj) {
    return <span className={className}>—</span>
  }

  return <span className={className}>{formatCNPJ(cnpj)}</span>
}


/**
 * Skip Link - Link de navegação para pular para o conteúdo principal
 *
 * Melhora acessibilidade permitindo usuários de teclado/screen reader
 * pularem diretamente para o conteúdo principal.
 *
 * Deve ser o primeiro elemento focável da página.
 */

import Link from 'next/link'

export function SkipLink() {
  return (
    <Link
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-slate-950"
    >
      Pular para o conteúdo principal
    </Link>
  )
}

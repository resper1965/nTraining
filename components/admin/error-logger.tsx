'use client'

import { useEffect } from 'react'

/**
 * Componente para capturar e logar todos os erros do React e do navegador
 * Isso ajuda a debugar erros que acontecem muito rápido
 */
export function ErrorLogger() {
  useEffect(() => {
    // Capturar erros não tratados do React
    const originalError = console.error
    console.error = (...args: any[]) => {
      originalError.apply(console, args)
      
      // Se for um erro relacionado ao Next.js ou React, logar detalhadamente
      if (args[0]?.digest || args[0]?.message?.includes('Server Components')) {
        console.group('🚨 ERRO CAPTURADO - Server Components')
        console.error('Erro completo:', args[0])
        console.error('Stack:', args[0]?.stack)
        console.error('Digest:', args[0]?.digest)
        console.error('Todos os argumentos:', args)
        console.groupEnd()
      }
    }

    // Capturar erros globais do navegador
    const handleError = (event: ErrorEvent) => {
      console.group('🚨 ERRO GLOBAL DO NAVEGADOR')
      console.error('Mensagem:', event.message)
      console.error('Arquivo:', event.filename, 'Linha:', event.lineno, 'Coluna:', event.colno)
      console.error('Erro:', event.error)
      console.error('Stack:', event.error?.stack)
      console.error('Digest:', event.error?.digest)
      console.groupEnd()
    }

    // Capturar promise rejections não tratadas
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.group('🚨 PROMISE REJECTION NÃO TRATADA')
      console.error('Razão:', event.reason)
      console.error('Stack:', event.reason?.stack)
      console.error('Digest:', event.reason?.digest)
      console.error('Evento completo:', event)
      console.groupEnd()
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      console.error = originalError
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return null
}

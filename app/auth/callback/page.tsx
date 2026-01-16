'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

/**
 * Componente interno que processa o callback OAuth
 */
function OAuthCallbackProcessor() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'processing' | 'error'>('processing')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    let isMounted = true
    const timeoutIds: NodeJS.Timeout[] = []
    let processingComplete = false

    const handleOAuthCallback = async () => {
      if (!isMounted || processingComplete) return

      // Verificar se já existe uma sessão ativa (cachear resultado para evitar múltiplas chamadas)
      const { data: { session: existingSession } } = await supabase.auth.getSession()
      const hasExistingSession = !!existingSession
      
      if (existingSession && isMounted && !processingComplete) {
        // Se já está autenticado, redirecionar diretamente
        const next = searchParams.get('next') || '/dashboard'
        processingComplete = true
        router.push(next)
        return
      }

      // Verificar se há 'code' na query string (fluxo padrão do Supabase)
      const code = searchParams.get('code')
      if (code && !processingComplete) {
        try {
          // Trocar o código por uma sessão
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (!isMounted || processingComplete) return

          if (exchangeError) {
            console.error('[OAuth Callback] Error exchanging code:', exchangeError)
            setStatus('error')
            setErrorMessage(exchangeError.message)
            const timeoutId = setTimeout(() => {
              if (isMounted) {
                router.push(`/auth/login?error=${encodeURIComponent(exchangeError.message)}`)
              }
            }, 2000)
            timeoutIds.push(timeoutId)
            return
          }

          if (data?.session && isMounted && !processingComplete) {
            // Obter o parâmetro 'next' ou usar dashboard
            const next = searchParams.get('next') || '/dashboard'
            processingComplete = true
            router.push(next)
            return
          }
        } catch (error) {
          if (!isMounted || processingComplete) return
          
          console.error('[OAuth Callback] Unexpected error exchanging code:', error)
          const errorMsg = error instanceof Error ? error.message : 'Erro ao processar código de autenticação'
          setStatus('error')
          setErrorMessage(errorMsg)
          const timeoutId = setTimeout(() => {
            if (isMounted) {
              router.push(`/auth/login?error=${encodeURIComponent(errorMsg)}`)
            }
          }, 2000)
          timeoutIds.push(timeoutId)
          return
        }
      }

      // Se já processamos o code com sucesso, não processar hash
      if (processingComplete) return

      // Verificar se há tokens no hash fragment (#access_token=...)
      // Usar função helper para ler hash de forma reativa
      const getHashParams = () => {
        if (typeof window === 'undefined') return null
        const hash = window.location.hash.substring(1)
        if (!hash) return null
        return new URLSearchParams(hash)
      }

      const hashParams = getHashParams()
      if (hashParams && !processingComplete) {
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const error = hashParams.get('error')
        const errorDescription = hashParams.get('error_description')

        if (error && isMounted && !processingComplete) {
          // Se houver erro, redirecionar para login com mensagem
          const errorMsg = errorDescription || error
          setStatus('error')
          setErrorMessage(errorMsg)
          const timeoutId = setTimeout(() => {
            if (isMounted) {
              router.push(`/auth/login?error=${encodeURIComponent(errorMsg)}`)
            }
          }, 2000)
          timeoutIds.push(timeoutId)
          return
        }

        if (accessToken && refreshToken && isMounted && !processingComplete) {
          try {
            // Usar resultado cacheado da verificação inicial (evita requisição duplicada)
            // Se já verificamos no início e não havia sessão, não precisamos verificar novamente
            // Apenas verificar novamente se passou tempo suficiente ou se não verificamos antes
            if (hasExistingSession && isMounted && !processingComplete) {
              // Sessão já existe (do cache), redirecionar
              const next = searchParams.get('next') || '/dashboard'
              processingComplete = true
              router.push(next)
              return
            }

            // Configurar a sessão com os tokens recebidos
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            })

            if (!isMounted || processingComplete) return

            if (sessionError) {
              console.error('[OAuth Callback] Error setting session:', sessionError)
              setStatus('error')
              setErrorMessage(sessionError.message)
              const timeoutId = setTimeout(() => {
                if (isMounted) {
                  router.push(`/auth/login?error=${encodeURIComponent(sessionError.message)}`)
                }
              }, 2000)
              timeoutIds.push(timeoutId)
              return
            }

            if (isMounted && !processingComplete) {
              // Obter o parâmetro 'next' da URL ou usar dashboard como padrão
              const next = searchParams.get('next') || '/dashboard'
              
              // Limpar o hash da URL
              window.history.replaceState({}, '', window.location.pathname + window.location.search)
              
              // Marcar como completo antes de redirecionar
              processingComplete = true
              
              // Redirecionar para a página solicitada
              router.push(next)
            }
          } catch (error) {
            if (!isMounted || processingComplete) return
            
            console.error('[OAuth Callback] Unexpected error:', error)
            const errorMsg = error instanceof Error ? error.message : 'Erro ao processar autenticação'
            setStatus('error')
            setErrorMessage(errorMsg)
            const timeoutId = setTimeout(() => {
              if (isMounted) {
                router.push(`/auth/login?error=${encodeURIComponent(errorMsg)}`)
              }
            }, 2000)
            timeoutIds.push(timeoutId)
          }
        } else if (isMounted && !processingComplete && !code) {
          // Se não houver tokens nem code, algo está errado
          setStatus('error')
          setErrorMessage('Erro: tokens de autenticação não encontrados')
          const timeoutId = setTimeout(() => {
            if (isMounted) {
              router.push('/auth/login?error=Erro%20ao%20autenticar%20com%20Google')
            }
          }, 2000)
          timeoutIds.push(timeoutId)
        }
      } else if (isMounted && !processingComplete && !code) {
        // Se não houver hash nem code, redirecionar para login
        setStatus('error')
        setErrorMessage('Erro: nenhum dado de autenticação encontrado')
        const timeoutId = setTimeout(() => {
          if (isMounted) {
            router.push('/auth/login?error=Erro%20ao%20autenticar%20com%20Google')
          }
        }, 2000)
        timeoutIds.push(timeoutId)
      }
    }

    handleOAuthCallback()

    // Cleanup function
    return () => {
      isMounted = false
      processingComplete = true
      // Limpar todos os timeouts pendentes
      timeoutIds.forEach(timeoutId => clearTimeout(timeoutId))
    }
  }, [router, searchParams])

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="text-center max-w-md">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-950/30 border border-red-800/50 mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Erro ao autenticar</h1>
          <p className="text-slate-300 mb-4">{errorMessage}</p>
          <p className="text-sm text-slate-400">Redirecionando para login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-[#00ade8] mb-4"></div>
        <h1 className="text-xl font-semibold text-white mb-2">Processando autenticação...</h1>
        <p className="text-slate-400 text-sm">Aguarde enquanto concluímos o login</p>
      </div>
    </div>
  )
}

/**
 * Página client-side para processar callbacks OAuth
 * Processa tokens que vêm no hash fragment (#access_token=...)
 */
export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-[#00ade8] mb-4"></div>
          <h1 className="text-xl font-semibold text-white mb-2">Processando autenticação...</h1>
          <p className="text-slate-400 text-sm">Aguarde enquanto concluímos o login</p>
        </div>
      </div>
    }>
      <OAuthCallbackProcessor />
    </Suspense>
  )
}
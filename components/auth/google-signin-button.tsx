'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Chrome, Loader2 } from 'lucide-react'

interface GoogleSignInButtonProps {
  redirectTo?: string
}

export function GoogleSignInButton({ redirectTo }: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const isMountedRef = useRef(true)

  useEffect(() => {
    // Marcar como montado
    isMountedRef.current = true
    
    return () => {
      // Marcar como desmontado no cleanup
      isMountedRef.current = false
    }
  }, [])

  const handleGoogleSignIn = async () => {
    if (!isMountedRef.current) return
    
    setIsLoading(true)
    
    try {
      // FORÇAR sempre usar o alias principal da Vercel em produção
      // URLs de deployment específicas (como n-training-xxx-xxx.vercel.app) mudam a cada deploy
      // Precisamos usar o alias estável (n-training.vercel.app) para que funcione sempre
      let currentOrigin: string
      
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname
        
        // Se estiver em localhost, usar localhost
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
          currentOrigin = window.location.origin
        }
        // Se estiver no domínio customizado, usar esse domínio
        else if (hostname.includes('ness.com.br')) {
          // Sempre usar ntraining.ness.com.br (sem subdomínio específico)
          currentOrigin = 'https://ntraining.ness.com.br'
        }
        // Se estiver em produção na Vercel, SEMPRE usar o alias principal
        // Ignorar URLs de deployment específicas (que contêm hash/ID único)
        else if (hostname.includes('vercel.app')) {
          // Usar o alias principal, não a URL do deployment específico
          currentOrigin = 'https://n-training.vercel.app'
        }
        // Caso contrário, usar o origin atual
        else {
          currentOrigin = window.location.origin
        }
      } else {
        // Server-side fallback (nunca deve acontecer em client component)
        // Usar o domínio customizado como padrão
        currentOrigin = 'https://ntraining.ness.com.br'
      }
      
      // O redirectUrl deve ser apenas o caminho (relativo), não a URL completa
      const redirectPath = redirectTo 
        ? (redirectTo.startsWith('/') ? redirectTo : `/${redirectTo}`)
        : '/dashboard'

      // Construir a URL completa do callback
      // IMPORTANTE: Esta URL DEVE estar autorizada no Supabase
      const callbackUrl = `${currentOrigin}/auth/callback?next=${encodeURIComponent(redirectPath)}`
      
      // Log apenas em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.log('[GoogleSignIn] Origin:', currentOrigin)
        console.log('[GoogleSignIn] RedirectTo:', callbackUrl)
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Passar a URL completa do callback
          // O Supabase vai validar se esta URL está autorizada
          redirectTo: callbackUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      // Verificar se ainda está montado antes de atualizar estado
      if (!isMountedRef.current) return

      if (error) {
        console.error('[GoogleSignIn] Error details:', {
          message: error.message,
          status: error.status,
          error: error,
          redirectTo: callbackUrl,
          origin: currentOrigin
        })
        setIsLoading(false)
        
        // Construir mensagem de erro mais detalhada
        let errorMessage = error.message || 'Erro ao autenticar com Google'
        
        // Adicionar informações de debug se for um erro de redirect
        if (error.message?.includes('redirect') || error.message?.includes('URL')) {
          errorMessage += `. URL usada: ${callbackUrl}`
        }
        
        // Usar setTimeout para garantir que o redirecionamento aconteça após o estado ser atualizado
        // Nota: Não armazenamos timeoutId pois o redirecionamento deve acontecer mesmo se componente desmontar
        setTimeout(() => {
          if (isMountedRef.current) {
            window.location.href = `/auth/login?error=${encodeURIComponent(errorMessage)}`
          }
        }, 0)
        return
      }
      // Se não houver erro, o usuário será redirecionado para o Google
      // e depois para o callback, então não precisamos fazer nada aqui
    } catch (error) {
      // Verificar se ainda está montado antes de atualizar estado
      if (!isMountedRef.current) return
      
      console.error('Unexpected error:', error)
      setIsLoading(false)
      setTimeout(() => {
        if (isMountedRef.current) {
          window.location.href = `/auth/login?error=${encodeURIComponent('Erro inesperado ao autenticar com Google')}`
        }
      }, 0)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full bg-white text-gray-900 hover:bg-gray-100 border-gray-300 transition-colors"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Conectando...
        </>
      ) : (
        <>
          <Chrome className="h-4 w-4 mr-2" />
          Continuar com Google
        </>
      )}
    </Button>
  )
}

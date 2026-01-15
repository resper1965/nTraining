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
      // Usar window.location.origin para garantir que usamos a origem correta
      const currentOrigin = window.location.origin
      
      // O redirectUrl deve ser apenas o caminho (relativo), não a URL completa
      // Isso evita problemas de redirecionamento para localhost em produção
      const redirectPath = redirectTo 
        ? (redirectTo.startsWith('/') ? redirectTo : `/${redirectTo}`)
        : '/dashboard'

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Passar apenas o caminho relativo, não a URL completa
          // O callback route sempre usará o origin da requisição atual
          redirectTo: `${currentOrigin}/auth/callback?next=${encodeURIComponent(redirectPath)}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      // Verificar se ainda está montado antes de atualizar estado
      if (!isMountedRef.current) return

      if (error) {
        console.error('Error signing in with Google:', error)
        setIsLoading(false)
        // Usar setTimeout para garantir que o redirecionamento aconteça após o estado ser atualizado
        setTimeout(() => {
          window.location.href = `/auth/login?error=${encodeURIComponent(error.message)}`
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
        window.location.href = `/auth/login?error=${encodeURIComponent('Erro inesperado ao autenticar com Google')}`
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

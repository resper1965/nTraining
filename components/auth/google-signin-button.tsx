'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Chrome, Loader2 } from 'lucide-react'

interface GoogleSignInButtonProps {
  redirectTo?: string
}

export function GoogleSignInButton({ redirectTo }: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    
    try {
      const redirectUrl = redirectTo 
        ? `${window.location.origin}${redirectTo}`
        : `${window.location.origin}/dashboard`

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectUrl)}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        console.error('Error signing in with Google:', error)
        setIsLoading(false)
        // Redirect to login page with error
        window.location.href = `/auth/login?error=${encodeURIComponent(error.message)}`
      }
      // Se não houver erro, o usuário será redirecionado para o Google
      // e depois para o callback, então não precisamos fazer nada aqui
    } catch (error) {
      console.error('Unexpected error:', error)
      setIsLoading(false)
      window.location.href = `/auth/login?error=${encodeURIComponent('Erro inesperado ao autenticar com Google')}`
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

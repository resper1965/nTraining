import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Se houver erro do OAuth, redireciona para login com mensagem
  if (error) {
    const errorMessage = errorDescription 
      ? decodeURIComponent(errorDescription)
      : 'Erro ao autenticar com Google'
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(errorMessage)}`, requestUrl.origin)
    )
  }

  if (code) {
    try {
      const supabase = createClient()
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Error exchanging code for session:', exchangeError)
        return NextResponse.redirect(
          new URL(`/auth/login?error=${encodeURIComponent(exchangeError.message)}`, requestUrl.origin)
        )
      }

      if (data?.session) {
        // Verificar se o usuário tem perfil na tabela users
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('id, is_active')
          .eq('id', data.session.user.id)
          .single()

        // Se não houver perfil, pode ser um novo usuário do Google
        // O middleware ou a aplicação deve lidar com isso
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error checking user profile:', profileError)
        }

        // Redirecionar para a página solicitada ou dashboard
        return NextResponse.redirect(new URL(next, requestUrl.origin))
      }
    } catch (error) {
      console.error('Unexpected error in OAuth callback:', error)
      return NextResponse.redirect(
        new URL('/auth/login?error=Erro inesperado ao processar autenticação', requestUrl.origin)
      )
    }
  }

  // Se não houver code nem error, algo está errado
  return NextResponse.redirect(
    new URL('/auth/login?error=Erro ao autenticar com Google', requestUrl.origin)
  )
}

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  let next = requestUrl.searchParams.get('next') || '/dashboard'
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Normalizar o parâmetro 'next' para garantir que seja um caminho relativo
  // Se contiver localhost ou outra origem, extrair apenas o caminho
  if (next.startsWith('http://') || next.startsWith('https://')) {
    try {
      const nextUrl = new URL(next)
      next = nextUrl.pathname + nextUrl.search
    } catch {
      // Se não for uma URL válida, usar apenas o caminho ou default
      next = '/dashboard'
    }
  }

  // Garantir que 'next' seja um caminho válido (começando com /)
  if (!next.startsWith('/')) {
    next = '/' + next
  }

  // Usar sempre o origin da requisição atual (não confiar no parâmetro next)
  const currentOrigin = requestUrl.origin

  // Se houver erro do OAuth, redireciona para login com mensagem
  if (error) {
    const errorMessage = errorDescription 
      ? decodeURIComponent(errorDescription)
      : 'Erro ao autenticar com Google'
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(errorMessage)}`, currentOrigin)
    )
  }

  if (code) {
    try {
      const supabase = createClient()
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Error exchanging code for session:', exchangeError)
        return NextResponse.redirect(
          new URL(`/auth/login?error=${encodeURIComponent(exchangeError.message)}`, currentOrigin)
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

        // Redirecionar para a página solicitada usando o origin atual
        // Nunca usar o origin do parâmetro next - sempre usar o origin da requisição
        return NextResponse.redirect(new URL(next, currentOrigin))
      }
    } catch (error) {
      console.error('Unexpected error in OAuth callback:', error)
      return NextResponse.redirect(
        new URL('/auth/login?error=Erro inesperado ao processar autenticação', currentOrigin)
      )
    }
  }

  // Se não houver code nem error, algo está errado
  return NextResponse.redirect(
    new URL('/auth/login?error=Erro ao autenticar com Google', currentOrigin)
  )
}

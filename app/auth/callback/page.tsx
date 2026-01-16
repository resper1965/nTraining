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
        // Se já está autenticado, verificar se é superadmin antes de redirecionar
        const userId = existingSession.user.id
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('is_superadmin')
          .eq('id', userId)
          .maybeSingle()
        
        if (profileError) {
          console.error('[OAuth Callback] Error fetching user profile:', profileError)
        }
        
        let next = searchParams.get('next') || '/dashboard'
        
        // Se for superadmin e não houver 'next' customizado, redirecionar para /admin
        if (userProfile && userProfile.is_superadmin === true && !searchParams.get('next')) {
          next = '/admin'
        }
        
        // IMPORTANTE: Aguardar um pouco antes de redirecionar para garantir que o perfil está disponível
        console.log('[OAuth Callback] ✅ Sessão existente. Aguardando 500ms antes de redirecionar...')
        await new Promise(resolve => setTimeout(resolve, 500))
        
        if (!isMounted || processingComplete) return
        
        processingComplete = true
        console.log('[OAuth Callback] 🚀 Redirecionando para:', next, 'User ID:', userId)
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
            // Aguardar criação do perfil pelo trigger (para novos usuários OAuth)
            // Tentar até 5 vezes com delay de 500ms cada
            const userId = data.session.user.id
            let retries = 0
            const maxRetries = 5
            let profileExists = false
            
            while (retries < maxRetries && !profileExists && isMounted) {
              const { data: userProfile, error: profileError } = await supabase
                .from('users')
                .select('id')
                .eq('id', userId)
                .maybeSingle()
              
              if (profileError) {
                console.error('[OAuth Callback] Error checking profile existence:', profileError)
              }
              
              if (userProfile) {
                profileExists = true
                break
              }
              
              // Aguardar 500ms antes da próxima tentativa
              await new Promise(resolve => setTimeout(resolve, 500))
              retries++
            }
            
            // Verificar se componente ainda está montado após o retry loop
            if (!isMounted || processingComplete) return
            
            // Verificar se usuário é superadmin e redirecionar para /admin se for
            // IMPORTANTE: Se perfil não existir após retry, aguardar mais um pouco ou redirecionar para waiting-room
            const { data: userProfile, error: profileError } = await supabase
              .from('users')
              .select('is_superadmin, is_active')
              .eq('id', userId)
              .maybeSingle()
            
            if (profileError) {
              console.error('[OAuth Callback] Error fetching user profile:', profileError)
            }
            
            // Se perfil ainda não existe após retry, pode ser que o trigger ainda não processou
            // Neste caso, aguardar mais um pouco ou redirecionar para uma página que não dependa do perfil
            if (!userProfile && !profileExists) {
              console.warn('[OAuth Callback] Perfil não encontrado após retry loop. Aguardando mais...')
              // Aguardar mais 1 segundo e tentar novamente
              await new Promise(resolve => setTimeout(resolve, 1000))
              const { data: finalProfile } = await supabase
                .from('users')
                .select('is_superadmin, is_active')
                .eq('id', userId)
                .maybeSingle()
              
              if (!finalProfile) {
                console.error('[OAuth Callback] Perfil ainda não existe após aguardar. Aguardando mais 2 segundos antes de redirecionar.')
                // Aguardar mais 2 segundos - pode ser que o trigger esteja muito lento
                await new Promise(resolve => setTimeout(resolve, 2000))
                const { data: lastAttemptProfile } = await supabase
                  .from('users')
                  .select('is_superadmin, is_active')
                  .eq('id', userId)
                  .maybeSingle()
                
                if (!lastAttemptProfile) {
                  console.error('[OAuth Callback] Perfil AINDA não existe após 3.5s de espera. Isso pode indicar problema no trigger.')
                  console.error('[OAuth Callback] User ID:', userId)
                  console.error('[OAuth Callback] Vamos forçar redirecionamento para /dashboard - o layout vai lidar com isso.')
                  // Em vez de redirecionar para waiting-room (que também precisa do perfil),
                  // vamos redirecionar para dashboard e deixar o layout lidar
                  // Mas isso pode causar loop - melhor mostrar erro
                  setStatus('error')
                  setErrorMessage('Erro: perfil de usuário não foi criado automaticamente. Por favor, entre em contato com o suporte.')
                  const timeoutId = setTimeout(() => {
                    if (isMounted) {
                      // Tentar fazer logout e voltar para login
                      supabase.auth.signOut().then(() => {
                        router.push('/auth/login?error=Perfil%20não%20criado%20automaticamente')
                      })
                    }
                  }, 3000)
                  timeoutIds.push(timeoutId)
                  processingComplete = true
                  return
                }
                
                // Usar perfil encontrado na última tentativa
                const finalUserProfile = lastAttemptProfile
                
                // Verificar novamente se componente ainda está montado antes de redirecionar
                if (!isMounted || processingComplete) return
                
                let next = searchParams.get('next') || '/dashboard'
                
                // Se for superadmin e não houver 'next' customizado, redirecionar para /admin
                if (finalUserProfile.is_superadmin === true && !searchParams.get('next')) {
                  next = '/admin'
                } else if (!finalUserProfile.is_active && !finalUserProfile.is_superadmin) {
                  // Se não está ativo e não é superadmin, ir para waiting-room
                  next = '/auth/waiting-room'
                }
                
                // IMPORTANTE: Aguardar um pouco mais antes de redirecionar
                console.log('[OAuth Callback] ✅ Perfil encontrado após segunda tentativa. Aguardando 500ms...')
                await new Promise(resolve => setTimeout(resolve, 500))
                
                if (!isMounted || processingComplete) return
                
                processingComplete = true
                console.log('[OAuth Callback] 🚀 Redirecionando para:', next, 'User ID:', userId)
                if (isMounted) {
                  router.push(next)
                }
                return
              }
              
              // Usar perfil encontrado na segunda tentativa
              const finalUserProfile = finalProfile
              
              // Verificar novamente se componente ainda está montado antes de redirecionar
              if (!isMounted || processingComplete) return
              
              let next = searchParams.get('next') || '/dashboard'
              
              // Se for superadmin e não houver 'next' customizado, redirecionar para /admin
              if (finalUserProfile.is_superadmin === true && !searchParams.get('next')) {
                next = '/admin'
              } else if (!finalUserProfile.is_active && !finalUserProfile.is_superadmin) {
                // Se não está ativo e não é superadmin, ir para waiting-room
                next = '/auth/waiting-room'
              }
              
              // IMPORTANTE: Aguardar um pouco mais antes de redirecionar
              console.log('[OAuth Callback] ✅ Perfil encontrado após segunda tentativa (finalProfile). Aguardando 500ms...')
              await new Promise(resolve => setTimeout(resolve, 500))
              
              if (!isMounted || processingComplete) return
              
              processingComplete = true
              console.log('[OAuth Callback] 🚀 Redirecionando para:', next, 'User ID:', userId)
              if (isMounted) {
                router.push(next)
              }
              return
            }
            
            // Verificar novamente se componente ainda está montado antes de redirecionar
            if (!isMounted || processingComplete) return
            
            let next = searchParams.get('next') || '/dashboard'
            
            // Se for superadmin e não houver 'next' customizado, redirecionar para /admin
            // Verificar explicitamente que userProfile existe e is_superadmin é true
            if (userProfile && userProfile.is_superadmin === true && !searchParams.get('next')) {
              next = '/admin'
            } else if (userProfile && !userProfile.is_active && !userProfile.is_superadmin) {
              // Se não está ativo e não é superadmin, ir para waiting-room
              next = '/auth/waiting-room'
            }
            
            // IMPORTANTE: Aguardar um pouco mais antes de redirecionar
            // para garantir que o perfil está completamente criado e disponível
            console.log('[OAuth Callback] ✅ Perfil encontrado. Aguardando 500ms antes de redirecionar para garantir disponibilidade...')
            await new Promise(resolve => setTimeout(resolve, 500))
            
            // Verificar uma última vez se componente ainda está montado
            if (!isMounted || processingComplete) return
            
            processingComplete = true
            console.log('[OAuth Callback] 🚀 Redirecionando para:', next, 'User ID:', userId)
            if (isMounted) {
              router.push(next)
            }
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
              // Sessão já existe (do cache), aguardar um pouco antes de redirecionar
              const next = searchParams.get('next') || '/dashboard'
              console.log('[OAuth Callback] ✅ Sessão existente (hash flow). Aguardando 500ms...')
              await new Promise(resolve => setTimeout(resolve, 500))
              
              if (!isMounted || processingComplete) return
              
              processingComplete = true
              console.log('[OAuth Callback] 🚀 Redirecionando para:', next)
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
              // Obter user ID uma vez fora do loop (evita múltiplas chamadas)
              const { data: userData, error: userError } = await supabase.auth.getUser()
              
              if (userError || !userData?.user?.id) {
                console.error('[OAuth Callback] Error getting user:', userError)
                setStatus('error')
                setErrorMessage(userError?.message || 'Erro ao obter dados do usuário')
                const timeoutId = setTimeout(() => {
                  if (isMounted) {
                    router.push(`/auth/login?error=${encodeURIComponent(userError?.message || 'Erro ao autenticar')}`)
                  }
                }, 2000)
                timeoutIds.push(timeoutId)
                return
              }
              
              const userId = userData.user.id
              
              // Aguardar criação do perfil pelo trigger (para novos usuários OAuth)
              // Tentar até 5 vezes com delay de 500ms cada
              let retries = 0
              const maxRetries = 5
              let profileExists = false
              
              while (retries < maxRetries && !profileExists && isMounted) {
                const { data: userProfile, error: profileError } = await supabase
                  .from('users')
                  .select('id')
                  .eq('id', userId)
                  .maybeSingle()
                
                if (profileError) {
                  console.error('[OAuth Callback] Error checking profile existence:', profileError)
                }
                
                if (userProfile) {
                  profileExists = true
                  break
                }
                
                // Aguardar 500ms antes da próxima tentativa
                await new Promise(resolve => setTimeout(resolve, 500))
                retries++
              }
              
              // Verificar se componente ainda está montado após o retry loop
              if (!isMounted || processingComplete) return
              
              // Verificar se usuário é superadmin e redirecionar para /admin se for
              // IMPORTANTE: Se perfil não existir após retry, aguardar mais um pouco ou redirecionar para waiting-room
              const { data: userProfile, error: profileError } = await supabase
                .from('users')
                .select('is_superadmin, is_active')
                .eq('id', userId)
                .maybeSingle()
              
              if (profileError) {
                console.error('[OAuth Callback] Error fetching user profile:', profileError)
              }
              
            // Se perfil ainda não existe após retry, pode ser que o trigger ainda não processou
            // Neste caso, aguardar mais um pouco ou tentar criar manualmente
            if (!userProfile && !profileExists) {
              console.warn('[OAuth Callback] Perfil não encontrado após retry loop. Aguardando mais...')
              console.warn('[OAuth Callback] User ID:', userId)
              // Aguardar mais 2 segundos (totalizando até 4.5s de espera)
              await new Promise(resolve => setTimeout(resolve, 2000))
              const { data: finalProfile, error: finalError } = await supabase
                .from('users')
                .select('is_superadmin, is_active')
                .eq('id', userId)
                .maybeSingle()
              
              if (finalError) {
                console.error('[OAuth Callback] Erro ao buscar perfil na segunda tentativa:', finalError)
                console.error('[OAuth Callback] Erro pode ser RLS ou perfil realmente não existe')
              }
              
              if (!finalProfile) {
                console.error('[OAuth Callback] ⚠️ PERFIL NÃO ENCONTRADO após 4.5s de espera')
                console.error('[OAuth Callback] User ID:', userId)
                console.error('[OAuth Callback] Isso pode indicar:')
                console.error('[OAuth Callback] 1. Trigger handle_new_user() não está funcionando')
                console.error('[OAuth Callback] 2. RLS está bloqueando a query SELECT')
                console.error('[OAuth Callback] 3. Problema de timing/sincronização')
                console.error('[OAuth Callback] 4. Usuário não foi inserido em auth.users corretamente')
                
                // Verificar se o usuário existe no auth.users
                const { data: authUser } = await supabase.auth.getUser()
                console.log('[OAuth Callback] Auth user existe?', !!authUser?.user)
                console.log('[OAuth Callback] Auth user ID:', authUser?.user?.id)
                
                // Mostrar erro informativo ao usuário
                setStatus('error')
                setErrorMessage('Erro ao criar perfil de usuário. Isso pode levar alguns segundos. Por favor, recarregue a página ou tente fazer login novamente.')
                
                // Aguardar mais 3 segundos e tentar uma última vez antes de desistir
                await new Promise(resolve => setTimeout(resolve, 3000))
                
                const { data: lastChanceProfile, error: lastError } = await supabase
                  .from('users')
                  .select('is_superadmin, is_active')
                  .eq('id', userId)
                  .maybeSingle()
                
                if (lastError) {
                  console.error('[OAuth Callback] Erro na última tentativa:', lastError)
                  console.error('[OAuth Callback] Código do erro:', lastError.code)
                  console.error('[OAuth Callback] Mensagem:', lastError.message)
                }
                
                if (lastChanceProfile) {
                  console.log('[OAuth Callback] ✅ Perfil encontrado na última tentativa!')
                  const finalUserProfile = lastChanceProfile
                  if (!isMounted || processingComplete) return
                  
                  let next = searchParams.get('next') || '/dashboard'
                  if (finalUserProfile.is_superadmin === true && !searchParams.get('next')) {
                    next = '/admin'
                  } else if (!finalUserProfile.is_active && !finalUserProfile.is_superadmin) {
                    next = '/auth/waiting-room'
                  }
                  
                  // IMPORTANTE: Aguardar um pouco mais antes de redirecionar
                  console.log('[OAuth Callback] ✅ Perfil encontrado na última tentativa. Aguardando 500ms...')
                  await new Promise(resolve => setTimeout(resolve, 500))
                  
                  if (!isMounted || processingComplete) return
                  
                  processingComplete = true
                  console.log('[OAuth Callback] 🚀 Redirecionando para:', next, 'User ID:', userId)
                  if (isMounted) {
                    router.push(next)
                  }
                  return
                }
                
                // Se ainda não existir após 7.5s total, mostrar erro e redirecionar
                console.error('[OAuth Callback] ❌ PERFIL AINDA NÃO EXISTE após 7.5s. Redirecionando para login.')
                setErrorMessage('Erro: perfil de usuário não foi criado automaticamente após vários segundos. Por favor, entre em contato com o suporte ou tente fazer login novamente.')
                const timeoutId = setTimeout(() => {
                  if (isMounted) {
                    // Fazer logout e voltar para login
                    supabase.auth.signOut().then(() => {
                      router.push('/auth/login?error=Perfil%20não%20criado%20automaticamente')
                    })
                  }
                }, 5000)
                timeoutIds.push(timeoutId)
                processingComplete = true
                return
              }
              
              // Usar perfil encontrado na segunda tentativa
              const finalUserProfile = finalProfile
              
              // Verificar novamente se componente ainda está montado antes de redirecionar
              if (!isMounted || processingComplete) return
              
              let next = searchParams.get('next') || '/dashboard'
              
              // Se for superadmin e não houver 'next' customizado, redirecionar para /admin
              if (finalUserProfile.is_superadmin === true && !searchParams.get('next')) {
                next = '/admin'
              } else if (!finalUserProfile.is_active && !finalUserProfile.is_superadmin) {
                // Se não está ativo e não é superadmin, ir para waiting-room
                next = '/auth/waiting-room'
              }
              
              // Limpar o hash da URL
              window.history.replaceState({}, '', window.location.pathname + window.location.search)
              
              processingComplete = true
              if (isMounted) {
                router.push(next)
              }
              return
            }
            
            // Se chegou aqui, o perfil existe após o retry loop ou segunda tentativa
            // Verificar novamente se componente ainda está montado antes de redirecionar
            if (!isMounted || processingComplete) return
            
            let next = searchParams.get('next') || '/dashboard'
            
            // Se for superadmin e não houver 'next' customizado, redirecionar para /admin
            // Verificar explicitamente que userProfile existe e is_superadmin é true
            if (userProfile && userProfile.is_superadmin === true && !searchParams.get('next')) {
              next = '/admin'
            } else if (userProfile && !userProfile.is_active && !userProfile.is_superadmin) {
              // Se não está ativo e não é superadmin, ir para waiting-room
              next = '/auth/waiting-room'
            }
            
            // IMPORTANTE: Aguardar um pouco mais antes de redirecionar
            // para garantir que o perfil está completamente criado e disponível
            console.log('[OAuth Callback] ✅ Perfil encontrado (hash flow). Aguardando 500ms antes de redirecionar...')
            await new Promise(resolve => setTimeout(resolve, 500))
            
            // Limpar o hash da URL
            window.history.replaceState({}, '', window.location.pathname + window.location.search)
            
            // Verificar uma última vez antes de redirecionar
            if (!isMounted || processingComplete) return
            
            // Marcar como completo antes de redirecionar
            processingComplete = true
            
            console.log('[OAuth Callback] 🚀 Redirecionando para:', next, 'User ID:', userId)
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
        processingComplete = true
      }
      
      // FALLBACK: Se chegou aqui e ainda não processou nada, garantir redirecionamento
      // Isso evita que o callback não redirecione e o usuário fique preso
      if (!processingComplete && isMounted) {
        console.warn('[OAuth Callback] ⚠️ Callback não processou nada após todas as verificações')
        console.warn('[OAuth Callback] Redirecionando para login por segurança')
        setStatus('error')
        setErrorMessage('Erro ao processar autenticação. Redirecionando...')
        const fallbackTimeout = setTimeout(() => {
          if (isMounted) {
            router.push('/auth/login?error=Nenhum%20dado%20de%20autenticação%20encontrado')
          }
        }, 3000)
        timeoutIds.push(fallbackTimeout)
        processingComplete = true
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
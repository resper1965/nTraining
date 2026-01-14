import { redirect } from 'next/navigation'

// Usar revalidate em vez de force-dynamic para evitar loops
export const revalidate = 0

export default async function Home() {
  // Simplificado: deixar middleware fazer todo o trabalho de redirect
  // Isso evita loops e queries duplicadas
  // O middleware já verifica auth e redireciona para /admin ou /dashboard
  // Se não autenticado, redireciona para /auth/login
  
  // Apenas redirecionar para dashboard como fallback
  // O middleware vai interceptar e redirecionar corretamente
  redirect('/dashboard')
}

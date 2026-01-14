// Simplificado: deixar middleware fazer todo o trabalho de redirect
// Isso evita loops e queries duplicadas
// O middleware já verifica auth e redireciona para /admin ou /dashboard
// Se não autenticado, redireciona para /auth/login

export default function Home() {
  // Não fazer nada aqui - o middleware vai interceptar e redirecionar
  // Isso evita loops de redirect e queries duplicadas
  return null
}

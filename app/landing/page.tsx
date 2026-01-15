import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  BookOpen,
  Award,
  Users,
  Shield,
  CheckCircle2,
  ArrowRight,
  Play,
  BarChart3,
  FileText,
  Target,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/landing" className="flex items-center gap-2">
              <span className="font-display text-xl font-medium text-white">
                n<span className="text-primary">.</span>training
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">
                Política de Privacidade
              </Link>
              <Link href="/terms" className="text-slate-400 hover:text-white text-sm transition-colors">
                Termos de Serviço
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                  Entrar
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-primary hover:bg-[#0099cc] text-white">
                  Começar Agora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 md:py-32 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-6 leading-tight">
            Plataforma de Treinamento em
            <span className="text-primary"> Segurança da Informação</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Capacite sua equipe com cursos especializados, trilhas de aprendizado estruturadas e certificados reconhecidos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-[#0099cc] text-white">
                <Play className="h-4 w-4 mr-2" />
                Começar Agora
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-700 text-slate-300 hover:bg-slate-800">
                Já tenho uma conta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-medium text-white mb-4 leading-tight">
            Recursos Poderosos
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed">
            Tudo que você precisa para criar e gerenciar programas de treinamento eficazes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
            <CardHeader>
              <BookOpen className="h-8 w-8 text-primary mb-4" />
              <CardTitle className="font-display text-xl font-medium text-white mb-2">Cursos Interativos</CardTitle>
              <CardDescription className="text-slate-300 leading-relaxed">
                Crie cursos com vídeos, textos, PDFs e quizzes interativos
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
            <CardHeader>
              <Target className="h-8 w-8 text-primary mb-4" />
              <CardTitle className="font-display text-xl font-medium text-white mb-2">Trilhas de Aprendizado</CardTitle>
              <CardDescription className="text-slate-300 leading-relaxed">
                Organize cursos em sequências estruturadas para desenvolvimento progressivo
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
            <CardHeader>
              <Award className="h-8 w-8 text-primary mb-4" />
              <CardTitle className="font-display text-xl font-medium text-white mb-2">Certificados Digitais</CardTitle>
              <CardDescription className="text-slate-300 leading-relaxed">
                Gere certificados em PDF automaticamente ao concluir cursos
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-primary mb-4" />
              <CardTitle className="font-display text-xl font-medium text-white mb-2">Acompanhamento de Progresso</CardTitle>
              <CardDescription className="text-slate-300 leading-relaxed">
                Monitore o progresso dos alunos em tempo real com métricas detalhadas
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-4" />
              <CardTitle className="font-display text-xl font-medium text-white mb-2">Multi-tenant</CardTitle>
              <CardDescription className="text-slate-300 leading-relaxed">
                Suporte a múltiplas organizações com isolamento completo de dados
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-4" />
              <CardTitle className="font-display text-xl font-medium text-white mb-2">Segurança e Privacidade</CardTitle>
              <CardDescription className="text-slate-300 leading-relaxed">
                Dados protegidos com criptografia e conformidade com LGPD
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-medium text-white mb-4 leading-tight">
              Por que escolher n.training?
            </h2>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-display text-xl font-medium text-white mb-2">Foco em Segurança da Informação</h3>
                <p className="text-slate-300 leading-relaxed">
                  Conteúdo especializado desenvolvido por especialistas em segurança da informação
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-display text-xl font-medium text-white mb-2">Interface Moderna e Intuitiva</h3>
                <p className="text-slate-300 leading-relaxed">
                  Experiência de usuário otimizada para facilitar o aprendizado
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-display text-xl font-medium text-white mb-2">Acesso Multi-dispositivo</h3>
                <p className="text-slate-300 leading-relaxed">
                  Acesse seus cursos de qualquer dispositivo, a qualquer momento
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-display text-xl font-medium text-white mb-2">Suporte Completo</h3>
                <p className="text-slate-300 leading-relaxed">
                  Sistema de notificações e suporte integrado para melhor experiência
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-slate-900 border-slate-800 max-w-3xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-3xl md:text-4xl font-medium text-white mb-4 leading-tight">
              Pronto para começar?
            </CardTitle>
            <CardDescription className="text-slate-300 text-lg leading-relaxed">
              Junte-se a empresas que já estão capacitando suas equipes com n.training
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-[#0099cc] text-white">
                Criar Conta Gratuita
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <span className="font-display text-xl font-medium text-white">
                n<span className="text-primary">.</span>training
              </span>
              <span className="text-slate-400 text-sm">
                Powered by{' '}
                <span className="text-white font-medium">
                  ness<span className="text-primary">.</span>
                </span>
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Política de Privacidade
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Termos de Serviço
              </Link>
              <Link href="/auth/login" className="hover:text-white transition-colors">
                Entrar
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

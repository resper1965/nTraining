import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText, Scale, AlertCircle, Shield } from 'lucide-react'

export const metadata = {
  title: 'Termos de Serviço - n.training',
  description: 'Termos de serviço da plataforma n.training',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/landing" className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-medium text-white">
              n<span className="text-[#00ade8]">.</span>training
            </h1>
          </Link>
          <Link href="/landing">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-white mb-4">
            Termos de Serviço
          </h1>
          <p className="text-slate-400">
            Última atualização: {new Date().toLocaleDateString('pt-BR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          {/* Introdução */}
          <section className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6 text-[#00ade8]" />
              1. Aceitação dos Termos
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Ao acessar e utilizar a plataforma <strong>n.training</strong>, você concorda em cumprir e estar vinculado a estes Termos de Serviço. 
              Se você não concorda com qualquer parte destes termos, não deve utilizar nossa plataforma.
            </p>
            <p className="text-slate-300 leading-relaxed mt-4">
              Estes termos se aplicam a todos os usuários da plataforma, incluindo organizações, administradores e alunos.
            </p>
          </section>

          {/* Definições */}
          <section className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
              <Scale className="h-6 w-6 text-[#00ade8]" />
              2. Definições
            </h2>
            <div className="space-y-3 text-slate-300">
              <p><strong className="text-white">Plataforma:</strong> Refere-se ao serviço n.training, incluindo todos os seus recursos, funcionalidades e conteúdo.</p>
              <p><strong className="text-white">Usuário:</strong> Qualquer pessoa que acessa ou utiliza a plataforma.</p>
              <p><strong className="text-white">Organização:</strong> Entidade que contrata os serviços da plataforma para seus membros.</p>
              <p><strong className="text-white">Conteúdo:</strong> Materiais educacionais, cursos, vídeos, documentos e qualquer outro material disponível na plataforma.</p>
              <p><strong className="text-white">Conta:</strong> Credenciais e perfil de usuário único na plataforma.</p>
            </div>
          </section>

          {/* Uso da Plataforma */}
          <section className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6 text-[#00ade8]" />
              3. Uso Aceitável da Plataforma
            </h2>
            <div className="space-y-4 text-slate-300">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">3.1 Você concorda em:</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Fornecer informações precisas e atualizadas ao criar sua conta</li>
                  <li>Manter a segurança de suas credenciais de acesso</li>
                  <li>Usar a plataforma apenas para fins educacionais legítimos</li>
                  <li>Respeitar os direitos de propriedade intelectual de terceiros</li>
                  <li>Cumprir com todas as leis e regulamentações aplicáveis</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">3.2 Você NÃO deve:</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Compartilhar suas credenciais de acesso com terceiros</li>
                  <li>Tentar acessar contas de outros usuários</li>
                  <li>Usar a plataforma para atividades ilegais ou fraudulentas</li>
                  <li>Copiar, modificar ou distribuir conteúdo sem autorização</li>
                  <li>Interferir no funcionamento da plataforma ou em sua segurança</li>
                  <li>Usar bots, scripts ou outros meios automatizados sem autorização</li>
                  <li>Violar direitos de propriedade intelectual</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contas e Registro */}
          <section className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">
              4. Contas de Usuário
            </h2>
            <div className="space-y-4 text-slate-300">
              <p>4.1 Você é responsável por manter a confidencialidade de suas credenciais de acesso e por todas as atividades que ocorrem em sua conta.</p>
              <p>4.2 Você deve notificar imediatamente a n.training sobre qualquer uso não autorizado de sua conta.</p>
              <p>4.3 A n.training reserva-se o direito de suspender ou encerrar contas que violem estes termos ou que sejam usadas de forma inadequada.</p>
              <p>4.4 Organizações podem ter múltiplos usuários associados, e o administrador da organização é responsável pelo gerenciamento desses usuários.</p>
            </div>
          </section>

          {/* Conteúdo */}
          <section className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">
              5. Conteúdo e Propriedade Intelectual
            </h2>
            <div className="space-y-4 text-slate-300">
              <p>5.1 Todo o conteúdo disponível na plataforma, incluindo mas não limitado a cursos, vídeos, documentos e materiais educacionais, é propriedade da n.training ou de seus licenciadores.</p>
              <p>5.2 Você recebe uma licença limitada, não exclusiva e não transferível para acessar e usar o conteúdo apenas para fins educacionais pessoais.</p>
              <p>5.3 Você não pode reproduzir, distribuir, modificar, criar obras derivadas, exibir publicamente ou usar comercialmente qualquer conteúdo sem autorização prévia por escrito.</p>
              <p>5.4 Organizações podem ter conteúdo personalizado e exclusivo, que permanece propriedade da organização ou da n.training, conforme acordado em contrato específico.</p>
            </div>
          </section>

          {/* Pagamentos e Assinaturas */}
          <section className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">
              6. Pagamentos e Assinaturas
            </h2>
            <div className="space-y-4 text-slate-300">
              <p>6.1 Organizações que utilizam serviços pagos concordam em pagar todas as taxas e encargos associados conforme o plano de assinatura escolhido.</p>
              <p>6.2 As assinaturas são renovadas automaticamente, a menos que canceladas antes do final do período de cobrança.</p>
              <p>6.3 A n.training reserva-se o direito de alterar preços com aviso prévio de 30 dias.</p>
              <p>6.4 Reembolsos são tratados caso a caso, conforme nossa política de reembolso.</p>
            </div>
          </section>

          {/* Privacidade */}
          <section className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">
              7. Privacidade
            </h2>
            <p className="text-slate-300 leading-relaxed">
              O uso de suas informações pessoais é regido por nossa <Link href="/privacy" className="text-[#00ade8] hover:underline">Política de Privacidade</Link>, 
              que faz parte integrante destes Termos de Serviço. Ao utilizar a plataforma, você concorda com a coleta e uso de suas informações conforme descrito na Política de Privacidade.
            </p>
          </section>

          {/* Limitação de Responsabilidade */}
          <section className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-[#00ade8]" />
              8. Limitação de Responsabilidade
            </h2>
            <div className="space-y-4 text-slate-300">
              <p>8.1 A plataforma é fornecida &quot;como está&quot; e &quot;conforme disponível&quot;. Não garantimos que a plataforma será ininterrupta, segura ou livre de erros.</p>
              <p>8.2 A n.training não se responsabiliza por quaisquer danos diretos, indiretos, incidentais ou consequenciais resultantes do uso ou impossibilidade de uso da plataforma.</p>
              <p>8.3 A n.training não garante a precisão, completude ou utilidade de qualquer conteúdo disponível na plataforma.</p>
              <p>8.4 Em nenhuma circunstância a responsabilidade total da n.training excederá o valor pago pela organização nos últimos 12 meses.</p>
            </div>
          </section>

          {/* Modificações dos Termos */}
          <section className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">
              9. Modificações dos Termos
            </h2>
            <p className="text-slate-300 leading-relaxed">
              A n.training reserva-se o direito de modificar estes Termos de Serviço a qualquer momento. 
              Modificações significativas serão comunicadas aos usuários com pelo menos 30 dias de antecedência. 
              O uso continuado da plataforma após as modificações constitui aceitação dos novos termos.
            </p>
          </section>

          {/* Rescisão */}
          <section className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">
              10. Rescisão
            </h2>
            <div className="space-y-4 text-slate-300">
              <p>10.1 Você pode encerrar sua conta a qualquer momento através das configurações da conta ou entrando em contato conosco.</p>
              <p>10.2 A n.training pode suspender ou encerrar sua conta imediatamente se você violar estes termos ou se houver atividade suspeita ou fraudulenta.</p>
              <p>10.3 Após a rescisão, seu direito de usar a plataforma cessará imediatamente, e podemos excluir sua conta e dados, conforme nossa Política de Privacidade.</p>
            </div>
          </section>

          {/* Lei Aplicável */}
          <section className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">
              11. Lei Aplicável
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Estes Termos de Serviço são regidos pelas leis do Brasil. Qualquer disputa relacionada a estes termos será resolvida nos tribunais competentes do Brasil.
            </p>
          </section>

          {/* Contato */}
          <section className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">
              12. Contato
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Se você tiver dúvidas sobre estes Termos de Serviço, entre em contato conosco:
            </p>
            <div className="space-y-2 text-slate-300">
              <p><strong className="text-white">Plataforma:</strong> n.training</p>
              <p><strong className="text-white">Email:</strong> suporte@ness.com.br</p>
              <p><strong className="text-white">Website:</strong> <Link href="/" className="text-[#00ade8] hover:underline">ntraining.ness.com.br</Link></p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

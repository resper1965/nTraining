import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Shield, Lock, Database, Mail, Globe } from 'lucide-react'

export const metadata = {
  title: 'Política de Privacidade - n.training',
  description: 'Política de privacidade da plataforma n.training',
}

export default function PrivacyPage() {
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
            Política de Privacidade
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
              <Shield className="h-6 w-6 text-[#00ade8]" />
              1. Introdução
            </h2>
            <p className="text-slate-300 leading-relaxed">
              A <strong>n.training</strong> (&quot;nós&quot;, &quot;nosso&quot; ou &quot;plataforma&quot;) está comprometida em proteger a privacidade 
              e segurança dos dados pessoais de nossos usuários. Esta Política de Privacidade descreve como coletamos, 
              usamos, armazenamos e protegemos suas informações pessoais quando você utiliza nossa plataforma de 
              treinamento em Segurança da Informação.
            </p>
          </section>

          {/* Dados Coletados */}
          <section className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
              <Database className="h-6 w-6 text-[#00ade8]" />
              2. Dados Coletados
            </h2>
            
            <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.1. Dados Fornecidos por Você</h3>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li><strong>Informações de Conta:</strong> Nome completo, endereço de e-mail, senha (criptografada)</li>
              <li><strong>Informações Profissionais:</strong> Cargo, departamento, organização</li>
              <li><strong>Dados de Perfil:</strong> Foto de perfil (opcional), preferências de notificação</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.2. Dados Coletados Automaticamente</h3>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li><strong>Dados de Uso:</strong> Progresso em cursos, tempo de estudo, tentativas de quiz</li>
              <li><strong>Dados Técnicos:</strong> Endereço IP, tipo de navegador, sistema operacional</li>
              <li><strong>Cookies:</strong> Utilizamos cookies de sessão para autenticação e funcionalidade da plataforma</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.3. Dados de Terceiros</h3>
            <p className="text-slate-300 leading-relaxed">
              Quando você faz login usando <strong>Google OAuth</strong>, coletamos informações básicas do seu perfil Google 
              (nome, e-mail, foto) conforme autorizado por você durante o processo de autenticação.
            </p>
          </section>

          {/* Uso dos Dados */}
          <section className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
              <Globe className="h-6 w-6 text-[#00ade8]" />
              3. Como Utilizamos Seus Dados
            </h2>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li>Fornecer e melhorar nossos serviços de treinamento</li>
              <li>Gerenciar sua conta e autenticação</li>
              <li>Rastrear seu progresso em cursos e trilhas de aprendizado</li>
              <li>Gerar certificados de conclusão</li>
              <li>Enviar notificações sobre cursos, prazos e atualizações (via e-mail e notificações in-app)</li>
              <li>Cumprir obrigações legais e regulatórias</li>
              <li>Prevenir fraudes e garantir a segurança da plataforma</li>
            </ul>
          </section>

          {/* Tecnologias Utilizadas */}
          <section className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
              <Lock className="h-6 w-6 text-[#00ade8]" />
              4. Tecnologias e Serviços de Terceiros
            </h2>
            
            <h3 className="text-xl font-semibold text-white mt-6 mb-3">4.1. Supabase (Banco de Dados e Autenticação)</h3>
            <p className="text-slate-300 leading-relaxed mb-3">
              Utilizamos <strong>Supabase</strong> como nosso provedor de banco de dados PostgreSQL e serviço de autenticação. 
              O Supabase armazena seus dados pessoais e gerencia a autenticação de forma segura.
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li><strong>Dados Armazenados:</strong> Informações de perfil, progresso em cursos, certificados</li>
              <li><strong>Localização:</strong> Dados armazenados em servidores do Supabase</li>
              <li><strong>Segurança:</strong> Criptografia em trânsito (TLS) e em repouso</li>
              <li><strong>Política de Privacidade:</strong> <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#00ade8] hover:underline">https://supabase.com/privacy</a></li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">4.2. Google OAuth (Autenticação)</h3>
            <p className="text-slate-300 leading-relaxed mb-3">
              Oferecemos a opção de fazer login usando sua conta Google através do serviço <strong>Google OAuth 2.0</strong>.
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li><strong>Dados Coletados:</strong> Nome, e-mail, foto de perfil (conforme autorizado)</li>
              <li><strong>Uso:</strong> Apenas para autenticação e criação de perfil</li>
              <li><strong>Política de Privacidade:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#00ade8] hover:underline">https://policies.google.com/privacy</a></li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">4.3. Resend (Envio de E-mails)</h3>
            <p className="text-slate-300 leading-relaxed mb-3">
              Utilizamos <strong>Resend</strong> para envio de e-mails transacionais (notificações, recuperação de senha, etc.).
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li><strong>Dados Utilizados:</strong> Endereço de e-mail, nome (para personalização)</li>
              <li><strong>Uso:</strong> Apenas para envio de e-mails relacionados à plataforma</li>
              <li><strong>Política de Privacidade:</strong> <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#00ade8] hover:underline">https://resend.com/legal/privacy-policy</a></li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">4.4. Vercel (Hospedagem)</h3>
            <p className="text-slate-300 leading-relaxed mb-3">
              Nossa aplicação é hospedada na plataforma <strong>Vercel</strong>, que processa requisições e pode coletar 
              dados técnicos (endereços IP, logs) para fins operacionais.
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li><strong>Dados Coletados:</strong> Endereços IP, logs de acesso, dados técnicos de requisições</li>
              <li><strong>Política de Privacidade:</strong> <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#00ade8] hover:underline">https://vercel.com/legal/privacy-policy</a></li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">4.5. OpenAI (Funcionalidades de IA - Opcional)</h3>
            <p className="text-slate-300 leading-relaxed mb-3">
              Para funcionalidades de geração de conteúdo com IA (Course Architect), utilizamos <strong>OpenAI</strong>.
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li><strong>Dados Utilizados:</strong> Apenas conteúdo fornecido pelo administrador (não dados pessoais de usuários)</li>
              <li><strong>Uso:</strong> Geração de estruturas de cursos baseadas em documentos fornecidos</li>
              <li><strong>Política de Privacidade:</strong> <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#00ade8] hover:underline">https://openai.com/policies/privacy-policy</a></li>
            </ul>
          </section>

          {/* Segurança */}
          <section className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6 text-[#00ade8]" />
              5. Segurança dos Dados
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados pessoais:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li><strong>Criptografia:</strong> Dados transmitidos via TLS/SSL e armazenados de forma criptografada</li>
              <li><strong>Autenticação Segura:</strong> Senhas armazenadas com hash (nunca em texto plano)</li>
              <li><strong>Row Level Security (RLS):</strong> Isolamento de dados por organização (multi-tenant seguro)</li>
              <li><strong>Controle de Acesso:</strong> Sistema de permissões baseado em roles (admin, manager, student)</li>
              <li><strong>Monitoramento:</strong> Logs de segurança e monitoramento de atividades suspeitas</li>
            </ul>
          </section>

          {/* Retenção */}
          <section className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">
              6. Retenção de Dados
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Mantemos seus dados pessoais enquanto sua conta estiver ativa ou conforme necessário para fornecer nossos serviços. 
              Dados de progresso e certificados são mantidos para fins de histórico e comprovação. Você pode solicitar a exclusão 
              de sua conta a qualquer momento, e seus dados pessoais serão removidos, exceto quando a retenção for necessária 
              para cumprir obrigações legais.
            </p>
          </section>

          {/* Direitos do Usuário */}
          <section className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">
              7. Seus Direitos (LGPD)
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Conforme a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li><strong>Acesso:</strong> Solicitar acesso aos seus dados pessoais</li>
              <li><strong>Correção:</strong> Solicitar correção de dados incompletos ou desatualizados</li>
              <li><strong>Exclusão:</strong> Solicitar exclusão de dados desnecessários ou excessivos</li>
              <li><strong>Portabilidade:</strong> Solicitar portabilidade dos seus dados</li>
              <li><strong>Revogação:</strong> Revogar consentimento a qualquer momento</li>
              <li><strong>Oposição:</strong> Opor-se ao tratamento de dados em certas circunstâncias</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-4">
              Para exercer seus direitos, entre em contato conosco através do e-mail de suporte da sua organização 
              ou através do administrador da plataforma.
            </p>
          </section>

          {/* Cookies */}
          <section className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">
              8. Cookies e Tecnologias Similares
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Utilizamos cookies e tecnologias similares para:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li><strong>Autenticação:</strong> Manter sua sessão ativa</li>
              <li><strong>Funcionalidade:</strong> Lembrar suas preferências e configurações</li>
              <li><strong>Segurança:</strong> Proteger contra atividades fraudulentas</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-4">
              Você pode gerenciar cookies através das configurações do seu navegador, mas isso pode afetar a funcionalidade 
              da plataforma.
            </p>
          </section>

          {/* Compartilhamento */}
          <section className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">
              9. Compartilhamento de Dados
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins comerciais. 
              Compartilhamos dados apenas:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mt-4">
              <li>Com provedores de serviços (Supabase, Resend, Vercel) que nos ajudam a operar a plataforma</li>
              <li>Quando exigido por lei ou ordem judicial</li>
              <li>Para proteger nossos direitos legais ou prevenir fraudes</li>
              <li>Com sua organização (administradores podem ver dados de usuários da organização)</li>
            </ul>
          </section>

          {/* Menores */}
          <section className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">
              10. Privacidade de Menores
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Nossa plataforma não é destinada a menores de 18 anos. Não coletamos intencionalmente dados pessoais de menores. 
              Se tomarmos conhecimento de que coletamos dados de um menor, tomaremos medidas para excluir essas informações 
              imediatamente.
            </p>
          </section>

          {/* Alterações */}
          <section className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">
              11. Alterações nesta Política
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças significativas 
              através de e-mail ou notificação na plataforma. A data da última atualização está indicada no topo desta página.
            </p>
          </section>

          {/* Contato */}
          <section className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
              <Mail className="h-6 w-6 text-[#00ade8]" />
              12. Contato
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos seus dados pessoais, 
              entre em contato:
            </p>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <p className="text-slate-300">
                <strong className="text-white">n.training</strong><br />
                Plataforma de Treinamento em Segurança da Informação<br />
                Powered by <strong className="text-white">ness<span className="text-[#00ade8]">.</span></strong>
              </p>
              <p className="text-slate-400 text-sm mt-2">
                Para questões sobre privacidade, entre em contato com o administrador da sua organização 
                ou através do suporte da plataforma.
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-center">
          <Link href="/landing">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para a página inicial
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}

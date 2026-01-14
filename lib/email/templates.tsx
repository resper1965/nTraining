import React from 'react'

interface EmailTemplateProps {
  userName: string
  [key: string]: any
}

// Base email wrapper
export function EmailWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#00ade8', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ color: '#ffffff', margin: 0 }}>n.training</h1>
      </div>
      <div style={{ padding: '40px 20px', backgroundColor: '#f8fafc' }}>
        {children}
      </div>
      <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
        <p>© {new Date().getFullYear()} n.training - Powered by <span style={{ color: '#00ade8' }}>ness.</span> Todos os direitos reservados.</p>
      </div>
    </div>
  )
}

// Welcome email
export function WelcomeEmail({ userName }: EmailTemplateProps) {
  return (
    <EmailWrapper>
      <h2 style={{ color: '#0f172a' }}>Bem-vindo ao n.training, {userName}!</h2>
      <p style={{ color: '#334155', lineHeight: '1.6' }}>
        Estamos felizes em tê-lo(a) conosco. Sua jornada de aprendizado começa agora!
      </p>
      <p style={{ color: '#334155', lineHeight: '1.6' }}>
        Acesse sua conta e comece a explorar nossos cursos de Segurança da Informação.
      </p>
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <a
          href={process.env.NEXT_PUBLIC_APP_URL || 'https://ntraining.com.br'}
          style={{
            backgroundColor: '#00ade8',
            color: '#ffffff',
            padding: '12px 24px',
            textDecoration: 'none',
            borderRadius: '6px',
            display: 'inline-block',
          }}
        >
          Acessar Plataforma
        </a>
      </div>
    </EmailWrapper>
  )
}

// Course assigned email
export function CourseAssignedEmail({ userName, courseName, courseUrl }: EmailTemplateProps & { courseName: string; courseUrl: string }) {
  return (
    <EmailWrapper>
      <h2 style={{ color: '#0f172a' }}>Novo curso atribuído!</h2>
      <p style={{ color: '#334155', lineHeight: '1.6' }}>
        Olá {userName},
      </p>
      <p style={{ color: '#334155', lineHeight: '1.6' }}>
        Um novo curso foi atribuído a você: <strong>{courseName}</strong>
      </p>
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <a
          href={courseUrl}
          style={{
            backgroundColor: '#00ade8',
            color: '#ffffff',
            padding: '12px 24px',
            textDecoration: 'none',
            borderRadius: '6px',
            display: 'inline-block',
          }}
        >
          Começar Curso
        </a>
      </div>
    </EmailWrapper>
  )
}

// Certificate issued email
export function CertificateIssuedEmail({
  userName,
  courseName,
  certificateUrl,
  verificationCode,
}: EmailTemplateProps & {
  courseName: string
  certificateUrl: string
  verificationCode: string
}) {
  return (
    <EmailWrapper>
      <h2 style={{ color: '#0f172a' }}>🎓 Parabéns! Certificado emitido</h2>
      <p style={{ color: '#334155', lineHeight: '1.6' }}>
        Olá {userName},
      </p>
      <p style={{ color: '#334155', lineHeight: '1.6' }}>
        Parabéns por concluir o curso <strong>{courseName}</strong>!
      </p>
      <p style={{ color: '#334155', lineHeight: '1.6' }}>
        Seu certificado está disponível para download.
      </p>
      <div style={{ backgroundColor: '#f1f5f9', padding: '15px', borderRadius: '6px', margin: '20px 0' }}>
        <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Código de Verificação:</p>
        <p style={{ margin: '5px 0 0 0', fontSize: '16px', fontWeight: 'bold', color: '#0f172a', fontFamily: 'monospace' }}>
          {verificationCode}
        </p>
      </div>
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <a
          href={certificateUrl}
          style={{
            backgroundColor: '#00ade8',
            color: '#ffffff',
            padding: '12px 24px',
            textDecoration: 'none',
            borderRadius: '6px',
            display: 'inline-block',
          }}
        >
          Baixar Certificado
        </a>
      </div>
    </EmailWrapper>
  )
}

// Password reset email
export function PasswordResetEmail({ userName, resetUrl }: EmailTemplateProps & { resetUrl: string }) {
  return (
    <EmailWrapper>
      <h2 style={{ color: '#0f172a' }}>Redefinir senha</h2>
      <p style={{ color: '#334155', lineHeight: '1.6' }}>
        Olá {userName},
      </p>
      <p style={{ color: '#334155', lineHeight: '1.6' }}>
        Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para criar uma nova senha:
      </p>
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <a
          href={resetUrl}
          style={{
            backgroundColor: '#00ade8',
            color: '#ffffff',
            padding: '12px 24px',
            textDecoration: 'none',
            borderRadius: '6px',
            display: 'inline-block',
          }}
        >
          Redefinir Senha
        </a>
      </div>
      <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6' }}>
        Se você não solicitou esta alteração, ignore este email.
      </p>
    </EmailWrapper>
  )
}

// Course reminder email
export function CourseReminderEmail({ userName, courseName, courseUrl, progress }: EmailTemplateProps & { courseName: string; courseUrl: string; progress: number }) {
  return (
    <EmailWrapper>
      <h2 style={{ color: '#0f172a' }}>Continue seu aprendizado!</h2>
      <p style={{ color: '#334155', lineHeight: '1.6' }}>
        Olá {userName},
      </p>
      <p style={{ color: '#334155', lineHeight: '1.6' }}>
        Você está com <strong>{progress}% de progresso</strong> no curso <strong>{courseName}</strong>.
      </p>
      <p style={{ color: '#334155', lineHeight: '1.6' }}>
        Continue de onde parou e complete seu treinamento!
      </p>
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <a
          href={courseUrl}
          style={{
            backgroundColor: '#00ade8',
            color: '#ffffff',
            padding: '12px 24px',
            textDecoration: 'none',
            borderRadius: '6px',
            display: 'inline-block',
          }}
        >
          Continuar Curso
        </a>
      </div>
    </EmailWrapper>
  )
}

# Security & Compliance Notes

## Authentication & Authorization

### Identity Providers
- **Supabase Auth**: Provedor principal de autenticação
- **Google OAuth**: Autenticação social via Google Cloud Platform
- **Email/Password**: Autenticação tradicional com validação

### Token Formats
- **JWT Tokens**: Tokens de acesso e refresh gerenciados pelo Supabase
- **Session Cookies**: Cookies HTTP-only para persistência de sessão
- **OAuth Tokens**: Tokens de acesso do Google OAuth

### Session Strategy
- Sessões gerenciadas pelo Supabase Auth
- Cookies HTTP-only para segurança
- Refresh tokens para renovação automática
- Sessões expiram após período de inatividade

### Role & Permission Model

#### Roles (UserRole)
- `platform_admin`: Administrador da plataforma (superadmin)
- `org_manager`: Gerente de organização
- `student`: Estudante/usuário final

#### Permissions
- **Superadmin (`is_superadmin: true`)**: Acesso total, pode visualizar qualquer organização
- **Org Manager**: Gerencia usuários e cursos da sua organização
- **Student**: Acesso apenas aos cursos atribuídos

#### Authorization Checks
- `requireSuperAdmin()`: Verifica se usuário é superadmin
- `requireRole(role)`: Verifica role específica
- `requireAuth()`: Verifica autenticação básica
- RLS Policies: Isolamento de dados por organização no banco

## Secrets & Sensitive Data

### Storage Locations
- **Vercel Environment Variables**: Variáveis de ambiente em produção
- **`.env.local`**: Variáveis locais (não commitadas)
- **Supabase Dashboard**: Service Role Key gerenciada no Supabase

### Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`: URL pública do Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave pública (pode ser exposta)
- `SUPABASE_SERVICE_ROLE_KEY`: **CRÍTICA** - Nunca expor no cliente
- `OPENAI_API_KEY`: Chave da API OpenAI
- `RESEND_API_KEY`: Chave da API Resend

### Rotation Cadence
- Service Role Key: Rotacionar a cada 90 dias ou em caso de vazamento
- OAuth Client Secrets: Rotacionar conforme política do Google
- API Keys: Rotacionar conforme política dos provedores

### Encryption Practices
- Dados em trânsito: HTTPS/TLS obrigatório
- Dados em repouso: Criptografia do Supabase (PostgreSQL)
- Senhas: Hash bcrypt pelo Supabase Auth
- Tokens: JWT assinados

### Data Classifications
- **Público**: Cursos públicos, landing page
- **Interno**: Dados de usuários autenticados
- **Confidencial**: Service Role Keys, API Keys
- **Restrito**: Dados pessoais sensíveis (LGPD)

## Compliance & Policies

### LGPD (Lei Geral de Proteção de Dados)
- **Aplicável**: Sim - Plataforma brasileira com dados pessoais
- **Requisitos**:
  - Consentimento explícito para coleta de dados
  - Direito ao esquecimento (deletar dados)
  - Portabilidade de dados
  - Transparência sobre uso de dados
- **Implementação**:
  - Política de Privacidade (`/privacy`)
  - Termos de Serviço (`/terms`)
  - Isolamento de dados por organização (multi-tenant)

### Security Standards
- **OWASP Top 10**: Proteções contra vulnerabilidades comuns
- **CORS**: Configurado para domínios autorizados
- **CSP**: Content Security Policy (recomendado implementar)
- **XSS Protection**: Sanitização de inputs, validação de URLs

### Internal Policies
- **Multi-tenancy First**: Isolamento obrigatório por organização
- **RLS Obrigatório**: Todas as tabelas devem ter RLS habilitado
- **Auditoria**: Log de atividades administrativas
- **Princípio do Menor Privilégio**: Usuários têm apenas permissões necessárias

## Incident Response

### Detection
- **Logs do Supabase**: Monitorar logs de autenticação e queries
- **Vercel Logs**: Monitorar logs de deploy e erros
- **Console do Navegador**: Verificar erros de segurança no cliente

### Triage
1. **Identificar Escopo**: Qual organização/usuário afetado?
2. **Avaliar Impacto**: Dados expostos? Sistema comprometido?
3. **Isolar**: Bloquear acesso se necessário
4. **Documentar**: Registrar incidente e ações tomadas

### Escalation Steps
1. **Nível 1**: Desenvolvedor responsável
2. **Nível 2**: Tech Lead / Arquitetura
3. **Nível 3**: CTO / Gestão

### Post-Incident Analysis
- **Root Cause Analysis**: Identificar causa raiz
- **Remediation**: Implementar correções
- **Prevention**: Atualizar políticas e processos
- **Documentation**: Atualizar este documento

## Security Best Practices

### Code Security
- ✅ Validação de inputs com Zod
- ✅ Sanitização de URLs antes de inserir em iframes
- ✅ Verificação de permissões em todas as operações
- ✅ Tratamento de erros sem expor informações sensíveis
- ✅ TypeScript para type safety

### Database Security
- ✅ RLS habilitado em todas as tabelas
- ✅ Políticas RLS para isolamento multi-tenant
- ✅ Funções `SECURITY DEFINER` para operações privilegiadas
- ✅ Índices para performance e segurança

### API Security
- ✅ Server Actions protegidas por autenticação
- ✅ Validação de dados em todas as entradas
- ✅ Rate limiting (via Supabase e Resend)
- ✅ CORS configurado corretamente

---

*Generated from codebase analysis. Review and enhance with specific details.*

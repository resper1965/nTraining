# Development Workflow

## Branching & Releases

### Branching Model
- **Main branch**: `main` - código de produção
- **Feature branches**: `feature/nome-da-feature` - novas funcionalidades
- **Bugfix branches**: `bugfix/nome-do-bug` - correções de bugs
- **Hotfix branches**: `hotfix/nome-do-hotfix` - correções urgentes

### Release Cadence
- Releases seguem [Conventional Commits](https://www.conventionalcommits.org/)
- Tags de versão: `v0.1.0`, `v0.2.0`, etc.
- Deploy automático via Vercel após merge em `main`

## Local Development

### Setup Inicial

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com suas credenciais

# Executar servidor de desenvolvimento
npm run dev
```

### Comandos Principais

- **Desenvolvimento**: `npm run dev` - Inicia servidor Next.js em modo desenvolvimento
- **Build**: `npm run build` - Compila o projeto para produção
- **Lint**: `npm run lint` - Executa ESLint
- **Testes**: `npm run test` - Executa testes unitários (Vitest)
- **Testes Watch**: `npm run test:watch` - Executa testes em modo watch
- **Testes Coverage**: `npm run test:coverage` - Gera relatório de cobertura
- **E2E**: `npm run test:e2e` - Executa testes end-to-end (Playwright)

### Scripts Adicionais

- **Importar Curso**: `npm run import:course --file caminho/arquivo.json`
- **Importar SecOps**: `npm run import:secops` - Importa curso de exemplo

## Code Review Expectations

### Checklist de Revisão

1. **Código**
   - [ ] Segue padrões TypeScript do projeto
   - [ ] Sem erros de lint (`npm run lint`)
   - [ ] Testes passando (`npm run test`)
   - [ ] Build sem erros (`npm run build`)

2. **Arquitetura**
   - [ ] Segue padrão Service Layer
   - [ ] Validação com Zod em Server Actions
   - [ ] Tratamento de erros adequado
   - [ ] RLS policies consideradas (multi-tenant)

3. **Segurança**
   - [ ] Autenticação verificada
   - [ ] Autorização adequada (roles/permissões)
   - [ ] Dados sensíveis não expostos
   - [ ] Inputs validados e sanitizados

4. **Performance**
   - [ ] Queries otimizadas
   - [ ] Paginação implementada quando necessário
   - [ ] Sem N+1 queries
   - [ ] Lazy loading quando apropriado

### Convenções de Commit

Seguir [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(scope): adiciona nova funcionalidade
fix(scope): corrige bug
docs(scope): atualiza documentação
refactor(scope): refatora código
test(scope): adiciona testes
chore(scope): tarefas de manutenção
```

Exemplos:
- `feat(auth): adiciona autenticação OAuth Google`
- `fix(courses): corrige bug de progresso de curso`
- `docs(readme): atualiza instruções de setup`

## Onboarding Tasks

### Para Novos Desenvolvedores

1. **Setup do Ambiente**
   - [ ] Instalar Node.js 18+
   - [ ] Clonar repositório
   - [ ] Instalar dependências (`npm install`)
   - [ ] Configurar `.env.local`
   - [ ] Executar `npm run dev` e verificar se funciona

2. **Entender a Arquitetura**
   - [ ] Ler `README.md`
   - [ ] Ler `.context/docs/architecture.md`
   - [ ] Ler `.context/docs/project-overview.md`
   - [ ] Explorar estrutura de pastas

3. **Primeira Contribuição**
   - [ ] Escolher issue com label `good first issue`
   - [ ] Criar branch `feature/nome-da-feature`
   - [ ] Implementar solução
   - [ ] Adicionar testes
   - [ ] Criar Pull Request

### Recursos de Aprendizado

- **Documentação**: `.context/docs/`
- **Agentes**: `.context/agents/` - Playbooks para diferentes tarefas
- **Exemplos**: Ver código existente em `app/`, `lib/services/`, `components/`

---

*Generated from codebase analysis. Review and enhance with specific details.*

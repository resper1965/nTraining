# Tooling & Productivity Guide

## Required Tooling

### Core Tools
- **Node.js**: 18+ (LTS recomendado)
- **npm**: Gerenciador de pacotes (vem com Node.js)
- **Git**: Controle de versão
- **VS Code / Cursor**: Editor recomendado

### Version Requirements
- Node.js: `>=18.0.0`
- npm: `>=9.0.0`

## Recommended Automation

### Pre-commit Hooks
Recomendado usar `husky` + `lint-staged`:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

### Linting & Formatting
- **ESLint**: `npm run lint` - Verifica qualidade do código
- **Prettier**: (recomendado) - Formatação automática
- **TypeScript**: Verificação de tipos em tempo real

### Code Generators
- **Next.js**: Geração automática de rotas
- **Supabase**: Geração de tipos TypeScript (`supabase gen types`)

### Watch Modes
- **Desenvolvimento**: `npm run dev` - Hot reload automático
- **Testes**: `npm run test:watch` - Reexecuta testes ao salvar
- **Build**: `npm run build` - Verifica erros de build

## IDE / Editor Setup

### VS Code / Cursor Extensions

#### Essenciais
- **ESLint**: Integração com ESLint
- **Prettier**: Formatação automática
- **TypeScript**: Suporte nativo ao TypeScript
- **Tailwind CSS IntelliSense**: Autocomplete para Tailwind

#### Recomendados
- **Error Lens**: Mostra erros inline
- **GitLens**: Visualização avançada do Git
- **Thunder Client**: Testar APIs
- **PostgreSQL**: Gerenciar banco Supabase

### Workspace Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### Snippets
Criar snippets personalizados para:
- Server Actions
- Service methods
- React components
- Type definitions

## Productivity Tips

### Terminal Aliases

```bash
# Adicionar ao ~/.bashrc ou ~/.zshrc
alias nd="npm run dev"
alias nt="npm run test"
alias ntw="npm run test:watch"
alias nb="npm run build"
alias nl="npm run lint"
```

### Scripts Úteis

#### Verificar Status
```bash
# Verificar se build funciona
npm run build

# Verificar lint
npm run lint

# Executar testes
npm run test
```

#### Desenvolvimento
```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Testes em modo watch
npm run test:watch

# E2E com UI
npm run test:e2e:ui
```

### Docker (Opcional)
Para ambiente isolado:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]
```

### Vercel CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy produção
vercel --prod

# Ver logs
vercel logs
```

### Supabase CLI
```bash
# Instalar Supabase CLI
npm i -g supabase

# Login
supabase login

# Link projeto
supabase link --project-ref <project-ref>

# Aplicar migrações
supabase db push
```

## Automation Workflows

### CI/CD (Vercel)
- Deploy automático em cada push para `main`
- Preview deployments para PRs
- Build e testes executados automaticamente

### Scripts Customizados
Ver `package.json` para scripts disponíveis:
- `import:course`: Importar curso de JSON
- `import:secops`: Importar curso de exemplo

---

*Generated from codebase analysis. Review and enhance with specific details.*

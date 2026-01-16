# Testing Strategy

## Test Types

### Unit Tests
- **Framework**: Vitest
- **Environment**: jsdom (simula DOM do navegador)
- **File Naming**: `*.test.ts` ou `*.spec.ts`
- **Location**: Colocar testes junto aos arquivos ou em `tests/unit/`
- **Coverage**: Foco em Services, Utils, Validators

**Exemplo:**
```typescript
// lib/services/auth.service.test.ts
import { describe, it, expect } from 'vitest'
import { AuthService } from './auth.service'

describe('AuthService', () => {
  it('should authenticate user with valid credentials', async () => {
    // Test implementation
  })
})
```

### Integration Tests
- **Framework**: Vitest + Supabase Test Client
- **Scenarios**: 
  - Fluxos completos de autenticação
  - CRUD operations com RLS
  - Multi-tenant isolation
- **Mocks**: Usar `tests/mocks/supabase.ts` para mockar Supabase

### End-to-End Tests
- **Framework**: Playwright
- **Location**: `tests/e2e/`
- **Scenarios**:
  - Fluxos de usuário completos
  - Autenticação OAuth
  - Criação e conclusão de cursos
- **Environment**: Requer servidor de desenvolvimento rodando

**Configuração**: `playwright.config.ts`

## Running Tests

### Comandos Disponíveis

```bash
# Executar todos os testes
npm run test

# Executar testes unitários
npm run test:unit

# Modo watch (desenvolvimento)
npm run test:watch

# Com cobertura
npm run test:coverage

# Testes E2E
npm run test:e2e

# Testes E2E com UI
npm run test:e2e:ui
```

### Workflow de Desenvolvimento

1. **Durante Desenvolvimento**: `npm run test:watch`
2. **Antes de Commit**: `npm run test && npm run lint`
3. **Antes de PR**: `npm run build && npm run test && npm run test:coverage`
4. **CI/CD**: Executa todos os testes automaticamente

## Quality Gates

### Minimum Coverage Expectations
- **Services**: 80%+ de cobertura
- **Validators**: 90%+ de cobertura
- **Utils**: 70%+ de cobertura
- **Components**: 60%+ de cobertura (testes de integração)

### Linting Requirements
- **ESLint**: Zero erros antes de merge
- **TypeScript**: Zero erros de tipo
- **Build**: Build deve passar sem erros

### Pre-Merge Checklist
- [ ] Todos os testes passando
- [ ] Cobertura acima do mínimo
- [ ] Zero erros de lint
- [ ] Build sem erros
- [ ] Testes E2E críticos passando

## Test Organization

### Structure
```
tests/
├── unit/           # Testes unitários
├── integration/    # Testes de integração
├── e2e/           # Testes end-to-end
├── mocks/         # Mocks e fixtures
│   └── supabase.ts
└── fixtures/      # Dados de teste
```

### Mocking Strategy

#### Supabase Client
```typescript
import { createSupabaseClientMock } from '@/tests/mocks/supabase'

const mockSupabase = createSupabaseClientMock({
  // Mock responses
})
```

#### Server Actions
- Mockar chamadas ao Supabase
- Testar validação de inputs
- Testar tratamento de erros

## Troubleshooting

### Common Issues

#### Testes Flaky
- **Causa**: Operações assíncronas não aguardadas
- **Solução**: Usar `await` e `waitFor` adequadamente

#### Erros de Timeout
- **Causa**: Operações lentas ou bloqueantes
- **Solução**: Aumentar timeout ou otimizar código

#### Problemas com RLS
- **Causa**: RLS bloqueando queries em testes
- **Solução**: Usar Service Role Key ou mockar RLS

### Environment Quirks

#### jsdom Limitations
- Alguns recursos do navegador não estão disponíveis
- Usar polyfills quando necessário

#### Supabase Local
- Testes podem requerer Supabase local
- Usar mocks para desenvolvimento rápido

---

*Generated from codebase analysis. Review and enhance with specific details.*

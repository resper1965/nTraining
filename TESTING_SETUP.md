# Configuração de Testes - n.training

## Objetivo

Garantir cobertura de testes robusta antes do deploy, validando:
- Regras de negócio críticas (Certificados, Licenças)
- Sistema de IA resiliente a falhas de API
- Fluxos de usuário estáveis (Login, Criação de Curso)

## Stack de Testes

### Unit & Integration Tests
- **Vitest**: Framework rápido e compatível com Next.js
- **vitest-mock-extended**: Mocks avançados para Supabase e OpenAI
- **@testing-library/react**: Testes de componentes React

### E2E Tests
- **Playwright**: Framework padrão para simular usuários reais
- Execução em navegador real (headless)

## Estrutura de Pastas

```
/tests
  /unit
    /services          # Testes de Service Layer
    /actions           # Testes de Server Actions
  /e2e
    /specs             # Especificações Playwright
  /fixtures            # Dados de teste reutilizáveis
  /mocks               # Mocks compartilhados
```

## Scripts NPM

```json
{
  "test": "vitest",
  "test:unit": "vitest run",
  "test:watch": "vitest watch",
  "test:coverage": "vitest run --coverage",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui"
}
```

## Configuração Vitest

Arquivo: `vitest.config.ts`
- Configuração de paths (alias TypeScript)
- Setup global (`vitest.setup.ts`)
- Cobertura de código
- Ambiente Node.js (compatível com Next.js)

## Mocking Strategy

### Global Mocks (`vitest.setup.ts`)
- **Supabase Client**: Mock de todas as operações CRUD
- **OpenAI/Helicone**: Mock de embeddings e chat completions
- **next/navigation**: Mock de `redirect`, `useRouter`, `usePathname`

### Service Layer Mocks
- Mock do Supabase retornando dados de fixture
- Mock do OpenAI retornando respostas estruturadas

### Action Layer Mocks
- Mock de `getCurrentUser()` para simular autenticação
- Mock de `requireAuth()` e `requireSuperAdmin()`

## Padrão AAA (Arrange, Act, Assert)

Todos os testes seguem o padrão:
```typescript
describe('Feature', () => {
  it('should do something when condition', () => {
    // Arrange: Preparar dados e mocks
    const mockData = { ... }
    
    // Act: Executar ação
    const result = await service.method(mockData)
    
    // Assert: Verificar resultado
    expect(result).toEqual(expected)
  })
})
```

## Testes Críticos

### Service Layer
- ✅ Criar curso com dados válidos
- ✅ Criar curso sem permissão (deve falhar)
- ✅ Buscar cursos com filtros
- ✅ Gerar estrutura de curso com IA (mock OpenAI)
- ✅ Tratar erro de API OpenAI graciosamente

### Action Layer
- ✅ Rejeitar chamadas sem sessão
- ✅ Validar inputs com Zod antes do Service
- ✅ Redirecionar corretamente após sucesso

### E2E
- ✅ Login completo (acessar, preencher, redirecionar)
- ✅ Fluxo admin (login, criar curso via wizard)
- ✅ Verificar toasts de sucesso/erro

## Cobertura Alvo

- **Services**: 80%+
- **Actions**: 70%+
- **Critical Paths (E2E)**: 100%

## Execução

```bash
# Testes unitários
npm run test:unit

# Testes em modo watch
npm run test:watch

# Testes E2E
npm run test:e2e

# Testes E2E com UI
npm run test:e2e:ui

# Cobertura
npm run test:coverage
```

## Arquivos Criados

### Configuração
- `vitest.config.ts` - Configuração do Vitest
- `vitest.setup.ts` - Setup global com mocks
- `playwright.config.ts` - Configuração do Playwright

### Testes Unitários
- `tests/unit/services/course.service.test.ts` - Testes do Course Service
- `tests/unit/services/ai-course.service.test.ts` - Testes do AI Course Service
- `tests/unit/actions/courses.test.ts` - Testes das Server Actions

### Testes E2E
- `tests/e2e/login.spec.ts` - Teste de fluxo de login
- `tests/e2e/admin-flow.spec.ts` - Teste de fluxo admin (criação de curso)

## Variáveis de Ambiente para E2E

Crie um arquivo `.env.test` com:
```env
TEST_USER_EMAIL=user@example.com
TEST_USER_PASSWORD=password123
TEST_ADMIN_EMAIL=admin@example.com
TEST_ADMIN_PASSWORD=adminpassword123
PLAYWRIGHT_TEST_BASE_URL=http://localhost:3000
```

## Próximos Passos

1. **Executar testes unitários**: `npm run test:unit`
2. **Verificar cobertura**: `npm run test:coverage`
3. **Ajustar mocks conforme necessário**
4. **Adicionar mais testes conforme a aplicação cresce**
5. **Configurar CI/CD para rodar testes automaticamente**

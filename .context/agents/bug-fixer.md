# Bug Fixer Agent Playbook

## Mission

O Bug Fixer Agent é responsável por identificar, diagnosticar e corrigir bugs no código, seguindo os padrões estabelecidos do projeto n.training. Este agente deve focar em correções precisas, testáveis e que não introduzam regressões.

## Codebase Context

- **Models**: 44 symbols
- **Utils**: 81 symbols (depende de: Repositories)
- **Repositories**: 62 symbols
- **Services**: 33 symbols
- **Controllers**: 1 symbols
- **Components**: 136 symbols
- **Generators**: 3 symbols

## Responsibilities

### 1. Análise de Bugs
- Analisar relatórios de bugs e mensagens de erro
- Identificar causa raiz usando logs e stack traces
- Reproduzir bugs em ambiente local
- Documentar passos para reprodução

### 2. Implementação de Correções
- Implementar correções direcionadas com efeitos colaterais mínimos
- Seguir padrões arquiteturais do projeto (Service Layer)
- Manter consistência com código existente
- Adicionar validações quando necessário

### 3. Testes e Validação
- Escrever testes para prevenir regressões
- Verificar que build passa sem erros
- Testar fluxo completo afetado pelo bug
- Validar em diferentes cenários (multi-tenant, roles diferentes)

### 4. Documentação
- Documentar a correção no código
- Atualizar `BUG_INVESTIGATION_REPORT.md` se necessário
- Adicionar comentários explicativos quando apropriado

## Debugging Workflow

### Passo 1: Reproduzir o Bug
```bash
# Executar em modo desenvolvimento
npm run dev

# Verificar logs do console
# Verificar Network tab no DevTools
# Verificar logs do Supabase (Dashboard)
```

### Passo 2: Identificar Causa Raiz

#### Padrões Comuns de Erro

1. **Erros de Autenticação**
   - Verificar `lib/services/auth.service.ts`
   - Verificar `app/actions/auth.ts`
   - Verificar `middleware.ts`
   - Verificar RLS policies no Supabase

2. **Erros de RLS (Row Level Security)**
   - Verificar se tabela tem políticas RLS
   - Verificar funções helper: `is_user_superadmin()`, `get_user_organization_id()`
   - Verificar se `SECURITY DEFINER` está configurado

3. **Erros de Validação**
   - Verificar `lib/validators/*.schema.ts`
   - Verificar se Server Action valida inputs
   - Verificar mensagens de erro do Zod

4. **Erros de TypeScript**
   - Verificar tipos em `lib/types/database.ts`
   - Verificar se interfaces estão atualizadas
   - Verificar se há `any` que precisa ser tipado

5. **Erros de React/Next.js**
   - Verificar `useEffect` cleanup functions
   - Verificar memory leaks (setTimeout, setInterval, event listeners)
   - Verificar se componentes estão desmontando corretamente

### Passo 3: Implementar Correção

#### Padrões de Correção

**Service Layer:**
```typescript
// ✅ CORRETO: Service retorna dados ou lança erro tipado
async signIn(input: SignInInput): Promise<SignInResult> {
  // ... lógica ...
  if (error) {
    throw new AuthServiceError(message, code, originalError)
  }
  return result
}

// ❌ ERRADO: Service faz redirect ou revalidatePath
async signIn(input: SignInInput) {
  redirect('/dashboard') // ❌ Não fazer isso no Service
}
```

**Server Actions:**
```typescript
// ✅ CORRETO: Action orquestra e trata erros
export async function signIn(formData: FormData) {
  try {
    const input = validateSignIn(rawInput)
    const result = await authService.signIn(input)
    redirect(result.redirectPath)
  } catch (error) {
    return { error: { message: error.message } }
  }
}
```

**React Components:**
```typescript
// ✅ CORRETO: useEffect com cleanup
useEffect(() => {
  let isMounted = true
  const timeoutIds: NodeJS.Timeout[] = []
  
  const handler = async () => {
    if (!isMounted) return
    // ... lógica ...
  }
  
  handler()
  
  return () => {
    isMounted = false
    timeoutIds.forEach(id => clearTimeout(id))
  }
}, [dependencies])
```

### Passo 4: Testar Correção

```bash
# Executar testes unitários
npm run test

# Executar build
npm run build

# Verificar lint
npm run lint

# Testar manualmente o fluxo afetado
```

## Common Bug Patterns and Fixes

### 1. Race Conditions em useEffect
**Sintoma**: Operações assíncronas executando após desmontagem  
**Correção**: Adicionar flag `isMounted` e cleanup function

### 2. Memory Leaks com setTimeout/setInterval
**Sintoma**: Warnings "Cannot perform React state update on unmounted component"  
**Correção**: Armazenar IDs e limpar no cleanup

### 3. Erros de RLS
**Sintoma**: "Permission denied" ou dados não retornados  
**Correção**: Verificar políticas RLS, funções helper, `SECURITY DEFINER`

### 4. Type Mismatches
**Sintoma**: Erros TypeScript ou runtime errors  
**Correção**: Verificar tipos, usar type guards, atualizar interfaces

### 5. Processamento Duplo
**Sintoma**: Operações executando múltiplas vezes  
**Correção**: Adicionar flags de controle, early returns

## Logging and Error Handling Conventions

### Logging
- **Console.log**: Apenas em desenvolvimento, remover em produção
- **Console.error**: Para erros reais, manter com contexto
- **Supabase Logs**: Verificar logs de Auth e Database

### Error Handling
- **Services**: Lançar erros tipados (`AuthServiceError`, `UserServiceError`, etc.)
- **Server Actions**: Retornar objetos de erro (`ActionError`)
- **Components**: Tratar erros e mostrar feedback ao usuário

### Error Messages
- Mensagens em português para usuários finais
- Mensagens técnicas em inglês para logs
- Incluir contexto suficiente para debug

## Test Verification Steps

### Checklist de Teste
1. [ ] Teste unitário para a correção
2. [ ] Build passa sem erros
3. [ ] Lint passa sem erros
4. [ ] Fluxo manual testado
5. [ ] Diferentes roles testados (superadmin, org_manager, student)
6. [ ] Multi-tenant testado (diferentes organizações)
7. [ ] Edge cases considerados

### Exemplo de Teste
```typescript
describe('AuthService.signIn', () => {
  it('should throw AuthServiceError for invalid credentials', async () => {
    await expect(
      authService.signIn({ email: 'invalid', password: 'wrong' })
    ).rejects.toThrow(AuthServiceError)
  })
})
```

## Rollback Procedures

### Se Correção Causar Regressão

1. **Reverter Commit**
   ```bash
   git revert <commit-hash>
   ```

2. **Verificar Impacto**
   - Verificar se outros bugs foram introduzidos
   - Verificar logs de erro

3. **Documentar**
   - Atualizar `BUG_INVESTIGATION_REPORT.md`
   - Documentar o que não funcionou

## Key Files for Bug Fixing

### Autenticação
- `lib/services/auth.service.ts` - Lógica de autenticação
- `app/actions/auth.ts` - Server Actions de auth
- `app/auth/callback/page.tsx` - Callback OAuth
- `middleware.ts` - Proteção de rotas

### Erros Comuns
- `BUG_INVESTIGATION_REPORT.md` - Relatório de bugs conhecidos
- `AUDITORIA_AUTENTICACAO_COMPLETA.md` - Auditoria de auth
- `ERROR_FLOW_ANALYSIS.md` - Análise de fluxos de erro

### Utilitários
- `components/admin/error-logger.tsx` - Captura erros globais
- `lib/supabase/server.ts` - Helpers de autenticação
- `lib/auth/helpers.ts` - Helpers de autorização

## Best Practices

1. **Sempre Reproduzir Antes de Corrigir**
   - Entender o contexto completo
   - Identificar todos os casos afetados

2. **Correções Mínimas**
   - Mudar apenas o necessário
   - Evitar refatorações grandes junto com bug fixes

3. **Testes Preventivos**
   - Adicionar testes que falhariam antes da correção
   - Garantir que testes passam após correção

4. **Documentação**
   - Comentar código complexo
   - Atualizar documentação relacionada

5. **Multi-tenant Awareness**
   - Sempre considerar isolamento por organização
   - Testar com diferentes organizações

## Common Pitfalls to Avoid

1. **Não verificar RLS antes de corrigir queries**
2. **Esquecer cleanup em useEffect**
3. **Não testar com diferentes roles**
4. **Ignorar logs do Supabase**
5. **Corrigir sintoma em vez de causa raiz**
6. **Não considerar multi-tenant**

---

*Generated from codebase analysis. Review and enhance with specific responsibilities.*

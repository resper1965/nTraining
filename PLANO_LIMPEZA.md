# 🧹 Plano de Limpeza e Polimento - n.training

**Data:** 2026-01-14  
**Tech Lead:** Análise de Clean Code e Documentação Técnica

---

## 📋 MISSÃO 1: Code Hygiene (Limpeza)

### 1.1 Código Morto Identificado

#### 🔴 CRÍTICO - Funções Duplicadas
**Arquivo:** `lib/supabase/server.ts`

**Problema:** Este arquivo contém funções que foram refatoradas para `lib/auth/helpers.ts`:
- `getCurrentUser()` (linhas 61-177) - **DUPLICADO** em `lib/auth/helpers.ts`
- `requireAuth()` (linhas 208-221) - **DUPLICADO** em `lib/auth/helpers.ts`
- `requireSuperAdmin()` (linhas 240-251) - **DUPLICADO** em `lib/auth/helpers.ts`
- `requireRole()` (linhas 254-273) - **DUPLICADO** em `lib/auth/helpers.ts`
- `isSuperAdmin()` (linhas 224-231) - **DUPLICADO** em `lib/auth/helpers.ts`

**Ação:** 
- ✅ Manter apenas `createClient()` e `getUserById()` em `lib/supabase/server.ts`
- ❌ Remover todas as funções duplicadas
- ✅ Atualizar imports em arquivos que ainda usam `lib/supabase/server` para auth

**Arquivos afetados:** 🔴 **76 ARQUIVOS** ainda usam funções de `lib/supabase/server`:
- 30+ páginas em `app/(admin)/**/*.tsx`
- 20+ Server Actions em `app/actions/*.ts`
- 20+ páginas em `app/(main)/**/*.tsx`

**Estratégia de Migração:**
1. **Opção A (RECOMENDADA):** Criar wrappers em `lib/supabase/server.ts` que delegam para `lib/auth/helpers.ts`
   - Mantém compatibilidade retroativa
   - Migração gradual possível
   - Zero breaking changes

2. **Opção B:** Atualizar todos os 76 arquivos de uma vez
   - Mais trabalho inicial
   - Remove duplicação completamente
   - Breaking change (requer teste completo)

#### 🟡 MÉDIO - Validações Legadas
**Arquivo:** `lib/validations.ts`

**Problema:** Este arquivo contém schemas Zod que foram substituídos por `lib/validators/*.schema.ts`:
- `courseFormSchema` → Substituído por `lib/validators/course.schema.ts`
- `userCreateSchema` → Substituído por `lib/validators/user.schema.ts`
- `moduleFormSchema` → Substituído por `lib/validators/content.schema.ts`
- `lessonFormSchema` → Substituído por `lib/validators/content.schema.ts`
- `quizFormSchema` → Substituído por `lib/validators/quiz.schema.ts`
- `organizationFormSchema` → Substituído por `lib/validators/organization.schema.ts`

**Uso encontrado:**
- `STATUS_DESENVOLVIMENTO.md` (linha 282) - apenas documentação, não código

**Ação:**
- ✅ **SEGURO PARA DELETAR** - Nenhum arquivo de código usa
- ❌ Deletar `lib/validations.ts`
- ✅ Atualizar referência em `STATUS_DESENVOLVIMENTO.md` se necessário

#### 🟡 MÉDIO - Contexto de Usuário Obsoleto
**Arquivo:** `lib/supabase/user-context.ts`

**Problema:** Pode estar obsoleto após refatoração para `lib/auth/context.ts` e `lib/auth/helpers.ts`

**Ação:**
- 🔍 Verificar se algum arquivo ainda usa `lib/supabase/user-context.ts`
- ❌ Se não houver uso, deletar o arquivo

---

### 1.2 Console.logs Desnecessários

#### 🔴 CRÍTICO - Logs em Produção
**Arquivos com console.log que devem ser removidos ou condicionados:**

1. **`lib/services/user.service.ts`**
   - Linha 201: `console.log(\`User ${userId} approved\`)` - **REMOVER**

2. **`lib/auth/helpers.ts`**
   - Linhas 22, 35, 59, 71, 86, 97: Logs de debug - **MANTER** (já condicionados com `isDev`)

3. **`lib/supabase/server.ts`**
   - Linhas 73, 89, 98, 116, 127, 152, 169: Logs duplicados - **REMOVER** (função será deletada)

4. **`app/actions/admin.ts`**
   - Linhas 48, 52, 64, 74, 84, 94, 104, 114, 124, 134, 144, 247, 251, 271, 293, 297, 371, 375, 388: Logs de debug - **CONDICIONAR** com `process.env.NODE_ENV === 'development'`

5. **`lib/notifications/intelligent.ts`**
   - Linhas 46, 129: Logs de debug - **CONDICIONAR** com `process.env.NODE_ENV === 'development'`

**Regra:** 
- ✅ Manter `console.error` em blocos `catch` (são necessários)
- ❌ Remover `console.log` de debug em produção
- ✅ Condicionar logs de debug com `process.env.NODE_ENV === 'development'`

---

### 1.3 Imports Não Usados

**Ação:** Executar análise estática para identificar imports não utilizados em:
- `lib/services/*.ts`
- `app/actions/*.ts`
- `lib/validators/*.ts`

**Ferramenta sugerida:** ESLint com regra `@typescript-eslint/no-unused-vars`

---

### 1.4 Padronização Service Layer

**Verificação:** Todos os arquivos em `lib/services/` devem seguir o padrão:
- ✅ NUNCA recebe `FormData`
- ✅ NUNCA usa `redirect()` ou `revalidatePath()`
- ✅ Retorna dados puros ou lança erros tipados

**Status:** ✅ **TODOS OS SERVICES ESTÃO CORRETOS**

---

## 📁 MISSÃO 2: Organização de Pastas

### 2.1 Estrutura Atual

```
lib/
├── auth/              ✅ Bem organizado
│   ├── context.ts
│   ├── helpers.ts
│   ├── types.ts
│   └── index.ts
├── certificates/      ✅ Bem organizado
├── email/             ✅ Bem organizado
├── i18n/              ✅ Bem organizado
├── notifications/     ✅ Bem organizado
├── services/          ✅ Bem organizado (6 services)
├── supabase/          ⚠️ Pode ser simplificado
│   ├── client.ts
│   ├── config.ts
│   ├── database.types.ts
│   ├── migrations/
│   ├── schema.sql
│   ├── seed.sql
│   ├── server.ts       ⚠️ Precisa limpeza (funções duplicadas)
│   ├── tenants.ts
│   └── user-context.ts ⚠️ Pode estar obsoleto
├── types/             ✅ Bem organizado
├── utils/             ✅ Bem organizado
├── validators/        ✅ Bem organizado (6 validators)
├── toast.ts           ✅ OK
├── utils.ts           ✅ OK
└── validations.ts     ❌ CÓDIGO MORTO (substituído por validators/)
```

### 2.2 Proposta de Reorganização

**Opção A: Manter Estrutura Atual (RECOMENDADO)**
- ✅ Estrutura já está bem organizada
- ✅ Separação clara de responsabilidades
- ✅ Fácil de navegar
- ⚠️ Apenas remover código morto

**Opção B: Agrupar por Domínio (NÃO RECOMENDADO)**
- ❌ Quebraria a separação de camadas (validators, services)
- ❌ Tornaria mais difícil encontrar arquivos relacionados
- ❌ Não adiciona valor significativo

**Decisão:** ✅ **MANTER ESTRUTURA ATUAL** após limpeza

---

## 📚 MISSÃO 3: Documentação "WOW" (README.md)

### 3.1 Estrutura Proposta

1. **Badges** (Stack, Status, License)
2. **Visão Arquitetural** (Diagrama Mermaid)
3. **Estrutura de Pastas Explicada**
4. **Guia de Desenvolvimento** (Como criar nova feature)
5. **Variáveis de Ambiente** (Tabela completa)
6. **Scripts Disponíveis**
7. **Deploy e CI/CD**

---

## 📊 Resumo de Ações

| Prioridade | Ação | Arquivo(s) | Status |
|------------|------|------------|--------|
| 🔴 CRÍTICO | Criar wrappers para compatibilidade | `lib/supabase/server.ts` | ⏳ Pendente |
| 🔴 CRÍTICO | Remover console.log | `lib/services/user.service.ts` | ⏳ Pendente |
| 🔴 CRÍTICO | Remover console.log | `lib/services/user.service.ts` | ⏳ Pendente |
| 🟡 MÉDIO | Verificar e remover código morto | `lib/validations.ts` | ⏳ Pendente |
| 🟡 MÉDIO | Verificar e remover código morto | `lib/supabase/user-context.ts` | ⏳ Pendente |
| 🟡 MÉDIO | Condicionar logs de debug | `app/actions/admin.ts` | ⏳ Pendente |
| 🟢 BAIXO | Analisar imports não usados | Todos os arquivos | ⏳ Pendente |
| 🟢 BAIXO | Criar README.md Enterprise | `README.md` | ⏳ Pendente |

---

## ✅ Próximos Passos

1. **Aprovar este plano**
2. **Executar limpeza sequencial:**
   - Missão 1: Code Hygiene
   - Missão 2: Organização (apenas remover código morto)
   - Missão 3: Documentação
3. **Testar após cada mudança**
4. **Commit incremental**

---

**Preparado por:** Tech Lead - Clean Code & Documentation  
**Aguardando aprovação para execução**

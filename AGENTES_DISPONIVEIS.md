# 🤖 Agentes Disponíveis no Projeto

**Data:** 2026-01-15  
**Total de Agentes:** 14 (todos built-in)

---

## 📋 Lista de Agentes

### 1. 🔍 **code-reviewer**
**Tipo:** Built-in  
**Caminho:** `agents/code-reviewer.md`  
**Status:** Disponível (arquivo ainda não criado)  
**Documentação Principal:** Architecture

**Descrição:**  
Reviews code for quality, style, and best practices.  
Revisa código para qualidade, estilo e melhores práticas.

---

### 2. 🐛 **bug-fixer**
**Tipo:** Built-in  
**Caminho:** `agents/bug-fixer.md`  
**Status:** Disponível (arquivo ainda não criado)  
**Documentação Principal:** Architecture

**Descrição:**  
Identifies and fixes bugs with targeted solutions.  
Identifica e corrige bugs com soluções direcionadas.

---

### 3. ✨ **feature-developer**
**Tipo:** Built-in  
**Caminho:** `agents/feature-developer.md`  
**Status:** Disponível (arquivo ainda não criado)  
**Documentação Principal:** Architecture

**Descrição:**  
Implements new features following architecture.  
Implementa novas funcionalidades seguindo a arquitetura.

---

### 4. 🔄 **refactoring-specialist**
**Tipo:** Built-in  
**Caminho:** `agents/refactoring-specialist.md`  
**Status:** Disponível (arquivo ainda não criado)  
**Documentação Principal:** Architecture

**Descrição:**  
Improves code structure and eliminates code smells.  
Melhora a estrutura do código e elimina code smells.

---

### 5. 🧪 **test-writer**
**Tipo:** Built-in  
**Caminho:** `agents/test-writer.md`  
**Status:** Disponível (arquivo ainda não criado)  
**Documentação Principal:** Testing

**Descrição:**  
Creates comprehensive test suites.  
Cria suítes de testes abrangentes.

---

### 6. 📝 **documentation-writer**
**Tipo:** Built-in  
**Caminho:** `agents/documentation-writer.md`  
**Status:** Disponível (arquivo ainda não criado)  
**Documentação Principal:** Documentation Index

**Descrição:**  
Writes and maintains documentation.  
Escreve e mantém documentação.

---

### 7. ⚡ **performance-optimizer**
**Tipo:** Built-in  
**Caminho:** `agents/performance-optimizer.md`  
**Status:** Disponível (arquivo ainda não criado)  
**Documentação Principal:** Architecture

**Descrição:**  
Identifies and resolves performance bottlenecks.  
Identifica e resolve gargalos de performance.

---

### 8. 🔒 **security-auditor**
**Tipo:** Built-in  
**Caminho:** `agents/security-auditor.md`  
**Status:** Disponível (arquivo ainda não criado)  
**Documentação Principal:** Security

**Descrição:**  
Audits code for security vulnerabilities.  
Audita código em busca de vulnerabilidades de segurança.

---

### 9. 🖥️ **backend-specialist**
**Tipo:** Built-in  
**Caminho:** `agents/backend-specialist.md`  
**Status:** Disponível (arquivo ainda não criado)  
**Documentação Principal:** Architecture

**Descrição:**  
Develops server-side logic and APIs.  
Desenvolve lógica server-side e APIs.

---

### 10. 🎨 **frontend-specialist**
**Tipo:** Built-in  
**Caminho:** `agents/frontend-specialist.md`  
**Status:** Disponível (arquivo ainda não criado)  
**Documentação Principal:** Architecture

**Descrição:**  
Builds user interfaces and interactions.  
Constrói interfaces de usuário e interações.

---

### 11. 🏗️ **architect-specialist**
**Tipo:** Built-in  
**Caminho:** `agents/architect-specialist.md`  
**Status:** Disponível (arquivo ainda não criado)  
**Documentação Principal:** Architecture

**Descrição:**  
Designs system architecture and patterns.  
Projeta arquitetura de sistema e padrões.

---

### 12. 🚀 **devops-specialist**
**Tipo:** Built-in  
**Caminho:** `agents/devops-specialist.md`  
**Status:** Disponível (arquivo ainda não criado)  
**Documentação Principal:** Deployment

**Descrição:**  
Manages deployment and CI/CD pipelines.  
Gerencia deploy e pipelines de CI/CD.

---

### 13. 💾 **database-specialist**
**Tipo:** Built-in  
**Caminho:** `agents/database-specialist.md`  
**Status:** Disponível (arquivo ainda não criado)  
**Documentação Principal:** Architecture

**Descrição:**  
Designs and optimizes database solutions.  
Projeta e otimiza soluções de banco de dados.

---

### 14. 📱 **mobile-specialist**
**Tipo:** Built-in  
**Caminho:** `agents/mobile-specialist.md`  
**Status:** Disponível (arquivo ainda não criado)  
**Documentação Principal:** Architecture

**Descrição:**  
Develops mobile applications.  
Desenvolve aplicações mobile.

---

## 🎯 Como Usar os Agentes

### Opção 1: Usar via MCP
Os agentes podem ser orquestrados automaticamente usando:
```typescript
mcp_ai-context_orchestrateAgents({
  task: "descreva a tarefa aqui",
  phase: "E", // P, R, E, V, C
  role: "developer" // planner, designer, architect, developer, qa, reviewer, documenter
})
```

### Opção 2: Scaffold dos Arquivos
Para criar os arquivos de playbook dos agentes:
```bash
# Criar todos os agentes built-in
mcp_ai-context_scaffoldAgents()

# Ou criar agentes específicos
mcp_ai-context_scaffoldAgents({
  agents: ["code-reviewer", "bug-fixer"]
})
```

### Opção 3: Obter Sequência Recomendada
Para uma tarefa específica, obter a sequência recomendada de agentes:
```typescript
mcp_ai-context_getAgentSequence({
  task: "implementar autenticação OAuth",
  includeReview: true,
  phases: ["E", "V"] // Execution e Validation
})
```

---

## 📊 Agentes por Categoria

### **Desenvolvimento**
- `feature-developer` - Desenvolver features
- `backend-specialist` - Backend
- `frontend-specialist` - Frontend
- `mobile-specialist` - Mobile

### **Qualidade**
- `code-reviewer` - Revisão de código
- `bug-fixer` - Correção de bugs
- `test-writer` - Testes

### **Melhorias**
- `refactoring-specialist` - Refatoração
- `performance-optimizer` - Performance
- `security-auditor` - Segurança

### **Arquitetura e Infra**
- `architect-specialist` - Arquitetura
- `devops-specialist` - DevOps
- `database-specialist` - Banco de dados

### **Documentação**
- `documentation-writer` - Documentação

---

## 🔗 Próximos Passos

1. **Scaffold dos Agentes:** Criar os arquivos de playbook para os agentes que você mais usa
2. **Orquestração:** Usar `orchestrateAgents` para tarefas complexas
3. **Sequenciamento:** Usar `getAgentSequence` para planejar workflows
4. **Customização:** Criar agentes customizados específicos para o projeto

---

## 📝 Notas

- Todos os agentes são **built-in** e estão disponíveis via MCP
- Os arquivos de playbook ainda não foram criados no projeto
- Você pode criar agentes customizados adicionando arquivos em `.context/agents/`
- Os agentes podem ser combinados em sequências para tarefas complexas

## Aula 02 — Ciclo de vida de um alerta

### Objetivo
Compreender o ciclo completo (do sinal ao encerramento) e quais são as decisões mínimas que precisam estar documentadas.

### Ciclo de vida (modelo)
1. **Geração** (regra/correlação/detector)
2. **Enfileiramento** (priorização por severidade/cliente)
3. **Triagem (N1)**
4. **Investigação (N2)**
5. **Resposta/contensão** (quando aplicável e autorizado)
6. **Encerramento**
7. **Melhoria contínua** (tuning, novos sinais, automação)

### Triagem (o que precisa acontecer sempre)
- Confirmar **severidade** e **contexto do cliente**
- Coletar **evidências mínimas** (ver checklist do módulo)
- Decidir **próximo passo** com justificativa:
  - **Fechar como FP** (e sugerir tuning)
  - **Monitorar** (com prazo e condição de reavaliação)
  - **Escalar** (N2/N3 / cliente)
  - **Conter** (quando permitido)

### Erros comuns
- Fechar sem evidência (“feeling”)
- Escalar sem contexto (gera ping‑pong)
- Não registrar hipóteses e decisões (dificulta handoff e auditoria)

### Exercício
Você recebeu um alerta “múltiplos logins falhos seguidos de sucesso”.
Preencha no ticket:
- evidências mínimas
- hipótese inicial
- próximos 2 passos de investigação
- decisão (e por quê)


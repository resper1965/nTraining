## Aula 03 — Resposta em endpoint e integração EDR + SIEM

### Objetivo
Entender o que fazer depois da investigação: ações de resposta, governança e como correlacionar com SIEM para ampliar contexto.

### Ações de resposta (exemplos)
- **Isolar host** (reduz risco, aumenta impacto operacional)
- **Kill process** (rápido, mas pode perder evidência)
- **Quarentena/remover arquivo**
- **Coleta forense** (artefatos, memória — quando disponível)

### Governança (perguntas antes de agir)
- É permitido no escopo? Precisa aprovação?
- Qual impacto operacional? Existe janela?
- Quais evidências precisam ser coletadas antes?

### Integração com SIEM (por que importa)
- Endpoint sozinho não conta a história completa:
  - login suspeito → endpoint executa payload → rede exfiltra
- SIEM ajuda a:
  - encontrar outros eventos correlatos (identidade/rede/cloud)
  - medir tempo de detecção/resposta
  - criar caso de uso/alerta melhor

### Exercício
Defina um playbook mínimo para “host comprometido”:
- passos de contenção
- evidências a preservar
- comunicação e escalonamento


## Aula 02 — Janelas, rollback e validação

### Objetivo
Reduzir risco operacional: aplicar patch com janelas previsíveis, rollback possível e validação objetiva.

### Conceitos‑chave
- **Janela de manutenção**: horário acordado para mudanças.
- **Rollback**: voltar ao estado anterior (plano e critérios).
- **Validação**: checar que serviço voltou e vulnerabilidade foi mitigada.

### Checklist (pós‑deploy)
- [ ] Serviços críticos ok (health checks)
- [ ] Métricas de erro/latência normais
- [ ] Patch compliance atualizado
- [ ] Vulnerabilidade re‑scan/validação (quando aplicável)
- [ ] Registro no ticket (o que mudou, quando, quem aprovou)

### Exercício
Crie um checklist de rollback para uma atualização crítica:
- sinais de falha
- passos de rollback
- comunicação e escalonamento


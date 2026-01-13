## Aula 01 — Ciclo de patching e governança

### Objetivo
Padronizar como patches entram em produção com segurança (evitar downtime e reduzir janela de exposição).

### Ciclo (mínimo viável)
1. **Identificar** (vuln scanner / vendor / threat intel)
2. **Priorizar** (risco e criticidade)
3. **Testar** (ambiente piloto / anel)
4. **Aprovar** (mudança e janela)
5. **Deploy** (automatizado quando possível)
6. **Verificar** (compliance + validação técnica)

### Governança (perguntas que evitam incidentes)
- Qual o impacto e a janela?
- Existe rollback? Qual o plano?
- Quem aprova e quem executa?
- Como medir sucesso (compliance) e falha (rollback)?

### Exercício
Defina anéis de patch (piloto → padrão → crítico) para um cliente:
- critérios de entrada/saída
- cadência por criticidade


## Aula 03 — Hardening (CIS), baseline e auditoria

### Objetivo
Entender hardening como baseline mensurável (drift control) e como gerar evidência de conformidade.

### Conceitos‑chave
- **CIS Benchmarks**: recomendações base por tecnologia (SO, serviços).
- **Baseline**: configuração padrão aprovada.
- **Drift**: desvio do baseline ao longo do tempo.

### Onde hardening impacta SecOps
- reduz superfície de ataque e “ruído” de incidentes
- melhora consistência entre ambientes
- facilita auditorias (evidência)

### Checklist (mínimo)
- [ ] Baseline definido por tecnologia (Windows/Linux/AD)
- [ ] Processo de exceção (quem aprova e por quanto tempo)
- [ ] Auditoria periódica (drift) e plano de correção

### Exercício
Defina 10 itens de baseline (alto impacto/baixo risco) para um ambiente:
- 5 para identidade (ex.: MFA, políticas)
- 5 para endpoint/servidor (ex.: serviços, logs)


## Aula 01 — Fontes, normalização e parsing

### Objetivo
Garantir que os dados que entram no SIEM suportem decisão operacional (triagem/investigação), com campos consistentes e timestamps confiáveis.

### Conceitos‑chave
- **Fonte de log**: de onde vem (AD, firewall, EDR, cloud, app).
- **Parsing**: extrair campos estruturados do evento bruto.
- **Normalização**: padronizar nomes/formatos (ex.: `user`, `src_ip`, `host`, `event_type`).
- **Qualidade**: cobertura, latência, integridade e consistência.

### Checklist operacional (mínimo)
- [ ] Timestamps coerentes (timezone + clock drift conhecido)
- [ ] Identidade do usuário (UPN/email/id) presente e consistente
- [ ] Host/asset presente (hostname/id)
- [ ] IPs (origem/destino) quando aplicável
- [ ] Tipo de evento/ação (login, policy change, process start, etc.)
- [ ] Campo de “resultado” (success/fail) quando aplicável

### Exercício
Escolha uma fonte (ex.: AD) e defina:
- 8 campos mínimos para suportar triagem de “login suspeito”
- 2 validações de qualidade (ex.: latência máxima aceitável; % eventos com user nulo)

### Saída esperada
Uma lista de campos + critérios de qualidade, pronta para virar checklist do onboarding.


## Aula 03 — Dashboards operacionais e casos de uso

### Objetivo
Montar visualizações que ajudem o turno a operar (fila, tendência, qualidade) sem virar “painel bonito e inútil”.

### Conceitos‑chave
- **Dashboard operacional**: suporte ao trabalho do dia (fila, SLA, gargalos).
- **Dashboard gerencial**: tendência e risco (mês, KPIs, backlog).
- **Goodhart**: métrica vira meta e perde sentido — cuidado com vanity metrics.

### Dashboard mínimo (operacional)
- Fila de alertas por severidade e idade (aging)
- Alertas por caso de uso (top 10) + FP rate estimado
- Distribuição por cliente/tenant
- Alertas “quebrados” (sem campos mínimos / parsing falhou)

### Casos de uso (como pensar)
- **Brute force / spraying**
- **Movimentação lateral**
- **Exfiltração**

Para cada caso, defina:
- sinal primário
- evidências mínimas
- fontes complementares
- ação sugerida (fechar/monitorar/escalar/conter)

### Exercício
Desenhar (em bullets) um dashboard operacional para um turno N1:
- 6 widgets, cada um com objetivo claro e decisão suportada.


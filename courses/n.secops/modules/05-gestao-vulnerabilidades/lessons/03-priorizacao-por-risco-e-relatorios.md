## Aula 03 — Priorização por risco e relatórios (executivo/técnico)

### Objetivo
Transformar resultado do scanner em backlog acionável (tickets) e relatório que comunique risco e progresso.

### Priorização por risco (modelo simples)
Considere uma pontuação (qualitativa) combinando:
- criticidade técnica (CVSS)
- exploit disponível/ativo
- exposição do ativo
- criticidade do ativo

### Tickets (o que não pode faltar)
- CVE + evidência (host, porta, versão)
- risco resumido em linguagem simples
- recomendação (patch/config)
- prazo sugerido por criticidade
- owner do ativo e validação pós‑correção

### Relatório mensal (como apresentar)
Use `templates/relatorio-mensal.md` e destaque:
- tendência (melhorou/piorou)
- top riscos (top 10)
- o que foi corrigido (progresso)
- backlog e próximos passos

### Exercício
Escreva um resumo executivo (5 bullets) e um backlog top 10 para um mês hipotético.


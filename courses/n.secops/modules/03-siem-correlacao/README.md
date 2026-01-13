## Módulo 03 — SIEM: Correlação de Eventos

**Duração estimada:** 2h  
**Objetivo:** entender como a correlação transforma eventos em alertas acionáveis e como operar dashboards/thresholds com qualidade.

### Resultados esperados
- Definir campos mínimos por caso de uso (para triagem e investigação)
- Especificar regra de correlação com thresholds e falso‑positivos conhecidos
- Montar um dashboard mínimo operacional (visão de fila, severidade, tendências)

### Pré‑requisitos
- Conceitos do Módulo 02 (ciclo de alerta e registro)

### Tópicos
- O que é SIEM e por que importa
- Fontes de logs (AD, firewalls, EDR, cloud, aplicações)
- Normalização e parsing
- Regras de correlação, alertas e thresholds
- Dashboards e visualização
- Casos de uso: brute force, movimentação lateral, exfiltração

### Aulas
1. `lessons/01-fontes-normalizacao-e-parsing.md`
2. `lessons/02-correlaçao-thresholds-e-qualidade-de-alerta.md`
3. `lessons/03-dashboards-operacionais-e-casos-de-uso.md`

### Prática
- Definir “campos mínimos” por caso de uso (ex.: brute force):
  - Campos obrigatórios
  - Threshold inicial
  - Possíveis falsos positivos e como reduzir

### Avaliação
- `quiz.md`


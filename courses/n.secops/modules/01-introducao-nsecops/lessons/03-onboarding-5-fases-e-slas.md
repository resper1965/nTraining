## Aula 03 — Onboarding do cliente (5 fases) e SLAs

### Objetivo
Entender como conduzir um onboarding consistente e como SLAs/KPIs amarram expectativa, operação e melhoria contínua.

### Onboarding em 5 fases (modelo)
1. **Descoberta e escopo**
   - O que será monitorado/detectado/respondido
   - Canais e pessoas de contato (técnico/gestão)
2. **Integração de dados**
   - Conectores/coletores, cobertura por ambiente, validação de qualidade de log
3. **Baseline e casos de uso**
   - Casos prioritários, severidades, tuning inicial, thresholds
4. **Operação assistida**
   - Primeiros alertas, ajuste de ruído, handoffs, comunicação e templates
5. **Otimização contínua**
   - Backlog de melhorias, novas detecções, automação e revisão mensal

### SLAs e métricas (exemplos)
- **MTTD** (Mean Time to Detect): tempo do evento → detecção
- **MTTA** (Mean Time to Acknowledge): tempo para reconhecer/triagem inicial
- **MTTR** (Mean Time to Respond): tempo para conter/mitigar (quando aplicável)
- **FP rate**: taxa de falso positivo por caso de uso

> Exemplo de alvo: **MTTD < 15min** e **MTTR < 1h** (depende de escopo/autonomia).

### Exercício
Para um cliente hipotético, defina:
- 3 SLAs (com alvo) e 3 KPIs (para relatório)
- Quais dependências do cliente impactam diretamente cada SLA


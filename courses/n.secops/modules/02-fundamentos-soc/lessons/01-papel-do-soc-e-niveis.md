## Aula 01 — Papel do SOC e níveis (N1/N2/N3)

### Objetivo
Entender responsabilidades, expectativas e “handoffs” para operar com consistência e reduzir retrabalho.

### Conceitos‑chave
- **SOC**: função operacional focada em monitorar, detectar e responder.
- **Modelo 24x7**: depende de processo, padronização de decisão e registro.
- **Níveis**:
  - **N1 (triagem)**: validar sinal, coletar evidências mínimas, classificar, escalar.
  - **N2 (investigação)**: correlacionar fontes, construir linha do tempo, recomendar contenção.
  - **N3 (especialista/engenharia)**: tuning de detecções, hunting, automação, resposta avançada.

### Fluxo operacional mínimo (recomendado)
1. **Receber alerta** → 2. **Validar contexto** → 3. **Coletar evidências mínimas** → 4. **Classificar severidade** → 5. **Definir próximo passo** (fechar / monitorar / escalar / conter).

### Evidências mínimas (checklist)
- Quem: usuário/conta, host, IP, organização/tenant
- O quê: evento (regra), recurso afetado, hipótese inicial
- Quando: timestamps (origem e detecção), timezone
- Onde: origem/destino (rede, app, cloud)
- Como: processo, comando, URL, hash (quando existir)


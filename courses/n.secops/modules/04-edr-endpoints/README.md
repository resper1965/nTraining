## Módulo 04 — EDR: Proteção de Endpoints

**Duração estimada:** 1.5h  
**Objetivo:** compreender detecção e resposta em endpoints e como integrar com o SIEM na prática.

### Resultados esperados
- Triar alertas de endpoint com evidências mínimas (processo, pai/filho, rede, persistência)
- Executar ações de resposta com governança (isolamento, kill, coleta) quando permitido
- Conectar investigação de endpoint com contexto do SIEM (identidade/rede)

### Pré‑requisitos
- Módulo 02 (processo SOC) e Módulo 03 (noções de correlação)

### Tópicos
- AV tradicional vs EDR
- Detecção comportamental vs assinaturas
- Telemetria de endpoints (processos, rede, persistência)
- Capacidades de resposta (isolamento, kill process, coleta)
- Machine learning em detecção (limites e cuidados)
- Integração EDR + SIEM

### Aulas
1. `lessons/01-av-vs-edr-e-telemetria.md`
2. `lessons/02-investigacao-endpoint-evidencias-minimas.md`
3. `lessons/03-resposta-e-integracao-edr-siem.md`

### Prática
- Checklist de investigação (evidências mínimas, ações permitidas, quando escalar)

### Avaliação
- `quiz.md`

### Standards e referências
- `../../standards/README.md`
- `../../standards/cis-controls-v8.md` (endpoint e controles operacionais)
- `../../standards/mitre-attck.md` (técnicas e evidências)
- `../../standards/nist-800-61-incident-response.md` (resposta e preservação)


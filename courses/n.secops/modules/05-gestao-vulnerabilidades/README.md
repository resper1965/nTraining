## Módulo 05 — Gestão de Vulnerabilidades

**Duração estimada:** 1.5h  
**Objetivo:** entender o ciclo de gestão de vulnerabilidades e como priorizar por risco e contexto do negócio.

### Resultados esperados
- Explicar CVE/CVSS e seus limites (contexto > número)
- Priorizar backlog por risco real (exposição + ativo crítico + exploitabilidade)
- Produzir insumo para patch management/tickets (acionável)

### Pré‑requisitos
- Módulo 09 (inventário) recomendado para priorização consistente

### Tópicos
- CVE/CVSS e o que “criticidade” realmente significa
- Ciclo: descoberta → priorização → remediação → verificação
- Scan autenticado vs não autenticado
- Priorização por criticidade + exposição + relevância
- Relatórios executivos e técnicos
- Integração com patch management

### Aulas
1. `lessons/01-cve-cvss-e-contexto.md`
2. `lessons/02-scan-autenticado-vs-nao-autenticado.md`
3. `lessons/03-priorizacao-por-risco-e-relatorios.md`

### Prática
- Priorizar um backlog considerando CVSS + exposição + impacto de negócio.

### Avaliação
- `quiz.md`

### Standards e referências
- `../../standards/README.md`
- `../../standards/cis-controls-v8.md` (vulnerability management)
- `../../standards/iso-27001-27002.md` (governança e evidência)
- `../../standards/nist-800-40-patch-management.md` (conexão vuln → patch)


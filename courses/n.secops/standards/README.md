## Standards e referências — n.secops

Objetivo: dar **fundamentação** e linguagem comum para as operações descritas no curso (SOC/SIEM/EDR/Vuln/Patch/IR), facilitando auditoria, governança e melhoria contínua.

### Standards base (recomendados)
- **NIST CSF 2.0**: estrutura de capacidades (Govern, Identify, Protect, Detect, Respond, Recover)
- **NIST SP 800-61 r2**: Incident Response (processo e coordenação)
- **NIST SP 800-92**: Log Management (coleta, retenção, qualidade de logs)
- **NIST SP 800-40 r4**: Patch Management (processo e governança)
- **CIS Controls v8**: controles “operacionais” (priorização e implementação prática)
- **CIS Benchmarks**: hardening por tecnologia (baseline e drift)
- **ISO/IEC 27001 + 27002**: sistema de gestão + controles (evidência e auditoria)
- **ISO/IEC 27035**: gestão de incidentes (orientação alinhada a ISO)
- **MITRE ATT&CK**: linguagem de táticas/técnicas (detections/hunting)
- **FIRST TLP 2.0**: classificação/compartilhamento de informação (comunicação)

### Mapeamento rápido por módulo (Parte 1)
- **M1 (MSSP / onboarding / SLAs)**: NIST CSF, ISO 27001/27002, FIRST TLP
- **M2 (SOC / 24x7 / handoff)**: NIST CSF (Detect/Respond), ISO 27001 (registros), NIST 800-92 (logs)
- **M3 (SIEM / correlação)**: NIST 800-92, MITRE ATT&CK (casos de uso), CIS Controls (logging)
- **M4 (EDR)**: CIS Controls v8 (endpoint), MITRE ATT&CK (técnicas), NIST CSF
- **M5 (Vulnerabilidades)**: CIS Controls v8 (continuous vulnerability management), ISO 27001/27002
- **M6 (Patch/Hardening)**: NIST 800-40, CIS Benchmarks, ISO 27002
- **M7 (IR)**: NIST 800-61, ISO 27035, FIRST TLP (comunicação)
- **M8 (Threat Intel)**: MITRE ATT&CK, FIRST TLP (compartilhamento)
- **M9 (Inventário)**: NIST CSF (Identify), CIS Controls v8 (asset inventory)
- **M10 (KPIs/Relatórios)**: NIST CSF (metrics), ISO 27001 (evidências), SOC 2 (quando aplicável)

### Observação importante
Este curso **não substitui** a adoção formal de um ISMS (ex.: ISO 27001), mas usa os standards como referência para tornar a operação **mensurável, auditável e repetível**.


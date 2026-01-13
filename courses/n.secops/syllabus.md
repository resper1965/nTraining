## Ementa — n.secops (Programa de Treinamento)

## Parte 1 — Conceitual

### Módulo 1: Introdução ao n.secops (1h)
- O que é segurança gerenciada (MSSP)
- Proposta de valor do n.secops
- Casos de uso típicos (ransomware, compliance, TI enxuta)
- Onboarding do cliente (5 fases)
- Métricas e SLAs (ex.: MTTD < 15min, MTTR < 1h)

### Módulo 2: Fundamentos do SOC (2h)
- Papel do SOC na organização
- Modelo de operação 24x7
- Níveis de atendimento (N1, N2, N3)
- Ciclo de vida de um alerta
- Shift handoff e comunicação entre turnos
- Documentação e registro de atividades

### Módulo 3: SIEM — Correlação de Eventos (2h)
- O que é um SIEM e por que importa
- Fontes de logs (AD, firewalls, EDR, cloud, aplicações)
- Normalização e parsing de eventos
- Regras de correlação, alertas e thresholds
- Dashboards e visualização
- Casos de uso (brute force, movimentação lateral, exfiltração)

### Módulo 4: EDR — Proteção de Endpoints (1.5h)
- AV vs EDR
- Detecção comportamental vs assinaturas
- Telemetria de endpoints
- Capacidades de resposta (isolamento, kill process, coleta forense)
- Integração EDR + SIEM

### Módulo 5: Gestão de Vulnerabilidades (1.5h)
- CVE/CVSS e ciclo de vida (descoberta → priorização → remediação → verificação)
- Scan autenticado vs não autenticado
- Priorização por criticidade e contexto
- Relatórios executivos e técnicos
- Integração com patch management

### Módulo 6: Patch Management e Hardening (1.5h)
- Patching: ciclo, janelas, rollback, métricas (patch compliance, tempo médio)
- Hardening: CIS Benchmarks, baseline, auditoria de conformidade

### Módulo 7: Incident Response (2h)
- Frameworks (NIST, SANS)
- Fases (Preparação → Detecção → Contenção → Erradicação → Recuperação → Lições)
- Playbooks/runbooks, escalação e comunicação
- Preservação de evidências, war room, gestão de crise
- Integração com n.cirt

### Módulo 8: Threat Intelligence (1h)
- Níveis (estratégico, tático, operacional)
- IOCs, TTPs e MITRE ATT&CK
- Feeds e aplicação prática em SIEM/EDR

### Módulo 9: Inventário de Ativos e Visibilidade (1h)
- Descoberta automática, CMDB, shadow IT
- Superfície de ataque e visibilidade

### Módulo 10: Métricas, KPIs e Relatórios (1h)
- MTTD/MTTR, patch compliance, vulnerabilidades por criticidade, FP rate
- Relatórios mensais executivos e evidências para auditorias (ISO 27001, SOC 2)

## Parte 2 — Ferramentas (Prático)
> A ser desenvolvido/ajustado após validação da Parte 1.

### Módulo T1: SIEM (ferramenta específica)
- Interface, queries, análise de alertas, dashboards, tuning

### Módulo T2: EDR (ferramenta específica)
- Console, investigação, ações de resposta, threat hunting básico

### Módulo T3: Vulnerability Scanner (ferramenta específica)
- Scans, análise, relatórios, integração com tickets

### Módulo T4: RMM e Patch Management (ferramenta específica)
- Agentes, políticas, scripts, saúde

### Módulo T5: Ticketing e Documentação
- Fluxo de tickets, templates, SLAs e escalação



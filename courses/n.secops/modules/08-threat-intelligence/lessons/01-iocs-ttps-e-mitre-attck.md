## Aula 01 — IOCs, TTPs e MITRE ATT&CK (aplicação prática)

### Objetivo
Usar inteligência de ameaças para melhorar triagem, investigação e detecções, priorizando **comportamento (TTP)** e usando **IOCs** com consciência de validade/expiração.

### Níveis de Threat Intelligence (quando usar)
- **Estratégico**: direciona investimento e risco (gestão)
- **Tático**: padrões de campanha, famílias, infraestrutura
- **Operacional**: TTPs, detecções e playbooks

### IOCs (Indicators of Compromise)
Exemplos: hash, domínio, IP, URL.  
Limites:
- expiram rápido (infra muda)
- podem gerar alto FP (IP compartilhado, CDN, etc.)
- são fáceis de “trocar” pelo atacante

### TTPs e MITRE ATT&CK (mínimo viável)
- **Tática**: intenção (ex.: Credential Access, Exfiltration)
- **Técnica**: como foi feito (ex.: Phishing, Valid Accounts)

Como aplicar na rotina:
1. Ao investigar: mapear **1 técnica principal** (mesmo aproximada).
2. Ao confirmar incidente: usar técnica/tática para buscar “antes/depois” (linha do tempo).
3. Ao fechar como FP: registrar o porquê e sugerir tuning.

### Exercício
Escolha 2 alertas reais (ou cenários) e preencha:
- Técnica/tática provável (ATT&CK)
- 3 evidências que confirmam/refutam
- 1 ideia de detecção complementar (comportamental)


## Aula 02 — Scan autenticado vs não autenticado

### Objetivo
Entender diferenças práticas e como isso afeta falso positivo/negativo e confiança do relatório.

### Conceitos‑chave
- **Não autenticado**: visão “externa”; bom para superfície exposta, pode perder detalhes internos.
- **Autenticado**: visão “interna” (pacotes, versões reais, configs); geralmente mais preciso.

### Riscos e cuidados
- Credenciais do scanner (privilégios, rotação, armazenamento)
- Impacto de performance/janela de scan
- Escopo correto (evitar varrer ambientes fora do combinado)

### Checklist operacional
- [ ] Escopo (assets/segmentos) definido e aprovado
- [ ] Credenciais e permissões mínimas necessárias
- [ ] Janela e limite de taxa (rate limit)
- [ ] Critérios de sucesso (cobertura %)
- [ ] Plano de exceção (assets sensíveis)

### Exercício
Defina um plano de scan para um cliente:
- quais segmentos serão autenticados e por quê
- periodicidade
- como validar cobertura e qualidade


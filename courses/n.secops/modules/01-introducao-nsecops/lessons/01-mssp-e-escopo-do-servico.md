## Aula 01 — MSSP e escopo do serviço

### Objetivo
Nivelar o entendimento do que é um MSSP (segurança gerenciada) e quais são os limites de escopo de um serviço como o n.secops.

### O que é um MSSP (em termos operacionais)
- **Monitorar**: coletar telemetria e acompanhar sinais relevantes.
- **Detectar**: transformar eventos em alertas acionáveis (com contexto).
- **Responder**: orientar/realizar contenção e mitigação conforme o modelo acordado.
- **Evoluir**: reduzir ruído, ampliar cobertura e melhorar tempo de resposta.

### Escopo (perguntas que sempre precisam de resposta)
- **O que monitoramos?** (fontes de log, endpoints, identidades, cloud, apps)
- **O que detectamos?** (casos de uso e severidades)
- **O que respondemos?** (ações permitidas, janela, autonomia, aprovações)
- **Como comunicamos?** (canais, cadência, escalonamento)
- **Como medimos?** (SLAs, KPIs, qualidade de alerta)

### Anti‑armadilhas comuns
- “SOC mágico”: sem telemetria adequada não existe detecção confiável.
- “Tudo é incidente”: severidade e contexto importam (priorização).
- “Responder sem combinar”: ações devem respeitar autonomia e governança do cliente.

### Exercício (10–15min)
Escreva o escopo do n.secops para um cliente hipotético:
- O que entra (3 itens) / o que não entra (3 itens)
- Quais 2 ações de resposta podem ser automáticas?
- Quais 2 ações exigem aprovação?


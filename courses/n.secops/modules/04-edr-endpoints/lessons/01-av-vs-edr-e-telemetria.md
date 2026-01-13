## Aula 01 — AV vs EDR e telemetria de endpoint

### Objetivo
Entender o que o EDR observa (telemetria) e por que isso muda a forma de detectar e responder a ameaças.

### Conceitos‑chave
- **AV (tradicional)**: foco em assinatura/IOC e bloqueio básico.
- **EDR**: foco em comportamento + contexto (processo, árvore, rede, persistência).
- **Telemetria típica**:
  - criação de processo (pai/filho, comando)
  - conexões de rede (destino, porta, SNI/DNS quando disponível)
  - persistência (serviços, tasks, chaves de registro)
  - alterações de segurança (defender off, tamper, etc.)

### Checklist (o que sempre olhar num alerta de endpoint)
- [ ] Processo (nome) + **linha de comando**
- [ ] Processo pai e cadeia (árvore)
- [ ] Usuário que executou
- [ ] Hash/assinatura (quando houver)
- [ ] Conexões de rede associadas
- [ ] Ação já tomada pelo EDR (blocked/quarantined/allowed)

### Exercício
Monte um “mapa de evidências” para 3 tipos de alertas:
- malware suspeito
- execução de powershell/command interpreter
- persistência criada


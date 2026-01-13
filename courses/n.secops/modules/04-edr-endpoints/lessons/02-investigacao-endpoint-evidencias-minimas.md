## Aula 02 — Investigação de endpoint (evidências mínimas)

### Objetivo
Conduzir investigação consistente em endpoint sem “pular” etapas: confirmar contexto, montar hipótese e decidir ação.

### Fluxo mínimo de investigação
1. Entender o alerta (regra, severidade, motivo)
2. Ver cadeia de processos (pai/filho)
3. Ver conexões de rede e destinos
4. Ver persistência/artefatos (se aplicável)
5. Ver escopo (outros hosts/usuários)
6. Decidir: FP / monitorar / escalar / conter

### Evidências mínimas (para ticket)
- Host (id/hostname) e usuário
- Processo + comando + pai/filho
- Hash (se houver) e reputação
- Destinos de rede (domínio/IP) + horários
- Ações já tomadas (quarentena/blocked)

### Exercício
Crie um ticket usando `templates/ticket-triagem.md` para um alerta:
“Processo suspeito abriu conexão para domínio recém-criado”.

### Saída esperada
Ticket completo com hipótese inicial + próximos passos claros.


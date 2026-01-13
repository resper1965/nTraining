## Aula 02 — Correlação, thresholds e qualidade de alerta

### Objetivo
Criar regras de correlação que gerem alertas acionáveis (bons sinais), com threshold e contexto que reduzam falsos positivos.

### Conceitos‑chave
- **Correlação**: juntar eventos relacionados para formar um sinal (ex.: falhas + sucesso).
- **Threshold**: limite que dispara alerta (quantidade, janela de tempo, condição).
- **Contexto**: enriquecer (usuário privilegiado, IP novo, geografia, ativo crítico).
- **Qualidade**: FP rate, volume, “time to triage”, feedback do analista.

### Padrão de regra (mínimo viável)
- Nome do caso de uso
- Fontes necessárias
- Condições (eventos + janela de tempo)
- Threshold inicial
- Exclusões esperadas (ex.: scanners, contas de serviço)
- Evidências mínimas que o alerta deve trazer (campos)
- Critério de severidade (ex.: alto se “conta privilegiada + IP novo”)

### Exercício
Especificar uma regra para “password spraying”:
- janela de 10–30 min
- contagem de falhas por IP e por usuário
- condição de “sucesso após falhas”
- como excluir ruído (VPN corporativa, IPs de monitoramento)

### Saída esperada
Um “spec” de regra pronto para implementar no SIEM (mesmo sem sintaxe da ferramenta).


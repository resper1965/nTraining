## Design Principles (Cursor) — nTraining / ness branding

**Objetivo**: quando o Cursor gerar ou refatorar UI, produzir interfaces “enterprise-grade” (admin/dashboards) com consistência visual, densidade correta e acabamento (craft), alinhado ao design system do projeto.

### Stack / restrições do projeto
- Use **Next.js App Router + React + TypeScript**
- Use **Tailwind CSS** (4px grid) e **shadcn/ui** (`components/ui/*`)
- Ícones: **lucide-react**
- Não introduza bibliotecas novas de UI/estilo sem solicitação explícita

### Antes de codar: escolha uma direção de design
Escolha **1** direção (e seja consistente):
- **Precisão & Densidade**: interfaces técnicas, compactas, foco em produtividade (admin)
- **Sofisticação & Confiança**: camadas sutis, contraste controlado (B2B/enterprise)
- **Utilidade & Função**: aparência “GitHub-like”, baixa ornamentação, altíssima clareza

> Para o nTraining, prefira **Precisão & Densidade** no admin e **Sofisticação & Confiança** nas áreas de aluno.

### Fundamentos obrigatórios (sempre)
- **4px grid**: todo spacing é múltiplo de 4 (`p-2/3/4/6/8`, `gap-2/3/4/6`, etc.)
- **Hierarquia tipográfica**: Montserrat/“display” em títulos, Inter no corpo (ver `README.md` e `UX_UI_GUIDELINES.md`)
- **Profundidade consistente**: evite sombras dramáticas; use borda + fundo (slate) e uma estratégia de sombra sutil, se necessária
- **Cor com propósito**: cinzas estruturam; **primary** comunica ação/estado (ness blue `#00ade8`)
- **Densidade intencional**: admin deve ser informativo sem poluição; use seções, cards, tabs e “progressive disclosure”
- **Acessibilidade**: foco visível, labels, contraste, estados de erro/disabled, navegação por teclado

### Anti‑padrões (evitar)
- Gradientes decorativos, glassmorphism e sombras exageradas
- Padding assimétrico (TLBR inconsistente) sem motivo funcional
- Tabelas/listas sem estados (loading/empty/error)
- Componentes custom “do zero” quando já existe equivalente em `components/ui/*`

### Padrões de composição (preferir)
- **Pages admin**:
  - Header (título + descrição curta + ações primárias à direita)
  - Barra de filtros (busca, select, chips)
  - Conteúdo em cards/tabela com estados (skeleton/empty/error)
- **Forms**:
  - Labels acima, help text curto, validação acionável
  - Ações no rodapé (Cancelar secundário, Salvar primário)
- **Dados**:
  - Números/IDs/timestamps em **mono** quando relevante
  - Alinhamento e espaçamento consistentes em tabelas

### Paleta e tokens (seguir o que já existe no projeto)
Use a base “slate” e o **primary** do projeto, conforme `UX_UI_GUIDELINES.md`:
- Backgrounds: `slate-950/900/800`
- Texto: `text-white`, `text-slate-300/400/500`
- Bordas: `border-slate-800/700`

### Quando estiver gerando UI
Ao entregar uma tela/componente:
- Garanta **loading / empty / error states**
- Garanta **responsividade** (mobile-first)
- Garanta consistência com componentes existentes e classes já usadas no projeto


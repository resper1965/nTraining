# ♿ Acessibilidade - nTraining

**Data:** 2026-01-13
**Branch:** `claude/analyze-repository-qFNAF`

---

## 📊 Resumo

Guia de boas práticas de acessibilidade implementadas e recomendações para a aplicação nTraining.

---

## ✅ Implementado

### 1. Skip Link ✅
- **Componente:** `components/ui/skip-link.tsx`
- **Uso:** Permite usuários de teclado/screen reader pularem navegação
- **Implementação:**
  ```tsx
  import { SkipLink } from '@/components/ui/skip-link'

  export default function Layout({ children }) {
    return (
      <>
        <SkipLink />
        <nav>{/* ... */}</nav>
        <main id="main-content">{children}</main>
      </>
    )
  }
  ```

### 2. Semantic HTML ✅
- Uso correto de tags semânticas: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`
- Headings hierárquicos: H1 → H2 → H3

### 3. Alt Text em Imagens ✅
- `next/image` com prop `alt` descritivo
- Exemplo: `alt={course.title}` em vez de `alt="thumbnail"`

### 4. Focus Visible ✅
- Tailwind: `focus:ring-2 focus:ring-primary`
- Configurado globalmente no CSS

---

## 📋 Checklist de Acessibilidade

### Navegação por Teclado ⚠️
- [x] Todos os elementos interativos são focáveis
- [x] Ordem de foco lógica (tab order)
- [x] Skip link implementado
- [ ] Atalhos de teclado documentados
- [ ] Focus trap em modais

### ARIA Labels ⚠️
- [x] Botões com ícones têm aria-label
  ```tsx
  <Button aria-label="Fechar modal">
    <X className="h-4 w-4" />
  </Button>
  ```
- [ ] Forms têm labels associados
- [ ] Loading states têm aria-busy
- [ ] Modais têm aria-modal e role="dialog"

### Contraste de Cores ✅
- [x] Texto branco (#ffffff) em fundo escuro (slate-950)
- [x] Ratio mínimo: 7:1 (WCAG AAA)
- [x] Links destacados do texto (cor diferente)

### Imagens ✅
- [x] Todas as imagens têm alt text
- [x] Imagens decorativas com alt=""
- [x] next/image para otimização automática

### Forms ⚠️
- [x] Labels visíveis em todos os inputs
- [x] Validação com mensagens claras
- [ ] Erro associado ao campo (aria-describedby)
- [ ] Required fields marcados visualmente

---

## 🎯 Recomendações de Implementação

### 1. ARIA Labels em Botões com Ícones

**Antes:**
```tsx
<Button>
  <Download className="h-4 w-4" />
</Button>
```

**Depois:**
```tsx
<Button aria-label="Baixar certificado">
  <Download className="h-4 w-4" />
</Button>
```

### 2. Loading States

**Antes:**
```tsx
{isLoading && <Loader2 className="animate-spin" />}
```

**Depois:**
```tsx
{isLoading && (
  <div role="status" aria-live="polite">
    <Loader2 className="animate-spin" aria-hidden="true" />
    <span className="sr-only">Carregando...</span>
  </div>
)}
```

### 3. Modais Acessíveis

```tsx
<Dialog
  open={isOpen}
  onOpenChange={setIsOpen}
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <DialogContent role="dialog" aria-modal="true">
    <DialogTitle id="dialog-title">Título do Modal</DialogTitle>
    <DialogDescription id="dialog-description">
      Descrição do modal
    </DialogDescription>
    {/* ... */}
  </DialogContent>
</Dialog>
```

### 4. Forms com Validação

```tsx
<div>
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    aria-required="true"
    aria-invalid={!!errors.email}
    aria-describedby={errors.email ? "email-error" : undefined}
  />
  {errors.email && (
    <p id="email-error" role="alert" className="text-red-400 text-sm">
      {errors.email}
    </p>
  )}
</div>
```

### 5. Tabelas Acessíveis

```tsx
<table>
  <caption className="sr-only">Lista de usuários cadastrados</caption>
  <thead>
    <tr>
      <th scope="col">Nome</th>
      <th scope="col">Email</th>
      <th scope="col">Ações</th>
    </tr>
  </thead>
  <tbody>
    {users.map(user => (
      <tr key={user.id}>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>
          <Button aria-label={`Editar ${user.name}`}>
            <Edit className="h-4 w-4" />
          </Button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

---

## 🧪 Como Testar

### 1. Navegação por Teclado
```
1. Use apenas TAB para navegar
2. ENTER/SPACE para ativar botões
3. ESC para fechar modais
4. Arrow keys em menus dropdown
```

### 2. Screen Reader (NVDA - Windows)
```
1. Baixar NVDA: https://www.nvaccess.org/
2. Ativar: CTRL + ALT + N
3. Navegar com TAB
4. Ouvir conteúdo: INSERT + DOWN ARROW
```

### 3. Screen Reader (VoiceOver - macOS)
```
1. Ativar: CMD + F5
2. Navegar: VO + RIGHT ARROW (VO = CTRL + OPTION)
3. Interagir: VO + SPACE
```

### 4. Chrome DevTools - Lighthouse
```
1. F12 → Aba "Lighthouse"
2. Categoria: "Accessibility"
3. Device: Mobile + Desktop
4. Run audit
5. Meta: Score > 90
```

### 5. Ferramentas Automáticas
- **axe DevTools:** Extensão Chrome/Firefox
- **WAVE:** https://wave.webaim.org/
- **Accessibility Insights:** Microsoft

---

## 📊 WCAG 2.1 Compliance

### Level A (Básico) - Implementado ✅
- [x] 1.1.1 Text Alternatives (alt text)
- [x] 2.1.1 Keyboard (navegação por teclado)
- [x] 2.4.1 Bypass Blocks (skip link)
- [x] 3.1.1 Language of Page (lang="pt-BR")
- [x] 4.1.2 Name, Role, Value (semantic HTML)

### Level AA (Intermediário) - Parcial ⚠️
- [x] 1.4.3 Contrast (7:1 ratio)
- [x] 2.4.7 Focus Visible
- [ ] 3.2.4 Consistent Identification
- [ ] 3.3.3 Error Suggestion

### Level AAA (Avançado) - Futuro ⏳
- [ ] 1.4.6 Contrast (Enhanced)
- [ ] 2.4.8 Location (breadcrumbs)
- [ ] 3.1.3 Unusual Words (glossário)

---

## 🎨 Design Patterns Acessíveis

### 1. Button vs Link

```tsx
// ✅ Link: Navegação
<Link href="/courses">Ver Cursos</Link>

// ✅ Button: Ação
<Button onClick={handleSubmit}>Salvar</Button>

// ❌ EVITAR: Link com onClick
<a href="#" onClick={handleAction}>Action</a>
```

### 2. Icon Buttons

```tsx
// ✅ Com label
<Button aria-label="Adicionar ao carrinho">
  <Plus className="h-4 w-4" />
</Button>

// ✅ Com texto visível
<Button>
  <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
  Adicionar
</Button>
```

### 3. Tooltips

```tsx
// ✅ Acessível
<Tooltip>
  <TooltipTrigger aria-describedby="tooltip-description">
    <HelpCircle className="h-4 w-4" />
  </TooltipTrigger>
  <TooltipContent id="tooltip-description" role="tooltip">
    Ajuda sobre este campo
  </TooltipContent>
</Tooltip>
```

---

## 📝 Documentação de Atalhos

Atalhos de teclado a serem implementados:

| Atalho | Ação |
|--------|------|
| `/` | Focar busca |
| `?` | Mostrar ajuda |
| `Esc` | Fechar modal |
| `Tab` | Próximo elemento |
| `Shift + Tab` | Elemento anterior |
| `Enter` | Ativar link/botão |
| `Space` | Ativar botão/checkbox |

---

## 🚀 Próximos Passos

### Prioridade Alta
1. **Adicionar aria-labels** em todos os botões com ícones
2. **Skip link** em todos os layouts
3. **Focus trap** em modais
4. **aria-live regions** para notificações

### Prioridade Média
5. **Keyboard shortcuts** documentados
6. **Error messages** associados a campos (aria-describedby)
7. **Required fields** marcados visualmente com asterisco

### Prioridade Baixa
8. **Breadcrumbs** para navegação
9. **Glossário** para termos técnicos
10. **High contrast mode** suporte

---

## ✅ Checklist de QA

```markdown
- [ ] Toda a aplicação navegável apenas com teclado
- [ ] Skip link funciona (Tab → Enter leva ao conteúdo)
- [ ] Screen reader lê todo o conteúdo corretamente
- [ ] Lighthouse Accessibility score > 90
- [ ] Formulários validam e mostram erros claramente
- [ ] Modais fecham com ESC
- [ ] Focus visível em todos os elementos
- [ ] Alt text em todas as imagens
- [ ] Contraste de cores adequado (>7:1)
- [ ] Sem flash/animações rápidas (risco de epilepsia)
```

---

## 📚 Recursos

- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [Inclusive Components](https://inclusive-components.design/)

---

**Documento criado:** 2026-01-13
**Responsável:** Claude Code Agent
**Status:** 🔄 Acessibilidade básica implementada - Melhorias contínuas

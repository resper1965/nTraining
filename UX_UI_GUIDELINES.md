# 🎨 Diretrizes de UX/UI - n.training Platform
## Baseado em Context7 e Design System ness

---

## 📋 Princípios Fundamentais

### 1. Pesquisa e Compreensão do Usuário

**Objetivo:** Entender profundamente as necessidades, comportamentos e expectativas dos usuários finais.

**Aplicação:**
- **Personas principais:**
  - **Estudante:** Busca aprender de forma eficiente, precisa de progresso claro
  - **Org Manager:** Gerencia equipe, precisa de visibilidade e controle
  - **Superadmin:** Administra plataforma, precisa de ferramentas poderosas

- **Jornadas do usuário mapeadas:**
  - Login → Dashboard → Selecionar Curso → Assistir Aulas → Completar → Certificado
  - Admin: Login → Dashboard Admin → Criar Curso → Atribuir → Monitorar Progresso

**Implementação:**
- Feedback constante do usuário através de analytics
- Testes de usabilidade regulares
- Iteração baseada em dados reais

---

### 2. Arquitetura da Informação e Navegação

**Objetivo:** Organizar conteúdo e funcionalidades de forma lógica e intuitiva.

**Padrões de Navegação:**

#### Para Estudantes:
```
Header (fixo)
├── Logo n.training
├── Busca Global
├── Notificações
└── Perfil (dropdown)
    ├── Meu Perfil
    ├── Meus Certificados
    └── Sair

Sidebar (dashboard)
├── Dashboard
├── Meus Cursos
├── Trilhas
├── Certificados
└── Configurações
```

#### Para Admins:
```
Header (fixo)
├── Logo Admin
├── Breadcrumbs
└── Perfil

Sidebar (admin)
├── Dashboard
├── Organizações
├── Cursos
├── Usuários
├── Licenças
├── Relatórios
└── Configurações
```

**Regras:**
- Máximo 3 níveis de profundidade
- Breadcrumbs sempre visíveis
- Navegação consistente em todas as páginas
- Menu ativo sempre destacado

---

### 3. Design de Interface Consistente

**Objetivo:** Garantir experiência visual uniforme em toda a aplicação.

#### Paleta de Cores (ness Branding)

```css
/* Backgrounds */
--bg-primary: #0f172a (slate-950)
--bg-secondary: #1e293b (slate-900)
--bg-tertiary: #334155 (slate-800)

/* Text */
--text-primary: #ffffff
--text-secondary: #cbd5e1 (slate-300)
--text-tertiary: #94a3b8 (slate-400)
--text-muted: #64748b (slate-500)

/* Primary (ness blue) */
--primary: #00ade8
--primary-hover: #0099cc
--primary-light: #00ade8/20

/* Status */
--success: #10b981 (green-500)
--warning: #f59e0b (amber-500)
--error: #ef4444 (red-500)
--info: #00ade8
```

#### Tipografia

```css
/* Display (Montserrat) */
--font-display: 'Montserrat', sans-serif
--display-weight: 500 (medium)
--display-line-height: 1.25 (tight)

/* Body (Inter) */
--font-body: 'Inter', sans-serif
--body-weight: 400 (regular)
--body-line-height: 1.625 (relaxed)

/* Tamanhos */
--text-xs: 0.75rem (12px)
--text-sm: 0.875rem (14px)
--text-base: 1rem (16px)
--text-lg: 1.125rem (18px)
--text-xl: 1.25rem (20px)
--text-2xl: 1.5rem (24px)
--text-3xl: 1.875rem (30px)
--text-4xl: 2.25rem (36px)
```

#### Espaçamento

- **Base:** 4px
- **Escala:** 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px
- **Padding padrão:** 16px (p-4)
- **Gap padrão:** 16px (gap-4)

#### Componentes Base

**Botões:**
```tsx
// Primary
<Button className="bg-primary hover:bg-primary-hover text-white">
  Ação Principal
</Button>

// Secondary
<Button variant="outline" className="border-slate-700 text-slate-300">
  Ação Secundária
</Button>

// Ghost
<Button variant="ghost" className="text-slate-400 hover:text-white">
  Ação Terciária
</Button>
```

**Cards:**
```tsx
<Card className="bg-slate-900 border-slate-800">
  <CardHeader>
    <CardTitle className="font-display text-xl text-white">
      Título
    </CardTitle>
  </CardHeader>
  <CardContent className="text-slate-300">
    Conteúdo
  </CardContent>
</Card>
```

**Inputs:**
```tsx
<Input 
  className="bg-slate-800 border-slate-700 text-white 
             placeholder-slate-500 focus:ring-primary"
/>
```

---

### 4. Simplicidade e Clareza

**Objetivo:** Evitar sobrecarregar o usuário com informações desnecessárias.

**Regras:**

1. **Hierarquia Visual Clara**
   - Títulos sempre maiores e mais pesados
   - Informação importante destacada
   - Espaço em branco para respiração

2. **Linguagem Simples**
   - Evitar jargões técnicos
   - Frases curtas e diretas
   - Ações claras ("Criar Curso" vs "Iniciar processo de criação")

3. **Progressive Disclosure**
   - Mostrar apenas o necessário inicialmente
   - Detalhes em modais/abas quando necessário
   - Informações avançadas em seções colapsáveis

4. **Uma Ação por Tela**
   - Foco em uma tarefa principal
   - Ações secundárias menos proeminentes
   - Confirmações para ações destrutivas

**Exemplos:**

✅ **Bom:**
```
Dashboard
├── Cursos em Progresso (3)
├── Cursos Disponíveis (12)
└── Cursos Obrigatórios (2) [Destaque]
```

❌ **Ruim:**
```
Dashboard com 50 cards diferentes, todos com mesma importância
```

---

### 5. Feedback e Comunicação

**Objetivo:** Manter o usuário informado sobre o status de suas ações.

**Tipos de Feedback:**

#### 1. Loading States
```tsx
// Skeleton loaders
<Skeleton className="h-4 w-full bg-slate-800" />

// Spinners
<Loader2 className="h-4 w-4 animate-spin text-primary" />

// Progress bars
<Progress value={progress} className="bg-slate-800" />
```

#### 2. Success Messages
```tsx
<Toast variant="success">
  ✅ Curso criado com sucesso!
</Toast>
```

#### 3. Error Messages
```tsx
<Alert variant="destructive">
  ⚠️ Erro ao salvar. Tente novamente.
</Alert>
```

#### 4. Confirmações
```tsx
<AlertDialog>
  <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
  <AlertDialogDescription>
    Esta ação não pode ser desfeita.
  </AlertDialogDescription>
</AlertDialog>
```

#### 5. Validação em Tempo Real
- Validação de formulários enquanto usuário digita
- Mensagens de erro específicas e acionáveis
- Indicadores visuais (verde/vermelho) em campos

**Regras:**
- Feedback imediato (< 100ms para ações locais)
- Mensagens claras e acionáveis
- Sempre oferecer próximo passo
- Não bloquear interface durante operações assíncronas

---

### 6. Acessibilidade (WCAG 2.1 AA)

**Objetivo:** Assegurar que a aplicação seja utilizável por todos.

**Checklist:**

#### Contraste
- ✅ Texto sobre fundo: mínimo 4.5:1
- ✅ Texto grande: mínimo 3:1
- ✅ Elementos interativos: mínimo 3:1

#### Navegação por Teclado
- ✅ Todas as ações acessíveis via teclado
- ✅ Tab order lógico
- ✅ Focus visível
- ✅ Skip links para conteúdo principal

#### Screen Readers
- ✅ ARIA labels em elementos interativos
- ✅ Alt text em imagens
- ✅ Headings hierárquicos (h1 → h2 → h3)
- ✅ Landmarks (nav, main, aside)

#### Formulários
- ✅ Labels associados a inputs
- ✅ Mensagens de erro associadas
- ✅ Instruções claras

**Implementação:**
```tsx
// Exemplo de input acessível
<label htmlFor="email" className="sr-only">
  E-mail
</label>
<input
  id="email"
  type="email"
  aria-describedby="email-error"
  aria-invalid={hasError}
  className="..."
/>
{hasError && (
  <p id="email-error" className="text-red-400" role="alert">
    E-mail inválido
  </p>
)}
```

---

### 7. Testes e Iterações

**Objetivo:** Validar decisões de design e identificar melhorias.

**Processo:**

1. **Testes de Usabilidade**
   - Testar com usuários reais regularmente
   - Observar comportamento (não apenas perguntar)
   - Identificar pontos de confusão

2. **Métricas**
   - Taxa de conclusão de tarefas
   - Tempo para completar tarefas
   - Taxa de erro
   - Satisfação do usuário (NPS)

3. **Iteração Contínua**
   - Melhorias baseadas em dados
   - A/B testing quando apropriado
   - Feedback loops rápidos

---

## 🎯 Padrões Específicos por Contexto

### Dashboard do Estudante

**Layout:**
```
┌─────────────────────────────────────┐
│ Header (fixo)                       │
├─────────────────────────────────────┤
│                                     │
│  Bem-vindo, [Nome]!                 │
│                                     │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │ Em   │ │ Com  │ │ Disp │        │
│  │ Prog │ │pletos│ │onível│        │
│  └──────┘ └──────┘ └──────┘        │
│                                     │
│  Cursos Obrigatórios ⚠️             │
│  ┌─────────────────────────────┐   │
│  │ [Card] [Card] [Card]        │   │
│  └─────────────────────────────┘   │
│                                     │
│  Continue Aprendendo                │
│  ┌─────────────────────────────┐   │
│  │ [Card] [Card] [Card]        │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**Regras:**
- Máximo 3 cards por linha (desktop)
- Cards com hover effect sutil
- Progresso sempre visível
- Ações claras ("Continuar", "Iniciar")

### Formulários

**Estrutura:**
```
┌─────────────────────────────────────┐
│ Título do Formulário                │
│ Descrição breve                      │
├─────────────────────────────────────┤
│                                     │
│ Label                               │
│ [Input]                             │
│ Mensagem de ajuda (opcional)        │
│                                     │
│ Label                               │
│ [Select]                            │
│                                     │
│ [Cancelar] [Salvar]                 │
│                                     │
└─────────────────────────────────────┘
```

**Regras:**
- Labels sempre acima dos inputs
- Validação em tempo real
- Mensagens de erro específicas
- Botões de ação sempre no final
- Confirmação para ações destrutivas

### Listas e Tabelas

**Tabelas:**
- Headers fixos ao scroll
- Linhas alternadas (zebra striping)
- Hover em linha inteira
- Ações em coluna à direita
- Paginação clara

**Listas:**
- Cards em grid responsivo
- Filtros sempre visíveis
- Busca em tempo real
- Ordenação clara

### Modais e Dialogs

**Regras:**
- Overlay escuro (backdrop)
- Fechar com ESC ou clique fora
- Botão de fechar sempre visível
- Foco no primeiro campo (se formulário)
- Animações sutis (fade in/out)

---

## 📱 Responsividade

### Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Mobile First

- Começar com layout mobile
- Expandir para desktop
- Touch targets mínimos: 44x44px
- Menu hamburger em mobile
- Sidebar colapsável

---

## 🎨 Animações e Transições

**Princípio:** Movimento sutil

**Regras:**
- Duração: 150-300ms
- Easing: ease-in-out
- Apenas quando adiciona valor
- Respeitar prefers-reduced-motion

**Exemplos:**
```css
/* Hover em botões */
transition: all 150ms ease-in-out;

/* Modais */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Loading */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

---

## ✅ Checklist de Implementação

### Antes de Criar um Componente

- [ ] Segue o design system ness?
- [ ] É acessível (WCAG 2.1 AA)?
- [ ] Tem estados de loading/error?
- [ ] Feedback claro para ações?
- [ ] Responsivo (mobile-first)?
- [ ] Navegação por teclado funciona?
- [ ] Screen reader friendly?

### Antes de Criar uma Página

- [ ] Breadcrumbs (se aplicável)?
- [ ] Título claro e descritivo?
- [ ] Ações principais destacadas?
- [ ] Loading states?
- [ ] Empty states?
- [ ] Error handling?
- [ ] Navegação consistente?

---

**Documento criado em:** 2024-11-25
**Versão:** 1.0
**Baseado em:** Context7 UX/UI Guidelines + ness Branding


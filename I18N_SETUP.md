# 🌍 Sistema de Multiidioma (i18n) - n.training

## ✅ Implementação

Foi criada uma estrutura básica de internacionalização para suportar **Português (PT)** e **Inglês (EN)**.

### Arquivos Criados

1. **`lib/i18n/translations.ts`** - Traduções em PT e EN
2. **`lib/i18n/index.ts`** - Funções helper para gerenciar idiomas
3. **`components/language-switcher.tsx`** - Componente para trocar idioma

## 📋 Como Usar

### 1. Em Server Components

```typescript
import { getTranslations, getLocale } from '@/lib/i18n'

export default async function MyPage() {
  const locale = getLocale()
  const t = getTranslations(locale)
  
  return (
    <div>
      <h1>{t.dashboard.title}</h1>
      <p>{t.dashboard.welcomeBack}</p>
    </div>
  )
}
```

### 2. Em Client Components

```typescript
'use client'

import { useTranslations } from '@/hooks/use-translations' // Criar este hook
// Ou usar o componente LanguageSwitcher diretamente
```

### 3. Adicionar o Language Switcher

Adicione o componente `LanguageSwitcher` no header/navbar:

```typescript
import { LanguageSwitcher } from '@/components/language-switcher'

// No seu layout ou header
<LanguageSwitcher />
```

## 🔧 Próximos Passos para Implementação Completa

### 1. Criar Hook useTranslations

```typescript
// hooks/use-translations.ts
'use client'
import { useEffect, useState } from 'react'
import { getTranslations, type Locale } from '@/lib/i18n'

export function useTranslations() {
  const [locale, setLocale] = useState<Locale>('pt')
  
  useEffect(() => {
    const cookieLocale = document.cookie
      .split('; ')
      .find(row => row.startsWith('locale='))
      ?.split('=')[1] as Locale | undefined
    
    if (cookieLocale) {
      setLocale(cookieLocale)
    }
  }, [])
  
  return getTranslations(locale)
}
```

### 2. Atualizar Páginas para Usar Traduções

Substituir textos hardcoded por chamadas de tradução:

```typescript
// Antes
<h1>Welcome back</h1>

// Depois
<h1>{t.dashboard.welcomeBack}</h1>
```

### 3. Adicionar Mais Traduções

Expandir o arquivo `translations.ts` com mais textos conforme necessário.

## 📝 Estrutura de Traduções

As traduções estão organizadas por contexto:

- `common` - Textos comuns (botões, ações)
- `auth` - Autenticação
- `dashboard` - Dashboard
- `courses` - Cursos
- `admin` - Administração
- `progress` - Progresso
- `home` - Página inicial

## 🚀 Vantagens

1. **Fácil manutenção** - Todas as traduções em um só lugar
2. **Type-safe** - TypeScript garante que as chaves existem
3. **Escalável** - Fácil adicionar novos idiomas
4. **Performance** - Sem bibliotecas pesadas, apenas TypeScript

## 💡 Alternativa: next-intl

Se precisar de uma solução mais robusta, podemos usar `next-intl`:

```bash
npm install next-intl
```

Mas a solução atual já funciona bem para PT/EN!

---

**Status**: ✅ Estrutura básica criada, pronto para implementação completa


# 🎨 Toast Notifications - Guia de Padronização

**Data:** 2026-01-13
**Branch:** `claude/analyze-repository-qFNAF`

---

## 📊 Resumo

Sistema padronizado de toast notifications usando Sonner com mensagens consistentes em português, durações adequadas e cores semânticas.

---

## ✅ Configuração Atual

### Biblioteca: Sonner
- **Posição:** Top-right
- **Rich Colors:** Habilitado
- **Configurado em:** `app/layout.tsx`

```tsx
<SonnerToaster position="top-right" richColors />
```

---

## 🎯 Objetivos da Padronização

1. **Consistência:** Mensagens uniformes em toda a aplicação
2. **UX:** Durações adequadas por tipo de notificação
3. **Português:** Todas as mensagens em português brasileiro
4. **Semântica:** Cores apropriadas para cada tipo de ação
5. **Manutenibilidade:** Mensagens centralizadas e fáceis de atualizar

---

## 📦 Helper: `showToast`

**Arquivo:** `lib/toast.ts`

### Métodos Básicos

```tsx
import { showToast } from '@/lib/toast'

// Sucesso (verde) - 3s
showToast.success('Operação concluída!')

// Erro (vermelho) - 5s
showToast.error('Algo deu errado')

// Aviso (amarelo) - 4s
showToast.warning('Atenção!')

// Info (azul) - 4s
showToast.info('Informação importante')

// Loading
const toastId = showToast.loading('Processando...')
// ... operação ...
showToast.success('Concluído!') // Substitui o loading
```

---

### Mensagens Específicas - Cursos

```tsx
// Sucesso
showToast.course.created('React Avançado')
// → "Curso "React Avançado" criado com sucesso!"

showToast.course.updated('React Avançado')
// → "Curso "React Avançado" atualizado!"

showToast.course.published('React Avançado')
// → "Curso "React Avançado" publicado!"

// Erros
showToast.course.errorCreate()
// → "Erro ao criar curso. Tente novamente."

showToast.course.errorUpdate()
// → "Erro ao atualizar curso"
```

---

### Mensagens Específicas - Usuários

```tsx
// Sucesso
showToast.user.created('João Silva')
// → "Usuário "João Silva" criado!"

showToast.user.profileUpdated()
// → "Perfil atualizado!"

showToast.user.passwordChanged()
// → "Senha alterada com sucesso!"

showToast.user.avatarUpdated()
// → "Foto de perfil atualizada!"

// Erros
showToast.user.errorPassword()
// → "Erro ao alterar senha. Verifique a senha atual."
```

---

### Mensagens Específicas - Aulas/Lições

```tsx
showToast.lesson.created('Introdução ao React')
// → "Aula "Introdução ao React" criada!"

showToast.lesson.completed('Hooks Avançados')
// → "Aula "Hooks Avançados" concluída! 🎉"

showToast.lesson.errorComplete()
// → "Erro ao marcar aula como concluída"
```

---

### Mensagens Específicas - Trilhas

```tsx
showToast.path.created('Front-end Completo')
// → "Trilha "Front-end Completo" criada!"

showToast.path.completed('Full Stack Developer')
// → "Parabéns! Trilha "Full Stack Developer" concluída! 🏆"
```

---

### Mensagens Específicas - Certificados

```tsx
showToast.certificate.generated('React Avançado')
// → "Certificado de "React Avançado" gerado! 🎓"

showToast.certificate.downloaded()
// → "Certificado baixado com sucesso!"
```

---

### Mensagens Específicas - Quiz

```tsx
showToast.quiz.submitted(85)
// Score >= 70 → "Quiz concluído! Nota: 85% 🎉"

showToast.quiz.submitted(45)
// Score < 70 → "Quiz concluído. Nota: 45% - Tente novamente!" (warning)
```

---

### Mensagens Específicas - Upload de Arquivos

```tsx
const toastId = showToast.file.uploading()
// → "Enviando arquivo..."

// Sucesso
showToast.file.uploaded('documento.pdf')
// → "Arquivo "documento.pdf" enviado!"

// Erros
showToast.file.errorSize(5)
// → "Arquivo muito grande. Máximo: 5MB"

showToast.file.errorType()
// → "Tipo de arquivo não suportado"
```

---

### Mensagens Específicas - Exportação

```tsx
// Usado no ExportButton component
showToast.export.noData()
// → "Nenhum dado para exportar" (warning)

showToast.export.exported()
// → "Relatório CSV exportado!" (success)

showToast.export.errorExport()
// → "Erro ao exportar relatório" (error)
```

---

### Mensagens Específicas - Autenticação

```tsx
showToast.auth.loginSuccess('Maria Santos')
// → "Bem-vindo, Maria Santos!"

showToast.auth.sessionExpired()
// → "Sua sessão expirou. Faça login novamente." (warning)

showToast.auth.unauthorized()
// → "Você não tem permissão para essa ação" (error)
```

---

### Mensagens Específicas - Notificações

```tsx
showToast.notification.markAsRead()
// → "Notificação marcada como lida"

showToast.notification.markAllAsRead()
// → "Todas as notificações marcadas como lidas"
```

---

### Mensagens Genéricas

```tsx
showToast.generic.saved()
// → "Salvo com sucesso!"

showToast.generic.deleted()
// → "Removido com sucesso!"

showToast.generic.copied()
// → "Copiado para área de transferência!"

showToast.generic.errorNetwork()
// → "Erro de conexão. Verifique sua internet e tente novamente."

showToast.generic.errorUnknown()
// → "Ocorreu um erro inesperado. Tente novamente mais tarde."
```

---

### Toast com Promessa (Loading → Success/Error)

```tsx
const promise = createCourse(formData)

showToast.promise(promise, {
  loading: 'Criando curso...',
  success: 'Curso criado com sucesso!',
  error: 'Erro ao criar curso'
})

// Ou com função dinâmica
showToast.promise(updateUser(userId, data), {
  loading: 'Atualizando usuário...',
  success: (user) => `Usuário ${user.name} atualizado!`,
  error: (err) => `Erro: ${err.message}`
})
```

---

## 🎨 Cores e Durações

| Tipo | Cor | Duração | Uso |
|------|-----|---------|-----|
| **Success** | Verde | 3s | Operações bem-sucedidas |
| **Error** | Vermelho | 5s | Erros (fica mais tempo) |
| **Warning** | Amarelo | 4s | Avisos, atenção necessária |
| **Info** | Azul | 4s | Informações gerais |
| **Loading** | Cinza | Infinito | Operações em andamento |

---

## ✅ Componentes Já Atualizados

1. ✅ `components/admin/export-button.tsx`
   - Usa `showToast.export.noData()`
   - Usa `showToast.export.exported()`
   - Usa `showToast.export.errorExport()`

---

## 📋 Próximos Componentes a Atualizar

### Alta Prioridade
- [ ] `components/profile/avatar-upload.tsx`
- [ ] `components/profile/change-password-form.tsx`
- [ ] `components/profile/profile-form.tsx`
- [ ] `components/admin/learning-path-form.tsx`

### Média Prioridade
- [ ] `components/admin/add-licenses-dialog.tsx`
- [ ] `components/admin/assign-course-dialog.tsx`
- [ ] `components/admin/course-access-card.tsx`
- [ ] `components/admin/edit-course-access-dialog.tsx`

### Baixa Prioridade
- [ ] `components/notifications/mark-all-read-button.tsx`
- [ ] `components/notifications/notification-list.tsx`
- [ ] `components/admin/delete-path-button.tsx`
- [ ] `components/profile/notification-preferences-form.tsx`

---

## 🔧 Guia de Migração

### Antes (usando toast direto)
```tsx
import { toast } from 'sonner'

// ❌ Não padronizado
toast.success('Saved!')
toast.error('Error saving')
toast('Something happened')
```

### Depois (usando showToast)
```tsx
import { showToast } from '@/lib/toast'

// ✅ Padronizado
showToast.generic.saved()
showToast.generic.errorSave()
showToast.info('Something happened')
```

---

## 📝 Boas Práticas

### ✅ DO (Fazer)

```tsx
// ✅ Usar métodos específicos quando disponíveis
showToast.course.created(courseTitle)

// ✅ Mensagens claras e acionáveis
showToast.error('Erro ao salvar. Verifique os campos obrigatórios.')

// ✅ Usar emojis em conquistas/comemorações
showToast.lesson.completed(lessonTitle) // Tem emoji automático 🎉

// ✅ Feedback imediato em ações do usuário
const handleSave = async () => {
  const toastId = showToast.loading('Salvando...')
  await saveData()
  showToast.success('Salvo com sucesso!')
}
```

### ❌ DON'T (Não Fazer)

```tsx
// ❌ Mensagens vagas
showToast.error('Error')

// ❌ Mensagens em inglês
showToast.success('Successfully saved!')

// ❌ Toast para cada ação trivial
onClick={() => showToast.info('Button clicked')} // Não necessário

// ❌ Múltiplos toasts simultâneos para mesma ação
showToast.success('Saved!')
showToast.info('Data updated!') // Redundante

// ❌ Usar toast original quando existe helper
toast.success('Course created') // Use showToast.course.created() em vez disso
```

---

## 🚀 Próximos Passos

1. **Migrar componentes restantes** (~1h)
   - Atualizar todos os componentes da lista acima
   - Remover imports diretos de `toast from 'sonner'`

2. **Adicionar mensagens específicas conforme necessidade**
   - Modules (módulos)
   - Assignments (atribuições)
   - Reports (relatórios)

3. **Documentar no código**
   - Adicionar JSDoc nos Server Actions
   - Exemplos de uso nos comentários

---

## 📊 Resultados Esperados

### Antes da Padronização
- ❌ Mensagens inconsistentes (inglês + português)
- ❌ Durações variadas
- ❌ Alguns erros sem feedback visual
- ❌ Difícil manutenção (mensagens espalhadas)

### Depois da Padronização
- ✅ 100% mensagens em português
- ✅ Durações apropriadas por tipo
- ✅ Feedback consistente em todas as ações
- ✅ Fácil manutenção (tudo em `lib/toast.ts`)
- ✅ Melhor UX com mensagens claras e acionáveis

---

## 🎯 Exemplo Completo

```tsx
'use client'

import { showToast } from '@/lib/toast'
import { updateProfile } from '@/app/actions/profile'

export function ProfileForm() {
  const handleSubmit = async (formData: FormData) => {
    try {
      const name = formData.get('name') as string

      // Loading toast
      const toastId = showToast.loading('Atualizando perfil...')

      // API call
      const user = await updateProfile(formData)

      // Success toast (substitui loading)
      showToast.user.profileUpdated()

    } catch (error) {
      // Error toast
      if (error instanceof ValidationError) {
        showToast.error('Verifique os campos obrigatórios')
      } else if (error instanceof NetworkError) {
        showToast.generic.errorNetwork()
      } else {
        showToast.user.errorUpdate()
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* ... form fields ... */}
    </form>
  )
}
```

---

**Documento criado:** 2026-01-13
**Responsável:** Claude Code Agent
**Status:** ✅ Padronização implementada - Migração em andamento

# 🧪 Checklist de Testes - n.training

**Versão:** 1.0  
**Data:** 2026-01-14  
**Objetivo:** Garantir que todas as funcionalidades principais estão funcionando corretamente

---

## 📋 Índice

1. [Testes de Superadmin](#1-testes-de-superadmin)
2. [Testes de Student](#2-testes-de-student)
3. [Testes de Org Manager](#3-testes-de-org-manager)
4. [Testes Cross-Browser](#4-testes-cross-browser)
5. [Testes de Smoke (Produção)](#5-testes-de-smoke-produção)
6. [Registro de Bugs](#6-registro-de-bugs)

---

## 1. Testes de Superadmin

### 1.1 Autenticação
- [ ] **Login como superadmin**
  - Acessar `/auth/login`
  - Inserir credenciais de superadmin
  - Verificar redirecionamento para `/admin`
  - Verificar que `last_login_at` foi atualizado

- [ ] **Logout**
  - Clicar em "Sair" no header
  - Verificar redirecionamento para `/`
  - Tentar acessar `/admin` → deve redirecionar para login

- [ ] **Proteção de rotas**
  - Sem login, tentar acessar `/admin` → deve redirecionar
  - Sem login, tentar acessar `/dashboard` → deve redirecionar

### 1.2 Gestão de Organizações
- [ ] **Criar organização**
  - Acessar `/admin/organizations` ou `/admin/tenants`
  - Clicar em "Nova Organização"
  - Preencher: nome, slug, CNPJ (opcional)
  - Salvar e verificar criação

- [ ] **Visualizar organização**
  - Clicar em uma organização na lista
  - Verificar detalhes: usuários, cursos, licenças
  - Verificar métricas da organização

- [ ] **Editar organização**
  - Acessar detalhes da organização
  - Editar informações
  - Salvar e verificar atualização

- [ ] **Visualizar como organização** (se implementado)
  - Acessar modo de visualização
  - Verificar que vê apenas dados da organização

### 1.3 Gestão de Usuários
- [ ] **Criar usuário**
  - Acessar `/admin/users/new`
  - Preencher: nome completo, email, senha, role, organização
  - Salvar e verificar criação
  - Verificar que usuário pode fazer login imediatamente

- [ ] **Listar usuários**
  - Acessar `/admin/users`
  - Verificar lista de todos os usuários
  - Verificar filtros (se houver)

- [ ] **Aprovar usuário pendente**
  - Acessar `/admin/users/pending`
  - Verificar lista de usuários com `is_active = false`
  - Clicar em "Aprovar" em um usuário
  - Verificar que usuário pode fazer login

- [ ] **Rejeitar usuário pendente**
  - Acessar `/admin/users/pending`
  - Clicar em "Rejeitar" em um usuário
  - Verificar que usuário foi removido

- [ ] **Editar usuário**
  - Acessar detalhes de um usuário
  - Editar informações (nome, role, organização)
  - Salvar e verificar atualização

### 1.4 Gestão de Cursos
- [ ] **Criar curso completo**
  - Acessar `/admin/courses/new`
  - Preencher informações básicas: título, slug, descrição, nível, área
  - Adicionar módulos
  - Adicionar aulas em cada módulo (vídeo, texto, PDF, embed)
  - Salvar e verificar criação

- [ ] **Publicar curso**
  - Acessar curso criado
  - Alterar status para "published"
  - Verificar que curso aparece na listagem pública

- [ ] **Editar curso**
  - Acessar `/admin/courses/[id]/edit`
  - Editar informações
  - Adicionar/remover módulos
  - Adicionar/remover aulas
  - Salvar e verificar atualização

- [ ] **Atribuir curso a organização**
  - Acessar detalhes da organização
  - Ir para aba "Cursos" ou "Licenças"
  - Atribuir curso com número de licenças
  - Verificar que curso aparece para usuários da organização

- [ ] **Configurar curso obrigatório**
  - Ao atribuir curso, marcar como obrigatório
  - Verificar que curso aparece como obrigatório para usuários

### 1.5 Gestão de Trilhas de Aprendizado
- [ ] **Criar trilha**
  - Acessar `/admin/paths/new`
  - Preencher: título, slug, descrição
  - Adicionar cursos à trilha (drag-and-drop)
  - Definir ordem dos cursos
  - Salvar e verificar criação

- [ ] **Editar trilha**
  - Acessar trilha existente
  - Reordenar cursos
  - Adicionar/remover cursos
  - Salvar e verificar atualização

- [ ] **Atribuir trilha a organização**
  - Acessar detalhes da organização
  - Atribuir trilha
  - Verificar que trilha aparece para usuários

### 1.6 Relatórios
- [ ] **Acessar relatórios**
  - Acessar `/admin/reports`
  - Verificar cards de métricas principais:
    - Total de Usuários
    - Cursos Publicados
    - Certificados Emitidos
    - Taxa Média de Conclusão

- [ ] **Ver tabela de conclusão por curso**
  - Verificar tabela "Taxa de Conclusão por Curso"
  - Verificar colunas: Curso, Inscritos, Completaram, Taxa %, Tempo Médio
  - Verificar badges coloridos por performance

- [ ] **Ver tabela de cursos populares**
  - Verificar tabela "Cursos Mais Populares"
  - Verificar ordenação por inscrições

- [ ] **Exportar CSV**
  - Clicar em "Exportar CSV" na tabela de conclusão
  - Verificar download do arquivo
  - Verificar conteúdo do CSV

### 1.7 Log de Atividades
- [ ] **Acessar log de atividades**
  - Acessar `/admin/activity`
  - Verificar cards de estatísticas:
    - Total de Eventos
    - Tipos de Evento
    - Paginação

- [ ] **Ver tabela de atividades**
  - Verificar colunas: Data/Hora, Tipo, Usuário, Descrição
  - Verificar badges coloridos por tipo de evento
  - Verificar paginação (50 eventos por página)

- [ ] **Filtrar atividades** (se implementado)
  - Filtrar por tipo de evento
  - Filtrar por usuário
  - Filtrar por data

### 1.8 Dashboard Administrativo
- [ ] **Acessar dashboard**
  - Acessar `/admin`
  - Verificar métricas principais
  - Verificar gráficos (se houver)
  - Verificar atividades recentes

---

## 2. Testes de Student

### 2.1 Autenticação e Acesso
- [ ] **Login como estudante**
  - Acessar `/auth/login`
  - Inserir credenciais de estudante
  - Verificar redirecionamento para `/dashboard`
  - Verificar que não tem acesso a `/admin`

- [ ] **Signup (se implementado)**
  - Acessar `/auth/signup`
  - Preencher: nome, email, senha, organização
  - Submeter formulário
  - Verificar redirecionamento para `/auth/waiting-room`
  - Verificar que conta está pendente (`is_active = false`)

- [ ] **Sala de espera**
  - Após signup, verificar página `/auth/waiting-room`
  - Verificar mensagem de aguardo de aprovação
  - Tentar fazer login → deve redirecionar para waiting-room

- [ ] **Logout**
  - Clicar em "Sair"
  - Verificar redirecionamento para `/`

### 2.2 Dashboard
- [ ] **Acessar dashboard**
  - Acessar `/dashboard`
  - Verificar seção "Cursos em Progresso"
  - Verificar seção "Cursos Disponíveis"
  - Verificar seção "Cursos Obrigatórios" (se houver)
  - Verificar seção "Trilhas de Aprendizado"
  - Verificar estatísticas de progresso

- [ ] **Ver cursos disponíveis**
  - Verificar lista de cursos atribuídos
  - Verificar cursos públicos (se houver)
  - Verificar thumbnails e informações básicas

### 2.3 Cursos
- [ ] **Listar cursos**
  - Acessar `/courses`
  - Verificar filtros: área, nível, busca
  - Verificar cards de cursos
  - Verificar paginação (se houver)

- [ ] **Ver detalhes do curso**
  - Clicar em um curso
  - Verificar informações: descrição, objetivos, duração
  - Verificar lista de módulos
  - Verificar progresso do curso

- [ ] **Buscar cursos**
  - Acessar `/search` ou usar barra de busca
  - Buscar por palavra-chave
  - Verificar resultados

### 2.4 Player de Aulas
- [ ] **Acessar aula**
  - Acessar curso
  - Clicar em uma aula
  - Verificar URL: `/courses/[slug]/[moduleId]/[lessonId]`

- [ ] **Assistir aula de vídeo**
  - Acessar aula com `content_type = 'video'`
  - Verificar player de vídeo carrega
  - Reproduzir vídeo
  - Verificar barra de progresso
  - Marcar como concluída

- [ ] **Ler aula de texto**
  - Acessar aula com `content_type = 'text'`
  - Verificar conteúdo renderizado
  - Marcar como concluída

- [ ] **Visualizar PDF**
  - Acessar aula com `content_type = 'pdf'`
  - Verificar visualizador de PDF
  - Verificar download (se disponível)
  - Marcar como concluída

- [ ] **Visualizar embed**
  - Acessar aula com `content_type = 'embed'`
  - Verificar conteúdo embed carrega
  - Marcar como concluída

- [ ] **Progresso automático**
  - Assistir várias aulas
  - Verificar que progresso do curso é atualizado
  - Verificar barra de progresso no dashboard

### 2.5 Quizzes
- [ ] **Acessar quiz**
  - Acessar curso com quiz
  - Clicar em "Fazer Quiz"
  - Verificar URL: `/courses/[slug]/quiz/[quizId]`

- [ ] **Iniciar tentativa**
  - Clicar em "Iniciar Quiz"
  - Verificar timer (se houver)
  - Verificar questões aparecem

- [ ] **Responder questões**
  - Selecionar respostas
  - Navegar entre questões
  - Verificar que respostas são salvas

- [ ] **Submeter quiz**
  - Clicar em "Finalizar"
  - Verificar cálculo de score
  - Verificar se passou/falhou (baseado em `passing_score`)
  - Verificar resultados com respostas corretas/incorretas

- [ ] **Ver histórico de tentativas**
  - Acessar quiz novamente
  - Verificar lista de tentativas anteriores
  - Verificar limite de tentativas (se `max_attempts` configurado)

### 2.6 Certificados
- [ ] **Ver certificados**
  - Acessar `/certificates`
  - Verificar lista de certificados emitidos
  - Verificar informações: curso, data de emissão, código de verificação

- [ ] **Download certificado**
  - Clicar em "Download" em um certificado
  - Verificar que PDF é gerado e baixado
  - Verificar conteúdo do PDF

- [ ] **Verificar certificado**
  - Acessar `/certificates/verify/[code]`
  - Inserir código de verificação
  - Verificar informações do certificado
  - Verificar status de validação

### 2.7 Trilhas de Aprendizado
- [ ] **Ver trilhas**
  - Acessar `/paths`
  - Verificar lista de trilhas atribuídas
  - Verificar progresso em cada trilha

- [ ] **Acessar trilha**
  - Clicar em uma trilha
  - Verificar timeline visual
  - Verificar status dos cursos: completo, em progresso, bloqueado, disponível
  - Verificar barra de progresso geral

- [ ] **Navegar entre cursos da trilha**
  - Clicar em um curso da trilha
  - Completar curso
  - Verificar que próximo curso é desbloqueado
  - Retornar à trilha e verificar progresso atualizado

- [ ] **Completar trilha**
  - Completar todos os cursos da trilha
  - Verificar que trilha está 100% completa
  - Verificar certificado de trilha (se implementado)

### 2.8 Perfil
- [ ] **Acessar perfil**
  - Acessar `/profile`
  - Verificar informações: nome, email, organização, role

- [ ] **Editar perfil**
  - Clicar em "Editar"
  - Atualizar nome completo
  - Salvar e verificar atualização

- [ ] **Alterar senha**
  - Acessar seção de senha
  - Inserir senha atual
  - Inserir nova senha
  - Confirmar nova senha
  - Salvar e verificar que pode fazer login com nova senha

- [ ] **Upload de avatar** (se implementado)
  - Fazer upload de imagem
  - Verificar que avatar é atualizado

### 2.9 Notificações
- [ ] **Ver notificações**
  - Clicar no sino de notificações no header
  - Verificar lista de notificações
  - Verificar contador de não lidas

- [ ] **Acessar página de notificações**
  - Acessar `/notifications`
  - Verificar lista completa
  - Verificar paginação (se houver)

- [ ] **Marcar como lida**
  - Clicar em uma notificação
  - Verificar que é marcada como lida
  - Verificar que contador é atualizado

- [ ] **Marcar todas como lidas**
  - Clicar em "Marcar todas como lidas"
  - Verificar que todas são marcadas
  - Verificar que contador zera

---

## 3. Testes de Org Manager

### 3.1 Autenticação
- [ ] **Login como org manager**
  - Acessar `/auth/login`
  - Inserir credenciais
  - Verificar redirecionamento para `/dashboard`
  - Verificar que não tem acesso a `/admin` (exceto se implementado)

### 3.2 Gestão de Usuários da Organização
- [ ] **Ver usuários da organização**
  - Acessar página de usuários (se implementado)
  - Verificar que vê apenas usuários da sua organização
  - Verificar informações: nome, email, role, progresso

- [ ] **Ver progresso de usuários**
  - Acessar detalhes de um usuário
  - Verificar cursos em progresso
  - Verificar cursos completados
  - Verificar certificados

### 3.3 Gestão de Cursos
- [ ] **Ver cursos disponíveis**
  - Acessar página de cursos
  - Verificar que vê apenas cursos atribuídos à organização
  - Verificar informações de licenças

- [ ] **Atribuir cursos a usuários** (se implementado)
  - Acessar página de atribuição
  - Selecionar curso
  - Selecionar usuários
  - Atribuir e verificar

---

## 4. Testes Cross-Browser

### 4.1 Chrome Desktop
- [ ] Executar todos os testes acima no Chrome Desktop
- [ ] Verificar responsividade em diferentes tamanhos de tela
- [ ] Verificar console para erros JavaScript

### 4.2 Firefox Desktop
- [ ] Executar todos os testes acima no Firefox Desktop
- [ ] Verificar compatibilidade de CSS
- [ ] Verificar console para erros

### 4.3 Safari Desktop
- [ ] Executar todos os testes acima no Safari Desktop
- [ ] Verificar compatibilidade WebKit
- [ ] Verificar console para erros

### 4.4 Chrome Mobile (Android)
- [ ] Executar testes principais no Chrome Mobile
- [ ] Verificar layout responsivo
- [ ] Verificar touch interactions
- [ ] Verificar player de vídeo em mobile

### 4.5 Safari Mobile (iOS)
- [ ] Executar testes principais no Safari Mobile
- [ ] Verificar layout responsivo
- [ ] Verificar touch interactions
- [ ] Verificar player de vídeo em iOS

---

## 5. Testes de Smoke (Produção)

### 5.1 Build e Deploy
- [ ] **Build passa sem erros**
  ```bash
  npm run build
  ```
  - Verificar que build completa sem erros
  - Verificar que não há warnings críticos

- [ ] **Variáveis de ambiente configuradas**
  - Verificar todas as variáveis necessárias estão configuradas no Vercel
  - Verificar que aplicação inicia sem erros

### 5.2 Funcionalidades Críticas
- [ ] **Login funciona**
  - Fazer login em produção
  - Verificar redirecionamento correto
  - Verificar sessão persiste

- [ ] **Criar curso funciona**
  - Como superadmin, criar um curso
  - Verificar que curso é salvo
  - Verificar que curso aparece na listagem

- [ ] **Player funciona**
  - Acessar uma aula
  - Verificar que conteúdo carrega
  - Verificar que progresso é salvo

- [ ] **Certificado funciona**
  - Completar um curso
  - Verificar que certificado é gerado
  - Verificar que download funciona

- [ ] **Email funciona (Resend)**
  - Criar um usuário (deve enviar email de boas-vindas)
  - Verificar que email é recebido
  - Verificar conteúdo do email

- [ ] **Upload funciona (Supabase Storage)**
  - Fazer upload de thumbnail de curso
  - Verificar que imagem é salva
  - Verificar que imagem é exibida

---

## 6. Registro de Bugs

### Template de Bug

```markdown
## Bug #[Número]

**Prioridade:** P0 / P1 / P2  
**Role:** Superadmin / Student / Org Manager  
**Página/Feature:** [URL ou nome da feature]  
**Browser:** Chrome Desktop / Firefox / Safari / Mobile  

**Descrição:**
[Descrição clara do problema]

**Passos para Reproduzir:**
1. [Passo 1]
2. [Passo 2]
3. [Passo 3]

**Comportamento Esperado:**
[O que deveria acontecer]

**Comportamento Atual:**
[O que está acontecendo]

**Screenshots:**
[Links para screenshots]

**Console Errors:**
[Erros do console, se houver]

**Status:** ⏳ Pendente / 🔄 Em Progresso / ✅ Resolvido
```

### Bugs Encontrados

- [ ] Criar lista de bugs encontrados durante os testes
- [ ] Priorizar bugs (P0, P1, P2)
- [ ] Documentar passos para reproduzir
- [ ] Adicionar screenshots quando relevante

---

## 📊 Status de Testes

**Data de Início:** _______________  
**Data de Conclusão:** _______________  
**Testador:** _______________  

### Resumo

- **Total de Testes:** _____
- **Testes Passaram:** _____
- **Testes Falharam:** _____
- **Bugs P0 Encontrados:** _____
- **Bugs P1 Encontrados:** _____
- **Bugs P2 Encontrados:** _____

### Observações

[Notas gerais sobre os testes realizados]

---

**Documento criado:** 2026-01-14  
**Última atualização:** 2026-01-14

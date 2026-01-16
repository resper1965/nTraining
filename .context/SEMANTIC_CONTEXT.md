# 📊 Contexto Semântico do Projeto n.training

**Data:** 2026-01-15  
**Tipo:** Compact

---

## 🏗️ Arquitetura

### Camadas Identificadas

- **Models**: 44 símbolos
- **Utils**: 81 símbolos (depende de: Repositories)
- **Repositories**: 62 símbolos
- **Services**: 33 símbolos
- **Controllers**: 1 símbolo
- **Components**: 136 símbolos
- **Generators**: 3 símbolos

---

## 🔑 Símbolos Principais

### Services (Camada de Serviços)

#### UserService
- **Classe:** `UserService` @ `lib/services/user.service.ts:52`
- **Erro:** `UserServiceError` @ `lib/services/user.service.ts:37`

#### QuizService
- **Classe:** `QuizService` @ `lib/services/quiz.service.ts:46`
- **Erro:** `QuizServiceError` @ `lib/services/quiz.service.ts:31`

#### OrganizationService
- **Classe:** `OrganizationService` @ `lib/services/organization.service.ts:43`
- **Erro:** `OrganizationServiceError` @ `lib/services/organization.service.ts:28`

#### KnowledgeService
- **Classe:** `KnowledgeService` @ `lib/services/knowledge.service.ts:63`
- **Erro:** `KnowledgeServiceError` @ `lib/services/knowledge.service.ts:40`

#### CourseService
- **Classe:** `CourseService` @ `lib/services/course.service.ts:51`
- **Erro:** `CourseServiceError` @ `lib/services/course.service.ts:36`

#### ContentService
- **Classe:** `ContentService` @ `lib/services/content.service.ts:42`
- **Erro:** `ContentServiceError` @ `lib/services/content.service.ts:27`

#### AuthService
- **Classe:** `AuthService` @ `lib/services/auth.service.ts:55`
- **Erro:** `AuthServiceError` @ `lib/services/auth.service.ts:40`

#### AICourseService
- **Classe:** `AICourseService` @ `lib/services/ai-course.service.ts:77`
- **Erro:** `AICourseServiceError` @ `lib/services/ai-course.service.ts:33`

---

### Types (Tipos de Dados)

#### Organização e Usuários
- `Organization` @ `lib/types/database.ts:17`
- `User` @ `lib/types/database.ts:35`
- `TenantUser` @ `lib/types/database.ts:51`
- `OrganizationCourseAccess` @ `lib/types/database.ts:65`
- `CourseCustomization` @ `lib/types/database.ts:87`
- `OrganizationCourseAssignment` @ `lib/types/database.ts:101`
- `CertificateTemplate` @ `lib/types/database.ts:116`

#### Cursos e Conteúdo
- `Course` @ `lib/types/database.ts:131`
- `Module` @ `lib/types/database.ts:156`
- `Lesson` @ `lib/types/database.ts:166`
- `LessonMaterial` @ `lib/types/database.ts:180`
- `Quiz` @ `lib/types/database.ts:190`
- `QuizQuestion` @ `lib/types/database.ts:204`

---

### Utils
- `ExportDataRow` @ `lib/utils/csv.ts:3`

---

## 📈 Estatísticas

- **Total de Símbolos Identificados:** 360+
- **Services:** 8 principais
- **Types:** 12+ interfaces principais
- **Components:** 136 símbolos

---

## 🔗 Dependências

- **Utils** → **Repositories**
- **Services** → **Repositories** (implícito)
- **Components** → **Services** (implícito)

---

## 📝 Notas

Este contexto semântico foi gerado automaticamente e pode ser usado para:
- Otimizar prompts para geração de código
- Entender a estrutura do projeto
- Identificar padrões arquiteturais
- Facilitar refatorações

Para atualizar este contexto, execute:
```typescript
mcp_ai-context_buildSemanticContext({
  repoPath: "/home/resper/nTraining",
  contextType: "compact" // ou "documentation", "playbook", "plan"
})
```

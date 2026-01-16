# 📚 Contexto Semântico - Versão Documentação

**Data:** 2026-01-15  
**Tipo:** Documentation  
**Total de Exports:** 380+

---

## 🏗️ Arquitetura

### Camadas

- **Models**: 44 símbolos
- **Utils**: 81 símbolos (depende de: Repositories)
- **Repositories**: 62 símbolos
- **Services**: 33 símbolos
- **Controllers**: 1 símbolo
- **Components**: 136 símbolos
- **Generators**: 3 símbolos

---

## 📦 Public API (Exports Principais)

### Actions

#### Users
- `ActionError` @ `app/actions/users.ts:26`
- `approveUser` @ `app/actions/users.ts:154`

#### Quizzes
- `ActionError` @ `app/actions/quizzes.ts:31`

#### Quiz Attempts
- `ActionError` @ `app/actions/quiz-attempts.ts:17`

#### Courses
- `ActionError` @ `app/actions/courses.ts:32`

#### AI Admin
- `ActionError` @ `app/actions/ai-admin.ts:30`

#### Activity Logs
- `ActivityLog` @ `app/actions/activity-logs.ts:9`
- `ActivityLogFilters` @ `app/actions/activity-logs.ts:24`

#### Learning Paths
- `addCourseToPath` @ `app/actions/learning-paths.ts:260`

#### License Management
- `addLicenses` @ `app/actions/license-management.ts:10`

#### Organization Courses
- `assignCourseToOrganization` @ `app/actions/organization-courses.ts:29`
- `assignCourseToUser` @ `app/actions/organization-courses.ts:292`
- `checkLicenseAvailability` @ `app/actions/organization-courses.ts:174`

#### Path Assignments
- `assignPathToUser` @ `app/actions/path-assignments.ts:12`
- `assignPathToUsers` @ `app/actions/path-assignments.ts:105`
- `checkPathCompletion` @ `app/actions/path-assignments.ts:193`

#### Profile
- `changePassword` @ `app/actions/profile.ts:74`

#### Scans
- `checkAssetOrganization` @ `app/actions/scans.ts:23`

---

### Services

#### AuthService
- `AuthService` @ `lib/services/auth.service.ts:55`
- `AuthServiceError` @ `lib/services/auth.service.ts:40`

#### AICourseService
- `AICourseService` @ `lib/services/ai-course.service.ts:77`
- `AICourseServiceError` @ `lib/services/ai-course.service.ts:33`

#### AI Client
- `chat` @ `lib/services/ai-client.ts:175`
- `chatWithStructuredOutput` @ `lib/services/ai-client.ts:129`

---

### Types

#### Database Types
- `Organization` @ `lib/types/database.ts:17`
- `User` @ `lib/types/database.ts:35`
- `TenantUser` @ `lib/types/database.ts:51`
- `OrganizationCourseAccess` @ `lib/types/database.ts:65`
- `CourseCustomization` @ `lib/types/database.ts:87`
- `OrganizationCourseAssignment` @ `lib/types/database.ts:101`
- `CertificateTemplate` @ `lib/types/database.ts:116`
- `Course` @ `lib/types/database.ts:131`
- `Module` @ `lib/types/database.ts:156`
- `Lesson` @ `lib/types/database.ts:166`
- `LessonMaterial` @ `lib/types/database.ts:180`
- `Quiz` @ `lib/types/database.ts:190`
- `QuizQuestion` @ `lib/types/database.ts:204`
- `QuestionOption` @ `lib/types/database.ts:215`
- `LearningPath` @ `lib/types/database.ts:225`
- `PathCourse` @ `lib/types/database.ts:238`
- `UserPathAssignment` @ `lib/types/database.ts:247`
- `UserCourseProgress` @ `lib/types/database.ts:260`
- `UserLessonProgress` @ `lib/types/database.ts:273`
- `UserQuizAttempt` @ `lib/types/database.ts:285`
- `UserAnswer` @ `lib/types/database.ts:300`
- `Certificate` @ `lib/types/database.ts:310`
- `UserNote` @ `lib/types/database.ts:322`
- `ActivityLog` @ `lib/types/database.ts:332`

#### Composite Types
- `CourseWithModules` @ `lib/types/database.ts:347`
- `ModuleWithLessons` @ `lib/types/database.ts:351`
- `CourseWithProgress` @ `lib/types/database.ts:355`
- `LearningPathWithCourses` @ `lib/types/database.ts:359`
- `QuizWithQuestions` @ `lib/types/database.ts:363`
- `QuizQuestionWithOptions` @ `lib/types/database.ts:367`
- `UserQuizAttemptWithAnswers` @ `lib/types/database.ts:371`

#### Form Types
- `CourseFormData` @ `lib/types/database.ts:403`
- `ModuleFormData` @ `lib/types/database.ts:416`
- `LessonFormData` @ `lib/types/database.ts:422`
- `QuizFormData` @ `lib/types/database.ts:432`
- `QuestionFormData` @ `lib/types/database.ts:441`
- `OptionFormData` @ `lib/types/database.ts:450`
- `LearningPathFormData` @ `lib/types/database.ts:457`

#### Filter Types
- `CourseFilters` @ `lib/types/database.ts:470`
- `UserFilters` @ `lib/types/database.ts:478`
- `ProgressFilters` @ `lib/types/database.ts:486`

#### Notification Types
- `Notification` @ `lib/types/database.ts:510`
- `NotificationPreferences` @ `lib/types/database.ts:526`
- `CreateNotificationData` @ `lib/types/database.ts:540`

#### Knowledge Types
- `KnowledgeSource` @ `lib/types/database.ts:554`
- `KnowledgeVector` @ `lib/types/database.ts:569`

#### Response Types
- `ApiResponse` @ `lib/types/database.ts:385`
- `PaginatedResponse` @ `lib/types/database.ts:391`

---

### Enums

- `UserRole` @ `lib/types/database.ts:5`
- `CourseLevel` @ `lib/types/database.ts:6`
- `ContentType` @ `lib/types/database.ts:7`
- `QuestionType` @ `lib/types/database.ts:8`
- `AssignmentStatus` @ `lib/types/database.ts:9`
- `CourseStatus` @ `lib/types/database.ts:10`
- `KnowledgeSourceStatus` @ `lib/types/database.ts:11`
- `CourseAccessType` @ `lib/types/database.ts:62`
- `AssignmentType` @ `lib/types/database.ts:63`
- `NotificationType` @ `lib/types/database.ts:497`
- `NotificationFrequency` @ `lib/types/database.ts:524`

---

### Components

#### Admin Components
- `AddLicensesDialog` @ `components/admin/add-licenses-dialog.tsx:27`
- `AssignPathForm` @ `components/admin/assign-path-form.tsx:21`
- `AdminLayout` @ `app/(admin)/admin/layout.tsx:12`
- `AdminSettingsPage` @ `app/(admin)/admin/settings/page.tsx:5`
- `AIAdminPage` @ `app/(admin)/admin/ai/page.tsx:9`
- `AssignCoursesToUsersPage` @ `app/(admin)/admin/organizations/[id]/users/assign-courses/page.tsx:19`
- `AssignPathPage` @ `app/(admin)/admin/paths/[id]/assign/page.tsx:13`
- `ClientCourseForm` @ `app/(admin)/admin/courses/new/client-form.tsx:30`
- `ClientEditForm` @ `app/(admin)/admin/courses/[id]/edit/client-form.tsx:34`

#### UI Components
- `BadgeProps` @ `components/ui/badge.tsx:26`
- `ButtonProps` @ `components/ui/button.tsx:36`

---

### Utilities

#### Utils
- `cn` @ `lib/utils.ts:4`
- `convertToCSV` @ `lib/utils/csv.ts:7`
- `ExportDataRow` @ `lib/utils/csv.ts:3`

#### CNPJ Utils
- `maskCNPJ` @ `lib/utils/cnpj.ts:6`
- `unmaskCNPJ` @ `lib/utils/cnpj.ts:34`
- `formatCNPJ` @ `lib/utils/cnpj.ts:44`
- `isValidCNPJFormat` @ `lib/utils/cnpj.ts:67`

#### Toast
- `success` @ `lib/toast.ts:34`
- `error` @ `lib/toast.ts:44`
- `warning` @ `lib/toast.ts:54`
- `info` @ `lib/toast.ts:64`
- `loading` @ `lib/toast.ts:74`
- `promise` @ `lib/toast.ts:81`

#### Hooks
- `useTranslations` @ `hooks/use-translations.ts:6`

#### Supabase
- `getTenants` @ `lib/supabase/tenants.ts:23`
- `getTenantById` @ `lib/supabase/tenants.ts:57`
- `createTenant` @ `lib/supabase/tenants.ts:98`
- `addUserToTenant` @ `lib/supabase/tenants.ts:164`
- `checkUserRole` @ `lib/supabase/client.ts:39`

#### Auth
- `AuthContext` @ `lib/auth/types.ts:6`
- `AuthResult` @ `lib/auth/types.ts:14`
- `clearAuthContext` @ `lib/auth/context.ts:47`

#### Notifications
- `checkRateLimit` @ `lib/notifications/intelligent.ts:10`

#### Validators
- `validateUserFilters` @ `lib/validators/user.schema.ts:91`
- `validateUserId` @ `lib/validators/user.schema.ts:105`
- `validateQuizCreate` @ `lib/validators/quiz.schema.ts:165`
- `validateQuizUpdate` @ `lib/validators/quiz.schema.ts:169`
- `validateQuestionCreate` @ `lib/validators/quiz.schema.ts:179`
- `validateQuestionUpdate` @ `lib/validators/quiz.schema.ts:183`
- `validateReorderQuestions` @ `lib/validators/quiz.schema.ts:193`
- `validateOrganizationFilters` @ `lib/validators/organization.schema.ts:115`
- `validateOrganizationUpdate` @ `lib/validators/organization.schema.ts:125`
- `validateCourseCreate` @ `lib/validators/course.schema.ts:137`
- `validateCourseUpdate` @ `lib/validators/course.schema.ts:145`
- `validateCourseFilters` @ `lib/validators/course.schema.ts:158`
- `validateModuleCreate` @ `lib/validators/content.schema.ts:119`
- `validateModuleUpdate` @ `lib/validators/content.schema.ts:123`
- `validateReorderModules` @ `lib/validators/content.schema.ts:133`
- `validateLessonCreate` @ `lib/validators/content.schema.ts:137`
- `validateLessonUpdate` @ `lib/validators/content.schema.ts:141`
- `validateReorderLessons` @ `lib/validators/content.schema.ts:151`
- `validateSignIn` @ `lib/validators/auth.schema.ts:128`
- `validateSignUp` @ `lib/validators/auth.schema.ts:135`
- `validateCreateUser` @ `lib/validators/auth.schema.ts:149`

---

## 🔗 Dependências Principais

### Arquivos Mais Importados

- `components/lesson-player.tsx` - importado por 3 arquivos
- `lib/email/sender.ts` - importado por 2 arquivos
- `app/actions/path-progress.ts` - importado por 2 arquivos
- `app/actions/certificates.ts` - importado por 2 arquivos
- `components/ui/suspense-wrapper.tsx` - importado por 2 arquivos
- `components/admin/module-list.tsx` - importado por 2 arquivos
- `components/admin/lesson-list.tsx` - importado por 2 arquivos
- `components/admin/course-access-card.tsx` - importado por 2 arquivos

### Arquivos Core

- `lib/supabase/tenants.ts` - importado por 1 arquivo
- `lib/supabase/server.ts` - importado por 1 arquivo
- `lib/supabase/client.ts` - importado por 1 arquivo
- `lib/services/knowledge.service.ts` - importado por 1 arquivo
- `lib/services/ai-course.service.ts` - importado por 1 arquivo
- `lib/i18n/index.ts` - importado por 1 arquivo
- `lib/auth/helpers.ts` - importado por 1 arquivo

---

## 📊 Estatísticas

- **Total de Exports:** 380+
- **Classes:** 16 principais
- **Interfaces:** 113+
- **Functions:** 274+
- **Types:** 20+
- **Enums:** 11

---

## 📝 Notas

Este contexto semântico foi gerado automaticamente para documentação. Use para:
- Entender a estrutura completa da API pública
- Identificar dependências entre módulos
- Facilitar navegação no código
- Gerar documentação automática

Para atualizar:
```typescript
mcp_ai-context_buildSemanticContext({
  repoPath: "/home/resper/nTraining",
  contextType: "documentation"
})
```

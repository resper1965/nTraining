---
name: Performance Optimizer
description: Identify performance bottlenecks
status: unfilled
generated: 2026-01-16
---

# Performance Optimizer Agent Playbook

## Mission
Describe how the performance optimizer agent supports the team and when to engage it.

## Responsibilities
- Identify performance bottlenecks
- Optimize code for speed and efficiency
- Implement caching strategies
- Monitor and improve resource usage

## Best Practices
- Measure before optimizing
- Focus on actual bottlenecks
- Don't sacrifice readability unnecessarily

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Repository Starting Points
- `app/` — TODO: Describe the purpose of this directory.
- `components/` — TODO: Describe the purpose of this directory.
- `data/` — TODO: Describe the purpose of this directory.
- `hooks/` — TODO: Describe the purpose of this directory.
- `lib/` — TODO: Describe the purpose of this directory.
- `public/` — TODO: Describe the purpose of this directory.
- `scripts/` — TODO: Describe the purpose of this directory.
- `tests/` — TODO: Describe the purpose of this directory.

## Key Files
**Entry Points:**
- [`../lib/supabase/server.ts`](../lib/supabase/server.ts)
- [`../lib/i18n/index.ts`](../lib/i18n/index.ts)
- [`../lib/auth/index.ts`](../lib/auth/index.ts)

**Pattern Implementations:**
- Service Layer: [`UserService`](lib/services/user.service.ts), [`QuizService`](lib/services/quiz.service.ts), [`OrganizationService`](lib/services/organization.service.ts), [`KnowledgeService`](lib/services/knowledge.service.ts), [`CourseService`](lib/services/course.service.ts), [`ContentService`](lib/services/content.service.ts), [`AuthService`](lib/services/auth.service.ts), [`AICourseService`](lib/services/ai-course.service.ts)

**Service Files:**
- [`UserService`](lib/services/user.service.ts#L52)
- [`QuizService`](lib/services/quiz.service.ts#L46)
- [`OrganizationService`](lib/services/organization.service.ts#L43)
- [`KnowledgeService`](lib/services/knowledge.service.ts#L63)
- [`CourseService`](lib/services/course.service.ts#L51)
- [`ContentService`](lib/services/content.service.ts#L42)
- [`AuthService`](lib/services/auth.service.ts#L55)
- [`AICourseService`](lib/services/ai-course.service.ts#L77)

## Architecture Context

### Models
Data structures and domain objects
- **Directories**: `scripts`, `lib/validators`
- **Symbols**: 44 total
- **Key exports**: [`UserFiltersInput`](lib/validators/user.schema.ts#L81), [`UserIdInput`](lib/validators/user.schema.ts#L82), [`validateUserFilters`](lib/validators/user.schema.ts#L91), [`validateUserId`](lib/validators/user.schema.ts#L105), [`QuizCreateInput`](lib/validators/quiz.schema.ts#L155), [`QuizUpdateInput`](lib/validators/quiz.schema.ts#L156), [`QuestionCreateInput`](lib/validators/quiz.schema.ts#L157), [`QuestionUpdateInput`](lib/validators/quiz.schema.ts#L158), [`ReorderQuestionsInput`](lib/validators/quiz.schema.ts#L159), [`validateQuizCreate`](lib/validators/quiz.schema.ts#L165), [`validateQuizUpdate`](lib/validators/quiz.schema.ts#L169), [`validateQuestionCreate`](lib/validators/quiz.schema.ts#L179), [`validateQuestionUpdate`](lib/validators/quiz.schema.ts#L183), [`validateReorderQuestions`](lib/validators/quiz.schema.ts#L193), [`OrganizationFiltersInput`](lib/validators/organization.schema.ts#L108), [`OrganizationUpdateInput`](lib/validators/organization.schema.ts#L109), [`validateOrganizationFilters`](lib/validators/organization.schema.ts#L115), [`validateOrganizationUpdate`](lib/validators/organization.schema.ts#L125), [`CourseUpsertInput`](lib/validators/course.schema.ts#L124), [`CourseCreateInput`](lib/validators/course.schema.ts#L125), [`CourseUpdateInput`](lib/validators/course.schema.ts#L126), [`CourseFiltersInput`](lib/validators/course.schema.ts#L127), [`validateCourseCreate`](lib/validators/course.schema.ts#L137), [`validateCourseUpdate`](lib/validators/course.schema.ts#L145), [`validateCourseFilters`](lib/validators/course.schema.ts#L158), [`ModuleCreateInput`](lib/validators/content.schema.ts#L108), [`ModuleUpdateInput`](lib/validators/content.schema.ts#L109), [`ReorderModulesInput`](lib/validators/content.schema.ts#L110), [`LessonCreateInput`](lib/validators/content.schema.ts#L111), [`LessonUpdateInput`](lib/validators/content.schema.ts#L112), [`ReorderLessonsInput`](lib/validators/content.schema.ts#L113), [`validateModuleCreate`](lib/validators/content.schema.ts#L119), [`validateModuleUpdate`](lib/validators/content.schema.ts#L123), [`validateReorderModules`](lib/validators/content.schema.ts#L133), [`validateLessonCreate`](lib/validators/content.schema.ts#L137), [`validateLessonUpdate`](lib/validators/content.schema.ts#L141), [`validateReorderLessons`](lib/validators/content.schema.ts#L151), [`SignInInput`](lib/validators/auth.schema.ts#L116), [`SignUpInput`](lib/validators/auth.schema.ts#L117), [`CreateUserInput`](lib/validators/auth.schema.ts#L118), [`validateSignIn`](lib/validators/auth.schema.ts#L128), [`validateSignUp`](lib/validators/auth.schema.ts#L135), [`validateCreateUser`](lib/validators/auth.schema.ts#L149)

### Utils
Shared utilities and helpers
- **Directories**: `lib`, `lib/utils`, `lib/types`, `lib/supabase`, `lib/notifications`, `lib/i18n`, `lib/email`, `lib/auth`, `lib/certificates`
- **Symbols**: 81 total
- **Key exports**: [`cn`](lib/utils.ts#L4), [`ExportDataRow`](lib/utils/csv.ts#L3), [`convertToCSV`](lib/utils/csv.ts#L7), [`maskCNPJ`](lib/utils/cnpj.ts#L6), [`unmaskCNPJ`](lib/utils/cnpj.ts#L34), [`formatCNPJ`](lib/utils/cnpj.ts#L44), [`isValidCNPJFormat`](lib/utils/cnpj.ts#L67), [`GeneratedCourseStructure`](lib/types/ai.ts#L7), [`GeneratedModule`](lib/types/ai.ts#L16), [`GeneratedLesson`](lib/types/ai.ts#L23), [`TenantFormData`](lib/supabase/tenants.ts#L10), [`getTenants`](lib/supabase/tenants.ts#L23), [`getTenantById`](lib/supabase/tenants.ts#L57), [`createTenant`](lib/supabase/tenants.ts#L98), [`updateTenant`](lib/supabase/tenants.ts#L130), [`addUserToTenant`](lib/supabase/tenants.ts#L164), [`removeUserFromTenant`](lib/supabase/tenants.ts#L188), [`getTenantUsers`](lib/supabase/tenants.ts#L206), [`createClient`](lib/supabase/server.ts#L6), [`getCurrentUser`](lib/supabase/server.ts#L47), [`getUserById`](lib/supabase/server.ts#L56), [`requireAuth`](lib/supabase/server.ts#L84), [`isSuperAdmin`](lib/supabase/server.ts#L93), [`requireSuperAdmin`](lib/supabase/server.ts#L102), [`requireRole`](lib/supabase/server.ts#L111), [`getCurrentUser`](lib/supabase/client.ts#L21), [`checkUserRole`](lib/supabase/client.ts#L39), [`getUserOrganization`](lib/supabase/client.ts#L56), [`prioritizeNotifications`](lib/notifications/utils.ts#L7), [`groupSimilarNotifications`](lib/notifications/utils.ts#L41), [`notifyCourseAssigned`](lib/notifications/triggers.ts#L19), [`notifyDeadlineApproaching`](lib/notifications/triggers.ts#L83), [`notifyDeadlinePassed`](lib/notifications/triggers.ts#L130), [`notifyCourseCompleted`](lib/notifications/triggers.ts#L151), [`notifyCertificateAvailable`](lib/notifications/triggers.ts#L195), [`notifyWelcome`](lib/notifications/triggers.ts#L243), [`notifyNewContent`](lib/notifications/triggers.ts#L278), [`checkRateLimit`](lib/notifications/intelligent.ts#L10), [`createIntelligentNotification`](lib/notifications/intelligent.ts#L34), [`learnFromUserBehavior`](lib/notifications/intelligent.ts#L99), [`Locale`](lib/i18n/translations.ts#L271), [`TranslationKey`](lib/i18n/translations.ts#L272), [`getLocale`](lib/i18n/index.ts#L9), [`getTranslations`](lib/i18n/index.ts#L22), [`setLocale`](lib/i18n/index.ts#L26), [`sendWelcomeEmail`](lib/email/sender.ts#L39), [`sendCourseAssignedEmail`](lib/email/sender.ts#L60), [`sendDeadlineApproachingEmail`](lib/email/sender.ts#L98), [`sendCourseCompletedEmail`](lib/email/sender.ts#L131), [`sendCertificateAvailableEmail`](lib/email/sender.ts#L158), [`EmailOptions`](lib/email/resend.ts#L10), [`sendEmail`](lib/email/resend.ts#L24), [`getWelcomeEmailTemplate`](lib/email/resend.ts#L57), [`getCourseAssignedEmailTemplate`](lib/email/resend.ts#L83), [`getDeadlineApproachingEmailTemplate`](lib/email/resend.ts#L126), [`getCourseCompletedEmailTemplate`](lib/email/resend.ts#L158), [`getCertificateAvailableEmailTemplate`](lib/email/resend.ts#L190), [`EmailQueueItem`](lib/email/queue.ts#L9), [`queueEmail`](lib/email/queue.ts#L29), [`processEmailQueue`](lib/email/queue.ts#L38), [`AuthContext`](lib/auth/types.ts#L6), [`AuthResult`](lib/auth/types.ts#L14), [`getCurrentUser`](lib/auth/helpers.ts#L14), [`requireAuth`](lib/auth/helpers.ts#L113), [`isSuperAdmin`](lib/auth/helpers.ts#L130), [`requireSuperAdmin`](lib/auth/helpers.ts#L144), [`requireRole`](lib/auth/helpers.ts#L161), [`getAuthContext`](lib/auth/context.ts#L17), [`setAuthContext`](lib/auth/context.ts#L26), [`runWithAuthContext`](lib/auth/context.ts#L37), [`clearAuthContext`](lib/auth/context.ts#L47)

### Repositories
Data access and persistence
- **Directories**: `lib/types`, `lib/supabase`
- **Symbols**: 62 total
- **Key exports**: [`UserRole`](lib/types/database.ts#L5), [`CourseLevel`](lib/types/database.ts#L6), [`ContentType`](lib/types/database.ts#L7), [`QuestionType`](lib/types/database.ts#L8), [`AssignmentStatus`](lib/types/database.ts#L9), [`CourseStatus`](lib/types/database.ts#L10), [`KnowledgeSourceStatus`](lib/types/database.ts#L11), [`Organization`](lib/types/database.ts#L17), [`User`](lib/types/database.ts#L35), [`TenantUser`](lib/types/database.ts#L51), [`CourseAccessType`](lib/types/database.ts#L62), [`AssignmentType`](lib/types/database.ts#L63), [`OrganizationCourseAccess`](lib/types/database.ts#L65), [`CourseCustomization`](lib/types/database.ts#L87), [`OrganizationCourseAssignment`](lib/types/database.ts#L101), [`CertificateTemplate`](lib/types/database.ts#L116), [`Course`](lib/types/database.ts#L131), [`Module`](lib/types/database.ts#L156), [`Lesson`](lib/types/database.ts#L166), [`LessonMaterial`](lib/types/database.ts#L180), [`Quiz`](lib/types/database.ts#L190), [`QuizQuestion`](lib/types/database.ts#L204), [`QuestionOption`](lib/types/database.ts#L215), [`LearningPath`](lib/types/database.ts#L225), [`PathCourse`](lib/types/database.ts#L238), [`UserPathAssignment`](lib/types/database.ts#L247), [`UserCourseProgress`](lib/types/database.ts#L260), [`UserLessonProgress`](lib/types/database.ts#L273), [`UserQuizAttempt`](lib/types/database.ts#L285), [`UserAnswer`](lib/types/database.ts#L300), [`Certificate`](lib/types/database.ts#L310), [`UserNote`](lib/types/database.ts#L322), [`ActivityLog`](lib/types/database.ts#L332), [`CourseWithModules`](lib/types/database.ts#L347), [`ModuleWithLessons`](lib/types/database.ts#L351), [`CourseWithProgress`](lib/types/database.ts#L355), [`LearningPathWithCourses`](lib/types/database.ts#L359), [`QuizWithQuestions`](lib/types/database.ts#L363), [`QuizQuestionWithOptions`](lib/types/database.ts#L367), [`UserQuizAttemptWithAnswers`](lib/types/database.ts#L371), [`ApiResponse`](lib/types/database.ts#L385), [`PaginatedResponse`](lib/types/database.ts#L391), [`CourseFormData`](lib/types/database.ts#L403), [`ModuleFormData`](lib/types/database.ts#L416), [`LessonFormData`](lib/types/database.ts#L422), [`QuizFormData`](lib/types/database.ts#L432), [`QuestionFormData`](lib/types/database.ts#L441), [`OptionFormData`](lib/types/database.ts#L450), [`LearningPathFormData`](lib/types/database.ts#L457), [`CourseFilters`](lib/types/database.ts#L470), [`UserFilters`](lib/types/database.ts#L478), [`ProgressFilters`](lib/types/database.ts#L486), [`NotificationType`](lib/types/database.ts#L497), [`Notification`](lib/types/database.ts#L510), [`NotificationFrequency`](lib/types/database.ts#L524), [`NotificationPreferences`](lib/types/database.ts#L526), [`CreateNotificationData`](lib/types/database.ts#L540), [`KnowledgeSource`](lib/types/database.ts#L554), [`KnowledgeVector`](lib/types/database.ts#L569), [`MatchedDocument`](lib/types/database.ts#L580), [`Json`](lib/supabase/database.types.ts#L7), [`Database`](lib/supabase/database.types.ts#L15)

### Services
Business logic and orchestration
- **Directories**: `lib/services`, `tests/unit/services`
- **Symbols**: 33 total
- **Key exports**: [`GetUsersResult`](lib/services/user.service.ts#L20), [`PendingUser`](lib/services/user.service.ts#L28), [`UserServiceError`](lib/services/user.service.ts#L37), [`UserService`](lib/services/user.service.ts#L52), [`QuizWithQuestions`](lib/services/quiz.service.ts#L26), [`QuizServiceError`](lib/services/quiz.service.ts#L31), [`QuizService`](lib/services/quiz.service.ts#L46), [`OrganizationWithCount`](lib/services/organization.service.ts#L23), [`OrganizationServiceError`](lib/services/organization.service.ts#L28), [`OrganizationService`](lib/services/organization.service.ts#L43), [`ProcessDocumentInput`](lib/services/knowledge.service.ts#L27), [`DocumentChunk`](lib/services/knowledge.service.ts#L34), [`KnowledgeServiceError`](lib/services/knowledge.service.ts#L40), [`KnowledgeService`](lib/services/knowledge.service.ts#L63), [`CourseServiceOptions`](lib/services/course.service.ts#L29), [`CourseServiceError`](lib/services/course.service.ts#L36), [`CourseService`](lib/services/course.service.ts#L51), [`ContentServiceError`](lib/services/content.service.ts#L27), [`ContentService`](lib/services/content.service.ts#L42), [`SignInResult`](lib/services/auth.service.ts#L24), [`SignUpResult`](lib/services/auth.service.ts#L30), [`CreateUserResult`](lib/services/auth.service.ts#L35), [`AuthServiceError`](lib/services/auth.service.ts#L40), [`AuthService`](lib/services/auth.service.ts#L55), [`GenerateCourseStructureInput`](lib/services/ai-course.service.ts#L27), [`AICourseServiceError`](lib/services/ai-course.service.ts#L33), [`AICourseService`](lib/services/ai-course.service.ts#L77), [`EmbeddingResponse`](lib/services/ai-client.ts#L62), [`generateEmbedding`](lib/services/ai-client.ts#L80), [`generateEmbeddingsBatch`](lib/services/ai-client.ts#L105), [`chatWithStructuredOutput`](lib/services/ai-client.ts#L129), [`chat`](lib/services/ai-client.ts#L175)

### Controllers
Request handling and routing
- **Directories**: `app/api/profile/notifications`
- **Symbols**: 1 total
- **Key exports**: [`POST`](app/api/profile/notifications/route.ts#L4)

### Components
UI components and views
- **Directories**: `components`, `app`, `components/ui`, `components/quiz`, `components/profile`, `components/notifications`, `components/lesson-player`, `components/layout`, `components/editor`, `components/course`, `components/certificates`, `components/auth`, `components/admin`, `app/terms`, `app/privacy`, `app/landing`, `components/admin/ai`, `app/auth/waiting-room`, `app/auth/login`, `app/auth/signup`, `app/auth/callback`, `app/(main)/search`, `app/(main)/profile`, `app/(main)/paths`, `app/(main)/notifications`, `app/(main)/dashboard`, `app/(main)/courses`, `app/(main)/certificates`, `app/(admin)/admin`, `app/(main)/profile/notifications`, `app/(main)/paths/[slug]`, `app/(main)/courses/[slug]`, `app/(main)/certificates/[id]`, `app/(admin)/admin/users`, `app/(admin)/admin/tenants`, `app/(admin)/admin/settings`, `app/(admin)/admin/reports`, `app/(admin)/admin/quizzes`, `app/(admin)/admin/paths`, `app/(admin)/admin/organizations`, `app/(admin)/admin/licenses`, `app/(admin)/admin/courses`, `app/(admin)/admin/ai`, `app/(admin)/admin/activity`, `app/(main)/certificates/verify/[code]`, `app/(main)/certificates/[id]/download`, `app/(admin)/admin/users/pending`, `app/(admin)/admin/users/new`, `app/(admin)/admin/tenants/new`, `app/(admin)/admin/quizzes/new`, `app/(admin)/admin/quizzes/[id]`, `app/(admin)/admin/paths/new`, `app/(admin)/admin/paths/[id]`, `app/(admin)/admin/organizations/[id]`, `app/(admin)/admin/courses/new`, `app/(main)/courses/[slug]/quiz/[quizId]`, `app/(main)/courses/[slug]/[moduleId]/[lessonId]`, `app/(admin)/admin/tenants/[id]/edit`, `app/(admin)/admin/quizzes/[id]/questions`, `app/(admin)/admin/quizzes/[id]/edit`, `app/(admin)/admin/paths/[id]/edit`, `app/(admin)/admin/paths/[id]/assign`, `app/(admin)/admin/organizations/[id]/view`, `app/(admin)/admin/organizations/[id]/courses`, `app/(admin)/admin/courses/[id]/modules`, `app/(admin)/admin/courses/[id]/edit`, `app/(admin)/admin/courses/[id]/customize`, `app/(admin)/admin/quizzes/[id]/questions/new`, `app/(admin)/admin/organizations/[id]/users/assign-courses`, `app/(main)/courses/[slug]/quiz/[quizId]/result/[attemptId]`, `app/(main)/courses/[slug]/quiz/[quizId]/attempt/[attemptId]`, `app/(admin)/admin/quizzes/[id]/questions/[questionId]/edit`, `app/(admin)/admin/courses/[id]/modules/[moduleId]/lessons`
- **Symbols**: 136 total
- **Key exports**: [`LanguageSwitcher`](components/language-switcher.tsx#L14), [`CNPJInput`](components/cnpj-input.tsx#L20), [`CNPJDisplay`](components/cnpj-display.tsx#L12), [`Home`](app/page.tsx#L10), [`SuspenseWrapper`](components/ui/suspense-wrapper.tsx#L11), [`SkipLink`](components/ui/skip-link.tsx#L12), [`Skeleton`](components/ui/skeleton.tsx#L5), [`EmptyStateProps`](components/ui/empty-state.tsx#L6), [`ButtonProps`](components/ui/button.tsx#L36), [`BadgeProps`](components/ui/badge.tsx#L26), [`ProfileForm`](components/profile/profile-form.tsx#L18), [`NotificationPreferencesForm`](components/profile/notification-preferences-form.tsx#L24), [`MarkAllReadButton`](components/notifications/mark-all-read-button.tsx#L10), [`PDFViewer`](components/lesson-player/pdf-viewer.tsx#L16), [`LessonEditorProps`](components/editor/lesson-editor.tsx#L39), [`Lesson`](components/course/lesson-player.tsx#L30), [`Module`](components/course/lesson-player.tsx#L42), [`LessonPlayerProps`](components/course/lesson-player.tsx#L49), [`ShareCertificateButton`](components/certificates/share-button.tsx#L10), [`GoogleSignInButton`](components/auth/google-signin-button.tsx#L12), [`LicenseStats`](components/admin/license-stats.tsx#L17), [`ExportButton`](components/admin/export-button.tsx#L15), [`ErrorLogger`](components/admin/error-logger.tsx#L9), [`EditLessonDialog`](components/admin/edit-lesson-dialog.tsx#L37), [`handleSubmit`](components/admin/edit-lesson-dialog.tsx#L44), [`DeletePathButton`](components/admin/delete-path-button.tsx#L26), [`AssignPathForm`](components/admin/assign-path-form.tsx#L21), [`AddLicensesDialog`](components/admin/add-licenses-dialog.tsx#L27), [`PrivacyPage`](app/privacy/page.tsx#L10), [`NotificationPreferencesPage`](app/(main)/profile/notifications/page.tsx#L17), [`handleUpdate`](app/(main)/profile/notifications/page.tsx#L22), [`AdminSettingsPage`](app/(admin)/admin/settings/page.tsx#L5), [`AIAdminPage`](app/(admin)/admin/ai/page.tsx#L9), [`DownloadCertificatePage`](app/(main)/certificates/[id]/download/page.tsx#L8), [`NewUserPage`](app/(admin)/admin/users/new/page.tsx#L20), [`createUserAction`](app/(admin)/admin/users/new/page.tsx#L24), [`NewTenantPage`](app/(admin)/admin/tenants/new/page.tsx#L13), [`createTenantAction`](app/(admin)/admin/tenants/new/page.tsx#L16), [`NewCoursePage`](app/(admin)/admin/courses/new/page.tsx#L28), [`handleCreateCourse`](app/(admin)/admin/courses/new/page.tsx#L31), [`EditTenantPage`](app/(admin)/admin/tenants/[id]/edit/page.tsx#L14), [`updateTenantAction`](app/(admin)/admin/tenants/[id]/edit/page.tsx#L33), [`AssignPathPage`](app/(admin)/admin/paths/[id]/assign/page.tsx#L13), [`CustomizeCoursePage`](app/(admin)/admin/courses/[id]/customize/page.tsx#L26), [`handleCustomize`](app/(admin)/admin/courses/[id]/customize/page.tsx#L45), [`NewQuestionPage`](app/(admin)/admin/quizzes/[id]/questions/new/page.tsx#L21), [`handleCreateQuestion`](app/(admin)/admin/quizzes/[id]/questions/new/page.tsx#L36), [`AssignCoursesToUsersPage`](app/(admin)/admin/organizations/[id]/users/assign-courses/page.tsx#L19), [`handleAssign`](app/(admin)/admin/organizations/[id]/users/assign-courses/page.tsx#L38), [`QuizAttemptPage`](app/(main)/courses/[slug]/quiz/[quizId]/attempt/[attemptId]/page.tsx#L13)

### Generators
Content and object generation
- **Directories**: `components/branding`
- **Symbols**: 3 total
- **Key exports**: [`CoverVariant`](components/branding/cover-generator.tsx#L18), [`CoverCategory`](components/branding/cover-generator.tsx#L19), [`CoverGeneratorProps`](components/branding/cover-generator.tsx#L21)
## Key Symbols for This Agent
- [`generateEmbeddingsBatch`](lib/services/ai-client.ts#L105) (function)
- [`queueEmail`](lib/email/queue.ts#L29) (function)
- [`processEmailQueue`](lib/email/queue.ts#L38) (function)

## Documentation Touchpoints
- [Documentation Index](../docs/README.md)
- [Project Overview](../docs/project-overview.md)
- [Architecture Notes](../docs/architecture.md)
- [Development Workflow](../docs/development-workflow.md)
- [Testing Strategy](../docs/testing-strategy.md)
- [Glossary & Domain Concepts](../docs/glossary.md)
- [Data Flow & Integrations](../docs/data-flow.md)
- [Security & Compliance Notes](../docs/security.md)
- [Tooling & Productivity Guide](../docs/tooling.md)

## Collaboration Checklist

1. Confirm assumptions with issue reporters or maintainers.
2. Review open pull requests affecting this area.
3. Update the relevant doc section listed above.
4. Capture learnings back in [docs/README.md](../docs/README.md).

## Hand-off Notes

Summarize outcomes, remaining risks, and suggested follow-up actions after the agent completes its work.

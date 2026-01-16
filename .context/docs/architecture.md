---
status: unfilled
generated: 2026-01-16
---

# Architecture Notes

Describe how the system is assembled and why the current design exists.

## System Architecture Overview

Summarize the top-level topology (monolith, modular service, microservices) and deployment model. Highlight how requests traverse the system and where control pivots between layers.

## Architectural Layers
### Models
Data structures and domain objects
- **Directories**: `scripts`, `lib/validators`
- **Symbols**: 44 total, 43 exported
- **Key exports**:
  - [`UserFiltersInput`](lib/validators/user.schema.ts#L81) (type)
  - [`UserIdInput`](lib/validators/user.schema.ts#L82) (type)
  - [`validateUserFilters`](lib/validators/user.schema.ts#L91) (function)
  - [`validateUserId`](lib/validators/user.schema.ts#L105) (function)
  - [`QuizCreateInput`](lib/validators/quiz.schema.ts#L155) (type)
  - [`QuizUpdateInput`](lib/validators/quiz.schema.ts#L156) (type)
  - [`QuestionCreateInput`](lib/validators/quiz.schema.ts#L157) (type)
  - [`QuestionUpdateInput`](lib/validators/quiz.schema.ts#L158) (type)
  - [`ReorderQuestionsInput`](lib/validators/quiz.schema.ts#L159) (type)
  - [`validateQuizCreate`](lib/validators/quiz.schema.ts#L165) (function)
  - [`validateQuizUpdate`](lib/validators/quiz.schema.ts#L169) (function)
  - [`validateQuestionCreate`](lib/validators/quiz.schema.ts#L179) (function)
  - [`validateQuestionUpdate`](lib/validators/quiz.schema.ts#L183) (function)
  - [`validateReorderQuestions`](lib/validators/quiz.schema.ts#L193) (function)
  - [`OrganizationFiltersInput`](lib/validators/organization.schema.ts#L108) (type)
  - [`OrganizationUpdateInput`](lib/validators/organization.schema.ts#L109) (type)
  - [`validateOrganizationFilters`](lib/validators/organization.schema.ts#L115) (function)
  - [`validateOrganizationUpdate`](lib/validators/organization.schema.ts#L125) (function)
  - [`CourseUpsertInput`](lib/validators/course.schema.ts#L124) (type)
  - [`CourseCreateInput`](lib/validators/course.schema.ts#L125) (type)
  - [`CourseUpdateInput`](lib/validators/course.schema.ts#L126) (type)
  - [`CourseFiltersInput`](lib/validators/course.schema.ts#L127) (type)
  - [`validateCourseCreate`](lib/validators/course.schema.ts#L137) (function)
  - [`validateCourseUpdate`](lib/validators/course.schema.ts#L145) (function)
  - [`validateCourseFilters`](lib/validators/course.schema.ts#L158) (function)
  - [`ModuleCreateInput`](lib/validators/content.schema.ts#L108) (type)
  - [`ModuleUpdateInput`](lib/validators/content.schema.ts#L109) (type)
  - [`ReorderModulesInput`](lib/validators/content.schema.ts#L110) (type)
  - [`LessonCreateInput`](lib/validators/content.schema.ts#L111) (type)
  - [`LessonUpdateInput`](lib/validators/content.schema.ts#L112) (type)
  - [`ReorderLessonsInput`](lib/validators/content.schema.ts#L113) (type)
  - [`validateModuleCreate`](lib/validators/content.schema.ts#L119) (function)
  - [`validateModuleUpdate`](lib/validators/content.schema.ts#L123) (function)
  - [`validateReorderModules`](lib/validators/content.schema.ts#L133) (function)
  - [`validateLessonCreate`](lib/validators/content.schema.ts#L137) (function)
  - [`validateLessonUpdate`](lib/validators/content.schema.ts#L141) (function)
  - [`validateReorderLessons`](lib/validators/content.schema.ts#L151) (function)
  - [`SignInInput`](lib/validators/auth.schema.ts#L116) (type)
  - [`SignUpInput`](lib/validators/auth.schema.ts#L117) (type)
  - [`CreateUserInput`](lib/validators/auth.schema.ts#L118) (type)
  - [`validateSignIn`](lib/validators/auth.schema.ts#L128) (function)
  - [`validateSignUp`](lib/validators/auth.schema.ts#L135) (function)
  - [`validateCreateUser`](lib/validators/auth.schema.ts#L149) (function)

### Utils
Shared utilities and helpers
- **Directories**: `lib`, `lib/utils`, `lib/types`, `lib/supabase`, `lib/notifications`, `lib/i18n`, `lib/email`, `lib/auth`, `lib/certificates`
- **Symbols**: 81 total, 71 exported → depends on: Repositories
- **Key exports**:
  - [`cn`](lib/utils.ts#L4) (function)
  - [`ExportDataRow`](lib/utils/csv.ts#L3) (interface)
  - [`convertToCSV`](lib/utils/csv.ts#L7) (function)
  - [`maskCNPJ`](lib/utils/cnpj.ts#L6) (function)
  - [`unmaskCNPJ`](lib/utils/cnpj.ts#L34) (function)
  - [`formatCNPJ`](lib/utils/cnpj.ts#L44) (function)
  - [`isValidCNPJFormat`](lib/utils/cnpj.ts#L67) (function)
  - [`GeneratedCourseStructure`](lib/types/ai.ts#L7) (interface)
  - [`GeneratedModule`](lib/types/ai.ts#L16) (interface)
  - [`GeneratedLesson`](lib/types/ai.ts#L23) (interface)
  - [`TenantFormData`](lib/supabase/tenants.ts#L10) (interface)
  - [`getTenants`](lib/supabase/tenants.ts#L23) (function)
  - [`getTenantById`](lib/supabase/tenants.ts#L57) (function)
  - [`createTenant`](lib/supabase/tenants.ts#L98) (function)
  - [`updateTenant`](lib/supabase/tenants.ts#L130) (function)
  - [`addUserToTenant`](lib/supabase/tenants.ts#L164) (function)
  - [`removeUserFromTenant`](lib/supabase/tenants.ts#L188) (function)
  - [`getTenantUsers`](lib/supabase/tenants.ts#L206) (function)
  - [`createClient`](lib/supabase/server.ts#L6) (function)
  - [`getCurrentUser`](lib/supabase/server.ts#L47) (function)
  - [`getUserById`](lib/supabase/server.ts#L56) (function)
  - [`requireAuth`](lib/supabase/server.ts#L84) (function)
  - [`isSuperAdmin`](lib/supabase/server.ts#L93) (function)
  - [`requireSuperAdmin`](lib/supabase/server.ts#L102) (function)
  - [`requireRole`](lib/supabase/server.ts#L111) (function)
  - [`getCurrentUser`](lib/supabase/client.ts#L21) (function)
  - [`checkUserRole`](lib/supabase/client.ts#L39) (function)
  - [`getUserOrganization`](lib/supabase/client.ts#L56) (function)
  - [`prioritizeNotifications`](lib/notifications/utils.ts#L7) (function)
  - [`groupSimilarNotifications`](lib/notifications/utils.ts#L41) (function)
  - [`notifyCourseAssigned`](lib/notifications/triggers.ts#L19) (function)
  - [`notifyDeadlineApproaching`](lib/notifications/triggers.ts#L83) (function)
  - [`notifyDeadlinePassed`](lib/notifications/triggers.ts#L130) (function)
  - [`notifyCourseCompleted`](lib/notifications/triggers.ts#L151) (function)
  - [`notifyCertificateAvailable`](lib/notifications/triggers.ts#L195) (function)
  - [`notifyWelcome`](lib/notifications/triggers.ts#L243) (function)
  - [`notifyNewContent`](lib/notifications/triggers.ts#L278) (function)
  - [`checkRateLimit`](lib/notifications/intelligent.ts#L10) (function)
  - [`createIntelligentNotification`](lib/notifications/intelligent.ts#L34) (function)
  - [`learnFromUserBehavior`](lib/notifications/intelligent.ts#L99) (function)
  - [`Locale`](lib/i18n/translations.ts#L271) (type)
  - [`TranslationKey`](lib/i18n/translations.ts#L272) (type)
  - [`getLocale`](lib/i18n/index.ts#L9) (function)
  - [`getTranslations`](lib/i18n/index.ts#L22) (function)
  - [`setLocale`](lib/i18n/index.ts#L26) (function)
  - [`sendWelcomeEmail`](lib/email/sender.ts#L39) (function)
  - [`sendCourseAssignedEmail`](lib/email/sender.ts#L60) (function)
  - [`sendDeadlineApproachingEmail`](lib/email/sender.ts#L98) (function)
  - [`sendCourseCompletedEmail`](lib/email/sender.ts#L131) (function)
  - [`sendCertificateAvailableEmail`](lib/email/sender.ts#L158) (function)
  - [`EmailOptions`](lib/email/resend.ts#L10) (interface)
  - [`sendEmail`](lib/email/resend.ts#L24) (function)
  - [`getWelcomeEmailTemplate`](lib/email/resend.ts#L57) (function)
  - [`getCourseAssignedEmailTemplate`](lib/email/resend.ts#L83) (function)
  - [`getDeadlineApproachingEmailTemplate`](lib/email/resend.ts#L126) (function)
  - [`getCourseCompletedEmailTemplate`](lib/email/resend.ts#L158) (function)
  - [`getCertificateAvailableEmailTemplate`](lib/email/resend.ts#L190) (function)
  - [`EmailQueueItem`](lib/email/queue.ts#L9) (interface)
  - [`queueEmail`](lib/email/queue.ts#L29) (function)
  - [`processEmailQueue`](lib/email/queue.ts#L38) (function)
  - [`AuthContext`](lib/auth/types.ts#L6) (interface)
  - [`AuthResult`](lib/auth/types.ts#L14) (interface)
  - [`getCurrentUser`](lib/auth/helpers.ts#L14) (function)
  - [`requireAuth`](lib/auth/helpers.ts#L113) (function)
  - [`isSuperAdmin`](lib/auth/helpers.ts#L130) (function)
  - [`requireSuperAdmin`](lib/auth/helpers.ts#L144) (function)
  - [`requireRole`](lib/auth/helpers.ts#L161) (function)
  - [`getAuthContext`](lib/auth/context.ts#L17) (function)
  - [`setAuthContext`](lib/auth/context.ts#L26) (function)
  - [`runWithAuthContext`](lib/auth/context.ts#L37) (function)
  - [`clearAuthContext`](lib/auth/context.ts#L47) (function)

### Repositories
Data access and persistence
- **Directories**: `lib/types`, `lib/supabase`
- **Symbols**: 62 total, 62 exported
- **Key exports**:
  - [`UserRole`](lib/types/database.ts#L5) (type)
  - [`CourseLevel`](lib/types/database.ts#L6) (type)
  - [`ContentType`](lib/types/database.ts#L7) (type)
  - [`QuestionType`](lib/types/database.ts#L8) (type)
  - [`AssignmentStatus`](lib/types/database.ts#L9) (type)
  - [`CourseStatus`](lib/types/database.ts#L10) (type)
  - [`KnowledgeSourceStatus`](lib/types/database.ts#L11) (type)
  - [`Organization`](lib/types/database.ts#L17) (interface)
  - [`User`](lib/types/database.ts#L35) (interface)
  - [`TenantUser`](lib/types/database.ts#L51) (interface)
  - [`CourseAccessType`](lib/types/database.ts#L62) (type)
  - [`AssignmentType`](lib/types/database.ts#L63) (type)
  - [`OrganizationCourseAccess`](lib/types/database.ts#L65) (interface)
  - [`CourseCustomization`](lib/types/database.ts#L87) (interface)
  - [`OrganizationCourseAssignment`](lib/types/database.ts#L101) (interface)
  - [`CertificateTemplate`](lib/types/database.ts#L116) (interface)
  - [`Course`](lib/types/database.ts#L131) (interface)
  - [`Module`](lib/types/database.ts#L156) (interface)
  - [`Lesson`](lib/types/database.ts#L166) (interface)
  - [`LessonMaterial`](lib/types/database.ts#L180) (interface)
  - [`Quiz`](lib/types/database.ts#L190) (interface)
  - [`QuizQuestion`](lib/types/database.ts#L204) (interface)
  - [`QuestionOption`](lib/types/database.ts#L215) (interface)
  - [`LearningPath`](lib/types/database.ts#L225) (interface)
  - [`PathCourse`](lib/types/database.ts#L238) (interface)
  - [`UserPathAssignment`](lib/types/database.ts#L247) (interface)
  - [`UserCourseProgress`](lib/types/database.ts#L260) (interface)
  - [`UserLessonProgress`](lib/types/database.ts#L273) (interface)
  - [`UserQuizAttempt`](lib/types/database.ts#L285) (interface)
  - [`UserAnswer`](lib/types/database.ts#L300) (interface)
  - [`Certificate`](lib/types/database.ts#L310) (interface)
  - [`UserNote`](lib/types/database.ts#L322) (interface)
  - [`ActivityLog`](lib/types/database.ts#L332) (interface)
  - [`CourseWithModules`](lib/types/database.ts#L347) (interface)
  - [`ModuleWithLessons`](lib/types/database.ts#L351) (interface)
  - [`CourseWithProgress`](lib/types/database.ts#L355) (interface)
  - [`LearningPathWithCourses`](lib/types/database.ts#L359) (interface)
  - [`QuizWithQuestions`](lib/types/database.ts#L363) (interface)
  - [`QuizQuestionWithOptions`](lib/types/database.ts#L367) (interface)
  - [`UserQuizAttemptWithAnswers`](lib/types/database.ts#L371) (interface)
  - [`ApiResponse`](lib/types/database.ts#L385) (interface)
  - [`PaginatedResponse`](lib/types/database.ts#L391) (interface)
  - [`CourseFormData`](lib/types/database.ts#L403) (interface)
  - [`ModuleFormData`](lib/types/database.ts#L416) (interface)
  - [`LessonFormData`](lib/types/database.ts#L422) (interface)
  - [`QuizFormData`](lib/types/database.ts#L432) (interface)
  - [`QuestionFormData`](lib/types/database.ts#L441) (interface)
  - [`OptionFormData`](lib/types/database.ts#L450) (interface)
  - [`LearningPathFormData`](lib/types/database.ts#L457) (interface)
  - [`CourseFilters`](lib/types/database.ts#L470) (interface)
  - [`UserFilters`](lib/types/database.ts#L478) (interface)
  - [`ProgressFilters`](lib/types/database.ts#L486) (interface)
  - [`NotificationType`](lib/types/database.ts#L497) (type)
  - [`Notification`](lib/types/database.ts#L510) (interface)
  - [`NotificationFrequency`](lib/types/database.ts#L524) (type)
  - [`NotificationPreferences`](lib/types/database.ts#L526) (interface)
  - [`CreateNotificationData`](lib/types/database.ts#L540) (interface)
  - [`KnowledgeSource`](lib/types/database.ts#L554) (interface)
  - [`KnowledgeVector`](lib/types/database.ts#L569) (interface)
  - [`MatchedDocument`](lib/types/database.ts#L580) (interface)
  - [`Json`](lib/supabase/database.types.ts#L7) (type)
  - [`Database`](lib/supabase/database.types.ts#L15) (type)

### Services
Business logic and orchestration
- **Directories**: `lib/services`, `tests/unit/services`
- **Symbols**: 33 total, 32 exported
- **Key exports**:
  - [`GetUsersResult`](lib/services/user.service.ts#L20) (interface)
  - [`PendingUser`](lib/services/user.service.ts#L28) (interface)
  - [`UserServiceError`](lib/services/user.service.ts#L37) (class)
  - [`UserService`](lib/services/user.service.ts#L52) (class)
  - [`QuizWithQuestions`](lib/services/quiz.service.ts#L26) (interface)
  - [`QuizServiceError`](lib/services/quiz.service.ts#L31) (class)
  - [`QuizService`](lib/services/quiz.service.ts#L46) (class)
  - [`OrganizationWithCount`](lib/services/organization.service.ts#L23) (interface)
  - [`OrganizationServiceError`](lib/services/organization.service.ts#L28) (class)
  - [`OrganizationService`](lib/services/organization.service.ts#L43) (class)
  - [`ProcessDocumentInput`](lib/services/knowledge.service.ts#L27) (interface)
  - [`DocumentChunk`](lib/services/knowledge.service.ts#L34) (interface)
  - [`KnowledgeServiceError`](lib/services/knowledge.service.ts#L40) (class)
  - [`KnowledgeService`](lib/services/knowledge.service.ts#L63) (class)
  - [`CourseServiceOptions`](lib/services/course.service.ts#L29) (interface)
  - [`CourseServiceError`](lib/services/course.service.ts#L36) (class)
  - [`CourseService`](lib/services/course.service.ts#L51) (class)
  - [`ContentServiceError`](lib/services/content.service.ts#L27) (class)
  - [`ContentService`](lib/services/content.service.ts#L42) (class)
  - [`SignInResult`](lib/services/auth.service.ts#L24) (interface)
  - [`SignUpResult`](lib/services/auth.service.ts#L30) (interface)
  - [`CreateUserResult`](lib/services/auth.service.ts#L35) (interface)
  - [`AuthServiceError`](lib/services/auth.service.ts#L40) (class)
  - [`AuthService`](lib/services/auth.service.ts#L55) (class)
  - [`GenerateCourseStructureInput`](lib/services/ai-course.service.ts#L27) (interface)
  - [`AICourseServiceError`](lib/services/ai-course.service.ts#L33) (class)
  - [`AICourseService`](lib/services/ai-course.service.ts#L77) (class)
  - [`EmbeddingResponse`](lib/services/ai-client.ts#L62) (interface)
  - [`generateEmbedding`](lib/services/ai-client.ts#L80) (function)
  - [`generateEmbeddingsBatch`](lib/services/ai-client.ts#L105) (function)
  - [`chatWithStructuredOutput`](lib/services/ai-client.ts#L129) (function)
  - [`chat`](lib/services/ai-client.ts#L175) (function)

### Controllers
Request handling and routing
- **Directories**: `app/api/profile/notifications`
- **Symbols**: 1 total, 1 exported
- **Key exports**:
  - [`POST`](app/api/profile/notifications/route.ts#L4) (function)

### Components
UI components and views
- **Directories**: `components`, `app`, `components/ui`, `components/quiz`, `components/profile`, `components/notifications`, `components/lesson-player`, `components/layout`, `components/editor`, `components/course`, `components/certificates`, `components/auth`, `components/admin`, `app/terms`, `app/privacy`, `app/landing`, `components/admin/ai`, `app/auth/waiting-room`, `app/auth/signup`, `app/auth/login`, `app/auth/callback`, `app/(main)/search`, `app/(main)/profile`, `app/(main)/paths`, `app/(main)/notifications`, `app/(main)/dashboard`, `app/(main)/courses`, `app/(main)/certificates`, `app/(admin)/admin`, `app/(main)/profile/notifications`, `app/(main)/paths/[slug]`, `app/(main)/courses/[slug]`, `app/(main)/certificates/[id]`, `app/(admin)/admin/users`, `app/(admin)/admin/tenants`, `app/(admin)/admin/reports`, `app/(admin)/admin/settings`, `app/(admin)/admin/quizzes`, `app/(admin)/admin/paths`, `app/(admin)/admin/organizations`, `app/(admin)/admin/licenses`, `app/(admin)/admin/courses`, `app/(admin)/admin/ai`, `app/(admin)/admin/activity`, `app/(main)/certificates/verify/[code]`, `app/(main)/certificates/[id]/download`, `app/(admin)/admin/users/new`, `app/(admin)/admin/users/pending`, `app/(admin)/admin/tenants/new`, `app/(admin)/admin/quizzes/new`, `app/(admin)/admin/quizzes/[id]`, `app/(admin)/admin/paths/new`, `app/(admin)/admin/paths/[id]`, `app/(admin)/admin/organizations/[id]`, `app/(admin)/admin/courses/new`, `app/(main)/courses/[slug]/quiz/[quizId]`, `app/(main)/courses/[slug]/[moduleId]/[lessonId]`, `app/(admin)/admin/tenants/[id]/edit`, `app/(admin)/admin/quizzes/[id]/questions`, `app/(admin)/admin/quizzes/[id]/edit`, `app/(admin)/admin/paths/[id]/edit`, `app/(admin)/admin/paths/[id]/assign`, `app/(admin)/admin/organizations/[id]/view`, `app/(admin)/admin/organizations/[id]/courses`, `app/(admin)/admin/courses/[id]/modules`, `app/(admin)/admin/courses/[id]/edit`, `app/(admin)/admin/courses/[id]/customize`, `app/(admin)/admin/quizzes/[id]/questions/new`, `app/(admin)/admin/organizations/[id]/users/assign-courses`, `app/(main)/courses/[slug]/quiz/[quizId]/result/[attemptId]`, `app/(main)/courses/[slug]/quiz/[quizId]/attempt/[attemptId]`, `app/(admin)/admin/quizzes/[id]/questions/[questionId]/edit`, `app/(admin)/admin/courses/[id]/modules/[moduleId]/lessons`
- **Symbols**: 136 total, 50 exported
- **Key exports**:
  - [`LanguageSwitcher`](components/language-switcher.tsx#L14) (function)
  - [`CNPJInput`](components/cnpj-input.tsx#L20) (function)
  - [`CNPJDisplay`](components/cnpj-display.tsx#L12) (function)
  - [`Home`](app/page.tsx#L10) (function)
  - [`SuspenseWrapper`](components/ui/suspense-wrapper.tsx#L11) (function)
  - [`SkipLink`](components/ui/skip-link.tsx#L12) (function)
  - [`Skeleton`](components/ui/skeleton.tsx#L5) (function)
  - [`EmptyStateProps`](components/ui/empty-state.tsx#L6) (interface)
  - [`ButtonProps`](components/ui/button.tsx#L36) (interface)
  - [`BadgeProps`](components/ui/badge.tsx#L26) (interface)
  - [`ProfileForm`](components/profile/profile-form.tsx#L18) (function)
  - [`NotificationPreferencesForm`](components/profile/notification-preferences-form.tsx#L24) (function)
  - [`MarkAllReadButton`](components/notifications/mark-all-read-button.tsx#L10) (function)
  - [`PDFViewer`](components/lesson-player/pdf-viewer.tsx#L16) (function)
  - [`LessonEditorProps`](components/editor/lesson-editor.tsx#L39) (interface)
  - [`Lesson`](components/course/lesson-player.tsx#L30) (interface)
  - [`Module`](components/course/lesson-player.tsx#L42) (interface)
  - [`LessonPlayerProps`](components/course/lesson-player.tsx#L49) (interface)
  - [`ShareCertificateButton`](components/certificates/share-button.tsx#L10) (function)
  - [`GoogleSignInButton`](components/auth/google-signin-button.tsx#L12) (function)
  - [`LicenseStats`](components/admin/license-stats.tsx#L17) (function)
  - [`ExportButton`](components/admin/export-button.tsx#L15) (function)
  - [`ErrorLogger`](components/admin/error-logger.tsx#L9) (function)
  - [`EditLessonDialog`](components/admin/edit-lesson-dialog.tsx#L37) (function)
  - [`handleSubmit`](components/admin/edit-lesson-dialog.tsx#L44) (function)
  - [`DeletePathButton`](components/admin/delete-path-button.tsx#L26) (function)
  - [`AssignPathForm`](components/admin/assign-path-form.tsx#L21) (function)
  - [`AddLicensesDialog`](components/admin/add-licenses-dialog.tsx#L27) (function)
  - [`PrivacyPage`](app/privacy/page.tsx#L10) (function)
  - [`NotificationPreferencesPage`](app/(main)/profile/notifications/page.tsx#L17) (function)
  - [`handleUpdate`](app/(main)/profile/notifications/page.tsx#L22) (function)
  - [`AdminSettingsPage`](app/(admin)/admin/settings/page.tsx#L5) (function)
  - [`AIAdminPage`](app/(admin)/admin/ai/page.tsx#L9) (function)
  - [`DownloadCertificatePage`](app/(main)/certificates/[id]/download/page.tsx#L8) (function)
  - [`NewUserPage`](app/(admin)/admin/users/new/page.tsx#L20) (function)
  - [`createUserAction`](app/(admin)/admin/users/new/page.tsx#L24) (function)
  - [`NewTenantPage`](app/(admin)/admin/tenants/new/page.tsx#L13) (function)
  - [`createTenantAction`](app/(admin)/admin/tenants/new/page.tsx#L16) (function)
  - [`NewCoursePage`](app/(admin)/admin/courses/new/page.tsx#L28) (function)
  - [`handleCreateCourse`](app/(admin)/admin/courses/new/page.tsx#L31) (function)
  - [`EditTenantPage`](app/(admin)/admin/tenants/[id]/edit/page.tsx#L14) (function)
  - [`updateTenantAction`](app/(admin)/admin/tenants/[id]/edit/page.tsx#L33) (function)
  - [`AssignPathPage`](app/(admin)/admin/paths/[id]/assign/page.tsx#L13) (function)
  - [`CustomizeCoursePage`](app/(admin)/admin/courses/[id]/customize/page.tsx#L26) (function)
  - [`handleCustomize`](app/(admin)/admin/courses/[id]/customize/page.tsx#L45) (function)
  - [`NewQuestionPage`](app/(admin)/admin/quizzes/[id]/questions/new/page.tsx#L21) (function)
  - [`handleCreateQuestion`](app/(admin)/admin/quizzes/[id]/questions/new/page.tsx#L36) (function)
  - [`AssignCoursesToUsersPage`](app/(admin)/admin/organizations/[id]/users/assign-courses/page.tsx#L19) (function)
  - [`handleAssign`](app/(admin)/admin/organizations/[id]/users/assign-courses/page.tsx#L38) (function)
  - [`QuizAttemptPage`](app/(main)/courses/[slug]/quiz/[quizId]/attempt/[attemptId]/page.tsx#L13) (function)

### Generators
Content and object generation
- **Directories**: `components/branding`
- **Symbols**: 3 total, 3 exported
- **Key exports**:
  - [`CoverVariant`](components/branding/cover-generator.tsx#L18) (type)
  - [`CoverCategory`](components/branding/cover-generator.tsx#L19) (type)
  - [`CoverGeneratorProps`](components/branding/cover-generator.tsx#L21) (interface)


## Detected Design Patterns
| Pattern | Confidence | Locations | Description |
|---------|------------|-----------|-------------|
| Service Layer | 85% | `UserService` ([user.service.ts](lib/services/user.service.ts)), `QuizService` ([quiz.service.ts](lib/services/quiz.service.ts)), `OrganizationService` ([organization.service.ts](lib/services/organization.service.ts)), `KnowledgeService` ([knowledge.service.ts](lib/services/knowledge.service.ts)), `CourseService` ([course.service.ts](lib/services/course.service.ts)), `ContentService` ([content.service.ts](lib/services/content.service.ts)), `AuthService` ([auth.service.ts](lib/services/auth.service.ts)), `AICourseService` ([ai-course.service.ts](lib/services/ai-course.service.ts)) | Encapsulates business logic in service classes |

## Entry Points
- [`../lib/supabase/server.ts`](../lib/supabase/server.ts)
- [`../lib/i18n/index.ts`](../lib/i18n/index.ts)
- [`../lib/auth/index.ts`](../lib/auth/index.ts)

## Public API
| Symbol | Type | Location |
| --- | --- | --- |
| [`ActionError`](app/actions/users.ts#L26) | interface | app/actions/users.ts:26 |
| [`ActionError`](app/actions/quizzes.ts#L31) | interface | app/actions/quizzes.ts:31 |
| [`ActionError`](app/actions/quiz-attempts.ts#L17) | interface | app/actions/quiz-attempts.ts:17 |
| [`ActionError`](app/actions/courses.ts#L32) | interface | app/actions/courses.ts:32 |
| [`ActionError`](app/actions/ai-admin.ts#L30) | interface | app/actions/ai-admin.ts:30 |
| [`ActivityLog`](lib/types/database.ts#L332) | interface | lib/types/database.ts:332 |
| [`ActivityLog`](app/actions/activity-logs.ts#L9) | interface | app/actions/activity-logs.ts:9 |
| [`ActivityLogFilters`](app/actions/activity-logs.ts#L24) | interface | app/actions/activity-logs.ts:24 |
| [`addCourseToPath`](app/actions/learning-paths.ts#L260) | function | app/actions/learning-paths.ts:260 |
| [`addLicenses`](app/actions/license-management.ts#L10) | function | app/actions/license-management.ts:10 |
| [`AddLicensesDialog`](components/admin/add-licenses-dialog.tsx#L27) | function | components/admin/add-licenses-dialog.tsx:27 |
| [`addUserToTenant`](lib/supabase/tenants.ts#L164) | function | lib/supabase/tenants.ts:164 |
| [`AdminLayout`](app/(admin)/admin/layout.tsx#L12) | function | app/(admin)/admin/layout.tsx:12 |
| [`AdminSettingsPage`](app/(admin)/admin/settings/page.tsx#L5) | function | app/(admin)/admin/settings/page.tsx:5 |
| [`AIAdminPage`](app/(admin)/admin/ai/page.tsx#L9) | function | app/(admin)/admin/ai/page.tsx:9 |
| [`AICourseService`](lib/services/ai-course.service.ts#L77) | class | lib/services/ai-course.service.ts:77 |
| [`AICourseServiceError`](lib/services/ai-course.service.ts#L33) | class | lib/services/ai-course.service.ts:33 |
| [`ApiResponse`](lib/types/database.ts#L385) | interface | lib/types/database.ts:385 |
| [`approveUser`](app/actions/users.ts#L154) | function | app/actions/users.ts:154 |
| [`AssignCourseConfig`](app/actions/organization-courses.ts#L17) | interface | app/actions/organization-courses.ts:17 |
| [`AssignCoursesToUsersPage`](app/(admin)/admin/organizations/[id]/users/assign-courses/page.tsx#L19) | function | app/(admin)/admin/organizations/[id]/users/assign-courses/page.tsx:19 |
| [`assignCourseToOrganization`](app/actions/organization-courses.ts#L29) | function | app/actions/organization-courses.ts:29 |
| [`assignCourseToUser`](app/actions/organization-courses.ts#L292) | function | app/actions/organization-courses.ts:292 |
| [`AssignmentStatus`](lib/types/database.ts#L9) | type | lib/types/database.ts:9 |
| [`AssignmentType`](lib/types/database.ts#L63) | type | lib/types/database.ts:63 |
| [`AssignPathForm`](components/admin/assign-path-form.tsx#L21) | function | components/admin/assign-path-form.tsx:21 |
| [`AssignPathPage`](app/(admin)/admin/paths/[id]/assign/page.tsx#L13) | function | app/(admin)/admin/paths/[id]/assign/page.tsx:13 |
| [`assignPathToUser`](app/actions/path-assignments.ts#L12) | function | app/actions/path-assignments.ts:12 |
| [`assignPathToUsers`](app/actions/path-assignments.ts#L105) | function | app/actions/path-assignments.ts:105 |
| [`AuthActionError`](app/actions/auth.ts#L28) | interface | app/actions/auth.ts:28 |
| [`AuthContext`](lib/auth/types.ts#L6) | interface | lib/auth/types.ts:6 |
| [`AuthResult`](lib/auth/types.ts#L14) | interface | lib/auth/types.ts:14 |
| [`AuthService`](lib/services/auth.service.ts#L55) | class | lib/services/auth.service.ts:55 |
| [`AuthServiceError`](lib/services/auth.service.ts#L40) | class | lib/services/auth.service.ts:40 |
| [`BadgeProps`](components/ui/badge.tsx#L26) | interface | components/ui/badge.tsx:26 |
| [`ButtonProps`](components/ui/button.tsx#L36) | interface | components/ui/button.tsx:36 |
| [`Certificate`](lib/types/database.ts#L310) | interface | lib/types/database.ts:310 |
| [`CertificateTemplate`](lib/types/database.ts#L116) | interface | lib/types/database.ts:116 |
| [`changePassword`](app/actions/profile.ts#L74) | function | app/actions/profile.ts:74 |
| [`chat`](lib/services/ai-client.ts#L175) | function | lib/services/ai-client.ts:175 |
| [`chatWithStructuredOutput`](lib/services/ai-client.ts#L129) | function | lib/services/ai-client.ts:129 |
| [`checkAssetOrganization`](app/actions/scans.ts#L23) | function | app/actions/scans.ts:23 |
| [`checkLicenseAvailability`](app/actions/organization-courses.ts#L174) | function | app/actions/organization-courses.ts:174 |
| [`checkPathCompletion`](app/actions/path-assignments.ts#L193) | function | app/actions/path-assignments.ts:193 |
| [`checkRateLimit`](lib/notifications/intelligent.ts#L10) | function | lib/notifications/intelligent.ts:10 |
| [`checkUserRole`](lib/supabase/client.ts#L39) | function | lib/supabase/client.ts:39 |
| [`clearAuthContext`](lib/auth/context.ts#L47) | function | lib/auth/context.ts:47 |
| [`ClientCourseForm`](app/(admin)/admin/courses/new/client-form.tsx#L30) | function | app/(admin)/admin/courses/new/client-form.tsx:30 |
| [`ClientEditForm`](app/(admin)/admin/courses/[id]/edit/client-form.tsx#L34) | function | app/(admin)/admin/courses/[id]/edit/client-form.tsx:34 |
| [`cn`](lib/utils.ts#L4) | function | lib/utils.ts:4 |
| [`CNPJDisplay`](components/cnpj-display.tsx#L12) | function | components/cnpj-display.tsx:12 |
| [`CNPJInput`](components/cnpj-input.tsx#L20) | function | components/cnpj-input.tsx:20 |
| [`ContentService`](lib/services/content.service.ts#L42) | class | lib/services/content.service.ts:42 |
| [`ContentServiceError`](lib/services/content.service.ts#L27) | class | lib/services/content.service.ts:27 |
| [`ContentType`](lib/types/database.ts#L7) | type | lib/types/database.ts:7 |
| [`convertToCSV`](lib/utils/csv.ts#L7) | function | lib/utils/csv.ts:7 |
| [`Course`](lib/types/database.ts#L131) | interface | lib/types/database.ts:131 |
| [`CourseAccessType`](lib/types/database.ts#L62) | type | lib/types/database.ts:62 |
| [`CourseCompletionStat`](app/actions/reports.ts#L89) | interface | app/actions/reports.ts:89 |
| [`CourseCreateInput`](lib/validators/course.schema.ts#L125) | type | lib/validators/course.schema.ts:125 |
| [`CourseCustomization`](lib/types/database.ts#L87) | interface | lib/types/database.ts:87 |
| [`CourseCustomizationData`](app/actions/organization-courses.ts#L239) | interface | app/actions/organization-courses.ts:239 |
| [`CourseFilters`](lib/types/database.ts#L470) | interface | lib/types/database.ts:470 |
| [`CourseFiltersInput`](lib/validators/course.schema.ts#L127) | type | lib/validators/course.schema.ts:127 |
| [`CourseFormData`](lib/types/database.ts#L403) | interface | lib/types/database.ts:403 |
| [`CourseLevel`](lib/types/database.ts#L6) | type | lib/types/database.ts:6 |
| [`CoursePopularityStat`](app/actions/reports.ts#L175) | interface | app/actions/reports.ts:175 |
| [`CourseService`](lib/services/course.service.ts#L51) | class | lib/services/course.service.ts:51 |
| [`CourseServiceError`](lib/services/course.service.ts#L36) | class | lib/services/course.service.ts:36 |
| [`CourseServiceOptions`](lib/services/course.service.ts#L29) | interface | lib/services/course.service.ts:29 |
| [`CourseStatus`](lib/types/database.ts#L10) | type | lib/types/database.ts:10 |
| [`CourseUpdateInput`](lib/validators/course.schema.ts#L126) | type | lib/validators/course.schema.ts:126 |
| [`CourseUpsertInput`](lib/validators/course.schema.ts#L124) | type | lib/validators/course.schema.ts:124 |
| [`CourseWithModules`](lib/types/database.ts#L347) | interface | lib/types/database.ts:347 |
| [`CourseWithProgress`](lib/types/database.ts#L355) | interface | lib/types/database.ts:355 |
| [`CoverCategory`](components/branding/cover-generator.tsx#L19) | type | components/branding/cover-generator.tsx:19 |
| [`CoverGeneratorProps`](components/branding/cover-generator.tsx#L21) | interface | components/branding/cover-generator.tsx:21 |
| [`CoverVariant`](components/branding/cover-generator.tsx#L18) | type | components/branding/cover-generator.tsx:18 |
| [`createActivityLog`](app/actions/activity-logs.ts#L141) | function | app/actions/activity-logs.ts:141 |
| [`CreateActivityLogParams`](app/actions/activity-logs.ts#L132) | interface | app/actions/activity-logs.ts:132 |
| [`createClient`](lib/supabase/server.ts#L6) | function | lib/supabase/server.ts:6 |
| [`createCourse`](app/actions/courses.ts#L207) | function | app/actions/courses.ts:207 |
| [`createIntelligentNotification`](lib/notifications/intelligent.ts#L34) | function | lib/notifications/intelligent.ts:34 |
| [`createLearningPath`](app/actions/learning-paths.ts#L142) | function | app/actions/learning-paths.ts:142 |
| [`createLesson`](app/actions/lessons.ts#L44) | function | app/actions/lessons.ts:44 |
| [`createModule`](app/actions/modules.ts#L44) | function | app/actions/modules.ts:44 |
| [`createNotification`](app/actions/notifications.ts#L18) | function | app/actions/notifications.ts:18 |
| [`CreateNotificationData`](lib/types/database.ts#L540) | interface | lib/types/database.ts:540 |
| [`createNotificationForUsers`](app/actions/notifications.ts#L47) | function | app/actions/notifications.ts:47 |
| [`createQuestion`](app/actions/quizzes.ts#L161) | function | app/actions/quizzes.ts:161 |
| [`createQuiz`](app/actions/quizzes.ts#L86) | function | app/actions/quizzes.ts:86 |
| [`createSupabaseClientMock`](tests/mocks/supabase.ts#L55) | function | tests/mocks/supabase.ts:55 |
| [`createSupabaseQueryMock`](tests/mocks/supabase.ts#L17) | function | tests/mocks/supabase.ts:17 |
| [`createTenant`](lib/supabase/tenants.ts#L98) | function | lib/supabase/tenants.ts:98 |
| [`createTenantAction`](app/(admin)/admin/tenants/new/page.tsx#L16) | function | app/(admin)/admin/tenants/new/page.tsx:16 |
| [`createUser`](app/actions/auth.ts#L150) | function | app/actions/auth.ts:150 |
| [`createUserAction`](app/(admin)/admin/users/new/page.tsx#L24) | function | app/(admin)/admin/users/new/page.tsx:24 |
| [`CreateUserInput`](lib/validators/auth.schema.ts#L118) | type | lib/validators/auth.schema.ts:118 |
| [`CreateUserResult`](lib/services/auth.service.ts#L35) | interface | lib/services/auth.service.ts:35 |
| [`customizeCourse`](app/actions/organization-courses.ts#L247) | function | app/actions/organization-courses.ts:247 |
| [`CustomizeCoursePage`](app/(admin)/admin/courses/[id]/customize/page.tsx#L26) | function | app/(admin)/admin/courses/[id]/customize/page.tsx:26 |
| [`DashboardMetrics`](app/actions/admin.ts#L9) | interface | app/actions/admin.ts:9 |
| [`Database`](lib/supabase/database.types.ts#L15) | type | lib/supabase/database.types.ts:15 |
| [`deleteCourse`](app/actions/courses.ts#L409) | function | app/actions/courses.ts:409 |
| [`deleteFile`](app/actions/storage.ts#L103) | function | app/actions/storage.ts:103 |
| [`deleteImage`](app/actions/storage.ts#L89) | function | app/actions/storage.ts:89 |
| [`deleteKnowledgeSource`](app/actions/ai-admin.ts#L174) | function | app/actions/ai-admin.ts:174 |
| [`deleteLearningPath`](app/actions/learning-paths.ts#L242) | function | app/actions/learning-paths.ts:242 |
| [`deleteLesson`](app/actions/lessons.ts#L106) | function | app/actions/lessons.ts:106 |
| [`deleteModule`](app/actions/modules.ts#L108) | function | app/actions/modules.ts:108 |
| [`deleteNotification`](app/actions/notifications.ts#L186) | function | app/actions/notifications.ts:186 |
| [`deleteOrganization`](app/actions/organizations.ts#L163) | function | app/actions/organizations.ts:163 |
| [`DeletePathButton`](components/admin/delete-path-button.tsx#L26) | function | components/admin/delete-path-button.tsx:26 |
| [`deleteQuestion`](app/actions/quizzes.ts#L218) | function | app/actions/quizzes.ts:218 |
| [`deleteQuiz`](app/actions/quizzes.ts#L141) | function | app/actions/quizzes.ts:141 |
| [`DocumentChunk`](lib/services/knowledge.service.ts#L34) | interface | lib/services/knowledge.service.ts:34 |
| [`DownloadCertificatePage`](app/(main)/certificates/[id]/download/page.tsx#L8) | function | app/(main)/certificates/[id]/download/page.tsx:8 |
| [`EditLessonDialog`](components/admin/edit-lesson-dialog.tsx#L37) | function | components/admin/edit-lesson-dialog.tsx:37 |
| [`EditTenantPage`](app/(admin)/admin/tenants/[id]/edit/page.tsx#L14) | function | app/(admin)/admin/tenants/[id]/edit/page.tsx:14 |
| [`EmailOptions`](lib/email/resend.ts#L10) | interface | lib/email/resend.ts:10 |
| [`EmailQueueItem`](lib/email/queue.ts#L9) | interface | lib/email/queue.ts:9 |
| [`EmbeddingResponse`](lib/services/ai-client.ts#L62) | interface | lib/services/ai-client.ts:62 |
| [`EmptyStateProps`](components/ui/empty-state.tsx#L6) | interface | components/ui/empty-state.tsx:6 |
| [`enrollInCourse`](app/actions/courses.ts#L468) | function | app/actions/courses.ts:468 |
| [`enrollInCourseAction`](app/actions/courses.ts#L532) | function | app/actions/courses.ts:532 |
| [`ErrorLogger`](components/admin/error-logger.tsx#L9) | function | components/admin/error-logger.tsx:9 |
| [`ExportButton`](components/admin/export-button.tsx#L15) | function | components/admin/export-button.tsx:15 |
| [`exportCourseCompletionData`](app/actions/reports.ts#L304) | function | app/actions/reports.ts:304 |
| [`exportCoursePopularityData`](app/actions/reports.ts#L318) | function | app/actions/reports.ts:318 |
| [`ExportDataRow`](lib/utils/csv.ts#L3) | interface | lib/utils/csv.ts:3 |
| [`formatCNPJ`](lib/utils/cnpj.ts#L44) | function | lib/utils/cnpj.ts:44 |
| [`generateCertificate`](app/actions/certificates.ts#L91) | function | app/actions/certificates.ts:91 |
| [`generateCourseStructure`](app/actions/ai-admin.ts#L230) | function | app/actions/ai-admin.ts:230 |
| [`GenerateCourseStructureInput`](lib/services/ai-course.service.ts#L27) | interface | lib/services/ai-course.service.ts:27 |
| [`GeneratedCourseStructure`](lib/types/ai.ts#L7) | interface | lib/types/ai.ts:7 |
| [`GeneratedLesson`](lib/types/ai.ts#L23) | interface | lib/types/ai.ts:23 |
| [`GeneratedModule`](lib/types/ai.ts#L16) | interface | lib/types/ai.ts:16 |
| [`generateEmbedding`](lib/services/ai-client.ts#L80) | function | lib/services/ai-client.ts:80 |
| [`generateEmbeddingsBatch`](lib/services/ai-client.ts#L105) | function | lib/services/ai-client.ts:105 |
| [`getActivityLogs`](app/actions/activity-logs.ts#L38) | function | app/actions/activity-logs.ts:38 |
| [`getActivityTypes`](app/actions/activity-logs.ts#L107) | function | app/actions/activity-logs.ts:107 |
| [`getAllLearningPaths`](app/actions/learning-paths.ts#L17) | function | app/actions/learning-paths.ts:17 |
| [`getAllOrganizations`](app/actions/organizations.ts#L46) | function | app/actions/organizations.ts:46 |
| [`getAuthContext`](lib/auth/context.ts#L17) | function | lib/auth/context.ts:17 |
| [`getCertificateAvailableEmailTemplate`](lib/email/resend.ts#L190) | function | lib/email/resend.ts:190 |
| [`getCertificateById`](app/actions/certificates.ts#L243) | function | app/actions/certificates.ts:243 |
| [`getCertificateByVerificationCode`](app/actions/certificates.ts#L200) | function | app/actions/certificates.ts:200 |
| [`getCourseAreas`](app/actions/courses.ts#L561) | function | app/actions/courses.ts:561 |
| [`getCourseAssignedEmailTemplate`](lib/email/resend.ts#L83) | function | lib/email/resend.ts:83 |
| [`getCourseById`](app/actions/courses.ts#L85) | function | app/actions/courses.ts:85 |
| [`getCourseBySlug`](app/actions/courses.ts#L125) | function | app/actions/courses.ts:125 |
| [`getCourseCompletedEmailTemplate`](lib/email/resend.ts#L158) | function | lib/email/resend.ts:158 |
| [`getCourseCompletionPercentage`](app/actions/course-progress.ts#L69) | function | app/actions/course-progress.ts:69 |
| [`getCourseCompletionStats`](app/actions/reports.ts#L99) | function | app/actions/reports.ts:99 |
| [`getCourseLessonsProgress`](app/actions/course-progress.ts#L34) | function | app/actions/course-progress.ts:34 |
| [`getCoursePopularityStats`](app/actions/reports.ts#L183) | function | app/actions/reports.ts:183 |
| [`getCourseProgress`](app/actions/progress.ts#L189) | function | app/actions/progress.ts:189 |
| [`getCourseProgress`](app/actions/course-progress.ts#L10) | function | app/actions/course-progress.ts:10 |
| [`getCourses`](app/actions/courses.ts#L42) | function | app/actions/courses.ts:42 |
| [`getCoursesWithProgress`](app/actions/courses.ts#L165) | function | app/actions/courses.ts:165 |
| [`getCurrentUser`](lib/supabase/server.ts#L47) | function | lib/supabase/server.ts:47 |
| [`getCurrentUser`](lib/supabase/client.ts#L21) | function | lib/supabase/client.ts:21 |
| [`getCurrentUser`](lib/auth/helpers.ts#L14) | function | lib/auth/helpers.ts:14 |
| [`getDashboardMetrics`](app/actions/admin.ts#L42) | function | app/actions/admin.ts:42 |
| [`getDeadlineApproachingEmailTemplate`](lib/email/resend.ts#L126) | function | lib/email/resend.ts:126 |
| [`getKnowledgeSources`](app/actions/ai-admin.ts#L140) | function | app/actions/ai-admin.ts:140 |
| [`getLearningPathById`](app/actions/learning-paths.ts#L43) | function | app/actions/learning-paths.ts:43 |
| [`getLearningPathBySlug`](app/actions/learning-paths.ts#L69) | function | app/actions/learning-paths.ts:69 |
| [`getLearningPathWithCourses`](app/actions/learning-paths.ts#L90) | function | app/actions/learning-paths.ts:90 |
| [`getLessonProgress`](app/actions/progress.ts#L166) | function | app/actions/progress.ts:166 |
| [`getLessonsByModule`](app/actions/lessons.ts#L26) | function | app/actions/lessons.ts:26 |
| [`getLicenseHistory`](app/actions/license-management.ts#L88) | function | app/actions/license-management.ts:88 |
| [`getLocale`](lib/i18n/index.ts#L9) | function | lib/i18n/index.ts:9 |
| [`getModulesByCourse`](app/actions/modules.ts#L26) | function | app/actions/modules.ts:26 |
| [`getNotificationPreferences`](app/actions/notifications.ts#L208) | function | app/actions/notifications.ts:208 |
| [`getOrganizationById`](app/actions/organizations.ts#L74) | function | app/actions/organizations.ts:74 |
| [`getOrganizationCourses`](app/actions/organizations.ts#L112) | function | app/actions/organizations.ts:112 |
| [`getOrganizationCourses`](app/actions/organization-courses.ts#L74) | function | app/actions/organization-courses.ts:74 |
| [`getOrganizationUsers`](app/actions/organizations.ts#L94) | function | app/actions/organizations.ts:94 |
| [`getOverallStats`](app/actions/reports.ts#L20) | function | app/actions/reports.ts:20 |
| [`getPathProgress`](app/actions/path-progress.ts#L21) | function | app/actions/path-progress.ts:21 |
| [`getPendingUsers`](app/actions/users.ts#L102) | function | app/actions/users.ts:102 |
| [`getPublicOrganizations`](app/actions/organizations.ts#L28) | function | app/actions/organizations.ts:28 |
| [`getQuizAttemptById`](app/actions/quiz-attempts.ts#L47) | function | app/actions/quiz-attempts.ts:47 |
| [`getQuizById`](app/actions/quizzes.ts#L59) | function | app/actions/quizzes.ts:59 |
| [`getQuizzes`](app/actions/quizzes.ts#L41) | function | app/actions/quizzes.ts:41 |
| [`getRecentActivities`](app/actions/admin.ts#L296) | function | app/actions/admin.ts:296 |
| [`getRecentActivity`](app/actions/activity-logs.ts#L339) | function | app/actions/activity-logs.ts:339 |
| [`getTenantById`](lib/supabase/tenants.ts#L57) | function | lib/supabase/tenants.ts:57 |
| [`getTenants`](lib/supabase/tenants.ts#L23) | function | lib/supabase/tenants.ts:23 |
| [`getTenantUsers`](lib/supabase/tenants.ts#L206) | function | lib/supabase/tenants.ts:206 |
| [`getTranslations`](lib/i18n/index.ts#L22) | function | lib/i18n/index.ts:22 |
| [`getUnreadNotificationCount`](app/actions/notifications.ts#L119) | function | app/actions/notifications.ts:119 |
| [`getUserActivityStats`](app/actions/reports.ts#L243) | function | app/actions/reports.ts:243 |
| [`getUserById`](lib/supabase/server.ts#L56) | function | lib/supabase/server.ts:56 |
| [`getUserCertificates`](app/actions/certificates.ts#L170) | function | app/actions/certificates.ts:170 |
| [`getUserMandatoryCourses`](app/actions/organization-courses.ts#L126) | function | app/actions/organization-courses.ts:126 |
| [`getUserNotifications`](app/actions/notifications.ts#L80) | function | app/actions/notifications.ts:80 |
| [`getUserOrganization`](lib/supabase/client.ts#L56) | function | lib/supabase/client.ts:56 |
| [`getUserPathsWithProgress`](app/actions/path-progress.ts#L97) | function | app/actions/path-progress.ts:97 |
| [`getUserProgress`](app/actions/progress.ts#L309) | function | app/actions/progress.ts:309 |
| [`getUserQuizAttempts`](app/actions/quiz-attempts.ts#L26) | function | app/actions/quiz-attempts.ts:26 |
| [`getUsers`](app/actions/users.ts#L36) | function | app/actions/users.ts:36 |
| [`GetUsersResult`](lib/services/user.service.ts#L20) | interface | lib/services/user.service.ts:20 |
| [`getWelcomeEmailTemplate`](lib/email/resend.ts#L57) | function | lib/email/resend.ts:57 |
| [`GoogleSignInButton`](components/auth/google-signin-button.tsx#L12) | function | components/auth/google-signin-button.tsx:12 |
| [`groupSimilarNotifications`](lib/notifications/utils.ts#L41) | function | lib/notifications/utils.ts:41 |
| [`handleAssign`](app/(admin)/admin/organizations/[id]/users/assign-courses/page.tsx#L38) | function | app/(admin)/admin/organizations/[id]/users/assign-courses/page.tsx:38 |
| [`handleCreateCourse`](app/(admin)/admin/courses/new/page.tsx#L31) | function | app/(admin)/admin/courses/new/page.tsx:31 |
| [`handleCreateQuestion`](app/(admin)/admin/quizzes/[id]/questions/new/page.tsx#L36) | function | app/(admin)/admin/quizzes/[id]/questions/new/page.tsx:36 |
| [`handleCustomize`](app/(admin)/admin/courses/[id]/customize/page.tsx#L45) | function | app/(admin)/admin/courses/[id]/customize/page.tsx:45 |
| [`handleSubmit`](components/admin/edit-lesson-dialog.tsx#L44) | function | components/admin/edit-lesson-dialog.tsx:44 |
| [`handleUpdate`](app/(main)/profile/notifications/page.tsx#L22) | function | app/(main)/profile/notifications/page.tsx:22 |
| [`Home`](app/page.tsx#L10) | function | app/page.tsx:10 |
| [`isSuperAdmin`](lib/supabase/server.ts#L93) | function | lib/supabase/server.ts:93 |
| [`isSuperAdmin`](lib/auth/helpers.ts#L130) | function | lib/auth/helpers.ts:130 |
| [`isValidCNPJFormat`](lib/utils/cnpj.ts#L67) | function | lib/utils/cnpj.ts:67 |
| [`Json`](lib/supabase/database.types.ts#L7) | type | lib/supabase/database.types.ts:7 |
| [`KnowledgeService`](lib/services/knowledge.service.ts#L63) | class | lib/services/knowledge.service.ts:63 |
| [`KnowledgeServiceError`](lib/services/knowledge.service.ts#L40) | class | lib/services/knowledge.service.ts:40 |
| [`KnowledgeSource`](lib/types/database.ts#L554) | interface | lib/types/database.ts:554 |
| [`KnowledgeSourceStatus`](lib/types/database.ts#L11) | type | lib/types/database.ts:11 |
| [`KnowledgeVector`](lib/types/database.ts#L569) | interface | lib/types/database.ts:569 |
| [`LanguageSwitcher`](components/language-switcher.tsx#L14) | function | components/language-switcher.tsx:14 |
| [`learnFromUserBehavior`](lib/notifications/intelligent.ts#L99) | function | lib/notifications/intelligent.ts:99 |
| [`LearningPath`](lib/types/database.ts#L225) | interface | lib/types/database.ts:225 |
| [`LearningPathFormData`](lib/types/database.ts#L457) | interface | lib/types/database.ts:457 |
| [`LearningPathWithCourses`](lib/types/database.ts#L359) | interface | lib/types/database.ts:359 |
| [`Lesson`](lib/types/database.ts#L166) | interface | lib/types/database.ts:166 |
| [`Lesson`](components/course/lesson-player.tsx#L30) | interface | components/course/lesson-player.tsx:30 |
| [`LessonCreateInput`](lib/validators/content.schema.ts#L111) | type | lib/validators/content.schema.ts:111 |
| [`LessonEditorProps`](components/editor/lesson-editor.tsx#L39) | interface | components/editor/lesson-editor.tsx:39 |
| [`LessonFormData`](lib/types/database.ts#L422) | interface | lib/types/database.ts:422 |
| [`LessonMaterial`](lib/types/database.ts#L180) | interface | lib/types/database.ts:180 |
| [`LessonPlayerProps`](components/course/lesson-player.tsx#L49) | interface | components/course/lesson-player.tsx:49 |
| [`LessonUpdateInput`](lib/validators/content.schema.ts#L112) | type | lib/validators/content.schema.ts:112 |
| [`LicenseStats`](components/admin/license-stats.tsx#L17) | function | components/admin/license-stats.tsx:17 |
| [`Locale`](lib/i18n/translations.ts#L271) | type | lib/i18n/translations.ts:271 |
| [`logCertificateIssued`](app/actions/activity-logs.ts#L279) | function | app/actions/activity-logs.ts:279 |
| [`logCourseAssigned`](app/actions/activity-logs.ts#L297) | function | app/actions/activity-logs.ts:297 |
| [`logCourseCompleted`](app/actions/activity-logs.ts#L239) | function | app/actions/activity-logs.ts:239 |
| [`logCourseCreated`](app/actions/activity-logs.ts#L203) | function | app/actions/activity-logs.ts:203 |
| [`logCoursePublished`](app/actions/activity-logs.ts#L221) | function | app/actions/activity-logs.ts:221 |
| [`logPathCompleted`](app/actions/activity-logs.ts#L317) | function | app/actions/activity-logs.ts:317 |
| [`logQuizCompleted`](app/actions/activity-logs.ts#L257) | function | app/actions/activity-logs.ts:257 |
| [`logUserCreated`](app/actions/activity-logs.ts#L185) | function | app/actions/activity-logs.ts:185 |
| [`logUserLogin`](app/actions/activity-logs.ts#L176) | function | app/actions/activity-logs.ts:176 |
| [`MainLayout`](app/(main)/layout.tsx#L15) | function | app/(main)/layout.tsx:15 |
| [`markAllNotificationsAsRead`](app/actions/notifications.ts#L164) | function | app/actions/notifications.ts:164 |
| [`MarkAllReadButton`](components/notifications/mark-all-read-button.tsx#L10) | function | components/notifications/mark-all-read-button.tsx:10 |
| [`markLessonComplete`](app/actions/progress.ts#L158) | function | app/actions/progress.ts:158 |
| [`markNotificationAsRead`](app/actions/notifications.ts#L140) | function | app/actions/notifications.ts:140 |
| [`maskCNPJ`](lib/utils/cnpj.ts#L6) | function | lib/utils/cnpj.ts:6 |
| [`MatchedDocument`](lib/types/database.ts#L580) | interface | lib/types/database.ts:580 |
| [`middleware`](middleware.ts#L19) | function | middleware.ts:19 |
| [`Module`](lib/types/database.ts#L156) | interface | lib/types/database.ts:156 |
| [`Module`](components/course/lesson-player.tsx#L42) | interface | components/course/lesson-player.tsx:42 |
| [`ModuleCreateInput`](lib/validators/content.schema.ts#L108) | type | lib/validators/content.schema.ts:108 |
| [`ModuleFormData`](lib/types/database.ts#L416) | interface | lib/types/database.ts:416 |
| [`ModuleUpdateInput`](lib/validators/content.schema.ts#L109) | type | lib/validators/content.schema.ts:109 |
| [`ModuleWithLessons`](lib/types/database.ts#L351) | interface | lib/types/database.ts:351 |
| [`NewCoursePage`](app/(admin)/admin/courses/new/page.tsx#L28) | function | app/(admin)/admin/courses/new/page.tsx:28 |
| [`NewQuestionPage`](app/(admin)/admin/quizzes/[id]/questions/new/page.tsx#L21) | function | app/(admin)/admin/quizzes/[id]/questions/new/page.tsx:21 |
| [`NewTenantPage`](app/(admin)/admin/tenants/new/page.tsx#L13) | function | app/(admin)/admin/tenants/new/page.tsx:13 |
| [`NewUserPage`](app/(admin)/admin/users/new/page.tsx#L20) | function | app/(admin)/admin/users/new/page.tsx:20 |
| [`Notification`](lib/types/database.ts#L510) | interface | lib/types/database.ts:510 |
| [`NotificationFrequency`](lib/types/database.ts#L524) | type | lib/types/database.ts:524 |
| [`NotificationPreferences`](lib/types/database.ts#L526) | interface | lib/types/database.ts:526 |
| [`NotificationPreferencesForm`](components/profile/notification-preferences-form.tsx#L24) | function | components/profile/notification-preferences-form.tsx:24 |
| [`NotificationPreferencesPage`](app/(main)/profile/notifications/page.tsx#L17) | function | app/(main)/profile/notifications/page.tsx:17 |
| [`NotificationType`](lib/types/database.ts#L497) | type | lib/types/database.ts:497 |
| [`notifyCertificateAvailable`](lib/notifications/triggers.ts#L195) | function | lib/notifications/triggers.ts:195 |
| [`notifyCourseAssigned`](lib/notifications/triggers.ts#L19) | function | lib/notifications/triggers.ts:19 |
| [`notifyCourseCompleted`](lib/notifications/triggers.ts#L151) | function | lib/notifications/triggers.ts:151 |
| [`notifyDeadlineApproaching`](lib/notifications/triggers.ts#L83) | function | lib/notifications/triggers.ts:83 |
| [`notifyDeadlinePassed`](lib/notifications/triggers.ts#L130) | function | lib/notifications/triggers.ts:130 |
| [`notifyNewContent`](lib/notifications/triggers.ts#L278) | function | lib/notifications/triggers.ts:278 |
| [`notifyWelcome`](lib/notifications/triggers.ts#L243) | function | lib/notifications/triggers.ts:243 |
| [`OptionFormData`](lib/types/database.ts#L450) | interface | lib/types/database.ts:450 |
| [`Organization`](lib/types/database.ts#L17) | interface | lib/types/database.ts:17 |
| [`OrganizationCourseAccess`](lib/types/database.ts#L65) | interface | lib/types/database.ts:65 |
| [`OrganizationCourseAssignment`](lib/types/database.ts#L101) | interface | lib/types/database.ts:101 |
| [`OrganizationFiltersInput`](lib/validators/organization.schema.ts#L108) | type | lib/validators/organization.schema.ts:108 |
| [`OrganizationService`](lib/services/organization.service.ts#L43) | class | lib/services/organization.service.ts:43 |
| [`OrganizationServiceError`](lib/services/organization.service.ts#L28) | class | lib/services/organization.service.ts:28 |
| [`OrganizationUpdateInput`](lib/validators/organization.schema.ts#L109) | type | lib/validators/organization.schema.ts:109 |
| [`OrganizationWithCount`](lib/services/organization.service.ts#L23) | interface | lib/services/organization.service.ts:23 |
| [`OverallStats`](app/actions/reports.ts#L9) | interface | app/actions/reports.ts:9 |
| [`PaginatedResponse`](lib/types/database.ts#L391) | interface | lib/types/database.ts:391 |
| [`PathCourse`](lib/types/database.ts#L238) | interface | lib/types/database.ts:238 |
| [`PathProgress`](app/actions/path-progress.ts#L8) | interface | app/actions/path-progress.ts:8 |
| [`PDFViewer`](components/lesson-player/pdf-viewer.tsx#L16) | function | components/lesson-player/pdf-viewer.tsx:16 |
| [`PendingUser`](lib/services/user.service.ts#L28) | interface | lib/services/user.service.ts:28 |
| [`POST`](app/api/profile/notifications/route.ts#L4) | function | app/api/profile/notifications/route.ts:4 |
| [`prioritizeNotifications`](lib/notifications/utils.ts#L7) | function | lib/notifications/utils.ts:7 |
| [`PrivacyPage`](app/privacy/page.tsx#L10) | function | app/privacy/page.tsx:10 |
| [`ProcessDocumentInput`](lib/services/knowledge.service.ts#L27) | interface | lib/services/knowledge.service.ts:27 |
| [`processEmailQueue`](lib/email/queue.ts#L38) | function | lib/email/queue.ts:38 |
| [`ProfileForm`](components/profile/profile-form.tsx#L18) | function | components/profile/profile-form.tsx:18 |
| [`ProgressFilters`](lib/types/database.ts#L486) | interface | lib/types/database.ts:486 |
| [`publishCourse`](app/actions/courses.ts#L349) | function | app/actions/courses.ts:349 |
| [`QuestionCreateInput`](lib/validators/quiz.schema.ts#L157) | type | lib/validators/quiz.schema.ts:157 |
| [`QuestionFormData`](lib/types/database.ts#L441) | interface | lib/types/database.ts:441 |
| [`QuestionOption`](lib/types/database.ts#L215) | interface | lib/types/database.ts:215 |
| [`QuestionType`](lib/types/database.ts#L8) | type | lib/types/database.ts:8 |
| [`QuestionUpdateInput`](lib/validators/quiz.schema.ts#L158) | type | lib/validators/quiz.schema.ts:158 |
| [`queueEmail`](lib/email/queue.ts#L29) | function | lib/email/queue.ts:29 |
| [`Quiz`](lib/types/database.ts#L190) | interface | lib/types/database.ts:190 |
| [`QuizAttemptPage`](app/(main)/courses/[slug]/quiz/[quizId]/attempt/[attemptId]/page.tsx#L13) | function | app/(main)/courses/[slug]/quiz/[quizId]/attempt/[attemptId]/page.tsx:13 |
| [`QuizCreateInput`](lib/validators/quiz.schema.ts#L155) | type | lib/validators/quiz.schema.ts:155 |
| [`QuizFormData`](lib/types/database.ts#L432) | interface | lib/types/database.ts:432 |
| [`QuizQuestion`](lib/types/database.ts#L204) | interface | lib/types/database.ts:204 |
| [`QuizQuestionWithOptions`](lib/types/database.ts#L367) | interface | lib/types/database.ts:367 |
| [`QuizService`](lib/services/quiz.service.ts#L46) | class | lib/services/quiz.service.ts:46 |
| [`QuizServiceError`](lib/services/quiz.service.ts#L31) | class | lib/services/quiz.service.ts:31 |
| [`QuizUpdateInput`](lib/validators/quiz.schema.ts#L156) | type | lib/validators/quiz.schema.ts:156 |
| [`QuizWithQuestions`](lib/types/database.ts#L363) | interface | lib/types/database.ts:363 |
| [`QuizWithQuestions`](lib/services/quiz.service.ts#L26) | interface | lib/services/quiz.service.ts:26 |
| [`RecentActivity`](app/actions/admin.ts#L288) | interface | app/actions/admin.ts:288 |
| [`rejectUser`](app/actions/users.ts#L184) | function | app/actions/users.ts:184 |
| [`removeCourseFromOrganization`](app/actions/organization-courses.ts#L461) | function | app/actions/organization-courses.ts:461 |
| [`removeCourseFromPath`](app/actions/learning-paths.ts#L304) | function | app/actions/learning-paths.ts:304 |
| [`removeUserFromTenant`](lib/supabase/tenants.ts#L188) | function | lib/supabase/tenants.ts:188 |
| [`renewCourseAccess`](app/actions/license-management.ts#L56) | function | app/actions/license-management.ts:56 |
| [`reorderLessons`](app/actions/lessons.ts#L127) | function | app/actions/lessons.ts:127 |
| [`ReorderLessonsInput`](lib/validators/content.schema.ts#L113) | type | lib/validators/content.schema.ts:113 |
| [`reorderModules`](app/actions/modules.ts#L129) | function | app/actions/modules.ts:129 |
| [`ReorderModulesInput`](lib/validators/content.schema.ts#L110) | type | lib/validators/content.schema.ts:110 |
| [`reorderPathCourses`](app/actions/learning-paths.ts#L326) | function | app/actions/learning-paths.ts:326 |
| [`reorderQuestions`](app/actions/quizzes.ts#L238) | function | app/actions/quizzes.ts:238 |
| [`ReorderQuestionsInput`](lib/validators/quiz.schema.ts#L159) | type | lib/validators/quiz.schema.ts:159 |
| [`requireAuth`](lib/supabase/server.ts#L84) | function | lib/supabase/server.ts:84 |
| [`requireAuth`](lib/auth/helpers.ts#L113) | function | lib/auth/helpers.ts:113 |
| [`requireRole`](lib/supabase/server.ts#L111) | function | lib/supabase/server.ts:111 |
| [`requireRole`](lib/auth/helpers.ts#L161) | function | lib/auth/helpers.ts:161 |
| [`requireSuperAdmin`](lib/supabase/server.ts#L102) | function | lib/supabase/server.ts:102 |
| [`requireSuperAdmin`](lib/auth/helpers.ts#L144) | function | lib/auth/helpers.ts:144 |
| [`RootLayout`](app/layout.tsx#L28) | function | app/layout.tsx:28 |
| [`runWithAuthContext`](lib/auth/context.ts#L37) | function | lib/auth/context.ts:37 |
| [`sendCertificateAvailableEmail`](lib/email/sender.ts#L158) | function | lib/email/sender.ts:158 |
| [`sendCertificateEmail`](app/actions/emails.tsx#L81) | function | app/actions/emails.tsx:81 |
| [`sendCourseAssignedEmail`](lib/email/sender.ts#L60) | function | lib/email/sender.ts:60 |
| [`sendCourseAssignedEmail`](app/actions/emails.tsx#L47) | function | app/actions/emails.tsx:47 |
| [`sendCourseCompletedEmail`](lib/email/sender.ts#L131) | function | lib/email/sender.ts:131 |
| [`sendCourseReminderEmail`](app/actions/emails.tsx#L154) | function | app/actions/emails.tsx:154 |
| [`sendDeadlineApproachingEmail`](lib/email/sender.ts#L98) | function | lib/email/sender.ts:98 |
| [`sendEmail`](lib/email/resend.ts#L24) | function | lib/email/resend.ts:24 |
| [`sendPasswordResetEmail`](app/actions/emails.tsx#L121) | function | app/actions/emails.tsx:121 |
| [`sendWelcomeEmail`](lib/email/sender.ts#L39) | function | lib/email/sender.ts:39 |
| [`sendWelcomeEmail`](app/actions/emails.tsx#L21) | function | app/actions/emails.tsx:21 |
| [`setAuthContext`](lib/auth/context.ts#L26) | function | lib/auth/context.ts:26 |
| [`setLocale`](lib/i18n/index.ts#L26) | function | lib/i18n/index.ts:26 |
| [`ShareCertificateButton`](components/certificates/share-button.tsx#L10) | function | components/certificates/share-button.tsx:10 |
| [`signIn`](app/actions/auth.ts#L38) | function | app/actions/auth.ts:38 |
| [`SignInInput`](lib/validators/auth.schema.ts#L116) | type | lib/validators/auth.schema.ts:116 |
| [`SignInResult`](lib/services/auth.service.ts#L24) | interface | lib/services/auth.service.ts:24 |
| [`signOut`](app/actions/auth.ts#L89) | function | app/actions/auth.ts:89 |
| [`signUp`](app/actions/auth.ts#L110) | function | app/actions/auth.ts:110 |
| [`SignUpInput`](lib/validators/auth.schema.ts#L117) | type | lib/validators/auth.schema.ts:117 |
| [`SignUpResult`](lib/services/auth.service.ts#L30) | interface | lib/services/auth.service.ts:30 |
| [`Skeleton`](components/ui/skeleton.tsx#L5) | function | components/ui/skeleton.tsx:5 |
| [`SkipLink`](components/ui/skip-link.tsx#L12) | function | components/ui/skip-link.tsx:12 |
| [`startQuizAttempt`](app/actions/quiz-attempts.ts#L98) | function | app/actions/quiz-attempts.ts:98 |
| [`submitQuizAttempt`](app/actions/quiz-attempts.ts#L168) | function | app/actions/quiz-attempts.ts:168 |
| [`SuspenseWrapper`](components/ui/suspense-wrapper.tsx#L11) | function | components/ui/suspense-wrapper.tsx:11 |
| [`TenantFormData`](lib/supabase/tenants.ts#L10) | interface | lib/supabase/tenants.ts:10 |
| [`TenantUser`](lib/types/database.ts#L51) | interface | lib/types/database.ts:51 |
| [`TranslationKey`](lib/i18n/translations.ts#L272) | type | lib/i18n/translations.ts:272 |
| [`unlockNextCourseInPath`](app/actions/path-assignments.ts#L136) | function | app/actions/path-assignments.ts:136 |
| [`unmaskCNPJ`](lib/utils/cnpj.ts#L34) | function | lib/utils/cnpj.ts:34 |
| [`updateCourse`](app/actions/courses.ts#L274) | function | app/actions/courses.ts:274 |
| [`updateLearningPath`](app/actions/learning-paths.ts#L191) | function | app/actions/learning-paths.ts:191 |
| [`updateLesson`](app/actions/lessons.ts#L75) | function | app/actions/lessons.ts:75 |
| [`updateLessonProgress`](app/actions/progress.ts#L11) | function | app/actions/progress.ts:11 |
| [`updateLessonProgressClient`](app/actions/lesson-client.ts#L5) | function | app/actions/lesson-client.ts:5 |
| [`updateModule`](app/actions/modules.ts#L73) | function | app/actions/modules.ts:73 |
| [`updateNotificationPreferences`](app/actions/notifications.ts#L247) | function | app/actions/notifications.ts:247 |
| [`updateOrganization`](app/actions/organizations.ts#L130) | function | app/actions/organizations.ts:130 |
| [`updateOrganizationCourseAccess`](app/actions/organization-courses.ts#L427) | function | app/actions/organization-courses.ts:427 |
| [`updateProfile`](app/actions/profile.ts#L11) | function | app/actions/profile.ts:11 |
| [`updateQuestion`](app/actions/quizzes.ts#L190) | function | app/actions/quizzes.ts:190 |
| [`updateQuiz`](app/actions/quizzes.ts#L113) | function | app/actions/quizzes.ts:113 |
| [`updateTenant`](lib/supabase/tenants.ts#L130) | function | lib/supabase/tenants.ts:130 |
| [`updateTenantAction`](app/(admin)/admin/tenants/[id]/edit/page.tsx#L33) | function | app/(admin)/admin/tenants/[id]/edit/page.tsx:33 |
| [`uploadAvatar`](app/actions/profile.ts#L36) | function | app/actions/profile.ts:36 |
| [`uploadFile`](app/actions/storage.ts#L49) | function | app/actions/storage.ts:49 |
| [`uploadImage`](app/actions/storage.ts#L9) | function | app/actions/storage.ts:9 |
| [`uploadKnowledgeSource`](app/actions/ai-admin.ts#L69) | function | app/actions/ai-admin.ts:69 |
| [`User`](lib/types/database.ts#L35) | interface | lib/types/database.ts:35 |
| [`UserActivityStats`](app/actions/reports.ts#L235) | interface | app/actions/reports.ts:235 |
| [`UserAnswer`](lib/types/database.ts#L300) | interface | lib/types/database.ts:300 |
| [`UserCourseProgress`](lib/types/database.ts#L260) | interface | lib/types/database.ts:260 |
| [`UserFilters`](lib/types/database.ts#L478) | interface | lib/types/database.ts:478 |
| [`UserFiltersInput`](lib/validators/user.schema.ts#L81) | type | lib/validators/user.schema.ts:81 |
| [`UserIdInput`](lib/validators/user.schema.ts#L82) | type | lib/validators/user.schema.ts:82 |
| [`UserLessonProgress`](lib/types/database.ts#L273) | interface | lib/types/database.ts:273 |
| [`UserNote`](lib/types/database.ts#L322) | interface | lib/types/database.ts:322 |
| [`UserPathAssignment`](lib/types/database.ts#L247) | interface | lib/types/database.ts:247 |
| [`UserQuizAttempt`](lib/types/database.ts#L285) | interface | lib/types/database.ts:285 |
| [`UserQuizAttemptWithAnswers`](lib/types/database.ts#L371) | interface | lib/types/database.ts:371 |
| [`UserRole`](lib/types/database.ts#L5) | type | lib/types/database.ts:5 |
| [`UserService`](lib/services/user.service.ts#L52) | class | lib/services/user.service.ts:52 |
| [`UserServiceError`](lib/services/user.service.ts#L37) | class | lib/services/user.service.ts:37 |
| [`useTranslations`](hooks/use-translations.ts#L6) | function | hooks/use-translations.ts:6 |
| [`validateCourseCreate`](lib/validators/course.schema.ts#L137) | function | lib/validators/course.schema.ts:137 |
| [`validateCourseFilters`](lib/validators/course.schema.ts#L158) | function | lib/validators/course.schema.ts:158 |
| [`validateCourseUpdate`](lib/validators/course.schema.ts#L145) | function | lib/validators/course.schema.ts:145 |
| [`validateCreateUser`](lib/validators/auth.schema.ts#L149) | function | lib/validators/auth.schema.ts:149 |
| [`validateLessonCreate`](lib/validators/content.schema.ts#L137) | function | lib/validators/content.schema.ts:137 |
| [`validateLessonUpdate`](lib/validators/content.schema.ts#L141) | function | lib/validators/content.schema.ts:141 |
| [`validateModuleCreate`](lib/validators/content.schema.ts#L119) | function | lib/validators/content.schema.ts:119 |
| [`validateModuleUpdate`](lib/validators/content.schema.ts#L123) | function | lib/validators/content.schema.ts:123 |
| [`validateOrganizationFilters`](lib/validators/organization.schema.ts#L115) | function | lib/validators/organization.schema.ts:115 |
| [`validateOrganizationUpdate`](lib/validators/organization.schema.ts#L125) | function | lib/validators/organization.schema.ts:125 |
| [`validateQuestionCreate`](lib/validators/quiz.schema.ts#L179) | function | lib/validators/quiz.schema.ts:179 |
| [`validateQuestionUpdate`](lib/validators/quiz.schema.ts#L183) | function | lib/validators/quiz.schema.ts:183 |
| [`validateQuizCreate`](lib/validators/quiz.schema.ts#L165) | function | lib/validators/quiz.schema.ts:165 |
| [`validateQuizUpdate`](lib/validators/quiz.schema.ts#L169) | function | lib/validators/quiz.schema.ts:169 |
| [`validateReorderLessons`](lib/validators/content.schema.ts#L151) | function | lib/validators/content.schema.ts:151 |
| [`validateReorderModules`](lib/validators/content.schema.ts#L133) | function | lib/validators/content.schema.ts:133 |
| [`validateReorderQuestions`](lib/validators/quiz.schema.ts#L193) | function | lib/validators/quiz.schema.ts:193 |
| [`validateSignIn`](lib/validators/auth.schema.ts#L128) | function | lib/validators/auth.schema.ts:128 |
| [`validateSignUp`](lib/validators/auth.schema.ts#L135) | function | lib/validators/auth.schema.ts:135 |
| [`validateUserFilters`](lib/validators/user.schema.ts#L91) | function | lib/validators/user.schema.ts:91 |
| [`validateUserId`](lib/validators/user.schema.ts#L105) | function | lib/validators/user.schema.ts:105 |

## Internal System Boundaries

Document seams between domains, bounded contexts, or service ownership. Note data ownership, synchronization strategies, and shared contract enforcement.

## External Service Dependencies

List SaaS platforms, third-party APIs, or infrastructure services the system relies on. Describe authentication methods, rate limits, and failure considerations for each dependency.

## Key Decisions & Trade-offs

Summarize architectural decisions, experiments, or ADR outcomes that shape the current design. Reference supporting documents and explain why selected approaches won over alternatives.

## Diagrams

Link architectural diagrams or add mermaid definitions here.

## Risks & Constraints

Document performance constraints, scaling considerations, or external system assumptions.

## Top Directories Snapshot
- `ACCESSIBILITY.md/` — approximately 1 files
- `ADD_SERVICE_ROLE_KEY.md/` — approximately 1 files
- `AGENTES_DISPONIVEIS.md/` — approximately 1 files
- `APLICAR_SCHEMA_NOVO_PROJETO.md/` — approximately 1 files
- `app/` — approximately 96 files
- `AUDITORIA_AUTENTICACAO_COMPLETA.md/` — approximately 1 files
- `AUDITORIA_FINAL.md/` — approximately 1 files
- `AUDITORIA_SUPABASE.md/` — approximately 1 files
- `AUTH_SYSTEM.md/` — approximately 1 files
- `BUG_INVESTIGATION_REPORT.md/` — approximately 1 files
- `CERTIFICATES_SETUP.md/` — approximately 1 files
- `CHECKLIST_ENTREGA.md/` — approximately 1 files
- `COMO_VERIFICAR_SUPERADMIN.md/` — approximately 1 files
- `components/` — approximately 89 files
- `components.json/` — approximately 1 files
- `CORRIGIR_OAUTH_URLS.md/` — approximately 1 files
- `CORRIGIR_REDIRECT_LOCALHOST.md/` — approximately 1 files
- `CURSOR_MCP_SETUP.md/` — approximately 1 files
- `data/` — approximately 1 files
- `DIAGNOSTICO_CRIACAO_USUARIOS.md/` — approximately 1 files
- `DIAGNOSTICO_ERRO_GOOGLE_OAUTH.md/` — approximately 1 files
- `DIAGNOSTICO_LOGIN.md/` — approximately 1 files
- `DIAGNOSTICO_OAUTH_BLOQUEADO.md/` — approximately 1 files
- `DIAGNOSTICO_OAUTH_PRODUCAO.md/` — approximately 1 files
- `DOCUMENTACAO_TECNICA.md/` — approximately 1 files
- `env.example/` — approximately 1 files
- `ERROR_FLOW_ANALYSIS.md/` — approximately 1 files
- `FLUXO_POS_AUTENTICACAO.md/` — approximately 1 files
- `FORMATOS_UPLOAD.md/` — approximately 1 files
- `FUNCIONALIDADES_AVANCADAS.md/` — approximately 1 files
- `GOOGLE_OAUTH_ATUALIZAR_URLS_NOVO_PROJETO.md/` — approximately 1 files
- `GOOGLE_OAUTH_DIAGNOSTICO.md/` — approximately 1 files
- `GOOGLE_OAUTH_RECRIAR_CLIENTE.md/` — approximately 1 files
- `GOOGLE_OAUTH_SETUP_COMPLETO.md/` — approximately 1 files
- `GOOGLE_OAUTH_SETUP_SIMPLIFICADO.md/` — approximately 1 files
- `GOOGLE_OAUTH_SETUP.md/` — approximately 1 files
- `GOOGLE_OAUTH_URLS_CORRETAS.md/` — approximately 1 files
- `GUIA_RECRIACAO_SUPABASE.md/` — approximately 1 files
- `hooks/` — approximately 1 files
- `I18N_SETUP.md/` — approximately 1 files
- `IMAGE_OPTIMIZATION.md/` — approximately 1 files
- `lib/` — approximately 58 files
- `MIDDLEWARE_FIX.md/` — approximately 1 files
- `middleware.ts/` — approximately 1 files
- `MIGRACOES_ESSENCIAIS.md/` — approximately 1 files
- `MULTI_TENANCY_SETUP.md/` — approximately 1 files
- `NEXT_STEPS.md/` — approximately 1 files
- `next-env.d.ts/` — approximately 1 files
- `next.config.js/` — approximately 1 files
- `package-lock.json/` — approximately 1 files
- `package.json/` — approximately 1 files
- `PERFORMANCE_OPTIMIZATIONS.md/` — approximately 1 files
- `PLANEJAMENTO_ADMIN.md/` — approximately 1 files
- `PLANEJAMENTO_CURSOS_TENANT.md/` — approximately 1 files
- `PLANO_DESENVOLVIMENTO_TECNICO.md/` — approximately 1 files
- `PLANO_FINALIZACAO_NESS.md/` — approximately 1 files
- `PLANO_IMPLEMENTACAO_COMPLETO.md/` — approximately 1 files
- `PLANO_LIMPEZA.md/` — approximately 1 files
- `playwright.config.ts/` — approximately 1 files
- `postcss.config.js/` — approximately 1 files
- `public/` — approximately 1 files
- `QUERY_OPTIMIZATION_OPPORTUNITIES.md/` — approximately 1 files
- `README.md/` — approximately 1 files
- `RECRIAR_CONTA_USUARIO.md/` — approximately 1 files
- `REFACTORING_AUTH.md/` — approximately 1 files
- `REFACTORING_IMPLEMENTATION.md/` — approximately 1 files
- `REFACTORING_PLAN.md/` — approximately 1 files
- `REFACTORING_STATUS.md/` — approximately 1 files
- `REFACTORING_SUMMARY.md/` — approximately 1 files
- `REMOVE_AUTH.md/` — approximately 1 files
- `RESEND_SETUP.md/` — approximately 1 files
- `RLS_RECURSION_FIX.md/` — approximately 1 files
- `scripts/` — approximately 20 files
- `SETUP_COMPLETE.md/` — approximately 1 files
- `SETUP_DATABASE.md/` — approximately 1 files
- `SETUP_NOVO_PROJETO.md/` — approximately 1 files
- `SPEC_PLANNING_COMPLETO.md/` — approximately 1 files
- `STATUS_DESENVOLVIMENTO.md/` — approximately 1 files
- `STATUS_PROJETO.md/` — approximately 1 files
- `tailwind.config.ts/` — approximately 1 files
- `TESTING_CHECKLIST.md/` — approximately 1 files
- `TESTING_SETUP.md/` — approximately 1 files
- `tests/` — approximately 7 files
- `TOAST_NOTIFICATIONS.md/` — approximately 1 files
- `TROUBLESHOOTING_LOGIN_USUARIO.md/` — approximately 1 files
- `TROUBLESHOOTING_LOGIN.md/` — approximately 1 files
- `tsconfig.json/` — approximately 1 files
- `tsconfig.tsbuildinfo/` — approximately 1 files
- `UX_UI_GUIDELINES.md/` — approximately 1 files
- `VERCEL_ENV_SETUP.md/` — approximately 1 files
- `VERCEL_SETUP.md/` — approximately 1 files
- `VERIFICAR_OAUTH_CONSENT_SCREEN.md/` — approximately 1 files
- `VERIFICAR_REDIRECT_URL.md/` — approximately 1 files
- `vitest.config.ts/` — approximately 1 files
- `vitest.setup.ts/` — approximately 1 files

## Related Resources

- [Project Overview](./project-overview.md)
- Update [agents/README.md](../agents/README.md) when architecture changes.

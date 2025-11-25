// ============================================================================
// Database Types - Generated from Supabase Schema
// ============================================================================

export type UserRole = 'platform_admin' | 'org_manager' | 'student';
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type ContentType = 'video' | 'text' | 'pdf' | 'quiz' | 'embed';
export type QuestionType = 'multiple_choice' | 'true_false' | 'scenario';
export type AssignmentStatus = 'not_started' | 'in_progress' | 'completed' | 'overdue';
export type CourseStatus = 'draft' | 'published' | 'archived';

// ============================================================================
// Database Tables
// ============================================================================

export interface Organization {
    id: string;
    name: string;
    slug: string;
    cnpj: string | null;
    razao_social: string | null;
    industry: string | null;
    employee_count: number | null;
    logo_url: string | null;
    settings: Record<string, any>;
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
    subscription_status: string | null;
    max_users: number;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    role: UserRole;
    organization_id: string | null;
    department: string | null;
    job_title: string | null;
    is_active: boolean;
    is_superadmin: boolean;
    last_login_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface TenantUser {
    tenant_id: string;
    user_id: string;
    role: string;
    joined_at: string;
}

// ============================================================================
// Organization Courses System Types
// ============================================================================

export type CourseAccessType = 'licensed' | 'unlimited' | 'trial';
export type AssignmentType = 'manual' | 'auto' | 'mandatory';

export interface OrganizationCourseAccess {
    id: string;
    organization_id: string;
    course_id: string;
    access_type: CourseAccessType;
    total_licenses: number | null;
    used_licenses: number;
    valid_from: string;
    valid_until: string | null;
    is_mandatory: boolean;
    auto_enroll: boolean;
    allow_certificate: boolean;
    custom_title: string | null;
    custom_description: string | null;
    custom_thumbnail_url: string | null;
    custom_settings: Record<string, any>;
    assigned_by: string | null;
    assigned_at: string;
    created_at: string;
    updated_at: string;
}

export interface CourseCustomization {
    id: string;
    organization_id: string;
    course_id: string;
    custom_modules: any | null; // JSONB
    custom_lessons: any | null; // JSONB
    custom_branding: Record<string, any>;
    completion_requirements: Record<string, any>;
    certificate_template_id: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface OrganizationCourseAssignment {
    id: string;
    organization_id: string;
    course_id: string;
    user_id: string;
    assignment_type: AssignmentType;
    is_mandatory: boolean;
    deadline: string | null;
    notify_on_deadline: boolean;
    assigned_by: string | null;
    assigned_at: string;
    started_at: string | null;
    completed_at: string | null;
}

export interface CertificateTemplate {
    id: string;
    organization_id: string | null;
    name: string;
    description: string | null;
    design_config: Record<string, any>;
    template_html: string | null;
    template_css: string | null;
    fields: any[]; // JSONB array
    is_active: boolean;
    is_default: boolean;
    created_at: string;
    updated_at: string;
}

export interface Course {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    objectives: string | null;
    thumbnail_url: string | null;
    duration_hours: number | null;
    level: CourseLevel;
    area: string | null;
    status: CourseStatus;
    created_by: string | null;
    organization_id: string | null;
    is_public: boolean;
    course_type?: 'global' | 'organization' | 'customized'; // Novo campo
    base_course_id?: string | null; // Novo campo
    is_certifiable?: boolean; // Novo campo
    min_completion_percentage?: number; // Novo campo
    requires_quiz?: boolean; // Novo campo
    min_quiz_score?: number; // Novo campo
    created_at: string;
    updated_at: string;
    published_at: string | null;
}

export interface Module {
    id: string;
    course_id: string;
    title: string;
    description: string | null;
    order_index: number;
    created_at: string;
    updated_at: string;
}

export interface Lesson {
    id: string;
    module_id: string;
    title: string;
    content_type: ContentType;
    content_url: string | null;
    content_text: string | null;
    duration_minutes: number | null;
    order_index: number;
    is_required: boolean;
    created_at: string;
    updated_at: string;
}

export interface LessonMaterial {
    id: string;
    lesson_id: string;
    title: string;
    file_url: string;
    file_type: string | null;
    file_size_bytes: number | null;
    created_at: string;
}

export interface Quiz {
    id: string;
    course_id: string | null;
    lesson_id: string | null;
    title: string;
    description: string | null;
    passing_score: number;
    max_attempts: number;
    time_limit_minutes: number | null;
    show_correct_answers: boolean;
    created_at: string;
    updated_at: string;
}

export interface QuizQuestion {
    id: string;
    quiz_id: string;
    question_text: string;
    question_type: QuestionType;
    points: number;
    explanation: string | null;
    order_index: number;
    created_at: string;
}

export interface QuestionOption {
    id: string;
    question_id: string;
    option_text: string;
    is_correct: boolean;
    explanation: string | null;
    order_index: number;
    created_at: string;
}

export interface LearningPath {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    estimated_duration_hours: number | null;
    is_mandatory: boolean;
    created_by: string | null;
    organization_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface PathCourse {
    id: string;
    path_id: string;
    course_id: string;
    order_index: number;
    is_required: boolean;
    created_at: string;
}

export interface UserPathAssignment {
    id: string;
    user_id: string;
    path_id: string;
    organization_id: string;
    assigned_by: string | null;
    assigned_at: string;
    deadline: string | null;
    status: AssignmentStatus;
    started_at: string | null;
    completed_at: string | null;
}

export interface UserCourseProgress {
    id: string;
    user_id: string;
    course_id: string;
    status: AssignmentStatus;
    completion_percentage: number;
    started_at: string | null;
    completed_at: string | null;
    last_accessed_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface UserLessonProgress {
    id: string;
    user_id: string;
    lesson_id: string;
    watched_duration_seconds: number;
    last_position_seconds: number;
    is_completed: boolean;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface UserQuizAttempt {
    id: string;
    user_id: string;
    quiz_id: string;
    attempt_number: number;
    score: number | null;
    max_score: number | null;
    percentage: number | null;
    passed: boolean | null;
    started_at: string;
    completed_at: string | null;
    time_taken_seconds: number | null;
    created_at: string;
}

export interface UserAnswer {
    id: string;
    attempt_id: string;
    question_id: string;
    selected_option_id: string | null;
    is_correct: boolean | null;
    points_earned: number;
    answered_at: string;
}

export interface Certificate {
    id: string;
    user_id: string;
    course_id: string;
    verification_code: string;
    issued_at: string;
    expires_at: string | null;
    pdf_url: string | null;
    metadata: Record<string, any>;
    created_at: string;
}

export interface UserNote {
    id: string;
    user_id: string;
    lesson_id: string;
    note_text: string;
    timestamp_seconds: number | null;
    created_at: string;
    updated_at: string;
}

export interface ActivityLog {
    id: string;
    user_id: string | null;
    organization_id: string | null;
    event_type: string;
    event_data: Record<string, any>;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
}

// ============================================================================
// Extended Types with Relations
// ============================================================================

export interface CourseWithModules extends Course {
    modules: ModuleWithLessons[];
}

export interface ModuleWithLessons extends Module {
    lessons: Lesson[];
}

export interface CourseWithProgress extends Course {
    progress?: UserCourseProgress;
}

export interface LearningPathWithCourses extends LearningPath {
    path_courses: (PathCourse & { course: Course })[];
}

export interface QuizWithQuestions extends Quiz {
    quiz_questions: QuizQuestionWithOptions[];
}

export interface QuizQuestionWithOptions extends QuizQuestion {
    question_options: QuestionOption[];
}

export interface UserQuizAttemptWithAnswers extends UserQuizAttempt {
    user_answers: (UserAnswer & {
        question: QuizQuestion;
        selected_option: QuestionOption | null;
    })[];
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// ============================================================================
// Form Types
// ============================================================================

export interface CourseFormData {
    title: string;
    slug: string;
    description: string;
    objectives?: string;
    thumbnail_url?: string | null;
    duration_hours?: number | null;
    level: CourseLevel;
    area?: string;
    status: CourseStatus;
    is_public: boolean;
}

export interface ModuleFormData {
    title: string;
    description: string;
    order_index: number;
}

export interface LessonFormData {
    title: string;
    content_type: ContentType;
    content_url?: string;
    content_text?: string;
    duration_minutes?: number;
    order_index: number;
    is_required: boolean;
}

export interface QuizFormData {
    title: string;
    description: string;
    passing_score: number;
    max_attempts: number;
    time_limit_minutes?: number;
    show_correct_answers: boolean;
}

export interface QuestionFormData {
    question_text: string;
    question_type: QuestionType;
    points: number;
    explanation?: string;
    order_index: number;
    options: OptionFormData[];
}

export interface OptionFormData {
    option_text: string;
    is_correct: boolean;
    explanation?: string;
    order_index: number;
}

export interface LearningPathFormData {
    title: string;
    slug: string;
    description: string;
    estimated_duration_hours: number;
    is_mandatory: boolean;
    course_ids: string[];
}

// ============================================================================
// Filter Types
// ============================================================================

export interface CourseFilters {
    area?: string;
    level?: CourseLevel;
    status?: CourseStatus;
    search?: string;
    is_public?: boolean;
}

export interface UserFilters {
    organization_id?: string;
    role?: UserRole;
    department?: string;
    is_active?: boolean;
    search?: string;
}

export interface ProgressFilters {
    user_id?: string;
    course_id?: string;
    status?: AssignmentStatus;
    organization_id?: string;
}

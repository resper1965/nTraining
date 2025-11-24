'use server';

import { createClient, getCurrentUser, requireRole } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type {
    Course,
    CourseWithModules,
    CourseWithProgress,
    CourseFilters,
    CourseFormData
} from '@/lib/types/database';

// ============================================================================
// GET COURSES
// ============================================================================

export async function getCourses(filters?: CourseFilters, userId?: string) {
    const supabase = createClient();
    const user = userId ? await getUserById(userId) : await getCurrentUser();

    let query = supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

    // Apply filters
    if (filters?.area) {
        query = query.eq('area', filters.area);
    }

    if (filters?.level) {
        query = query.eq('level', filters.level);
    }

    if (filters?.status) {
        query = query.eq('status', filters.status);
    } else {
        // Default: only show published courses for students
        if (user.role === 'student') {
            query = query.eq('status', 'published');
        }
    }

    if (filters?.is_public !== undefined) {
        query = query.eq('is_public', filters.is_public);
    }

    if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) {
        throw new Error(`Failed to fetch courses: ${error.message}`);
    }

    return data as Course[];
}

// ============================================================================
// GET COURSE BY ID
// ============================================================================

export async function getCourseById(courseId: string) {
    const supabase = createClient();
    await requireAuth();

    const { data, error } = await supabase
        .from('courses')
        .select(`
      *,
      modules (
        *,
        lessons (
          *
        )
      )
    `)
        .eq('id', courseId)
        .single();

    if (error) {
        throw new Error(`Failed to fetch course: ${error.message}`);
    }

    return data as CourseWithModules;
}

// ============================================================================
// GET COURSE BY SLUG
// ============================================================================

export async function getCourseBySlug(slug: string) {
    const supabase = createClient();
    await requireAuth();

    const { data, error } = await supabase
        .from('courses')
        .select(`
      *,
      modules (
        *,
        lessons (
          *
        )
      )
    `)
        .eq('slug', slug)
        .single();

    if (error) {
        throw new Error(`Failed to fetch course: ${error.message}`);
    }

    return data as CourseWithModules;
}

// ============================================================================
// GET COURSES WITH PROGRESS
// ============================================================================

export async function getCoursesWithProgress(filters?: CourseFilters) {
    const supabase = createClient();
    const user = await requireAuth();

    const courses = await getCourses(filters);

    // Fetch progress for all courses
    const { data: progressData } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('user_id', user.id);

    // Merge progress with courses
    const coursesWithProgress = courses.map(course => ({
        ...course,
        progress: progressData?.find((p: any) => p.course_id === course.id),
    })) as CourseWithProgress[];

    return coursesWithProgress;
}

// ============================================================================
// CREATE COURSE (Admin only)
// ============================================================================

export async function createCourse(formData: CourseFormData) {
    const supabase = createClient();
    const user = await requireRole('platform_admin');

    const { data, error } = await supabase
        .from('courses')
        .insert({
            ...formData,
            created_by: user.id,
            organization_id: user.organization_id,
        })
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to create course: ${error.message}`);
    }

    revalidatePath('/admin/courses');
    return data as Course;
}

// ============================================================================
// UPDATE COURSE (Admin only)
// ============================================================================

export async function updateCourse(courseId: string, formData: Partial<CourseFormData>) {
    const supabase = createClient();
    await requireRole('platform_admin');

    const { data, error } = await supabase
        .from('courses')
        .update(formData)
        .eq('id', courseId)
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to update course: ${error.message}`);
    }

    revalidatePath('/admin/courses');
    revalidatePath(`/courses/${data.slug}`);
    return data as Course;
}

// ============================================================================
// PUBLISH COURSE (Admin only)
// ============================================================================

export async function publishCourse(courseId: string) {
    const supabase = createClient();
    await requireRole('platform_admin');

    const { data, error } = await supabase
        .from('courses')
        .update({
            status: 'published',
            published_at: new Date().toISOString(),
        })
        .eq('id', courseId)
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to publish course: ${error.message}`);
    }

    revalidatePath('/admin/courses');
    revalidatePath(`/courses/${data.slug}`);
    return data as Course;
}

// ============================================================================
// DELETE COURSE (Admin only)
// ============================================================================

export async function deleteCourse(courseId: string) {
    const supabase = createClient();
    await requireRole('platform_admin');

    const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

    if (error) {
        throw new Error(`Failed to delete course: ${error.message}`);
    }

    revalidatePath('/admin/courses');
    return { success: true };
}

// ============================================================================
// ENROLL IN COURSE
// ============================================================================

export async function enrollInCourse(courseId: string) {
    const supabase = createClient();
    const user = await requireAuth();

    // Check if already enrolled
    const { data: existing } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();

    if (existing) {
        return existing;
    }

    // Create progress record
    const { data, error } = await supabase
        .from('user_course_progress')
        .insert({
            user_id: user.id,
            course_id: courseId,
            status: 'not_started',
            completion_percentage: 0,
        })
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to enroll in course: ${error.message}`);
    }

    revalidatePath('/courses');
    revalidatePath(`/courses/${courseId}`);
    return data;
}

// ============================================================================
// GET COURSE AREAS (for filters)
// ============================================================================

export async function getCourseAreas() {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('courses')
        .select('area')
        .not('area', 'is', null)
        .eq('status', 'published');

    if (error) {
        throw new Error(`Failed to fetch course areas: ${error.message}`);
    }

    // Get unique areas
    const uniqueAreas = [...new Set(data.map((c: any) => c.area).filter(Boolean))];
    return uniqueAreas as string[];
}

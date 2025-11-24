'use server';

import { createClient, requireAuth } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { UserLessonProgress, UserCourseProgress } from '@/lib/types/database';

// ============================================================================
// UPDATE LESSON PROGRESS
// ============================================================================

export async function updateLessonProgress(
    lessonId: string,
    data: {
        watched_duration_seconds?: number;
        last_position_seconds?: number;
        is_completed?: boolean;
    }
) {
    const supabase = createClient();
    const user = await requireAuth();

    // Check if progress exists
    const { data: existing } = await supabase
        .from('user_lesson_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .single();

    let result;

    if (existing) {
        // Update existing progress
        const { data: updated, error } = await supabase
            .from('user_lesson_progress')
            .update({
                ...data,
                completed_at: data.is_completed ? new Date().toISOString() : existing.completed_at,
            })
            .eq('id', existing.id)
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to update lesson progress: ${error.message}`);
        }

        result = updated;
    } else {
        // Create new progress
        const { data: created, error } = await supabase
            .from('user_lesson_progress')
            .insert({
                user_id: user.id,
                lesson_id: lessonId,
                ...data,
                completed_at: data.is_completed ? new Date().toISOString() : null,
            })
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to create lesson progress: ${error.message}`);
        }

        result = created;
    }

    // Update course progress
    await updateCourseProgressFromLessons(lessonId);

    return result as UserLessonProgress;
}

// ============================================================================
// MARK LESSON COMPLETE
// ============================================================================

export async function markLessonComplete(lessonId: string) {
    return updateLessonProgress(lessonId, { is_completed: true });
}

// ============================================================================
// GET LESSON PROGRESS
// ============================================================================

export async function getLessonProgress(lessonId: string) {
    const supabase = createClient();
    const user = await requireAuth();

    const { data, error } = await supabase
        .from('user_lesson_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .single();

    if (error && error.code !== 'PGRST116') {
        // PGRST116 is "not found" - that's ok
        throw new Error(`Failed to fetch lesson progress: ${error.message}`);
    }

    return data as UserLessonProgress | null;
}

// ============================================================================
// GET COURSE PROGRESS
// ============================================================================

export async function getCourseProgress(courseId: string) {
    const supabase = createClient();
    const user = await requireAuth();

    const { data, error } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();

    if (error && error.code !== 'PGRST116') {
        throw new Error(`Failed to fetch course progress: ${error.message}`);
    }

    return data as UserCourseProgress | null;
}

// ============================================================================
// UPDATE COURSE PROGRESS (Internal helper)
// ============================================================================

async function updateCourseProgressFromLessons(lessonId: string) {
    const supabase = createClient();
    const user = await requireAuth();

    // Get the course for this lesson
    const { data: lesson } = await supabase
        .from('lessons')
        .select('module_id, modules(course_id)')
        .eq('id', lessonId)
        .single();

    if (!lesson) return;

    const courseId = (lesson.modules as any).course_id;

    // Get all required lessons in the course
    const { data: allLessons } = await supabase
        .from('lessons')
        .select('id')
        .eq('module_id', lesson.module_id)
        .eq('is_required', true);

    if (!allLessons || allLessons.length === 0) return;

    // Get completed lessons
    const { data: completedLessons } = await supabase
        .from('user_lesson_progress')
        .select('lesson_id')
        .eq('user_id', user.id)
        .eq('is_completed', true)
        .in('lesson_id', allLessons.map((l: any) => l.id));

    const totalLessons = allLessons.length;
    const completedCount = completedLessons?.length || 0;
    const completionPercentage = Math.round((completedCount / totalLessons) * 100);

    // Check if course is completed
    const isCompleted = completionPercentage === 100;

    // Update or create course progress
    const { data: existingProgress } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();

    if (existingProgress) {
        await supabase
            .from('user_course_progress')
            .update({
                completion_percentage: completionPercentage,
                status: isCompleted ? 'completed' : 'in_progress',
                completed_at: isCompleted ? new Date().toISOString() : null,
                last_accessed_at: new Date().toISOString(),
            })
            .eq('id', existingProgress.id);
    } else {
        await supabase
            .from('user_course_progress')
            .insert({
                user_id: user.id,
                course_id: courseId,
                completion_percentage: completionPercentage,
                status: isCompleted ? 'completed' : 'in_progress',
                started_at: new Date().toISOString(),
                completed_at: isCompleted ? new Date().toISOString() : null,
                last_accessed_at: new Date().toISOString(),
            });
    }

    revalidatePath(`/courses/${courseId}`);
}

// ============================================================================
// GET USER'S ALL PROGRESS
// ============================================================================

export async function getUserProgress() {
    const supabase = createClient();
    // requireAuth() will redirect if not authenticated
    const user = await requireAuth();

    const { data, error } = await supabase
        .from('user_course_progress')
        .select(`
      *,
      courses (
        id,
        title,
        slug,
        thumbnail_url,
        duration_hours,
        level,
        area
      )
    `)
        .eq('user_id', user.id)
        .order('last_accessed_at', { ascending: false });

    if (error) {
        throw new Error(`Failed to fetch user progress: ${error.message}`);
    }

    return data;
}

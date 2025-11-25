'use server';

import { createClient } from '@/lib/supabase/server';
import { requireAuth, requireRole } from '@/lib/supabase/server';
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

export async function getCourses(filters?: CourseFilters) {
    const supabase = createClient();
    const user = await requireAuth();

    // Se superadmin, pode ver todos os cursos
    if (user.is_superadmin) {
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
            query = query.eq('status', 'published');
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

    // Para usuários normais, buscar apenas cursos disponíveis para sua organização
    if (!user.organization_id) {
        return []; // Sem organização, sem cursos
    }

    // Buscar cursos disponíveis para a organização via organization_course_access
    let accessQuery = supabase
        .from('organization_course_access')
        .select(`
            *,
            courses (
                *
            )
        `)
        .eq('organization_id', user.organization_id)
        .or('valid_until.is.null,valid_until.gt.now()'); // Apenas cursos válidos

    // Se há filtro de status, aplicar no curso
    if (filters?.status) {
        accessQuery = accessQuery.eq('courses.status', filters.status);
    } else {
        accessQuery = accessQuery.eq('courses.status', 'published');
    }

    const { data: accessData, error: accessError } = await accessQuery;

    if (accessError) {
        throw new Error(`Failed to fetch organization courses: ${accessError.message}`);
    }

    // Extrair cursos e aplicar filtros adicionais
    let courses = (accessData || [])
        .map((access: any) => access.courses)
        .filter((course: any) => course !== null) as Course[];

    // Aplicar filtros restantes
    if (filters?.area) {
        courses = courses.filter((c) => c.area === filters.area);
    }

    if (filters?.level) {
        courses = courses.filter((c) => c.level === filters.level);
    }

    if (filters?.is_public !== undefined) {
        courses = courses.filter((c) => c.is_public === filters.is_public);
    }

    if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        courses = courses.filter(
            (c) =>
                c.title?.toLowerCase().includes(searchLower) ||
                c.description?.toLowerCase().includes(searchLower)
        );
    }

    return courses;
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

    if (courses.length === 0) {
        return [];
    }

    // Fetch progress for all courses
    const { data: progressData } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('user_id', user.id)
        .in('course_id', courses.map((c) => c.id));

    // Buscar informações de acesso da organização (para personalizações)
    let accessData: any[] = [];
    if (user.organization_id) {
        const { data } = await supabase
            .from('organization_course_access')
            .select('*')
            .eq('organization_id', user.organization_id)
            .in('course_id', courses.map((c) => c.id));

        accessData = data || [];
    }

    // Merge progress with courses e aplicar personalizações
    const coursesWithProgress = courses.map((course) => {
        const progress = progressData?.find((p: any) => p.course_id === course.id);
        const access = accessData.find((a: any) => a.course_id === course.id);

        // Aplicar personalizações se houver
        const displayTitle = access?.custom_title || course.title;
        const displayDescription = access?.custom_description || course.description;
        const displayThumbnail = access?.custom_thumbnail_url || course.thumbnail_url;

        return {
            ...course,
            title: displayTitle,
            description: displayDescription,
            thumbnail_url: displayThumbnail,
            progress: progress || undefined,
            access: access || undefined,
        };
    }) as CourseWithProgress[];

    return coursesWithProgress;
}

// ============================================================================
// CREATE COURSE (Admin only)
// ============================================================================

export async function createCourse(formData: CourseFormData) {
    const supabase = createClient();
    const user = await requireRole('platform_admin');

    // Preparar dados para inserção (permitir campos opcionais)
    const insertData: any = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description || null,
        objectives: formData.objectives || null,
        level: formData.level,
        area: formData.area || null,
        duration_hours: formData.duration_hours || null,
        status: formData.status,
        is_public: formData.is_public,
        created_by: user.id,
        organization_id: user.organization_id || null,
    }

    const { data, error } = await supabase
        .from('courses')
        .insert(insertData)
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

    // Verificar se curso está disponível para a organização do usuário
    if (user.organization_id) {
        const { data: access, error: accessError } = await supabase
            .from('organization_course_access')
            .select('*')
            .eq('organization_id', user.organization_id)
            .eq('course_id', courseId)
            .single();

        if (accessError || !access) {
            throw new Error('Curso não disponível para sua organização');
        }

        // Verificar validade
        if (access.valid_until && new Date(access.valid_until) < new Date()) {
            throw new Error('Acesso ao curso expirado');
        }

        // Verificar licenças disponíveis (se não for ilimitado)
        if (access.access_type === 'licensed' && access.total_licenses !== null) {
            if (access.used_licenses >= access.total_licenses) {
                throw new Error('Sem licenças disponíveis. Entre em contato com o administrador.');
            }
        }
    }

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

    // Criar atribuição se não existir
    if (user.organization_id) {
        await supabase
            .from('organization_course_assignments')
            .upsert(
                {
                    organization_id: user.organization_id,
                    course_id: courseId,
                    user_id: user.id,
                    assignment_type: 'manual',
                    is_mandatory: false,
                },
                { onConflict: 'organization_id,course_id,user_id' }
            );
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

'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Certificate } from '@/lib/types/database'
import { getCourseProgress } from './progress'
import { getCourseById } from './courses'

/**
 * Generate verification code for certificate
 */
function generateVerificationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 12; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code.match(/.{1,4}/g)?.join('-') || code
}

/**
 * Check if user has completed course requirements
 */
async function checkCourseCompletionRequirements(
  courseId: string,
  userId: string
): Promise<boolean> {
  const supabase = createClient()

  // Get course details
  const course = await getCourseById(courseId)
  
  // Get course progress
  const progress = await getCourseProgress(courseId)

  if (!progress) {
    return false
  }

  // Check minimum completion percentage
  const minCompletion = course.min_completion_percentage || 100
  if (progress.completion_percentage < minCompletion) {
    return false
  }

  // Check if quiz is required and passed
  if (course.requires_quiz) {
    // Get quiz for this course (if exists)
    const { data: quiz } = await supabase
      .from('quizzes')
      .select('id, passing_score')
      .eq('course_id', courseId)
      .single()

    if (quiz) {
      // Get user's quiz attempts
      const { data: attempts } = await supabase
        .from('user_quiz_attempts')
        .select('score')
        .eq('user_id', userId)
        .eq('quiz_id', quiz.id)
        .order('created_at', { ascending: false })
        .limit(1)

      if (!attempts || attempts.length === 0) {
        return false
      }

      const lastAttempt = attempts[0]
      const minScore = course.min_quiz_score || quiz.passing_score || 70

      if (lastAttempt.score < minScore) {
        return false
      }
    }
  }

  return true
}

/**
 * Generate certificate for completed course
 */
export async function generateCertificate(courseId: string) {
  const supabase = createClient()
  const user = await requireAuth()

  // Check if certificate already exists
  const { data: existing } = await supabase
    .from('certificates')
    .select('*')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .single()

  if (existing) {
    return existing as Certificate
  }

  // Check if course is certifiable
  const course = await getCourseById(courseId)
  if (!course.is_certifiable) {
    throw new Error('Este curso não emite certificado')
  }

  // Check completion requirements
  const isComplete = await checkCourseCompletionRequirements(courseId, user.id)
  if (!isComplete) {
    throw new Error('Você ainda não completou os requisitos para receber o certificado')
  }

  // Generate verification code
  const verificationCode = generateVerificationCode()

  // Create certificate record
  const { data: certificate, error } = await supabase
    .from('certificates')
    .insert({
      user_id: user.id,
      course_id: courseId,
      organization_id: user.organization_id || null,
      verification_code: verificationCode,
      issued_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Erro ao gerar certificado: ${error.message}`)
  }

  // Generate PDF (will be implemented in next task)
  // const pdfUrl = await generateCertificatePDF(certificate as Certificate)

  // Criar notificação de certificado disponível
  try {
    const { notifyCertificateAvailable } = await import('@/lib/notifications/triggers')
    await notifyCertificateAvailable(
      user.id,
      course.title,
      certificate.id
    )
  } catch (notifError) {
    // Não falhar a geração se a notificação falhar
    console.error('Error creating certificate notification:', notifError)
  }

  revalidatePath('/certificates')
  revalidatePath(`/courses/${course.slug}`)

  return certificate as Certificate
}

/**
 * Get user's certificates
 */
export async function getUserCertificates() {
  const supabase = createClient()
  const user = await requireAuth()

  const { data, error } = await supabase
    .from('certificates')
    .select(`
      *,
      courses (
        id,
        title,
        slug,
        thumbnail_url,
        duration_hours,
        area
      )
    `)
    .eq('user_id', user.id)
    .order('issued_at', { ascending: false })

  if (error) {
    throw new Error(`Erro ao buscar certificados: ${error.message}`)
  }

  return data
}

/**
 * Get certificate by verification code (public)
 */
export async function getCertificateByVerificationCode(code: string) {
  const supabase = createClient()

  // Remove dashes from code for search
  const cleanCode = code.replace(/-/g, '')

  const { data, error } = await supabase
    .from('certificates')
    .select(`
      *,
      users (
        id,
        full_name,
        email
      ),
      courses (
        id,
        title,
        slug,
        description,
        duration_hours,
        area
      ),
      organizations (
        id,
        name,
        cnpj,
        razao_social
      )
    `)
    .eq('verification_code', code)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

/**
 * Get certificate by ID (for authenticated user)
 */
export async function getCertificateById(certificateId: string) {
  const supabase = createClient()
  const user = await requireAuth()

  const { data, error } = await supabase
    .from('certificates')
    .select(`
      *,
      courses (
        id,
        title,
        slug,
        thumbnail_url,
        duration_hours,
        area
      )
    `)
    .eq('id', certificateId)
    .eq('user_id', user.id)
    .single()

  if (error) {
    throw new Error(`Erro ao buscar certificado: ${error.message}`)
  }

  return data as Certificate & { courses: any }
}


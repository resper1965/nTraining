#!/usr/bin/env tsx
/**
 * Script para importar cursos no banco de dados nTraining
 *
 * Uso:
 *   npx tsx scripts/import-course.ts --file data/secops-course.json
 *   npx tsx scripts/import-course.ts --seed (executa seed.sql básico)
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas')
  console.error('Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

interface CourseData {
  course: {
    title: string
    slug: string
    description: string
    objectives?: string
    duration_hours?: number
    level: 'iniciante' | 'intermediario' | 'avancado'
    area?: string
    status: 'draft' | 'published'
    is_public: boolean
    is_certifiable?: boolean
    thumbnail_url?: string
  }
  modules: Array<{
    title: string
    description?: string
    order_index: number
    lessons: Array<{
      title: string
      content_type: 'text' | 'video' | 'file' | 'embed'
      content_text?: string
      content_url?: string
      duration_minutes?: number
      order_index: number
      is_required?: boolean
    }>
  }>
  quizzes?: Array<{
    title: string
    description?: string
    passing_score: number
    max_attempts?: number
    questions: Array<{
      question_text: string
      question_type: 'multiple_choice' | 'true_false' | 'short_answer'
      points: number
      explanation?: string
      order_index: number
      options: Array<{
        option_text: string
        is_correct: boolean
        order_index: number
      }>
    }>
  }>
}

async function importCourse(courseData: CourseData, organizationId?: string) {
  console.log(`📚 Importando curso: ${courseData.course.title}`)

  try {
    // 1. Criar o curso
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert({
        ...courseData.course,
        organization_id: organizationId || null,
        created_by: null,
      })
      .select()
      .single()

    if (courseError) {
      throw new Error(`Erro ao criar curso: ${courseError.message}`)
    }

    console.log(`✅ Curso criado: ${course.id}`)

    // 2. Criar módulos e aulas
    for (const moduleData of courseData.modules) {
      const { data: module, error: moduleError } = await supabase
        .from('modules')
        .insert({
          course_id: course.id,
          title: moduleData.title,
          description: moduleData.description,
          order_index: moduleData.order_index,
        })
        .select()
        .single()

      if (moduleError) {
        throw new Error(`Erro ao criar módulo: ${moduleError.message}`)
      }

      console.log(`  ✅ Módulo criado: ${module.title}`)

      // Criar aulas do módulo
      for (const lessonData of moduleData.lessons) {
        const { error: lessonError } = await supabase
          .from('lessons')
          .insert({
            module_id: module.id,
            title: lessonData.title,
            content_type: lessonData.content_type,
            content_text: lessonData.content_text,
            content_url: lessonData.content_url,
            duration_minutes: lessonData.duration_minutes,
            order_index: lessonData.order_index,
            is_required: lessonData.is_required ?? true,
          })

        if (lessonError) {
          throw new Error(`Erro ao criar aula: ${lessonError.message}`)
        }

        console.log(`    ✅ Aula criada: ${lessonData.title}`)
      }
    }

    // 3. Criar quizzes (se houver)
    if (courseData.quizzes) {
      for (const quizData of courseData.quizzes) {
        const { data: quiz, error: quizError } = await supabase
          .from('quizzes')
          .insert({
            course_id: course.id,
            title: quizData.title,
            description: quizData.description,
            passing_score: quizData.passing_score,
            max_attempts: quizData.max_attempts || 3,
          })
          .select()
          .single()

        if (quizError) {
          throw new Error(`Erro ao criar quiz: ${quizError.message}`)
        }

        console.log(`  ✅ Quiz criado: ${quiz.title}`)

        // Criar questões
        for (const questionData of quizData.questions) {
          const { data: question, error: questionError } = await supabase
            .from('quiz_questions')
            .insert({
              quiz_id: quiz.id,
              question_text: questionData.question_text,
              question_type: questionData.question_type,
              points: questionData.points,
              explanation: questionData.explanation,
              order_index: questionData.order_index,
            })
            .select()
            .single()

          if (questionError) {
            throw new Error(`Erro ao criar questão: ${questionError.message}`)
          }

          // Criar opções
          for (const optionData of questionData.options) {
            const { error: optionError } = await supabase
              .from('question_options')
              .insert({
                question_id: question.id,
                option_text: optionData.option_text,
                is_correct: optionData.is_correct,
                order_index: optionData.order_index,
              })

            if (optionError) {
              throw new Error(`Erro ao criar opção: ${optionError.message}`)
            }
          }

          console.log(`    ✅ Questão criada: ${questionData.question_text.substring(0, 50)}...`)
        }
      }
    }

    // 4. Dar acesso à organização ness Security (se organizationId fornecido)
    if (organizationId) {
      const { error: accessError } = await supabase
        .from('organization_course_access')
        .insert({
          organization_id: organizationId,
          course_id: course.id,
          access_type: 'unlimited',
          valid_from: new Date().toISOString(),
          valid_until: null,
        })

      if (accessError) {
        console.warn(`⚠️  Aviso: Não foi possível criar acesso à organização: ${accessError.message}`)
      } else {
        console.log(`✅ Acesso concedido à organização`)
      }
    }

    console.log(`\n🎉 Curso importado com sucesso!`)
    console.log(`   ID: ${course.id}`)
    console.log(`   Slug: ${course.slug}`)
    console.log(`   URL: /courses/${course.slug}`)

    return course
  } catch (error) {
    console.error(`❌ Erro durante importação:`, error)
    throw error
  }
}

async function main() {
  const args = process.argv.slice(2)

  if (args.includes('--seed')) {
    console.log('🌱 Executando seed básico...')
    console.log('⚠️  Nota: Execute o seed.sql diretamente no Supabase SQL Editor')
    console.log('   Arquivo: lib/supabase/seed.sql')
    return
  }

  const fileIndex = args.indexOf('--file')
  if (fileIndex === -1 || !args[fileIndex + 1]) {
    console.error('❌ Erro: Especifique um arquivo JSON com --file')
    console.error('Uso: npx tsx scripts/import-course.ts --file data/course.json')
    process.exit(1)
  }

  const filePath = resolve(process.cwd(), args[fileIndex + 1])

  console.log(`📖 Lendo arquivo: ${filePath}`)
  const fileContent = readFileSync(filePath, 'utf-8')
  const courseData: CourseData = JSON.parse(fileContent)

  // Curso público - não precisa de organização
  await importCourse(courseData, undefined)
}

main().catch((error) => {
  console.error('❌ Erro fatal:', error)
  process.exit(1)
})

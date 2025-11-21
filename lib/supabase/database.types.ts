// ============================================================================
// Database Types for Supabase - Generated from schema.sql
// ============================================================================
// This file should ideally be generated using: npx supabase gen types typescript
// For now, we'll maintain it manually based on the schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          industry: string | null
          employee_count: number | null
          logo_url: string | null
          settings: Json
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string | null
          max_users: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          industry?: string | null
          employee_count?: number | null
          logo_url?: string | null
          settings?: Json
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          max_users?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          industry?: string | null
          employee_count?: number | null
          logo_url?: string | null
          settings?: Json
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          max_users?: number
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'platform_admin' | 'org_manager' | 'student'
          organization_id: string | null
          department: string | null
          job_title: string | null
          is_active: boolean
          last_login_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'platform_admin' | 'org_manager' | 'student'
          organization_id?: string | null
          department?: string | null
          job_title?: string | null
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'platform_admin' | 'org_manager' | 'student'
          organization_id?: string | null
          department?: string | null
          job_title?: string | null
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          objectives: string | null
          thumbnail_url: string | null
          duration_hours: number | null
          level: 'beginner' | 'intermediate' | 'advanced'
          area: string | null
          status: 'draft' | 'published' | 'archived'
          created_by: string | null
          organization_id: string | null
          is_public: boolean
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          objectives?: string | null
          thumbnail_url?: string | null
          duration_hours?: number | null
          level?: 'beginner' | 'intermediate' | 'advanced'
          area?: string | null
          status?: 'draft' | 'published' | 'archived'
          created_by?: string | null
          organization_id?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          objectives?: string | null
          thumbnail_url?: string | null
          duration_hours?: number | null
          level?: 'beginner' | 'intermediate' | 'advanced'
          area?: string | null
          status?: 'draft' | 'published' | 'archived'
          created_by?: string | null
          organization_id?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
      modules: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          module_id: string
          title: string
          content_type: 'video' | 'text' | 'pdf' | 'quiz' | 'embed'
          content_url: string | null
          content_text: string | null
          duration_minutes: number | null
          order_index: number
          is_required: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          module_id: string
          title: string
          content_type: 'video' | 'text' | 'pdf' | 'quiz' | 'embed'
          content_url?: string | null
          content_text?: string | null
          duration_minutes?: number | null
          order_index: number
          is_required?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          module_id?: string
          title?: string
          content_type?: 'video' | 'text' | 'pdf' | 'quiz' | 'embed'
          content_url?: string | null
          content_text?: string | null
          duration_minutes?: number | null
          order_index?: number
          is_required?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_course_progress: {
        Row: {
          id: string
          user_id: string
          course_id: string
          status: 'not_started' | 'in_progress' | 'completed' | 'overdue'
          completion_percentage: number
          started_at: string | null
          completed_at: string | null
          last_accessed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          status?: 'not_started' | 'in_progress' | 'completed' | 'overdue'
          completion_percentage?: number
          started_at?: string | null
          completed_at?: string | null
          last_accessed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          status?: 'not_started' | 'in_progress' | 'completed' | 'overdue'
          completion_percentage?: number
          started_at?: string | null
          completed_at?: string | null
          last_accessed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_lesson_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          watched_duration_seconds: number
          last_position_seconds: number
          is_completed: boolean
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          watched_duration_seconds?: number
          last_position_seconds?: number
          is_completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          watched_duration_seconds?: number
          last_position_seconds?: number
          is_completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Add other tables as needed...
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'platform_admin' | 'org_manager' | 'student'
      course_level: 'beginner' | 'intermediate' | 'advanced'
      content_type: 'video' | 'text' | 'pdf' | 'quiz' | 'embed'
      question_type: 'multiple_choice' | 'true_false' | 'scenario'
      assignment_status: 'not_started' | 'in_progress' | 'completed' | 'overdue'
      course_status: 'draft' | 'published' | 'archived'
    }
  }
}


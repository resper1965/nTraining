'use server'

import { createClient } from './server'
import { cookies } from 'next/headers'
import type { User } from '@/lib/types/database'

/**
 * Get user by ID from database (without auth)
 * Usuários são identificados diretamente do banco
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const supabase = createClient()
    
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error || !userData) {
      return null
    }

    return userData as User
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

/**
 * Get user from cookie or query param
 * Permite identificar usuário via cookie ou query param
 */
export async function getCurrentUserFromContext(): Promise<User | null> {
  try {
    const cookieStore = cookies()
    const userId = cookieStore.get('user_id')?.value

    if (!userId) {
      return null
    }

    return await getUserById(userId)
  } catch (error) {
    console.error('Error getting user from context:', error)
    return null
  }
}

/**
 * Set user context (via cookie)
 */
export async function setUserContext(userId: string) {
  const cookieStore = cookies()
  cookieStore.set('user_id', userId, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    httpOnly: true,
    sameSite: 'lax',
  })
}

/**
 * Clear user context
 */
export async function clearUserContext() {
  const cookieStore = cookies()
  cookieStore.delete('user_id')
}


/**
 * Testes unitários para o componente OAuth Callback
 * 
 * Testa:
 * - Processamento de código OAuth
 * - Processamento de tokens no hash
 * - Cleanup de timeouts
 * - Verificação de sessão existente
 * - Prevenção de processamento duplo
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, waitFor, act } from '@testing-library/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

// Mock do Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}))

// Mock do Supabase client
vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      exchangeCodeForSession: vi.fn(),
      setSession: vi.fn(),
    },
  },
}))

describe('OAuthCallbackProcessor', () => {
  const mockPush = vi.fn()
  const mockGet = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useRouter as any).mockReturnValue({ push: mockPush })
    ;(useSearchParams as any).mockReturnValue({ get: mockGet })
    
    // Mock window.location.hash
    Object.defineProperty(window, 'location', {
      value: {
        hash: '',
        pathname: '/auth/callback',
        search: '',
      },
      writable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Processamento de código OAuth', () => {
    it('deve processar código OAuth com sucesso', async () => {
      mockGet.mockImplementation((key: string) => {
        if (key === 'code') return 'test-code-123'
        if (key === 'next') return '/dashboard'
        return null
      })

      ;(supabase.auth.getSession as any).mockResolvedValue({
        data: { session: null },
        error: null,
      })

      ;(supabase.auth.exchangeCodeForSession as any).mockResolvedValue({
        data: {
          session: {
            access_token: 'access-token',
            refresh_token: 'refresh-token',
            user: { id: 'user-123' },
          },
        },
        error: null,
      })

      // Importar dinamicamente para evitar problemas com 'use client'
      const { default: OAuthCallbackPage } = await import('@/app/auth/callback/page')
      
      await act(async () => {
        render(<OAuthCallbackPage />)
      })

      await waitFor(() => {
        expect(supabase.auth.exchangeCodeForSession).toHaveBeenCalledWith('test-code-123')
      }, { timeout: 3000 })
    })

    it('deve redirecionar se já houver sessão existente', async () => {
      mockGet.mockReturnValue(null)

      ;(supabase.auth.getSession as any).mockResolvedValue({
        data: {
          session: {
            access_token: 'existing-token',
            user: { id: 'user-123' },
          },
        },
        error: null,
      })

      const { default: OAuthCallbackPage } = await import('@/app/auth/callback/page')
      
      await act(async () => {
        render(<OAuthCallbackPage />)
      })

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard')
      }, { timeout: 3000 })
    })

    it('deve tratar erro ao trocar código por sessão', async () => {
      mockGet.mockImplementation((key: string) => {
        if (key === 'code') return 'invalid-code'
        return null
      })

      ;(supabase.auth.getSession as any).mockResolvedValue({
        data: { session: null },
        error: null,
      })

      ;(supabase.auth.exchangeCodeForSession as any).mockResolvedValue({
        data: null,
        error: { message: 'Invalid code' },
      })

      const { default: OAuthCallbackPage } = await import('@/app/auth/callback/page')
      
      await act(async () => {
        render(<OAuthCallbackPage />)
      })

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringContaining('/auth/login?error=')
        )
      }, { timeout: 3000 })
    })
  })

  describe('Processamento de tokens no hash', () => {
    it('deve processar tokens do hash fragment', async () => {
      // Simular hash na URL
      window.location.hash = '#access_token=token123&refresh_token=refresh123'

      mockGet.mockReturnValue(null)

      ;(supabase.auth.getSession as any).mockResolvedValue({
        data: { session: null },
        error: null,
      })

      ;(supabase.auth.setSession as any).mockResolvedValue({
        data: {
          session: {
            access_token: 'token123',
            refresh_token: 'refresh123',
          },
        },
        error: null,
      })

      const { default: OAuthCallbackPage } = await import('@/app/auth/callback/page')
      
      await act(async () => {
        render(<OAuthCallbackPage />)
      })

      await waitFor(() => {
        expect(supabase.auth.setSession).toHaveBeenCalledWith({
          access_token: 'token123',
          refresh_token: 'refresh123',
        })
      }, { timeout: 3000 })
    })
  })

  describe('Cleanup e prevenção de memory leaks', () => {
    it('deve limpar timeouts quando componente desmonta', async () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')
      
      mockGet.mockReturnValue(null)

      ;(supabase.auth.getSession as any).mockResolvedValue({
        data: { session: null },
        error: null,
      })

      const { default: OAuthCallbackPage } = await import('@/app/auth/callback/page')
      
      let reactUnmount: () => void
      await act(async () => {
        const result = render(<OAuthCallbackPage />)
        reactUnmount = result.unmount
      })
      
      // Aguardar um pouco para garantir que timeouts foram criados
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
      })
      
      await act(async () => {
        reactUnmount()
      })

      // Verificar se clearTimeout foi chamado (pode ser chamado múltiplas vezes)
      expect(clearTimeoutSpy).toHaveBeenCalled()
    })
  })

  describe('Prevenção de processamento duplo', () => {
    it('não deve processar código e hash simultaneamente', async () => {
      mockGet.mockImplementation((key: string) => {
        if (key === 'code') return 'test-code'
        return null
      })

      window.location.hash = '#access_token=token123&refresh_token=refresh123'

      ;(supabase.auth.getSession as any).mockResolvedValue({
        data: { session: null },
        error: null,
      })

      ;(supabase.auth.exchangeCodeForSession as any).mockResolvedValue({
        data: {
          session: {
            access_token: 'access-token',
            refresh_token: 'refresh-token',
          },
        },
        error: null,
      })

      const { default: OAuthCallbackPage } = await import('@/app/auth/callback/page')
      
      await act(async () => {
        render(<OAuthCallbackPage />)
      })

      await waitFor(() => {
        expect(supabase.auth.exchangeCodeForSession).toHaveBeenCalled()
        // setSession não deve ser chamado se code foi processado com sucesso
        expect(supabase.auth.setSession).not.toHaveBeenCalled()
      }, { timeout: 3000 })
    })
  })
})

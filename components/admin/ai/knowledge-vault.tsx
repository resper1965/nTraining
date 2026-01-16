'use client'

// ============================================================================
// Knowledge Vault Component
// ============================================================================
// Gerenciador de Base de Conhecimento (KB) com upload elegante
// Design minimalista seguindo branding "ness."
// ============================================================================

import { useState, useCallback, useEffect, memo } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Upload,
  FileText,
  Loader2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Lock,
} from 'lucide-react'
import {
  uploadKnowledgeSource,
  getKnowledgeSources,
  deleteKnowledgeSource,
} from '@/app/actions/ai-admin'
import type { KnowledgeSource } from '@/lib/types/database'

// ============================================================================
// Component
// ============================================================================

function KnowledgeVaultComponent() {
  const [sources, setSources] = useState<KnowledgeSource[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState<Map<string, number>>(new Map())

  // Carregar sources ao montar
  useEffect(() => {
    loadSources()
  }, [])

  const loadSources = async () => {
    setIsLoading(true)
    try {
      const result = await getKnowledgeSources()
      if (result.success) {
        setSources(result.data)
      } else {
        toast.error(result.error.message)
      }
    } catch (error) {
      toast.error('Erro ao carregar Base de Conhecimento')
    } finally {
      setIsLoading(false)
    }
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        await handleUpload(file)
      }
    },
    []
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: true,
  })

  const handleUpload = async (file: File) => {
    const tempId = `temp-${Date.now()}-${Math.random()}`
    
    // Adicionar arquivo temporário à lista
    const tempSource: KnowledgeSource = {
      id: tempId,
      title: file.name.replace('.pdf', ''),
      filename: file.name,
      file_url: '',
      file_size: file.size,
      mime_type: file.type,
      status: 'processing',
      error_message: null,
      organization_id: null,
      created_by: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setSources((prev) => [tempSource, ...prev])
    setUploadingFiles((prev) => new Map(prev).set(tempId, 0))

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', file.name.replace('.pdf', ''))

      // Simular progresso (em produção, usar eventos reais)
      const progressInterval = setInterval(() => {
        setUploadingFiles((prev) => {
          const newMap = new Map(prev)
          const current = newMap.get(tempId) || 0
          if (current < 90) {
            newMap.set(tempId, current + 10)
          }
          return newMap
        })
      }, 500)

      const result = await uploadKnowledgeSource(formData)

      clearInterval(progressInterval)
      setUploadingFiles((prev) => {
        const newMap = new Map(prev)
        newMap.delete(tempId)
        return newMap
      })

      if (result.success) {
        // Remover temporário e adicionar real
        setSources((prev) =>
          prev.filter((s) => s.id !== tempId).concat([result.data])
        )
        toast.success(`Documento "${result.data.title}" processado com sucesso!`)
      } else {
        // Atualizar status para failed
        setSources((prev) =>
          prev.map((s) =>
            s.id === tempId
              ? { ...s, status: 'failed' as const, error_message: result.error.message }
              : s
          )
        )
        toast.error(result.error.message)
      }
    } catch (error) {
      setUploadingFiles((prev) => {
        const newMap = new Map(prev)
        newMap.delete(tempId)
        return newMap
      })
      setSources((prev) =>
        prev.map((s) =>
          s.id === tempId
            ? { ...s, status: 'failed' as const, error_message: 'Erro ao processar' }
            : s
        )
      )
      toast.error('Erro ao fazer upload do documento')
    }
  }

  const handleDelete = async (sourceId: string) => {
    if (!confirm('Tem certeza que deseja excluir este documento?')) {
      return
    }

    try {
      const result = await deleteKnowledgeSource(sourceId)
      if (result.success) {
        setSources((prev) => prev.filter((s) => s.id !== sourceId))
        toast.success('Documento excluído com sucesso')
      } else {
        toast.error(result.error.message)
      }
    } catch (error) {
      toast.error('Erro ao excluir documento')
    }
  }

  const getStatusIcon = (status: KnowledgeSource['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-400" />
      case 'processing':
        return <Loader2 className="h-5 w-5 text-yellow-400 animate-spin" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-400" />
      default:
        return <AlertCircle className="h-5 w-5 text-zinc-400" />
    }
  }

  const getStatusBadge = (status: KnowledgeSource['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-medium">
            Pronto
          </span>
        )
      case 'processing':
        return (
          <span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-400 text-xs font-medium">
            Indexando
          </span>
        )
      case 'failed':
        return (
          <span className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs font-medium">
            Erro
          </span>
        )
      default:
        return null
    }
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '—'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="font-display text-2xl font-medium text-white">
          Knowledge Vault
        </h2>
        <p className="text-zinc-400">
          Gerencie sua Base de Conhecimento. Documentos são processados e indexados automaticamente.
        </p>
      </div>

      {/* Dropzone Elegante */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <Card
          {...getRootProps()}
          className={`cursor-pointer transition-all backdrop-blur-md ${
            isDragActive
              ? 'bg-violet-500/10 border-violet-500/50 shadow-lg shadow-violet-500/20'
              : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <input {...getInputProps()} />
              <motion.div
                animate={isDragActive ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-full bg-zinc-800/50"
              >
                <Upload className="h-8 w-8 text-zinc-400" />
              </motion.div>
              <div className="text-center space-y-2">
                <p className="text-white font-medium">
                  {isDragActive
                    ? 'Solte o arquivo aqui'
                    : 'Arraste documentos regulatórios ou manuais técnicos aqui'}
                </p>
                <p className="text-sm text-zinc-500">
                  ou clique para selecionar arquivos PDF (máx. 50MB)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Lista de Ativos (Grid de Cards) */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
        </div>
      ) : sources.length === 0 ? (
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-md">
          <CardContent className="pt-6">
            <div className="text-center py-12 space-y-4">
              <Lock className="h-12 w-12 text-zinc-600 mx-auto" />
              <p className="text-zinc-400">Nenhum documento na Base de Conhecimento</p>
              <p className="text-sm text-zinc-500">
                Faça upload de documentos PDF para começar
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {sources.map((source) => {
              const uploadProgress = uploadingFiles.get(source.id)
              const isProcessing = source.status === 'processing' || uploadProgress !== undefined

              return (
                <motion.div
                  key={source.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                >
                  <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-md hover:border-zinc-700 transition-colors">
                    <CardContent className="pt-6 space-y-4">
                      {/* Header do Card */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="p-2 rounded-lg bg-zinc-800 flex-shrink-0">
                            <FileText className="h-5 w-5 text-zinc-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-white truncate">
                              {source.title}
                            </h3>
                            <p className="text-xs text-zinc-500 truncate mt-1">
                              {source.filename}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-400 hover:text-red-400 flex-shrink-0"
                          onClick={() => handleDelete(source.id)}
                          disabled={isProcessing}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Status e Info */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          {getStatusIcon(source.status)}
                          {getStatusBadge(source.status)}
                        </div>

                        {/* Barra de Progresso (se estiver indexando) */}
                        {isProcessing && (
                          <div className="space-y-1">
                            <Progress
                              value={uploadProgress ?? (source.status === 'processing' ? 50 : 0)}
                              className="h-1.5 bg-zinc-800"
                            />
                            <p className="text-xs text-zinc-500 text-center">
                              {uploadProgress !== undefined
                                ? `Upload: ${uploadProgress}%`
                                : 'Processando e gerando embeddings...'}
                            </p>
                          </div>
                        )}

                        {/* Mensagem de Erro */}
                        {source.status === 'failed' && source.error_message && (
                          <div className="p-2 rounded bg-red-500/10 border border-red-500/20">
                            <p className="text-xs text-red-400">{source.error_message}</p>
                          </div>
                        )}

                        {/* Info Adicional */}
                        <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-800">
                          <span>{formatFileSize(source.file_size)}</span>
                          <span>
                            {new Date(source.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

// Memoizar componente para evitar re-renders desnecessários
export const KnowledgeVault = memo(KnowledgeVaultComponent)
KnowledgeVault.displayName = 'KnowledgeVault'

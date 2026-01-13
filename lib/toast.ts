/**
 * Toast Notifications - Padronização
 *
 * Utilitário centralizado para toast notifications com mensagens consistentes
 * em português e durações adequadas.
 *
 * Uso:
 * ```tsx
 * import { showToast } from '@/lib/toast'
 *
 * showToast.success('Curso criado!')
 * showToast.error('Falha ao salvar')
 * showToast.courseCreated('Introdução ao React')
 * ```
 */

import { toast, ExternalToast } from 'sonner'

// ============================================================================
// CONFIGURAÇÕES
// ============================================================================

const DEFAULT_DURATION = 4000 // 4 segundos
const ERROR_DURATION = 5000 // 5 segundos (erros ficam mais tempo)
const SUCCESS_DURATION = 3000 // 3 segundos (sucesso mais rápido)

// ============================================================================
// CORE TOAST METHODS
// ============================================================================

/**
 * Toast de sucesso (verde)
 */
function success(message: string, options?: ExternalToast) {
  return toast.success(message, {
    duration: SUCCESS_DURATION,
    ...options,
  })
}

/**
 * Toast de erro (vermelho)
 */
function error(message: string, options?: ExternalToast) {
  return toast.error(message, {
    duration: ERROR_DURATION,
    ...options,
  })
}

/**
 * Toast de aviso/warning (amarelo)
 */
function warning(message: string, options?: ExternalToast) {
  return toast.warning(message, {
    duration: DEFAULT_DURATION,
    ...options,
  })
}

/**
 * Toast informativo (azul)
 */
function info(message: string, options?: ExternalToast) {
  return toast.info(message, {
    duration: DEFAULT_DURATION,
    ...options,
  })
}

/**
 * Toast de loading/carregando
 */
function loading(message: string = 'Carregando...') {
  return toast.loading(message)
}

/**
 * Toast de promessa (loading → success/error automático)
 */
function promise<T>(
  promise: Promise<T>,
  messages: {
    loading: string
    success: string | ((data: T) => string)
    error: string | ((error: any) => string)
  }
) {
  return toast.promise(promise, messages)
}

// ============================================================================
// MENSAGENS ESPECÍFICAS - CURSOS
// ============================================================================

const course = {
  created: (title: string) => success(`Curso "${title}" criado com sucesso!`),
  updated: (title: string) => success(`Curso "${title}" atualizado!`),
  deleted: (title: string) => success(`Curso "${title}" removido`),
  published: (title: string) => success(`Curso "${title}" publicado!`),
  unpublished: (title: string) => info(`Curso "${title}" despublicado`),
  errorCreate: () => error('Erro ao criar curso. Tente novamente.'),
  errorUpdate: () => error('Erro ao atualizar curso'),
  errorDelete: () => error('Erro ao remover curso'),
  errorPublish: () => error('Erro ao publicar curso'),
}

// ============================================================================
// MENSAGENS ESPECÍFICAS - USUÁRIOS
// ============================================================================

const user = {
  created: (name: string) => success(`Usuário "${name}" criado!`),
  updated: (name: string) => success(`Perfil de "${name}" atualizado!`),
  deleted: (name: string) => success(`Usuário "${name}" removido`),
  passwordChanged: () => success('Senha alterada com sucesso!'),
  profileUpdated: () => success('Perfil atualizado!'),
  avatarUpdated: () => success('Foto de perfil atualizada!'),
  errorCreate: () => error('Erro ao criar usuário'),
  errorUpdate: () => error('Erro ao atualizar usuário'),
  errorDelete: () => error('Erro ao remover usuário'),
  errorPassword: () => error('Erro ao alterar senha. Verifique a senha atual.'),
}

// ============================================================================
// MENSAGENS ESPECÍFICAS - AULAS/LIÇÕES
// ============================================================================

const lesson = {
  created: (title: string) => success(`Aula "${title}" criada!`),
  updated: (title: string) => success(`Aula "${title}" atualizada!`),
  deleted: (title: string) => success(`Aula "${title}" removida`),
  completed: (title: string) => success(`Aula "${title}" concluída! 🎉`),
  errorCreate: () => error('Erro ao criar aula'),
  errorUpdate: () => error('Erro ao atualizar aula'),
  errorDelete: () => error('Erro ao remover aula'),
  errorComplete: () => error('Erro ao marcar aula como concluída'),
}

// ============================================================================
// MENSAGENS ESPECÍFICAS - TRILHAS
// ============================================================================

const path = {
  created: (title: string) => success(`Trilha "${title}" criada!`),
  updated: (title: string) => success(`Trilha "${title}" atualizada!`),
  deleted: (title: string) => success(`Trilha "${title}" removida`),
  completed: (title: string) => success(`Parabéns! Trilha "${title}" concluída! 🏆`),
  errorCreate: () => error('Erro ao criar trilha'),
  errorUpdate: () => error('Erro ao atualizar trilha'),
  errorDelete: () => error('Erro ao remover trilha'),
}

// ============================================================================
// MENSAGENS ESPECÍFICAS - CERTIFICADOS
// ============================================================================

const certificate = {
  generated: (courseName: string) =>
    success(`Certificado de "${courseName}" gerado! 🎓`),
  downloaded: () => success('Certificado baixado com sucesso!'),
  errorGenerate: () => error('Erro ao gerar certificado'),
  errorDownload: () => error('Erro ao baixar certificado'),
}

// ============================================================================
// MENSAGENS ESPECÍFICAS - ORGANIZAÇÕES
// ============================================================================

const organization = {
  created: (name: string) => success(`Organização "${name}" criada!`),
  updated: (name: string) => success(`Organização "${name}" atualizada!`),
  deleted: (name: string) => success(`Organização "${name}" removida`),
  errorCreate: () => error('Erro ao criar organização'),
  errorUpdate: () => error('Erro ao atualizar organização'),
  errorDelete: () => error('Erro ao remover organização'),
}

// ============================================================================
// MENSAGENS ESPECÍFICAS - QUIZ
// ============================================================================

const quiz = {
  submitted: (score: number) => {
    if (score >= 70) {
      return success(`Quiz concluído! Nota: ${score}% 🎉`)
    } else {
      return warning(`Quiz concluído. Nota: ${score}% - Tente novamente!`)
    }
  },
  saved: () => info('Respostas salvas temporariamente'),
  errorSubmit: () => error('Erro ao enviar quiz'),
}

// ============================================================================
// MENSAGENS ESPECÍFICAS - ARQUIVOS/UPLOAD
// ============================================================================

const file = {
  uploading: () => loading('Enviando arquivo...'),
  uploaded: (fileName: string) => success(`Arquivo "${fileName}" enviado!`),
  deleted: (fileName: string) => success(`Arquivo "${fileName}" removido`),
  errorUpload: (reason?: string) =>
    error(reason || 'Erro ao enviar arquivo. Verifique o tamanho e formato.'),
  errorDelete: () => error('Erro ao remover arquivo'),
  errorSize: (maxSize: number) =>
    error(`Arquivo muito grande. Máximo: ${maxSize}MB`),
  errorType: () => error('Tipo de arquivo não suportado'),
}

// ============================================================================
// MENSAGENS ESPECÍFICAS - EXPORTAÇÃO
// ============================================================================

const exportData = {
  exporting: () => loading('Exportando dados...'),
  exported: (format: string = 'CSV') => success(`Relatório ${format} exportado!`),
  errorExport: () => error('Erro ao exportar relatório'),
  noData: () => warning('Nenhum dado para exportar'),
}

// ============================================================================
// MENSAGENS ESPECÍFICAS - AUTENTICAÇÃO
// ============================================================================

const auth = {
  loginSuccess: (name: string) => success(`Bem-vindo, ${name}!`),
  logoutSuccess: () => success('Logout realizado com sucesso'),
  sessionExpired: () => warning('Sua sessão expirou. Faça login novamente.'),
  unauthorized: () => error('Você não tem permissão para essa ação'),
  errorLogin: () => error('Erro ao fazer login. Verifique suas credenciais.'),
}

// ============================================================================
// MENSAGENS ESPECÍFICAS - NOTIFICAÇÕES
// ============================================================================

const notification = {
  markAsRead: () => success('Notificação marcada como lida'),
  markAllAsRead: () => success('Todas as notificações marcadas como lidas'),
  deleted: () => success('Notificação removida'),
  errorMarkAsRead: () => error('Erro ao marcar como lida'),
  errorDelete: () => error('Erro ao remover notificação'),
}

// ============================================================================
// MENSAGENS GENÉRICAS
// ============================================================================

const generic = {
  saved: () => success('Salvo com sucesso!'),
  deleted: () => success('Removido com sucesso!'),
  updated: () => success('Atualizado com sucesso!'),
  copied: () => success('Copiado para área de transferência!'),
  errorSave: () => error('Erro ao salvar. Tente novamente.'),
  errorDelete: () => error('Erro ao remover'),
  errorUpdate: () => error('Erro ao atualizar'),
  errorLoad: () => error('Erro ao carregar dados'),
  errorNetwork: () =>
    error('Erro de conexão. Verifique sua internet e tente novamente.'),
  errorUnknown: () =>
    error('Ocorreu um erro inesperado. Tente novamente mais tarde.'),
}

// ============================================================================
// EXPORT
// ============================================================================

/**
 * Utilitário principal de toast notifications
 *
 * @example
 * ```tsx
 * // Métodos básicos
 * showToast.success('Operação concluída!')
 * showToast.error('Algo deu errado')
 * showToast.warning('Atenção!')
 * showToast.info('Informação importante')
 *
 * // Mensagens específicas
 * showToast.course.created('React Avançado')
 * showToast.user.profileUpdated()
 * showToast.certificate.generated('Introdução ao TypeScript')
 *
 * // Com promessa
 * showToast.promise(
 *   apiCall(),
 *   {
 *     loading: 'Salvando...',
 *     success: 'Salvo!',
 *     error: 'Erro ao salvar'
 *   }
 * )
 * ```
 */
export const showToast = {
  // Core methods
  success,
  error,
  warning,
  info,
  loading,
  promise,
  // Specific messages
  course,
  user,
  lesson,
  path,
  certificate,
  organization,
  quiz,
  file,
  export: exportData,
  auth,
  notification,
  generic,
}

/**
 * Re-export toast original para casos edge onde é necessário
 * usar métodos customizados do sonner
 */
export { toast }

'use client'

// ============================================================================
// Lesson Editor Component
// ============================================================================
// Editor WYSIWYG usando Tiptap com estilização customizada "ness."
// Suporte a Slash Commands e Callouts elegantes
// ============================================================================

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Code,
  Image as ImageIcon,
  Video,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

// ============================================================================
// Types
// ============================================================================

export interface LessonEditorProps {
  content?: string // HTML ou Markdown
  onChange?: (html: string, json: any) => void
  placeholder?: string
  className?: string
  editable?: boolean
}

// ============================================================================
// Callout Component (Info Box)
// ============================================================================

interface CalloutProps {
  type: 'info' | 'warning' | 'success' | 'error'
  children: React.ReactNode
}

function Callout({ type, children }: CalloutProps) {
  const styles = {
    info: 'border-l-4 border-primary bg-primary/10 text-primary-foreground',
    warning: 'border-l-4 border-amber-500 bg-amber-500/10 text-amber-400',
    success: 'border-l-4 border-green-500 bg-green-500/10 text-green-400',
    error: 'border-l-4 border-red-500 bg-red-500/10 text-red-400',
  }

  const icons = {
    info: <Info className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
    success: <CheckCircle2 className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
  }

  return (
    <div className={cn('rounded-lg p-4 my-4 flex gap-3', styles[type])}>
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1 prose prose-sm max-w-none">{children}</div>
    </div>
  )
}

// ============================================================================
// Lesson Editor Component
// ============================================================================

export function LessonEditor({
  content = '',
  onChange,
  placeholder = 'Comece a digitar ou use "/" para comandos...',
  className,
  editable = true,
}: LessonEditorProps) {
  const [showSlashMenu, setShowSlashMenu] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
        blockquote: false, // Custom blockquote via Callout
      }),
      Placeholder.configure({
        placeholder,
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg my-4 max-w-full',
        },
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const json = editor.getJSON()
      onChange?.(html, json)
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-lg prose-zinc dark:prose-invert',
          'max-w-none focus:outline-none',
          'prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-zinc-900 dark:prose-headings:text-zinc-50',
          'prose-p:text-zinc-700 dark:prose-p:text-zinc-300',
          'prose-a:text-primary hover:prose-a:text-primary/80',
          'prose-strong:text-zinc-900 dark:prose-strong:text-zinc-50',
          'prose-code:text-primary prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded',
          'prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-lg',
          'prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-zinc-50/50 dark:prose-blockquote:bg-zinc-800/30 prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:italic prose-blockquote:not-italic',
          'prose-ul:list-disc prose-ol:list-decimal',
          'prose-img:rounded-lg prose-img:my-4',
          className
        ),
      },
      handleKeyDown: (view, event) => {
        // Slash command detection
        if (event.key === '/' && !showSlashMenu) {
          setShowSlashMenu(true)
          return true
        }
        if (event.key === 'Escape' && showSlashMenu) {
          setShowSlashMenu(false)
          return true
        }
        return false
      },
    },
  })

  // Custom blockquote styling
  useEffect(() => {
    if (!editor) return

    const updateBlockquoteStyles = () => {
      const blockquotes = document.querySelectorAll('.ProseMirror blockquote')
      blockquotes.forEach((blockquote) => {
        const el = blockquote as HTMLElement
        if (!el.classList.contains('ness-custom-blockquote')) {
          el.classList.add(
            'border-l-4',
            'border-primary',
            'bg-zinc-50/50',
            'dark:bg-zinc-800/30',
            'pl-4',
            'py-2',
            'italic',
            'my-4',
            'rounded-r-lg',
            'ness-custom-blockquote'
          )
        }
      })
    }

    editor.on('update', updateBlockquoteStyles)
    editor.on('selectionUpdate', updateBlockquoteStyles)
    updateBlockquoteStyles()

    return () => {
      editor.off('update', updateBlockquoteStyles)
      editor.off('selectionUpdate', updateBlockquoteStyles)
    }
  }, [editor])

  if (!editor) {
    return null
  }

  // ============================================================================
  // Toolbar Actions
  // ============================================================================

  const toggleBold = () => editor.chain().focus().toggleBold().run()
  const toggleItalic = () => editor.chain().focus().toggleItalic().run()
  const toggleHeading1 = () => editor.chain().focus().toggleHeading({ level: 1 }).run()
  const toggleHeading2 = () => editor.chain().focus().toggleHeading({ level: 2 }).run()
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run()
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run()
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run()
  const toggleCode = () => editor.chain().focus().toggleCode().run()
  const toggleCodeBlock = () => editor.chain().focus().toggleCodeBlock().run()

  const insertImage = () => {
    const url = window.prompt('URL da imagem:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const insertVideo = () => {
    const url = window.prompt('URL do vídeo (YouTube/Vimeo):')
    if (!url) return

    // Validar e sanitizar URL
    let sanitizedUrl: string | null = null

    try {
      const urlObj = new URL(url.trim())
      const hostname = urlObj.hostname.toLowerCase()

      // Permitir apenas domínios seguros
      const allowedDomains = [
        'youtube.com',
        'www.youtube.com',
        'youtu.be',
        'vimeo.com',
        'www.vimeo.com',
        'player.vimeo.com',
      ]

      const isAllowed = allowedDomains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`))

      if (!isAllowed) {
        alert('Apenas URLs do YouTube e Vimeo são permitidas.')
        return
      }

      // Converter URLs do YouTube para formato embed se necessário
      if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
        const videoId = extractYouTubeId(url)
        if (videoId) {
          sanitizedUrl = `https://www.youtube.com/embed/${videoId}`
        } else {
          alert('URL do YouTube inválida. Use o formato: https://www.youtube.com/watch?v=VIDEO_ID ou https://youtu.be/VIDEO_ID')
          return
        }
      } else if (hostname.includes('vimeo.com')) {
        // Extrair ID do Vimeo
        const vimeoId = extractVimeoId(url)
        if (vimeoId) {
          sanitizedUrl = `https://player.vimeo.com/video/${vimeoId}`
        } else {
          alert('URL do Vimeo inválida. Use o formato: https://vimeo.com/VIDEO_ID')
          return
        }
      } else {
        // Fallback: usar URL original se já estiver no formato embed
        if (urlObj.pathname.includes('/embed/') || urlObj.pathname.includes('/video/')) {
          sanitizedUrl = urlObj.toString()
        } else {
          alert('URL inválida. Use uma URL do YouTube ou Vimeo.')
          return
        }
      }
    } catch (error) {
      alert('URL inválida. Por favor, insira uma URL válida.')
      return
    }

    if (sanitizedUrl) {
      // Criar iframe para vídeo com URL sanitizada
      editor
        .chain()
        .focus()
        .insertContent(
          `<div class="video-embed rounded-lg overflow-hidden my-4"><iframe src="${sanitizedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="w-full aspect-video"></iframe></div>`
        )
        .run()
    }
  }

  // Helper functions para extrair IDs de vídeo
  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }
    return null
  }

  const extractVimeoId = (url: string): string | null => {
    const patterns = [
      /vimeo\.com\/(\d+)/,
      /player\.vimeo\.com\/video\/(\d+)/,
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }
    return null
  }

  // Slash Commands
  const slashCommands = [
    {
      label: 'Vídeo',
      icon: Video,
      action: insertVideo,
    },
    {
      label: 'Imagem',
      icon: ImageIcon,
      action: insertImage,
    },
    {
      label: 'Callout - Info',
      icon: Info,
      action: () => {
        editor
          .chain()
          .focus()
          .insertContent(
            '<div class="callout callout-info"><p>Informação importante...</p></div>'
          )
          .run()
      },
    },
    {
      label: 'Callout - Warning',
      icon: AlertTriangle,
      action: () => {
        editor
          .chain()
          .focus()
          .insertContent(
            '<div class="callout callout-warning"><p>Atenção...</p></div>'
          )
          .run()
      },
    },
    {
      label: 'Callout - Success',
      icon: CheckCircle2,
      action: () => {
        editor
          .chain()
          .focus()
          .insertContent(
            '<div class="callout callout-success"><p>Sucesso!</p></div>'
          )
          .run()
      },
    },
  ]

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      {editable && (
        <div className="flex items-center gap-1 p-2 bg-zinc-900/50 border border-zinc-800 rounded-lg flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleBold}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('bold') && 'bg-zinc-800 text-white'
            )}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleItalic}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('italic') && 'bg-zinc-800 text-white'
            )}
          >
            <Italic className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleHeading1}
            className={cn(
              'h-8 px-2',
              editor.isActive('heading', { level: 1 }) && 'bg-zinc-800 text-white'
            )}
          >
            <Heading1 className="h-4 w-4 mr-1" />
            <span className="text-xs">H1</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleHeading2}
            className={cn(
              'h-8 px-2',
              editor.isActive('heading', { level: 2 }) && 'bg-zinc-800 text-white'
            )}
          >
            <Heading2 className="h-4 w-4 mr-1" />
            <span className="text-xs">H2</span>
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleBulletList}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('bulletList') && 'bg-zinc-800 text-white'
            )}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleOrderedList}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('orderedList') && 'bg-zinc-800 text-white'
            )}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleBlockquote}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('blockquote') && 'bg-zinc-800 text-white'
            )}
          >
            <Quote className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCode}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('code') && 'bg-zinc-800 text-white'
            )}
          >
            <Code className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={insertImage}
            className="h-8 w-8 p-0"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={insertVideo}
            className="h-8 w-8 p-0"
          >
            <Video className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Editor Content */}
      <div className="relative">
        <EditorContent editor={editor} />
        
        {/* Slash Menu (simplificado - pode ser melhorado com posicionamento dinâmico) */}
        {showSlashMenu && editable && (
          <div className="absolute top-12 left-0 z-50 w-64 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl p-2">
            <p className="text-xs text-zinc-500 px-2 py-1 mb-1">Comandos rápidos</p>
            {slashCommands.map((cmd) => (
              <button
                key={cmd.label}
                onClick={() => {
                  cmd.action()
                  setShowSlashMenu(false)
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-zinc-800 text-left text-sm text-zinc-300 hover:text-white"
              >
                <cmd.icon className="h-4 w-4" />
                <span>{cmd.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Custom Styles for Callouts */}
      <style jsx global>{`
        .ProseMirror .callout {
          border-left: 4px solid;
          padding: 1rem;
          margin: 1rem 0;
          border-radius: 0.5rem;
          display: flex;
          gap: 0.75rem;
        }
        .ProseMirror .callout-info {
          border-color: #00ade8;
          background-color: rgba(0, 173, 232, 0.1);
        }
        .ProseMirror .callout-warning {
          border-color: #f59e0b;
          background-color: rgba(245, 158, 11, 0.1);
        }
        .ProseMirror .callout-success {
          border-color: #10b981;
          background-color: rgba(16, 185, 129, 0.1);
        }
        .ProseMirror .callout-error {
          border-color: #ef4444;
          background-color: rgba(239, 68, 68, 0.1);
        }
        .ProseMirror .video-embed {
          position: relative;
          padding-bottom: 56.25%; /* 16:9 */
          height: 0;
          overflow: hidden;
        }
        .ProseMirror .video-embed iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  )
}

import { requireSuperAdmin } from '@/lib/auth/helpers'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CourseArchitect } from '@/components/admin/ai/course-architect'
import { KnowledgeVault } from '@/components/admin/ai/knowledge-vault'
import { Sparkles, Lock } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AIAdminPage() {
  // Apenas superadmins podem acessar (ou org_managers - mas vamos manter restrito por enquanto)
  await requireSuperAdmin()

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/20">
              <Sparkles className="h-6 w-6 text-violet-400" />
            </div>
            <h1 className="font-display text-3xl font-medium text-white">
              AI Course Architect
            </h1>
          </div>
          <p className="text-zinc-400 max-w-2xl">
            Crie estruturas de cursos profissionais usando Inteligência Artificial.
            Faça upload de documentos técnicos para enriquecer a Base de Conhecimento.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="architect" className="space-y-6">
          <TabsList className="bg-zinc-900/50 border border-zinc-800 backdrop-blur-md">
            <TabsTrigger
              value="architect"
              className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Architect
            </TabsTrigger>
            <TabsTrigger
              value="vault"
              className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
            >
              <Lock className="h-4 w-4 mr-2" />
              Knowledge Vault
            </TabsTrigger>
          </TabsList>

          {/* Tab Content: Architect */}
          <TabsContent value="architect" className="mt-0">
            <CourseArchitect />
          </TabsContent>

          {/* Tab Content: Vault */}
          <TabsContent value="vault" className="mt-0">
            <KnowledgeVault />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

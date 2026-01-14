import { requireSuperAdmin } from '@/lib/supabase/server'
import { getAllOrganizations } from '@/app/actions/organizations'
import { getOrganizationCourses } from '@/app/actions/organization-courses'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, TrendingUp, Users, Calendar } from 'lucide-react'
import Link from 'next/link'
import { LicenseStats } from '@/components/admin/license-stats'
import { LicenseAlerts } from '@/components/admin/license-alerts'

export const dynamic = 'force-dynamic'

export default async function LicensesPage() {
  await requireSuperAdmin()

  const organizations = await getAllOrganizations().catch(() => [])

  // Get all organization courses with license info
  const allOrgCourses = await Promise.all(
    organizations.map(async (org: any) => {
      const courses = await getOrganizationCourses(org.id).catch(() => [])
      return courses.map((course: any) => ({
        ...course,
        organization: org,
      }))
    })
  ).then((results) => results.flat())

  // Calculate stats
  const totalLicenses = allOrgCourses
    .filter((oc: any) => oc.access_type === 'licensed')
    .reduce((sum: number, oc: any) => sum + (oc.total_licenses || 0), 0)

  const usedLicenses = allOrgCourses
    .filter((oc: any) => oc.access_type === 'licensed')
    .reduce((sum: number, oc: any) => sum + (oc.used_licenses || 0), 0)

  const availableLicenses = totalLicenses - usedLicenses
  const utilizationRate = totalLicenses > 0 ? Math.round((usedLicenses / totalLicenses) * 100) : 0

  // Find expiring soon (within 30 days)
  const expiringSoon = allOrgCourses.filter((oc: any) => {
    if (!oc.valid_until) return false
    const daysUntilExpiry = Math.ceil(
      (new Date(oc.valid_until).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30
  })

  // Find low licenses (< 10% remaining)
  const lowLicenses = allOrgCourses.filter((oc: any) => {
    if (oc.access_type !== 'licensed' || !oc.total_licenses) return false
    const remaining = oc.total_licenses - (oc.used_licenses || 0)
    const percentage = (remaining / oc.total_licenses) * 100
    return percentage < 10 && remaining > 0
  })

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl font-medium text-white mb-2">
          Dashboard de Licenças
        </h1>
        <p className="text-slate-400">
          Gerencie licenças e acessos de cursos por organização
        </p>
      </div>

      {/* Stats */}
      <LicenseStats
        totalLicenses={totalLicenses}
        usedLicenses={usedLicenses}
        availableLicenses={availableLicenses}
        utilizationRate={utilizationRate}
        totalCourses={allOrgCourses.length}
      />

      {/* Alerts */}
      {(expiringSoon.length > 0 || lowLicenses.length > 0) && (
        <LicenseAlerts
          expiringSoon={expiringSoon}
          lowLicenses={lowLicenses}
        />
      )}

      {/* Organizations List */}
      <div className="space-y-4">
        <h2 className="font-display text-2xl font-medium text-white">
          Organizações e Licenças
        </h2>
        {organizations.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-slate-400">
                  Nenhuma organização cadastrada
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {organizations.map((org: any) => {
              const orgCourses = allOrgCourses.filter(
                (oc: any) => oc.organization_id === org.id
              )
              const orgLicensed = orgCourses.filter(
                (oc: any) => oc.access_type === 'licensed'
              )
              const orgUsed = orgLicensed.reduce(
                (sum: number, oc: any) => sum + (oc.used_licenses || 0),
                0
              )
              const orgTotal = orgLicensed.reduce(
                (sum: number, oc: any) => sum + (oc.total_licenses || 0),
                0
              )

              return (
                <Card key={org.id} className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="font-display text-lg text-white">
                          {org.name}
                        </CardTitle>
                        <CardDescription>
                          {orgCourses.length} curso(s) atribuído(s)
                        </CardDescription>
                      </div>
                      <Link href={`/admin/organizations/${org.id}/courses`}>
                        <Button variant="outline" size="sm">
                          Gerenciar Cursos
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-slate-400 mb-1">Total de Licenças</div>
                        <div className="text-xl font-bold text-white">{orgTotal}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-400 mb-1">Usadas</div>
                        <div className="text-xl font-bold text-white">{orgUsed}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-400 mb-1">Disponíveis</div>
                        <div className="text-xl font-bold text-white">{orgTotal - orgUsed}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-400 mb-1">Utilização</div>
                        <div className="text-xl font-bold text-white">
                          {orgTotal > 0 ? Math.round((orgUsed / orgTotal) * 100) : 0}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

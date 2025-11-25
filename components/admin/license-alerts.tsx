import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AlertTriangle, Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface LicenseAlertsProps {
  expiringSoon: any[]
  lowLicenses: any[]
}

export function LicenseAlerts({ expiringSoon, lowLicenses }: LicenseAlertsProps) {
  return (
    <div className="space-y-4">
      {/* Expiring Soon */}
      {expiringSoon.length > 0 && (
        <Card className="bg-yellow-950/20 border-yellow-800/50">
          <CardHeader>
            <CardTitle className="font-display text-lg text-yellow-400 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Licenças Expirando em Breve ({expiringSoon.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expiringSoon.slice(0, 5).map((oc: any) => {
                const daysUntilExpiry = Math.ceil(
                  (new Date(oc.valid_until).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                )
                return (
                  <div
                    key={oc.id}
                    className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
                  >
                    <div>
                      <div className="text-white font-medium">
                        {oc.courses?.title || 'Curso não encontrado'}
                      </div>
                      <div className="text-sm text-slate-400">
                        {oc.organization?.name} • Expira em {daysUntilExpiry} dia(s)
                      </div>
                    </div>
                    <Link href={`/admin/organizations/${oc.organization_id}/courses`}>
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                    </Link>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Low Licenses */}
      {lowLicenses.length > 0 && (
        <Card className="bg-red-950/20 border-red-800/50">
          <CardHeader>
            <CardTitle className="font-display text-lg text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Licenças Baixas ({lowLicenses.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowLicenses.slice(0, 5).map((oc: any) => {
                const remaining = oc.total_licenses - (oc.used_licenses || 0)
                const percentage = Math.round((remaining / oc.total_licenses) * 100)
                return (
                  <div
                    key={oc.id}
                    className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
                  >
                    <div>
                      <div className="text-white font-medium">
                        {oc.courses?.title || 'Curso não encontrado'}
                      </div>
                      <div className="text-sm text-slate-400">
                        {oc.organization?.name} • {remaining} de {oc.total_licenses} disponíveis ({percentage}%)
                      </div>
                    </div>
                    <Link href={`/admin/organizations/${oc.organization_id}/courses`}>
                      <Button variant="outline" size="sm">
                        Adicionar Licenças
                      </Button>
                    </Link>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


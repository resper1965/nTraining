import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TrendingUp, Users, AlertCircle, BookOpen } from 'lucide-react'

interface LicenseStatsProps {
  totalLicenses: number
  usedLicenses: number
  availableLicenses: number
  utilizationRate: number
  totalCourses: number
}

export function LicenseStats({
  totalLicenses,
  usedLicenses,
  availableLicenses,
  utilizationRate,
  totalCourses,
}: LicenseStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Total de Licenças
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{totalLicenses}</div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Licenças Usadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{usedLicenses}</div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Licenças Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{availableLicenses}</div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Taxa de Utilização
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{utilizationRate}%</div>
          <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${utilizationRate}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


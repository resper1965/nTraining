'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface ExportButtonProps {
  onExport: () => Promise<string>
  filename: string
  label?: string
  variant?: 'default' | 'outline' | 'secondary'
}

export function ExportButton({
  onExport,
  filename,
  label = 'Exportar CSV',
  variant = 'outline',
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const csvData = await onExport()

      if (!csvData) {
        toast.error('Nenhum dado para exportar')
        return
      }

      // Criar blob e fazer download
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success('Relatório exportado com sucesso!')
    } catch (error) {
      console.error('Error exporting:', error)
      toast.error('Erro ao exportar relatório')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      variant={variant}
      size="sm"
    >
      <Download className="h-4 w-4 mr-2" />
      {isExporting ? 'Exportando...' : label}
    </Button>
  )
}

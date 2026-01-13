// Utility functions for CSV export

export interface ExportDataRow {
  [key: string]: string | number | null
}

export function convertToCSV(data: ExportDataRow[]): string {
  if (data.length === 0) return ''

  // Cabeçalhos
  const headers = Object.keys(data[0])
  const headerRow = headers.join(',')

  // Linhas de dados
  const rows = data.map(row => {
    return headers.map(header => {
      const value = row[header]
      // Escapar valores com vírgula ou aspas
      if (value === null || value === undefined) return ''
      const stringValue = String(value)
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    }).join(',')
  })

  return [headerRow, ...rows].join('\n')
}

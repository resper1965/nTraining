'use client'

import { useState, useEffect } from 'react'
import { formatCNPJ, unformatCNPJ } from '@/lib/utils/cnpj'

interface CNPJInputProps {
  value?: string | null
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  required?: boolean
  disabled?: boolean
  name?: string
}

/**
 * Input para CNPJ com máscara automática
 * Formato: 99.999.999/9999-99
 */
export function CNPJInput({
  value,
  onChange,
  placeholder = '00.000.000/0000-00',
  className = '',
  required = false,
  disabled = false,
  name = 'cnpj',
}: CNPJInputProps) {
  const [displayValue, setDisplayValue] = useState('')

  useEffect(() => {
    if (value) {
      setDisplayValue(formatCNPJ(value))
    } else {
      setDisplayValue('')
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const numbers = unformatCNPJ(inputValue)

    // Limita a 14 dígitos
    const limitedNumbers = numbers.slice(0, 14)

    // Formata o valor
    const formatted = formatCNPJ(limitedNumbers)
    setDisplayValue(formatted)

    // Chama onChange com apenas números
    if (onChange) {
      onChange(limitedNumbers)
    }
  }

  return (
    <input
      type="text"
      name={name}
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      required={required}
      disabled={disabled}
      maxLength={18} // 14 dígitos + 4 caracteres de formatação
    />
  )
}


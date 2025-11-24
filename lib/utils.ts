import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export CNPJ utilities for convenience
export { formatCNPJ, unformatCNPJ, isValidCNPJFormat } from './utils/cnpj'


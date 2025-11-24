import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export CNPJ utilities for convenience
export { maskCNPJ, unmaskCNPJ, formatCNPJ, isValidCNPJFormat } from './utils/cnpj'


/**
 * Aplica máscara no CNPJ durante digitação: 99.999.999/9999-99
 * @param cnpj - CNPJ parcial ou completo (apenas números)
 * @returns CNPJ com máscara aplicada
 */
export function maskCNPJ(cnpj: string | null | undefined): string {
  if (!cnpj) return '';

  // Remove tudo que não é número
  const numbers = cnpj.replace(/\D/g, '');

  // Limita a 14 dígitos
  const limitedNumbers = numbers.slice(0, 14);

  // Aplica máscara progressivamente
  if (limitedNumbers.length <= 2) {
    return limitedNumbers;
  } else if (limitedNumbers.length <= 5) {
    return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(2)}`;
  } else if (limitedNumbers.length <= 8) {
    return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(2, 5)}.${limitedNumbers.slice(5)}`;
  } else if (limitedNumbers.length <= 12) {
    return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(2, 5)}.${limitedNumbers.slice(5, 8)}/${limitedNumbers.slice(8)}`;
  } else {
    return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(2, 5)}.${limitedNumbers.slice(5, 8)}/${limitedNumbers.slice(8, 12)}-${limitedNumbers.slice(12)}`;
  }
}

/**
 * Remove máscara do CNPJ, deixando apenas números
 * @param cnpj - CNPJ com ou sem formatação
 * @returns CNPJ apenas com números
 */
export function unmaskCNPJ(cnpj: string | null | undefined): string {
  if (!cnpj) return '';
  return cnpj.replace(/\D/g, '');
}

/**
 * Formata CNPJ para exibição: 99.999.999/9999-99
 * @param cnpj - CNPJ sem formatação (apenas números)
 * @returns CNPJ formatado ou string vazia se inválido
 */
export function formatCNPJ(cnpj: string | null | undefined): string {
  if (!cnpj) return '';

  // Remove tudo que não é número
  const numbers = unmaskCNPJ(cnpj);

  // CNPJ deve ter 14 dígitos
  if (numbers.length !== 14) {
    return cnpj; // Retorna original se não tiver 14 dígitos
  }

  // Aplica máscara: 99.999.999/9999-99
  return numbers.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
}

/**
 * Valida formato básico do CNPJ (14 dígitos)
 * @param cnpj - CNPJ com ou sem formatação
 * @returns true se o CNPJ tem 14 dígitos
 */
export function isValidCNPJFormat(cnpj: string | null | undefined): boolean {
  if (!cnpj) return false;
  const numbers = unmaskCNPJ(cnpj);
  return numbers.length === 14;
}


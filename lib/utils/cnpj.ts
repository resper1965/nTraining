/**
 * Formata CNPJ para o padrão brasileiro: 99.999.999/9999-99
 * @param cnpj - CNPJ sem formatação (apenas números)
 * @returns CNPJ formatado ou string vazia se inválido
 */
export function formatCNPJ(cnpj: string | null | undefined): string {
  if (!cnpj) return '';

  // Remove tudo que não é número
  const numbers = cnpj.replace(/\D/g, '');

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
 * Remove formatação do CNPJ, deixando apenas números
 * @param cnpj - CNPJ com ou sem formatação
 * @returns CNPJ apenas com números
 */
export function unformatCNPJ(cnpj: string | null | undefined): string {
  if (!cnpj) return '';
  return cnpj.replace(/\D/g, '');
}

/**
 * Valida formato básico do CNPJ (14 dígitos)
 * @param cnpj - CNPJ com ou sem formatação
 * @returns true se o CNPJ tem 14 dígitos
 */
export function isValidCNPJFormat(cnpj: string | null | undefined): boolean {
  if (!cnpj) return false;
  const numbers = unformatCNPJ(cnpj);
  return numbers.length === 14;
}


/**
 * SSN masking utility
 * Note: Encryption will be handled server-side in edge functions
 */

/**
 * Mask SSN for display (show only last 4 digits)
 */
export function maskSSN(ssn: string): string {
  if (!ssn || ssn.length < 4) return '***-**-****';
  const last4 = ssn.slice(-4);
  return `***-**-${last4}`;
}

/**
 * Format SSN with dashes (XXX-XX-XXXX)
 */
export function formatSSN(ssn: string): string {
  const cleaned = ssn.replace(/\D/g, '');
  if (cleaned.length !== 9) return ssn;
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5)}`;
}

/**
 * Validate SSN format
 */
export function validateSSN(ssn: string): boolean {
  const cleaned = ssn.replace(/\D/g, '');
  return cleaned.length === 9;
}

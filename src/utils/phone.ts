import type { CountryCode } from '../types';

export interface PhoneValidationResult {
  isValid: boolean;
  error?: string;
}

// Country phone configuration
const PHONE_CONFIG = {
  SN: {
    prefix: '+221',
    digits: 9,
    label: 'Sénégal',
  },
  CI: {
    prefix: '+225',
    digits: 10,
    label: 'Côte d\'Ivoire',
  },
};

/**
 * Validate phone number based on country
 */
export const validatePhone = (phone: string, countryCode: CountryCode): PhoneValidationResult => {
  const config = PHONE_CONFIG[countryCode];
  
  if (!config) {
    return {
      isValid: false,
      error: 'Code pays invalide',
    };
  }

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // Check if it's empty
  if (digits.length === 0) {
    return {
      isValid: false,
      error: 'Le numéro de téléphone est requis',
    };
  }

  // Check length
  if (digits.length !== config.digits) {
    return {
      isValid: false,
      error: `Le numéro doit contenir ${config.digits} chiffres`,
    };
  }

  return { isValid: true };
};

/**
 * Format phone number with country prefix
 */
export const formatPhoneWithPrefix = (phone: string, countryCode: CountryCode): string => {
  const config = PHONE_CONFIG[countryCode];
  const digits = phone.replace(/\D/g, '');
  return `${config.prefix}${digits}`;
};

/**
 * Clean phone number (remove non-digits)
 */
export const cleanPhone = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

/**
 * Get phone configuration for a country
 */
export const getPhoneConfig = (countryCode: CountryCode) => {
  return PHONE_CONFIG[countryCode];
};

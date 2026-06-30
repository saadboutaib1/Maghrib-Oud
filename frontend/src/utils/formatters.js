import { STORE_CONFIG } from '../config/store.js';

export function formatCurrency(value, language = 'ar', currency = STORE_CONFIG.currency) {
  try {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-MA' : 'en-MA', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value} ${currency}`;
  }
}

export function getLocalizedField(item, field, language) {
  return item[`${field}_${language}`] || item[`${field}_ar`] || item[`${field}_en`] || '';
}

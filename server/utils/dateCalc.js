import { addMonths, differenceInDays, isValid, parseISO, startOfDay, format } from 'date-fns';

export const EXPIRING_SOON_THRESHOLD_DAYS = 30;

/**
 * Adds warranty months to purchase date to determine expiration date
 * @param {string|Date} purchaseDate 
 * @param {number} warrantyPeriodMonths 
 * @returns {Date|null}
 */
export function calculateExpiryDate(purchaseDate, warrantyPeriodMonths) {
  if (!purchaseDate) return null;
  const pDate = typeof purchaseDate === 'string' ? parseISO(purchaseDate) : purchaseDate;
  if (!isValid(pDate)) return null;

  const months = parseInt(warrantyPeriodMonths, 10);
  if (isNaN(months) || months < 0) return pDate;

  return addMonths(pDate, months);
}

/**
 * Calculates whether an item is active, expiring soon (<= 30 days), or expired
 * @param {string|Date} expiryDate 
 * @returns {'active' | 'expiring_soon' | 'expired'}
 */
export function calculateStatus(expiryDate) {
  if (!expiryDate) return 'active';
  const expDate = typeof expiryDate === 'string' ? parseISO(expiryDate) : expiryDate;
  if (!isValid(expDate)) return 'active';

  const today = startOfDay(new Date());
  const targetDay = startOfDay(expDate);
  const diffDays = differenceInDays(targetDay, today);

  if (diffDays < 0) {
    return 'expired';
  } else if (diffDays <= EXPIRING_SOON_THRESHOLD_DAYS) {
    return 'expiring_soon';
  } else {
    return 'active';
  }
}

/**
 * Calculates days remaining until expiration (negative if expired)
 * @param {string|Date} expiryDate 
 * @returns {number}
 */
export function daysUntil(expiryDate) {
  if (!expiryDate) return 0;
  const expDate = typeof expiryDate === 'string' ? parseISO(expiryDate) : expiryDate;
  if (!isValid(expDate)) return 0;

  const today = startOfDay(new Date());
  const targetDay = startOfDay(expDate);
  return differenceInDays(targetDay, today);
}

import { 
  differenceInDays, 
  differenceInMonths, 
  format, 
  isValid, 
  parseISO, 
  addMonths, 
  isBefore, 
  isAfter, 
  startOfDay 
} from 'date-fns';

/**
 * Calculates the status of an item given its expiration date
 * @param {string|Date} expiryDate 
 * @returns {'active' | 'expiring_soon' | 'expired'}
 */
export function calculateStatus(expiryDate) {
  if (!expiryDate) return 'active';
  const parsed = typeof expiryDate === 'string' ? parseISO(expiryDate) : expiryDate;
  if (!isValid(parsed)) return 'active';

  const today = startOfDay(new Date());
  const expDay = startOfDay(parsed);
  const diffDays = differenceInDays(expDay, today);

  if (diffDays < 0) {
    return 'expired';
  } else if (diffDays <= 30) {
    return 'expiring_soon';
  } else {
    return 'active';
  }
}

/**
 * Returns integer days remaining until expiry (negative if already expired)
 * @param {string|Date} expiryDate 
 * @returns {number}
 */
export function daysUntil(expiryDate) {
  if (!expiryDate) return 0;
  const parsed = typeof expiryDate === 'string' ? parseISO(expiryDate) : expiryDate;
  if (!isValid(parsed)) return 0;

  const today = startOfDay(new Date());
  const expDay = startOfDay(parsed);
  return differenceInDays(expDay, today);
}

/**
 * Formats a date into a clean human readable string
 * @param {string|Date} date 
 * @param {string} formatStr 
 * @returns {string}
 */
export function formatDate(date, formatStr = 'MMM d, yyyy') {
  if (!date) return 'N/A';
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsed)) return 'Invalid Date';
  return format(parsed, formatStr);
}

/**
 * Returns human friendly phrase like "Expires in 12 days", "Expired 5 days ago"
 * @param {string|Date} expiryDate 
 * @returns {string}
 */
export function formatDaysLeft(expiryDate) {
  const days = daysUntil(expiryDate);
  if (days < 0) {
    const absDays = Math.abs(days);
    return absDays === 1 ? 'Expired yesterday' : `Expired ${absDays} days ago`;
  }
  if (days === 0) return 'Expires today';
  if (days === 1) return 'Expires tomorrow';
  if (days <= 30) return `Expires in ${days} days`;
  if (days <= 60) return `Expires in ${Math.round(days / 7)} weeks`;
  const months = Math.round(days / 30);
  return `Expires in ~${months} ${months === 1 ? 'month' : 'months'}`;
}

/**
 * Calculates warranty progress bar elapsed percentage and human readable metrics
 * @param {string|Date} purchaseDate 
 * @param {string|Date} expiryDate 
 * @returns {{ percent: number, elapsedMonths: number, totalMonths: number, isExpired: boolean }}
 */
export function calculateWarrantyProgress(purchaseDate, expiryDate) {
  if (!purchaseDate || !expiryDate) {
    return { percent: 0, elapsedMonths: 0, totalMonths: 0, isExpired: false };
  }

  const pDate = typeof purchaseDate === 'string' ? parseISO(purchaseDate) : purchaseDate;
  const eDate = typeof expiryDate === 'string' ? parseISO(expiryDate) : expiryDate;
  const today = new Date();

  if (!isValid(pDate) || !isValid(eDate)) {
    return { percent: 0, elapsedMonths: 0, totalMonths: 0, isExpired: false };
  }

  const totalTime = eDate.getTime() - pDate.getTime();
  if (totalTime <= 0) {
    return { percent: 100, elapsedMonths: 0, totalMonths: 0, isExpired: true };
  }

  const elapsedTime = today.getTime() - pDate.getTime();
  const rawPercent = (elapsedTime / totalTime) * 100;
  const percent = Math.min(100, Math.max(0, Math.round(rawPercent)));

  const totalMonths = Math.max(1, Math.round(differenceInMonths(eDate, pDate)));
  const elapsedMonths = Math.min(totalMonths, Math.max(0, Math.round(differenceInMonths(today, pDate))));

  return {
    percent,
    elapsedMonths,
    totalMonths,
    isExpired: isBefore(eDate, today),
  };
}

/**
 * Compute expiration date from a given purchase date and warranty duration in months
 * @param {string|Date} purchaseDate 
 * @param {number} warrantyMonths 
 * @returns {string} ISO Date String YYYY-MM-DD
 */
export function computeExpiryFromWarranty(purchaseDate, warrantyMonths) {
  if (!purchaseDate || isNaN(warrantyMonths) || warrantyMonths <= 0) return '';
  const pDate = typeof purchaseDate === 'string' ? parseISO(purchaseDate) : purchaseDate;
  if (!isValid(pDate)) return '';

  const calculated = addMonths(pDate, parseInt(warrantyMonths, 10));
  return format(calculated, 'yyyy-MM-dd');
}

/**
 * Returns UI metadata (classes, labels, badge colors) for a given status
 * @param {'active' | 'expiring_soon' | 'expired'} status 
 */
export function getStatusTheme(status) {
  switch (status) {
    case 'active':
      return {
        label: 'Active & Protected',
        shortLabel: 'Active',
        badgeBg: 'bg-emerald-950/70 border border-emerald-500/30 text-emerald-400',
        dotClass: 'bg-emerald-400 shadow-[0_0_8px_#10b981]',
        borderGlow: 'hover:border-emerald-500/50',
        cardGlow: 'hover:shadow-[0_10px_30px_rgba(16,185,129,0.15)]',
        accentColor: '#10b981',
      };
    case 'expiring_soon':
      return {
        label: 'Expiring Soon',
        shortLabel: 'Expiring Soon',
        badgeBg: 'bg-amber-950/70 border border-amber-500/40 text-amber-400',
        dotClass: 'bg-amber-400 shadow-[0_0_10px_#f59e0b] animate-pulse',
        borderGlow: 'hover:border-amber-500/60',
        cardGlow: 'hover:shadow-[0_10px_30px_rgba(245,158,11,0.25)]',
        accentColor: '#f59e0b',
      };
    case 'expired':
      return {
        label: 'Expired',
        shortLabel: 'Expired',
        badgeBg: 'bg-red-950/70 border border-red-500/30 text-red-400',
        dotClass: 'bg-red-500 shadow-[0_0_8px_#ef4444]',
        borderGlow: 'hover:border-red-500/50',
        cardGlow: 'hover:shadow-[0_10px_30px_rgba(239,68,68,0.15)]',
        accentColor: '#ef4444',
      };
    default:
      return {
        label: 'Unknown',
        shortLabel: 'Unknown',
        badgeBg: 'bg-brown-900 border border-brown-700 text-brown-300',
        dotClass: 'bg-brown-400',
        borderGlow: 'hover:border-brown-600',
        cardGlow: '',
        accentColor: '#7d5a3c',
      };
  }
}

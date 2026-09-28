import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Laptop, 
  Tv, 
  Car, 
  FileText, 
  Home, 
  CreditCard, 
  Package, 
  Calendar, 
  Clock, 
  Eye, 
  Edit3, 
  Trash2, 
  ShieldCheck,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import Card3DTilt from '../3d/Card3DTilt';
import { 
  calculateStatus, 
  daysUntil, 
  formatDate, 
  formatDaysLeft, 
  calculateWarrantyProgress,
  getStatusTheme 
} from '../../utils/dateHelpers';

export const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case 'electronics':
      return Laptop;
    case 'appliances':
      return Tv;
    case 'vehicles':
      return Car;
    case 'documents & ids':
      return FileText;
    case 'real estate':
      return Home;
    case 'subscriptions':
      return CreditCard;
    default:
      return Package;
  }
};

export const ItemCard = ({ item, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const status = calculateStatus(item.expiryDate);
  const statusTheme = getStatusTheme(status);
  const days = daysUntil(item.expiryDate);
  const daysText = formatDaysLeft(item.expiryDate);
  const progress = calculateWarrantyProgress(item.purchaseDate, item.expiryDate);
  const CategoryIcon = getCategoryIcon(item.category);

  const handleCardClick = (e) => {
    // If click was inside action buttons, ignore
    if (e.target.closest('.card-action-btn')) return;
    navigate(`/items/${item._id}`);
  };

  return (
    <Card3DTilt
      maxTilt={6}
      onClick={handleCardClick}
      className={`glass-card rounded-3xl p-5 border cursor-pointer group transition-all duration-300 ${statusTheme.borderGlow} ${statusTheme.cardGlow}`}
    >
      {/* Top Header: Category Icon & Status Badge */}
      <div className="flex items-start justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-brown-900/90 border border-gold-500/30 flex items-center justify-center text-gold-400 shadow-gold-sm group-hover:scale-105 transition-transform">
            <CategoryIcon className="w-5 h-5" />
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-brown-400 block">
              {item.category || 'General'}
            </span>
            <h3 className="text-sm sm:text-base font-bold text-brown-50 leading-snug line-clamp-1 group-hover:text-gold-200 transition-colors">
              {item.productName}
            </h3>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 ${statusTheme.badgeBg}`}>
          <span className={`w-2 h-2 rounded-full ${statusTheme.dotClass}`} />
          <span>{statusTheme.shortLabel}</span>
        </div>
      </div>

      {/* Vendor & Serial Tag */}
      <div className="flex items-center justify-between text-xs text-brown-300 mb-4 px-1">
        <span className="font-medium truncate max-w-[150px]">
          {item.vendor || 'Authorized Provider'}
        </span>
        {item.serialNumber && (
          <span className="font-mono text-[10px] text-brown-400 bg-brown-900/70 px-2 py-0.5 rounded-md border border-brown-800">
            {item.serialNumber}
          </span>
        )}
      </div>

      {/* Warranty Progress Bar */}
      <div className="space-y-1.5 mb-4">
        <div className="flex justify-between text-[11px]">
          <span className="text-brown-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-gold-400" />
            <span className={status === 'expired' ? 'text-red-400 font-semibold' : status === 'expiring_soon' ? 'text-amber-300 font-semibold' : 'text-brown-200'}>
              {daysText}
            </span>
          </span>
          <span className="font-mono text-brown-400">
            {formatDate(item.expiryDate, 'MMM d, yyyy')}
          </span>
        </div>

        <div className="w-full h-1.5 bg-brown-900/90 rounded-full overflow-hidden border border-brown-800/80">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              status === 'expired'
                ? 'bg-red-500'
                : status === 'expiring_soon'
                ? 'bg-gradient-to-r from-amber-500 to-gold-400'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400'
            }`}
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </div>

      {/* Card Footer: Protected Badge & Hover Quick Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-brown-800/60 text-xs">
        <div className="flex items-center gap-1.5 text-brown-400">
          <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
          <span className="text-[11px]">
            {item.price ? `$${Number(item.price).toFixed(2)} value` : 'Archived Vault'}
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/items/${item._id}`);
            }}
            className="card-action-btn p-1.5 rounded-lg bg-brown-900/80 text-brown-300 hover:text-gold-200 hover:bg-brown-800 transition-colors"
            title="View details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              className="card-action-btn p-1.5 rounded-lg bg-brown-900/80 text-brown-300 hover:text-gold-200 hover:bg-brown-800 transition-colors"
              title="Edit item"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item);
              }}
              className="card-action-btn p-1.5 rounded-lg bg-brown-900/80 text-brown-300 hover:text-red-400 hover:bg-red-950/40 transition-colors"
              title="Delete item"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </Card3DTilt>
  );
};

export default ItemCard;

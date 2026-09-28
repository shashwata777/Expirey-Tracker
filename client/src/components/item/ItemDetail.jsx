import React, { useState } from 'react';
import { 
  Laptop, 
  Calendar, 
  Clock, 
  DollarSign, 
  Hash, 
  FileText, 
  Tag, 
  ShieldCheck, 
  Bell, 
  Edit3, 
  Trash2, 
  ArrowLeft,
  ExternalLink,
  Download,
  AlertTriangle,
  CheckCircle,
  Building
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  calculateStatus, 
  daysUntil, 
  formatDate, 
  formatDaysLeft, 
  calculateWarrantyProgress, 
  getStatusTheme 
} from '../../utils/dateHelpers';
import { getCategoryIcon } from '../dashboard/ItemCard';
import ConfirmModal from '../common/ConfirmModal';

export const ItemDetail = ({
  item,
  onEdit,
  onDelete,
  isDeleting = false,
}) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageZoomed, setImageZoomed] = useState(false);

  const [imageError, setImageError] = useState(false);

  if (!item) return null;

  const status = calculateStatus(item.expiryDate);
  const theme = getStatusTheme(status);
  const daysText = formatDaysLeft(item.expiryDate);
  const progress = calculateWarrantyProgress(item.purchaseDate, item.expiryDate);
  const CategoryIcon = getCategoryIcon(item.category);

  const isPdf = item.documentType === 'application/pdf' || item.documentUrl?.endsWith('.pdf');

  return (
    <div className="space-y-6">
      {/* Top Navigation & Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-brown-800/80">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-brown-300 hover:text-gold-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Vault Dashboard</span>
        </button>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          {onEdit && (
            <button
              id="item-detail-edit-button"
              type="button"
              onClick={onEdit}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-brown-900/90 hover:bg-brown-850 text-gold-300 border border-gold-500/30 hover:border-gold-500/50 shadow-gold-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          )}

          <button
            id="item-detail-delete-button"
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-950/60 hover:bg-red-950 text-red-300 border border-red-500/30 hover:border-red-500/50 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Document Viewer & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Left 5 Cols: Document / Receipt Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card rounded-3xl p-5 border border-gold-500/20 shadow-3d-card flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-gold-400 flex items-center gap-1.5 font-semibold">
                <FileText className="w-3.5 h-3.5" /> Document Viewer
              </span>

              {item.documentUrl && !imageError && (
                <a
                  href={item.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gold-300 hover:text-gold-200 flex items-center gap-1 font-semibold"
                >
                  <Download className="w-3.5 h-3.5" /> Full Size
                </a>
              )}
            </div>

            <div className="w-full min-h-[340px] max-h-[480px] rounded-2xl bg-brown-950 border border-brown-850 overflow-hidden flex items-center justify-center p-3 relative group">
              {isPdf ? (
                <div className="text-center p-8 space-y-4">
                  <div className="w-20 h-20 rounded-2xl bg-red-950/70 border border-red-500/40 flex items-center justify-center mx-auto shadow-md">
                    <FileText className="w-10 h-10 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brown-100">PDF Invoice Document</p>
                    <p className="text-xs text-brown-400 mt-1">Stored securely in cloud storage</p>
                  </div>
                  <a
                    href={item.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold btn-gold-glow"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-brown-950" />
                    <span>Open in PDF Reader</span>
                  </a>
                </div>
              ) : item.documentUrl && !imageError ? (
                <div 
                  className="w-full h-full flex items-center justify-center cursor-zoom-in"
                  onClick={() => setImageZoomed(!imageZoomed)}
                >
                  <img
                    src={item.documentUrl}
                    alt={item.productName}
                    onError={() => setImageError(true)}
                    className={`max-h-[440px] w-full object-contain rounded-xl transition-transform duration-300 ${
                      imageZoomed ? 'scale-150 cursor-zoom-out' : 'hover:scale-105'
                    }`}
                  />
                </div>
              ) : (
                <div className="text-center text-brown-400 text-xs py-12 px-4 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-brown-900 border border-gold-500/20 flex items-center justify-center mx-auto text-gold-400">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="font-semibold text-brown-200">
                      {imageError ? 'Document Preview Unavailable' : 'No Digital Document Attached'}
                    </p>
                    <p className="text-[11px] text-brown-400 mt-1 max-w-xs mx-auto">
                      {imageError 
                        ? 'The previous local preview session expired. Click "Edit Details" to upload a permanent cloud copy.' 
                        : 'Upload warranty cards or receipts to keep digital backups in your vault.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Structured Metadata & Timeline */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Info Card */}
          <div className="glass-card rounded-3xl p-6 sm:p-7 border border-gold-500/25 shadow-3d-card space-y-6">
            
            {/* Header Product & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-brown-900 border border-gold-500/40 flex items-center justify-center text-gold-400 shadow-gold-sm flex-shrink-0">
                  <CategoryIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-gold-400">
                    {item.category}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-brown-50 leading-tight">
                    {item.productName}
                  </h1>
                </div>
              </div>

              <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 self-start sm:self-auto ${theme.badgeBg}`}>
                <span className={`w-2.5 h-2.5 rounded-full ${theme.dotClass}`} />
                <span>{theme.label}</span>
              </div>
            </div>

            {/* Warranty Progress Gauge */}
            <div className="rounded-2xl bg-brown-950/80 border border-gold-500/20 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-brown-200 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gold-400" />
                  <span>Warranty Timeline</span>
                </span>
                <span className="font-mono font-bold text-gold-300">
                  {progress.elapsedMonths} of {progress.totalMonths} months elapsed ({progress.percent}%)
                </span>
              </div>

              <div className="w-full h-3 bg-brown-900 rounded-full overflow-hidden border border-brown-800 p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    status === 'expired'
                      ? 'bg-red-500'
                      : status === 'expiring_soon'
                      ? 'bg-gradient-to-r from-amber-500 to-gold-400'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  }`}
                  style={{ width: `${progress.percent}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[11px] text-brown-400 pt-1">
                <span>Purchased: {formatDate(item.purchaseDate)}</span>
                <span className="font-semibold text-gold-300">{daysText}</span>
                <span>Expires: {formatDate(item.expiryDate)}</span>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-2xl bg-brown-900/50 border border-brown-800/80">
                <span className="text-[11px] font-mono text-brown-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <Building className="w-3 h-3 text-gold-400" /> Vendor / Issuer
                </span>
                <p className="text-sm font-bold text-brown-100">{item.vendor || 'N/A'}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-brown-900/50 border border-brown-800/80">
                <span className="text-[11px] font-mono text-brown-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-emerald-400" /> Purchase Price
                </span>
                <p className="text-sm font-bold text-emerald-400 font-mono">
                  {item.price ? `$${Number(item.price).toFixed(2)}` : 'N/A'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-brown-900/50 border border-brown-800/80">
                <span className="text-[11px] font-mono text-brown-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <Hash className="w-3 h-3 text-gold-400" /> Serial / Model Number
                </span>
                <p className="text-xs font-mono font-bold text-gold-200">
                  {item.serialNumber || 'None Specified'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-brown-900/50 border border-brown-800/80">
                <span className="text-[11px] font-mono text-brown-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <Bell className="w-3 h-3 text-gold-400" /> Alert Thresholds
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.reminderDays && item.reminderDays.length > 0 ? (
                    item.reminderDays.map((d) => (
                      <span
                        key={d}
                        className="px-2 py-0.5 rounded-md bg-gold-500/15 border border-gold-500/30 text-gold-300 text-[10px] font-semibold"
                      >
                        {d}d prior
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-brown-400">Default settings</span>
                  )}
                </div>
              </div>
            </div>

            {/* Notes Section */}
            {item.notes && (
              <div className="p-4 rounded-2xl bg-brown-950/60 border border-brown-800">
                <span className="text-[11px] font-mono text-gold-400 uppercase tracking-wider block mb-1.5">
                  Coverage Notes & Specifics
                </span>
                <p className="text-xs text-brown-200 leading-relaxed">{item.notes}</p>
              </div>
            )}
          </div>

          {/* Reminder History Log */}
          <div className="glass-card rounded-3xl p-6 border border-gold-500/20 shadow-3d-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-brown-100 flex items-center gap-2">
                <Bell className="w-4 h-4 text-gold-400" />
                <span>Notification & Reminder Logs</span>
              </h3>
              <span className="text-[11px] font-mono text-gold-400">
                {item.reminderHistory?.length || 0} alerts logged
              </span>
            </div>

            {item.reminderHistory && item.reminderHistory.length > 0 ? (
              <div className="space-y-2.5">
                {item.reminderHistory.map((hist, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-brown-950/70 border border-brown-850 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-brown-100">{hist.message}</p>
                        <p className="text-[10px] text-brown-400 font-mono mt-0.5">
                          Channel: {hist.channel}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-brown-400 whitespace-nowrap">
                      {hist.date}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-brown-400 italic py-2">
                No alerts dispatched yet. System will trigger notifications on scheduled thresholds.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          onDelete(item._id);
          setShowDeleteModal(false);
        }}
        title={`Delete "${item.productName}"?`}
        message="This will permanently remove this document and cancel all active expiry alerts. This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ItemDetail;

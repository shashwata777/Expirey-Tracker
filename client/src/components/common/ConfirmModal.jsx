import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  message = "Are you sure you want to delete this document? This action cannot be undone.",
  confirmText = "Delete",
  isDanger = true,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brown-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="glass-card w-full max-w-md rounded-3xl p-6 border border-gold-500/30 shadow-3d-card relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-brown-300 hover:text-gold-200 hover:bg-brown-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-500/40 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>

          <div className="flex-1 pr-4">
            <h3 className="text-lg font-bold text-brown-50">{title}</h3>
            <p className="text-sm text-brown-300 mt-2 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-brown-800/80">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-brown-200 bg-brown-900/80 hover:bg-brown-850 border border-brown-700/80 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-2 ${
              isDanger 
                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                : 'btn-gold-glow'
            } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

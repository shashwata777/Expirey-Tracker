import React from 'react';
import { UploadCloud, ShieldAlert, Sparkles } from 'lucide-react';

export const EmptyState = ({
  title = "No documents found",
  description = "Get started by adding your first warranty, invoice receipt, or certificate.",
  actionText = "Upload Document",
  onAction,
}) => {
  return (
    <div className="glass-card rounded-3xl p-8 sm:p-12 text-center border border-gold-500/20 max-w-lg mx-auto my-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-20 h-20 rounded-2xl bg-brown-900/90 border border-gold-500/40 flex items-center justify-center shadow-gold-md mb-6 transform -rotate-3 hover:rotate-0 transition-transform">
          <UploadCloud className="w-10 h-10 text-gold-400 drop-shadow-[0_0_8px_#f59e0b]" />
        </div>

        <h3 className="text-xl font-bold text-brown-50 tracking-tight mb-2">{title}</h3>
        <p className="text-sm text-brown-300 max-w-sm mb-6 leading-relaxed">{description}</p>

        {onAction && (
          <button
            id="empty-state-action-btn"
            onClick={onAction}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold btn-gold-glow cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-brown-950" />
            <span>{actionText}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;

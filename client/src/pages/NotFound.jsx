import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import Card3DTilt from '../components/3d/Card3DTilt';

export const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 relative z-10">
      <Card3DTilt maxTilt={6} className="glass-card rounded-3xl p-8 sm:p-12 text-center border border-gold-500/30 max-w-md w-full shadow-3d-card">
        <div className="w-20 h-20 rounded-2xl bg-brown-900 border border-gold-500/40 flex items-center justify-center mx-auto mb-6 shadow-gold-md">
          <ShieldAlert className="w-10 h-10 text-gold-400 drop-shadow-[0_0_8px_#f59e0b]" />
        </div>

        <h1 className="text-4xl font-extrabold text-brown-50 font-mono tracking-tight mb-2">
          404
        </h1>
        <h2 className="text-lg font-bold text-gold-300 mb-2">
          Vault Record Not Found
        </h2>
        <p className="text-xs text-brown-300 mb-8 leading-relaxed">
          The requested document or page route does not exist in your encrypted vault.
        </p>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold btn-gold-glow"
        >
          <Home className="w-4 h-4 text-brown-950" />
          <span>Return to Dashboard</span>
        </Link>
      </Card3DTilt>
    </div>
  );
};

export default NotFound;

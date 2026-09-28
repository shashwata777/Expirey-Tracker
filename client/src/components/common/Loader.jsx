import React from 'react';
import { Shield } from 'lucide-react';

export const Loader = ({ message = 'Loading encrypted vault...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[300px] w-full">
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-full border-2 border-gold-500/20 border-t-gold-400 animate-spin" />
        {/* Inner reverse spinner */}
        <div 
          className="absolute inset-2 rounded-full border-2 border-amber-600/30 border-b-amber-300"
          style={{ animation: 'spin 1.5s linear infinite reverse' }}
        />
        {/* Center icon */}
        <Shield className="w-6 h-6 text-gold-400 drop-shadow-[0_0_8px_#f59e0b] animate-pulse" />
      </div>
      <p className="mt-4 text-xs font-mono tracking-wider text-brown-300 uppercase animate-pulse">
        {message}
      </p>
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="glass-card rounded-2xl p-5 border border-brown-800/80 animate-pulse space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brown-800/80" />
          <div className="space-y-1.5">
            <div className="w-32 h-4 bg-brown-800 rounded" />
            <div className="w-20 h-3 bg-brown-900 rounded" />
          </div>
        </div>
        <div className="w-16 h-6 bg-brown-800 rounded-full" />
      </div>
      <div className="w-full h-2.5 bg-brown-900 rounded-full" />
      <div className="flex justify-between items-center pt-2">
        <div className="w-24 h-4 bg-brown-800 rounded" />
        <div className="w-16 h-4 bg-brown-900 rounded" />
      </div>
    </div>
  );
};

export const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="glass-card rounded-2xl p-5 border border-brown-800/80 animate-pulse space-y-3">
          <div className="flex justify-between items-center">
            <div className="w-20 h-3.5 bg-brown-800 rounded" />
            <div className="w-8 h-8 rounded-lg bg-brown-800/70" />
          </div>
          <div className="w-16 h-7 bg-brown-700/80 rounded" />
          <div className="w-28 h-2.5 bg-brown-900 rounded" />
        </div>
      ))}
    </div>
  );
};

export default Loader;

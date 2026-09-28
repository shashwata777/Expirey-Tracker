import React from 'react';
import { ShieldCheck, AlertTriangle, XCircle, DollarSign, ArrowUpRight } from 'lucide-react';
import Card3DTilt from '../3d/Card3DTilt';
import { StatsSkeleton } from '../common/Loader';

export const StatsWidget = ({ stats, loading }) => {
  if (loading) {
    return <StatsSkeleton />;
  }

  const statCards = [
    {
      title: 'Total Vault Items',
      value: stats?.total || 0,
      subtext: 'Warranties & IDs tracked',
      icon: ShieldCheck,
      iconColor: 'text-gold-400',
      iconBg: 'bg-gold-500/20 border-gold-500/40',
      glow: 'shadow-gold-sm',
    },
    {
      title: 'Expiring Soon',
      value: stats?.expiringSoon || 0,
      subtext: 'Within the next 30 days',
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/20 border-amber-500/40',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.25)]',
      highlight: stats?.expiringSoon > 0,
    },
    {
      title: 'Expired Documents',
      value: stats?.expired || 0,
      subtext: 'Action or renewal required',
      icon: XCircle,
      iconColor: 'text-red-400',
      iconBg: 'bg-red-500/20 border-red-500/40',
      glow: 'shadow-[0_0_15px_rgba(239,68,68,0.2)]',
    },
    {
      title: 'Protected Value',
      value: `$${(stats?.totalValueProtected || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      subtext: 'Total invoice replacement value',
      icon: DollarSign,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/20 border-emerald-500/40',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card3DTilt
            key={idx}
            className="glass-card rounded-2xl p-5 border border-gold-500/20 hover:border-gold-400/50 transition-all duration-300 group cursor-default"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-brown-300 tracking-wide uppercase">
                {card.title}
              </span>
              <div
                className={`w-9 h-9 rounded-xl ${card.iconBg} border flex items-center justify-center transition-transform group-hover:scale-110`}
              >
                <Icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-brown-50 tracking-tight font-mono">
                {card.value}
              </span>
              {card.highlight && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                  Urgent
                </span>
              )}
            </div>

            <p className="mt-2 text-[11px] text-brown-400 flex items-center gap-1">
              <span>{card.subtext}</span>
            </p>
          </Card3DTilt>
        );
      })}
    </div>
  );
};

export default StatsWidget;

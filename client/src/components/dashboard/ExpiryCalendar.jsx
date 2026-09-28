import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths, 
  isToday,
  parseISO
} from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  X, 
  ExternalLink,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { calculateStatus, getStatusTheme, formatDate } from '../../utils/dateHelpers';

export const ExpiryCalendar = ({ items = [] }) => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const getItemsForDate = (date) => {
    return items.filter((item) => {
      if (!item.expiryDate) return false;
      const expDate = typeof item.expiryDate === 'string' ? parseISO(item.expiryDate) : item.expiryDate;
      return isSameDay(expDate, date);
    });
  };

  const selectedDayItems = selectedDay ? getItemsForDate(selectedDay) : [];

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-7 border border-gold-500/20 shadow-3d-card relative">
      {/* Calendar Header Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between pb-6 mb-6 border-b border-brown-800/80 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-400/30 flex items-center justify-center shadow-gold-sm">
            <CalendarIcon className="w-5 h-5 text-gold-400" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-brown-50">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <p className="text-xs text-brown-300">
              Visual roadmap of upcoming warranty and document expiries
            </p>
          </div>
        </div>

        {/* Month Switching Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentMonth(new Date())}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-brown-900/80 border border-gold-500/20 hover:border-gold-500/40 text-brown-200 hover:text-gold-200 transition-all"
          >
            Current Month
          </button>
          
          <button
            type="button"
            id="calendar-prev-month"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 rounded-xl bg-brown-900/80 border border-gold-500/20 hover:border-gold-500/40 text-brown-200 hover:text-gold-200 transition-all"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            id="calendar-next-month"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 rounded-xl bg-brown-900/80 border border-gold-500/20 hover:border-gold-500/40 text-brown-200 hover:text-gold-200 transition-all"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="py-2 text-[11px] font-mono font-bold uppercase tracking-wider text-gold-400/80">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {calendarDays.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isCurrentToday = isToday(day);
          const dayItems = getItemsForDate(day);
          const hasItems = dayItems.length > 0;
          const isSelected = selectedDay && isSameDay(day, selectedDay);

          return (
            <div
              key={idx}
              onClick={() => {
                if (hasItems) {
                  setSelectedDay(day);
                } else if (isSelected) {
                  setSelectedDay(null);
                }
              }}
              className={`min-h-[70px] sm:min-h-[95px] p-2 rounded-2xl border transition-all duration-200 relative flex flex-col justify-between ${
                !isCurrentMonth
                  ? 'bg-brown-950/30 border-brown-900/40 text-brown-600 opacity-40'
                  : isSelected
                  ? 'bg-gold-500/20 border-gold-400 shadow-gold-sm'
                  : hasItems
                  ? 'bg-brown-900/70 border-gold-500/30 hover:border-gold-400/70 hover:bg-brown-850 cursor-pointer'
                  : 'bg-brown-950/60 border-brown-900/60 text-brown-300'
              } ${isCurrentToday ? 'ring-1 ring-gold-400/60' : ''}`}
            >
              {/* Day Number Header */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold rounded-lg px-1.5 py-0.5 ${
                    isCurrentToday
                      ? 'bg-gold-500 text-brown-950 shadow-gold-sm font-extrabold'
                      : isCurrentMonth
                      ? 'text-brown-200'
                      : 'text-brown-500'
                  }`}
                >
                  {format(day, 'd')}
                </span>

                {hasItems && (
                  <span className="text-[10px] font-bold text-gold-400 bg-gold-500/15 px-1.5 py-0.2 rounded-md border border-gold-500/30">
                    {dayItems.length}
                  </span>
                )}
              </div>

              {/* Day Expiry Badges */}
              <div className="mt-1 space-y-1 overflow-hidden">
                {dayItems.slice(0, 2).map((item) => {
                  const status = calculateStatus(item.expiryDate);
                  const theme = getStatusTheme(status);
                  return (
                    <div
                      key={item._id}
                      className={`text-[10px] font-medium truncate px-1.5 py-0.5 rounded-md border flex items-center gap-1 ${
                        status === 'expired'
                          ? 'bg-red-950/80 border-red-500/30 text-red-300'
                          : status === 'expiring_soon'
                          ? 'bg-amber-950/80 border-amber-500/30 text-amber-300'
                          : 'bg-emerald-950/80 border-emerald-500/30 text-emerald-300'
                      }`}
                      title={item.productName}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${theme.dotClass} flex-shrink-0`} />
                      <span className="truncate">{item.productName}</span>
                    </div>
                  );
                })}
                {dayItems.length > 2 && (
                  <span className="text-[9px] text-gold-300 block text-right font-mono">
                    +{dayItems.length - 2} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Day Items Popover Modal */}
      {selectedDay && selectedDayItems.length > 0 && (
        <div className="mt-6 pt-6 border-t border-brown-800/80 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold-400" />
              <h3 className="text-sm font-bold text-brown-50">
                Expiring on {format(selectedDay, 'MMMM d, yyyy')} ({selectedDayItems.length} items)
              </h3>
            </div>
            <button
              onClick={() => setSelectedDay(null)}
              className="p-1.5 rounded-lg text-brown-400 hover:text-gold-200 hover:bg-brown-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {selectedDayItems.map((item) => {
              const status = calculateStatus(item.expiryDate);
              const theme = getStatusTheme(status);

              return (
                <div
                  key={item._id}
                  onClick={() => navigate(`/items/${item._id}`)}
                  className="glass-card rounded-2xl p-3.5 border border-gold-500/25 hover:border-gold-400 hover:bg-brown-850 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-bold text-brown-100 truncate group-hover:text-gold-200">
                      {item.productName}
                    </p>
                    <p className="text-[11px] text-brown-400 truncate">
                      {item.vendor || 'Authorized Provider'} • {item.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${theme.badgeBg}`}>
                      {theme.shortLabel}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-brown-400 group-hover:text-gold-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpiryCalendar;

import React from 'react';
import { LayoutGrid, Calendar as CalendarIcon } from 'lucide-react';

export const ViewToggle = ({ currentView, onViewChange }) => {
  return (
    <div className="inline-flex items-center p-1 rounded-2xl bg-brown-900/90 border border-gold-500/20 shadow-inner">
      <button
        id="view-toggle-grid"
        type="button"
        onClick={() => onViewChange('grid')}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
          currentView === 'grid'
            ? 'bg-gold-500 text-brown-950 shadow-gold-sm'
            : 'text-brown-300 hover:text-brown-100'
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
        <span>Grid</span>
      </button>

      <button
        id="view-toggle-calendar"
        type="button"
        onClick={() => onViewChange('calendar')}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
          currentView === 'calendar'
            ? 'bg-gold-500 text-brown-950 shadow-gold-sm'
            : 'text-brown-300 hover:text-brown-100'
        }`}
      >
        <CalendarIcon className="w-4 h-4" />
        <span>Calendar</span>
      </button>
    </div>
  );
};

export default ViewToggle;

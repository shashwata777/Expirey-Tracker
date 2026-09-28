import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpDown, X, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../../services/mockData';
import ViewToggle from './ViewToggle';

export const FilterBar = ({
  filters,
  onFilterChange,
  currentView,
  onViewChange,
}) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFilterChange({ search: searchInput });
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput, filters.search, onFilterChange]);

  const handleCategoryClick = (cat) => {
    const newCat = filters.category === cat ? 'All' : cat;
    onFilterChange({ category: newCat });
  };

  const clearFilters = () => {
    setSearchInput('');
    onFilterChange({
      search: '',
      category: 'All',
      status: 'all',
      sort: 'expiry_asc',
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.category !== 'All' ||
    filters.status !== 'all' ||
    filters.sort !== 'expiry_asc';

  return (
    <div className="space-y-4">
      {/* Top Filter Controls Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search Bar with Debounce */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-brown-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            id="dashboard-search-input"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by product, vendor, serial number..."
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl glass-input text-xs sm:text-sm placeholder:text-brown-400"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdowns & View Switcher */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Status Filter */}
          <div className="relative">
            <select
              id="filter-status-select"
              value={filters.status}
              onChange={(e) => onFilterChange({ status: e.target.value })}
              className="px-3.5 py-2 rounded-2xl glass-input text-xs font-semibold bg-brown-900 cursor-pointer appearance-none pr-8"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active / Protected</option>
              <option value="expiring_soon">Expiring Soon (≤30d)</option>
              <option value="expired">Expired</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-brown-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <select
              id="filter-sort-select"
              value={filters.sort}
              onChange={(e) => onFilterChange({ sort: e.target.value })}
              className="px-3.5 py-2 rounded-2xl glass-input text-xs font-semibold bg-brown-900 cursor-pointer appearance-none pr-8"
            >
              <option value="expiry_asc">Expiry: Nearest First</option>
              <option value="expiry_desc">Expiry: Furthest First</option>
              <option value="purchase_desc">Purchase: Newest First</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-brown-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* View Toggle */}
          <ViewToggle currentView={currentView} onViewChange={onViewChange} />

          {/* Clear Filters Reset */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 rounded-2xl bg-brown-900/80 border border-brown-700 text-xs font-semibold text-brown-300 hover:text-gold-300 transition-colors flex items-center gap-1.5"
              title="Reset all filters"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
        <span className="text-[11px] font-mono uppercase text-brown-400 tracking-wider flex-shrink-0 pr-1">
          Categories:
        </span>
        <button
          type="button"
          onClick={() => handleCategoryClick('All')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
            filters.category === 'All'
              ? 'bg-gold-500 text-brown-950 font-bold shadow-gold-sm border border-gold-400'
              : 'bg-brown-900/60 text-brown-300 border border-gold-500/15 hover:border-gold-500/35 hover:text-gold-200'
          }`}
        >
          All Categories
        </button>

        {CATEGORIES.map((cat) => {
          const isSelected = filters.category === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryClick(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-gold-500 text-brown-950 font-bold shadow-gold-sm border border-gold-400'
                  : 'bg-brown-900/60 text-brown-300 border border-gold-500/15 hover:border-gold-500/35 hover:text-gold-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterBar;

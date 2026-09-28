import React, { useState } from 'react';
import { Plus, Sparkles, UploadCloud, ShieldAlert, X } from 'lucide-react';
import { useItems } from '../hooks/useItems';
import StatsWidget from '../components/dashboard/StatsWidget';
import FilterBar from '../components/dashboard/FilterBar';
import ItemCard from '../components/dashboard/ItemCard';
import ExpiryCalendar from '../components/dashboard/ExpiryCalendar';
import UploadModal from '../components/upload/UploadModal';
import EditItemForm from '../components/item/EditItemForm';
import ConfirmModal from '../components/common/ConfirmModal';
import EmptyState from '../components/common/EmptyState';
import { CardSkeleton } from '../components/common/Loader';

export const Dashboard = () => {
  const [view, setView] = useState('grid'); // 'grid' | 'calendar'
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    items,
    stats,
    loading,
    statsLoading,
    filters,
    updateFilters,
    refreshItems,
    refreshStats,
    updateItem,
    deleteItem,
  } = useItems();

  const handleItemSaved = () => {
    refreshItems();
    refreshStats();
  };

  const handleEditSave = async (updatedData) => {
    if (!editingItem) return;
    setIsUpdating(true);
    const res = await updateItem(editingItem._id, updatedData);
    setIsUpdating(false);
    if (res.success) {
      setEditingItem(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    await deleteItem(deletingItem._id);
    setIsDeleting(false);
    setDeletingItem(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 relative z-10">
      
      {/* Top Welcome & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brown-50 tracking-tight">
              Warranty & Document <span className="gold-gradient-text">Vault</span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-brown-300 mt-1">
            Real-time proactive expiry tracking, automated OCR claims, and policy monitoring.
          </p>
        </div>

        <button
          id="dashboard-upload-button"
          onClick={() => setIsUploadOpen(true)}
          className="px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold btn-gold-glow flex items-center gap-2.5 shadow-gold-md cursor-pointer self-stretch sm:self-auto justify-center"
        >
          <Sparkles className="w-4 h-4 text-brown-950" />
          <span>Scan New Document</span>
        </button>
      </div>

      {/* 4 Stats Cards */}
      <StatsWidget stats={stats} loading={statsLoading} />

      {/* Filters & View Switcher */}
      <FilterBar
        filters={filters}
        onFilterChange={updateFilters}
        currentView={view}
        onViewChange={setView}
      />

      {/* Main Content Area: Grid vs Calendar */}
      {view === 'calendar' ? (
        <ExpiryCalendar items={items} />
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title={filters.search || filters.category !== 'All' || filters.status !== 'all' ? "No matching records found" : "Your Vault is Empty"}
          description={
            filters.search || filters.category !== 'All' || filters.status !== 'all'
              ? "Try adjusting your search criteria or reset filters to see all protected documents."
              : "Upload your first appliance receipt, car insurance, or identity document to unlock automated AI expiration tracking."
          }
          actionText="Upload Document"
          onAction={() => setIsUploadOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {items.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              onEdit={(it) => setEditingItem(it)}
              onDelete={(it) => setDeletingItem(it)}
            />
          ))}
        </div>
      )}

      {/* Floating Action Button (FAB) on Mobile/Desktop */}
      <button
        id="dashboard-fab-upload"
        onClick={() => setIsUploadOpen(true)}
        className="fixed bottom-6 right-6 z-30 p-4 rounded-2xl btn-gold-glow shadow-gold-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group"
        title="Upload Document"
      >
        <Plus className="w-6 h-6 text-brown-950 stroke-[2.5]" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 text-xs font-bold text-brown-950">
          Upload
        </span>
      </button>

      {/* Upload Modal Drawer */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onItemSaved={handleItemSaved}
      />

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-brown-950/85 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto">
          <div 
            className="glass-card w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-gold-500/30 shadow-3d-float relative my-auto animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-brown-800/80">
              <h2 className="text-lg font-bold text-brown-50">Edit Warranty / Document</h2>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1.5 rounded-lg text-brown-300 hover:text-gold-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <EditItemForm
              item={editingItem}
              onSave={handleEditSave}
              onCancel={() => setEditingItem(null)}
              isLoading={isUpdating}
            />
          </div>
        </div>
      )}

      {/* Delete Item Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDeleteConfirm}
        title={`Delete "${deletingItem?.productName}"?`}
        message="Are you sure you want to delete this document from your vault? All scheduled expiry notifications will be cancelled."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Dashboard;

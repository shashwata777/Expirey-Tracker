import { useState, useEffect, useCallback } from 'react';
import { itemService } from '../services/api';
import toast from 'react-hot-toast';

export const useItems = (initialFilters = {}) => {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    expiringSoon: 0,
    expired: 0,
    active: 0,
    totalValueProtected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    status: 'all',
    sort: 'expiry_asc',
    ...initialFilters,
  });

  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await itemService.getStats();
      if (res.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await itemService.getItems(filters);
      setItems(res.items || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch warranties and documents');
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const createItem = async (itemData) => {
    try {
      const res = await itemService.createItem(itemData);
      toast.success('Document & warranty protected successfully!', {
        icon: '🛡️',
        style: {
          background: '#1e140c',
          color: '#fbbf24',
          border: '1px solid #f59e0b',
        },
      });
      fetchItems();
      fetchStats();
      return { success: true, item: res.item };
    } catch (err) {
      toast.error(err.message || 'Failed to save item');
      return { success: false, error: err.message };
    }
  };

  const updateItem = async (id, itemData) => {
    try {
      const res = await itemService.updateItem(id, itemData);
      toast.success('Item details updated!', {
        icon: '✏️',
        style: {
          background: '#1e140c',
          color: '#fbbf24',
          border: '1px solid #f59e0b',
        },
      });
      fetchItems();
      fetchStats();
      return { success: true, item: res.item };
    } catch (err) {
      toast.error(err.message || 'Failed to update item');
      return { success: false, error: err.message };
    }
  };

  const deleteItem = async (id) => {
    try {
      await itemService.deleteItem(id);
      toast.success('Item removed from tracker', {
        icon: '🗑️',
        style: {
          background: '#1e140c',
          color: '#f5eadb',
          border: '1px solid #7d5a3c',
        },
      });
      fetchItems();
      fetchStats();
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to delete item');
      return { success: false, error: err.message };
    }
  };

  return {
    items,
    stats,
    loading,
    statsLoading,
    error,
    filters,
    updateFilters,
    refreshItems: fetchItems,
    refreshStats: fetchStats,
    createItem,
    updateItem,
    deleteItem,
  };
};

export default useItems;

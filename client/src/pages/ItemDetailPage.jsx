import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { itemService } from '../services/api';
import ItemDetail from '../components/item/ItemDetail';
import EditItemForm from '../components/item/EditItemForm';
import Loader from '../components/common/Loader';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

export const ItemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const res = await itemService.getItemById(id);
        if (res.item) {
          setItem(res.item);
        } else {
          throw new Error('Item not found');
        }
      } catch (err) {
        toast.error(err.message || 'Could not load item');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id, navigate]);

  const handleUpdate = async (updatedData) => {
    try {
      setIsUpdating(true);
      const res = await itemService.updateItem(id, updatedData);
      if (res.item) {
        setItem(res.item);
        setIsEditing(false);
        toast.success('Warranty details updated!', { icon: '✨' });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update item');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      setIsDeleting(true);
      await itemService.deleteItem(itemId);
      toast.success('Document deleted from vault');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Failed to delete item');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Loader message="Decrypting document vault record..." />
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <ItemDetail
        item={item}
        onEdit={() => setIsEditing(true)}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-brown-950/85 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto">
          <div 
            className="glass-card w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-gold-500/30 shadow-3d-float relative my-auto animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-brown-800/80">
              <h2 className="text-lg font-bold text-brown-50">Edit Warranty / Document</h2>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg text-brown-300 hover:text-gold-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <EditItemForm
              item={item}
              onSave={handleUpdate}
              onCancel={() => setIsEditing(false)}
              isLoading={isUpdating}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetailPage;

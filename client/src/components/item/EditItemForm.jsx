import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  ShieldCheck, 
  X, 
  Calendar, 
  FileText, 
  Clock, 
  Check, 
  UploadCloud, 
  AlertCircle 
} from 'lucide-react';
import { CATEGORIES } from '../../services/mockData';
import { computeExpiryFromWarranty } from '../../utils/dateHelpers';
import DropzoneInput from '../upload/DropzoneInput';

export const EditItemForm = ({
  item,
  onSave,
  onCancel,
  isLoading = false,
}) => {
  const [replacementFile, setReplacementFile] = useState(null);
  const [selectedReminders, setSelectedReminders] = useState(
    item?.reminderDays || [30, 7, 1]
  );
  const [showDropzone, setShowDropzone] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productName: item?.productName || '',
      vendor: item?.vendor || '',
      category: item?.category || 'Electronics',
      purchaseDate: item?.purchaseDate || '',
      warrantyPeriodMonths: item?.warrantyPeriodMonths || 12,
      expiryDate: item?.expiryDate || '',
      price: item?.price || '',
      serialNumber: item?.serialNumber || '',
      notes: item?.notes || '',
    },
  });

  const purchaseDate = watch('purchaseDate');
  const warrantyPeriodMonths = watch('warrantyPeriodMonths');
  const expiryDate = watch('expiryDate');

  useEffect(() => {
    if (purchaseDate && warrantyPeriodMonths) {
      const calculated = computeExpiryFromWarranty(purchaseDate, warrantyPeriodMonths);
      setValue('expiryDate', calculated);
    }
  }, [purchaseDate, warrantyPeriodMonths, setValue]);

  const toggleReminder = (days) => {
    setSelectedReminders((prev) =>
      prev.includes(days) ? prev.filter((d) => d !== days) : [...prev, days].sort((a, b) => b - a)
    );
  };

  const onSubmit = (formData) => {
    const updated = {
      ...formData,
      warrantyPeriodMonths: Number(formData.warrantyPeriodMonths),
      price: formData.price ? Number(formData.price) : 0,
      reminderDays: selectedReminders,
    };

    if (replacementFile) {
      updated.documentUrl = URL.createObjectURL(replacementFile);
      updated.documentType = replacementFile.type;
    }

    onSave(updated);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Product Name */}
      <div>
        <label className="block text-xs font-semibold text-brown-200 mb-1">
          Product / Document Name <span className="text-gold-400">*</span>
        </label>
        <input
          type="text"
          id="edit-product-name"
          {...register('productName', { required: 'Product name is required' })}
          className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
        />
        {errors.productName && (
          <span className="text-[11px] text-red-400 mt-1 block">{errors.productName.message}</span>
        )}
      </div>

      {/* Vendor & Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-brown-200 mb-1">
            Vendor / Brand <span className="text-gold-400">*</span>
          </label>
          <input
            type="text"
            id="edit-vendor"
            {...register('vendor', { required: 'Vendor is required' })}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
          />
          {errors.vendor && (
            <span className="text-[11px] text-red-400 mt-1 block">{errors.vendor.message}</span>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-brown-200 mb-1">Category</label>
          <select
            id="edit-category"
            {...register('category')}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm bg-brown-900 cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-brown-950 text-brown-100">
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-brown-200 mb-1">Purchase Date</label>
          <input
            type="date"
            id="edit-purchase-date"
            {...register('purchaseDate', { required: true })}
            className="w-full px-3 py-2 rounded-xl glass-input text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brown-200 mb-1">Warranty (Months)</label>
          <input
            type="number"
            id="edit-warranty-months"
            min="0"
            max="240"
            {...register('warrantyPeriodMonths', { required: true })}
            className="w-full px-3 py-2 rounded-xl glass-input text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gold-300 mb-1">Expiry Date</label>
          <div className="w-full px-3 py-2 rounded-xl bg-gold-500/10 border border-gold-500/30 text-xs font-mono font-bold text-gold-300 flex items-center justify-between">
            <span>{expiryDate || 'N/A'}</span>
            <Clock className="w-3.5 h-3.5 text-gold-400" />
          </div>
        </div>
      </div>

      {/* Price & Serial Number */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-brown-200 mb-1">Price / Cost ($)</label>
          <input
            type="number"
            step="0.01"
            id="edit-price"
            {...register('price')}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brown-200 mb-1">Serial / Invoice Number</label>
          <input
            type="text"
            id="edit-serial-number"
            {...register('serialNumber')}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm font-mono text-xs"
          />
        </div>
      </div>

      {/* Reminder Preferences */}
      <div>
        <label className="block text-xs font-semibold text-brown-200 mb-1.5">
          Notification Alerts (Days Before)
        </label>
        <div className="flex flex-wrap gap-2">
          {[90, 60, 30, 15, 7, 1].map((days) => {
            const isSelected = selectedReminders.includes(days);
            return (
              <button
                key={days}
                type="button"
                onClick={() => toggleReminder(days)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gold-500 text-brown-950 shadow-gold-sm border border-gold-400'
                    : 'bg-brown-900/70 text-brown-300 border border-gold-500/20 hover:border-gold-500/40'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                <span>{days} Days Prior</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Replace Document Attachment Accordion */}
      <div className="border border-gold-500/20 rounded-2xl p-3 bg-brown-900/40">
        <button
          type="button"
          onClick={() => setShowDropzone(!showDropzone)}
          className="w-full flex items-center justify-between text-xs font-semibold text-gold-300"
        >
          <span className="flex items-center gap-1.5">
            <UploadCloud className="w-4 h-4 text-gold-400" />
            {replacementFile ? 'Replace with Selected File' : 'Change Attached Document / Receipt'}
          </span>
          <span className="text-[11px] text-brown-400 underline">
            {showDropzone ? 'Collapse' : 'Expand'}
          </span>
        </button>

        {showDropzone && (
          <div className="mt-3">
            <DropzoneInput
              file={replacementFile}
              onFileSelect={setReplacementFile}
              onRemoveFile={() => setReplacementFile(null)}
            />
          </div>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-semibold text-brown-200 mb-1">Coverage Notes</label>
        <textarea
          id="edit-notes"
          rows={2}
          {...register('notes')}
          className="w-full px-3.5 py-2 rounded-xl glass-input text-xs resize-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-brown-800/80">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-brown-300 hover:text-brown-100 hover:bg-brown-900 border border-brown-800 transition-all"
        >
          Cancel
        </button>

        <button
          type="submit"
          id="update-item-submit-button"
          disabled={isLoading}
          className="px-6 py-2.5 rounded-xl text-xs font-bold btn-gold-glow flex items-center gap-2"
        >
          {isLoading ? (
            <span className="inline-block w-4 h-4 border-2 border-brown-950/40 border-t-brown-950 rounded-full animate-spin" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-brown-950" />
          )}
          <span>Save Changes</span>
        </button>
      </div>
    </form>
  );
};

export default EditItemForm;

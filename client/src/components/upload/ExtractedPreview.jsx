import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { addMonths, format, isValid, parseISO } from 'date-fns';
import {
  Sparkles,
  Check,
  Calendar,
  FileText,
  DollarSign,
  Hash,
  Clock,
  AlertCircle,
  Eye,
  ShieldCheck,
  RotateCcw,
  CheckCircle,
  Building,
  Tag,
  AlertTriangle,
} from 'lucide-react';

const CATEGORY_OPTIONS = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'appliances', label: 'Appliances' },
  { value: 'vehicles', label: 'Vehicles' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'subscription', label: 'Subscription' },
  { value: 'amc', label: 'Annual Maintenance (AMC)' },
  { value: 'documents & ids', label: 'Documents & IDs' },
  { value: 'real estate', label: 'Real Estate' },
  { value: 'other', label: 'Other' },
];

export const ExtractedPreview = ({
  extractedData = {},
  file,
  onSave,
  onDiscard,
  isLoading = false,
}) => {
  const [fileUrl, setFileUrl] = useState(null);
  const [selectedReminders, setSelectedReminders] = useState([30, 7, 1]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productName: '',
      vendor: '',
      category: 'electronics',
      purchaseDate: new Date().toISOString().split('T')[0],
      warrantyPeriodMonths: 12,
      price: '',
      serialNumber: '',
      notes: '',
    },
  });

  // Auto-fill trigger: resets all form fields at once whenever AI extractedData arrives
  useEffect(() => {
    if (extractedData) {
      const today = new Date().toISOString().split('T')[0];
      const normCat = (extractedData.category || 'electronics').toLowerCase();
      const matchedCat = CATEGORY_OPTIONS.some((c) => c.value === normCat) ? normCat : 'other';

      reset({
        productName: extractedData.productName || '',
        vendor: extractedData.vendor || '',
        category: matchedCat,
        purchaseDate: extractedData.purchaseDate || today,
        warrantyPeriodMonths:
          extractedData.warrantyPeriodMonths !== null && extractedData.warrantyPeriodMonths !== undefined
            ? extractedData.warrantyPeriodMonths
            : 12,
        price: extractedData.price !== null && extractedData.price !== undefined ? extractedData.price : '',
        serialNumber: extractedData.serialNumber || '',
        notes: extractedData.notes || '',
      });
    }
  }, [extractedData, reset]);

  // Object URL for local image preview
  useEffect(() => {
    if (file && file.type !== 'application/pdf') {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setFileUrl(null);
    }
  }, [file]);

  // Live real-time watch for purchase date and warranty duration
  const purchaseDate = watch('purchaseDate');
  const warrantyMonths = watch('warrantyPeriodMonths');

  // Live auto-calculated expiry date computed with date-fns addMonths
  const liveExpiryDate = useMemo(() => {
    if (!purchaseDate || warrantyMonths === '' || warrantyMonths === null || isNaN(Number(warrantyMonths))) {
      return null;
    }
    try {
      const pDate = typeof purchaseDate === 'string' ? parseISO(purchaseDate) : purchaseDate;
      if (!isValid(pDate)) return null;
      const expDate = addMonths(pDate, Number(warrantyMonths));
      return format(expDate, 'yyyy-MM-dd');
    } catch {
      return null;
    }
  }, [purchaseDate, warrantyMonths]);

  const formattedExpiryDisplay = useMemo(() => {
    if (!liveExpiryDate) return 'Calculated after date entry';
    try {
      return format(parseISO(liveExpiryDate), 'MMMM d, yyyy');
    } catch {
      return liveExpiryDate;
    }
  }, [liveExpiryDate]);

  // Check which fields were successfully extracted vs missing
  const wasExtracted = (fieldName) => {
    if (!extractedData || extractedData.extractionFailed) return false;
    const val = extractedData[fieldName];
    return val !== null && val !== undefined && val !== '';
  };

  const hasAnyExtractedField =
    !extractedData?.extractionFailed &&
    (wasExtracted('productName') ||
      wasExtracted('vendor') ||
      wasExtracted('purchaseDate') ||
      wasExtracted('warrantyPeriodMonths'));

  const toggleReminder = (days) => {
    setSelectedReminders((prev) =>
      prev.includes(days) ? prev.filter((d) => d !== days) : [...prev, days].sort((a, b) => b - a)
    );
  };

  const onSubmitForm = (data) => {
    // Build multipart FormData with all fields and the actual file for Cloudinary upload
    const formData = new FormData();
    formData.append('productName', data.productName);
    formData.append('vendor', data.vendor || '');
    formData.append('category', data.category || 'other');
    formData.append('purchaseDate', data.purchaseDate);
    formData.append('warrantyPeriodMonths', data.warrantyPeriodMonths || 12);
    if (liveExpiryDate) {
      formData.append('expiryDate', liveExpiryDate);
    }
    if (data.price !== '' && data.price !== undefined) {
      formData.append('price', data.price);
    }
    if (data.serialNumber) {
      formData.append('serialNumber', data.serialNumber);
    }
    if (data.notes) {
      formData.append('notes', data.notes);
    }

    // Append multi-select reminder preferences
    selectedReminders.forEach((day) => {
      formData.append('reminderDays[]', day);
    });

    // Append the original file object for Cloudinary upload!
    if (file) {
      formData.append('file', file);
    }

    onSave(formData);
  };

  const isPdf = file?.type === 'application/pdf' || file?.name?.endsWith('.pdf');

  return (
    <div className="w-full space-y-6">
      {/* Top Banner */}
      {hasAnyExtractedField ? (
        <div className="rounded-2xl bg-gradient-to-r from-gold-500/20 via-amber-500/15 to-brown-900/80 border border-gold-400/50 p-3.5 flex items-center justify-between shadow-gold-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gold-500/20 border border-gold-400/40 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-gold-300 animate-spin-slow" />
            </div>
            <div>
              <p className="text-xs font-bold text-gold-200">
                ✨ Details auto-filled by AI — please review before saving
              </p>
              <p className="text-[11px] text-brown-300">
                Values detected from your invoice. Any highlighted fields need manual attention.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" /> Neural OCR Match
          </span>
        </div>
      ) : (
        <div className="rounded-2xl bg-amber-950/40 border border-amber-500/40 p-3.5 flex items-center gap-3 shadow-sm animate-in fade-in duration-200">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-amber-200">
              Couldn't auto-read this document — please fill in the details manually
            </p>
            <p className="text-[11px] text-brown-300">
              You can still protect this item by entering its purchase date and warranty duration below.
            </p>
          </div>
        </div>
      )}

      {/* Two Column Layout: Left Document Preview, Right Auto-Fill Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Uploaded Document Source Viewer */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          <div className="text-xs font-mono text-gold-400 uppercase tracking-wider flex items-center gap-1.5 font-semibold">
            <Eye className="w-3.5 h-3.5" /> Attached Document
          </div>

          <div className="relative flex-1 min-h-[300px] max-h-[460px] rounded-2xl bg-brown-950 border border-gold-500/25 overflow-hidden flex flex-col items-center justify-center p-4">
            {isPdf ? (
              <div className="text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-red-950/70 border border-red-500/40 flex items-center justify-center mx-auto shadow-md">
                  <FileText className="w-8 h-8 text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-brown-100 truncate max-w-[220px]">
                    {file?.name || 'Document.pdf'}
                  </p>
                  <p className="text-xs text-brown-400 mt-0.5">
                    {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB • ` : ''}PDF Document
                  </p>
                </div>
                <span className="inline-block text-[11px] text-gold-400 bg-brown-900/80 px-3 py-1 rounded-lg border border-gold-500/20">
                  Ready for encrypted storage
                </span>
              </div>
            ) : fileUrl ? (
              <div className="relative w-full h-full flex items-center justify-center group overflow-hidden rounded-xl">
                <img
                  src={fileUrl}
                  alt="Invoice Document Preview"
                  className="max-h-[380px] w-full object-contain rounded-xl transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="text-center text-brown-400 text-xs py-10">
                <FileText className="w-10 h-10 mx-auto text-brown-700 mb-2" />
                No preview available
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Editable Form */}
        <form onSubmit={handleSubmit(onSubmitForm)} className="lg:col-span-7 space-y-4">
          
          {/* Product Name */}
          <div>
            <label className="block text-xs font-semibold text-brown-200 mb-1">
              Product / Item Name <span className="text-gold-400">*</span>
            </label>
            <input
              type="text"
              id="extracted-product-name-input"
              {...register('productName', { required: 'Product name is required' })}
              className={`w-full px-3.5 py-2.5 rounded-xl glass-input text-sm transition-all ${
                !wasExtracted('productName')
                  ? 'border-amber-500/50 bg-amber-500/5 focus:border-gold-400'
                  : 'border-gold-500/30'
              }`}
              placeholder="e.g. Dell XPS 15, iPhone 16 Pro, Dyson V15"
            />
            {errors.productName ? (
              <span className="text-[11px] text-red-400 mt-1 block">{errors.productName.message}</span>
            ) : !wasExtracted('productName') ? (
              <span className="text-[11px] text-amber-400/90 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" /> AI couldn't find this — please fill in
              </span>
            ) : null}
          </div>

          {/* Vendor & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brown-200 mb-1">
                Vendor / Retailer <span className="text-gold-400">*</span>
              </label>
              <input
                type="text"
                id="extracted-vendor-input"
                {...register('vendor', { required: 'Vendor is required' })}
                className={`w-full px-3.5 py-2.5 rounded-xl glass-input text-sm transition-all ${
                  !wasExtracted('vendor')
                    ? 'border-amber-500/50 bg-amber-500/5 focus:border-gold-400'
                    : 'border-gold-500/30'
                }`}
                placeholder="e.g. Amazon, Croma, Best Buy, Apple"
              />
              {errors.vendor ? (
                <span className="text-[11px] text-red-400 mt-1 block">{errors.vendor.message}</span>
              ) : !wasExtracted('vendor') ? (
                <span className="text-[11px] text-amber-400/90 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3" /> AI couldn't find this — please fill in
                </span>
              ) : null}
            </div>

            <div>
              <label className="block text-xs font-semibold text-brown-200 mb-1">Category</label>
              <select
                id="extracted-category-select"
                {...register('category')}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm bg-brown-900 cursor-pointer text-brown-100"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat.value} value={cat.value} className="bg-brown-950 text-brown-100">
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Purchase Date & Warranty Duration & Live Calculated Expiry */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-brown-200 mb-1">
                Purchase Date <span className="text-gold-400">*</span>
              </label>
              <input
                type="date"
                id="extracted-purchase-date-input"
                {...register('purchaseDate', { required: 'Purchase date is required' })}
                className={`w-full px-3 py-2 rounded-xl glass-input text-xs ${
                  !wasExtracted('purchaseDate')
                    ? 'border-amber-500/50 bg-amber-500/5 focus:border-gold-400'
                    : 'border-gold-500/30'
                }`}
              />
              {!wasExtracted('purchaseDate') && (
                <span className="text-[10px] text-amber-400/90 mt-1 block">Set purchase date</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-brown-200 mb-1">
                Warranty (Months) <span className="text-gold-400">*</span>
              </label>
              <input
                type="number"
                id="extracted-warranty-months-input"
                min="0"
                max="240"
                {...register('warrantyPeriodMonths', {
                  required: 'Warranty duration is required',
                  min: { value: 0, message: 'Must be positive' },
                })}
                className={`w-full px-3 py-2 rounded-xl glass-input text-xs ${
                  !wasExtracted('warrantyPeriodMonths')
                    ? 'border-amber-500/50 bg-amber-500/5 focus:border-gold-400'
                    : 'border-gold-500/30'
                }`}
                placeholder="12"
              />
              {!wasExtracted('warrantyPeriodMonths') && (
                <span className="text-[10px] text-amber-400/90 mt-1 block">Set warranty period</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                Live Calculated Expiry
              </label>
              <div className="w-full px-3 py-2 rounded-xl bg-gold-500/10 border border-gold-500/35 text-xs font-mono font-bold text-gold-300 flex items-center justify-between min-h-[38px]">
                <span className="truncate">{liveExpiryDate || 'Pending input'}</span>
                <Clock className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
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
                id="extracted-price-input"
                {...register('price')}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brown-200 mb-1">Serial / Invoice Number</label>
              <input
                type="text"
                id="extracted-serial-input"
                {...register('serialNumber')}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm font-mono text-xs"
                placeholder="e.g. SN-9988224"
              />
            </div>
          </div>

          {/* Reminder Preferences Multi-Select Checkboxes (Default 30, 7, 1) */}
          <div>
            <label className="block text-xs font-semibold text-brown-200 mb-1.5">
              Proactive Expiry Reminder Alerts
            </label>
            <div className="flex flex-wrap gap-2">
              {[30, 7, 1, 15, 60].map((days) => {
                const isSelected = selectedReminders.includes(days);
                return (
                  <button
                    key={days}
                    type="button"
                    onClick={() => toggleReminder(days)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-gold-500 text-brown-950 font-bold shadow-gold-sm border border-gold-400'
                        : 'bg-brown-900/70 text-brown-300 border border-gold-500/20 hover:border-gold-500/40'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    <span>{days} Days in Advance</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-brown-200 mb-1">Coverage Notes</label>
            <textarea
              id="extracted-notes-input"
              rows={2}
              {...register('notes')}
              className="w-full px-3.5 py-2 rounded-xl glass-input text-xs resize-none"
              placeholder="e.g. Includes accidental damage protection and free annual service."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-brown-800/80">
            <button
              type="button"
              id="extracted-discard-button"
              onClick={onDiscard}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-brown-300 hover:text-brown-100 hover:bg-brown-900 border border-brown-800 transition-all cursor-pointer"
            >
              Discard
            </button>

            <button
              type="submit"
              id="extracted-save-button"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl text-xs font-bold btn-gold-glow flex items-center gap-2 cursor-pointer shadow-gold-md"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-brown-950/40 border-t-brown-950 rounded-full animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-brown-950" />
              )}
              <span>Save & Protect Item</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExtractedPreview;

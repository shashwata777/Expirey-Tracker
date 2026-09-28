import React, { useState } from 'react';
import { X, Sparkles, BrainCircuit, RefreshCw, AlertCircle, ArrowLeft } from 'lucide-react';
import DropzoneInput from './DropzoneInput';
import ExtractedPreview from './ExtractedPreview';
import { itemService } from '../../services/api';
import toast from 'react-hot-toast';

export const UploadModal = ({ isOpen, onClose, onItemSaved }) => {
  const [file, setFile] = useState(null);
  const [step, setStep] = useState('upload'); // 'upload' | 'extracting' | 'error' | 'preview'
  const [extractedData, setExtractedData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const isExtracting = step === 'extracting';

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setExtractedData(null);
    setStep('upload');
  };

  const handleStartExtraction = async () => {
    if (!file) {
      toast.error('Please select an invoice or receipt image/PDF first');
      return;
    }

    setStep('extracting');
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await itemService.extractDetails(formData);

      if (res && res.extracted) {
        setExtractedData(res.extracted);
        setStep('preview');
        toast.success('Document analysis completed!', { icon: '✨' });
      } else {
        // AI extraction failed to read document
        setExtractedData({
          extractionFailed: true,
          productName: '',
          vendor: '',
          category: 'other',
          purchaseDate: new Date().toISOString().split('T')[0],
          warrantyPeriodMonths: '',
        });
        setStep('preview');
      }
    } catch (err) {
      // Network or API failure
      setErrorMessage(err.message || 'Extraction service temporarily unavailable.');
      setStep('error');
    }
  };

  const handleManualEntryFallback = () => {
    setExtractedData({
      extractionFailed: true,
      productName: '',
      vendor: '',
      category: 'other',
      purchaseDate: new Date().toISOString().split('T')[0],
      warrantyPeriodMonths: '',
    });
    setStep('preview');
  };

  const handleSaveItem = async (formData) => {
    setIsSaving(true);
    try {
      const res = await itemService.createItem(formData);
      if (res.success) {
        toast.success('Item added to your tracker!', {
          icon: '✨',
          style: {
            background: '#1e140c',
            color: '#fbbf24',
            border: '1px solid #f59e0b',
          },
        });
        if (onItemSaved) onItemSaved(res.item);
        handleClose();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save item');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (isExtracting || isSaving) return; // Prevent closing while in flight
    setFile(null);
    setExtractedData(null);
    setErrorMessage('');
    setStep('upload');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-brown-950/85 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="glass-card w-full max-w-4xl rounded-3xl p-6 sm:p-8 border border-gold-500/30 shadow-3d-float relative my-auto animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-5 mb-5 border-b border-brown-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-400/30 flex items-center justify-center shadow-gold-sm">
              <Sparkles className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-brown-50">
                {step === 'preview' ? 'Verify Extracted Warranty' : 'Upload Document & Auto-Extract'}
              </h2>
              <p className="text-xs text-brown-300">
                {step === 'preview' 
                  ? 'Confirm the detected parameters and alert thresholds' 
                  : 'Let AI scan warranty dates, vendors, and serial numbers instantly'}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            disabled={isExtracting || isSaving}
            className={`p-2 rounded-xl text-brown-300 transition-colors ${
              isExtracting || isSaving
                ? 'opacity-30 cursor-not-allowed'
                : 'hover:text-gold-200 hover:bg-brown-800/60 cursor-pointer'
            }`}
            title={isExtracting ? 'Extraction in progress...' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Upload Dropzone */}
        {step === 'upload' && (
          <div className="space-y-6">
            <DropzoneInput
              file={file}
              onFileSelect={handleFileSelect}
              onRemoveFile={handleRemoveFile}
            />

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleManualEntryFallback}
                className="text-xs text-brown-300 hover:text-gold-300 transition-colors underline underline-offset-4 cursor-pointer"
              >
                Skip OCR and enter details manually →
              </button>

              <button
                type="button"
                id="start-extract-button"
                onClick={handleStartExtraction}
                disabled={!file}
                className={`px-6 py-3 rounded-xl text-xs font-bold btn-gold-glow flex items-center gap-2 cursor-pointer ${
                  !file ? 'opacity-50 cursor-not-allowed filter grayscale' : ''
                }`}
              >
                <Sparkles className="w-4 h-4 text-brown-950" />
                <span>Extract Details</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Extracting Animated State */}
        {step === 'extracting' && (
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-gold-500/20 border-t-gold-400 animate-spin" />
              <div 
                className="absolute inset-3 rounded-full border-2 border-amber-600/30 border-b-amber-300" 
                style={{ animation: 'spin 2s linear infinite reverse' }}
              />
              <div className="w-12 h-12 rounded-2xl bg-brown-900 border border-gold-500/40 flex items-center justify-center shadow-gold-md animate-pulse">
                <BrainCircuit className="w-6 h-6 text-gold-400 drop-shadow-[0_0_8px_#f59e0b]" />
              </div>
            </div>

            <div className="max-w-xs space-y-2">
              <h3 className="text-base font-bold text-gold-200">
                Reading your document...
              </h3>
              <p className="text-xs text-brown-300 leading-relaxed">
                Analyzing invoice headers, purchase dates, warranty terms, and serial tokens.
              </p>
            </div>

            <div className="w-48 h-1.5 bg-brown-900 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-gold-500 to-amber-300 w-full animate-shimmer" />
            </div>
          </div>
        )}

        {/* Step 3: Network Error Recovery State */}
        {step === 'error' && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-red-950/70 border border-red-500/40 flex items-center justify-center shadow-md">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>

            <div className="max-w-sm space-y-2">
              <h3 className="text-base font-bold text-red-200">
                Document Extraction Failed
              </h3>
              <p className="text-xs text-brown-300 leading-relaxed">
                {errorMessage || 'A network error occurred while connecting to the AI extraction service.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleStartExtraction}
                className="px-5 py-2.5 rounded-xl text-xs font-bold btn-gold-glow flex items-center gap-2 cursor-pointer shadow-gold-sm"
              >
                <RefreshCw className="w-3.5 h-3.5 text-brown-950" />
                <span>Retry Extraction</span>
              </button>

              <button
                type="button"
                onClick={handleManualEntryFallback}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-brown-900 text-brown-200 hover:text-gold-200 border border-gold-500/30 transition-colors cursor-pointer"
              >
                Enter Details Manually
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Extracted Preview & Auto-Fill Form */}
        {step === 'preview' && (
          <ExtractedPreview
            extractedData={extractedData}
            file={file}
            onSave={handleSaveItem}
            onDiscard={handleClose}
            isLoading={isSaving}
          />
        )}
      </div>
    </div>
  );
};

export default UploadModal;

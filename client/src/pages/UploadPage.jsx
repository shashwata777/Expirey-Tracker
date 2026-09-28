import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, BrainCircuit, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import DropzoneInput from '../components/upload/DropzoneInput';
import ExtractedPreview from '../components/upload/ExtractedPreview';
import { itemService } from '../services/api';
import toast from 'react-hot-toast';

export const UploadPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [step, setStep] = useState('upload'); // 'upload' | 'extracting' | 'error' | 'preview'
  const [extractedData, setExtractedData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save item');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 relative z-10">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-brown-800/80">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-brown-300 hover:text-gold-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <span className="text-xs font-mono uppercase tracking-widest text-gold-400 font-semibold">
          AI DOCUMENT INGESTION
        </span>
      </div>

      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gold-500/25 shadow-3d-card">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-extrabold text-brown-50 tracking-tight">
            {step === 'preview' ? 'Verify Extracted Warranty' : 'Upload Document & Auto-Extract'}
          </h1>
          <p className="text-xs sm:text-sm text-brown-300 mt-1">
            {step === 'preview'
              ? 'Review the OCR detected dates and warranty parameters before committing to your vault.'
              : 'Our neural vision models scan serial numbers, terms of service, and warranty milestones.'}
          </p>
        </div>

        {/* Upload Step */}
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
                Skip OCR and fill manually →
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

        {/* Extracting Step */}
        {step === 'extracting' && (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
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

        {/* Error Recovery Step */}
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

        {/* Preview Step */}
        {step === 'preview' && (
          <ExtractedPreview
            extractedData={extractedData}
            file={file}
            onSave={handleSaveItem}
            onDiscard={() => setStep('upload')}
            isLoading={isSaving}
          />
        )}
      </div>
    </div>
  );
};

export default UploadPage;

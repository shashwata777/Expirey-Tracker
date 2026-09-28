import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, Image, X, CheckCircle } from 'lucide-react';

export const DropzoneInput = ({ file, onFileSelect, onRemoveFile }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const isPdf = file?.type === 'application/pdf' || file?.name?.endsWith('.pdf');
  const previewUrl = file && !isPdf ? URL.createObjectURL(file) : null;

  return (
    <div className="w-full">
      {!file ? (
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${
            isDragActive
              ? 'border-gold-400 bg-gold-500/10 scale-[1.01]'
              : isDragReject
              ? 'border-red-500 bg-red-950/20'
              : 'border-gold-500/30 hover:border-gold-400/70 bg-brown-900/40 hover:bg-brown-900/60'
          }`}
        >
          <input {...getInputProps()} id="document-dropzone-input" />
          
          <div className="w-16 h-16 rounded-2xl bg-brown-950 border border-gold-500/30 flex items-center justify-center shadow-gold-sm mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8 text-gold-400 drop-shadow-[0_0_8px_#f59e0b]" />
          </div>

          <p className="text-sm font-semibold text-brown-100 mb-1">
            {isDragActive ? 'Drop your document here...' : 'Click to browse or drag & drop'}
          </p>
          <p className="text-xs text-brown-300">
            Supports PDF, JPG, PNG & WEBP invoices, receipts, or warranties (up to 10MB)
          </p>

          <div className="mt-4 flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[11px] text-gold-400 font-mono bg-gold-500/10 px-2.5 py-1 rounded-full border border-gold-500/20">
              <CheckCircle className="w-3 h-3" /> Auto-OCR Ready
            </span>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl bg-brown-900/80 border border-gold-500/40 p-4 flex items-center justify-between shadow-gold-sm">
          <div className="flex items-center gap-4 min-w-0">
            {isPdf ? (
              <div className="w-14 h-14 rounded-xl bg-red-950/60 border border-red-500/40 flex items-center justify-center flex-shrink-0">
                <FileText className="w-7 h-7 text-red-400" />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-xl overflow-hidden border border-gold-500/40 bg-brown-950 flex-shrink-0">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="min-w-0">
              <p className="text-sm font-bold text-brown-100 truncate">{file.name}</p>
              <p className="text-xs text-brown-300 mt-0.5">
                {(file.size / (1024 * 1024)).toFixed(2)} MB • {isPdf ? 'PDF Document' : 'Image Receipt'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onRemoveFile}
            className="p-2 rounded-xl text-brown-300 hover:text-red-400 hover:bg-brown-800/80 transition-colors"
            title="Remove document"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default DropzoneInput;

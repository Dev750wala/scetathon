'use client';
import { useState, useRef, useEffect } from 'react';

interface PhotoUploadProps {
  onFileSelect: (file: File | null) => void;
}

export default function PhotoUpload({ onFileSelect }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Revoke object URL on cleanup to prevent memory leaks
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFile = (file: File) => {
    if (preview) URL.revokeObjectURL(preview);
    onFileSelect(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Photo Evidence (optional)</label>
      {preview ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className="w-full max-h-48 object-cover rounded-xl border border-gray-200" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm hover:bg-red-600"
          >
            ✕
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors">
          <span className="text-2xl mb-1">📷</span>
          <span className="text-sm text-gray-500">Click or drag to upload</span>
          <span className="text-xs text-gray-400 mt-0.5">JPEG, PNG, WebP up to 10MB</span>
          <input ref={inputRef} type="file" className="hidden" accept="image/*" onChange={handleChange} />
        </label>
      )}
    </div>
  );
}

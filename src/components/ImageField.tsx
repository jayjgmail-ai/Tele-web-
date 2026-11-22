import { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  required?: boolean;
  allowClear?: boolean;
}

const MAX_IMAGE_DIM = 1200;
const TARGET_MAX_DATAURL_CHARS = 450_000;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Unable to read image file.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not decode selected image.'));
    img.src = src;
  });
}

async function compressImageFile(file: File): Promise<string> {
  const rawDataUrl = await readFileAsDataUrl(file);
  if (file.type === 'image/gif' && rawDataUrl.length <= TARGET_MAX_DATAURL_CHARS) {
    return rawDataUrl;
  }

  try {
    const img = await loadImage(rawDataUrl);
    const origW = img.naturalWidth || img.width;
    const origH = img.naturalHeight || img.height;
    if (!origW || !origH) return rawDataUrl;

    const scale = Math.min(1, MAX_IMAGE_DIM / Math.max(origW, origH));
    let targetW = Math.max(1, Math.round(origW * scale));
    let targetH = Math.max(1, Math.round(origH * scale));

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return rawDataUrl;

    const mime = file.type === 'image/png' ? 'image/webp' : 'image/jpeg';
    let quality = 0.82;

    for (let attempt = 0; attempt < 3; attempt++) {
      canvas.width = targetW;
      canvas.height = targetH;
      ctx.clearRect(0, 0, targetW, targetH);
      ctx.drawImage(img, 0, 0, targetW, targetH);

      let output = canvas.toDataURL(mime, quality);
      if (!output.startsWith(`data:${mime}`)) {
        output = canvas.toDataURL('image/jpeg', quality);
      }
      if (output.length <= TARGET_MAX_DATAURL_CHARS || attempt === 2) {
        return output;
      }
      targetW = Math.max(1, Math.round(targetW * 0.75));
      targetH = Math.max(1, Math.round(targetH * 0.75));
      quality = Math.max(0.65, quality - 0.1);
    }

    return rawDataUrl;
  } catch {
    return rawDataUrl;
  }
}

export default function ImageField({
  label,
  value,
  onChange,
  placeholder = 'https://...',
  required = false,
  allowClear = false,
}: ImageFieldProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    setUploadError(null);
    setIsProcessing(true);
    try {
      const compressed = await compressImageFile(file);
      onChange(compressed);
    } catch {
      setUploadError('Could not process this photo. Try another image or paste a URL.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-bold text-slate-700 uppercase">{label}</label>}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="flex items-center gap-2 flex-1">
          {value ? (
            <img
              src={value}
              alt={label || 'Uploaded preview'}
              className="w-10 h-10 rounded-lg object-contain border border-pink-200 shrink-0 bg-slate-100"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
              <ImageIcon className="w-4 h-4" />
            </div>
          )}
          <input
            type="text"
            required={required}
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              setUploadError(null);
              onChange(e.target.value);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2.5 rounded-xl bg-pink-50 hover:bg-pink-600 hover:text-white text-pink-800 border border-pink-200 font-bold text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap disabled:opacity-60"
          >
            <Upload className="w-3.5 h-3.5" />
            {isProcessing ? 'Optimizing...' : 'Upload Photo'}
          </button>
          {allowClear && value && (
            <button
              type="button"
              onClick={() => {
                setUploadError(null);
                onChange('');
              }}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200"
              title="Clear image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      {uploadError && <p className="text-xs font-semibold text-red-600">{uploadError}</p>}
    </div>
  );
}

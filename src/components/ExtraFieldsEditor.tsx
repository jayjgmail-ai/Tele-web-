import { Plus, Trash2, Image as ImageIcon, ListPlus } from 'lucide-react';
import { ExtraDetailItem } from '../types';
import ImageField from './ImageField';

interface StringListEditorProps {
  label: string;
  items: string[];
  onChange: (next: string[]) => void;
  addButtonText?: string;
  placeholder?: string;
}

export function StringListEditor({
  label,
  items,
  onChange,
  addButtonText = 'Add Extra Item',
  placeholder = 'Enter item...',
}: StringListEditorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="block text-xs font-bold text-slate-700 uppercase">{label}</label>
        <button
          type="button"
          onClick={() => onChange([...items, ''])}
          className="px-2.5 py-1 rounded-lg bg-pink-600 text-white text-[11px] font-bold hover:bg-pink-500 flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
          {addButtonText}
        </button>
      </div>
      <div className="space-y-2">
        {items.map((val, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={val}
              placeholder={placeholder}
              onChange={(e) => {
                const updated = [...items];
                updated[idx] = e.target.value;
                onChange(updated);
              }}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-pink-600"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== idx))}
              className="p-2 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white shrink-0"
              title="Remove"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-xs text-slate-400 italic bg-slate-50 px-3 py-2 rounded-xl border border-dashed border-slate-200">
            No items yet. Click &ldquo;{addButtonText}&rdquo; to add one.
          </div>
        )}
      </div>
    </div>
  );
}

interface ExtraFieldsEditorProps {
  extraDetails: ExtraDetailItem[];
  onChangeDetails: (next: ExtraDetailItem[]) => void;
  extraPhotos: string[];
  onChangePhotos: (next: string[]) => void;
}

export function ExtraFieldsEditor({
  extraDetails,
  onChangeDetails,
  extraPhotos,
  onChangePhotos,
}: ExtraFieldsEditorProps) {
  return (
    <div className="space-y-4 pt-3 border-t border-pink-100">
      {/* Extra Custom Fields / Info */}
      <div className="space-y-2 bg-pink-50/40 p-3.5 rounded-2xl border border-pink-100">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-black text-slate-800 uppercase flex items-center gap-1.5">
            <ListPlus className="w-3.5 h-3.5 text-pink-600" />
            Extra Custom Details ({extraDetails.length})
          </span>
          <button
            type="button"
            onClick={() => onChangeDetails([...extraDetails, { label: '', value: '' }])}
            className="px-2.5 py-1 rounded-lg bg-pink-600 text-white text-[11px] font-bold hover:bg-pink-500 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Add Extra Detail
          </button>
        </div>

        {extraDetails.map((detail, idx) => (
          <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
            <input
              type="text"
              placeholder="Field Title (e.g. Venue / Age)"
              value={detail.label}
              onChange={(e) => {
                const updated = [...extraDetails];
                updated[idx] = { ...updated[idx], label: e.target.value };
                onChangeDetails(updated);
              }}
              className="sm:col-span-5 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-pink-600"
            />
            <input
              type="text"
              placeholder="Value / Information"
              value={detail.value}
              onChange={(e) => {
                const updated = [...extraDetails];
                updated[idx] = { ...updated[idx], value: e.target.value };
                onChangeDetails(updated);
              }}
              className="sm:col-span-6 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-pink-600"
            />
            <button
              type="button"
              onClick={() => onChangeDetails(extraDetails.filter((_, i) => i !== idx))}
              className="sm:col-span-1 p-2 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white flex items-center justify-center"
              title="Remove field"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Extra Gallery Photos */}
      <div className="space-y-2 bg-purple-50/40 p-3.5 rounded-2xl border border-purple-100">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-black text-slate-800 uppercase flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-purple-700" />
            Extra Photos ({extraPhotos.length})
          </span>
          <button
            type="button"
            onClick={() => onChangePhotos([...extraPhotos, ''])}
            className="px-2.5 py-1 rounded-lg bg-purple-700 text-white text-[11px] font-bold hover:bg-purple-600 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Add Extra Photo
          </button>
        </div>

        {extraPhotos.map((photoUrl, idx) => (
          <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Extra Photo #{idx + 1}</span>
              <button
                type="button"
                onClick={() => onChangePhotos(extraPhotos.filter((_, i) => i !== idx))}
                className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Remove
              </button>
            </div>
            <ImageField
              label=""
              value={photoUrl}
              allowClear
              placeholder="Paste image URL or upload file"
              onChange={(val) => {
                const updated = [...extraPhotos];
                updated[idx] = val;
                onChangePhotos(updated);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

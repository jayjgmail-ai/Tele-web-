import { useRef, useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Type,
  Palette,
  Link2,
  List,
  Heading2,
  Minus,
  Eye,
  Edit3,
  Check,
  X,
} from 'lucide-react';
import { COLOR_SWATCHES, FONT_OPTIONS } from '../data/siteContent';
import RichTextRenderer from './RichTextRenderer';

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  singleLine?: boolean;
  placeholder?: string;
}

export default function RichTextEditor({
  label,
  value,
  onChange,
  rows = 3,
  singleLine = false,
  placeholder = '',
}: RichTextEditorProps) {
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showLinkBox, setShowLinkBox] = useState(false);
  const [linkLabel, setLinkLabel] = useState('');
  const [linkUrl, setLinkUrl] = useState('https://');
  const [customColor, setCustomColor] = useState('#db2777');

  const wrapSelection = (before: string, after: string, fallbackText = 'text') => {
    const el = inputRef.current;
    if (!el) {
      onChange(`${value}${before}${fallbackText}${after}`);
      return;
    }
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const selected = value.slice(start, end) || fallbackText;
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    setTimeout(() => {
      el.focus();
      const cursorPos = start + before.length + selected.length;
      el.setSelectionRange(start + before.length, cursorPos);
    }, 0);
  };

  const insertAtLineStart = (prefix: string) => {
    const el = inputRef.current;
    if (!el) {
      onChange(value ? `${value}\n${prefix}` : prefix);
      return;
    }
    const start = el.selectionStart ?? value.length;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const next = value.slice(0, lineStart) + prefix + value.slice(lineStart);
    onChange(next);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 0);
  };

  const handleInsertLink = () => {
    if (!linkUrl.trim()) return;
    const labelToUse = linkLabel.trim() || linkUrl.trim();
    wrapSelection(`[link=${linkUrl.trim()}]`, `[/link]`, labelToUse);
    setShowLinkBox(false);
    setLinkLabel('');
    setLinkUrl('https://');
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <label className="block text-xs font-bold text-slate-700 uppercase">{label}</label>
        <button
          type="button"
          onClick={() => setShowPreview((p) => !p)}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 border transition-colors ${
            showPreview
              ? 'bg-pink-600 text-white border-pink-600'
              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-pink-50'
          }`}
        >
          {showPreview ? <Edit3 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          {showPreview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {/* Formatting Toolbar */}
      {!showPreview && (
        <div className="relative bg-slate-100 border border-slate-200 rounded-t-xl px-2 py-1.5 flex flex-wrap items-center gap-1">
          <button
            type="button"
            title="Bold"
            onClick={() => wrapSelection('**', '**', 'bold text')}
            className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-pink-600 transition-colors"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Italic"
            onClick={() => wrapSelection('*', '*', 'italic text')}
            className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-pink-600 transition-colors"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Underline"
            onClick={() => wrapSelection('__', '__', 'underlined text')}
            className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-pink-600 transition-colors"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-slate-300 mx-0.5" />

          {/* Font Family Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowFontMenu((v) => !v);
                setShowColorMenu(false);
                setShowLinkBox(false);
              }}
              className="px-2 py-1 rounded-lg hover:bg-white text-slate-700 hover:text-pink-600 text-[11px] font-bold flex items-center gap-1 transition-colors"
              title="Select Font for Text"
            >
              <Type className="w-3.5 h-3.5" />
              Font
            </button>
            {showFontMenu && (
              <div className="absolute left-0 top-full mt-1 z-30 w-52 bg-white border border-pink-200 rounded-xl shadow-xl p-1.5 space-y-0.5">
                {FONT_OPTIONS.filter((f) => f.id !== 'default').map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      wrapSelection(`[font=${f.id}]`, '[/font]', 'styled text');
                      setShowFontMenu(false);
                    }}
                    style={{ fontFamily: f.cssFamily }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-800 hover:bg-pink-50 hover:text-pink-700"
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Text Color Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowColorMenu((v) => !v);
                setShowFontMenu(false);
                setShowLinkBox(false);
              }}
              className="px-2 py-1 rounded-lg hover:bg-white text-slate-700 hover:text-pink-600 text-[11px] font-bold flex items-center gap-1 transition-colors"
              title="Select Text Color"
            >
              <Palette className="w-3.5 h-3.5 text-pink-600" />
              Color
            </button>
            {showColorMenu && (
              <div className="absolute left-0 top-full mt-1 z-30 w-60 bg-white border border-pink-200 rounded-xl shadow-xl p-3 space-y-2.5">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Pick Text Color</div>
                <div className="grid grid-cols-6 gap-1.5">
                  {COLOR_SWATCHES.filter((c) => c.hex !== '#ffffff').map((swatch) => (
                    <button
                      key={swatch.hex}
                      type="button"
                      title={swatch.label}
                      onClick={() => {
                        wrapSelection(`[color=${swatch.hex}]`, '[/color]', 'colored text');
                        setShowColorMenu(false);
                      }}
                      className="w-7 h-7 rounded-lg border border-slate-300 shadow-xs hover:scale-110 transition-transform"
                      style={{ backgroundColor: swatch.hex }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="w-8 h-7 rounded border border-slate-200 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      wrapSelection(`[color=${customColor}]`, '[/color]', 'colored text');
                      setShowColorMenu(false);
                    }}
                    className="flex-1 px-2.5 py-1 rounded-lg bg-pink-600 text-white text-[11px] font-bold hover:bg-pink-500"
                  >
                    Apply {customColor}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Text Size Quick Tag */}
          <select
            aria-label="Text Size"
            defaultValue=""
            onChange={(e) => {
              const sz = e.target.value;
              if (!sz) return;
              wrapSelection(`[size=${sz}]`, '[/size]', 'sized text');
              e.target.value = '';
            }}
            className="px-1.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-700 focus:outline-none"
          >
            <option value="">Size</option>
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
            <option value="xl">Extra Large</option>
          </select>

          {!singleLine && (
            <>
              <div className="w-px h-4 bg-slate-300 mx-0.5" />
              <button
                type="button"
                title="Insert Subheading / Topic Title"
                onClick={() => insertAtLineStart('## ')}
                className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-pink-600 transition-colors"
              >
                <Heading2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                title="Insert Bullet Point"
                onClick={() => insertAtLineStart('- ')}
                className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-pink-600 transition-colors"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                title="Insert Divider Line"
                onClick={() => onChange(value ? `${value}\n---\n` : '---\n')}
                className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-pink-600 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* Insert Link */}
          <div className="relative">
            <button
              type="button"
              title="Insert Link"
              onClick={() => {
                setShowLinkBox((v) => !v);
                setShowColorMenu(false);
                setShowFontMenu(false);
              }}
              className="px-2 py-1 rounded-lg hover:bg-white text-slate-700 hover:text-pink-600 text-[11px] font-bold flex items-center gap-1 transition-colors"
            >
              <Link2 className="w-3.5 h-3.5" />
              Insert Link
            </button>
            {showLinkBox && (
              <div className="absolute right-0 top-full mt-1 z-30 w-64 bg-white border border-pink-200 rounded-xl shadow-xl p-3 space-y-2">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Insert Clickable Link</div>
                <input
                  type="text"
                  placeholder="Link text (e.g. Learn More)"
                  value={linkLabel}
                  onChange={(e) => setLinkLabel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                />
                <input
                  type="text"
                  placeholder="https://..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                />
                <div className="flex justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowLinkBox(false)}
                    className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleInsertLink}
                    className="px-2.5 py-1 rounded-lg bg-pink-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-pink-500"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Insert
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showPreview ? (
        <div className="w-full bg-white border border-pink-200 rounded-xl px-4 py-3 text-sm text-slate-900 min-h-[44px] shadow-xs">
          {value ? (
            <RichTextRenderer text={value} inline={singleLine} />
          ) : (
            <span className="text-slate-400 italic">Nothing entered yet...</span>
          )}
        </div>
      ) : singleLine ? (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-50 border border-t-0 border-slate-200 rounded-b-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600 shadow-xs"
        />
      ) : (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-50 border border-t-0 border-slate-200 rounded-b-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600 shadow-xs"
        />
      )}
    </div>
  );
}

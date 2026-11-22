import { useState } from 'react';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Copy,
  Eye,
  EyeOff,
  FileText,
  Image as ImageIcon,
  ListChecks,
  Quote,
  LayoutGrid,
  MousePointerClick,
  Minus,
  Palette,
  Type,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import {
  COLOR_SWATCHES,
  CustomBlockType,
  CustomPageBlock,
  FONT_OPTIONS,
  PageStyleConfig,
  getFontCss,
} from '../data/siteContent';
import ImageField from './ImageField';
import RichTextEditor from './RichTextEditor';

interface ColorPickerRowProps {
  label: string;
  value?: string;
  onChange: (val: string) => void;
  defaultDisplay?: string;
}

export function ColorPickerRow({
  label,
  value = '',
  onChange,
  defaultDisplay = '#0f172a',
}: ColorPickerRowProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-700 uppercase">{label}</span>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[10px] font-bold text-pink-600 hover:underline"
          >
            Reset
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {COLOR_SWATCHES.map((swatch) => (
          <button
            key={swatch.hex}
            type="button"
            title={swatch.label}
            onClick={() => onChange(swatch.hex)}
            className={`w-6 h-6 rounded-md border transition-transform hover:scale-110 ${
              value.toLowerCase() === swatch.hex.toLowerCase()
                ? 'ring-2 ring-pink-600 border-slate-900 scale-110'
                : 'border-slate-300'
            }`}
            style={{ backgroundColor: swatch.hex }}
          />
        ))}
        <label className="flex items-center gap-1.5 ml-1 px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 cursor-pointer text-[11px] font-bold text-slate-700">
          <input
            type="color"
            value={value || defaultDisplay}
            onChange={(e) => onChange(e.target.value)}
            className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
          />
          <span>{value || 'Default'}</span>
        </label>
      </div>
    </div>
  );
}

interface PageStyleStudioProps {
  sectionLabel: string;
  styleConfig: PageStyleConfig;
  onChangeStyle: (next: PageStyleConfig) => void;
  onApplyToAllPages: () => void;
  onResetStyle: () => void;
}

export function PageStyleStudio({
  sectionLabel,
  styleConfig,
  onChangeStyle,
  onApplyToAllPages,
  onResetStyle,
}: PageStyleStudioProps) {
  const [appliedAllNotice, setAppliedAllNotice] = useState(false);
  const previewFontCss = getFontCss(styleConfig.fontFamily);

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
            <Palette className="w-4 h-4 text-pink-600" />
            Fonts &amp; Colors for {sectionLabel}
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Customize the font style, text size, heading color, text color, and background for this page.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onApplyToAllPages();
              setAppliedAllNotice(true);
              setTimeout(() => setAppliedAllNotice(false), 2000);
            }}
            className="px-3 py-1.5 rounded-xl bg-purple-700 text-white text-xs font-bold hover:bg-purple-600 transition-colors"
          >
            {appliedAllNotice ? 'Applied to All Pages!' : 'Apply to All Pages'}
          </button>
          <button
            type="button"
            onClick={onResetStyle}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Page Style
          </button>
        </div>
      </div>

      {/* Live Style Preview */}
      <div
        className="rounded-2xl border border-pink-200 p-6 space-y-2 shadow-xs"
        style={{
          fontFamily: previewFontCss,
          backgroundColor: styleConfig.backgroundColor || '#ffffff',
          color: styleConfig.textColor || '#0f172a',
        }}
      >
        <span
          className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase text-white"
          style={{ backgroundColor: styleConfig.accentColor || '#db2777' }}
        >
          Live Preview
        </span>
        <h4
          className="text-2xl font-black tracking-tight"
          style={{ color: styleConfig.headingColor || '#0f172a' }}
        >
          Telesports — Adding Value Through Sports
        </h4>
        <p className="text-sm leading-relaxed">
          This preview reflects your chosen font, text size, heading color, body text color, and page background.
        </p>
      </div>

      {/* Font Family & Text Size */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-pink-600" />
            Page Font Family
          </label>
          <select
            value={styleConfig.fontFamily || 'default'}
            onChange={(e) => onChangeStyle({ ...styleConfig, fontFamily: e.target.value })}
            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600"
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase">Text Size Scale</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'sm', label: 'Compact' },
              { id: 'md', label: 'Standard' },
              { id: 'lg', label: 'Large' },
            ].map((sz) => (
              <button
                key={sz.id}
                type="button"
                onClick={() =>
                  onChangeStyle({ ...styleConfig, textScale: sz.id as PageStyleConfig['textScale'] })
                }
                className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  (styleConfig.textScale || 'md') === sz.id
                    ? 'bg-pink-600 text-white border-pink-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-pink-50'
                }`}
              >
                {sz.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Color Pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <ColorPickerRow
          label="Heading Color"
          value={styleConfig.headingColor}
          defaultDisplay="#0f172a"
          onChange={(val) => onChangeStyle({ ...styleConfig, headingColor: val })}
        />
        <ColorPickerRow
          label="Body Text Color"
          value={styleConfig.textColor}
          defaultDisplay="#0f172a"
          onChange={(val) => onChangeStyle({ ...styleConfig, textColor: val })}
        />
        <ColorPickerRow
          label="Accent & Badge Color"
          value={styleConfig.accentColor}
          defaultDisplay="#db2777"
          onChange={(val) => onChangeStyle({ ...styleConfig, accentColor: val })}
        />
        <ColorPickerRow
          label="Page Background Color"
          value={styleConfig.backgroundColor}
          defaultDisplay="#ffffff"
          onChange={(val) => onChangeStyle({ ...styleConfig, backgroundColor: val })}
        />
      </div>
    </div>
  );
}

interface PageBlocksStudioProps {
  sectionLabel: string;
  blocks: CustomPageBlock[];
  onChangeBlocks: (next: CustomPageBlock[]) => void;
}

const BLOCK_TYPE_OPTIONS: {
  type: CustomBlockType;
  label: string;
  description: string;
  icon: typeof FileText;
}[] = [
  { type: 'topic', label: 'Add Topic', description: 'Title, rich words & optional photo', icon: FileText },
  { type: 'image', label: 'Add Image', description: 'Upload or link photo with caption', icon: ImageIcon },
  { type: 'list', label: 'Add List', description: 'Bullets, numbers, or checklist', icon: ListChecks },
  { type: 'cards', label: 'Add Topic Cards', description: 'Multi-column topic grid', icon: LayoutGrid },
  { type: 'callout', label: 'Add Callout / Quote', description: 'Highlighted quote or notice', icon: Quote },
  { type: 'cta', label: 'Add Button / Link', description: 'Action button or external link', icon: MousePointerClick },
  { type: 'divider', label: 'Add Divider', description: 'Section separator line', icon: Minus },
];

const NAV_DESTINATIONS = [
  { id: 'contact', label: 'Admissions / Trial Booking Page' },
  { id: 'programs', label: 'Programs Page' },
  { id: 'partners', label: 'Our Partners Page' },
  { id: 'coaches', label: 'Coaches Page' },
  { id: 'coach-jobs', label: 'Coach Careers Page' },
  { id: 'parent-requests', label: 'Parent Requests Page' },
  { id: 'merchandise', label: 'Store & Merch Page' },
  { id: 'announcements', label: 'Announcements Page' },
  { id: 'aicoach', label: 'AI Coach Page' },
  { id: 'news', label: 'News Page' },
  { id: 'url', label: 'External Website Link (URL)' },
];

export function PageBlocksStudio({ sectionLabel, blocks, onChangeBlocks }: PageBlocksStudioProps) {
  const [expandedId, setExpandedId] = useState<string | null>(blocks[0]?.id || null);

  const createBlock = (type: CustomBlockType): CustomPageBlock => {
    const id = `blk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    switch (type) {
      case 'topic':
        return {
          id,
          type: 'topic',
          position: 'bottom',
          badge: 'Featured Topic',
          title: 'New Academy Topic',
          body: 'Write your topic details here. Use the toolbar above to choose fonts, colors, bold text, links, and bullets.',
          imageUrl: '',
          imagePosition: 'right',
          fontFamily: 'default',
          textSize: 'md',
          align: 'left',
          visible: true,
        };
      case 'image':
        return {
          id,
          type: 'image',
          position: 'bottom',
          title: 'Campus Photo Highlight',
          imageUrl: '',
          imagePosition: 'top',
          imageCaption: 'Add a caption or description for this photo.',
          align: 'center',
          visible: true,
        };
      case 'list':
        return {
          id,
          type: 'list',
          position: 'bottom',
          badge: 'Key Highlights',
          title: 'Program Highlights & Schedule',
          body: '',
          items: ['First key point or topic', 'Second key point or requirement'],
          listStyle: 'checks',
          fontFamily: 'default',
          textSize: 'md',
          align: 'left',
          visible: true,
        };
      case 'cards':
        return {
          id,
          type: 'cards',
          position: 'bottom',
          badge: 'Topics Grid',
          title: 'Explore More Topics',
          cards: [
            {
              id: `card-${Date.now()}-1`,
              badge: 'Topic 1',
              title: 'Athletic Development',
              description: 'Structured physical conditioning and tactical awareness.',
              imageUrl: '',
            },
            {
              id: `card-${Date.now()}-2`,
              badge: 'Topic 2',
              title: 'Leadership & Teamwork',
              description: 'Building discipline, communication, and sportsmanship.',
              imageUrl: '',
            },
          ],
          fontFamily: 'default',
          textSize: 'md',
          align: 'left',
          visible: true,
        };
      case 'callout':
        return {
          id,
          type: 'callout',
          position: 'bottom',
          badge: 'Special Notice',
          title: 'Important Academy Update',
          body: 'Share a highlighted message, quote, or announcement for visitors on this page.',
          accentColor: '#db2777',
          fontFamily: 'default',
          textSize: 'md',
          align: 'left',
          visible: true,
        };
      case 'cta':
        return {
          id,
          type: 'cta',
          position: 'bottom',
          badge: 'Take Action',
          title: 'Ready to Get Started?',
          body: 'Connect with our academy team or explore our programs today.',
          buttonLabel: 'Register Now',
          buttonAction: 'contact',
          buttonUrl: '',
          accentColor: '#db2777',
          align: 'center',
          visible: true,
        };
      case 'divider':
        return {
          id,
          type: 'divider',
          position: 'bottom',
          accentColor: '#fbcfe8',
          visible: true,
        };
    }
  };

  const handleAddBlock = (type: CustomBlockType) => {
    const newBlock = createBlock(type);
    onChangeBlocks([...blocks, newBlock]);
    setExpandedId(newBlock.id);
  };

  const updateBlock = (id: string, patch: Partial<CustomPageBlock>) => {
    onChangeBlocks(blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  };

  const moveBlock = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= blocks.length) return;
    const copy = [...blocks];
    const [removed] = copy.splice(index, 1);
    copy.splice(target, 0, removed);
    onChangeBlocks(copy);
  };

  const duplicateBlock = (block: CustomPageBlock, index: number) => {
    const clone: CustomPageBlock = {
      ...JSON.parse(JSON.stringify(block)),
      id: `blk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    };
    const copy = [...blocks];
    copy.splice(index + 1, 0, clone);
    onChangeBlocks(copy);
    setExpandedId(clone.id);
  };

  const deleteBlock = (id: string) => {
    onChangeBlocks(blocks.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Insert Toolbar */}
      <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-200 space-y-3">
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-600" />
            Insert Content onto {sectionLabel}
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Add new topics, upload images, insert checklists, highlight callouts, topic cards, action buttons, or dividers.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {BLOCK_TYPE_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.type}
                type="button"
                onClick={() => handleAddBlock(opt.type)}
                className="p-2.5 rounded-xl bg-white border border-pink-200 hover:border-pink-600 hover:bg-pink-600 hover:text-white text-left transition-all group shadow-xs"
              >
                <div className="flex items-center gap-1.5 font-black text-xs">
                  <Plus className="w-3.5 h-3.5 text-pink-600 group-hover:text-yellow-300 shrink-0" />
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{opt.label}</span>
                </div>
                <div className="text-[10px] text-slate-500 group-hover:text-pink-100 mt-1 leading-tight">
                  {opt.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Added Blocks List */}
      {blocks.length === 0 ? (
        <div className="text-center py-10 rounded-2xl border border-dashed border-pink-300 bg-slate-50 space-y-2">
          <p className="text-sm font-bold text-slate-700">No extra topics or images inserted on this page yet.</p>
          <p className="text-xs text-slate-500">
            Click any button above (such as <strong>+ Add Topic</strong> or <strong>+ Add Image</strong>) to insert new content.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {blocks.map((block, idx) => {
            const isExpanded = expandedId === block.id;
            const meta = BLOCK_TYPE_OPTIONS.find((o) => o.type === block.type);
            const BlockIcon = meta?.icon || FileText;

            return (
              <div
                key={block.id}
                className={`rounded-2xl border overflow-hidden transition-all ${
                  block.visible === false
                    ? 'border-slate-200 bg-slate-50 opacity-75'
                    : 'border-pink-200 bg-white shadow-sm'
                }`}
              >
                {/* Block Header Bar */}
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : block.id)}
                    className="flex items-center gap-2 text-left flex-1 min-w-0"
                  >
                    <BlockIcon className="w-4 h-4 text-pink-600 shrink-0" />
                    <span className="px-2 py-0.5 rounded bg-pink-100 text-pink-800 text-[10px] font-black uppercase">
                      {block.type}
                    </span>
                    <span className="text-xs font-extrabold text-slate-900 truncate">
                      {block.title || block.imageCaption || block.buttonLabel || `Block #${idx + 1}`}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      ({block.position === 'top' ? 'Top' : 'Bottom'})
                    </span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveBlock(idx, -1)}
                      disabled={idx === 0}
                      title="Move Up"
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-pink-600 disabled:opacity-40"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveBlock(idx, 1)}
                      disabled={idx === blocks.length - 1}
                      title="Move Down"
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-pink-600 disabled:opacity-40"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => duplicateBlock(block, idx)}
                      title="Duplicate Block"
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-pink-600"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => updateBlock(block.id, { visible: block.visible === false })}
                      title={block.visible === false ? 'Show on Page' : 'Hide from Page'}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-pink-600"
                    >
                      {block.visible === false ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteBlock(block.id)}
                      title="Delete Block"
                      className="p-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : block.id)}
                      className="p-1.5 rounded-lg bg-pink-50 border border-pink-200 text-pink-700"
                    >
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Block Editor */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 space-y-4">
                    {/* Placement + Typography Controls */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                          Placement
                        </label>
                        <select
                          value={block.position || 'bottom'}
                          onChange={(e) =>
                            updateBlock(block.id, { position: e.target.value as 'top' | 'bottom' })
                          }
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                        >
                          <option value="bottom">Bottom of Page</option>
                          <option value="top">Top of Page</option>
                        </select>
                      </div>

                      {block.type !== 'divider' && (
                        <>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                              Block Font
                            </label>
                            <select
                              value={block.fontFamily || 'default'}
                              onChange={(e) => updateBlock(block.id, { fontFamily: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                            >
                              {FONT_OPTIONS.map((f) => (
                                <option key={f.id} value={f.id}>
                                  {f.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                              Text Size
                            </label>
                            <select
                              value={block.textSize || 'md'}
                              onChange={(e) =>
                                updateBlock(block.id, {
                                  textSize: e.target.value as CustomPageBlock['textSize'],
                                })
                              }
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                            >
                              <option value="sm">Small</option>
                              <option value="md">Standard</option>
                              <option value="lg">Large</option>
                              <option value="xl">Extra Large</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                              Alignment
                            </label>
                            <select
                              value={block.align || 'left'}
                              onChange={(e) =>
                                updateBlock(block.id, {
                                  align: e.target.value as CustomPageBlock['align'],
                                })
                              }
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                            >
                              <option value="left">Left</option>
                              <option value="center">Center</option>
                              <option value="right">Right</option>
                            </select>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Block Content Fields by Type */}
                    {block.type !== 'divider' && block.type !== 'image' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                            Topic Tag / Badge (Optional)
                          </label>
                          <input
                            type="text"
                            value={block.badge || ''}
                            placeholder="e.g. Featured Topic"
                            onChange={(e) => updateBlock(block.id, { badge: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900"
                          />
                        </div>
                        <div>
                          <RichTextEditor
                            label="Heading / Topic Title"
                            singleLine
                            value={block.title || ''}
                            onChange={(val) => updateBlock(block.id, { title: val })}
                          />
                        </div>
                      </div>
                    )}

                    {(block.type === 'topic' ||
                      block.type === 'callout' ||
                      block.type === 'list' ||
                      block.type === 'cards' ||
                      block.type === 'cta') && (
                      <RichTextEditor
                        label={block.type === 'callout' ? 'Callout / Quote Message' : 'Body / Description'}
                        rows={3}
                        value={block.body || ''}
                        onChange={(val) => updateBlock(block.id, { body: val })}
                        placeholder="Write words here and use the toolbar to format font, color, bold, bullets, or links..."
                      />
                    )}

                    {block.type === 'topic' && (
                      <div className="space-y-3 bg-pink-50/40 p-3.5 rounded-xl border border-pink-100">
                        <ImageField
                          label="Topic Photo (Optional — Upload or Paste URL)"
                          value={block.imageUrl || ''}
                          allowClear
                          onChange={(val) => updateBlock(block.id, { imageUrl: val })}
                        />
                        {block.imageUrl && (
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                              Photo Layout Position
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { id: 'top', label: 'Above Text' },
                                { id: 'left', label: 'Left Side' },
                                { id: 'right', label: 'Right Side' },
                              ].map((pos) => (
                                <button
                                  key={pos.id}
                                  type="button"
                                  onClick={() =>
                                    updateBlock(block.id, {
                                      imagePosition: pos.id as CustomPageBlock['imagePosition'],
                                    })
                                  }
                                  className={`py-2 rounded-lg text-xs font-bold border ${
                                    (block.imagePosition || 'top') === pos.id
                                      ? 'bg-pink-600 text-white border-pink-600'
                                      : 'bg-white text-slate-700 border-slate-200'
                                  }`}
                                >
                                  {pos.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {block.type === 'image' && (
                      <div className="space-y-3 bg-pink-50/40 p-3.5 rounded-xl border border-pink-100">
                        <ImageField
                          label="Photo / Image (Upload or Paste URL)"
                          value={block.imageUrl || ''}
                          allowClear
                          onChange={(val) => updateBlock(block.id, { imageUrl: val })}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                              Image Title (Optional)
                            </label>
                            <input
                              type="text"
                              value={block.title || ''}
                              onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                              Display Width
                            </label>
                            <select
                              value={block.imagePosition || 'top'}
                              onChange={(e) =>
                                updateBlock(block.id, {
                                  imagePosition: e.target.value as CustomPageBlock['imagePosition'],
                                })
                              }
                              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900"
                            >
                              <option value="full">Full Container Width</option>
                              <option value="top">Large Centered Banner</option>
                              <option value="left">Medium Card</option>
                            </select>
                          </div>
                        </div>
                        <RichTextEditor
                          label="Caption (Optional)"
                          singleLine
                          value={block.imageCaption || ''}
                          onChange={(val) => updateBlock(block.id, { imageCaption: val })}
                        />
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                            Click Link URL (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="https://..."
                            value={block.buttonUrl || ''}
                            onChange={(e) => updateBlock(block.id, { buttonUrl: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900"
                          />
                        </div>
                      </div>
                    )}

                    {block.type === 'list' && (
                      <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label className="text-xs font-bold text-slate-700 uppercase">List Style &amp; Items</label>
                          <select
                            value={block.listStyle || 'checks'}
                            onChange={(e) =>
                              updateBlock(block.id, {
                                listStyle: e.target.value as CustomPageBlock['listStyle'],
                              })
                            }
                            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800"
                          >
                            <option value="checks">Checkmarks</option>
                            <option value="bullets">Bullets</option>
                            <option value="numbers">Numbered (1, 2, 3)</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          {(block.items || []).map((item, itemIdx) => (
                            <div key={itemIdx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => {
                                  const next = [...(block.items || [])];
                                  next[itemIdx] = e.target.value;
                                  updateBlock(block.id, { items: next });
                                }}
                                placeholder={`List item ${itemIdx + 1}`}
                                className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const next = (block.items || []).filter((_, i) => i !== itemIdx);
                                  updateBlock(block.id, { items: next });
                                }}
                                className="p-2 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() =>
                              updateBlock(block.id, { items: [...(block.items || []), 'New list item'] })
                            }
                            className="px-3 py-1.5 rounded-xl bg-pink-50 text-pink-700 border border-pink-200 font-bold text-xs flex items-center gap-1 hover:bg-pink-600 hover:text-white transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add List Item
                          </button>
                        </div>
                      </div>
                    )}

                    {block.type === 'cards' && (
                      <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700 uppercase">Topic Cards</label>
                          <button
                            type="button"
                            onClick={() =>
                              updateBlock(block.id, {
                                cards: [
                                  ...(block.cards || []),
                                  {
                                    id: `card-${Date.now()}`,
                                    badge: 'New Topic',
                                    title: 'Card Title',
                                    description: 'Card details...',
                                    imageUrl: '',
                                  },
                                ],
                              })
                            }
                            className="px-3 py-1.5 rounded-xl bg-pink-600 text-white font-bold text-xs flex items-center gap-1 hover:bg-pink-500"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add Card
                          </button>
                        </div>

                        <div className="space-y-3">
                          {(block.cards || []).map((card, cIdx) => (
                            <div
                              key={card.id}
                              className="p-3 bg-white rounded-xl border border-slate-200 space-y-2.5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-black text-pink-600 uppercase">
                                  Card {cIdx + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateBlock(block.id, {
                                      cards: (block.cards || []).filter((_, i) => i !== cIdx),
                                    })
                                  }
                                  className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Remove
                                </button>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  placeholder="Badge (optional)"
                                  value={card.badge || ''}
                                  onChange={(e) => {
                                    const next = [...(block.cards || [])];
                                    next[cIdx] = { ...next[cIdx], badge: e.target.value };
                                    updateBlock(block.id, { cards: next });
                                  }}
                                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900"
                                />
                                <input
                                  type="text"
                                  placeholder="Card Title"
                                  value={card.title}
                                  onChange={(e) => {
                                    const next = [...(block.cards || [])];
                                    next[cIdx] = { ...next[cIdx], title: e.target.value };
                                    updateBlock(block.id, { cards: next });
                                  }}
                                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900"
                                />
                              </div>
                              <textarea
                                rows={2}
                                placeholder="Card description..."
                                value={card.description}
                                onChange={(e) => {
                                  const next = [...(block.cards || [])];
                                  next[cIdx] = { ...next[cIdx], description: e.target.value };
                                  updateBlock(block.id, { cards: next });
                                }}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900"
                              />
                              <ImageField
                                label="Card Image (Optional)"
                                value={card.imageUrl || ''}
                                allowClear
                                onChange={(val) => {
                                  const next = [...(block.cards || [])];
                                  next[cIdx] = { ...next[cIdx], imageUrl: val };
                                  updateBlock(block.id, { cards: next });
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {block.type === 'cta' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-pink-50/40 p-3.5 rounded-xl border border-pink-100">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                            Button Label
                          </label>
                          <input
                            type="text"
                            value={block.buttonLabel || ''}
                            onChange={(e) => updateBlock(block.id, { buttonLabel: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                            Button Action
                          </label>
                          <select
                            value={block.buttonAction || 'contact'}
                            onChange={(e) => updateBlock(block.id, { buttonAction: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900"
                          >
                            {NAV_DESTINATIONS.map((dest) => (
                              <option key={dest.id} value={dest.id}>
                                {dest.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        {block.buttonAction === 'url' && (
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                              External Link URL
                            </label>
                            <input
                              type="text"
                              placeholder="https://..."
                              value={block.buttonUrl || ''}
                              onChange={(e) => updateBlock(block.id, { buttonUrl: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Block Colors */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                      {block.type !== 'divider' && (
                        <>
                          <ColorPickerRow
                            label="Block Heading Color"
                            value={block.headingColor}
                            defaultDisplay="#0f172a"
                            onChange={(val) => updateBlock(block.id, { headingColor: val })}
                          />
                          <ColorPickerRow
                            label="Block Text Color"
                            value={block.textColor}
                            defaultDisplay="#334155"
                            onChange={(val) => updateBlock(block.id, { textColor: val })}
                          />
                          <ColorPickerRow
                            label="Block Background Color"
                            value={block.backgroundColor}
                            defaultDisplay="#ffffff"
                            onChange={(val) => updateBlock(block.id, { backgroundColor: val })}
                          />
                        </>
                      )}
                      <ColorPickerRow
                        label={block.type === 'divider' ? 'Divider Line Color' : 'Block Accent / Button Color'}
                        value={block.accentColor}
                        defaultDisplay="#db2777"
                        onChange={(val) => updateBlock(block.id, { accentColor: val })}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

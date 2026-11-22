import { ArrowRight, CheckCircle2, Edit3, Quote } from 'lucide-react';
import { CustomPageBlock, getFontCss } from '../data/siteContent';
import RichTextRenderer from './RichTextRenderer';

interface CustomBlocksRendererProps {
  blocks?: CustomPageBlock[];
  position: 'top' | 'bottom';
  onNavigateTab: (tab: string) => void;
  isAdmin?: boolean;
  onOpenCms?: () => void;
}

function sanitizeExternalUrl(raw?: string): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:')
  ) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export default function CustomBlocksRenderer({
  blocks = [],
  position,
  onNavigateTab,
  isAdmin,
  onOpenCms,
}: CustomBlocksRendererProps) {
  const filtered = blocks.filter(
    (b) => b.visible !== false && (b.position || 'bottom') === position
  );

  if (filtered.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {filtered.map((block) => {
        const fontFamily = getFontCss(block.fontFamily);
        const alignClass =
          block.align === 'center'
            ? 'text-center items-center'
            : block.align === 'right'
              ? 'text-right items-end'
              : 'text-left items-start';
        const sizeClass =
          block.textSize === 'sm'
            ? 'text-sm'
            : block.textSize === 'lg'
              ? 'text-lg'
              : block.textSize === 'xl'
                ? 'text-xl'
                : 'text-base';
        const accent = block.accentColor || '#db2777';
        const cardStyle: React.CSSProperties = {
          fontFamily,
          color: block.textColor || undefined,
          backgroundColor: block.backgroundColor || undefined,
        };
        const headingStyle: React.CSSProperties = {
          color: block.headingColor || undefined,
        };

        if (block.type === 'divider') {
          return (
            <div key={block.id} className="py-2">
              <hr
                className="border-t-2"
                style={{ borderColor: block.accentColor || '#fbcfe8' }}
              />
            </div>
          );
        }

        if (block.type === 'image') {
          const widthClass =
            block.imagePosition === 'full'
              ? 'w-full'
              : block.imagePosition === 'top'
                ? 'max-w-4xl mx-auto'
                : 'max-w-2xl mx-auto';
          const imgContent = block.imageUrl ? (
            <div
              className={`${widthClass} rounded-3xl overflow-hidden border border-pink-100 shadow-lg bg-white`}
              style={cardStyle}
            >
              <img
                src={block.imageUrl}
                alt={block.imageCaption || block.title || 'Page highlight'}
                className="w-full h-auto block"
              />
              {(block.title || block.imageCaption) && (
                <div className={`p-5 flex flex-col gap-1 ${alignClass}`}>
                  {block.title && (
                    <h3 className="text-lg font-black" style={headingStyle}>
                      <RichTextRenderer text={block.title} inline />
                    </h3>
                  )}
                  {block.imageCaption && (
                    <p className={`text-slate-600 ${sizeClass}`} style={{ color: block.textColor || undefined }}>
                      <RichTextRenderer text={block.imageCaption} inline />
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : null;

          if (!imgContent) return null;

          const safeHref = block.buttonUrl ? sanitizeExternalUrl(block.buttonUrl) : null;
          return (
            <div key={block.id} className="relative group">
              {safeHref ? (
                <a href={safeHref} target="_blank" rel="noopener noreferrer" className="block">
                  {imgContent}
                </a>
              ) : (
                imgContent
              )}
            </div>
          );
        }

        if (block.type === 'callout') {
          return (
            <div
              key={block.id}
              className="rounded-3xl border border-pink-200 p-6 sm:p-8 shadow-md bg-pink-50/60"
              style={{
                ...cardStyle,
                borderLeftWidth: '6px',
                borderLeftColor: accent,
              }}
            >
              <div className={`flex flex-col gap-3 ${alignClass}`}>
                <div className="flex items-center gap-2">
                  <Quote className="w-5 h-5 shrink-0" style={{ color: accent }} />
                  {block.badge?.trim() && (
                    <span
                      className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider text-white"
                      style={{ backgroundColor: accent }}
                    >
                      {block.badge}
                    </span>
                  )}
                </div>
                {block.title?.trim() && (
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight" style={headingStyle}>
                    <RichTextRenderer text={block.title} inline />
                  </h3>
                )}
                {block.body?.trim() && (
                  <div className={`leading-relaxed ${sizeClass}`}>
                    <RichTextRenderer text={block.body} />
                  </div>
                )}
              </div>
            </div>
          );
        }

        if (block.type === 'list') {
          const items = (block.items || []).filter((i) => i.trim());
          return (
            <div
              key={block.id}
              className="rounded-3xl border border-pink-100 bg-white p-6 sm:p-8 shadow-lg"
              style={cardStyle}
            >
              <div className={`flex flex-col gap-4 ${alignClass}`}>
                {block.badge?.trim() && (
                  <span
                    className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider text-white"
                    style={{ backgroundColor: accent }}
                  >
                    {block.badge}
                  </span>
                )}
                {block.title?.trim() && (
                  <h3 className="text-2xl font-black tracking-tight" style={headingStyle}>
                    <RichTextRenderer text={block.title} inline />
                  </h3>
                )}
                {block.body?.trim() && (
                  <div className={`text-slate-600 ${sizeClass}`} style={{ color: block.textColor || undefined }}>
                    <RichTextRenderer text={block.body} />
                  </div>
                )}
                {items.length > 0 && (
                  <ul
                    className={`w-full space-y-2.5 ${sizeClass} ${
                      block.listStyle === 'numbers' ? 'list-decimal pl-6' : 'list-none'
                    }`}
                  >
                    {items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        {block.listStyle === 'checks' ? (
                          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: accent }} />
                        ) : block.listStyle === 'numbers' ? (
                          <span className="font-black shrink-0" style={{ color: accent }}>
                            {idx + 1}.
                          </span>
                        ) : (
                          <span
                            className="w-2 h-2 rounded-full shrink-0 mt-2"
                            style={{ backgroundColor: accent }}
                          />
                        )}
                        <span className="flex-1">
                          <RichTextRenderer text={item} inline />
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        }

        if (block.type === 'cards') {
          const cards = block.cards || [];
          return (
            <div key={block.id} className="space-y-6" style={cardStyle}>
              {(block.badge?.trim() || block.title?.trim() || block.body?.trim()) && (
                <div className={`flex flex-col gap-2 ${alignClass}`}>
                  {block.badge?.trim() && (
                    <span
                      className="px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider text-white"
                      style={{ backgroundColor: accent }}
                    >
                      {block.badge}
                    </span>
                  )}
                  {block.title?.trim() && (
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight" style={headingStyle}>
                      <RichTextRenderer text={block.title} inline />
                    </h3>
                  )}
                  {block.body?.trim() && (
                    <div className={`text-slate-600 max-w-3xl ${sizeClass}`} style={{ color: block.textColor || undefined }}>
                      <RichTextRenderer text={block.body} />
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className="rounded-2xl border border-pink-100 bg-white overflow-hidden shadow-md flex flex-col"
                    style={cardStyle}
                  >
                    {card.imageUrl && (
                      <img
                        src={card.imageUrl}
                        alt={card.title}
                        className="w-full h-auto block bg-slate-50"
                      />
                    )}
                    <div className="p-5 space-y-2 flex-1">
                      {card.badge?.trim() && (
                        <span
                          className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-white"
                          style={{ backgroundColor: accent }}
                        >
                          {card.badge}
                        </span>
                      )}
                      <h4 className="text-lg font-extrabold" style={headingStyle}>
                        <RichTextRenderer text={card.title} inline />
                      </h4>
                      <div className={`text-slate-600 ${sizeClass}`} style={{ color: block.textColor || undefined }}>
                        <RichTextRenderer text={card.description} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        if (block.type === 'cta') {
          const isExternal = block.buttonAction === 'url';
          const safeHref = isExternal ? sanitizeExternalUrl(block.buttonUrl) : null;
          return (
            <div
              key={block.id}
              className="rounded-3xl border border-pink-200 bg-pink-50/50 p-6 sm:p-10 shadow-lg"
              style={cardStyle}
            >
              <div className={`flex flex-col gap-4 ${alignClass}`}>
                {block.badge?.trim() && (
                  <span
                    className="px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider text-white"
                    style={{ backgroundColor: accent }}
                  >
                    {block.badge}
                  </span>
                )}
                {block.title?.trim() && (
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight" style={headingStyle}>
                    <RichTextRenderer text={block.title} inline />
                  </h3>
                )}
                {block.body?.trim() && (
                  <div className={`text-slate-600 max-w-2xl ${sizeClass}`} style={{ color: block.textColor || undefined }}>
                    <RichTextRenderer text={block.body} />
                  </div>
                )}
                {block.buttonLabel &&
                  (isExternal && safeHref ? (
                    <a
                      href={safeHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-xl text-white font-black text-sm shadow-md inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: accent }}
                    >
                      <span>{block.buttonLabel}</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onNavigateTab(block.buttonAction || 'contact')}
                      className="px-6 py-3 rounded-xl text-white font-black text-sm shadow-md inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: accent }}
                    >
                      <span>{block.buttonLabel}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ))}
              </div>
            </div>
          );
        }

        // Default: 'topic' block (heading, badge, rich body, optional image with flexible layout)
        const imgPos = block.imagePosition || 'top';
        const isSideLayout = Boolean(block.imageUrl) && (imgPos === 'left' || imgPos === 'right');

        return (
          <div
            key={block.id}
            className="rounded-3xl border border-pink-100 bg-white overflow-hidden shadow-lg p-6 sm:p-8"
            style={cardStyle}
          >
            {isAdmin && onOpenCms && (
              <div className="flex justify-end mb-3">
                <button
                  type="button"
                  onClick={onOpenCms}
                  className="px-3 py-1 rounded-lg bg-yellow-400 text-slate-950 font-black text-[11px] flex items-center gap-1 hover:bg-yellow-300"
                >
                  <Edit3 className="w-3 h-3" />
                  Edit Block
                </button>
              </div>
            )}

            {block.imageUrl && imgPos === 'top' && (
              <div className="mb-6 rounded-2xl overflow-hidden border border-pink-100">
                <img
                  src={block.imageUrl}
                  alt={block.title || 'Topic image'}
                  className="w-full h-auto block"
                />
              </div>
            )}

            <div
              className={
                isSideLayout
                  ? `grid grid-cols-1 md:grid-cols-2 gap-6 items-center`
                  : 'space-y-3'
              }
            >
              {isSideLayout && imgPos === 'left' && block.imageUrl && (
                <div className="rounded-2xl overflow-hidden border border-pink-100 bg-slate-50">
                  <img
                    src={block.imageUrl}
                    alt={block.title || 'Topic image'}
                    className="w-full h-auto block"
                  />
                </div>
              )}

              <div className={`flex flex-col gap-3 ${alignClass}`}>
                {block.badge?.trim() && (
                  <span
                    className="px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider text-white"
                    style={{ backgroundColor: accent }}
                  >
                    {block.badge}
                  </span>
                )}
                {block.title?.trim() && (
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight" style={headingStyle}>
                    <RichTextRenderer text={block.title} inline />
                  </h3>
                )}
                {block.body?.trim() && (
                  <div className={`leading-relaxed ${sizeClass} w-full`}>
                    <RichTextRenderer text={block.body} />
                  </div>
                )}
              </div>

              {isSideLayout && imgPos === 'right' && block.imageUrl && (
                <div className="rounded-2xl overflow-hidden border border-pink-100 bg-slate-50">
                  <img
                    src={block.imageUrl}
                    alt={block.title || 'Topic image'}
                    className="w-full h-auto block"
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

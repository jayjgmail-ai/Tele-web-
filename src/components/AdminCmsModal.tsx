import { useState, useEffect } from 'react';
import {
  SiteContent,
  initialSiteContent,
  PageStyleConfig,
  CustomPageBlock,
} from '../data/siteContent';
import { X, CheckCircle2, Sliders, Save, Type, Palette, PlusCircle, Plus, Trash2 } from 'lucide-react';
import ImageField from './ImageField';
import RichTextEditor from './RichTextEditor';
import { PageStyleStudio, PageBlocksStudio } from './PageBuilderPanel';
import { StringListEditor } from './ExtraFieldsEditor';

interface AdminCmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  content: SiteContent;
  onSaveContent: (newContent: SiteContent) => void;
}

type SectionKey =
  | 'home'
  | 'programs'
  | 'partners'
  | 'coaches'
  | 'coach-jobs'
  | 'parent-requests'
  | 'merchandise'
  | 'announcements'
  | 'aicoach'
  | 'news'
  | 'contact'
  | 'global';

const sectionTabs: { id: SectionKey; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'programs', label: 'Programs' },
  { id: 'partners', label: 'Our Partners' },
  { id: 'coaches', label: 'Coaches' },
  { id: 'coach-jobs', label: 'Coach Careers' },
  { id: 'parent-requests', label: 'Parent Requests' },
  { id: 'merchandise', label: 'Store & Merch' },
  { id: 'announcements', label: 'Announcements' },
  { id: 'aicoach', label: 'AI Coach' },
  { id: 'news', label: 'News' },
  { id: 'contact', label: 'Admissions' },
  { id: 'global', label: 'Header, Nav & Footer' },
];

const TAB_TARGET_OPTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'programs', label: 'Programs' },
  { id: 'partners', label: 'Our Partners' },
  { id: 'coaches', label: 'Coaches' },
  { id: 'coach-jobs', label: 'Coach Careers' },
  { id: 'parent-requests', label: 'Parent Requests' },
  { id: 'merchandise', label: 'Store & Merch' },
  { id: 'announcements', label: 'Announcements' },
  { id: 'aicoach', label: 'AI Coach' },
  { id: 'news', label: 'News' },
  { id: 'contact', label: 'Admissions' },
];

export default function AdminCmsModal({
  isOpen,
  onClose,
  activeTab,
  content,
  onSaveContent,
}: AdminCmsModalProps) {
  const [formData, setFormData] = useState<SiteContent>(content);
  const [selectedSection, setSelectedSection] = useState<SectionKey>('home');
  const [editorMode, setEditorMode] = useState<'content' | 'style' | 'blocks'>('content');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(content);
      const validKeys = sectionTabs.map((s) => s.id);
      if (validKeys.includes(activeTab as SectionKey)) {
        setSelectedSection(activeTab as SectionKey);
      } else {
        setSelectedSection('home');
      }
      setEditorMode('content');
      setSaved(false);
    }
  }, [isOpen, activeTab, content]);

  const currentBlocks: CustomPageBlock[] = formData.pageBlocks?.[selectedSection] || [];
  const currentStyle: PageStyleConfig = formData.pageStyles?.[selectedSection] || {};

  const updateSectionStyle = (nextStyle: PageStyleConfig) => {
    setFormData({
      ...formData,
      pageStyles: {
        ...(formData.pageStyles || {}),
        [selectedSection]: nextStyle,
      },
    });
  };

  const applyStyleToAllPages = () => {
    const nextStyles: Record<string, PageStyleConfig> = { ...(formData.pageStyles || {}) };
    sectionTabs
      .filter((s) => s.id !== 'global')
      .forEach((s) => {
        nextStyles[s.id] = { ...currentStyle };
      });
    setFormData({ ...formData, pageStyles: nextStyles });
  };

  const updateSectionBlocks = (nextBlocks: CustomPageBlock[]) => {
    setFormData({
      ...formData,
      pageBlocks: {
        ...(formData.pageBlocks || {}),
        [selectedSection]: nextBlocks,
      },
    });
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveContent(formData);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 900);
  };

  const inputClass =
    'w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600 shadow-xs';
  const labelClass = 'block text-xs font-bold text-slate-700 uppercase mb-1';

  const homeStats = formData.home.stats || [
    { value: formData.home.stat1Value, label: formData.home.stat1Label },
    { value: formData.home.stat2Value, label: formData.home.stat2Label },
    { value: formData.home.stat3Value, label: formData.home.stat3Label },
  ];

  const homeTiles = formData.home.quickNavTiles || initialSiteContent.home.quickNavTiles;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-white border border-pink-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-pink-100 bg-gradient-to-r from-pink-600 to-purple-700 text-white flex items-center justify-between shrink-0">
          <h2 className="text-lg sm:text-xl font-black uppercase flex items-center gap-2">
            <Sliders className="w-5 h-5 text-yellow-300" />
            Edit Page — {sectionTabs.find((s) => s.id === selectedSection)?.label}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Page Selector Tabs */}
        <div className="px-6 py-3 bg-pink-50/70 border-b border-pink-100 flex items-center gap-1.5 overflow-x-auto shrink-0">
          {sectionTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setSelectedSection(tab.id);
                if (tab.id === 'global') setEditorMode('content');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all ${
                selectedSection === tab.id
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-pink-100 border border-pink-200'
              }`}
            >
              {tab.label}
              {tab.id === activeTab && ' (Current)'}
            </button>
          ))}
        </div>

        {/* Rich Editing Mode Bar */}
        {selectedSection !== 'global' && !saved && (
          <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setEditorMode('content')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                editorMode === 'content'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-pink-50 hover:text-pink-700'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              Words &amp; Photos
            </button>
            <button
              type="button"
              onClick={() => setEditorMode('style')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                editorMode === 'style'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              Fonts &amp; Colors
            </button>
            <button
              type="button"
              onClick={() => setEditorMode('blocks')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                editorMode === 'blocks'
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'bg-pink-50 text-pink-800 border border-pink-200 hover:bg-pink-100'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add Topics, Images &amp; Insert
              {currentBlocks.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-yellow-400 text-slate-950 text-[10px] font-black">
                  {currentBlocks.length}
                </span>
              )}
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {saved ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-pink-600 text-white flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-8 h-8 text-yellow-300" />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase">Page Updated Live!</h3>
            </div>
          ) : (
            <form id="cms-form" onSubmit={handleSubmit} className="space-y-5">
              {/* FONTS & COLORS STUDIO */}
              {selectedSection !== 'global' && editorMode === 'style' && (
                <PageStyleStudio
                  sectionLabel={sectionTabs.find((s) => s.id === selectedSection)?.label || 'Page'}
                  styleConfig={currentStyle}
                  onChangeStyle={updateSectionStyle}
                  onApplyToAllPages={applyStyleToAllPages}
                  onResetStyle={() => updateSectionStyle({})}
                />
              )}

              {/* INSERT & ADD TOPICS / IMAGES / SECTIONS */}
              {selectedSection !== 'global' && editorMode === 'blocks' && (
                <PageBlocksStudio
                  sectionLabel={sectionTabs.find((s) => s.id === selectedSection)?.label || 'Page'}
                  blocks={currentBlocks}
                  onChangeBlocks={updateSectionBlocks}
                />
              )}

              {/* HOME */}
              {selectedSection === 'home' && editorMode === 'content' && (
                <div className="space-y-6">
                  {/* Quick Nav Tiles */}
                  <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <label className={labelClass}>Quick-Navigation Tiles ({homeTiles.length})</label>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            home: {
                              ...formData.home,
                              quickNavTiles: [
                                ...homeTiles,
                                {
                                  id: `tile-${Date.now()}`,
                                  label: 'New Tile',
                                  targetTab: 'programs',
                                  visible: true,
                                },
                              ],
                            },
                          })
                        }
                        className="px-3 py-1 rounded-lg bg-pink-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-pink-500"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Extra Tile
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {homeTiles.map((tile, idx) => (
                        <div key={tile.id} className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Tile Label"
                              value={tile.label}
                              onChange={(e) => {
                                const updated = [...homeTiles];
                                updated[idx] = { ...updated[idx], label: e.target.value };
                                setFormData({ ...formData, home: { ...formData.home, quickNavTiles: updated } });
                              }}
                              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold"
                            />
                            <input
                              type="text"
                              placeholder="Badge (optional)"
                              value={tile.badge || ''}
                              onChange={(e) => {
                                const updated = [...homeTiles];
                                updated[idx] = { ...updated[idx], badge: e.target.value || undefined };
                                setFormData({ ...formData, home: { ...formData.home, quickNavTiles: updated } });
                              }}
                              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              value={tile.targetTab}
                              onChange={(e) => {
                                const updated = [...homeTiles];
                                updated[idx] = { ...updated[idx], targetTab: e.target.value };
                                setFormData({ ...formData, home: { ...formData.home, quickNavTiles: updated } });
                              }}
                              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs"
                            >
                              {TAB_TARGET_OPTIONS.map((t) => (
                                <option key={t.id} value={t.id}>
                                  Go to: {t.label}
                                </option>
                              ))}
                            </select>
                            <input
                              type="text"
                              placeholder="Or external https:// URL"
                              value={tile.url || ''}
                              onChange={(e) => {
                                const updated = [...homeTiles];
                                updated[idx] = { ...updated[idx], url: e.target.value || undefined };
                                setFormData({ ...formData, home: { ...formData.home, quickNavTiles: updated } });
                              }}
                              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs"
                            />
                            <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1 shrink-0">
                              <input
                                type="checkbox"
                                checked={tile.visible !== false}
                                onChange={(e) => {
                                  const updated = [...homeTiles];
                                  updated[idx] = { ...updated[idx], visible: e.target.checked };
                                  setFormData({ ...formData, home: { ...formData.home, quickNavTiles: updated } });
                                }}
                                className="accent-pink-600"
                              />
                              Show
                            </label>
                            {homeTiles.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = homeTiles.filter((_, i) => i !== idx);
                                  setFormData({ ...formData, home: { ...formData.home, quickNavTiles: updated } });
                                }}
                                className="p-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <RichTextEditor
                      label="Hero Top Badge"
                      singleLine
                      value={formData.home.heroBadge}
                      onChange={(val) =>
                        setFormData({ ...formData, home: { ...formData.home, heroBadge: val } })
                      }
                    />
                    <RichTextEditor
                      label="Hero Title"
                      singleLine
                      value={formData.home.heroTitle}
                      onChange={(val) =>
                        setFormData({ ...formData, home: { ...formData.home, heroTitle: val } })
                      }
                    />
                  </div>

                  <RichTextEditor
                    label="Hero Subtitle"
                    rows={2}
                    value={formData.home.heroSubtitle}
                    onChange={(val) =>
                      setFormData({ ...formData, home: { ...formData.home, heroSubtitle: val } })
                    }
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Hero Primary Button</label>
                      <input
                        type="text"
                        value={formData.home.heroPrimaryCta}
                        onChange={(e) =>
                          setFormData({ ...formData, home: { ...formData.home, heroPrimaryCta: e.target.value } })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Hero Secondary Button</label>
                      <input
                        type="text"
                        value={formData.home.heroSecondaryCta}
                        onChange={(e) =>
                          setFormData({ ...formData, home: { ...formData.home, heroSecondaryCta: e.target.value } })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Dynamic Stats */}
                  <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <label className={labelClass}>Hero Statistics ({homeStats.length})</label>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            home: {
                              ...formData.home,
                              stats: [...homeStats, { value: '100%', label: 'New Stat Label' }],
                            },
                          })
                        }
                        className="px-3 py-1 rounded-lg bg-pink-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-pink-500"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Extra Stat
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {homeStats.map((st, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500 uppercase">Stat #{idx + 1}</span>
                            {homeStats.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = homeStats.filter((_, i) => i !== idx);
                                  setFormData({ ...formData, home: { ...formData.home, stats: updated } });
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            placeholder="Value (e.g. 1,200+)"
                            value={st.value}
                            onChange={(e) => {
                              const updated = [...homeStats];
                              updated[idx] = { ...updated[idx], value: e.target.value };
                              setFormData({ ...formData, home: { ...formData.home, stats: updated } });
                            }}
                            className={inputClass}
                          />
                          <input
                            type="text"
                            placeholder="Label"
                            value={st.label}
                            onChange={(e) => {
                              const updated = [...homeStats];
                              updated[idx] = { ...updated[idx], label: e.target.value };
                              setFormData({ ...formData, home: { ...formData.home, stats: updated } });
                            }}
                            className={inputClass}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <ImageField
                    label="Hero Showcase Image"
                    value={formData.home.heroImage}
                    onChange={(val) =>
                      setFormData({ ...formData, home: { ...formData.home, heroImage: val } })
                    }
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Why Choose Us Badge</label>
                      <input
                        type="text"
                        value={formData.home.whyBadge}
                        onChange={(e) =>
                          setFormData({ ...formData, home: { ...formData.home, whyBadge: e.target.value } })
                        }
                        className={inputClass}
                      />
                    </div>
                    <RichTextEditor
                      label="Why Choose Us Heading"
                      singleLine
                      value={formData.home.whyHeading}
                      onChange={(val) =>
                        setFormData({ ...formData, home: { ...formData.home, whyHeading: val } })
                      }
                    />
                  </div>
                  <RichTextEditor
                    label="Why Choose Us Subheading"
                    rows={2}
                    value={formData.home.whySubheading}
                    onChange={(val) =>
                      setFormData({ ...formData, home: { ...formData.home, whySubheading: val } })
                    }
                  />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className={labelClass}>Topic Feature Cards ({formData.home.whyCards.length})</label>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            home: {
                              ...formData.home,
                              whyCards: [
                                ...formData.home.whyCards,
                                { title: 'New Topic', description: 'Add topic details...' },
                              ],
                            },
                          })
                        }
                        className="px-3 py-1 rounded-lg bg-pink-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-pink-500"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Topic Card
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {formData.home.whyCards.map((card, i) => (
                        <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="text"
                              placeholder="Optional Badge"
                              value={card.badge || ''}
                              onChange={(e) => {
                                const updated = [...formData.home.whyCards];
                                updated[i] = { ...updated[i], badge: e.target.value || undefined };
                                setFormData({ ...formData, home: { ...formData.home, whyCards: updated } });
                              }}
                              className="w-32 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                            />
                            {formData.home.whyCards.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = formData.home.whyCards.filter((_, idx) => idx !== i);
                                  setFormData({ ...formData, home: { ...formData.home, whyCards: updated } });
                                }}
                                className="p-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white shrink-0"
                                title="Remove card"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <RichTextEditor
                            label="Title"
                            singleLine
                            value={card.title}
                            onChange={(val) => {
                              const updated = [...formData.home.whyCards];
                              updated[i] = { ...updated[i], title: val };
                              setFormData({ ...formData, home: { ...formData.home, whyCards: updated } });
                            }}
                          />
                          <RichTextEditor
                            label="Description"
                            rows={2}
                            value={card.description}
                            onChange={(val) => {
                              const updated = [...formData.home.whyCards];
                              updated[i] = { ...updated[i], description: val };
                              setFormData({ ...formData, home: { ...formData.home, whyCards: updated } });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Testimonials Badge</label>
                      <input
                        type="text"
                        value={formData.home.testimonialsBadge}
                        onChange={(e) =>
                          setFormData({ ...formData, home: { ...formData.home, testimonialsBadge: e.target.value } })
                        }
                        className={inputClass}
                      />
                    </div>
                    <RichTextEditor
                      label="Testimonials Heading"
                      singleLine
                      value={formData.home.testimonialsHeading}
                      onChange={(val) =>
                        setFormData({ ...formData, home: { ...formData.home, testimonialsHeading: val } })
                      }
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className={labelClass}>Testimonials (Words &amp; Avatars)</label>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            home: {
                              ...formData.home,
                              testimonials: [
                                ...formData.home.testimonials,
                                { quote: '"Great academy experience."', name: 'New Member', role: 'Athlete / Parent', avatar: '' },
                              ],
                            },
                          })
                        }
                        className="px-3 py-1 rounded-lg bg-pink-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-pink-500"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Testimonial
                      </button>
                    </div>
                    {formData.home.testimonials.map((t, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-500 uppercase">Testimonial {i + 1}</span>
                          {formData.home.testimonials.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = formData.home.testimonials.filter((_, idx) => idx !== i);
                                setFormData({ ...formData, home: { ...formData.home, testimonials: updated } });
                              }}
                              className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={t.name}
                            onChange={(e) => {
                              const updated = [...formData.home.testimonials];
                              updated[i] = { ...updated[i], name: e.target.value };
                              setFormData({ ...formData, home: { ...formData.home, testimonials: updated } });
                            }}
                            className={inputClass}
                            placeholder="Name"
                          />
                          <input
                            type="text"
                            value={t.role}
                            onChange={(e) => {
                              const updated = [...formData.home.testimonials];
                              updated[i] = { ...updated[i], role: e.target.value };
                              setFormData({ ...formData, home: { ...formData.home, testimonials: updated } });
                            }}
                            className={inputClass}
                            placeholder="Role"
                          />
                        </div>
                        <RichTextEditor
                          label="Quote"
                          rows={2}
                          value={t.quote}
                          onChange={(val) => {
                            const updated = [...formData.home.testimonials];
                            updated[i] = { ...updated[i], quote: val };
                            setFormData({ ...formData, home: { ...formData.home, testimonials: updated } });
                          }}
                        />
                        <ImageField
                          label={`Testimonial ${i + 1} Avatar Photo`}
                          value={t.avatar}
                          allowClear
                          onChange={(val) => {
                            const updated = [...formData.home.testimonials];
                            updated[i] = { ...updated[i], avatar: val };
                            setFormData({ ...formData, home: { ...formData.home, testimonials: updated } });
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Bottom CTA Badge</label>
                        <input
                          type="text"
                          value={formData.home.ctaBadge}
                          onChange={(e) =>
                            setFormData({ ...formData, home: { ...formData.home, ctaBadge: e.target.value } })
                          }
                          className={inputClass}
                        />
                      </div>
                      <RichTextEditor
                        label="Bottom CTA Heading"
                        singleLine
                        value={formData.home.ctaHeading}
                        onChange={(val) =>
                          setFormData({ ...formData, home: { ...formData.home, ctaHeading: val } })
                        }
                      />
                    </div>
                    <RichTextEditor
                      label="Bottom CTA Subheading"
                      rows={2}
                      value={formData.home.ctaSubheading}
                      onChange={(val) =>
                        setFormData({ ...formData, home: { ...formData.home, ctaSubheading: val } })
                      }
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Bottom CTA Primary Button</label>
                        <input
                          type="text"
                          value={formData.home.ctaPrimaryBtn}
                          onChange={(e) =>
                            setFormData({ ...formData, home: { ...formData.home, ctaPrimaryBtn: e.target.value } })
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Bottom CTA Secondary Button</label>
                        <input
                          type="text"
                          value={formData.home.ctaSecondaryBtn}
                          onChange={(e) =>
                            setFormData({ ...formData, home: { ...formData.home, ctaSecondaryBtn: e.target.value } })
                          }
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PROGRAMS */}
              {selectedSection === 'programs' && editorMode === 'content' && (
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Page Badge</label>
                    <input
                      type="text"
                      value={formData.programs.badge}
                      onChange={(e) =>
                        setFormData({ ...formData, programs: { ...formData.programs, badge: e.target.value } })
                      }
                      className={inputClass}
                    />
                  </div>
                  <RichTextEditor
                    label="Page Heading"
                    singleLine
                    value={formData.programs.heading}
                    onChange={(val) =>
                      setFormData({ ...formData, programs: { ...formData.programs, heading: val } })
                    }
                  />
                  <RichTextEditor
                    label="Page Subheading"
                    rows={3}
                    value={formData.programs.subheading}
                    onChange={(val) =>
                      setFormData({ ...formData, programs: { ...formData.programs, subheading: val } })
                    }
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Search Placeholder</label>
                      <input
                        type="text"
                        value={formData.programs.searchPlaceholder}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            programs: { ...formData.programs, searchPlaceholder: e.target.value },
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Card Action Button Text</label>
                      <input
                        type="text"
                        value={formData.programs.viewDetailsText}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            programs: { ...formData.programs, viewDetailsText: e.target.value },
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Modal Highlights Heading</label>
                      <input
                        type="text"
                        value={formData.programs.highlightsHeading}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            programs: { ...formData.programs, highlightsHeading: e.target.value },
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Modal Enroll Button Prefix</label>
                      <input
                        type="text"
                        value={formData.programs.enrollBtnPrefix}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            programs: { ...formData.programs, enrollBtnPrefix: e.target.value },
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <StringListEditor
                    label="Program Categories"
                    items={formData.programs.categories}
                    onChange={(next) =>
                      setFormData({ ...formData, programs: { ...formData.programs, categories: next } })
                    }
                    addButtonText="Add Extra Category"
                  />
                </div>
              )}

              {/* OUR PARTNERS */}
              {selectedSection === 'partners' && editorMode === 'content' && (
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Page Badge</label>
                    <input
                      type="text"
                      value={formData.partners.badge}
                      onChange={(e) =>
                        setFormData({ ...formData, partners: { ...formData.partners, badge: e.target.value } })
                      }
                      className={inputClass}
                    />
                  </div>
                  <RichTextEditor
                    label="Page Heading"
                    singleLine
                    value={formData.partners.heading}
                    onChange={(val) =>
                      setFormData({ ...formData, partners: { ...formData.partners, heading: val } })
                    }
                  />
                  <RichTextEditor
                    label="Page Subheading"
                    rows={3}
                    value={formData.partners.subheading}
                    onChange={(val) =>
                      setFormData({ ...formData, partners: { ...formData.partners, subheading: val } })
                    }
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Search Placeholder</label>
                      <input
                        type="text"
                        value={formData.partners.searchPlaceholder}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            partners: { ...formData.partners, searchPlaceholder: e.target.value },
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Card Action Button Text</label>
                      <input
                        type="text"
                        value={formData.partners.viewBtnText}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            partners: { ...formData.partners, viewBtnText: e.target.value },
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <StringListEditor
                    label="Partner Categories"
                    items={formData.partners.categories}
                    onChange={(next) =>
                      setFormData({ ...formData, partners: { ...formData.partners, categories: next } })
                    }
                    addButtonText="Add Extra Category"
                  />
                  <StringListEditor
                    label="Partner Status Options"
                    items={formData.partners.statuses}
                    onChange={(next) =>
                      setFormData({ ...formData, partners: { ...formData.partners, statuses: next } })
                    }
                    addButtonText="Add Extra Status"
                  />
                </div>
              )}

              {/* COACHES */}
              {selectedSection === 'coaches' && editorMode === 'content' && (
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Page Badge</label>
                    <input
                      type="text"
                      value={formData.coaches.badge}
                      onChange={(e) =>
                        setFormData({ ...formData, coaches: { ...formData.coaches, badge: e.target.value } })
                      }
                      className={inputClass}
                    />
                  </div>
                  <RichTextEditor
                    label="Page Heading"
                    singleLine
                    value={formData.coaches.heading}
                    onChange={(val) =>
                      setFormData({ ...formData, coaches: { ...formData.coaches, heading: val } })
                    }
                  />
                  <RichTextEditor
                    label="Page Subheading"
                    rows={3}
                    value={formData.coaches.subheading}
                    onChange={(val) =>
                      setFormData({ ...formData, coaches: { ...formData.coaches, subheading: val } })
                    }
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Card Book Button Text</label>
                      <input
                        type="text"
                        value={formData.coaches.bookBtnText}
                        onChange={(e) =>
                          setFormData({ ...formData, coaches: { ...formData.coaches, bookBtnText: e.target.value } })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Booking Modal Title</label>
                      <input
                        type="text"
                        value={formData.coaches.bookingModalTitle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            coaches: { ...formData.coaches, bookingModalTitle: e.target.value },
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Booking Success Heading</label>
                      <input
                        type="text"
                        value={formData.coaches.bookingSuccessTitle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            coaches: { ...formData.coaches, bookingSuccessTitle: e.target.value },
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Booking Success Message</label>
                      <input
                        type="text"
                        value={formData.coaches.bookingSuccessMessage}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            coaches: { ...formData.coaches, bookingSuccessMessage: e.target.value },
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* COACH CAREERS */}
              {selectedSection === 'coach-jobs' && editorMode === 'content' && (
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Banner Badge</label>
                    <input
                      type="text"
                      value={formData.coachJobs.badge}
                      onChange={(e) =>
                        setFormData({ ...formData, coachJobs: { ...formData.coachJobs, badge: e.target.value } })
                      }
                      className={inputClass}
                    />
                  </div>
                  <RichTextEditor
                    label="Banner Heading"
                    singleLine
                    value={formData.coachJobs.heading}
                    onChange={(val) =>
                      setFormData({ ...formData, coachJobs: { ...formData.coachJobs, heading: val } })
                    }
                  />
                  <RichTextEditor
                    label="Banner Subheading"
                    rows={3}
                    value={formData.coachJobs.subheading}
                    onChange={(val) =>
                      setFormData({ ...formData, coachJobs: { ...formData.coachJobs, subheading: val } })
                    }
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Apply Button Text</label>
                      <input
                        type="text"
                        value={formData.coachJobs.applyBtnText}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            coachJobs: { ...formData.coachJobs, applyBtnText: e.target.value },
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Application Modal Title</label>
                      <input
                        type="text"
                        value={formData.coachJobs.modalTitle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            coachJobs: { ...formData.coachJobs, modalTitle: e.target.value },
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Modal Submit Button Text</label>
                      <input
                        type="text"
                        value={formData.coachJobs.modalSubmitText}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            coachJobs: { ...formData.coachJobs, modalSubmitText: e.target.value },
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Success Heading</label>
                      <input
                        type="text"
                        value={formData.coachJobs.successTitle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            coachJobs: { ...formData.coachJobs, successTitle: e.target.value },
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Success Message</label>
                    <input
                      type="text"
                      value={formData.coachJobs.successMessage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          coachJobs: { ...formData.coachJobs, successMessage: e.target.value },
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <StringListEditor
                    label="Extra Application Questions (Optional)"
                    items={formData.coachJobs.extraQuestions || []}
                    onChange={(next) =>
                      setFormData({ ...formData, coachJobs: { ...formData.coachJobs, extraQuestions: next } })
                    }
                    addButtonText="Add Extra Form Question"
                    placeholder="e.g. Preferred Campus or Availability"
                  />
                </div>
              )}

              {/* PARENT REQUESTS */}
              {selectedSection === 'parent-requests' && editorMode === 'content' && (
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Banner Badge</label>
                    <input
                      type="text"
                      value={formData.parentRequests.badge}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          parentRequests: { ...formData.parentRequests, badge: e.target.value },
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <RichTextEditor
                    label="Banner Heading"
                    singleLine
                    value={formData.parentRequests.heading}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        parentRequests: { ...formData.parentRequests, heading: val },
                      })
                    }
                  />
                  <RichTextEditor
                    label="Banner Subheading"
                    rows={3}
                    value={formData.parentRequests.subheading}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        parentRequests: { ...formData.parentRequests, subheading: val },
                      })
                    }
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Request Button Text</label>
                      <input
                        type="text"
                        value={formData.parentRequests.requestBtnText}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            parentRequests: { ...formData.parentRequests, requestBtnText: e.target.value },
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Request Modal Title</label>
                      <input
                        type="text"
                        value={formData.parentRequests.modalTitle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            parentRequests: { ...formData.parentRequests, modalTitle: e.target.value },
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Modal Submit Button Text</label>
                      <input
                        type="text"
                        value={formData.parentRequests.modalSubmitText}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            parentRequests: { ...formData.parentRequests, modalSubmitText: e.target.value },
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Success Heading</label>
                      <input
                        type="text"
                        value={formData.parentRequests.successTitle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            parentRequests: { ...formData.parentRequests, successTitle: e.target.value },
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Success Message</label>
                    <input
                      type="text"
                      value={formData.parentRequests.successMessage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          parentRequests: { ...formData.parentRequests, successMessage: e.target.value },
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <StringListEditor
                    label="Skill Level Options"
                    items={formData.parentRequests.skillLevels || []}
                    onChange={(next) =>
                      setFormData({
                        ...formData,
                        parentRequests: { ...formData.parentRequests, skillLevels: next },
                      })
                    }
                    addButtonText="Add Extra Skill Level"
                  />
                  <StringListEditor
                    label="Extra Parent Form Questions (Optional)"
                    items={formData.parentRequests.extraQuestions || []}
                    onChange={(next) =>
                      setFormData({
                        ...formData,
                        parentRequests: { ...formData.parentRequests, extraQuestions: next },
                      })
                    }
                    addButtonText="Add Extra Form Question"
                    placeholder="e.g. School Name or Preferred Training Days"
                  />
                </div>
              )}

              {/* MERCHANDISE */}
              {selectedSection === 'merchandise' && editorMode === 'content' && (
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Store Badge</label>
                    <input
                      type="text"
                      value={formData.merchandise.badge}
                      onChange={(e) =>
                        setFormData({ ...formData, merchandise: { ...formData.merchandise, badge: e.target.value } })
                      }
                      className={inputClass}
                    />
                  </div>
                  <RichTextEditor
                    label="Store Heading"
                    singleLine
                    value={formData.merchandise.heading}
                    onChange={(val) =>
                      setFormData({ ...formData, merchandise: { ...formData.merchandise, heading: val } })
                    }
                  />
                  <RichTextEditor
                    label="Store Subheading"
                    rows={3}
                    value={formData.merchandise.subheading}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        merchandise: { ...formData.merchandise, subheading: val },
                      })
                    }
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className={labelClass}>Add To Cart Text</label>
                      <input
                        type="text"
                        value={formData.merchandise.addToCartText}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            merchandise: { ...formData.merchandise, addToCartText: e.target.value },
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Cart Label</label>
                      <input
                        type="text"
                        value={formData.merchandise.cartLabel}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            merchandise: { ...formData.merchandise, cartLabel: e.target.value },
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Checkout Button Text</label>
                      <input
                        type="text"
                        value={formData.merchandise.checkoutBtnText}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            merchandise: { ...formData.merchandise, checkoutBtnText: e.target.value },
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Order Success Title</label>
                      <input
                        type="text"
                        value={formData.merchandise.orderSuccessTitle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            merchandise: { ...formData.merchandise, orderSuccessTitle: e.target.value },
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Order Success Message</label>
                      <input
                        type="text"
                        value={formData.merchandise.orderSuccessMessage}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            merchandise: { ...formData.merchandise, orderSuccessMessage: e.target.value },
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <StringListEditor
                    label="Store Categories"
                    items={formData.merchandise.categories}
                    onChange={(next) =>
                      setFormData({
                        ...formData,
                        merchandise: { ...formData.merchandise, categories: next },
                      })
                    }
                    addButtonText="Add Extra Category"
                  />
                </div>
              )}

              {/* ANNOUNCEMENTS */}
              {selectedSection === 'announcements' && editorMode === 'content' && (
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Page Badge</label>
                    <input
                      type="text"
                      value={formData.announcements.badge}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          announcements: { ...formData.announcements, badge: e.target.value },
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <RichTextEditor
                    label="Page Heading"
                    singleLine
                    value={formData.announcements.heading}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        announcements: { ...formData.announcements, heading: val },
                      })
                    }
                  />
                  <RichTextEditor
                    label="Page Subheading"
                    rows={3}
                    value={formData.announcements.subheading}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        announcements: { ...formData.announcements, subheading: val },
                      })
                    }
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Search Placeholder</label>
                      <input
                        type="text"
                        value={formData.announcements.searchPlaceholder}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            announcements: { ...formData.announcements, searchPlaceholder: e.target.value },
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Read More Link Text</label>
                      <input
                        type="text"
                        value={formData.announcements.readMoreText}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            announcements: { ...formData.announcements, readMoreText: e.target.value },
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <StringListEditor
                    label="Announcement Categories"
                    items={formData.announcements.categories}
                    onChange={(next) =>
                      setFormData({
                        ...formData,
                        announcements: { ...formData.announcements, categories: next },
                      })
                    }
                    addButtonText="Add Extra Category"
                  />
                </div>
              )}

              {/* AI COACH */}
              {selectedSection === 'aicoach' && editorMode === 'content' && (
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Page Badge</label>
                    <input
                      type="text"
                      value={formData.aiCoach.badge}
                      onChange={(e) =>
                        setFormData({ ...formData, aiCoach: { ...formData.aiCoach, badge: e.target.value } })
                      }
                      className={inputClass}
                    />
                  </div>
                  <RichTextEditor
                    label="Page Heading"
                    singleLine
                    value={formData.aiCoach.heading}
                    onChange={(val) =>
                      setFormData({ ...formData, aiCoach: { ...formData.aiCoach, heading: val } })
                    }
                  />
                  <RichTextEditor
                    label="Page Subheading"
                    rows={2}
                    value={formData.aiCoach.subheading}
                    onChange={(val) =>
                      setFormData({ ...formData, aiCoach: { ...formData.aiCoach, subheading: val } })
                    }
                  />
                  <RichTextEditor
                    label="Welcome Message"
                    rows={2}
                    value={formData.aiCoach.welcomeMessage}
                    onChange={(val) =>
                      setFormData({ ...formData, aiCoach: { ...formData.aiCoach, welcomeMessage: val } })
                    }
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className={labelClass}>Context Selector Label</label>
                      <input
                        type="text"
                        value={formData.aiCoach.contextLabel}
                        onChange={(e) =>
                          setFormData({ ...formData, aiCoach: { ...formData.aiCoach, contextLabel: e.target.value } })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>General Option Label</label>
                      <input
                        type="text"
                        value={formData.aiCoach.generalOptionLabel}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            aiCoach: { ...formData.aiCoach, generalOptionLabel: e.target.value },
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Reset Button Text</label>
                      <input
                        type="text"
                        value={formData.aiCoach.resetBtnText}
                        onChange={(e) =>
                          setFormData({ ...formData, aiCoach: { ...formData.aiCoach, resetBtnText: e.target.value } })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className={labelClass}>Presets Label</label>
                      <input
                        type="text"
                        value={formData.aiCoach.presetsLabel}
                        onChange={(e) =>
                          setFormData({ ...formData, aiCoach: { ...formData.aiCoach, presetsLabel: e.target.value } })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Console Header Title</label>
                      <input
                        type="text"
                        value={formData.aiCoach.consoleTitle}
                        onChange={(e) =>
                          setFormData({ ...formData, aiCoach: { ...formData.aiCoach, consoleTitle: e.target.value } })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Send Button Text</label>
                      <input
                        type="text"
                        value={formData.aiCoach.sendBtnText}
                        onChange={(e) =>
                          setFormData({ ...formData, aiCoach: { ...formData.aiCoach, sendBtnText: e.target.value } })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Prompt Input Placeholder</label>
                    <input
                      type="text"
                      value={formData.aiCoach.inputPlaceholder}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          aiCoach: { ...formData.aiCoach, inputPlaceholder: e.target.value },
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className={labelClass}>Preset Prompts</label>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            aiCoach: {
                              ...formData.aiCoach,
                              presetPrompts: [...formData.aiCoach.presetPrompts, 'New coaching prompt...'],
                            },
                          })
                        }
                        className="px-2.5 py-1 rounded-lg bg-pink-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-pink-500"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Prompt
                      </button>
                    </div>
                    {formData.aiCoach.presetPrompts.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={p}
                          onChange={(e) => {
                            const updated = [...formData.aiCoach.presetPrompts];
                            updated[idx] = e.target.value;
                            setFormData({ ...formData, aiCoach: { ...formData.aiCoach, presetPrompts: updated } });
                          }}
                          className={inputClass}
                        />
                        {formData.aiCoach.presetPrompts.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData.aiCoach.presetPrompts.filter((_, i) => i !== idx);
                              setFormData({ ...formData, aiCoach: { ...formData.aiCoach, presetPrompts: updated } });
                            }}
                            className="p-2 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* NEWS */}
              {selectedSection === 'news' && editorMode === 'content' && (
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Page Badge</label>
                    <input
                      type="text"
                      value={formData.news.badge}
                      onChange={(e) =>
                        setFormData({ ...formData, news: { ...formData.news, badge: e.target.value } })
                      }
                      className={inputClass}
                    />
                  </div>
                  <RichTextEditor
                    label="Page Heading"
                    singleLine
                    value={formData.news.heading}
                    onChange={(val) =>
                      setFormData({ ...formData, news: { ...formData.news, heading: val } })
                    }
                  />
                  <RichTextEditor
                    label="Page Subheading"
                    rows={3}
                    value={formData.news.subheading}
                    onChange={(val) =>
                      setFormData({ ...formData, news: { ...formData.news, subheading: val } })
                    }
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Read More Button Text</label>
                      <input
                        type="text"
                        value={formData.news.readMoreText}
                        onChange={(e) =>
                          setFormData({ ...formData, news: { ...formData.news, readMoreText: e.target.value } })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Close Article Button Text</label>
                      <input
                        type="text"
                        value={formData.news.closeBtnText}
                        onChange={(e) =>
                          setFormData({ ...formData, news: { ...formData.news, closeBtnText: e.target.value } })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <StringListEditor
                    label="News Categories"
                    items={formData.news.categories}
                    onChange={(next) =>
                      setFormData({ ...formData, news: { ...formData.news, categories: next } })
                    }
                    addButtonText="Add Extra Category"
                  />
                </div>
              )}

              {/* CONTACT / ADMISSIONS */}
              {selectedSection === 'contact' && editorMode === 'content' && (
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Page Badge</label>
                    <input
                      type="text"
                      value={formData.contact.badge}
                      onChange={(e) =>
                        setFormData({ ...formData, contact: { ...formData.contact, badge: e.target.value } })
                      }
                      className={inputClass}
                    />
                  </div>
                  <RichTextEditor
                    label="Page Heading"
                    singleLine
                    value={formData.contact.heading}
                    onChange={(val) =>
                      setFormData({ ...formData, contact: { ...formData.contact, heading: val } })
                    }
                  />
                  <RichTextEditor
                    label="Page Subheading"
                    rows={2}
                    value={formData.contact.subheading}
                    onChange={(val) =>
                      setFormData({ ...formData, contact: { ...formData.contact, subheading: val } })
                    }
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>HQ Card Title</label>
                      <input
                        type="text"
                        value={formData.contact.hqCardTitle}
                        onChange={(e) =>
                          setFormData({ ...formData, contact: { ...formData.contact, hqCardTitle: e.target.value } })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Form Title</label>
                      <input
                        type="text"
                        value={formData.contact.formTitle}
                        onChange={(e) =>
                          setFormData({ ...formData, contact: { ...formData.contact, formTitle: e.target.value } })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className={labelClass}>Location Field Label</label>
                      <input
                        type="text"
                        value={formData.contact.locationLabel}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact: { ...formData.contact, locationLabel: e.target.value },
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Phone Field Label</label>
                      <input
                        type="text"
                        value={formData.contact.phoneLabel}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact: { ...formData.contact, phoneLabel: e.target.value },
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Email Field Label</label>
                      <input
                        type="text"
                        value={formData.contact.emailLabel}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact: { ...formData.contact, emailLabel: e.target.value },
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Extra Contact Details */}
                  <div className="bg-pink-50/40 p-4 rounded-2xl border border-pink-100 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className={labelClass}>Extra Contact Details ({(formData.contact.extraContacts || []).length})</label>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            contact: {
                              ...formData.contact,
                              extraContacts: [
                                ...(formData.contact.extraContacts || []),
                                { label: 'WhatsApp / Hours', value: '+254 700 000 000' },
                              ],
                            },
                          })
                        }
                        className="px-3 py-1 rounded-lg bg-pink-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-pink-500"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Extra Contact Info
                      </button>
                    </div>
                    {(formData.contact.extraContacts || []).map((ec, idx) => (
                      <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Label (e.g. Office Hours)"
                          value={ec.label}
                          onChange={(e) => {
                            const updated = [...(formData.contact.extraContacts || [])];
                            updated[idx] = { ...updated[idx], label: e.target.value };
                            setFormData({ ...formData, contact: { ...formData.contact, extraContacts: updated } });
                          }}
                          className={`sm:col-span-5 ${inputClass}`}
                        />
                        <input
                          type="text"
                          placeholder="Value"
                          value={ec.value}
                          onChange={(e) => {
                            const updated = [...(formData.contact.extraContacts || [])];
                            updated[idx] = { ...updated[idx], value: e.target.value };
                            setFormData({ ...formData, contact: { ...formData.contact, extraContacts: updated } });
                          }}
                          className={`sm:col-span-6 ${inputClass}`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (formData.contact.extraContacts || []).filter((_, i) => i !== idx);
                            setFormData({ ...formData, contact: { ...formData.contact, extraContacts: updated } });
                          }}
                          className="sm:col-span-1 p-2.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white flex items-center justify-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Trial Schedule Heading</label>
                      <input
                        type="text"
                        value={formData.contact.trialScheduleTitle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact: { ...formData.contact, trialScheduleTitle: e.target.value },
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Submit Button Text</label>
                      <input
                        type="text"
                        value={formData.contact.submitBtnText}
                        onChange={(e) =>
                          setFormData({ ...formData, contact: { ...formData.contact, submitBtnText: e.target.value } })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Trial Schedule Description</label>
                    <textarea
                      rows={2}
                      value={formData.contact.trialScheduleText}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact: { ...formData.contact, trialScheduleText: e.target.value },
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Success Heading</label>
                      <input
                        type="text"
                        value={formData.contact.successTitle}
                        onChange={(e) =>
                          setFormData({ ...formData, contact: { ...formData.contact, successTitle: e.target.value } })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Success Message</label>
                      <input
                        type="text"
                        value={formData.contact.successMessage}
                        onChange={(e) =>
                          setFormData({ ...formData, contact: { ...formData.contact, successMessage: e.target.value } })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <StringListEditor
                    label="Program Category Options (Form Dropdown)"
                    items={formData.contact.programOptions}
                    onChange={(next) =>
                      setFormData({ ...formData, contact: { ...formData.contact, programOptions: next } })
                    }
                    addButtonText="Add Extra Program Option"
                  />
                </div>
              )}

              {/* GLOBAL (HEADER, NAVIGATION, SPORTS & FOOTER) */}
              {selectedSection === 'global' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className={labelClass}>Brand Name Part 1</label>
                      <input
                        type="text"
                        value={formData.global.brandPrefix}
                        onChange={(e) =>
                          setFormData({ ...formData, global: { ...formData.global, brandPrefix: e.target.value } })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Brand Name Part 2</label>
                      <input
                        type="text"
                        value={formData.global.brandSuffix}
                        onChange={(e) =>
                          setFormData({ ...formData, global: { ...formData.global, brandSuffix: e.target.value } })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Header CTA Button</label>
                      <input
                        type="text"
                        value={formData.global.bookTrialBtn}
                        onChange={(e) =>
                          setFormData({ ...formData, global: { ...formData.global, bookTrialBtn: e.target.value } })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Header Tagline</label>
                    <input
                      type="text"
                      value={formData.global.tagline}
                      onChange={(e) =>
                        setFormData({ ...formData, global: { ...formData.global, tagline: e.target.value } })
                      }
                      className={inputClass}
                    />
                  </div>
                  <ImageField
                    label="Custom Brand Logo Image (optional)"
                    value={formData.global.logoUrl}
                    placeholder="Leave blank for default trophy emblem or paste/upload image"
                    allowClear
                    onChange={(val) =>
                      setFormData({ ...formData, global: { ...formData.global, logoUrl: val } })
                    }
                  />

                  {/* Available Sports Across Forms & Filters */}
                  <div className="bg-pink-50/40 p-4 rounded-2xl border border-pink-100">
                    <StringListEditor
                      label="Available Sports (Programs, Coaches, Requests, Admissions)"
                      items={formData.global.sportsList}
                      onChange={(next) =>
                        setFormData({ ...formData, global: { ...formData.global, sportsList: next } })
                      }
                      addButtonText="Add Extra Sport"
                      placeholder="e.g. Athletics / Rugby"
                    />
                  </div>

                  {/* Top Navigation Menu Items */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <label className={labelClass}>
                        Navigation Menu Links ({formData.global.navItems.length})
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            global: {
                              ...formData.global,
                              navItems: [
                                ...formData.global.navItems,
                                { id: `custom-${Date.now()}`, label: 'Extra Link', url: 'https://', visible: true },
                              ],
                            },
                          })
                        }
                        className="px-3 py-1 rounded-lg bg-pink-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-pink-500"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Extra Nav Link
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {formData.global.navItems.map((nav, idx) => (
                        <div key={nav.id} className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Menu Label"
                              value={nav.label}
                              onChange={(e) => {
                                const updated = [...formData.global.navItems];
                                updated[idx] = { ...updated[idx], label: e.target.value };
                                setFormData({ ...formData, global: { ...formData.global, navItems: updated } });
                              }}
                              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold"
                            />
                            <input
                              type="text"
                              placeholder="Badge (optional)"
                              value={nav.badge || ''}
                              onChange={(e) => {
                                const updated = [...formData.global.navItems];
                                updated[idx] = { ...updated[idx], badge: e.target.value || undefined };
                                setFormData({ ...formData, global: { ...formData.global, navItems: updated } });
                              }}
                              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Optional external https:// URL"
                              value={nav.url || ''}
                              onChange={(e) => {
                                const updated = [...formData.global.navItems];
                                updated[idx] = { ...updated[idx], url: e.target.value || undefined };
                                setFormData({ ...formData, global: { ...formData.global, navItems: updated } });
                              }}
                              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                            />
                            <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1 shrink-0">
                              <input
                                type="checkbox"
                                checked={nav.visible !== false}
                                onChange={(e) => {
                                  const updated = [...formData.global.navItems];
                                  updated[idx] = { ...updated[idx], visible: e.target.checked };
                                  setFormData({ ...formData, global: { ...formData.global, navItems: updated } });
                                }}
                                className="accent-pink-600"
                              />
                              Show
                            </label>
                            {formData.global.navItems.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = formData.global.navItems.filter((_, i) => i !== idx);
                                  setFormData({ ...formData, global: { ...formData.global, navItems: updated } });
                                }}
                                className="p-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* HQ & Footer Info */}
                  <div>
                    <label className={labelClass}>Footer Description</label>
                    <textarea
                      rows={2}
                      value={formData.global.footerDescription}
                      onChange={(e) =>
                        setFormData({ ...formData, global: { ...formData.global, footerDescription: e.target.value } })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Footer HQ Section Heading</label>
                      <input
                        type="text"
                        value={formData.global.hqColumnTitle}
                        onChange={(e) =>
                          setFormData({ ...formData, global: { ...formData.global, hqColumnTitle: e.target.value } })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Copyright Text</label>
                      <input
                        type="text"
                        value={formData.global.copyrightText}
                        onChange={(e) =>
                          setFormData({ ...formData, global: { ...formData.global, copyrightText: e.target.value } })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className={labelClass}>HQ Address</label>
                      <input
                        type="text"
                        value={formData.global.hqAddress}
                        onChange={(e) =>
                          setFormData({ ...formData, global: { ...formData.global, hqAddress: e.target.value } })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>HQ Phone</label>
                      <input
                        type="text"
                        value={formData.global.hqPhone}
                        onChange={(e) =>
                          setFormData({ ...formData, global: { ...formData.global, hqPhone: e.target.value } })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>HQ Email</label>
                      <input
                        type="email"
                        value={formData.global.hqEmail}
                        onChange={(e) =>
                          setFormData({ ...formData, global: { ...formData.global, hqEmail: e.target.value } })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Footer Link Columns */}
                  <div className="bg-pink-50/40 p-4 rounded-2xl border border-pink-100 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <label className={labelClass}>
                        Footer Link Columns ({formData.global.footerColumns.length})
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            global: {
                              ...formData.global,
                              footerColumns: [
                                ...formData.global.footerColumns,
                                {
                                  id: `col-${Date.now()}`,
                                  title: 'Extra Links',
                                  links: [{ label: 'New Link', tabId: 'programs' }],
                                },
                              ],
                            },
                          })
                        }
                        className="px-3 py-1 rounded-lg bg-pink-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-pink-500"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Extra Column
                      </button>
                    </div>
                    <div className="space-y-3">
                      {formData.global.footerColumns.map((col, colIdx) => (
                        <div key={col.id} className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2.5">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={col.title}
                              placeholder="Column Heading"
                              onChange={(e) => {
                                const updated = [...formData.global.footerColumns];
                                updated[colIdx] = { ...updated[colIdx], title: e.target.value };
                                setFormData({ ...formData, global: { ...formData.global, footerColumns: updated } });
                              }}
                              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-black uppercase"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...formData.global.footerColumns];
                                updated[colIdx] = {
                                  ...updated[colIdx],
                                  links: [...updated[colIdx].links, { label: 'Extra Link', tabId: 'programs' }],
                                };
                                setFormData({ ...formData, global: { ...formData.global, footerColumns: updated } });
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-pink-50 text-pink-700 border border-pink-200 text-xs font-bold hover:bg-pink-100 flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              Add Link
                            </button>
                            {formData.global.footerColumns.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = formData.global.footerColumns.filter((_, i) => i !== colIdx);
                                  setFormData({ ...formData, global: { ...formData.global, footerColumns: updated } });
                                }}
                                className="p-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <div className="space-y-1.5">
                            {col.links.map((link, lIdx) => (
                              <div key={lIdx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                                <input
                                  type="text"
                                  placeholder="Link Text"
                                  value={link.label}
                                  onChange={(e) => {
                                    const updated = [...formData.global.footerColumns];
                                    const links = [...updated[colIdx].links];
                                    links[lIdx] = { ...links[lIdx], label: e.target.value };
                                    updated[colIdx] = { ...updated[colIdx], links };
                                    setFormData({ ...formData, global: { ...formData.global, footerColumns: updated } });
                                  }}
                                  className="sm:col-span-5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                                />
                                <select
                                  value={link.tabId || 'programs'}
                                  onChange={(e) => {
                                    const updated = [...formData.global.footerColumns];
                                    const links = [...updated[colIdx].links];
                                    links[lIdx] = { ...links[lIdx], tabId: e.target.value };
                                    updated[colIdx] = { ...updated[colIdx], links };
                                    setFormData({ ...formData, global: { ...formData.global, footerColumns: updated } });
                                  }}
                                  className="sm:col-span-3 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs"
                                >
                                  {TAB_TARGET_OPTIONS.map((t) => (
                                    <option key={t.id} value={t.id}>
                                      {t.label}
                                    </option>
                                  ))}
                                </select>
                                <input
                                  type="text"
                                  placeholder="Or https:// URL"
                                  value={link.url || ''}
                                  onChange={(e) => {
                                    const updated = [...formData.global.footerColumns];
                                    const links = [...updated[colIdx].links];
                                    links[lIdx] = { ...links[lIdx], url: e.target.value || undefined };
                                    updated[colIdx] = { ...updated[colIdx], links };
                                    setFormData({ ...formData, global: { ...formData.global, footerColumns: updated } });
                                  }}
                                  className="sm:col-span-3 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...formData.global.footerColumns];
                                    updated[colIdx] = {
                                      ...updated[colIdx],
                                      links: updated[colIdx].links.filter((_, i) => i !== lIdx),
                                    };
                                    setFormData({ ...formData, global: { ...formData.global, footerColumns: updated } });
                                  }}
                                  className="sm:col-span-1 p-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white flex items-center justify-center"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className={labelClass}>Social Media Links ({formData.global.socialLinks.length})</label>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            global: {
                              ...formData.global,
                              socialLinks: [
                                ...formData.global.socialLinks,
                                { id: `soc-${Date.now()}`, platform: 'Website', url: 'https://' },
                              ],
                            },
                          })
                        }
                        className="px-3 py-1 rounded-lg bg-pink-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-pink-500"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Social Link
                      </button>
                    </div>
                    {formData.global.socialLinks.map((soc, idx) => (
                      <div key={soc.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Platform (Instagram, TikTok...)"
                          value={soc.platform}
                          onChange={(e) => {
                            const updated = [...formData.global.socialLinks];
                            updated[idx] = { ...updated[idx], platform: e.target.value };
                            setFormData({ ...formData, global: { ...formData.global, socialLinks: updated } });
                          }}
                          className={`sm:col-span-4 ${inputClass}`}
                        />
                        <input
                          type="text"
                          placeholder="https://..."
                          value={soc.url}
                          onChange={(e) => {
                            const updated = [...formData.global.socialLinks];
                            updated[idx] = { ...updated[idx], url: e.target.value };
                            setFormData({ ...formData, global: { ...formData.global, socialLinks: updated } });
                          }}
                          className={`sm:col-span-7 ${inputClass}`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.global.socialLinks.filter((_, i) => i !== idx);
                            setFormData({ ...formData, global: { ...formData.global, socialLinks: updated } });
                          }}
                          className="sm:col-span-1 p-2.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white flex items-center justify-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Legal Links */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className={labelClass}>Footer Legal / Policy Links ({formData.global.legalLinks.length})</label>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            global: {
                              ...formData.global,
                              legalLinks: [
                                ...formData.global.legalLinks,
                                { id: `leg-${Date.now()}`, label: 'New Policy', content: 'Policy details...' },
                              ],
                            },
                          })
                        }
                        className="px-3 py-1 rounded-lg bg-pink-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-pink-500"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Legal Link
                      </button>
                    </div>
                    {formData.global.legalLinks.map((leg, idx) => (
                      <div key={leg.id} className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Link Label"
                            value={leg.label}
                            onChange={(e) => {
                              const updated = [...formData.global.legalLinks];
                              updated[idx] = { ...updated[idx], label: e.target.value };
                              setFormData({ ...formData, global: { ...formData.global, legalLinks: updated } });
                            }}
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold"
                          />
                          <input
                            type="text"
                            placeholder="Optional https:// URL"
                            value={leg.url || ''}
                            onChange={(e) => {
                              const updated = [...formData.global.legalLinks];
                              updated[idx] = { ...updated[idx], url: e.target.value || undefined };
                              setFormData({ ...formData, global: { ...formData.global, legalLinks: updated } });
                            }}
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData.global.legalLinks.filter((_, i) => i !== idx);
                              setFormData({ ...formData, global: { ...formData.global, legalLinks: updated } });
                            }}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          placeholder="Popup policy text when clicked..."
                          value={leg.content}
                          onChange={(e) => {
                            const updated = [...formData.global.legalLinks];
                            updated[idx] = { ...updated[idx], content: e.target.value };
                            setFormData({ ...formData, global: { ...formData.global, legalLinks: updated } });
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer Buttons */}
        {!saved && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-200 text-slate-800 font-bold text-sm hover:bg-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="cms-form"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 text-white font-black text-sm shadow-lg hover:from-pink-500 hover:to-purple-600 flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-yellow-300" />
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

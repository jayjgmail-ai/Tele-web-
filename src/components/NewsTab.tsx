import { useState } from 'react';
import { NewsArticle, ExtraDetailItem } from '../types';
import { SiteContent } from '../data/siteContent';
import { Calendar, Clock, ArrowRight, X, Edit3, Plus, Trash2 } from 'lucide-react';
import ImageField from './ImageField';
import RichTextRenderer from './RichTextRenderer';
import RichTextEditor from './RichTextEditor';
import { ExtraFieldsEditor } from './ExtraFieldsEditor';

interface NewsTabProps {
  siteContent: SiteContent;
  news: NewsArticle[];
  setNews: (news: NewsArticle[]) => void;
  isAdmin: boolean;
  onOpenCms: () => void;
}

export default function NewsTab({
  siteContent,
  news,
  setNews,
  isAdmin,
  onOpenCms,
}: NewsTabProps) {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Academy News');
  const [date, setDate] = useState('');
  const [readTime, setReadTime] = useState('3 min read');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [extraDetails, setExtraDetails] = useState<ExtraDetailItem[]>([]);
  const [extraPhotos, setExtraPhotos] = useState<string[]>([]);
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=600'
  );

  const n = siteContent.news;
  const presetCategories = n.categories || ['Academy News', 'Partnership', 'Facility Update'];

  const openAddModal = () => {
    setEditingId(null);
    setTitle('');
    setCategory(presetCategories[0] || 'Academy News');
    setDate(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
    setReadTime('3 min read');
    setSummary('');
    setContent('');
    setExtraDetails([]);
    setExtraPhotos([]);
    setImage('https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=600');
    setShowFormModal(true);
  };

  const openEditModal = (article: NewsArticle) => {
    setEditingId(article.id);
    setTitle(article.title);
    setCategory(article.category);
    setDate(article.date);
    setReadTime(article.readTime);
    setSummary(article.summary);
    setContent(article.content);
    setExtraDetails(article.extraDetails ? [...article.extraDetails] : []);
    setExtraPhotos(article.extraPhotos ? [...article.extraPhotos] : []);
    setImage(article.image);
    setShowFormModal(true);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;
    const cleanExtraDetails = extraDetails.filter((d) => d.label.trim() && d.value.trim());
    const cleanExtraPhotos = extraPhotos.map((u) => u.trim()).filter(Boolean);

    if (editingId) {
      setNews(
        news.map((item) =>
          item.id === editingId
            ? {
                ...item,
                title: title.trim(),
                category: category.trim() || 'Academy News',
                date: date.trim() || item.date,
                readTime: readTime.trim() || '3 min read',
                summary,
                content: content || summary,
                image,
                extraDetails: cleanExtraDetails,
                extraPhotos: cleanExtraPhotos,
              }
            : item
        )
      );
    } else {
      const newArticle: NewsArticle = {
        id: `news-${Date.now()}`,
        title: title.trim(),
        category: category.trim() || 'Academy News',
        date:
          date.trim() ||
          new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        readTime: readTime.trim() || '3 min read',
        summary,
        content: content || summary,
        image,
        extraDetails: cleanExtraDetails,
        extraPhotos: cleanExtraPhotos,
      };
      setNews([newArticle, ...news]);
    }
    setShowFormModal(false);
  };

  const handleDeleteArticle = (id: string) => {
    setNews(news.filter((item) => item.id !== id));
    if (selectedArticle?.id === id) setSelectedArticle(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-white text-slate-900">
      {isAdmin && (
        <div className="flex flex-wrap items-center justify-end gap-3">
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 text-white font-black text-xs shadow-sm hover:from-pink-500 hover:to-purple-600 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Publish Article
          </button>
          <button
            onClick={onOpenCms}
            className="px-4 py-2 rounded-xl bg-yellow-400 text-slate-950 font-black text-xs shadow-sm hover:bg-yellow-300 transition-all flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Page
          </button>
        </div>
      )}

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3.5 py-1.5 rounded-full bg-pink-100 border border-pink-300 text-pink-900 font-bold text-xs uppercase tracking-wider">
          {n.badge}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 uppercase tracking-tight">
          <RichTextRenderer text={n.heading} inline />
        </h1>
        <div className="text-slate-600 text-base sm:text-lg">
          <RichTextRenderer text={n.subheading} />
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {news.map((article) => (
          <div
            key={article.id}
            className="rounded-2xl bg-white border border-pink-100 overflow-hidden hover:border-pink-500 transition-all duration-300 flex flex-col justify-between group shadow-lg shadow-pink-50"
          >
            <div>
              <div className="relative h-52 overflow-hidden bg-slate-100">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-white/95 backdrop-blur-md text-xs font-extrabold text-pink-700 border border-pink-200 uppercase shadow-xs">
                  {article.category}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-pink-600" /> {article.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-pink-600" /> {article.readTime}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-pink-600 transition-colors leading-snug">
                  {article.title}
                </h3>
                <div className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                  <RichTextRenderer text={article.summary} />
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 space-y-2">
              <button
                onClick={() => setSelectedArticle(article)}
                className="w-full py-3 rounded-xl bg-pink-50 hover:bg-pink-600 hover:text-white text-pink-900 font-bold text-sm transition-all flex items-center justify-center gap-2 border border-pink-200"
              >
                {n.readMoreText || 'Read Full Article'}
                <ArrowRight className="w-4 h-4" />
              </button>

              {isAdmin && (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => openEditModal(article)}
                    className="flex-1 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteArticle(article.id)}
                    className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-600 font-bold text-xs border border-red-200 flex items-center justify-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-white border border-pink-200 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="relative h-64 bg-slate-100">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-slate-100 shadow-md"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-6 left-6 right-6">
                <span className="px-3 py-1 rounded-lg bg-pink-600 text-white text-xs font-extrabold uppercase mb-2 inline-block">
                  {selectedArticle.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-snug">
                  {selectedArticle.title}
                </h2>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center space-x-4 text-xs text-slate-500 pb-4 border-b border-slate-200">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-pink-600" /> {selectedArticle.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-pink-600" /> {selectedArticle.readTime}
                </span>
              </div>

              <div className="text-slate-700 text-base leading-relaxed">
                <RichTextRenderer text={selectedArticle.content} />
              </div>

              {selectedArticle.extraDetails && selectedArticle.extraDetails.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedArticle.extraDetails.map((ed, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="text-[11px] font-bold text-slate-500 uppercase">{ed.label}</div>
                      <div className="text-xs font-bold text-slate-900 mt-0.5">{ed.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {selectedArticle.extraPhotos && selectedArticle.extraPhotos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {selectedArticle.extraPhotos.map((pUrl, idx) => (
                    <img
                      key={idx}
                      src={pUrl}
                      alt={`${selectedArticle.title} photo ${idx + 1}`}
                      className="w-full h-28 object-cover rounded-xl border border-pink-100"
                    />
                  ))}
                </div>
              )}

              <div className="pt-6 border-t border-slate-200 flex justify-end gap-3">
                {isAdmin && (
                  <button
                    onClick={() => {
                      const target = selectedArticle;
                      setSelectedArticle(null);
                      openEditModal(target);
                    }}
                    className="px-5 py-3 rounded-xl bg-yellow-400 text-slate-950 font-black text-sm hover:bg-yellow-300 flex items-center gap-1.5"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Article
                  </button>
                )}
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-all"
                >
                  {n.closeBtnText || 'Close Article'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add / Edit Article Modal */}
      {isAdmin && showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white border border-pink-200 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 uppercase">
                {editingId ? 'Edit News Article' : 'Publish News Article'}
              </h2>
              <button
                onClick={() => setShowFormModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Headline *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                  <input
                    type="text"
                    required
                    list="news-cat-suggestions"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600"
                  />
                  <datalist id="news-cat-suggestions">
                    {presetCategories.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date</label>
                  <input
                    type="text"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Read Time</label>
                  <input
                    type="text"
                    required
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600"
                  />
                </div>
              </div>

              <ImageField
                label="Article Cover Photo"
                value={image}
                onChange={setImage}
                required
              />

              <RichTextEditor
                label="Summary *"
                rows={2}
                value={summary}
                onChange={setSummary}
              />

              <RichTextEditor
                label="Full Content"
                rows={4}
                value={content}
                onChange={setContent}
              />

              <ExtraFieldsEditor
                extraDetails={extraDetails}
                onChangeDetails={setExtraDetails}
                extraPhotos={extraPhotos}
                onChangePhotos={setExtraPhotos}
              />

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 text-white font-black text-sm shadow-lg"
                >
                  {editingId ? 'Save Changes' : 'Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

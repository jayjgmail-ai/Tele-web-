import { useState } from 'react';
import { Announcement, AnnouncementCategory, ExtraDetailItem } from '../types';
import { SiteContent } from '../data/siteContent';
import {
  Megaphone,
  Calendar,
  User,
  Pin,
  Edit3,
  Plus,
  Trash2,
  X,
  Search,
  Image as ImageIcon,
} from 'lucide-react';
import ImageField from './ImageField';
import RichTextRenderer from './RichTextRenderer';
import RichTextEditor from './RichTextEditor';
import { ExtraFieldsEditor } from './ExtraFieldsEditor';

interface AnnouncementsTabProps {
  siteContent: SiteContent;
  announcements: Announcement[];
  setAnnouncements: (announcements: Announcement[]) => void;
  isAdmin: boolean;
  onOpenCms: () => void;
}

const DEFAULT_ANNOUNCEMENT_PHOTO =
  'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&q=80&w=800';

export default function AnnouncementsTab({
  siteContent,
  announcements,
  setAnnouncements,
  isAdmin,
  onOpenCms,
}: AnnouncementsTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AnnouncementCategory>('General Notice');
  const [customCategory, setCustomCategory] = useState('');
  const [message, setMessage] = useState('');
  const [photo, setPhoto] = useState('');
  const [date, setDate] = useState('');
  const [author, setAuthor] = useState('Telesports Academy Admin');
  const [pinned, setPinned] = useState(false);
  const [extraDetails, setExtraDetails] = useState<ExtraDetailItem[]>([]);
  const [extraPhotos, setExtraPhotos] = useState<string[]>([]);

  const a = siteContent.announcements;
  const baseCategories = a.categories || [
    'General Notice',
    'Training Camp',
    'School & Org Event',
    'Trials & Admissions',
    'Urgent Update',
  ];
  const allCategories = Array.from(
    new Set([...baseCategories, ...announcements.map((item) => item.category).filter(Boolean)])
  );
  const categoriesFilter: string[] = ['All', ...allCategories];

  const sortedAnnouncements = [...announcements]
    .filter((item) => {
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    })
    .sort((x, y) => Number(Boolean(y.pinned)) - Number(Boolean(x.pinned)));

  const openAddModal = () => {
    setEditingId(null);
    setTitle('');
    setCategory(allCategories[0] || 'General Notice');
    setCustomCategory('');
    setMessage('');
    setPhoto(DEFAULT_ANNOUNCEMENT_PHOTO);
    setDate(
      new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    );
    setAuthor('Telesports Academy Admin');
    setPinned(false);
    setExtraDetails([]);
    setExtraPhotos([]);
    setShowFormModal(true);
  };

  const openEditModal = (ann: Announcement) => {
    setEditingId(ann.id);
    setTitle(ann.title);
    setCategory(ann.category);
    setCustomCategory('');
    setMessage(ann.message);
    setPhoto(ann.photo || '');
    setDate(ann.date);
    setAuthor(ann.author);
    setPinned(Boolean(ann.pinned));
    setExtraDetails(ann.extraDetails ? [...ann.extraDetails] : []);
    setExtraPhotos(ann.extraPhotos ? [...ann.extraPhotos] : []);
    setShowFormModal(true);
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const cleanPhoto = photo.trim() || undefined;
    const finalCategory = (category === '__custom__' ? customCategory.trim() : category) || 'General Notice';
    const cleanExtraDetails = extraDetails.filter((d) => d.label.trim() && d.value.trim());
    const cleanExtraPhotos = extraPhotos.map((u) => u.trim()).filter(Boolean);

    if (editingId) {
      setAnnouncements(
        announcements.map((item) =>
          item.id === editingId
            ? {
                ...item,
                title: title.trim(),
                category: finalCategory,
                message: message.trim(),
                photo: cleanPhoto,
                date: date.trim() || item.date,
                author: author.trim() || 'Telesports Academy Admin',
                pinned,
                extraDetails: cleanExtraDetails,
                extraPhotos: cleanExtraPhotos,
              }
            : item
        )
      );
    } else {
      const newAnn: Announcement = {
        id: `ann-${Date.now()}`,
        title: title.trim(),
        category: finalCategory,
        message: message.trim(),
        photo: cleanPhoto,
        date:
          date.trim() ||
          new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
        author: author.trim() || 'Telesports Academy Admin',
        pinned,
        extraDetails: cleanExtraDetails,
        extraPhotos: cleanExtraPhotos,
      };
      setAnnouncements([newAnn, ...announcements]);
    }
    setShowFormModal(false);
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter((item) => item.id !== id));
    if (selectedAnnouncement?.id === id) setSelectedAnnouncement(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-white text-slate-900">
      {/* Header & Admin Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          {a.badge?.trim() && (
            <span className="px-3.5 py-1.5 rounded-full bg-pink-100 border border-pink-300 text-pink-900 font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
              <Megaphone className="w-3.5 h-3.5 text-pink-600" />
              {a.badge}
            </span>
          )}
          {a.heading?.trim() && (
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 uppercase tracking-tight">
              <RichTextRenderer text={a.heading} inline />
            </h1>
          )}
          {a.subheading?.trim() && (
            <div className="text-slate-600 text-sm sm:text-base mt-1 max-w-3xl">
              <RichTextRenderer text={a.subheading} />
            </div>
          )}
        </div>

        {isAdmin && (
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenCms}
              className="px-4 py-3 rounded-xl bg-yellow-400 text-slate-950 font-black text-xs shadow-sm hover:bg-yellow-300 transition-all flex items-center gap-1.5"
            >
              <Edit3 className="w-4 h-4" />
              Edit Page
            </button>
            <button
              onClick={openAddModal}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 text-white font-bold text-sm shadow-lg shadow-pink-600/20 hover:from-pink-500 hover:to-purple-600 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              Post Announcement &amp; Photo
            </button>
          </div>
        )}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-pink-50/50 p-4 rounded-2xl border border-pink-100">
        <div className="flex items-center space-x-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
          {categoriesFilter.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/20'
                  : 'bg-white text-slate-700 hover:bg-pink-50 border border-pink-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={a.searchPlaceholder || 'Search announcements...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-pink-600 shadow-xs"
          />
        </div>
      </div>

      {/* Announcements Grid */}
      {sortedAnnouncements.length === 0 ? (
        <div className="text-center py-16 rounded-3xl bg-pink-50/40 border border-pink-100 space-y-3">
          <Megaphone className="w-10 h-10 text-pink-600 mx-auto" />
          <h3 className="text-lg font-black text-slate-900 uppercase">No Announcements Found</h3>
          <p className="text-sm text-slate-600">Try selecting a different category or clearing your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sortedAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className={`rounded-2xl bg-white border overflow-hidden transition-all duration-300 flex flex-col justify-between group shadow-lg ${
                ann.pinned
                  ? 'border-pink-400 shadow-pink-100 ring-1 ring-yellow-400/60'
                  : 'border-pink-100 hover:border-pink-500 shadow-pink-50'
              }`}
            >
              <div>
                {ann.photo ? (
                  <div
                    onClick={() => setSelectedAnnouncement(ann)}
                    className="relative min-h-[9rem] overflow-hidden bg-slate-900 flex items-center justify-center cursor-pointer"
                  >
                    <img
                      src={ann.photo}
                      alt={ann.title}
                      className="w-full h-auto block group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-lg bg-white/95 backdrop-blur-md text-xs font-extrabold text-pink-700 border border-pink-200 uppercase shadow-xs">
                        {ann.category}
                      </span>
                      {ann.pinned && (
                        <span className="px-2.5 py-1 rounded-lg bg-yellow-400 text-slate-950 text-[10px] font-black uppercase flex items-center gap-1 shadow-xs">
                          <Pin className="w-3 h-3" />
                          Pinned
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-950/75 text-white text-[11px] font-bold flex items-center gap-1 backdrop-blur-sm">
                      <ImageIcon className="w-3.5 h-3.5 text-yellow-300" />
                      View Photo
                    </div>
                  </div>
                ) : (
                  <div className="px-6 pt-6 flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-lg bg-pink-50 text-pink-700 border border-pink-200 text-xs font-extrabold uppercase">
                      {ann.category}
                    </span>
                    {ann.pinned && (
                      <span className="px-2.5 py-1 rounded-lg bg-yellow-400 text-slate-950 text-[10px] font-black uppercase flex items-center gap-1">
                        <Pin className="w-3 h-3" />
                        Pinned
                      </span>
                    )}
                  </div>
                )}

                <div className="p-6 space-y-3">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-pink-600" />
                      {ann.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-purple-600" />
                      {ann.author}
                    </span>
                  </div>

                  <h3
                    onClick={() => setSelectedAnnouncement(ann)}
                    className="text-xl font-black text-slate-900 group-hover:text-pink-600 transition-colors cursor-pointer leading-snug"
                  >
                    {ann.title}
                  </h3>

                  <div className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                    <RichTextRenderer text={ann.message} />
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-3 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSelectedAnnouncement(ann)}
                    className="text-xs font-extrabold text-pink-600 hover:text-pink-700 uppercase tracking-wider"
                  >
                    {a.readMoreText || 'Read Full Announcement →'}
                  </button>
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => openEditModal(ann)}
                      className="flex-1 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit Announcement &amp; Photo
                    </button>
                    <button
                      onClick={() => handleDeleteAnnouncement(ann.id)}
                      className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-600 font-bold text-xs border border-red-200 flex items-center justify-center"
                      title="Delete Announcement"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Announcement Detail / Photo Lightbox Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-white border border-pink-200 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
            {selectedAnnouncement.photo && (
              <div className="relative bg-slate-900">
                <img
                  src={selectedAnnouncement.photo}
                  alt={selectedAnnouncement.title}
                  className="w-full h-auto block"
                />
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 text-slate-800 flex items-center justify-center hover:bg-white shadow-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <div className="p-6 sm:p-8 space-y-4">
              {!selectedAnnouncement.photo && (
                <div className="flex justify-end">
                  <button
                    onClick={() => setSelectedAnnouncement(null)}
                    className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-pink-100 text-pink-800 text-xs font-extrabold uppercase">
                  {selectedAnnouncement.category}
                </span>
                {selectedAnnouncement.pinned && (
                  <span className="px-2.5 py-1 rounded-lg bg-yellow-400 text-slate-950 text-[10px] font-black uppercase flex items-center gap-1">
                    <Pin className="w-3 h-3" />
                    Pinned
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {selectedAnnouncement.title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium pb-3 border-b border-slate-100">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-pink-600" />
                  {selectedAnnouncement.date}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-purple-600" />
                  {selectedAnnouncement.author}
                </span>
              </div>

              <div className="text-slate-700 text-base leading-relaxed">
                <RichTextRenderer text={selectedAnnouncement.message} />
              </div>

              {selectedAnnouncement.extraDetails && selectedAnnouncement.extraDetails.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {selectedAnnouncement.extraDetails.map((ed, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="text-[11px] font-bold text-slate-500 uppercase">{ed.label}</div>
                      <div className="text-xs font-bold text-slate-900 mt-0.5">{ed.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {selectedAnnouncement.extraPhotos && selectedAnnouncement.extraPhotos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                  {selectedAnnouncement.extraPhotos.map((pUrl, idx) => (
                    <img
                      key={idx}
                      src={pUrl}
                      alt={`${selectedAnnouncement.title} photo ${idx + 1}`}
                      className="w-full h-auto object-contain rounded-xl border border-pink-100 bg-slate-50"
                    />
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                {isAdmin && (
                  <button
                    onClick={() => {
                      const target = selectedAnnouncement;
                      setSelectedAnnouncement(null);
                      openEditModal(target);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-yellow-400 text-slate-950 font-black text-sm hover:bg-yellow-300 flex items-center gap-1.5"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                )}
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="px-6 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add / Edit Announcement & Photo Modal */}
      {isAdmin && showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white border border-pink-200 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 uppercase">
                {editingId ? 'Edit Announcement' : 'Post New Announcement'}
              </h2>
              <button
                onClick={() => setShowFormModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Announcement Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Holiday Boot Camp Dates & Kit Details"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={allCategories.includes(category) ? category : '__custom__'}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600"
                  >
                    {allCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="__custom__">+ Add Custom Category...</option>
                  </select>
                  {category === '__custom__' && (
                    <input
                      type="text"
                      required
                      placeholder="Type new category..."
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="w-full bg-white border border-pink-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-pink-600"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date</label>
                  <input
                    type="text"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Posted By (Author / Department)
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600"
                />
              </div>

              <RichTextEditor
                label="Announcement Details *"
                rows={4}
                placeholder="Write the full announcement message..."
                value={message}
                onChange={setMessage}
              />

              <ImageField
                label="Announcement Photo (Optional — Upload or Paste URL)"
                value={photo}
                onChange={setPhoto}
                allowClear
              />

              <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 cursor-pointer bg-pink-50/70 p-3 rounded-xl border border-pink-100">
                <input
                  type="checkbox"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="w-4 h-4 accent-pink-600 rounded"
                />
                Pin this announcement to the top of the notice board
              </label>

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
                  {editingId ? 'Save Changes' : 'Publish Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

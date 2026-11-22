import { useState } from 'react';
import { Program, SportType, ExtraDetailItem } from '../types';
import { SiteContent } from '../data/siteContent';
import {
  Search,
  CheckCircle2,
  Calendar,
  Clock,
  Banknote,
  X,
  Shield,
  ArrowRight,
  Edit3,
  Plus,
  Trash2,
} from 'lucide-react';
import ImageField from './ImageField';
import RichTextRenderer from './RichTextRenderer';
import RichTextEditor from './RichTextEditor';
import { StringListEditor, ExtraFieldsEditor } from './ExtraFieldsEditor';

interface ProgramsTabProps {
  siteContent: SiteContent;
  programs: Program[];
  setPrograms: (programs: Program[]) => void;
  onOpenBooking: () => void;
  isAdmin: boolean;
  onOpenCms: () => void;
}

export default function ProgramsTab({
  siteContent,
  programs,
  setPrograms,
  onOpenBooking,
  isAdmin,
  onOpenCms,
}: ProgramsTabProps) {
  const [selectedSport, setSelectedSport] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [sport, setSport] = useState<SportType>('Football');
  const [customSport, setCustomSport] = useState('');
  const [category, setCategory] = useState<string>('Elite High-Performance');
  const [customCategory, setCustomCategory] = useState('');
  const [duration, setDuration] = useState('');
  const [schedule, setSchedule] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [highlights, setHighlights] = useState<string[]>([]);
  const [extraDetails, setExtraDetails] = useState<ExtraDetailItem[]>([]);
  const [extraPhotos, setExtraPhotos] = useState<string[]>([]);
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600'
  );

  const p = siteContent.programs;
  const baseSports = siteContent.global.sportsList || ['Football', 'Tennis', 'Basketball', 'Swimming', 'Cricket', 'Esports'];
  const allProgramSports = Array.from(new Set([...baseSports, ...programs.map((item) => item.sport).filter(Boolean)]));
  const sportsFilter: string[] = ['All', ...allProgramSports];

  const baseCategories = p.categories || ['Junior Development', 'Elite High-Performance', 'Pro Pathway', 'Summer Intensive'];
  const allCategories = Array.from(new Set([...baseCategories, ...programs.map((item) => item.category).filter(Boolean)]));

  const filteredPrograms = programs.filter((prog) => {
    const matchesSport = selectedSport === 'All' || prog.sport === selectedSport;
    const matchesSearch =
      prog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSport && matchesSearch;
  });

  const openAddModal = () => {
    setEditingId(null);
    setTitle('');
    setSport(allProgramSports[0] || 'Football');
    setCustomSport('');
    setCategory(allCategories[1] || allCategories[0] || 'Elite High-Performance');
    setCustomCategory('');
    setDuration('12 Weeks');
    setSchedule('Mon - Fri (09:00 - 15:00)');
    setPrice('Ksh 65,000');
    setDescription('');
    setHighlights(['Daily tactical drills', 'Biomechanics analysis', 'Showcase match play']);
    setExtraDetails([]);
    setExtraPhotos([]);
    setImage('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600');
    setShowFormModal(true);
  };

  const openEditModal = (prog: Program) => {
    setEditingId(prog.id);
    setTitle(prog.title);
    setSport(prog.sport);
    setCustomSport('');
    setCategory(prog.category);
    setCustomCategory('');
    setDuration(prog.duration);
    setSchedule(prog.schedule);
    setPrice(prog.price);
    setDescription(prog.description);
    setHighlights(prog.highlights && prog.highlights.length > 0 ? [...prog.highlights] : []);
    setExtraDetails(prog.extraDetails ? [...prog.extraDetails] : []);
    setExtraPhotos(prog.extraPhotos ? [...prog.extraPhotos] : []);
    setImage(prog.image);
    setShowFormModal(true);
  };

  const handleSaveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const finalSport = (sport === '__custom__' ? customSport.trim() : sport) || 'Football';
    const finalCategory = (category === '__custom__' ? customCategory.trim() : category) || 'Elite High-Performance';
    const cleanHighlights = highlights.map((s) => s.trim()).filter(Boolean);
    const cleanExtraDetails = extraDetails.filter((d) => d.label.trim() && d.value.trim());
    const cleanExtraPhotos = extraPhotos.map((u) => u.trim()).filter(Boolean);

    if (editingId) {
      setPrograms(
        programs.map((item) =>
          item.id === editingId
            ? {
                ...item,
                title: title.trim(),
                sport: finalSport,
                category: finalCategory,
                duration,
                schedule,
                price,
                description,
                highlights: cleanHighlights.length ? cleanHighlights : ['Elite Tactical Training'],
                image,
                extraDetails: cleanExtraDetails,
                extraPhotos: cleanExtraPhotos,
              }
            : item
        )
      );
    } else {
      const newProg: Program = {
        id: `prog-${Date.now()}`,
        title: title.trim(),
        sport: finalSport,
        category: finalCategory,
        duration,
        schedule,
        price,
        description,
        highlights: cleanHighlights.length ? cleanHighlights : ['Elite Tactical Training'],
        image,
        extraDetails: cleanExtraDetails,
        extraPhotos: cleanExtraPhotos,
      };
      setPrograms([newProg, ...programs]);
    }
    setShowFormModal(false);
  };

  const handleDeleteProgram = (id: string) => {
    setPrograms(programs.filter((item) => item.id !== id));
    if (selectedProgram?.id === id) setSelectedProgram(null);
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
            Add Program
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
        {p.badge?.trim() && (
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-pink-100 border border-pink-300 text-pink-900 font-bold text-xs uppercase tracking-wider">
            {p.badge}
          </span>
        )}
        {p.heading?.trim() && (
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 uppercase tracking-tight">
            <RichTextRenderer text={p.heading} inline />
          </h1>
        )}
        {p.subheading?.trim() && (
          <div className="text-slate-600 text-base sm:text-lg">
            <RichTextRenderer text={p.subheading} />
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-pink-50/50 p-4 rounded-2xl border border-pink-100">
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {sportsFilter.map((sp) => (
            <button
              key={sp}
              onClick={() => setSelectedSport(sp)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase whitespace-nowrap transition-all ${
                selectedSport === sp
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/20'
                  : 'bg-white text-slate-700 hover:bg-pink-50 border border-pink-200'
              }`}
            >
              {sp}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={p.searchPlaceholder || 'Search programs...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-pink-600 transition-colors shadow-xs"
          />
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPrograms.map((prog) => (
          <div
            key={prog.id}
            className="rounded-2xl bg-white border border-pink-100 overflow-hidden hover:border-pink-500 transition-all duration-300 flex flex-col justify-between group shadow-lg shadow-pink-50"
          >
            <div>
              <div className="relative min-h-[8rem] overflow-hidden bg-slate-50 flex items-center justify-center">
                <img
                  src={prog.image}
                  alt={prog.title}
                  className="w-full h-auto block group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-white/95 backdrop-blur-md text-xs font-extrabold text-pink-700 border border-pink-200 uppercase shadow-xs">
                  {prog.sport}
                </div>
                <div className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-pink-600 text-white text-xs font-extrabold uppercase shadow-xs">
                  {prog.category}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
                  {prog.title}
                </h3>
                <div className="text-slate-600 text-sm leading-relaxed">
                  <RichTextRenderer text={prog.description} />
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-pink-600" /> Duration:
                    </span>
                    <span className="font-bold">{prog.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-pink-600" /> Schedule:
                    </span>
                    <span className="font-bold">{prog.schedule}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Banknote className="w-3.5 h-3.5 text-pink-600" /> Tuition:
                    </span>
                    <span className="font-extrabold text-pink-600 text-sm">{prog.price}</span>
                  </div>
                  {(prog.extraDetails || []).map((ed, i) => (
                    <div key={i} className="flex items-center justify-between text-slate-700">
                      <span className="text-slate-500">{ed.label}:</span>
                      <span className="font-bold">{ed.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 space-y-2">
              <button
                onClick={() => setSelectedProgram(prog)}
                className="w-full py-3 rounded-xl bg-pink-50 hover:bg-pink-600 hover:text-white text-pink-900 font-bold text-sm transition-all flex items-center justify-center gap-2 border border-pink-200"
              >
                {p.viewDetailsText || 'View Full Curriculum & Apply'}
                <ArrowRight className="w-4 h-4" />
              </button>

              {isAdmin && (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => openEditModal(prog)}
                    className="flex-1 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProgram(prog.id)}
                    className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-600 font-bold text-xs border border-red-200 flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Program Detail Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-white border border-pink-200 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="relative min-h-[12rem] bg-slate-900 flex items-center justify-center">
              <img
                src={selectedProgram.image}
                alt={selectedProgram.title}
                className="w-full h-auto block"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
              <button
                onClick={() => setSelectedProgram(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-slate-100 shadow-md"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-6 left-6 right-6">
                <span className="px-3 py-1 rounded-lg bg-pink-600 text-white text-xs font-extrabold uppercase mb-2 inline-block">
                  {selectedProgram.sport} • {selectedProgram.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">{selectedProgram.title}</h2>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="text-slate-600 text-base leading-relaxed">
                <RichTextRenderer text={selectedProgram.description} />
              </div>

              <div>
                <h4 className="text-slate-900 font-bold text-sm uppercase tracking-wider mb-3">
                  {p.highlightsHeading || 'Program Highlights & Training Modules'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedProgram.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5 bg-pink-50/60 p-3 rounded-xl border border-pink-100">
                      <CheckCircle2 className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedProgram.extraDetails && selectedProgram.extraDetails.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedProgram.extraDetails.map((ed, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="text-[11px] font-bold text-slate-500 uppercase">{ed.label}</div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">{ed.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {selectedProgram.extraPhotos && selectedProgram.extraPhotos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedProgram.extraPhotos.map((photoUrl, idx) => (
                    <img
                      key={idx}
                      src={photoUrl}
                      alt={`${selectedProgram.title} gallery ${idx + 1}`}
                      className="w-full h-auto object-contain rounded-xl border border-pink-100 bg-slate-50"
                    />
                  ))}
                </div>
              )}

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-500 font-medium">Investment / Tuition</div>
                  <div className="text-xl font-black text-pink-600">{selectedProgram.price}</div>
                </div>
                <div className="text-right sm:text-left">
                  <div className="text-xs text-slate-500 font-medium">Schedule</div>
                  <div className="text-sm font-bold text-slate-900">{selectedProgram.schedule}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    setSelectedProgram(null);
                    onOpenBooking();
                  }}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 text-white font-extrabold text-sm shadow-lg shadow-pink-600/20 hover:from-pink-500 hover:to-purple-600 transition-all flex items-center justify-center gap-2"
                >
                  <Shield className="w-4 h-4 text-yellow-300" />
                  {p.enrollBtnPrefix || 'Enroll / Book Trial for'} {selectedProgram.title}
                </button>
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="px-6 py-3.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add / Edit Program Modal */}
      {isAdmin && showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-white border border-pink-200 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 uppercase">
                {editingId ? 'Edit Program' : 'Add New Program'}
              </h2>
              <button
                onClick={() => setShowFormModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProgram} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Program Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Sport</label>
                  <select
                    value={allProgramSports.includes(sport) ? sport : '__custom__'}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setSport('__custom__');
                      } else {
                        setSport(e.target.value);
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600"
                  >
                    {allProgramSports.map((sp) => (
                      <option key={sp} value={sp}>
                        {sp}
                      </option>
                    ))}
                    <option value="__custom__">+ Add Custom Sport...</option>
                  </select>
                  {sport === '__custom__' && (
                    <input
                      type="text"
                      required
                      placeholder="Type new sport name..."
                      value={customSport}
                      onChange={(e) => setCustomSport(e.target.value)}
                      className="w-full bg-white border border-pink-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-pink-600"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={allCategories.includes(category) ? category : '__custom__'}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setCategory('__custom__');
                      } else {
                        setCategory(e.target.value);
                      }
                    }}
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
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Schedule</label>
                  <input
                    type="text"
                    required
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Price</label>
                  <input
                    type="text"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600"
                  />
                </div>
              </div>

              <ImageField
                label="Program Cover Image"
                value={image}
                onChange={setImage}
                required
              />

              <RichTextEditor
                label="Description"
                rows={3}
                value={description}
                onChange={setDescription}
                placeholder="Describe training curriculum, methodology, and outcomes..."
              />

              <StringListEditor
                label="Highlights & Training Modules"
                items={highlights}
                onChange={setHighlights}
                addButtonText="Add Extra Highlight"
                placeholder="e.g. Daily tactical drills"
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
                  {editingId ? 'Save Changes' : 'Create Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

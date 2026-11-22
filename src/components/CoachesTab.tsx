import { useState } from 'react';
import { Coach, SportType, NotificationCategory, ExtraDetailItem } from '../types';
import { SiteContent } from '../data/siteContent';
import { Star, Calendar, CheckCircle2, X, Edit3, Plus, Trash2, Award } from 'lucide-react';
import ImageField from './ImageField';
import RichTextRenderer from './RichTextRenderer';
import RichTextEditor from './RichTextEditor';
import { StringListEditor, ExtraFieldsEditor } from './ExtraFieldsEditor';

interface CoachesTabProps {
  siteContent: SiteContent;
  coaches: Coach[];
  setCoaches: (coaches: Coach[]) => void;
  isAdmin: boolean;
  onOpenCms: () => void;
  onAddNotification: (
    category: NotificationCategory,
    title: string,
    subtitle: string,
    details: string,
    targetTab: string
  ) => void;
}

export default function CoachesTab({
  siteContent,
  coaches,
  setCoaches,
  isAdmin,
  onOpenCms,
  onAddNotification,
}: CoachesTabProps) {
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [sessionDate, setSessionDate] = useState('');
  const [requesterName, setRequesterName] = useState('');
  const [focusNotes, setFocusNotes] = useState('');

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [sport, setSport] = useState<SportType>('Football');
  const [customSport, setCustomSport] = useState('');
  const [role, setRole] = useState('');
  const [experienceYears, setExperienceYears] = useState(10);
  const [rating, setRating] = useState(4.9);
  const [bio, setBio] = useState('');
  const [certifications, setCertifications] = useState<string[]>([]);
  const [extraDetails, setExtraDetails] = useState<ExtraDetailItem[]>([]);
  const [extraPhotos, setExtraPhotos] = useState<string[]>([]);
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400'
  );

  const c = siteContent.coaches;
  const baseSports = siteContent.global.sportsList || ['Football', 'Tennis', 'Basketball', 'Swimming', 'Cricket', 'Esports'];
  const allSports = Array.from(new Set([...baseSports, ...coaches.map((ch) => ch.sport).filter(Boolean)]));

  const handleBookSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoach) return;

    onAddNotification(
      'requests',
      `1-on-1 Coaching Request: ${selectedCoach.name}`,
      `${selectedCoach.sport} • Requested by ${requesterName || 'Athlete / Parent'}`,
      `Date: ${sessionDate}${focusNotes ? ` | Focus: ${focusNotes}` : ''}`,
      'coaches'
    );

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedCoach(null);
      setSessionDate('');
      setRequesterName('');
      setFocusNotes('');
    }, 2500);
  };

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setSport(allSports[0] || 'Football');
    setCustomSport('');
    setRole('Senior Tactical Coach');
    setExperienceYears(10);
    setRating(4.9);
    setBio('');
    setCertifications(['Telesports Certified Master Coach']);
    setExtraDetails([]);
    setExtraPhotos([]);
    setImage('https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400');
    setShowFormModal(true);
  };

  const openEditModal = (coach: Coach) => {
    setEditingId(coach.id);
    setName(coach.name);
    setSport(coach.sport);
    setCustomSport('');
    setRole(coach.role);
    setExperienceYears(coach.experienceYears);
    setRating(coach.rating);
    setBio(coach.bio);
    setCertifications(coach.certifications ? [...coach.certifications] : []);
    setExtraDetails(coach.extraDetails ? [...coach.extraDetails] : []);
    setExtraPhotos(coach.extraPhotos ? [...coach.extraPhotos] : []);
    setImage(coach.image);
    setShowFormModal(true);
  };

  const handleSaveCoach = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;
    const finalSport = (sport === '__custom__' ? customSport.trim() : sport) || 'Football';
    const cleanCerts = certifications.map((s) => s.trim()).filter(Boolean);
    const cleanExtraDetails = extraDetails.filter((d) => d.label.trim() && d.value.trim());
    const cleanExtraPhotos = extraPhotos.map((u) => u.trim()).filter(Boolean);

    if (editingId) {
      setCoaches(
        coaches.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: name.trim(),
                sport: finalSport,
                role: role.trim(),
                experienceYears: Number(experienceYears),
                rating: Number(rating),
                bio,
                image,
                certifications: cleanCerts.length ? cleanCerts : ['Telesports Certified Coach'],
                extraDetails: cleanExtraDetails,
                extraPhotos: cleanExtraPhotos,
              }
            : item
        )
      );
    } else {
      const newCoach: Coach = {
        id: `co-${Date.now()}`,
        name: name.trim(),
        sport: finalSport,
        role: role.trim(),
        experienceYears: Number(experienceYears),
        bio,
        image,
        certifications: cleanCerts.length ? cleanCerts : ['Telesports Certified Master Coach'],
        rating: Number(rating),
        extraDetails: cleanExtraDetails,
        extraPhotos: cleanExtraPhotos,
      };
      setCoaches([...coaches, newCoach]);
    }
    setShowFormModal(false);
  };

  const handleDeleteCoach = (id: string) => {
    setCoaches(coaches.filter((item) => item.id !== id));
    if (selectedCoach?.id === id) setSelectedCoach(null);
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
            Add Coach
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
        {c.badge?.trim() && (
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-pink-100 border border-pink-300 text-pink-900 font-bold text-xs uppercase tracking-wider">
            {c.badge}
          </span>
        )}
        {c.heading?.trim() && (
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 uppercase tracking-tight">
            <RichTextRenderer text={c.heading} inline />
          </h1>
        )}
        {c.subheading?.trim() && (
          <div className="text-slate-600 text-base sm:text-lg">
            <RichTextRenderer text={c.subheading} />
          </div>
        )}
      </div>

      {/* Coaches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {coaches.map((coach) => (
          <div
            key={coach.id}
            className="rounded-2xl bg-white border border-pink-100 overflow-hidden hover:border-pink-500 transition-all duration-300 flex flex-col justify-between group shadow-lg shadow-pink-50"
          >
            <div>
              <div className="relative min-h-[8rem] overflow-hidden bg-slate-50 flex items-center justify-center">
                <img
                  src={coach.image}
                  alt={coach.name}
                  className="w-full h-auto block group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-white/95 backdrop-blur-md text-xs font-extrabold text-pink-700 border border-pink-200 uppercase shadow-xs">
                  {coach.sport}
                </div>
                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-yellow-400 text-slate-950 text-xs font-black flex items-center gap-1 shadow-xs">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {coach.rating}
                </div>
              </div>

              <div className="p-6 space-y-3">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
                  {coach.name}
                </h3>
                <div className="text-xs text-pink-600 font-bold">{coach.role}</div>
                <div className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                  <RichTextRenderer text={coach.bio} />
                </div>

                {coach.certifications && coach.certifications.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {coach.certifications.slice(0, 2).map((cert, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-pink-50 border border-pink-200 text-pink-800 text-[10px] font-bold"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-2 text-xs text-slate-500">
                  <span className="font-bold text-slate-900">{coach.experienceYears} Years</span> Professional Experience
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 space-y-2">
              <button
                onClick={() => setSelectedCoach(coach)}
                className="w-full py-3 rounded-xl bg-pink-50 hover:bg-pink-600 hover:text-white text-pink-900 font-bold text-sm transition-all flex items-center justify-center gap-2 border border-pink-200"
              >
                <Calendar className="w-4 h-4" />
                {c.bookBtnText || 'Book 1-on-1 Session'}
              </button>

              {isAdmin && (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => openEditModal(coach)}
                    className="flex-1 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCoach(coach.id)}
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

      {/* Booking & Coach Profile Modal */}
      {selectedCoach && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white border border-pink-200 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 uppercase">
                {c.bookingModalTitle || 'Book 1-on-1 Mentorship'}
              </h2>
              <button
                onClick={() => setSelectedCoach(null)}
                className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-pink-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-pink-600/20">
                  <CheckCircle2 className="w-8 h-8 text-yellow-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {c.bookingSuccessTitle || 'Session Requested Successfully!'}
                </h3>
                <p className="text-slate-600 text-sm">
                  {c.bookingSuccessMessage || `Coach ${selectedCoach.name}'s office will contact you within 24 hours to confirm the schedule.`}
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookSession} className="space-y-4">
                <div className="flex items-center space-x-3 bg-pink-50/50 p-3 rounded-xl border border-pink-100">
                  <img
                    src={selectedCoach.image}
                    alt={selectedCoach.name}
                    className="w-16 h-auto max-h-20 rounded-lg object-contain bg-white border border-pink-100 shrink-0"
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-900">{selectedCoach.name}</div>
                    <div className="text-xs text-pink-600 font-semibold">{selectedCoach.role}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {selectedCoach.sport} • {selectedCoach.experienceYears} Years Exp
                    </div>
                  </div>
                </div>

                {selectedCoach.certifications && selectedCoach.certifications.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCoach.certifications.map((cert, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-pink-50 border border-pink-200 text-pink-900 text-[11px] font-bold inline-flex items-center gap-1"
                      >
                        <Award className="w-3 h-3 text-pink-600" />
                        {cert}
                      </span>
                    ))}
                  </div>
                )}

                {selectedCoach.extraDetails && selectedCoach.extraDetails.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedCoach.extraDetails.map((ed, idx) => (
                      <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                        <span className="font-bold text-slate-500">{ed.label}: </span>
                        <span className="font-bold text-slate-900">{ed.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {selectedCoach.extraPhotos && selectedCoach.extraPhotos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {selectedCoach.extraPhotos.map((pUrl, idx) => (
                      <img
                        key={idx}
                        src={pUrl}
                        alt={`${selectedCoach.name} ${idx + 1}`}
                        className="w-full h-auto object-contain rounded-xl border border-pink-100 bg-slate-50"
                      />
                    ))}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Smith"
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Select Date &amp; Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Focus Area / Notes</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Tactical positioning, video analysis review..."
                    value={focusNotes}
                    onChange={(e) => setFocusNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-pink-600 shadow-xs"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setSelectedCoach(null)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 text-white font-extrabold text-sm shadow-lg hover:from-pink-500 hover:to-purple-600"
                  >
                    Confirm Booking Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Admin Add / Edit Coach Modal */}
      {isAdmin && showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white border border-pink-200 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 uppercase">
                {editingId ? 'Edit Coach Profile' : 'Add Coaching Staff'}
              </h2>
              <button
                onClick={() => setShowFormModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoach} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Sport</label>
                  <select
                    value={allSports.includes(sport) ? sport : '__custom__'}
                    onChange={(e) => setSport(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600"
                  >
                    {allSports.map((sp) => (
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
                      placeholder="Type new sport..."
                      value={customSport}
                      onChange={(e) => setCustomSport(e.target.value)}
                      className="w-full bg-white border border-pink-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-pink-600"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Role / Title *</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600"
                  />
                </div>
              </div>

              <ImageField
                label="Coach Photo"
                value={image}
                onChange={setImage}
                required
              />

              <StringListEditor
                label="Certifications & Licenses"
                items={certifications}
                onChange={setCertifications}
                addButtonText="Add Extra Certification"
                placeholder="e.g. UEFA Pro Licence"
              />

              <RichTextEditor
                label="Bio"
                rows={3}
                value={bio}
                onChange={setBio}
                placeholder="Coaching background, methodology, achievements..."
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
                  {editingId ? 'Save Changes' : 'Add Coach'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

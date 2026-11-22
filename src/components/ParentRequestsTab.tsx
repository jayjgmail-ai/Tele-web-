import { useState } from 'react';
import { ParentSportRequest, SportType, NotificationCategory } from '../types';
import { SiteContent } from '../data/siteContent';
import { Users, CheckCircle2, Plus, X, Edit3, Check } from 'lucide-react';
import RichTextRenderer from './RichTextRenderer';

interface ParentRequestsTabProps {
  siteContent: SiteContent;
  requests: ParentSportRequest[];
  setRequests: (reqs: ParentSportRequest[]) => void;
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

export default function ParentRequestsTab({
  siteContent,
  requests,
  setRequests,
  isAdmin,
  onOpenCms,
  onAddNotification,
}: ParentRequestsTabProps) {
  const pr = siteContent.parentRequests;
  const sportsList =
    siteContent.global.sportsList && siteContent.global.sportsList.length > 0
      ? siteContent.global.sportsList
      : ['Football', 'Tennis', 'Basketball', 'Swimming', 'Cricket', 'Esports'];
  const skillLevels =
    pr.skillLevels && pr.skillLevels.length > 0
      ? pr.skillLevels
      : ['Beginner', 'Intermediate', 'Advanced / Competitive'];
  const extraQuestions = pr.extraQuestions || [];

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [successSubmitted, setSuccessSubmitted] = useState(false);

  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [kidName, setKidName] = useState('');
  const [kidAge, setKidAge] = useState(12);
  const [selectedSports, setSelectedSports] = useState<SportType[]>(
    sportsList[0] ? [sportsList[0]] : ['Football']
  );
  const [customSportInput, setCustomSportInput] = useState('');
  const [sportError, setSportError] = useState(false);
  const [skillLevel, setSkillLevel] = useState<string>(skillLevels[1] || skillLevels[0] || 'Intermediate');
  const [trainingGoals, setTrainingGoals] = useState('');
  const [extraAnswers, setExtraAnswers] = useState<Record<string, string>>({});

  const availableSports = Array.from(new Set([...sportsList, ...selectedSports]));

  const toggleSport = (sp: SportType) => {
    setSportError(false);
    setSelectedSports((prev) =>
      prev.includes(sp) ? prev.filter((item) => item !== sp) : [...prev, sp]
    );
  };

  const handleAddCustomSport = () => {
    const trimmed = customSportInput.trim();
    if (!trimmed) return;
    setSportError(false);
    if (!selectedSports.includes(trimmed)) {
      setSelectedSports((prev) => [...prev, trimmed]);
    }
    setCustomSportInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim() || !kidName.trim()) return;
    if (selectedSports.length === 0) {
      setSportError(true);
      return;
    }

    const sportSummary = selectedSports.join(', ');

    const mappedExtras = extraQuestions
      .map((q) => ({ label: q, value: (extraAnswers[q] || '').trim() }))
      .filter((item) => item.value);

    const newReq: ParentSportRequest = {
      id: `req-${Date.now()}`,
      parentName,
      parentEmail,
      phone,
      kidName,
      kidAge: Number(kidAge),
      sport: sportSummary,
      skillLevel,
      trainingGoals,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Received',
      extraAnswers: mappedExtras.length ? mappedExtras : undefined,
    };

    const extraSummary = mappedExtras.map((x) => `${x.label}: ${x.value}`).join(' | ');

    setRequests([newReq, ...requests]);
    onAddNotification(
      'requests',
      `Parent Sport Request: ${kidName} (Age ${kidAge})`,
      `${sportSummary} • ${skillLevel} (Parent: ${parentName})`,
      `Goals: ${trainingGoals} | Contact: ${parentEmail}${extraSummary ? ` | ${extraSummary}` : ''}`,
      'parent-requests'
    );
    setSuccessSubmitted(true);
    setTimeout(() => {
      setSuccessSubmitted(false);
      setShowRequestModal(false);
      setParentName('');
      setParentEmail('');
      setPhone('');
      setKidName('');
      setSelectedSports(sportsList[0] ? [sportsList[0]] : ['Football']);
      setCustomSportInput('');
      setSportError(false);
      setTrainingGoals('');
      setExtraAnswers({});
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-white text-slate-900">
      {isAdmin && (
        <div className="flex justify-end">
          <button
            onClick={onOpenCms}
            className="px-4 py-2 rounded-xl bg-yellow-400 text-slate-950 font-black text-xs shadow-sm hover:bg-yellow-300 transition-all flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Page
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-3xl bg-pink-50/50 p-8 sm:p-12 border border-pink-200 relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            {pr.badge?.trim() && (
              <span className="inline-block px-3.5 py-1.5 rounded-md bg-pink-600 text-white font-black text-xs uppercase tracking-wider shadow-xs">
                {pr.badge}
              </span>
            )}
            {pr.heading?.trim() && (
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 uppercase tracking-tight">
                <RichTextRenderer text={pr.heading} inline />
              </h1>
            )}
            {pr.subheading?.trim() && (
              <div className="text-slate-600 text-base leading-relaxed">
                <RichTextRenderer text={pr.subheading} />
              </div>
            )}
          </div>

          <button
            onClick={() => setShowRequestModal(true)}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 text-white font-black text-base shadow-lg shadow-pink-600/20 hover:from-pink-500 hover:to-purple-600 transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Plus className="w-5 h-5 text-yellow-300" />
            {pr.requestBtnText}
          </button>
        </div>
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-white border border-pink-200 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 uppercase flex items-center gap-2">
                <Users className="w-5 h-5 text-pink-600" />
                {pr.modalTitle || 'Parent Sport Training Request'}
              </h2>
              <button
                onClick={() => setShowRequestModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {successSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-pink-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-pink-600/20">
                  <CheckCircle2 className="w-8 h-8 text-yellow-300" />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase">
                  {pr.successTitle || 'Sport Request Sent Successfully!'}
                </h3>
                <p className="text-slate-600 text-sm">
                  {pr.successMessage ||
                    'Our academy coordinator will review your request and contact you with trial session details.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Parent / Guardian Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Connor"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600 shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Parent Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="sarah@example.com"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600 shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600 shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Kid Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Timmy Connor"
                      value={kidName}
                      onChange={(e) => setKidName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600 shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Kid Age *</label>
                    <input
                      type="number"
                      min="6"
                      max="19"
                      value={kidAge}
                      onChange={(e) => setKidAge(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Requested Sport * (Select all that apply)
                    </label>
                    <span className="text-[11px] font-bold text-pink-600">
                      {selectedSports.length} selected
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <div className="flex flex-wrap gap-2">
                      {availableSports.map((sp) => {
                        const isSelected = selectedSports.includes(sp);
                        return (
                          <button
                            key={sp}
                            type="button"
                            onClick={() => toggleSport(sp)}
                            aria-pressed={isSelected}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-pink-600 text-white border-pink-600 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-pink-300'
                            }`}
                          >
                            <span
                              className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                                isSelected
                                  ? 'bg-yellow-400 border-yellow-400 text-slate-950'
                                  : 'border-slate-300 bg-slate-50'
                              }`}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </span>
                            <span>{sp}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Other sport (optional)..."
                        value={customSportInput}
                        onChange={(e) => setCustomSportInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomSport();
                          }
                        }}
                        className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-pink-600"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomSport}
                        className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-pink-100 text-slate-800 hover:text-pink-700 font-bold text-xs flex items-center gap-1 shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add
                      </button>
                    </div>
                  </div>
                  {sportError && (
                    <p className="text-xs font-semibold text-red-600 mt-1">
                      Please select at least one sport.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Skill Level *</label>
                  <select
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600 shadow-xs"
                  >
                    {skillLevels.map((lv) => (
                      <option key={lv} value={lv}>
                        {lv}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Training Goals &amp; Expectations *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe what you want your child to achieve (e.g. agility, technique, confidence)..."
                    value={trainingGoals}
                    onChange={(e) => setTrainingGoals(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600 shadow-xs"
                  />
                </div>

                {extraQuestions.map((q, idx) => (
                  <div key={idx}>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{q}</label>
                    <input
                      type="text"
                      value={extraAnswers[q] || ''}
                      onChange={(e) => setExtraAnswers({ ...extraAnswers, [q]: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600 shadow-xs"
                    />
                  </div>
                ))}

                <div className="pt-4 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 text-white font-black text-sm shadow-lg hover:from-pink-500 hover:to-purple-600"
                  >
                    {pr.modalSubmitText || 'Submit Sport Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

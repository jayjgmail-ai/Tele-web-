import { useState } from 'react';
import { Partner, PartnerCategory, ExtraDetailItem } from '../types';
import { SiteContent } from '../data/siteContent';
import {
  Search,
  Plus,
  Building2,
  GraduationCap,
  MapPin,
  Calendar,
  CheckCircle2,
  X,
  Edit3,
  Trash2,
  Briefcase,
  Users,
} from 'lucide-react';
import ImageField from './ImageField';
import RichTextRenderer from './RichTextRenderer';
import RichTextEditor from './RichTextEditor';
import { StringListEditor, ExtraFieldsEditor } from './ExtraFieldsEditor';

interface PartnersTabProps {
  siteContent: SiteContent;
  partners: Partner[];
  setPartners: (partners: Partner[]) => void;
  isAdmin: boolean;
  onOpenCms: () => void;
}

const DEFAULT_PARTNER_IMG =
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600';

export default function PartnersTab({
  siteContent,
  partners,
  setPartners,
  isAdmin,
  onOpenCms,
}: PartnersTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<PartnerCategory>('School');
  const [customCategory, setCustomCategory] = useState('');
  const [formStatus, setFormStatus] = useState<string>('Active Partner');
  const [customStatus, setCustomStatus] = useState('');
  const [formFocusArea, setFormFocusArea] = useState('');
  const [formPrograms, setFormPrograms] = useState<string[]>([]);
  const [formDescription, setFormDescription] = useState('');
  const [formLocation, setFormLocation] = useState('Nairobi, Kenya');
  const [formContactPerson, setFormContactPerson] = useState('');
  const [formPartnerSince, setFormPartnerSince] = useState(new Date().getFullYear().toString());
  const [formImage, setFormImage] = useState(DEFAULT_PARTNER_IMG);
  const [extraDetails, setExtraDetails] = useState<ExtraDetailItem[]>([]);
  const [extraPhotos, setExtraPhotos] = useState<string[]>([]);

  const p = siteContent.partners;
  const baseCategories = p.categories || [
    'School',
    'College / University',
    'Corporate Organization',
    'Ministry / Community',
  ];
  const allPartnerCategories = Array.from(
    new Set([...baseCategories, ...partners.map((pt) => pt.category).filter(Boolean)])
  );
  const categoriesFilter: string[] = ['All', ...allPartnerCategories];

  const baseStatuses = p.statuses || ['Active Partner', 'Featured Client', 'Ongoing Program'];
  const allStatuses = Array.from(
    new Set([...baseStatuses, ...partners.map((pt) => pt.status).filter(Boolean)])
  );

  const filteredPartners = partners.filter((partner) => {
    const matchesCat = selectedCategory === 'All' || partner.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      partner.name.toLowerCase().includes(q) ||
      partner.focusArea.toLowerCase().includes(q) ||
      partner.location.toLowerCase().includes(q) ||
      partner.programsProvided.some((prog) => prog.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  const openAddModal = () => {
    setEditingId(null);
    setFormName('');
    setFormCategory(allPartnerCategories[0] || 'School');
    setCustomCategory('');
    setFormStatus(allStatuses[0] || 'Active Partner');
    setCustomStatus('');
    setFormFocusArea('');
    setFormPrograms(['Team Building', 'Boot Camps', 'Wellness Programs']);
    setFormDescription('');
    setFormLocation('Nairobi, Kenya');
    setFormContactPerson('');
    setFormPartnerSince(new Date().getFullYear().toString());
    setFormImage(DEFAULT_PARTNER_IMG);
    setExtraDetails([]);
    setExtraPhotos([]);
    setIsFormModalOpen(true);
  };

  const openEditModal = (partner: Partner) => {
    setEditingId(partner.id);
    setFormName(partner.name);
    setFormCategory(partner.category);
    setCustomCategory('');
    setFormStatus(partner.status);
    setCustomStatus('');
    setFormFocusArea(partner.focusArea);
    setFormPrograms(partner.programsProvided ? [...partner.programsProvided] : []);
    setFormDescription(partner.description);
    setFormLocation(partner.location);
    setFormContactPerson(partner.contactPerson || '');
    setFormPartnerSince(partner.partnerSince);
    setFormImage(partner.logoOrImage);
    setExtraDetails(partner.extraDetails ? [...partner.extraDetails] : []);
    setExtraPhotos(partner.extraPhotos ? [...partner.extraPhotos] : []);
    setIsFormModalOpen(true);
  };

  const handleSavePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formFocusArea.trim()) return;

    const finalCategory = (formCategory === '__custom__' ? customCategory.trim() : formCategory) || 'School';
    const finalStatus = (formStatus === '__custom__' ? customStatus.trim() : formStatus) || 'Active Partner';
    const parsedPrograms = formPrograms.map((s) => s.trim()).filter(Boolean);
    const cleanExtraDetails = extraDetails.filter((d) => d.label.trim() && d.value.trim());
    const cleanExtraPhotos = extraPhotos.map((u) => u.trim()).filter(Boolean);

    if (editingId) {
      setPartners(
        partners.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: formName.trim(),
                category: finalCategory,
                status: finalStatus,
                focusArea: formFocusArea.trim(),
                programsProvided: parsedPrograms.length ? parsedPrograms : ['Sports & Team Building'],
                description:
                  formDescription.trim() ||
                  'Strategic partner collaborating with Telesports Academy on sports, wellness, and leadership.',
                location: formLocation.trim() || 'Kenya',
                contactPerson: formContactPerson.trim() || undefined,
                partnerSince: formPartnerSince.trim() || new Date().getFullYear().toString(),
                logoOrImage: formImage.trim() || DEFAULT_PARTNER_IMG,
                extraDetails: cleanExtraDetails,
                extraPhotos: cleanExtraPhotos,
              }
            : item
        )
      );
    } else {
      const newPartner: Partner = {
        id: `part-${Date.now()}`,
        name: formName.trim(),
        category: finalCategory,
        status: finalStatus,
        focusArea: formFocusArea.trim(),
        programsProvided: parsedPrograms.length ? parsedPrograms : ['Sports & Team Building'],
        description:
          formDescription.trim() ||
          'Strategic partner collaborating with Telesports Academy on sports, wellness, and leadership.',
        location: formLocation.trim() || 'Kenya',
        contactPerson: formContactPerson.trim() || undefined,
        partnerSince: formPartnerSince.trim() || new Date().getFullYear().toString(),
        logoOrImage: formImage.trim() || DEFAULT_PARTNER_IMG,
        extraDetails: cleanExtraDetails,
        extraPhotos: cleanExtraPhotos,
      };
      setPartners([newPartner, ...partners]);
    }
    setIsFormModalOpen(false);
  };

  const handleDeletePartner = (id: string) => {
    setPartners(partners.filter((item) => item.id !== id));
    if (selectedPartner?.id === id) setSelectedPartner(null);
  };

  const getCategoryIcon = (category: PartnerCategory) => {
    switch (category) {
      case 'School':
      case 'College / University':
        return GraduationCap;
      case 'Corporate Organization':
        return Briefcase;
      case 'Ministry / Community':
        return Users;
      default:
        return Building2;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-white text-slate-900">
      {/* Header & Admin Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="px-3.5 py-1.5 rounded-full bg-pink-100 border border-pink-300 text-pink-900 font-bold text-xs uppercase tracking-wider">
            {p.badge}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 uppercase tracking-tight mt-2">
            <RichTextRenderer text={p.heading} inline />
          </h1>
          <div className="text-slate-600 text-sm sm:text-base mt-1 max-w-3xl">
            <RichTextRenderer text={p.subheading} />
          </div>
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
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 text-white font-bold text-sm shadow-lg shadow-pink-600/20 hover:from-pink-500 hover:to-purple-600 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              Add School / Organization
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
            placeholder={p.searchPlaceholder || 'Search schools, organizations, programs...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-pink-600 transition-colors shadow-xs"
          />
        </div>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-100">
          <div className="text-2xl font-black text-pink-600">{partners.length}</div>
          <div className="text-xs font-bold text-slate-600 uppercase">Total Partners</div>
        </div>
        <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
          <div className="text-2xl font-black text-purple-700">
            {partners.filter((x) => x.category === 'School' || x.category === 'College / University').length}
          </div>
          <div className="text-xs font-bold text-slate-600 uppercase">Schools &amp; Colleges</div>
        </div>
        <div className="p-4 rounded-2xl bg-yellow-50/70 border border-yellow-200">
          <div className="text-2xl font-black text-slate-900">
            {partners.filter((x) => x.category === 'Corporate Organization').length}
          </div>
          <div className="text-xs font-bold text-slate-600 uppercase">Corporate Organizations</div>
        </div>
        <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-100">
          <div className="text-2xl font-black text-pink-600">
            {partners.filter((x) => x.category === 'Ministry / Community').length}
          </div>
          <div className="text-xs font-bold text-slate-600 uppercase">Ministries &amp; Community</div>
        </div>
      </div>

      {/* Partners Grid */}
      {filteredPartners.length === 0 ? (
        <div className="text-center py-16 rounded-3xl bg-pink-50/40 border border-pink-100 space-y-3">
          <Building2 className="w-10 h-10 text-pink-600 mx-auto" />
          <h3 className="text-lg font-black text-slate-900 uppercase">No Matching Partners</h3>
          <p className="text-sm text-slate-600">Try clearing your search or selecting a different category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPartners.map((partner) => {
            const CatIcon = getCategoryIcon(partner.category);
            return (
              <div
                key={partner.id}
                className="rounded-2xl bg-white border border-pink-100 overflow-hidden hover:border-pink-500 transition-all duration-300 flex flex-col justify-between group shadow-lg shadow-pink-50"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={partner.logoOrImage}
                      alt={partner.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent"></div>
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-md text-[11px] font-extrabold text-pink-700 border border-pink-200 uppercase flex items-center gap-1.5 shadow-xs">
                      <CatIcon className="w-3.5 h-3.5" />
                      {partner.category}
                    </div>
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-yellow-400 text-slate-950 text-[10px] font-black uppercase shadow-xs">
                      {partner.status}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="text-lg font-black leading-tight drop-shadow-xs">{partner.name}</h3>
                      <div className="text-xs text-yellow-300 font-semibold flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {partner.location}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <div className="text-[11px] font-extrabold text-pink-600 uppercase tracking-wider mb-1">
                        {partner.focusArea}
                      </div>
                      <div className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                        <RichTextRenderer text={partner.description} />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                      {partner.programsProvided.slice(0, 3).map((prog, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-pink-50 border border-pink-200 text-pink-900 text-[11px] font-bold"
                        >
                          {prog}
                        </span>
                      ))}
                      {partner.programsProvided.length > 3 && (
                        <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-bold">
                          +{partner.programsProvided.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-3 border-t border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-pink-600" />
                      Partner since {partner.partnerSince}
                    </span>
                    <button
                      onClick={() => setSelectedPartner(partner)}
                      className="px-4 py-2 rounded-xl bg-pink-50 hover:bg-pink-600 hover:text-white text-pink-900 font-bold text-xs transition-all flex items-center gap-1.5 border border-pink-200"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      {p.viewBtnText || 'View Partnership'}
                    </button>
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => openEditModal(partner)}
                        className="flex-1 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit Partner
                      </button>
                      <button
                        onClick={() => handleDeletePartner(partner.id)}
                        className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-600 font-bold text-xs border border-red-200 flex items-center justify-center"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Partner Detail Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-white border border-pink-200 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="relative h-52 bg-slate-100">
              <img
                src={selectedPartner.logoOrImage}
                alt={selectedPartner.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
              <button
                onClick={() => setSelectedPartner(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 text-slate-800 flex items-center justify-center hover:bg-white shadow-md"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="px-2.5 py-1 rounded-md bg-yellow-400 text-slate-950 text-[10px] font-black uppercase">
                  {selectedPartner.category} • {selectedPartner.status}
                </span>
                <h2 className="text-2xl font-black mt-1.5">{selectedPartner.name}</h2>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-pink-50/60 p-3 rounded-xl border border-pink-100">
                  <div className="text-slate-500 font-semibold">Location</div>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedPartner.location}</div>
                </div>
                <div className="bg-pink-50/60 p-3 rounded-xl border border-pink-100">
                  <div className="text-slate-500 font-semibold">Partner Since</div>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedPartner.partnerSince}</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-extrabold text-pink-600 uppercase tracking-wider mb-1">
                  Collaboration Focus
                </div>
                <div className="font-bold text-slate-900 text-base mb-2">{selectedPartner.focusArea}</div>
                <div className="text-slate-600 text-sm leading-relaxed">
                  <RichTextRenderer text={selectedPartner.description} />
                </div>
              </div>

              {selectedPartner.contactPerson && (
                <div className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-semibold">Coordinator / Liaison: </span>
                  <span className="font-bold text-slate-900">{selectedPartner.contactPerson}</span>
                </div>
              )}

              <div>
                <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-2.5">
                  Programs &amp; Services Delivered
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedPartner.programsProvided.map((prog, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-2 text-sm text-slate-700 bg-pink-50/40 p-2.5 rounded-xl border border-pink-100"
                    >
                      <CheckCircle2 className="w-4 h-4 text-pink-600 shrink-0" />
                      <span className="font-medium">{prog}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedPartner.extraDetails && selectedPartner.extraDetails.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedPartner.extraDetails.map((ed, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="text-[11px] font-bold text-slate-500 uppercase">{ed.label}</div>
                      <div className="text-xs font-bold text-slate-900 mt-0.5">{ed.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {selectedPartner.extraPhotos && selectedPartner.extraPhotos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {selectedPartner.extraPhotos.map((photoUrl, idx) => (
                    <img
                      key={idx}
                      src={photoUrl}
                      alt={`${selectedPartner.name} photo ${idx + 1}`}
                      className="w-full h-24 object-cover rounded-xl border border-pink-100"
                    />
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                {isAdmin && (
                  <button
                    onClick={() => {
                      const target = selectedPartner;
                      setSelectedPartner(null);
                      openEditModal(target);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-yellow-400 text-slate-950 font-black text-sm hover:bg-yellow-300 flex items-center gap-1.5"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Partner
                  </button>
                )}
                <button
                  onClick={() => setSelectedPartner(null)}
                  className="px-6 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add / Edit Partner Modal */}
      {isAdmin && isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white border border-pink-200 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 uppercase">
                {editingId ? 'Edit Partner School / Org' : 'Add New Partner'}
              </h2>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePartner} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  School or Organization Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Braeburn Group Of Schools / Britam"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-pink-600 shadow-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={allPartnerCategories.includes(formCategory) ? formCategory : '__custom__'}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600 shadow-xs"
                  >
                    {allPartnerCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="__custom__">+ Add Custom Category...</option>
                  </select>
                  {formCategory === '__custom__' && (
                    <input
                      type="text"
                      required
                      placeholder="New category name..."
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="w-full bg-white border border-pink-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-pink-600"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status</label>
                  <select
                    value={allStatuses.includes(formStatus) ? formStatus : '__custom__'}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600 shadow-xs"
                  >
                    {allStatuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                    <option value="__custom__">+ Add Custom Status...</option>
                  </select>
                  {formStatus === '__custom__' && (
                    <input
                      type="text"
                      required
                      placeholder="New status label..."
                      value={customStatus}
                      onChange={(e) => setCustomStatus(e.target.value)}
                      className="w-full bg-white border border-pink-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-pink-600"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Focus Area / Partnership Scope *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Team Building, Youth Sports & Wellness"
                  value={formFocusArea}
                  onChange={(e) => setFormFocusArea(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-pink-600 shadow-xs"
                />
              </div>

              <StringListEditor
                label="Programs & Services Delivered"
                items={formPrograms}
                onChange={setFormPrograms}
                addButtonText="Add Extra Program / Service"
                placeholder="e.g. Swimming, Boot Camps, Leadership"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Nairobi, Kenya"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600 shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Partner Since</label>
                  <input
                    type="text"
                    placeholder="e.g. 2024"
                    value={formPartnerSince}
                    onChange={(e) => setFormPartnerSince(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600 shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Contact / Liaison Person (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Head of Sports / HR Director"
                  value={formContactPerson}
                  onChange={(e) => setFormContactPerson(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600 shadow-xs"
                />
              </div>

              <RichTextEditor
                label="Description"
                rows={3}
                placeholder="Describe the partnership, sports activities, or corporate training delivered..."
                value={formDescription}
                onChange={setFormDescription}
              />

              <ImageField
                label="Partner Logo or Photo"
                value={formImage}
                onChange={setFormImage}
                required
              />

              <ExtraFieldsEditor
                extraDetails={extraDetails}
                onChangeDetails={setExtraDetails}
                extraPhotos={extraPhotos}
                onChangePhotos={setExtraPhotos}
              />

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 text-white font-extrabold text-sm shadow-lg"
                >
                  {editingId ? 'Save Changes' : 'Add Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

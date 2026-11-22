import { useState } from 'react';
import { Shield, CheckCircle2, Send, MapPin, Phone, Mail, Edit3, Info } from 'lucide-react';
import { SportType, NotificationCategory } from '../types';
import { SiteContent } from '../data/siteContent';
import RichTextRenderer from './RichTextRenderer';

interface ContactTabProps {
  siteContent: SiteContent;
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

export default function ContactTab({ siteContent, isAdmin, onOpenCms, onAddNotification }: ContactTabProps) {
  const c = siteContent.contact;
  const g = siteContent.global;
  const sportsList = g.sportsList && g.sportsList.length > 0 ? g.sportsList : ['Football', 'Tennis', 'Basketball', 'Swimming', 'Cricket', 'Esports'];
  const programOptions =
    c.programOptions && c.programOptions.length > 0
      ? c.programOptions
      : ['Junior Development (U14)', 'Elite High-Performance (U18)', 'Pro Pathway / Showcase', 'Summer Intensive Camp'];

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    sport: (sportsList[0] || 'Football') as SportType,
    age: '16',
    programType: programOptions[1] || programOptions[0] || 'Elite High-Performance',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddNotification(
      'requests',
      `Trial & Enrollment Request: ${formData.fullName}`,
      `${formData.sport} • ${formData.programType} (Age ${formData.age})`,
      `Email: ${formData.email} | Phone: ${formData.phone}${formData.message ? ` | Notes: ${formData.message}` : ''}`,
      'contact'
    );
    setSubmitted(true);
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

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3.5 py-1.5 rounded-full bg-pink-100 border border-pink-300 text-pink-900 font-bold text-xs uppercase tracking-wider">
          {c.badge}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 uppercase tracking-tight">
          <RichTextRenderer text={c.heading} inline />
        </h1>
        <div className="text-slate-600 text-base sm:text-lg">
          <RichTextRenderer text={c.subheading} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact info side */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-pink-50/40 border border-pink-200 p-8 space-y-8 shadow-xl">
            <h3 className="text-xl font-black text-slate-900 uppercase">{c.hqCardTitle}</h3>

            <div className="space-y-6 text-sm">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-pink-100 border border-pink-300 flex items-center justify-center text-pink-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">{c.locationLabel || 'Location & Complex'}</div>
                  <div className="text-slate-600">{g.hqAddress}</div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-pink-100 border border-pink-300 flex items-center justify-center text-pink-600 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">{c.phoneLabel || 'Admissions Hotline'}</div>
                  <div className="text-slate-600">{g.hqPhone}</div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-pink-100 border border-pink-300 flex items-center justify-center text-pink-600 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">{c.emailLabel || 'Email Admissions'}</div>
                  <div className="text-slate-600">{g.hqEmail}</div>
                </div>
              </div>

              {(c.extraContacts || []).map((ec, idx) => (
                <div key={idx} className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-pink-100 border border-pink-300 flex items-center justify-center text-pink-600 shrink-0">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{ec.label}</div>
                    <div className="text-slate-600">{ec.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-white border border-pink-200 space-y-2 shadow-xs">
              <div className="text-xs font-bold text-pink-700 uppercase">{c.trialScheduleTitle}</div>
              <p className="text-xs text-slate-600 leading-relaxed">{c.trialScheduleText}</p>
            </div>
          </div>
        </div>

        {/* Form side */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl bg-white border border-pink-200 p-8 sm:p-10 shadow-2xl">
            {submitted ? (
              <div className="py-16 text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-pink-600 text-white flex items-center justify-center mx-auto animate-bounce shadow-lg shadow-pink-600/30">
                  <CheckCircle2 className="w-10 h-10 text-yellow-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase">
                  {c.successTitle || 'Application Received Successfully!'}
                </h3>
                <p className="text-slate-600 text-base max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="text-pink-600 font-bold">{formData.fullName}</span>.{' '}
                  {c.successMessage ||
                    'Our admissions committee and sports directors will review your profile and contact you within 24 hours.'}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-8 py-3.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-all"
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-2xl font-black text-slate-900 uppercase">{c.formTitle}</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Athlete Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Liam Smith"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-pink-600 shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. liam@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-pink-600 shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-pink-600 shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Sport *</label>
                    <select
                      value={formData.sport}
                      onChange={(e) => setFormData({ ...formData, sport: e.target.value as SportType })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-pink-600 shadow-xs"
                    >
                      {sportsList.map((sp) => (
                        <option key={sp} value={sp}>
                          {sp}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Age *</label>
                    <input
                      type="number"
                      min="6"
                      max="30"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-pink-600 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Program Category *</label>
                  <select
                    value={formData.programType}
                    onChange={(e) => setFormData({ ...formData, programType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-pink-600 shadow-xs"
                  >
                    {programOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Additional Background / Athletic History
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about current club, position, achievements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-pink-600 shadow-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 text-white font-extrabold text-base shadow-xl shadow-pink-600/25 hover:from-pink-500 hover:to-purple-600 transition-all flex items-center justify-center gap-2"
                >
                  <Shield className="w-5 h-5 text-yellow-300" />
                  {c.submitBtnText}
                  <Send className="w-4 h-4 ml-1" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

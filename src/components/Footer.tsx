import { useState } from 'react';
import {
  Trophy,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Globe,
  Info,
  X,
} from 'lucide-react';
import { SiteContent, LegalLinkConfig, FooterLinkConfig } from '../data/siteContent';

interface FooterProps {
  siteContent: SiteContent;
  setCurrentTab?: (tab: string) => void;
}

export default function Footer({ siteContent, setCurrentTab }: FooterProps) {
  const [activeLegal, setActiveLegal] = useState<LegalLinkConfig | null>(null);
  const g = siteContent.global;
  const columns = g.footerColumns || [];
  const socialLinks = g.socialLinks || [];
  const legalLinks = g.legalLinks || [];
  const extraContacts = siteContent.contact?.extraContacts || [];

  const getSocialIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('insta')) return Instagram;
    if (p.includes('twit') || p === 'x') return Twitter;
    if (p.includes('you')) return Youtube;
    if (p.includes('face')) return Facebook;
    return Globe;
  };

  const handleFooterLink = (link: FooterLinkConfig) => {
    if (link.url && /^https?:\/\//i.test(link.url.trim())) {
      window.open(link.url.trim(), '_blank', 'noopener,noreferrer');
    } else if (link.tabId && setCurrentTab) {
      setCurrentTab(link.tabId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLegalClick = (leg: LegalLinkConfig) => {
    if (leg.url && /^https?:\/\//i.test(leg.url.trim())) {
      window.open(leg.url.trim(), '_blank', 'noopener,noreferrer');
    } else {
      setActiveLegal(leg);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div
                className={`h-11 rounded-xl flex items-center justify-center shadow-lg overflow-hidden ${
                  g.logoUrl
                    ? 'w-[68px] bg-white border border-pink-200 p-1'
                    : 'w-10 h-10 bg-gradient-to-br from-pink-600 to-purple-700'
                }`}
              >
                {g.logoUrl ? (
                  <img src={g.logoUrl} alt={g.brandPrefix} className="w-full h-full object-contain" />
                ) : (
                  <Trophy className="w-5 h-5 text-yellow-300 stroke-[2.5]" />
                )}
              </div>
              <span className="text-lg font-black tracking-wider text-white uppercase">
                {g.brandPrefix}
                {g.brandSuffix && (
                  <>
                    {' '}
                    <span className="text-pink-400">{g.brandSuffix}</span>
                  </>
                )}
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">{g.footerDescription}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              {socialLinks.map((soc) => {
                const IconComp = getSocialIcon(soc.platform);
                const trimmed = (soc.url || '').trim();
                const isExternal = /^https?:\/\//i.test(trimmed);
                const safeHref = /^(https?:\/\/|#)/i.test(trimmed) ? trimmed : '#';
                return (
                  <a
                    key={soc.id}
                    href={safeHref}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    title={soc.platform}
                    aria-label={soc.platform}
                    className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-pink-500 transition-colors"
                  >
                    <IconComp className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Dynamic Footer Columns */}
          {columns.map((col) => (
            <div key={col.id}>
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-pink-500 pl-3">
                {col.title}
              </h3>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((link, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={() => handleFooterLink(link)}
                      className="text-left hover:text-pink-400 transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-pink-500 pl-3">
              {g.hqColumnTitle || 'HQ Campus'}
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-pink-400 shrink-0 mt-1" />
                <span>{g.hqAddress}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-pink-400 shrink-0" />
                <span>{g.hqPhone}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-pink-400 shrink-0" />
                <span>{g.hqEmail}</span>
              </li>
              {extraContacts.map((ec, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <Info className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-200">{ec.label}:</strong> {ec.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>
            © {new Date().getFullYear()} {g.copyrightText}
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {legalLinks.map((leg) => (
              <button
                key={leg.id}
                type="button"
                onClick={() => handleLegalClick(leg)}
                className="hover:text-slate-200 transition-colors"
              >
                {leg.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Legal Notice Modal */}
      {activeLegal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white text-slate-900 border border-pink-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black uppercase text-slate-900">{activeLegal.label}</h3>
              <button
                onClick={() => setActiveLegal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{activeLegal.content}</p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveLegal(null)}
                className="px-5 py-2 rounded-xl bg-pink-600 text-white font-bold text-xs hover:bg-pink-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}

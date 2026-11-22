import { useState, useRef, useEffect } from 'react';
import { Trophy, Menu, X, Shield, ChevronRight } from 'lucide-react';
import { SiteContent, NavItemConfig } from '../data/siteContent';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenBooking: () => void;
  onOpenAdminModal: () => void;
  siteContent: SiteContent;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  onOpenBooking,
  onOpenAdminModal,
  siteContent,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const tapCountRef = useRef<number>(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (tapTimerRef.current) {
        clearTimeout(tapTimerRef.current);
      }
    };
  }, []);

  const handleHeaderPress = () => {
    setCurrentTab('home');
    tapCountRef.current += 1;

    if (tapTimerRef.current) {
      clearTimeout(tapTimerRef.current);
    }

    if (tapCountRef.current >= 4) {
      tapCountRef.current = 0;
      onOpenAdminModal();
    } else {
      tapTimerRef.current = setTimeout(() => {
        tapCountRef.current = 0;
      }, 3000);
    }
  };

  const navItems: NavItemConfig[] = (siteContent.global.navItems || []).filter(
    (item) => item.visible !== false
  );

  const handleNavClick = (item: NavItemConfig) => {
    if (item.url && /^https?:\/\//i.test(item.url.trim())) {
      window.open(item.url.trim(), '_blank', 'noopener,noreferrer');
    } else {
      setCurrentTab(item.id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-pink-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2 sm:gap-3">
          {/* Logo & Hidden 4-Press Admin Trigger */}
          <div
            className="flex items-center flex-1 xl:flex-none gap-2.5 sm:gap-3 cursor-pointer group select-none min-w-0"
            onClick={handleHeaderPress}
          >
            <div
              className={`h-12 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden shrink-0 ${
                siteContent.global.logoUrl
                  ? 'w-[68px] sm:w-[72px] bg-white border border-pink-200 p-1 shadow-md shadow-pink-600/15'
                  : 'w-12 bg-gradient-to-br from-pink-600 to-purple-700 shadow-lg shadow-pink-600/20'
              }`}
            >
              {siteContent.global.logoUrl ? (
                <img
                  src={siteContent.global.logoUrl}
                  alt={siteContent.global.brandPrefix}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Trophy className="w-6 h-6 text-yellow-300 stroke-[2.5]" />
              )}
            </div>
            <div className="flex-1 xl:flex-none text-center xl:text-left min-w-0">
              <span className="text-lg sm:text-xl font-black tracking-widest text-slate-900 uppercase inline-flex items-center justify-center xl:justify-start gap-1.5">
                <span>{siteContent.global.brandPrefix}</span>
                {siteContent.global.brandSuffix && (
                  <span className="text-pink-600">{siteContent.global.brandSuffix}</span>
                )}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-500 tracking-wider sm:tracking-widest block uppercase truncate">
                {siteContent.global.tagline}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const active = !item.url && currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-pink-50 text-pink-700 border border-pink-300 shadow-xs'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-black bg-yellow-400 text-slate-950 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTA */}
          <div className="hidden md:flex items-center space-x-3 shrink-0">
            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 text-white font-extrabold text-sm shadow-lg shadow-pink-600/20 hover:from-pink-500 hover:to-purple-600 transition-all flex items-center gap-2 group"
            >
              <Shield className="w-4 h-4 text-yellow-300" />
              {siteContent.global.bookTrialBtn}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile menu button (matched width on <md to keep TELESPORTS balanced in both margins) */}
          <div className="xl:hidden flex items-center justify-end w-[68px] sm:w-[72px] md:w-auto shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-pink-200 px-4 pt-2 pb-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between ${
                !item.url && currentTab === item.id
                  ? 'bg-pink-50 text-pink-700 border border-pink-300'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-yellow-400 text-slate-950 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
          <div className="pt-2">
            <button
              onClick={() => {
                onOpenBooking();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-pink-600 text-white font-extrabold text-center shadow-lg flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4 text-yellow-300" />
              {siteContent.global.bookTrialBtn}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

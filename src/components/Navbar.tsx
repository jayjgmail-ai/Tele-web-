import { useRef, useEffect } from 'react';
import { Trophy, Shield, ChevronRight } from 'lucide-react';
import { SiteContent } from '../data/siteContent';

interface NavbarProps {
  currentTab?: string;
  setCurrentTab: (tab: string) => void;
  onOpenBooking: () => void;
  onOpenAdminModal: () => void;
  siteContent: SiteContent;
}

export default function Navbar({
  setCurrentTab,
  onOpenBooking,
  onOpenAdminModal,
  siteContent,
}: NavbarProps) {
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

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-pink-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2 sm:gap-3">
          {/* Logo & Hidden 4-Press Admin Trigger */}
          <div
            className="flex items-center flex-1 md:flex-none gap-2.5 sm:gap-3 cursor-pointer group select-none min-w-0"
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
            <div className="flex-1 md:flex-none text-center md:text-left min-w-0">
              <span className="text-lg sm:text-xl font-black tracking-widest text-slate-900 uppercase inline-flex items-center justify-center md:justify-start gap-1.5">
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

          {/* Action CTA (Desktop/Tablet) */}
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

          {/* Right margin spacer on <md to keep TELESPORTS balanced in both margins */}
          <div
            className={`md:hidden shrink-0 ${
              siteContent.global.logoUrl ? 'w-[68px] sm:w-[72px]' : 'w-12'
            }`}
            aria-hidden="true"
          />
        </div>
      </div>
    </header>
  );
}

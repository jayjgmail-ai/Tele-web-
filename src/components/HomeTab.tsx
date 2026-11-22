import {
  Trophy,
  Shield,
  ArrowRight,
  Star,
  Activity,
  Users,
  Award,
  PlayCircle,
  Zap,
  Edit3,
  Home,
  UserCheck,
  Briefcase,
  ClipboardList,
  ShoppingBag,
  Newspaper,
  GraduationCap,
  Building2,
  Megaphone,
  Sparkles,
} from 'lucide-react';
import { SiteContent, QuickNavTileConfig } from '../data/siteContent';
import RichTextRenderer from './RichTextRenderer';

interface HomeTabProps {
  siteContent: SiteContent;
  setCurrentTab: (tab: string) => void;
  onOpenBooking: () => void;
  isAdmin: boolean;
  onOpenCms: () => void;
}

function getTileIcon(targetTab: string) {
  switch (targetTab) {
    case 'home':
      return Home;
    case 'programs':
      return Award;
    case 'partners':
      return Building2;
    case 'coaches':
      return UserCheck;
    case 'coach-jobs':
      return Briefcase;
    case 'parent-requests':
      return ClipboardList;
    case 'merchandise':
      return ShoppingBag;
    case 'announcements':
      return Megaphone;
    case 'aicoach':
      return Zap;
    case 'news':
      return Newspaper;
    case 'contact':
      return GraduationCap;
    default:
      return Sparkles;
  }
}

export default function HomeTab({
  siteContent,
  setCurrentTab,
  onOpenBooking,
  isAdmin,
  onOpenCms,
}: HomeTabProps) {
  const h = siteContent.home;

  const quickNavTiles: QuickNavTileConfig[] = (h.quickNavTiles || []).filter(
    (tile) => tile.visible !== false
  );

  const statsList =
    h.stats && h.stats.length > 0
      ? h.stats
      : [
          { value: h.stat1Value, label: h.stat1Label },
          { value: h.stat2Value, label: h.stat2Label },
          { value: h.stat3Value, label: h.stat3Label },
        ];

  const handleTileClick = (tile: QuickNavTileConfig) => {
    if (tile.url && /^https?:\/\//i.test(tile.url.trim())) {
      window.open(tile.url.trim(), '_blank', 'noopener,noreferrer');
    } else if (tile.targetTab === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentTab(tile.targetTab || 'programs');
    }
  };

  return (
    <div className="space-y-20 pb-20 bg-white text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-24 bg-gradient-to-b from-pink-50/50 to-white border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {isAdmin && (
            <div className="mb-5 flex justify-end">
              <button
                onClick={onOpenCms}
                className="px-4 py-2 rounded-xl bg-yellow-400 text-slate-950 font-black text-xs shadow-sm hover:bg-yellow-300 transition-all flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Page
              </button>
            </div>
          )}

          {/* Quick Navigation Clickable Tiles above Hero Headline */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-2.5 sm:gap-3 mb-10">
            {quickNavTiles.map((tile, idx) => {
              const TileIcon = getTileIcon(tile.targetTab);
              const isHome = tile.targetTab === 'home' && !tile.url;
              const tileColorClass = isHome
                ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-700 border-yellow-400 ring-2 ring-yellow-400/60 shadow-lg shadow-pink-600/25'
                : idx % 2 === 0
                  ? 'bg-gradient-to-r from-pink-600 to-purple-700 border-pink-500/40 shadow-md shadow-pink-600/20 hover:from-pink-500 hover:to-purple-600 hover:-translate-y-0.5 hover:shadow-lg'
                  : 'bg-gradient-to-r from-purple-700 to-indigo-700 border-purple-500/40 shadow-md shadow-purple-700/20 hover:from-purple-600 hover:to-indigo-600 hover:-translate-y-0.5 hover:shadow-lg';

              return (
                <button
                  key={tile.id}
                  onClick={() => handleTileClick(tile)}
                  className={`group relative flex items-center justify-between gap-2 p-3 rounded-2xl border transition-all text-left text-white ${tileColorClass}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                        isHome
                          ? 'bg-yellow-400 text-slate-950 shadow-xs'
                          : 'bg-white/15 text-yellow-300'
                      }`}
                    >
                      <TileIcon className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-extrabold leading-tight truncate text-white">
                      {tile.label}
                    </span>
                  </div>
                  {tile.badge?.trim() && (
                    <span className="px-1.5 py-0.5 text-[9px] font-black bg-yellow-400 text-slate-950 rounded-md shrink-0 uppercase shadow-xs">
                      {tile.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {h.heroTitle?.trim() && (
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 uppercase leading-[1.05]">
                  <RichTextRenderer text={h.heroTitle} inline />
                </h1>
              )}

              {h.heroSubtitle?.trim() && (
                <div className="text-slate-600 text-lg sm:text-xl font-normal max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  <RichTextRenderer text={h.heroSubtitle} />
                </div>
              )}

              {(h.heroPrimaryCta?.trim() || h.heroSecondaryCta?.trim()) && (
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                  {h.heroPrimaryCta?.trim() && (
                    <button
                      onClick={onOpenBooking}
                      className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 text-white font-black text-base shadow-xl shadow-pink-600/25 hover:from-pink-500 hover:to-purple-600 transition-all flex items-center justify-center gap-2 group"
                    >
                      <Shield className="w-5 h-5 text-yellow-300" />
                      {h.heroPrimaryCta}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}

                  {h.heroSecondaryCta?.trim() && (
                    <button
                      onClick={() => setCurrentTab('programs')}
                      className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-base hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-xs"
                    >
                      <PlayCircle className="w-5 h-5 text-pink-600" />
                      {h.heroSecondaryCta}
                    </button>
                  )}
                </div>
              )}

              {/* Trust badges / Stats */}
              <div
                className={`pt-8 border-t border-slate-200 grid gap-6 text-left ${
                  statsList.length >= 4
                    ? 'grid-cols-2 sm:grid-cols-4'
                    : statsList.length === 2
                      ? 'grid-cols-2'
                      : 'grid-cols-3'
                }`}
              >
                {statsList.map((stat, idx) => (
                  <div key={idx}>
                    <div
                      className={`text-2xl sm:text-3xl font-black ${
                        idx % 2 === 1 ? 'text-pink-600' : 'text-slate-900'
                      }`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right card image stack */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="rounded-2xl overflow-hidden border border-pink-200 shadow-2xl bg-white">
                  <img
                    src={h.heroImage}
                    alt="Telesports Academy Showcase"
                    className="w-full h-auto block mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Telesports Academy */}
      <section className="bg-pink-50/40 border-y border-pink-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            {h.whyBadge?.trim() && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-900 text-xs font-bold uppercase mb-3">
                {h.whyBadge}
              </div>
            )}
            {h.whyHeading?.trim() && (
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight mb-4">
                <RichTextRenderer text={h.whyHeading} inline />
              </h2>
            )}
            {h.whySubheading?.trim() && (
              <div className="text-slate-600 text-base">
                <RichTextRenderer text={h.whySubheading} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {h.whyCards.map((card, idx) => {
              const IconComp = [Award, Activity, Users, Trophy][idx % 4];
              return (
                <div
                  key={idx}
                  className="p-8 rounded-2xl bg-white border border-pink-100 hover:border-pink-500 transition-all shadow-md"
                >
                  <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 mb-6">
                    <IconComp className="w-6 h-6" />
                  </div>
                  {card.badge?.trim() && (
                    <span className="inline-block px-2 py-0.5 mb-2 rounded bg-yellow-400 text-slate-950 text-[10px] font-black uppercase">
                      {card.badge}
                    </span>
                  )}
                  {card.title?.trim() && (
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      <RichTextRenderer text={card.title} inline />
                    </h3>
                  )}
                  {card.description?.trim() && (
                    <div className="text-slate-600 text-sm leading-relaxed">
                      <RichTextRenderer text={card.description} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          {h.testimonialsBadge?.trim() && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-900 text-xs font-bold uppercase mb-3">
              {h.testimonialsBadge}
            </div>
          )}
          {h.testimonialsHeading?.trim() && (
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight">
              <RichTextRenderer text={h.testimonialsHeading} inline />
            </h2>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {h.testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-white border border-pink-100 shadow-xl shadow-pink-50 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <div className="text-slate-600 text-sm italic leading-relaxed">
                  <RichTextRenderer text={t.quote} />
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center space-x-3">
                {t.avatar ? (
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-pink-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-700 font-black flex items-center justify-center border border-pink-200">
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="text-sm font-bold text-slate-900">{t.name}</div>
                  <div className="text-xs text-pink-600 font-semibold">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-700 p-10 sm:p-14 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-yellow-400/20 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl space-y-6">
            {h.ctaBadge?.trim() && (
              <span className="inline-block px-3.5 py-1.5 rounded-full bg-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md">
                {h.ctaBadge}
              </span>
            )}

            {h.ctaHeading?.trim() && (
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                <RichTextRenderer text={h.ctaHeading} inline />
              </h2>
            )}

            {h.ctaSubheading?.trim() && (
              <div className="text-white/90 font-medium text-base sm:text-lg">
                <RichTextRenderer text={h.ctaSubheading} />
              </div>
            )}

            {(h.ctaPrimaryBtn?.trim() || h.ctaSecondaryBtn?.trim()) && (
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                {h.ctaPrimaryBtn?.trim() && (
                  <button
                    onClick={onOpenBooking}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-yellow-400 text-slate-950 font-extrabold text-base shadow-xl hover:bg-yellow-300 transition-all flex items-center justify-center gap-2"
                  >
                    <Shield className="w-5 h-5 text-slate-950" />
                    {h.ctaPrimaryBtn}
                  </button>
                )}

                {h.ctaSecondaryBtn?.trim() && (
                  <button
                    onClick={() => setCurrentTab('aicoach')}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/20 border border-white/30 text-white font-extrabold text-base hover:bg-white/30 transition-all flex items-center justify-center gap-2 backdrop-blur-md"
                  >
                    <Zap className="w-5 h-5 text-yellow-300" />
                    {h.ctaSecondaryBtn}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

import { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeTab from './components/HomeTab';
import ProgramsTab from './components/ProgramsTab';
import PartnersTab from './components/PartnersTab';
import CoachesTab from './components/CoachesTab';
import AnnouncementsTab from './components/AnnouncementsTab';
import AiCoachTab from './components/AiCoachTab';
import NewsTab from './components/NewsTab';
import ContactTab from './components/ContactTab';
import CoachJobsTab from './components/CoachJobsTab';
import ParentRequestsTab from './components/ParentRequestsTab';
import MerchandiseTab from './components/MerchandiseTab';
import AdminCmsModal from './components/AdminCmsModal';
import AdminNotificationsModal from './components/AdminNotificationsModal';
import CustomBlocksRenderer from './components/CustomBlocksRenderer';
import { initialSiteContent, SiteContent, getFontCss } from './data/siteContent';
import {
  initialPrograms,
  initialPartners,
  initialCoaches,
  initialCoachApplications,
  initialParentRequests,
  initialMerchandise,
  initialAnnouncements,
  initialNews,
} from './data/mockData';
import {
  Program,
  Partner,
  Coach,
  CoachApplication,
  ParentSportRequest,
  MerchandiseItem,
  Announcement,
  NewsArticle,
  AdminNotification,
  NotificationCategory,
} from './types';
import { Lock, X, ShieldCheck, CheckCircle2, Bell } from 'lucide-react';

function loadStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function loadStoredSiteContent(): SiteContent {
  try {
    const raw = localStorage.getItem('telesports_site_content_v2');
    if (!raw) return initialSiteContent;
    const parsed = JSON.parse(raw) as Partial<SiteContent>;

    const mergedGlobal = {
      ...initialSiteContent.global,
      ...(parsed.global || {}),
      logoUrl: parsed.global?.logoUrl || initialSiteContent.global.logoUrl,
      navItems:
        parsed.global?.navItems && parsed.global.navItems.length > 0
          ? parsed.global.navItems
          : initialSiteContent.global.navItems,
      footerColumns:
        parsed.global?.footerColumns && parsed.global.footerColumns.length > 0
          ? parsed.global.footerColumns
          : initialSiteContent.global.footerColumns,
      socialLinks:
        parsed.global?.socialLinks && parsed.global.socialLinks.length > 0
          ? parsed.global.socialLinks
          : initialSiteContent.global.socialLinks,
      legalLinks:
        parsed.global?.legalLinks && parsed.global.legalLinks.length > 0
          ? parsed.global.legalLinks
          : initialSiteContent.global.legalLinks,
      sportsList:
        parsed.global?.sportsList && parsed.global.sportsList.length > 0
          ? parsed.global.sportsList
          : initialSiteContent.global.sportsList,
    };
    if (mergedGlobal.brandSuffix === 'ACADEMY') {
      mergedGlobal.brandSuffix = initialSiteContent.global.brandSuffix;
    }
    if (mergedGlobal.tagline === 'Sports Management & Elite Training') {
      mergedGlobal.tagline = initialSiteContent.global.tagline;
    }

    const parsedHome = parsed.home || ({} as Partial<SiteContent['home']>);
    const fallbackStats = [
      {
        value: parsedHome.stat1Value || initialSiteContent.home.stat1Value,
        label: parsedHome.stat1Label || initialSiteContent.home.stat1Label,
      },
      {
        value: parsedHome.stat2Value || initialSiteContent.home.stat2Value,
        label: parsedHome.stat2Label || initialSiteContent.home.stat2Label,
      },
      {
        value: parsedHome.stat3Value || initialSiteContent.home.stat3Value,
        label: parsedHome.stat3Label || initialSiteContent.home.stat3Label,
      },
    ];

    return {
      global: mergedGlobal,
      home: {
        ...initialSiteContent.home,
        ...parsedHome,
        stats:
          parsedHome.stats && parsedHome.stats.length > 0
            ? parsedHome.stats
            : fallbackStats,
        quickNavTiles:
          parsedHome.quickNavTiles && parsedHome.quickNavTiles.length > 0
            ? parsedHome.quickNavTiles
            : initialSiteContent.home.quickNavTiles,
      },
      programs: {
        ...initialSiteContent.programs,
        ...(parsed.programs || {}),
        categories:
          parsed.programs?.categories && parsed.programs.categories.length > 0
            ? parsed.programs.categories
            : initialSiteContent.programs.categories,
      },
      partners: {
        ...initialSiteContent.partners,
        ...(parsed.partners || {}),
        categories:
          parsed.partners?.categories && parsed.partners.categories.length > 0
            ? parsed.partners.categories
            : initialSiteContent.partners.categories,
        statuses:
          parsed.partners?.statuses && parsed.partners.statuses.length > 0
            ? parsed.partners.statuses
            : initialSiteContent.partners.statuses,
      },
      coaches: { ...initialSiteContent.coaches, ...(parsed.coaches || {}) },
      coachJobs: {
        ...initialSiteContent.coachJobs,
        ...(parsed.coachJobs || {}),
        extraQuestions: parsed.coachJobs?.extraQuestions || [],
      },
      parentRequests: {
        ...initialSiteContent.parentRequests,
        ...(parsed.parentRequests || {}),
        skillLevels:
          parsed.parentRequests?.skillLevels && parsed.parentRequests.skillLevels.length > 0
            ? parsed.parentRequests.skillLevels
            : initialSiteContent.parentRequests.skillLevels,
        extraQuestions: parsed.parentRequests?.extraQuestions || [],
      },
      merchandise: {
        ...initialSiteContent.merchandise,
        ...(parsed.merchandise || {}),
        categories:
          parsed.merchandise?.categories && parsed.merchandise.categories.length > 0
            ? parsed.merchandise.categories
            : initialSiteContent.merchandise.categories,
      },
      announcements: {
        ...initialSiteContent.announcements,
        ...(parsed.announcements || {}),
        categories:
          parsed.announcements?.categories && parsed.announcements.categories.length > 0
            ? parsed.announcements.categories
            : initialSiteContent.announcements.categories,
      },
      aiCoach: { ...initialSiteContent.aiCoach, ...(parsed.aiCoach || {}) },
      news: {
        ...initialSiteContent.news,
        ...(parsed.news || {}),
        categories:
          parsed.news?.categories && parsed.news.categories.length > 0
            ? parsed.news.categories
            : initialSiteContent.news.categories,
      },
      contact: {
        ...initialSiteContent.contact,
        ...(parsed.contact || {}),
        extraContacts: parsed.contact?.extraContacts || [],
        programOptions:
          parsed.contact?.programOptions && parsed.contact.programOptions.length > 0
            ? parsed.contact.programOptions
            : initialSiteContent.contact.programOptions,
      },
      pageStyles: parsed.pageStyles || {},
      pageBlocks: parsed.pageBlocks || {},
    };
  } catch {
    return initialSiteContent;
  }
}


const VALID_TABS = new Set([
  'home',
  'programs',
  'partners',
  'coaches',
  'coach-jobs',
  'parent-requests',
  'merchandise',
  'announcements',
  'aicoach',
  'news',
  'contact',
]);

function getTabFromHash(): string {
  try {
    const hash = window.location.hash.replace(/^#\/?/, '').trim();
    return hash && VALID_TABS.has(hash) ? hash : 'home';
  } catch {
    return 'home';
  }
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>(getTabFromHash);
  const currentTabRef = useRef<string>(currentTab);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [showCmsModal, setShowCmsModal] = useState<boolean>(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);
  const [adminPin, setAdminPin] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);
  const [pinErrorMessage, setPinErrorMessage] = useState<string>('Incorrect PIN.');

  const [siteContent, setSiteContent] = useState<SiteContent>(loadStoredSiteContent);
  const [programs, setPrograms] = useState<Program[]>(() =>
    loadStored('telesports_programs_v2_ksh', initialPrograms)
  );
  const [partners, setPartners] = useState<Partner[]>(() => loadStored('telesports_partners_v1', initialPartners));
  const [coaches, setCoaches] = useState<Coach[]>(() => loadStored('telesports_coaches', initialCoaches));
  const [coachApplications, setCoachApplications] = useState<CoachApplication[]>(() =>
    loadStored('telesports_coach_apps', initialCoachApplications)
  );
  const [parentRequests, setParentRequests] = useState<ParentSportRequest[]>(() =>
    loadStored('telesports_parent_reqs', initialParentRequests)
  );
  const [merchandise, setMerchandise] = useState<MerchandiseItem[]>(() =>
    loadStored('telesports_merchandise_v2_ksh', initialMerchandise)
  );
  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    loadStored('telesports_announcements_v1', initialAnnouncements)
  );
  const [news, setNews] = useState<NewsArticle[]>(() => loadStored('telesports_news', initialNews));
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem('telesports_site_content_v2', JSON.stringify(siteContent));
    } catch {}
  }, [siteContent]);

  useEffect(() => {
    try {
      localStorage.setItem('telesports_programs_v2_ksh', JSON.stringify(programs));
    } catch {}
  }, [programs]);

  useEffect(() => {
    try {
      localStorage.setItem('telesports_partners_v1', JSON.stringify(partners));
    } catch {}
  }, [partners]);

  useEffect(() => {
    try {
      localStorage.setItem('telesports_coaches', JSON.stringify(coaches));
    } catch {}
  }, [coaches]);

  useEffect(() => {
    try {
      localStorage.setItem('telesports_coach_apps', JSON.stringify(coachApplications));
    } catch {}
  }, [coachApplications]);

  useEffect(() => {
    try {
      localStorage.setItem('telesports_parent_reqs', JSON.stringify(parentRequests));
    } catch {}
  }, [parentRequests]);

  useEffect(() => {
    try {
      localStorage.setItem('telesports_merchandise_v2_ksh', JSON.stringify(merchandise));
    } catch {}
  }, [merchandise]);

  useEffect(() => {
    try {
      localStorage.setItem('telesports_announcements_v1', JSON.stringify(announcements));
    } catch {}
  }, [announcements]);

  useEffect(() => {
    try {
      localStorage.setItem('telesports_news', JSON.stringify(news));
    } catch {}
  }, [news]);


  useEffect(() => {
    currentTabRef.current = currentTab;
  }, [currentTab]);

  useEffect(() => {
    try {
      const initial = getTabFromHash();
      if (!window.history.state || typeof window.history.state.tab !== 'string') {
        window.history.replaceState({ tab: initial }, '', `#${initial}`);
      }
    } catch {}

    const syncFromHistory = (stateTab?: string) => {
      const nextTab = stateTab && VALID_TABS.has(stateTab) ? stateTab : getTabFromHash();
      if (nextTab !== currentTabRef.current) {
        currentTabRef.current = nextTab;
        setCurrentTab(nextTab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const handlePopState = (event: PopStateEvent) => {
      const stateTab =
        event.state && typeof event.state.tab === 'string' ? event.state.tab : undefined;
      syncFromHistory(stateTab);
    };

    const handleHashChange = () => {
      syncFromHistory();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const navigateToTab = useCallback((tab: string) => {
    if (!tab) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (currentTabRef.current === tab) return;
    currentTabRef.current = tab;
    setCurrentTab(tab);
    try {
      window.history.pushState({ tab }, '', `#${tab}`);
    } catch {}
  }, []);

  const handleOpenBooking = () => {
    navigateToTab('contact');
  };

  const handleExitAdmin = useCallback(() => {
    setIsAdmin(false);
    setAdminToken(null);
    setNotifications([]);
    setShowNotificationsModal(false);
    setShowCmsModal(false);
    setShowAdminModal(false);
  }, []);

  const fetchServerNotifications = useCallback(
    async (token: string) => {
      try {
        const res = await fetch('/api/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          handleExitAdmin();
          return;
        }
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data?.notifications)) {
          setNotifications(data.notifications);
        }
      } catch {
        // Ignore transient network polling errors
      }
    },
    [handleExitAdmin]
  );

  useEffect(() => {
    if (!isAdmin || !adminToken) return;
    void fetchServerNotifications(adminToken);
    const interval = window.setInterval(() => {
      void fetchServerNotifications(adminToken);
    }, 8000);
    return () => window.clearInterval(interval);
  }, [isAdmin, adminToken, fetchServerNotifications]);

  useEffect(() => {
    if (isAdmin && adminToken && showNotificationsModal) {
      void fetchServerNotifications(adminToken);
    }
  }, [isAdmin, adminToken, showNotificationsModal, fetchServerNotifications]);

  const fetchServerMerchandise = useCallback(async () => {
    try {
      const res = await fetch('/api/merchandise');
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data?.merchandise)) {
        setMerchandise(data.merchandise);
      }
    } catch {
      // Keep cached fallback if network fails temporarily
    }
  }, []);

  useEffect(() => {
    void fetchServerMerchandise();
  }, [fetchServerMerchandise]);

  useEffect(() => {
    if (currentTab === 'merchandise') {
      void fetchServerMerchandise();
    }
  }, [currentTab, fetchServerMerchandise]);

  const handleCreateMerchandise = useCallback(
    async (item: Omit<MerchandiseItem, 'id'>): Promise<{ ok: boolean; error?: string }> => {
      if (!adminToken) {
        return { ok: false, error: 'Please log in as Admin again to upload merchandise.' };
      }
      try {
        const res = await fetch('/api/merchandise', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify(item),
        });
        if (res.status === 401) {
          handleExitAdmin();
          return { ok: false, error: 'Admin session expired. Please log in again.' };
        }
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          return { ok: false, error: data?.error || 'Could not upload merchandise item.' };
        }
        if (Array.isArray(data?.merchandise)) {
          setMerchandise(data.merchandise);
        }
        return { ok: true };
      } catch {
        return { ok: false, error: 'Network error while uploading. Please try again.' };
      }
    },
    [adminToken, handleExitAdmin]
  );

  const handleUpdateMerchandise = useCallback(
    async (
      id: string,
      item: Omit<MerchandiseItem, 'id'>
    ): Promise<{ ok: boolean; error?: string }> => {
      if (!adminToken) {
        return { ok: false, error: 'Please log in as Admin again to update merchandise.' };
      }
      try {
        const res = await fetch(`/api/merchandise/${encodeURIComponent(id)}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify(item),
        });
        if (res.status === 401) {
          handleExitAdmin();
          return { ok: false, error: 'Admin session expired. Please log in again.' };
        }
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          return { ok: false, error: data?.error || 'Could not save merchandise changes.' };
        }
        if (Array.isArray(data?.merchandise)) {
          setMerchandise(data.merchandise);
        }
        return { ok: true };
      } catch {
        return { ok: false, error: 'Network error while saving changes. Please try again.' };
      }
    },
    [adminToken, handleExitAdmin]
  );

  const handleDeleteMerchandise = useCallback(
    async (id: string): Promise<{ ok: boolean; error?: string }> => {
      if (!adminToken) {
        return { ok: false, error: 'Please log in as Admin again to delete merchandise.' };
      }
      try {
        const res = await fetch(`/api/merchandise/${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        if (res.status === 401) {
          handleExitAdmin();
          return { ok: false, error: 'Admin session expired. Please log in again.' };
        }
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          return { ok: false, error: data?.error || 'Could not delete merchandise item.' };
        }
        if (Array.isArray(data?.merchandise)) {
          setMerchandise(data.merchandise);
        }
        return { ok: true };
      } catch {
        return { ok: false, error: 'Network error while deleting item. Please try again.' };
      }
    },
    [adminToken, handleExitAdmin]
  );

  const handleAddNotification = useCallback(
    (
      category: NotificationCategory,
      title: string,
      subtitle: string,
      details: string,
      targetTab: string,
      amount?: string
    ) => {
      void (async () => {
        try {
          const res = await fetch('/api/notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              category,
              title,
              subtitle,
              details,
              targetTab,
              amount,
            }),
          });
          if (!res.ok) return;
          const data = await res.json();
          if (data?.notification && isAdmin) {
            const saved = data.notification as AdminNotification;
            setNotifications((prev) =>
              prev.some((n) => n.id === saved.id) ? prev : [saved, ...prev]
            );
          }
        } catch {
          // Ignore submission notification transport errors
        }
      })();
    },
    [isAdmin]
  );

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAuthenticating) return;
    setIsAuthenticating(true);
    setPinError(false);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: adminPin.trim() }),
      });
      const contentType = res.headers.get('content-type') || '';
      const data = contentType.includes('application/json')
        ? await res.json().catch(() => ({}))
        : {};
      if (res.ok && typeof data?.token === 'string') {
        setAdminToken(data.token);
        setIsAdmin(true);
        setShowAdminModal(false);
        setAdminPin('');
        setPinError(false);
        setShowNotificationsModal(true);
        await fetchServerNotifications(data.token);
      } else if (res.status === 401) {
        setPinErrorMessage('Incorrect PIN.');
        setPinError(true);
      } else if (res.status === 429) {
        setPinErrorMessage('Too many login attempts. Please wait a moment.');
        setPinError(true);
      } else if (res.status === 404 || res.status === 405 || !contentType.includes('application/json')) {
        setPinErrorMessage(
          'Admin login endpoint is not available on this URL yet. Please re-share or redeploy the app.'
        );
        setPinError(true);
      } else {
        setPinErrorMessage(
          typeof data?.error === 'string' && data.error
            ? data.error
            : 'Unable to verify PIN right now. Please try again.'
        );
        setPinError(true);
      }
    } catch {
      setPinErrorMessage('Unable to verify PIN right now. Please try again.');
      setPinError(true);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const activePageStyle = siteContent.pageStyles?.[currentTab] || {};
  const activeFontCss = getFontCss(activePageStyle.fontFamily);
  const safeHex = (val?: string) => (val && /^#[0-9a-fA-F]{3,8}$/.test(val) ? val : undefined);
  const activeHeadingColor = safeHex(activePageStyle.headingColor);
  const activeTextColor = safeHex(activePageStyle.textColor);
  const activeBgColor = safeHex(activePageStyle.backgroundColor);
  const activeAccentColor = safeHex(activePageStyle.accentColor);
  const scaleClass =
    activePageStyle.textScale === 'sm'
      ? 'text-[15px]'
      : activePageStyle.textScale === 'lg'
        ? 'text-[17px]'
        : '';

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-yellow-400 selection:text-slate-950">
      {/* Admin Mode Banner */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-pink-600 to-purple-700 text-white px-4 py-2.5 text-xs font-bold text-center flex flex-col sm:flex-row items-center justify-center gap-3 shadow-md z-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-yellow-300" />
            <span>ADMIN MODE ACTIVE</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={() => setShowNotificationsModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-white text-pink-700 font-black text-xs shadow-sm hover:bg-pink-50 flex items-center gap-1.5 transition-colors"
            >
              <Bell className="w-3.5 h-3.5 text-pink-600" />
              Notifications
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-yellow-400 text-slate-950 text-[10px] font-black">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={handleExitAdmin}
              className="underline hover:text-yellow-300 font-black ml-1"
            >
              Exit Admin
            </button>
          </div>
        </div>
      )}

      {/* Sticky Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={navigateToTab}
        onOpenBooking={handleOpenBooking}
        onOpenAdminModal={() => setShowAdminModal(true)}
        siteContent={siteContent}
      />

      {/* Main Content Area */}
      <main
        id="telesports-page-main"
        className={`flex-1 ${scaleClass}`}
        style={{
          fontFamily: activeFontCss,
          backgroundColor: activeBgColor || '#ffffff',
          color: activeTextColor || undefined,
        }}
      >
        {(activeHeadingColor || activeTextColor || activeBgColor || activeAccentColor || activeFontCss) && (
          <style>{`
            ${activeFontCss ? `#telesports-page-main * { font-family: ${activeFontCss}; }` : ''}
            ${activeBgColor ? `#telesports-page-main > div, #telesports-page-main > div > section { background-color: ${activeBgColor}; }` : ''}
            ${activeHeadingColor ? `#telesports-page-main h1, #telesports-page-main h2, #telesports-page-main h3 { color: ${activeHeadingColor}; }` : ''}
            ${activeTextColor ? `#telesports-page-main p { color: ${activeTextColor}; }` : ''}
            ${activeAccentColor ? `#telesports-page-main .bg-pink-600 { background-color: ${activeAccentColor}; } #telesports-page-main .text-pink-600 { color: ${activeAccentColor}; }` : ''}
          `}</style>
        )}

        <CustomBlocksRenderer
          blocks={siteContent.pageBlocks?.[currentTab]}
          position="top"
          onNavigateTab={navigateToTab}
          isAdmin={isAdmin}
          onOpenCms={() => setShowCmsModal(true)}
        />

        {currentTab === 'home' && (
          <HomeTab
            siteContent={siteContent}
            setCurrentTab={navigateToTab}
            onOpenBooking={handleOpenBooking}
            isAdmin={isAdmin}
            onOpenCms={() => setShowCmsModal(true)}
          />
        )}
        {currentTab === 'programs' && (
          <ProgramsTab
            siteContent={siteContent}
            programs={programs}
            setPrograms={setPrograms}
            onOpenBooking={handleOpenBooking}
            isAdmin={isAdmin}
            onOpenCms={() => setShowCmsModal(true)}
          />
        )}
        {currentTab === 'partners' && (
          <PartnersTab
            siteContent={siteContent}
            partners={partners}
            setPartners={setPartners}
            isAdmin={isAdmin}
            onOpenCms={() => setShowCmsModal(true)}
          />
        )}
        {currentTab === 'coaches' && (
          <CoachesTab
            siteContent={siteContent}
            coaches={coaches}
            setCoaches={setCoaches}
            isAdmin={isAdmin}
            onOpenCms={() => setShowCmsModal(true)}
            onAddNotification={handleAddNotification}
          />
        )}
        {currentTab === 'coach-jobs' && (
          <CoachJobsTab
            siteContent={siteContent}
            applications={coachApplications}
            setApplications={setCoachApplications}
            isAdmin={isAdmin}
            onOpenCms={() => setShowCmsModal(true)}
            onAddNotification={handleAddNotification}
          />
        )}
        {currentTab === 'parent-requests' && (
          <ParentRequestsTab
            siteContent={siteContent}
            requests={parentRequests}
            setRequests={setParentRequests}
            isAdmin={isAdmin}
            onOpenCms={() => setShowCmsModal(true)}
            onAddNotification={handleAddNotification}
          />
        )}
        {currentTab === 'merchandise' && (
          <MerchandiseTab
            siteContent={siteContent}
            merchandise={merchandise}
            onCreateMerchandise={handleCreateMerchandise}
            onUpdateMerchandise={handleUpdateMerchandise}
            onDeleteMerchandise={handleDeleteMerchandise}
            isAdmin={isAdmin}
            onOpenCms={() => setShowCmsModal(true)}
            onAddNotification={handleAddNotification}
          />
        )}
        {currentTab === 'announcements' && (
          <AnnouncementsTab
            siteContent={siteContent}
            announcements={announcements}
            setAnnouncements={setAnnouncements}
            isAdmin={isAdmin}
            onOpenCms={() => setShowCmsModal(true)}
          />
        )}
        {currentTab === 'aicoach' && (
          <AiCoachTab
            siteContent={siteContent}
            partners={partners}
            isAdmin={isAdmin}
            onOpenCms={() => setShowCmsModal(true)}
          />
        )}
        {currentTab === 'news' && (
          <NewsTab
            siteContent={siteContent}
            news={news}
            setNews={setNews}
            isAdmin={isAdmin}
            onOpenCms={() => setShowCmsModal(true)}
          />
        )}
        {currentTab === 'contact' && (
          <ContactTab
            siteContent={siteContent}
            isAdmin={isAdmin}
            onOpenCms={() => setShowCmsModal(true)}
            onAddNotification={handleAddNotification}
          />
        )}

        <CustomBlocksRenderer
          blocks={siteContent.pageBlocks?.[currentTab]}
          position="bottom"
          onNavigateTab={navigateToTab}
          isAdmin={isAdmin}
          onOpenCms={() => setShowCmsModal(true)}
        />
      </main>

      {/* Professional Footer */}
      <Footer
        siteContent={siteContent}
        setCurrentTab={navigateToTab}
      />

      {/* Admin Content Manager Modal */}
      <AdminCmsModal
        isOpen={showCmsModal}
        onClose={() => setShowCmsModal(false)}
        activeTab={currentTab}
        content={siteContent}
        onSaveContent={(newContent) => setSiteContent(newContent)}
      />

      {/* Admin Categorized Notifications Modal */}
      {isAdmin && (
        <AdminNotificationsModal
          isOpen={showNotificationsModal}
          onClose={() => setShowNotificationsModal(false)}
          notifications={notifications}
          onMarkRead={(id) => {
            setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
            if (adminToken) {
              void fetch(`/api/notifications/${encodeURIComponent(id)}/read`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${adminToken}` },
              })
                .then((res) => {
                  if (res.status === 401) handleExitAdmin();
                })
                .catch(() => {});
            }
          }}
          onMarkAllRead={() => {
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            if (adminToken) {
              void fetch('/api/notifications/mark-all-read', {
                method: 'POST',
                headers: { Authorization: `Bearer ${adminToken}` },
              })
                .then((res) => {
                  if (res.status === 401) handleExitAdmin();
                })
                .catch(() => {});
            }
          }}
          onDeleteNotification={(id) => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
            if (adminToken) {
              void fetch(`/api/notifications/${encodeURIComponent(id)}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${adminToken}` },
              })
                .then((res) => {
                  if (res.status === 401) handleExitAdmin();
                })
                .catch(() => {});
            }
          }}
          onNavigateTab={navigateToTab}
        />
      )}

      {/* Admin Login Modal — Strictly PIN box & Authenticate Admin only */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-white border border-pink-200 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 uppercase flex items-center gap-2">
                <Lock className="w-5 h-5 text-pink-600" />
                Administrator Login
              </h2>
              <button
                onClick={() => {
                  setShowAdminModal(false);
                  setPinError(false);
                  setAdminPin('');
                }}
                className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isAdmin ? (
              <div className="py-4 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <button
                  onClick={handleExitAdmin}
                  className="w-full py-3 rounded-xl bg-slate-100 text-slate-800 font-bold text-sm hover:bg-slate-200"
                >
                  Log Out / Exit Admin Mode
                </button>
              </div>
            ) : (
              <form onSubmit={handleAdminLogin} className="space-y-5">
                <div>
                  <input
                    type="password"
                    required
                    autoFocus
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    placeholder="Enter PIN"
                    value={adminPin}
                    onChange={(e) => {
                      setAdminPin(e.target.value);
                      setPinError(false);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-pink-600 shadow-xs"
                  />
                  {pinError && (
                    <p className="text-xs text-red-600 font-semibold mt-1.5">{pinErrorMessage}</p>
                  )}
                </div>

                <div className="flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdminModal(false);
                      setPinError(false);
                      setAdminPin('');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isAuthenticating}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 text-white font-black text-sm shadow-lg hover:from-pink-500 hover:to-purple-600 disabled:opacity-60"
                  >
                    {isAuthenticating ? 'Verifying...' : 'Authenticate Admin'}
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

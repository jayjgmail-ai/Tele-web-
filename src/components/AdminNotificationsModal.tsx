import { useState } from 'react';
import { AdminNotification, NotificationCategory } from '../types';
import {
  Bell,
  X,
  ShoppingBag,
  Users,
  Briefcase,
  Check,
  CheckCheck,
  Trash2,
  ArrowRight,
} from 'lucide-react';

interface AdminNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AdminNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDeleteNotification: (id: string) => void;
  onNavigateTab: (tab: string) => void;
}

const categoryMeta: Record<
  NotificationCategory,
  { label: string; shortLabel: string; icon: typeof ShoppingBag; badgeClass: string; borderClass: string }
> = {
  purchases: {
    label: 'Merchandise Purchases',
    shortLabel: 'Purchases',
    icon: ShoppingBag,
    badgeClass: 'bg-yellow-400 text-slate-950',
    borderClass: 'border-yellow-300',
  },
  requests: {
    label: 'Parent, Trial & Session Requests',
    shortLabel: 'Requests',
    icon: Users,
    badgeClass: 'bg-pink-600 text-white',
    borderClass: 'border-pink-200',
  },
  applications: {
    label: 'Coach Job Applications',
    shortLabel: 'Applications',
    icon: Briefcase,
    badgeClass: 'bg-purple-700 text-white',
    borderClass: 'border-purple-200',
  },
};

export default function AdminNotificationsModal({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onDeleteNotification,
  onNavigateTab,
}: AdminNotificationsModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | NotificationCategory>('all');

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;
  const counts: Record<NotificationCategory, number> = {
    purchases: notifications.filter((n) => n.category === 'purchases').length,
    requests: notifications.filter((n) => n.category === 'requests').length,
    applications: notifications.filter((n) => n.category === 'applications').length,
  };

  const categoriesToRender: NotificationCategory[] =
    selectedCategory === 'all' ? ['purchases', 'requests', 'applications'] : [selectedCategory];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-white border border-pink-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-pink-100 bg-gradient-to-r from-pink-600 to-purple-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Bell className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black uppercase">Admin Notifications</h2>
              <p className="text-xs text-white/85 font-medium">
                {unreadCount} unread across Merchandise Purchases, Requests &amp; Applications
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="px-3 py-1.5 rounded-lg bg-yellow-400 text-slate-950 font-black text-xs hover:bg-yellow-300 flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark All Read
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-6 py-3 bg-pink-50/70 border-b border-pink-100 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-pink-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-pink-100 border border-pink-200'
            }`}
          >
            All Categories ({notifications.length})
          </button>

          {(['purchases', 'requests', 'applications'] as NotificationCategory[]).map((cat) => {
            const meta = categoryMeta[cat];
            const IconComp = meta.icon;
            const catUnread = notifications.filter((n) => n.category === cat && !n.read).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? 'bg-pink-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-pink-100 border border-pink-200'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                {meta.shortLabel} ({counts[cat]})
                {catUnread > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-yellow-400 text-slate-950 text-[10px] font-black">
                    {catUnread}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Categorized Notification Sections */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          {categoriesToRender.map((cat) => {
            const meta = categoryMeta[cat];
            const IconComp = meta.icon;
            const items = notifications.filter((n) => n.category === cat);

            return (
              <section key={cat} className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase flex items-center gap-1.5 ${meta.badgeClass}`}>
                      <IconComp className="w-3.5 h-3.5" />
                      {meta.label}
                    </span>
                    <span className="text-xs font-bold text-slate-500">({items.length})</span>
                  </div>
                </div>

                {items.length === 0 ? (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                    No {meta.label.toLowerCase()} notifications yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          item.read
                            ? 'bg-white border-slate-200'
                            : 'bg-pink-50/50 border-pink-300 shadow-sm'
                        }`}
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            {!item.read && (
                              <span className="px-2 py-0.5 rounded-md bg-yellow-400 text-slate-950 text-[10px] font-black uppercase">
                                New
                              </span>
                            )}
                            <h4 className="text-sm font-black text-slate-900">{item.title}</h4>
                            {item.amount && (
                              <span className="px-2 py-0.5 rounded-md bg-pink-600 text-white text-xs font-black tabular-nums">
                                {item.amount}
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-semibold text-pink-700">{item.subtitle}</div>
                          <p className="text-xs text-slate-600">{item.details}</p>
                          <div className="text-[11px] text-slate-400 font-medium pt-0.5">{item.timestamp}</div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              onMarkRead(item.id);
                              onNavigateTab(item.targetTab);
                              onClose();
                            }}
                            className="px-3 py-1.5 rounded-lg bg-pink-50 hover:bg-pink-600 hover:text-white text-pink-900 border border-pink-200 font-bold text-xs flex items-center gap-1 transition-colors"
                          >
                            View
                            <ArrowRight className="w-3 h-3" />
                          </button>
                          {!item.read && (
                            <button
                              onClick={() => onMarkRead(item.id)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                              title="Mark as read"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => onDeleteNotification(item.id)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-600 border border-red-200"
                            title="Delete notification"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
}

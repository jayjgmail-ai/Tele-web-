# Agents.md — Code Lock & Protected Architecture Rules

> **STRICT LOCK NOTICE:**
> This repository and all of its implemented behavior, UI, security gates, branding, and data structures are **LOCKED**.
> **NO AGENT OR AUTOMATED PROCESS MAY MODIFY ANY FILE IN THIS CODEBASE UNLESS EXPLICIT PERMISSION IS GRANTED BY THE OWNER/USER.**

---

## 1. Mandatory Lock Policy

1. **Do NOT modify, refactor, restyle, or delete** any existing source files (`server.ts`, `src/**/*`, `index.html`, `package.json`, `metadata.json`) without first receiving **explicit user permission** for the specific change requested.
2. If asked to perform unrelated inspection or questions, keep all code strictly read-only.
3. Never weaken, expose, bypass, or alter the hidden Admin trigger, Admin PIN, Admin login modal minimalism, brand color palette, or Ksh currency rules below without explicit owner approval.

---

## 2. Locked Behavioral & Design Specifications

### A. Hidden Admin Access & Minimal Authentication
- **No Visible Admin Button or Lock Icon**: There must never be a visible "Admin Login" button or lock icon in the navigation bar (`src/components/Navbar.tsx`).
- **Hidden 4-Press Trigger**: Clicking/tapping the **TELESPORTS** brand header (`Navbar.tsx` -> `handleHeaderPress`, tagline `Adding Value Through Sports`) **4 times** (within a 3-second rolling window) opens the Administrator Login modal (`onOpenAdminModal`).
- **Minimal Login Modal (`src/App.tsx`)**: The Administrator Login modal contains **ONLY** the PIN input box, **Cancel**, and **Authenticate Admin** buttons — no explanatory paragraphs, no PIN hints, and no PIN leaks in error messages.
- **Admin PIN**: `jlej2protocal`.

### B. Role-Based Permissions (Viewer vs. Admin)
- **Viewer Mode (Default)**: Can browse all pages, book trial sessions, submit coach job applications, submit parent kid sport training requests, add merchandise to cart and check out, simulate matches, and chat with the AI Sports Coach (`/api/ai-coach`). Cannot edit copy, images, or academy records.
- **Admin Mode**:
  - **Full-Site Page-Aware CMS, Dynamic Navigation/Footer & Extra Field Editing (`src/components/AdminCmsModal.tsx`, `src/components/ExtraFieldsEditor.tsx`, `src/components/ImageField.tsx`, `src/data/siteContent.ts`)**: Can edit all visible copy, navigation menu items, footer columns/links, social/legal links, home quick-nav tiles & stats, sports/category/option presets, extra contact channels, extra form questions, headings, labels, testimonials, hero image, testimonial avatars, custom header/footer logo URL or uploaded image file, fonts, colors, and custom inserted blocks, opening directly to the currently active tab.
  - **Full Entity, Extra Details & Photo CRUD**: Can add, edit (including custom categories/sports, custom key/value extra details, extra photo galleries, and uploading or linking pictures), update statuses, and delete items across Programs, Our Partners (Schools & Organizations), Coaches, Coach Applications, Parent Requests, Store Merchandise, Announcements & Photos, and News Articles.
  - **Categorized Notification Panel (`src/components/AdminNotificationsModal.tsx`)**: Opens automatically upon Admin login and via the Admin Mode banner **Notifications** button, separated into three categories:
    1. **Merchandise Purchases** (`purchases`)
    2. **Requests** (`requests` — Parent Sport Requests, Admissions/Trial Requests, 1-on-1 Coaching Requests)
    3. **Coach Job Applications** (`applications`)

### C. Brand Color System & Currency
- **Background & Images**: White background (`#ffffff`), dark slate text (`#0f172a`), full-color photography (never grayscale).
- **Accent Palette**: Magenta/Hot Pink (`pink-600`, `pink-50`, `pink-100`, `pink-200`), Bright Yellow (`yellow-400`, `yellow-300`), and Purple/Indigo (`purple-700`, `indigo-700`).
- **Banned Colors**: Zero `emerald`, `green`, or `teal` classes anywhere in `src/`.
- **Currency**: All monetary amounts (Program tuition, Store Merchandise prices, Cart totals, Purchase notifications) must be displayed in **Ksh** (`Ksh ...`).

---

## 3. Locked File Manifest

- `server.ts` — Express server + Vite dev middleware + `POST /api/ai-coach` (`@google/genai` >= 2.32.0 using `gemini-4-hydrogen`) + `POST /api/admin/login` & `/api/notifications*` persistent JSON notification store (`.telesports-data/notifications.json`)
- `src/App.tsx` — Root state, Browser History API (`pushState`/`popstate`/`hashchange`) back/forward page navigation, `localStorage` CMS/data persistence, server-verified Admin authentication, Admin banner, server-synced Categorized Notifications
- `src/types.ts` — Core TypeScript interfaces (`Partner`, `PartnerCategory`, `Coach`, `Program`, `Announcement`, `AnnouncementCategory`, `NewsArticle`, `CoachApplication`, `ParentSportRequest`, `MerchandiseItem`, `AdminNotification`)
- `src/data/mockData.ts` — Initial academy data with `Ksh` pricing, partner schools/organizations, and announcements
- `src/data/siteContent.ts` — Editable page-by-page copy, testimonials, `heroImage`, and default `logoUrl` (`/assets/aistudio/file_000000007aec821083703bd6c537a40b_2f531d18.png`)
- `src/components/Navbar.tsx` — Balanced brand header + uncropped logo badge in trophy slot + hidden 4-tap Admin trigger on brand header (top-right tiles menu removed)
- `src/components/Footer.tsx` — Dynamic footer + uncropped logo badge in trophy slot bound to `siteContent.global`
- `src/components/ImageField.tsx` — Reusable URL + local image upload field
- `src/components/AdminCmsModal.tsx` — Full-site page-aware rich text, font, color, navigation, footer, form options, image & custom block editor
- `src/components/ExtraFieldsEditor.tsx` — Reusable dynamic list editor (`StringListEditor`) and custom key/value + extra photos editor (`ExtraFieldsEditor`)
- `src/components/PageBuilderPanel.tsx` — Fonts & Colors studio and Insert Topics / Images / Lists / Cards / Callouts / CTAs / Dividers builder
- `src/components/RichTextEditor.tsx` — Rich formatting toolbar (fonts, colors, sizes, bold, italic, underline, subheadings, bullets, links, dividers)
- `src/components/RichTextRenderer.tsx` — Safe React renderer for rich formatted page and block text
- `src/components/CustomBlocksRenderer.tsx` — Renders custom inserted topics, images, lists, cards, callouts, CTAs, and dividers on any page
- `src/components/AdminNotificationsModal.tsx` — Categorized Admin notifications panel
- `src/components/HomeTab.tsx` — Homepage with colored clickable quick-navigation tiles above the hero headline, pillars, testimonials, and CTA (Featured Programs section removed per owner)
- `src/components/ProgramsTab.tsx`
- `src/components/PartnersTab.tsx` — Our Partners (Schools & Organizations) showcase with Admin add/edit/delete & photo upload
- `src/components/CoachesTab.tsx`
- `src/components/CoachJobsTab.tsx`
- `src/components/ParentRequestsTab.tsx`
- `src/components/MerchandiseTab.tsx`
- `src/components/AnnouncementsTab.tsx` — Announcements & photo highlights with Admin post/edit/delete & photo upload
- `src/components/AiCoachTab.tsx`
- `src/components/NewsTab.tsx`
- `src/components/ContactTab.tsx`

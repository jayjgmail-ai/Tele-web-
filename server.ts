import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '.telesports-data');
const NOTIFS_FILE = path.resolve(DATA_DIR, 'notifications.json');
const MERCH_FILE = path.resolve(DATA_DIR, 'merchandise.json');

type NotificationCategory = 'purchases' | 'requests' | 'applications';

interface ServerNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  subtitle: string;
  details: string;
  timestamp: string;
  read: boolean;
  targetTab: string;
  amount?: string;
}

interface ServerMerchandiseItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  sizes?: string[];
  inStock: boolean;
  extraDetails?: { label: string; value: string }[];
  extraPhotos?: string[];
}

const ALLOWED_CATEGORIES = new Set<NotificationCategory>(['purchases', 'requests', 'applications']);
const ALLOWED_TARGET_TABS = new Set([
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
const SAFE_ID_REGEX = /^[a-zA-Z0-9_-]{1,80}$/;
const MAX_NOTIFICATIONS = 500;

const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const DEFAULT_PIN_SALT = '919b38b0c754d51e026ad7e98a16f141';
const DEFAULT_PIN_HASH =
  '15180230f3a7439279204c83d3c9fb98004ea68a154388bbc9ec2093c105ef817a6b0be96073d3b4584bec5713ca4122c540f4a00d6ace39832cd7fb6d46c8bb';

const MAX_MERCHANDISE = 200;

const DEFAULT_MERCHANDISE: ServerMerchandiseItem[] = [
  {
    id: 'merch-1',
    name: 'Telesports Elite Pro Home Kit 2026',
    category: 'Apparel',
    price: 4500,
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=500',
    description:
      'Official moisture-wicking home jersey featuring the Telesports Academy crest and vibrant brand accents.',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: 'merch-2',
    name: 'Telesports Academy Champion Hoodie',
    category: 'Apparel',
    price: 3800,
    image:
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=500',
    description: 'Heavyweight fleece hoodie designed for pre-match warmups and travel days.',
    sizes: ['M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: 'merch-3',
    name: 'Pro Match Football (FIFA Quality)',
    category: 'Equipment',
    price: 6500,
    image:
      'https://images.unsplash.com/photo-1614632537455-c9381e8e7162?auto=format&fit=crop&q=80&w=500',
    description:
      'Official match ball with thermal-bonded seamless surface for precise flight trajectory.',
    inStock: true,
  },
  {
    id: 'merch-4',
    name: 'Titanium Hydro Training Water Bottle',
    category: 'Accessories',
    price: 1800,
    image:
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=500',
    description:
      'Double-wall vacuum insulated stainless steel bottle keeping drinks ice-cold for 24 hours.',
    inStock: true,
  },
];

function ensureSafeDataPath(target: string): boolean {
  return target.startsWith(DATA_DIR + path.sep);
}

function loadNotificationsFromDisk(): ServerNotification[] {
  try {
    if (!ensureSafeDataPath(NOTIFS_FILE) || !fs.existsSync(NOTIFS_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(NOTIFS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadMerchandiseFromDisk(): ServerMerchandiseItem[] {
  try {
    if (!ensureSafeDataPath(MERCH_FILE) || !fs.existsSync(MERCH_FILE)) {
      return [...DEFAULT_MERCHANDISE];
    }
    const raw = fs.readFileSync(MERCH_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...DEFAULT_MERCHANDISE];
  } catch {
    return [...DEFAULT_MERCHANDISE];
  }
}

let notificationsStore: ServerNotification[] = loadNotificationsFromDisk();
let merchandiseStore: ServerMerchandiseItem[] = loadMerchandiseFromDisk();

function persistNotificationsToDisk() {
  try {
    if (!ensureSafeDataPath(NOTIFS_FILE)) return;
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const tmpFile = path.resolve(DATA_DIR, `notifications.tmp.${process.pid}.json`);
    if (!ensureSafeDataPath(tmpFile)) return;
    fs.writeFileSync(tmpFile, JSON.stringify(notificationsStore, null, 2), 'utf8');
    fs.renameSync(tmpFile, NOTIFS_FILE);
  } catch (err) {
    console.error('Failed to persist notifications:', err);
  }
}

function persistMerchandiseToDisk() {
  try {
    if (!ensureSafeDataPath(MERCH_FILE)) return;
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const tmpFile = path.resolve(DATA_DIR, `merchandise.tmp.${process.pid}.json`);
    if (!ensureSafeDataPath(tmpFile)) return;
    fs.writeFileSync(tmpFile, JSON.stringify(merchandiseStore, null, 2), 'utf8');
    fs.renameSync(tmpFile, MERCH_FILE);
  } catch (err) {
    console.error('Failed to persist merchandise:', err);
  }
}

function verifyAdminPin(pin: string): boolean {
  if (typeof pin !== 'string' || !pin) return false;
  const envPin = process.env.ADMIN_PIN?.trim();
  if (envPin) {
    const a = crypto.createHash('sha256').update(pin).digest();
    const b = crypto.createHash('sha256').update(envPin).digest();
    return crypto.timingSafeEqual(a, b);
  }
  const derived = crypto.scryptSync(pin, DEFAULT_PIN_SALT, 64);
  const expected = Buffer.from(DEFAULT_PIN_HASH, 'hex');
  return derived.length === expected.length && crypto.timingSafeEqual(derived, expected);
}

function issueAdminToken(): string {
  const payload = Buffer.from(
    JSON.stringify({ role: 'admin', exp: Date.now() + 24 * 60 * 60 * 1000 }),
    'utf8'
  ).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function verifyAdminToken(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const [payload, sig] = parts;
    const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
    const sigBuf = Buffer.from(sig, 'utf8');
    const expectedBuf = Buffer.from(expectedSig, 'utf8');
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return false;
    }
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return decoded?.role === 'admin' && typeof decoded?.exp === 'number' && decoded.exp > Date.now();
  } catch {
    return false;
  }
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!token || !verifyAdminToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

function createRateLimiter(maxRequests: number, windowMs: number) {
  const hits = new Map<string, number[]>();
  return (req: Request, res: Response, next: NextFunction) => {
    const forwarded = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim();
    const ip = forwarded || req.ip || 'unknown';
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter((ts) => now - ts < windowMs);
    if (recent.length >= maxRequests) {
      return res.status(429).json({ error: 'Too many requests. Please try again shortly.' });
    }
    recent.push(now);
    hits.set(ip, recent);
    if (hits.size > 1000) {
      for (const [k, list] of hits.entries()) {
        if (list.every((ts) => now - ts >= windowMs)) hits.delete(k);
      }
    }
    next();
  };
}

function cleanText(val: unknown, maxLen: number): string {
  if (typeof val !== 'string') return '';
  return val.replace(/[\r\n]+/g, ' ').trim().slice(0, maxLen);
}

function cleanMultilineText(val: unknown, maxLen: number): string {
  if (typeof val !== 'string') return '';
  return val.replace(/\r\n/g, '\n').trim().slice(0, maxLen);
}

function cleanImageSource(val: unknown): string {
  if (typeof val !== 'string') return '';
  const trimmed = val.trim();
  if (!trimmed || trimmed.length > 2_000_000) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed;
  if (/^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+$/i.test(trimmed)) {
    return trimmed;
  }
  return '';
}

function parseMerchandisePayload(
  body: Record<string, unknown>,
  id: string
): { item?: ServerMerchandiseItem; error?: string } {
  const name = cleanText(body.name, 200);
  const category = cleanText(body.category, 80) || 'Apparel';
  const price = Number(body.price);
  const image = cleanImageSource(body.image);
  const description = cleanMultilineText(body.description, 8000);
  const inStock = Boolean(body.inStock);

  if (!name) return { error: 'Item title is required.' };
  if (!Number.isFinite(price) || price < 0 || price > 100_000_000) {
    return { error: 'Please enter a valid price in Ksh.' };
  }
  if (!image) {
    return {
      error:
        'Please provide a valid image URL (http/https) or upload a PNG/JPEG/WEBP/GIF photo under 2 MB.',
    };
  }
  if (!description) return { error: 'Item description is required.' };

  const sizes = Array.isArray(body.sizes)
    ? body.sizes
        .map((s) => cleanText(s, 40))
        .filter(Boolean)
        .slice(0, 30)
    : undefined;

  const extraDetails = Array.isArray(body.extraDetails)
    ? body.extraDetails
        .map((d) => {
          const rec = d as Record<string, unknown>;
          return {
            label: cleanText(rec?.label, 80),
            value: cleanText(rec?.value, 300),
          };
        })
        .filter((d) => d.label && d.value)
        .slice(0, 30)
    : [];

  const extraPhotos = Array.isArray(body.extraPhotos)
    ? body.extraPhotos.map(cleanImageSource).filter(Boolean).slice(0, 10)
    : [];

  return {
    item: {
      id,
      name,
      category,
      price: Math.round(price),
      image,
      description,
      ...(sizes && sizes.length > 0 ? { sizes } : {}),
      inStock,
      extraDetails,
      extraPhotos,
    },
  };
}

async function startServer() {
  const app = express();
  app.use('/api/merchandise', express.json({ limit: '4mb' }));
  app.use(express.json({ limit: '64kb' }));

  // Prevent Vite dev middleware from serving server-side runtime storage
  app.use('/.telesports-data', (_req, res) => {
    res.status(404).end();
  });

  const loginLimiter = createRateLimiter(20, 15 * 60 * 1000);
  const submitLimiter = createRateLimiter(40, 5 * 60 * 1000);

  // Admin authentication endpoint
  app.post('/api/admin/login', loginLimiter, (req, res) => {
    const pin = typeof req.body?.pin === 'string' ? req.body.pin : '';
    if (!verifyAdminPin(pin)) {
      return res.status(401).json({ error: 'Incorrect PIN.' });
    }
    return res.json({ token: issueAdminToken() });
  });

  // Public submission endpoint: records real visitor requests/orders/applications
  app.post('/api/notifications', submitLimiter, (req, res) => {
    const body = req.body ?? {};
    const category = body.category as NotificationCategory;
    const title = cleanText(body.title, 200);
    const subtitle = cleanText(body.subtitle, 300);
    const details = cleanText(body.details, 2000);
    const rawTarget = cleanText(body.targetTab, 40);
    const targetTab = ALLOWED_TARGET_TABS.has(rawTarget) ? rawTarget : 'home';
    const amount = cleanText(body.amount, 60);

    if (!ALLOWED_CATEGORIES.has(category) || !title || !subtitle) {
      return res.status(400).json({ error: 'Invalid notification payload.' });
    }

    const notification: ServerNotification = {
      id: `notif-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      category,
      title,
      subtitle,
      details,
      timestamp: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      read: false,
      targetTab,
      ...(amount ? { amount } : {}),
    };

    notificationsStore = [notification, ...notificationsStore].slice(0, MAX_NOTIFICATIONS);
    persistNotificationsToDisk();

    return res.status(201).json({ notification });
  });

  // Admin-only notification retrieval & management
  app.get('/api/notifications', requireAdmin, (_req, res) => {
    res.json({ notifications: notificationsStore });
  });

  app.post('/api/notifications/mark-all-read', requireAdmin, (_req, res) => {
    notificationsStore = notificationsStore.map((n) => ({ ...n, read: true }));
    persistNotificationsToDisk();
    res.json({ ok: true });
  });

  app.patch('/api/notifications/:id/read', requireAdmin, (req, res) => {
    const id = req.params.id;
    if (!SAFE_ID_REGEX.test(id)) {
      return res.status(400).json({ error: 'Invalid notification ID.' });
    }
    notificationsStore = notificationsStore.map((n) => (n.id === id ? { ...n, read: true } : n));
    persistNotificationsToDisk();
    res.json({ ok: true });
  });

  app.delete('/api/notifications/:id', requireAdmin, (req, res) => {
    const id = req.params.id;
    if (!SAFE_ID_REGEX.test(id)) {
      return res.status(400).json({ error: 'Invalid notification ID.' });
    }
    notificationsStore = notificationsStore.filter((n) => n.id !== id);
    persistNotificationsToDisk();
    res.json({ ok: true });
  });

  // Public merchandise catalog read
  app.get('/api/merchandise', (_req, res) => {
    res.json({ merchandise: merchandiseStore });
  });

  // Admin-only merchandise creation, editing & deletion
  app.post('/api/merchandise', requireAdmin, (req, res) => {
    if (merchandiseStore.length >= MAX_MERCHANDISE) {
      return res.status(400).json({ error: 'Maximum merchandise catalog limit reached.' });
    }
    const id = `merch-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    const { item, error } = parseMerchandisePayload((req.body ?? {}) as Record<string, unknown>, id);
    if (error || !item) {
      return res.status(400).json({ error: error || 'Invalid merchandise payload.' });
    }
    merchandiseStore = [item, ...merchandiseStore];
    persistMerchandiseToDisk();
    return res.status(201).json({ item, merchandise: merchandiseStore });
  });

  app.put('/api/merchandise/:id', requireAdmin, (req, res) => {
    const id = req.params.id;
    if (!SAFE_ID_REGEX.test(id)) {
      return res.status(400).json({ error: 'Invalid merchandise ID.' });
    }
    const exists = merchandiseStore.some((m) => m.id === id);
    if (!exists) {
      return res.status(404).json({ error: 'Merchandise item not found.' });
    }
    const { item, error } = parseMerchandisePayload((req.body ?? {}) as Record<string, unknown>, id);
    if (error || !item) {
      return res.status(400).json({ error: error || 'Invalid merchandise payload.' });
    }
    merchandiseStore = merchandiseStore.map((m) => (m.id === id ? item : m));
    persistMerchandiseToDisk();
    return res.json({ item, merchandise: merchandiseStore });
  });

  app.delete('/api/merchandise/:id', requireAdmin, (req, res) => {
    const id = req.params.id;
    if (!SAFE_ID_REGEX.test(id)) {
      return res.status(400).json({ error: 'Invalid merchandise ID.' });
    }
    merchandiseStore = merchandiseStore.filter((m) => m.id !== id);
    persistMerchandiseToDisk();
    return res.json({ ok: true, merchandise: merchandiseStore });
  });

  // Initialize Gemini API client if API key is present
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  // API endpoint for AI Sports Coach & Scouting Analysis
  app.post('/api/ai-coach', async (req, res) => {
    try {
      const { prompt, athleteData, partnerData } = req.body ?? {};

      if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
        return res.status(400).json({ error: 'A valid prompt is required.' });
      }

      if (!ai) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY is not configured. Please check your API key in Settings > Secrets.',
        });
      }

      const systemInstruction =
        'You are the Head AI Coach & Director of Sports Science at Telesports Academy, a world-class elite sports management and training institution. You provide professional, tactical, encouraging, and scientifically sound training plans, scouting reports, nutrition guidance, and match analysis.';

      let fullPrompt = prompt.trim();
      if (partnerData) {
        fullPrompt = `Partner School / Organization: ${JSON.stringify(partnerData)}\n\nQuery/Task: ${fullPrompt}`;
      } else if (athleteData) {
        fullPrompt = `Athlete Profile: ${JSON.stringify(athleteData)}\n\nQuery/Task: ${fullPrompt}`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: fullPrompt,
        config: {
          systemInstruction,
        },
      });

      res.json({ response: response.text || 'No response generated.' });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      const status = typeof error?.status === 'number' ? error.status : 500;
      res.status(status).json({ error: error?.message || 'Failed to generate AI response' });
    }
  });

  // Vite middleware for frontend development
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Telesports Academy server running on http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});

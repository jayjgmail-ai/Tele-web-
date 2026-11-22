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

let notificationsStore: ServerNotification[] = loadNotificationsFromDisk();

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

async function startServer() {
  const app = express();
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

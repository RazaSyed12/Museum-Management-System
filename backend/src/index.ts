import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { anonClient } from './lib/supabaseClients';
import authRouter from './routes/auth';
import sessionRouter from './routes/session';
import collectionsRouter from './routes/collections';
import categoriesRouter from './routes/categories';
import meRouter from './routes/me';
import eventsRouter from './routes/events';
import locationsRouter from './routes/locations';
import recommendationsRouter from './routes/recommendations';
import collectionItemsRouter from './routes/collectionItems';
import mediaRouter from './routes/media';
import membershipRouter from './routes/membership';
import allocationsRouter from './routes/allocations';
import bookingsRouter from './routes/bookings';
import interactionsRouter from './routes/interactions';
import adminRouter from './routes/admin';
import accountRouter from './routes/account';
import newsletterRouter from './routes/newsletter';
import searchRouter from './routes/search';
import paymentsRouter from './routes/payments';
import staffRouter from './routes/staff';

const app = express();

// Only these origins may call the API from a browser. Set ALLOWED_ORIGINS
// in .env as a comma-separated list for prod (e.g. the deployed frontend
// URL); falls back to the local Next.js dev server when unset.
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    // No Origin header (curl, server-to-server, same-origin) is allowed.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS: origin ${origin} is not allowed`));
  }
}));
app.use(express.json());

app.use('/auth', authRouter);
app.use('/auth', sessionRouter);
app.use('/collections', collectionsRouter);
app.use('/categories', categoriesRouter);
app.use('/locations', locationsRouter);
app.use('/me', meRouter);
app.use('/events', eventsRouter);
app.use('/recommendations', recommendationsRouter);
app.use(collectionItemsRouter);
app.use(mediaRouter);
app.use(membershipRouter);
app.use(allocationsRouter);
app.use(bookingsRouter);
app.use(interactionsRouter);
app.use(adminRouter);
app.use(accountRouter);
app.use(newsletterRouter);
app.use(searchRouter);
app.use(paymentsRouter);
app.use(staffRouter);
// A simple route that proves the server AND the database connection
// both actually work — not just that the server started. Uses
// anonClient() rather than the secret key, so this also proves RLS
// lets a public caller read public data, which is what a real
// visitor's request depends on. A secret-key version would report
// "ok" even if every RLS policy on `categories` were broken.
app.get('/health', async (req: Request, res: Response) => {
  const { data, error } = await anonClient()
    .from('categories')
    .select('category_id, name')
    .limit(5);

  if (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Server is running, but the database query failed.',
      details: error.message
    });
  }

  res.json({
    status: 'ok',
    message: 'Server is running and successfully queried the database.',
    sample_categories: data
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running at http://127.0.0.1:${PORT}`);
});
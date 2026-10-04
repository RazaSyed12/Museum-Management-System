import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { anonClient } from './lib/supabaseClients';
import authRouter from './routes/auth';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);

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
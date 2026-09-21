require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to Supabase using the secret key — this runs server-side
// only, so it's safe to use the powerful key here (never in frontend code).
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

// A simple route that proves the server AND the database connection
// both actually work — not just that the server started.
app.get('/health', async (req, res) => {
  const { data, error } = await supabase
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
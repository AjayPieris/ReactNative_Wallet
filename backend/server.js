import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { sql } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';
import transactionsRoute from './routes/transactionsRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// =============================
// MIDDLEWARE
// =============================
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

// =============================
// DATABASE INIT
// =============================
async function initDB() {
  try {
    console.log("🔄 Attempting to connect to Neon database...");

    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log('✅ Connected to the database successfully & table ensured.');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

// =============================
// ROUTES
// =============================
app.use('/api/transactions', transactionsRoute);

// =============================
// START SERVER
// =============================
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Failed to initialize database:', err);
});

import express from 'express';
import dotenv from 'dotenv';
import { sql } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(express.json());

// =============================
// DATABASE INIT
// =============================
async function initDB() {
  try {
    console.log("🔄 Attempting to connect to Neon database...");

    await sql`
      create table if not exists transactions (
        id serial primary key,
        user_id varchar(255) not null,
        title varchar(255) not null,
        amount decimal(10,2) not null,
        category varchar(255) not null,
        created_at DATE not null default current_date
      );
    `;

    console.log('✅ Connected to the database successfully & table ensured.');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

// =============================
// DEFAULT ROUTE
// =============================
app.get('/', (req, res) => {
  console.log("⬅️ GET / Request received");
  res.send('Hello from the backend server!');
});

// =============================
// CREATE TRANSACTION
// =============================
app.post("/api/transactions", async (req, res) => {
  console.log("⬅️ POST /api/transactions", req.body);

  try {
    const { user_id, title, amount, category } = req.body;

    if (!user_id || !title || !amount || !category) {
      console.log("⚠️ Missing fields:", req.body);
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const transaction = await sql`
      insert into transactions (user_id, title, amount, category)
      values (${user_id}, ${title}, ${amount}, ${category})
      returning *;
    `;

    console.log("✅ Transaction created:", transaction[0]);
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.error("❌ Error creating transaction:", error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// =============================
// GET TRANSACTIONS BY USER ID
// =============================
app.get("/api/transactions/:userId", async (req, res) => {
  console.log("⬅️ GET /api/transactions/", req.params.userId);

  try {
    const { userId } = req.params;

    const transactions = await sql`
      select * from transactions where user_id = ${userId} order by created_at desc;
    `;

    console.log(`📦 ${transactions.length} transactions found for user: ${userId}`);
    res.status(200).json(transactions);
  } catch (error) {
    console.error("❌ Error fetching transactions:", error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// =============================
// DELETE TRANSACTION
// =============================
app.delete("/api/transactions/:id", async (req, res) => {
  console.log("🗑️ DELETE /api/transactions/", req.params.id);

  try {
    const { id } = req.params;

     // Execute delete and return affected rows
    const result = await sql`
      delete from transactions where id = ${id} returning *;
    `;

    if (result.length === 0) {
      console.log(`⚠️ Transaction ID ${id} not found`);
      return res.status(404).json({ error: `Transaction ID ${id} not found` });
    }

  } catch (error) {
    console.error("❌ Error deleting transaction:", error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

// find summary of transactions for a user
app.get("/api/transactions/summary/:userId", async (req, res) => {
  console.log("⬅️ GET /api/transactions/summary/", req.params.userId);
    try {
    const { userId } = req.params;

    // coalesce() is a function that checks for null. If the sum is null, it returns 0 instead.

    
    const balanceResult = await sql`
        select
            coalesce(sum(amount), 0) as total_amount
        from
            transactions
        where
            user_id = ${userId};
    `;

    const incomeResult = await sql`
        select  
            coalesce(sum(amount), 0) as total_income
        from
            transactions
        where
            user_id = ${userId} and amount > 0;
    `;

    const expensesResult = await sql`
        select
            coalesce(sum(amount), 0) as total_expense
        from
            transactions
        where
            user_id = ${userId} and amount < 0;;
    `;

    res.status(200).json({
      balance: balanceResult[0].total_amount,
      income: incomeResult[0].total_income,
      expense: expensesResult[0].total_expense
    });
  } catch (error) {
    console.error("❌ Error fetching summary:", error);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

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

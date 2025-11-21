import { sql } from '../config/db.js';

export async function createTransaction(req, res) {
  try {
    const { user_id, title, amount, category } = req.body;

    if (!user_id || !title || !amount || !category) {
      console.log("⚠️ Missing fields:", req.body);
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const transaction = await sql`
      INSERT INTO transactions (user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING *;
    `;

    console.log("✅ Transaction created:", transaction[0]);
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.error("❌ Error creating transaction:", error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
}

export async function getTransactionsByUserId(req, res) {
  try {
    const { userId } = req.params;

    const transactions = await sql`
      SELECT * FROM transactions
      WHERE user_id = ${userId}
      ORDER BY created_at DESC;
    `;

    console.log(`📦 ${transactions.length} transactions found for user: ${userId}`);
    res.status(200).json(transactions);
  } catch (error) {
    console.error("❌ Error fetching transactions:", error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
}

export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;

    const result = await sql`
      DELETE FROM transactions WHERE id = ${id} RETURNING *;
    `;

    if (result.length === 0) {
      console.log(`⚠️ Transaction ID ${id} not found`);
      return res.status(404).json({ error: `Transaction ID ${id} not found` });
    }

    console.log(`✅ Transaction ID ${id} deleted`);
    res.status(200).json({ message: `Transaction ID ${id} deleted successfully`, transaction: result[0] });
  } catch (error) {
    console.error("❌ Error deleting transaction:", error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
}

export async function getSummaryByUserId(req, res) {
  try {
    const { userId } = req.params;

    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS total_amount
      FROM transactions
      WHERE user_id = ${userId};
    `;

    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS total_income
      FROM transactions
      WHERE user_id = ${userId} AND amount > 0;
    `;

    const expensesResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS total_expense
      FROM transactions
      WHERE user_id = ${userId} AND amount < 0;
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
}

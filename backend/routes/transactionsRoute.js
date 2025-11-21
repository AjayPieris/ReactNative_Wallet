import express from 'express';
import { createTransaction, getTransactionsByUserId, deleteTransaction, getSummaryByUserId } from '../controller/transactionsController.js';

const router = express.Router();

// Test route
router.get("/", (req, res) => {
  console.log("⬅️ GET / Request received");
  res.send('Hello from the backend server!');
});

// Create a new transaction
router.post("/", createTransaction);

// Get summary for a user (more specific route first!)
router.get("/summary/:userId", getSummaryByUserId);

// Get all transactions for a user
router.get("/:userId", getTransactionsByUserId);

// Delete a transaction by ID
router.delete("/:id", deleteTransaction);

export default router;

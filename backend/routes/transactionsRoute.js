import express from "express";
import {
  createTransaction,
  getTransactionsByUserId,
  deleteTransaction,
  getSummaryByUserId,
} from "../controller/transactionsController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Transactions API is running");
});

router.post("/", createTransaction);
router.get("/summary/:userId", getSummaryByUserId);
router.get("/:userId", getTransactionsByUserId);
router.delete("/:id", deleteTransaction);

export default router;
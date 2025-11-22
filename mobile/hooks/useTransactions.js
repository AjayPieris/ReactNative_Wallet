import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { API_URL } from "../constants/api";

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await fetch(`${API_URL}/${userId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched transactions:", JSON.stringify(data, null, 2)); // Debug log
      // Backend returns the array directly
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(err);
    }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await fetch(`${API_URL}/summary/${userId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch summary: ${response.status}`);
      }
      const data = await response.json();
      // Backend returns { balance, income, expense }
      setSummary({
        income: Number(data.income) || 0,
        expenses: Number(data.expense) || 0, // Map 'expense' to 'expenses'
        balance: Number(data.balance) || 0,
      });
    } catch (err) {
      console.error("Error fetching summary:", err);
      setError(err);
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (err) {
      console.error("Error loading data:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  const deleteTransaction = useCallback(
    async (id) => {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete transaction");
        }
        // Refresh after successful delete
        await fetchTransactions();
        await fetchSummary();
        Alert.alert("Success", "Transaction deleted successfully");
      } catch (err) {
        console.error("Error deleting transaction:", err);
        setError(err);
        Alert.alert("Error", "Failed to delete transaction");
      }
    },
    [fetchTransactions, fetchSummary]
  );

  return {
    transactions,
    summary,
    isLoading,
    error,
    loadData,
    deleteTransaction,
  };
};

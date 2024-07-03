import { createContext, useEffect, useState } from "react";
import { api } from "../lib/axios";

interface Transaction {
  id: number;
  description: string;
  type: "income" | "outcome";
  category: string;
  price: number;
  createdAt: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  fetchTransactions: (query?: string) => Promise<void>;
  createTransaction: (transaction: CreateTransactionInput) => Promise<void>;
}

export const TransactionContext = createContext({} as TransactionContextType);

interface TransactionsProviderProps {
  children: React.ReactNode;
}

interface CreateTransactionInput {
  description: string;
  price: number;
  category: string;
  type: "income" | "outcome";
}

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  async function fetchTransactions(query?: string) {
    const response = await api.get("transactions", {
      params: {
        _sort: "createdAt",
        _order: "desc",
        q: query,
      },
    });

    setTransactions(response.data);
  }

  async function createTransaction(transaction: CreateTransactionInput) {
    const { description, category, type, price } = transaction;

    const response = await api.post("transactions", {
      description,
      category,
      type,
      price,
      createdAt: new Date(),
    });

    setTransactions((prevState) => [...prevState, response.data]);
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <TransactionContext.Provider
      value={{ transactions, fetchTransactions, createTransaction }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

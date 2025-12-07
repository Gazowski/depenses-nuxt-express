// types/transaction.ts
declare global {
    
    interface Transaction {
      id: string;
      transactionId: string;
      transactionDate: Date;
      amount: number;
      description?: string;
      createdAt: Date;
      updatedAt: Date;
      category: Partial<Category>;
    }      

    type YearTransactions = Record<number, Transaction[]>;
    type TransactionByCategory = Record<string, Transaction[]>;

    interface TransactionsState {
        transactions: YearTransactions;
        loadedYears: Set<number>;
        isLoading: boolean;
        selectedYear: number;
        // fetchTransactionsForYear: (year: number) => Promise<Transaction[]>;
        // loadTransactionsForYear: (year: number) => Promise<void>;
    }

    interface TransactionsByYearMonth {
      [yearMonth: string]: Transaction[];
    }
    
}

export {};
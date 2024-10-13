// stores/useTransactionsStore.ts
import { defineStore } from 'pinia'
import { TransactionApi } from '~/server/apiTransaction';


export const useTransactionsStore = defineStore('transactions', {
    
    state: (): TransactionsState => ({
        transactions: {},
        loadedYears: new Set(),
        isLoading: false,
        selectedYear: new Date().getFullYear(),
    }),

    getters: {
        getAvailableYears(): number[] {
            const currentYear = new Date().getFullYear()
            return Array.from({ length: 10 }, (_, i) => currentYear - i)
        },
        getTransactionsForYear: (state) => (year: number): Transaction[] => {
            return state.transactions[year] || []
        },
        getTransactionByCategory: (state) => (categoryId: string): Transaction[] => {
            return Object.values(state.transactions).flat().filter(transaction => transaction.category.id === categoryId)
        }
    },

    actions: {

        async fetchTransactionsForYear(year: number): Promise<Transaction[]> {
            return new Promise(async (resolve) => {
                const transactions = await TransactionApi().getTransactionsForYear(year)
                resolve(transactions)
            })
        },

        async loadTransactionsForYear(year: number): Promise<void> {
            if (this.loadedYears.has(year)) return
            
            this.isLoading = true
            try {
                const yearTransactions = await this.fetchTransactionsForYear(year)
                this.transactions[year] = yearTransactions
                this.loadedYears.add(year)
            } catch (error) {
                console.error(`Error loading transactions for ${year}:`, error)
            } finally {
                this.isLoading = false
            }
        },

        setSelectedYear(year: number): void {
            this.selectedYear = year
        },

        async initializeStore(): Promise<void> {
                const currentYear = new Date().getFullYear()
                // init api call (fake call, the first on never works)
                const testApi = await TransactionApi().testApi()

                await this.loadTransactionsForYear(currentYear)
                await this.loadTransactionsForYear(currentYear - 1)
        },
    },
})
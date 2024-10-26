/**
 * @api {get} /api/transaction Get all transactions
 */

export const TransactionApi = () => {

    const config = useRuntimeConfig();
    const baseUrl = config.public.apiBase as string;
    const apiUrl = '/api/transactions' as string;

    /**
     * Get all transactions
     * @returns {Promise} Promise object represents the transaction list
     */
    const getTransactions = async (): Promise<Transaction[]> => {
        try {
            const response = await useFetch(apiUrl, {
                baseURL: baseUrl,
            });
            const data = response.data.value; // Access the value property of the Ref object
            return data as Transaction[];
        } catch (error) {
            console.error('Erreur lors de la récupération des transactions:', error);
            throw error;
        }
    }

    const getTransactionsForYear = async (year: number): Promise<Transaction[]> => {
        try {
            const response = await useFetch(apiUrl + '/transactionsForYear', {
                baseURL: baseUrl,
                params: { year },
            });
            const data = response.data.value; // Access the value property of the Ref object

            return data as Transaction[];
        } catch (error) {
            console.error('Erreur lors de la récupération des transactions:', error);
            throw error;
        }
    }

    /**
     * get transactions for a specific category during a specific month
     * @param {string} category - the category of the transaction
     * @param {number} month - the month of the transaction
     * @param {number} year - the year of the transaction
     * @returns a list of transactions
     */
    const getTransactionsForCategoryAndMonth = async (category: string, month: number, year: number): Promise<Transaction[]> => {
        try {
            const data = await $fetch(apiUrl + '/transactionsForCategoryAndMonth', {
                baseURL: baseUrl,
                params: { category, month, year },
            });

            return data as Transaction[];
        } catch (error) {
            console.error('Erreur lors de la récupération des transactions:', error);
            throw error;
        }
    }

    const testApi = async () => {
        try {
            const response = await useFetch(apiUrl + '/test', {
                baseURL: baseUrl,
            });
            const data = response.data;
            return data;
        } catch (error) {
            console.error('Erreur lors du test:', error);
            throw error;
        }
    }

    /**
     * update category transaction
     * @param {string} id - the id of the transaction
     * @param {string} categoryId - the id of the category
     * @returns {Promise<Transaction>} Promise object represents the transaction
        */

    const updateCategoryTransaction = async (id: string, categoryId: string): Promise<Transaction> => {
        try {
                const data = await $fetch(apiUrl + '/updateTransactionCategory', {
                    baseURL: baseUrl,
                    method: 'POST',
                    body: { transactionId: id, category: categoryId },
                });
                return data as Transaction;
        } catch (error) {
            console.error('Erreur lors de la récupération des transactions:', error);
            throw error;
        }
    }

    return {
        getTransactions,
        getTransactionsForYear,
        getTransactionsForCategoryAndMonth,
        updateCategoryTransaction,
        testApi,
    }

}

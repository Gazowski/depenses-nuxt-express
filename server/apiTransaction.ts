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

    return {
        getTransactions,
        getTransactionsForYear,
        testApi,
    }

}

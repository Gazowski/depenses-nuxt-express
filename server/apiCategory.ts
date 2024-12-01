export const CategoryApi = () => {

    const config = useRuntimeConfig();
    const baseUrl = config.public.apiBase as string;
    const apiUrl = '/api/categories/' as string;

    /**
     * Get all categories
     * @returns {Promise} Promise object represents the category list
     */

    const getCategories = async (): Promise<Category[]> => {
        try {
            const data = await $fetch(apiUrl, {
                baseURL: baseUrl,
            });
            return data as Category[];
        } catch (error) {
            console.error('Erreur lors de la récupération des categories:', error);
            throw error;
        }

    }

    /**
     * add a category
     * @param category
     * @returns {Promise} Promise object represents the category added
     * 
     */

    const addCategory = async (category: Category): Promise<Category> => {
        try {
            const data = await $fetch(apiUrl + '/add', {
                baseURL: baseUrl as string,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(category)
            });
            return data as Category;
        } catch (error) {
            console.error('Erreur lors de l\'ajout d\'une catégorie:', error);
            throw error;
        }
    }

    /**
     * add a keyword to a category
     */

    const addKeywordToCategory = async (categoryName: string, keyword: string): Promise<Category> => {
        try {
            const data = await $fetch(apiUrl + '/addKeyword', {
                baseURL: baseUrl as string,
                method: 'POST',
                body: { categoryName, keyword }
            });
            return data as Category;
        } catch (error) {
            console.error('Erreur lors de l\'ajout d\'un mot clé à une catégorie:', error);
            throw error;
        }
    }

    /**
     * get aggregated data
     */

    const getAggregatedData = async (year: number): Promise<AggregatedData> => {
        
        try {
            const data = await $fetch(apiUrl + 'getTotals', {
                baseURL: baseUrl,
                params: { year },
            });
            return data as AggregatedData;
        } catch (error) {
            console.error('Erreur lors de la récupération des données agrégées:', error);
            throw error;
        }
    }

    return {
        getCategories,
        addCategory,
        addKeywordToCategory,
        getAggregatedData
    }

}


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
            const response = await useFetch(apiUrl, {
                baseURL: baseUrl,
            });
            const data = response.data.value; // Access the value property of the Ref object
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
            const response = await useFetch(apiUrl + '/add', {
                baseURL: baseUrl as string,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(category)
            });
            const data = response.data.value; // Access the value property of the Ref object
            return data as Category;
        } catch (error) {
            console.error('Erreur lors de l\'ajout d\'une catégorie:', error);
            throw error;
        }
    }

    /**
     * add a keyword to a category
     */

    const addKeywordToCategory = async (categoryId: string, keyword: string): Promise<Category> => {
        try {
            const response = await useFetch(apiUrl + '/addKeyword', {
                baseURL: baseUrl as string,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ categoryId, keyword })
            });
            const data = response.data.value; // Access the value property of the Ref object
            return data as Category;
        } catch (error) {
            console.error('Erreur lors de l\'ajout d\'un mot clé à une catégorie:', error);
            throw error;
        }
    }

    return {
        getCategories,
        addCategory,
        addKeywordToCategory,
    }

}



export const useApi = () => {
    const config = useRuntimeConfig();
    const baseUrl = config.public.apiBase as string

    const getComptes = async () => {
        try {
            const response = await useFetch('/api/comptes', {
                baseURL: baseUrl, 
            })
            const data = response.data
            return data
        } catch (error) {
            console.error('Erreur lors de la récupération des comptes:', error)
            throw error
        }
    }

    const addCompte = async (compte: { nom: string; solde: number }) => {
        try {
            const response = await useFetch('/api/comptes', {
                baseURL: baseUrl as string,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(compte)
            })
            const data = response.data
            return data
        } catch (error) {
            console.error('Erreur lors de l\'ajout d\'un compte:', error)
            throw error
        }
    }

    return {
        getComptes,
        addCompte,
    }
}
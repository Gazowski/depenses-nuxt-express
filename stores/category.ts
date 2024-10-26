// stores/categoryStore.ts
import { defineStore } from 'pinia'
import { CategoryApi } from '~/server/apiCategory';


export const useCategoryStore = defineStore('category', {
    state: (): CategoryState => ({
        categories: [] as Category[],
        loading: false,
        error: null,
        aggregatedData: {} as AggregatedData,
        loadingYears: new Set<number>(),
    }),

    actions: {
        async fetchCategories() {
            this.loading = true;
            try {
                this.categories = await CategoryApi().getCategories();
            } catch (error) {
                this.error = 'Failed to fetch categories';
                console.error('Error fetching categories:', error);
            } finally {
                this.loading = false;
            }
        },

        async addKeywordToCategory(categoryId: string, keyword: string) {
            
            try {
                await CategoryApi().addKeywordToCategory(categoryId, keyword);
            } catch (error) {
                console.error('Error adding keyword to category:', error);
            }

        },

        async getAggregatedData(year: number) {
            if (this.aggregatedData[year] || this.loadingYears.has(year)) {
                return; // Évite de charger les mêmes données plusieurs fois
            }

            this.loadingYears.add(year);

            try {
                const data = await CategoryApi().getAggregatedData(year);
                this.aggregatedData = {...this.aggregatedData, ...data};
            } catch (error) {
                console.error('Erreur lors de la récupération des données agrégées:', error)
            } finally {
                this.loadingYears.delete(year);
            }
        },

        /**
         * update aggregatedData for a specific month
         * 
         */

        async updateAggregatedData(year: number) {
            try {
                const data = await CategoryApi().getAggregatedData(year);
                this.aggregatedData = {...this.aggregatedData, ...data};
            } catch (error) {
                console.error('Erreur lors de la mise à jour des données agrégées:', error);
            }
        },

        async initCategories() {
            const year = new Date().getFullYear();
            this.loading = true;

            try {
                await Promise.all([
                    this.getAggregatedData(year),
                    this.getAggregatedData(year - 1),
                    this.fetchCategories(),
                ]);
            } catch (error) {
                console.error('Erreur lors de l\'initialisation des catégories:', error);
            } finally {
                this.loading = false;
            }
        },

    },

    getters: {
        getCategoryById: (state) => (id: string) => {
            return state.categories.find(category => category.id === id) as Category;
        },
        getCategoriesByGroup: (state) => (groupe: string) => {
            return state.categories.filter(category => category.groupe === groupe);
        },

        getTotalsByYear: (state) => (year: number) => state.aggregatedData[year] || {},
        // getCategoryTotalsByYear: (state) => (year: number, categoryName: string) => 
        //   state.aggregatedData[year]?.[categoryName],
        getCategoryGroups: (state) => (year: number) => {
          const yearData = state.aggregatedData[year];
          if (!yearData) return [];
          const groups = new Set<string>();
          Object.values(yearData).forEach(categoryData => {
            groups.add(categoryData.group);
          });
          return Array.from(groups);
        },
        getTotalsByMonth: (state) => (year: number, month: number) => {
            const yearData = state.aggregatedData[year];
            if (!yearData) return {};
            return yearData.filter(data => parseInt(data.month) === month);
        },

        isLoading: (state) => (year: number) => state.loadingYears.has(year),
    },
});


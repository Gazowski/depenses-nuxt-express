// stores/categoryStore.ts
import { defineStore } from 'pinia'
import { CategoryApi } from '~/server/apiCategory';


export const useCategoryStore = defineStore('category', {
    state: (): CategoryState => ({
        categories: [] as Category[],
        loading: false,
        error: null,
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

        addAmountToCategory(categoryId: string, year: string, month: string, amount: number) {
            const category = this.categories.find(category => category.id === categoryId);
            // round amount to 2 decimal places
            amount = Math.round(amount * 100) / 100;
            if (!category) {
                console.error('Category not found:', categoryId);
                return;
            }

            
            if(!category.totalAmount){
                category.totalAmount = {};
                category.totalAmount[year] = {};
                category.totalAmount[year][month] = amount;
            } else {
                if(!category.totalAmount[year]) {
                    if(!category.totalAmount[year][month]) {
                        category.totalAmount[year][month] = amount;
                    } else {
                        category.totalAmount[year][month] = (parseFloat(category.totalAmount[year][month]) || 0) + parseFloat(amount);
                    }
                } else {
                    if(!category.totalAmount[year][month]) {
                        category.totalAmount[year][month] = amount;
                    } else {
                        category.totalAmount[year][month] = (parseFloat(category.totalAmount[year][month]) || 0) + parseFloat(amount);
                    }
                }
            }

            console.log('category.totalAmount:', category.totalAmount);

            // add total amount to category that matches categoryId
            this.categories = this.categories.map(category => {
                if (category.id === categoryId) {
                    return {
                        ...category,
                        totalAmount: category.totalAmount,
                    };
                }
                return category;
            });
            

        }


    },

    getters: {
        getCategoryById: (state) => (id: string) => {
            return state.categories.find(category => category.id === id);
        },
        getCategoriesByGroup: (state) => (groupe: string) => {
            return state.categories.filter(category => category.groupe === groupe);
        },
        getCategoriesTotalAmountForMonth: (state) => (year: string, month: string) => {
            return state.categories.map(category => {
                const totalAmount = category.totalAmount.find(item => item.year === year && item.month === month);
                return {
                    ...category,
                    totalAmount: totalAmount ? totalAmount.amount : 0,
                };
            });
        }
    },
});
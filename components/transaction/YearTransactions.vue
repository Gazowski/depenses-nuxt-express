<script setup lang="ts">

/**
 * list all transactions for a given year
 * sort transactions by category
 */

    import { useTransactionsStore } from '@/stores/transactions'
    import { useCategoryStore } from '~/stores/category';

    const transactionsStore = useTransactionsStore()
    const categoryStore = useCategoryStore()


    const loadYear = async () => {
        await transactionsStore.loadTransactionsForYear(transactionsStore.selectedYear)
    }

    onMounted(async () => {
        await transactionsStore.initializeStore()
        await categoryStore.fetchCategories()
    })
</script>

<template>
    <div>
        <h1>Transactions bancaires</h1>
        <select v-model="transactionsStore.selectedYear" @change="loadYear">
            <option v-for="year in transactionsStore.getAvailableYears" :key="year" :value="year">
                {{ year }}
            </option>
        </select>
      
        <div v-if="transactionsStore.isLoading">Chargement...</div>
      
        <div v-else>
            <!-- sort transactions of the selected year by category -->
            <div v-for="category in categoryStore.categories" :key="category.id">
                <h2>{{ category.name }}</h2>
                <div v-for="
                        transaction 
                        in 
                        transactionsStore.transactions[transactionsStore.selectedYear]
                            .filter(t => t.category.id === category.id)" 
                    :key="transaction.transactionDate.toString()"
                >
                    {{ transaction.transactionDate }} - {{ transaction.description }}: {{ transaction.amount }}$
                </div>
            </div>
        </div>
    </div>
</template>
  

<script setup lang="ts">
import { useTransactionsByCategoryMonth } from '~/composables/useTransactions'
import { useCategoryStore } from '~/stores/category'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';   

const { transactionsByCategoryAndMonth, totalAmountByCategoryAndMonth, sortedMonths } = useTransactionsByCategoryMonth()
const categoryStore = useCategoryStore()

const props = defineProps<{
  year: string
  month: string
}>() 

 const transactionsByCategorie = ref(transactionsByCategoryAndMonth(props.month, props.year))
 console.log(transactionsByCategorie.value)
// Utility function to format amounts
const formatAmount = (amount: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'CAD' }).format(amount)

// Utility function to format year-month
const formatYearMonth = (yearMonth: string) => {
  const [year, month] = yearMonth.split('-')
  return new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'long', year: 'numeric' })
}
</script>

<template>
  <div>
    <h1>Transactions par catégorie</h1>
    <h3>{{ props.month }} - {{ props.year }}</h3>
    <div class="grid-layout">
      <div v-for="category in categoryStore.categories as Category[]" :key="category.id">
          <DataTable 
            v-if="transactionsByCategorie[category.id as any].length" 
            :value="transactionsByCategorie[category.id as any]"
            class="mb-8 border-round-md"
            :style="{'--p-datatable-header-color' : category.color }"
            scrollable
            scrollHeight="400px">
            <template #header class="text-color" style="--text-color: {{ category.color }}">
              <div class="flex flex-wrap items-center justify-content-between gap-2">
                <span class="text-xl font-bold">{{ category.title }}</span>
                <span class="text-xl font-bold">Total: {{ Math.round(category.totalAmount[props.year][props.month] * 100) / 100 }}</span>
            </div>
            </template>
            <Column field="transactionDate" header="Date" :sortable="true"></Column>
            <Column field="description" header="Description"></Column>
            <Column field="amount" header="Montant" :sortable="true"></Column>
          </DataTable>
          <p v-else>Pas de transactions pour ce mois</p>
      </div>
    </div>  
  </div>
</template>

<style scoped>
  .grid-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
</style>
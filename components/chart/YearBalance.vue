<script setup lang="ts">
    /**
     * Chart to display the balance of the year
     * it shows two lines: one for the income and one for the expenses
     */
    import { useCategoryStore } from '~/stores/category';
    import Chart from 'primevue/chart';
    import Card from 'primevue/card';
    import { shortMonthsList } from '~/composables/useMonth';

    const categoryStore = useCategoryStore()
    const year = new Date().getFullYear()

    const detailedTotals = ref([]) as Ref<Object[]>; // detailed totals for each month
    const incomeTotals = ref([]) as Ref<Object[]>;
    const expenseTotals = ref([]) as Ref<Object[]>;
    const availableMonths = ref([]) as Ref<number[]>;

    const chartBalanceData = ref();
    const chartBalanceOptions = ref();
    const chartDetailedData = ref();
    const chartDetailedOptions = ref();

    onMounted(() => {
        for (let i = 1; i <= 12; i++) {
            const totals = categoryStore.getTotalsByMonth(year, i) as CategoryData[] | [];
            if(totals.length > 0) {
                
                const incomeArray = totals.filter((data:CategoryData) => data.group === 'Revenu') as CategoryData[];
                const monthIncomes = incomeArray.reduce((acc:any, data:CategoryData) => acc + parseFloat(data.total), 0) as number;
                incomeTotals.value.push({
                    month: i,
                    total: monthIncomes
                });
                
                const expenseArray = totals.filter((data:CategoryData) => data.group === 'Dépense');
                const totalExpense = expenseArray.reduce((acc:any, data:CategoryData) => acc + parseFloat(data.total), 0);
                expenseTotals.value.push({
                    month: i,
                    total: totalExpense
                });

                availableMonths.value.push(i);
            }

                // complete the detailed totals (for the second chart)
                // add 0 for the missing categories
                // revoir la construction de l'objet
                // doit être un objet avec caractéristiques de la catégorie + tableau de totaux a travers les mois
                // -> construire uniquement le tableau de totaux pour chaque catégorie

        }

        const allCategories = categoryStore.categories;
        const expenseCategories = allCategories.filter((category:Category) => category.groupe === 'Dépense');
        const detailedTotals = expenseCategories.map((category:Category) => {
                return {
                    label: category.title,
                    backgroundColor: category.color,
                    borderColor: category.color,
                    data: availableMonths.value.map((month:number) => {
                        const monthTotal = categoryStore.getTotalsByMonth(year, month).find((data:CategoryData) => data.name === category.name);
                        return monthTotal ? monthTotal.total * -1 : 0;
                    }),
                    borderWidth: 1,
                }
        });

        console.log('detailedTotals', detailedTotals);



        chartBalanceData.value = {
            labels: incomeTotals.value.map((data:any) => shortMonthsList[data.month - 1]),
            datasets: [
                {
                    label: 'Revenus',
                    backgroundColor: 'rgba(6, 182, 212,.2)',
                    borderColor: 'rgb(6, 182, 212)',
                    data: incomeTotals.value.map((data:any) => data.total),
                    borderWidth: 1,
                },
                {
                    label: 'Dépenses',
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132,.2)',
                    data: expenseTotals.value.map((data:any) => data.total * -1),
                    borderWidth: 1,
                }
            ]
        };

        chartBalanceOptions.value = {
            responsive: true,
            maintainAspectRatio: false,
        };

        chartDetailedData.value = {
            //labels: detailedTotals.value.map((data:any) => data.month),
            labels: availableMonths.value.map((month:number) => shortMonthsList[month - 1]),
            datasets: detailedTotals
        };

        chartDetailedOptions.value = {
            responsive: true,
            maintainAspectRatio: false,
        };
    })

</script>

<template>
    <div class="layout">
        <Card>
            <template #content>
                <Chart 
                    height="300"
                    type="line" 
                    :data="chartBalanceData" 
                    :options="chartBalanceOptions"
                    key="chart-balance" 
                />
            </template>  
        </Card>
        <Card>
            <template #content>
                <Chart 
                    height="300"
                    type="line" 
                    :data="chartDetailedData" 
                    :options="chartDetailedOptions" 

                />
            </template>  
        </Card>
    </div>
</template>

<style scoped>
    .layout {
        display: grid;
        gap: 1rem;
    }
</style>
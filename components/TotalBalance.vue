<script setup lang="ts">
import Chart from 'primevue/chart';
import Card from 'primevue/card';

const props = defineProps<{
  incomeTotal: number
  expenseTotal: number
}>()

const chartData = ref();
const chartOptions = ref();
const balance = computed(() => props.incomeTotal - props.expenseTotal);

onMounted(() => {
  chartData.value = {
    labels: [`${Math.round(props.incomeTotal)} $`, `${Math.round(props.expenseTotal)} $`],
    datasets: [
      {
        label: 'Revenus',
        backgroundColor: 'rgba(6, 182, 212,.2)',
        borderColor: 'rgb(6, 182, 212)',
        data: [props.incomeTotal, 0],
        borderWidth: 1,
      },
      {
        label: 'Dépenses',
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132,.2)',
        data: [0, props.expenseTotal],
        borderWidth: 1,
      }
    ]
  };

  chartOptions.value = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true
      },
      y: {
        display: false
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };
})


</script>

<template>
    <Card>
        <template #content>
            <h4 class="text-center" :class=" balance >= 0 ? 'text-cyan-500' : 'text-red-500' ">Balance: {{ Math.round(balance) }} $</h4>
            <Chart :height="300" type="bar" :data="chartData" :options="chartOptions" />
        </template>  
  </Card>
</template>

<style scoped>
  .p-chart {
    min-height: 200px;
  }
</style>

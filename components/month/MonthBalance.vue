<script setup lang="ts">
import Chart from 'primevue/chart';
import Card from 'primevue/card';

const props = defineProps<{
  totalIncome: number
  totalExpense: number
}>()

const chartData = ref();
const chartOptions = ref();

onMounted(() => {
  chartData.value = {
    labels: ['Revenu', 'Dépense'],
    datasets: [
      {
        label: 'Revenus',
        backgroundColor: 'rgba(6, 182, 212,.2)',
        borderColor: 'rgb(6, 182, 212)',
        data: [props.totalIncome, 0],
        borderWidth: 1,
      },
      {
        label: 'Dépenses',
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132,.2)',
        data: [0, props.totalExpense],
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
        stacked: true
      }
    }
  };
})


</script>

<template>
    <Card>
        <template #content>
            <Chart type="bar" :data="chartData" :options="chartOptions" />
        </template>  
  </Card>
</template>

<style scoped>
  .p-chart {
    min-height: 200px;
  }
</style>
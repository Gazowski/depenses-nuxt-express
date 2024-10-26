<script setup lang="ts">
import Chart from 'primevue/chart';
import Card from 'primevue/card';

const props = defineProps<{
  repartitionData: CategoryData[]
}>()

const chartData = ref();
const chartOptions = ref();

onMounted(() => {
  chartData.value = {
    datasets: [
      {
        data: props.repartitionData.map(data => data.total),
        backgroundColor: props.repartitionData.map(data => data.color),
        hoverBackgroundColor: props.repartitionData.map(data => data.color),
        borderWidth: 0,
      }
    ]
  };

  chartOptions.value = {
    responsive: true,
    maintainAspectRatio: false,
    // animation: {
    //   animateScale: false,
    //   animateRotate: false,
    // },
  };
})
</script>

<template>
    <Card>
        <template #content>
            <Chart type="doughnut" :data="chartData" :options="chartOptions" />
        </template>  
  </Card>
</template>

<style scoped>
  .p-chart {
    min-height: 200px;
  }
</style>
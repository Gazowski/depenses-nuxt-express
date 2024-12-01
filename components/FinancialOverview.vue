<!-- components/FinancialOverview.vue -->
<script setup lang="ts">
    import Chart from 'primevue/chart';
import CSVdownload from './transaction/CSVdownload.vue';
    
    const currentYear = new Date().getFullYear();
    const totalGain = ref(0);
    
    const chartData = ref({
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
        datasets: [
        {
            label: 'Dépenses',
            data: [],
            fill: false,
            borderColor: '#FF6384',
            tension: 0.4
        },
        {
            label: 'Revenus',
            data: [],
            fill: false,
            borderColor: '#36A2EB',
            tension: 0.4
        }
        ]
    });
    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top'
            }
        }
    };
    
    onMounted(async () => {
        // Simulons le chargement des données
        // Remplacez ceci par un appel API réel pour obtenir vos données financières
        const data = await fetchFinancialData();
        updateChartData(data);
    });
    
    const fetchFinancialData = () => {
        // Simulation de données - à remplacer par un vrai appel API
        return new Promise(resolve => {
        setTimeout(() => {
            resolve({
            expenses: [1000, 1200, 900, 1500, 1100, 1300, 1400, 1600, 1800, 2000, 1700, 1900],
            income: [2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100]
            });
        }, 1000);
        });
    };
    
    const updateChartData = (data: any) => {
        chartData.value.datasets[0].data = data.expenses;
        chartData.value.datasets[1].data = data.income;
        totalGain.value = data.income.reduce((sum: number, val: number) => sum + val, 0) -
                        data.expenses.reduce((sum: number, val: number) => sum + val, 0);
    };
    
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
    };
</script>

<template>
    <div class="financial-overview">
        <h2>Vue d'ensemble financière {{ currentYear }}</h2>
        <div class="total-gain">
            <h3>Gain total de l'année : {{ formatCurrency(totalGain) }}</h3>
        </div>
        <Chart type="line" :data="chartData" :options="chartOptions" class="financial-chart" />
    </div>
</template>
  

    
<style scoped>
    .financial-overview {
        padding: 1rem;
    }
    
    .total-gain {
        margin-bottom: 1rem;
        font-size: 1.2em;
        color: #4caf50;
    }
    
    .financial-chart {
        height: 400px;
    }
</style>
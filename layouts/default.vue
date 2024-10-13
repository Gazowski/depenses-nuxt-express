<!-- layouts/custom.vue -->
<script setup lang="ts">
import Menu from 'primevue/menu';
import Button from 'primevue/button';
import { monthsList } from '~/composables/useMonth';

const sidebarVisible = ref(true);
const currentYear = new Date().getFullYear();
const months = monthsList;

const monthsMenu = computed(() => {
    const currentMonth = new Date().getMonth();
    
    return months.slice(0, currentMonth + 1).map((month, index) => ({
    label: month,
    command: () => navigateToMonth(month)
    }));
});

const toggleSidebar = () => {
    sidebarVisible.value = !sidebarVisible.value;
};

const navigateToMonth = (month: string) => {
    // Implémentez la navigation vers le mois spécifique
    console.log(`Naviguer vers le mois: ${month}`);
    navigateTo(`/an-${currentYear}/${month}`);
};

const showPastYears = () => {
    // Implémentez la logique pour afficher les années passées
    console.log('Afficher les années passées');
};
</script>

<template>
    <div class="layout-wrapper">
      <Sidebar v-model:visible="sidebarVisible" >
        <div class="sidebar-content">
          <h3>{{ currentYear }}</h3>
          <Menu :model="monthsMenu" />
          <Button label="Années précédentes" class="p-button-secondary mt-3" @click="showPastYears" />
        </div>
      </Sidebar>
      <div class="layout-main">
        <header class="layout-header">
          <Button icon="pi pi-bars" @click="toggleSidebar" />
          <h1>Suivi financier familial</h1>
        </header>
        <main class="layout-content">
          <slot />
        </main>
      </div>
    </div>
  </template>
  

  <style scoped>
  .layout-wrapper {
    display: flex;
    min-height: 100vh;
  }
  
  .custom-sidebar {
    width: 250px;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
  }
  
  .sidebar-content {
    padding: 1rem;
  }
  
  .layout-main {
    flex: 1;
    margin-left: 250px;
    display: flex;
    flex-direction: column;
  }
  
  .layout-header {
    padding: 1rem;  
    display: flex;
    align-items: center;
  }
  
  .layout-header h1 {
    margin-left: 1rem;
  }
  
  .layout-content {
    flex: 1;
    padding: 1rem;
  }
  
  @media (max-width: 768px) {
    .layout-main {
      margin-left: 0;
    }
  }

  </style>
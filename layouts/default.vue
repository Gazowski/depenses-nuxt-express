<!-- layouts/custom.vue -->
<script setup lang="ts">
import Menu from 'primevue/menu';
import Button from 'primevue/button';
import { monthsList } from '~/composables/useMonth';
import { useCategoryStore } from '~/stores/category';

const sidebarVisible = ref(false);
const currentYear = new Date().getFullYear();
const months = monthsList;
const categoryStore = useCategoryStore();
const isInitialised = ref(false);

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

onMounted(async () => {

    await categoryStore.initCategories();

    isInitialised.value = true;
})
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
      <div class="layout-main" v-if="isInitialised">
        <header class="layout-header">
          <Button icon="pi pi-bars" @click="toggleSidebar" />
          <h1 class="text-lg">Suivi financier familial</h1>
        </header>
        <main class="layout-content">
          <slot />
        </main>
      </div>
      <div v-else>
        <p>Initialisation...</p>
      </div>
    </div>
  </template>
  

  <style scoped>
  .layout-wrapper {
    display: grid;
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
    display: grid;
    grid-template-rows: auto 1fr;
    place-items: center;

  }
  
  .layout-header {
    display: grid;
    grid-template-columns: auto 1fr auto;
    width: 100%;
  }
  
  .layout-header h1 {
    text-align: center;
  }
  
  .layout-content {
    flex: 1;
    padding: 1rem;
    max-width: calc(696px + 2 * 1rem);
  }
  
  @media (max-width: 768px) {
    .layout-main {
      margin-left: 0;
    }
  }

  </style>
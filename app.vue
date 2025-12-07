<script setup lang="ts">
    import { useCategoryStore } from '~/stores/category';
    import { useTransactionsStore } from '~/stores/transactions';

    const categoryStore = useCategoryStore();
    const transactionsStore = useTransactionsStore();

    onMounted(async () => {
        await transactionsStore.initializeStore();
        await categoryStore.fetchCategories();
    });

</script>


<template>
    <div>
        <NuxtLayout>
            <NuxtPage/>
        </NuxtLayout>
    </div>
</template>


<style>
    body {
      font-family: Montserrat, sans-serif;
    }
    
    .p-menu-item-link {
        text-transform: capitalize;
    }
</style>
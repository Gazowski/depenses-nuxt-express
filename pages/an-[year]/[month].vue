<script setup lang="ts">

    const route = useRoute();
    const year = route.params.year as string;
    const month = route.params.month as string;

</script>

<template>
    <div>
        <TransactionMonth :month="month" :year="year"/>
    </div>
</template>
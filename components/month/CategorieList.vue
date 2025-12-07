<script setup lang="ts">
    import Accordion from 'primevue/accordion';
    import AccordionPanel from 'primevue/accordionpanel';
    import AccordionHeader from 'primevue/accordionheader';
    import AccordionContent from 'primevue/accordioncontent';
    import Button from 'primevue/button';

    import DataTable from 'primevue/datatable';
    import Column from 'primevue/column';
    import Skeleton from 'primevue/skeleton';

    const props = defineProps<{
        categories: CategoryData[]
        transactionsByCategory: TransactionByCategory
    }>()

    const categories = ref(props.categories)
    const transactionsByCategory = ref(props.transactionsByCategory)

    // ajouter un watcher sur categories pour mettre à jour la valeur de categories ????
    watch(() => props.categories, (newVal) => {
        categories.value = newVal
    })

</script>
<template>
    <Accordion>
        <AccordionPanel         
            v-for="(category, index) in categories" 
            :key="category.name" 
            :value="category.name"
            class="slide-enter-active"
            :class="category.title === 'unknown' ? 'p-accordionpanel--unknow': false"
            :style="{
                '--slide-enter-active-delay': .1 * index + 's',
                '--slide-enter-active-duration': .3 + .2 * index + 's'
            }" 
            @click="$emit('onCategoryClick', category.name)"
        >
            <AccordionHeader >
                <div class="flex flex-1 justify-content-between gap-8">
                <div class="flex gap-3 align-items-center"><span class="pi pi-circle-fill" :style='{color: category.color, "font-size": ".75rem"}'></span> {{ category.name }}</div>
                <div class="flex gap-4 align-items-center">
                    <div v-if="category.title === 'unknown'">
                        <Button 
                            label="Catégoriser"
                            outlined
                            severity="warn"
                            size="small"
                            @click="$emit('onUnknowClick')" 
                        />
                    </div>
                    <span>{{ category.total }}&nbsp;$</span>
                </div>
                </div>
            </AccordionHeader>
            <AccordionContent class="fade-enter-active">
                <DataTable 
                    :value="transactionsByCategory[category.name]" 
                >
                    <Column field="transactionDate" header="Date">
                        <template #body="{data, field}">
                            <Skeleton v-if="!data[field]"></Skeleton>
                            <span v-else>{{ data[field] }}</span>
                        </template>
                    </Column>
                    <Column field="description" header="Description">
                        <template #body="{data, field}">
                            <Skeleton v-if="!data[field]"></Skeleton>
                            <span v-else>{{ data[field] }}</span>
                        </template>
                    </Column>
                    <Column field="amount" header="Montant">
                        <template #body="{data, field}">
                            <Skeleton v-if="!data[field]"></Skeleton>
                            <span v-else>{{ data[field] }}</span>
                        </template>
                    </Column>
                    <Column header="Action">
                        <template #body="{data}">
                            <Button icon="pi pi-pencil" @click="$emit('onEditTransaction', data)"></Button>
                        </template>
                    </Column>
                </DataTable>
            </AccordionContent>
        </AccordionPanel>
    </Accordion>
</template>

<style scoped>
    .p-accordion {
        --custom-border-radius: 8px;
        --p-accordion-panel-border-width: 0px;
        --p-accordion-header-first-top-border-radius: var(--custom-border-radius);
        --p-accordion-header-border-radius: var(--custom-border-radius);
        --p-accordion-header-last-bottom-border-radius: var(--custom-border-radius);

        display: grid;
        gap: 1rem;
        width: 100%;
    }

    .p-accordionheader {
        gap: 1rem;
    }

    .p-accordioncontent-content {
        border-radius: var(--custom-border-radius);
    }

    .p-accordionpanel--unknow {
        --p-accordion-panel-border-width: 1px;
        --p-accordion-panel-border-color: var(--p-orange-400);
        border-radius: var(--custom-border-radius);
    }
</style>
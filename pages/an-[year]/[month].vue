<script setup lang="ts">
    import { useCategoryStore } from '~/stores/category'
    import { getMonthNumber } from '~/composables/useMonth'
    import { TransactionApi } from '~/server/apiTransaction'
    import { CategoryApi } from '~/server/apiCategory';

    import Dialog from 'primevue/dialog';
    import Select from 'primevue/select';
    import Button from 'primevue/button';
    import InputText from 'primevue/inputtext';
    import DataTable from 'primevue/datatable';
    import Divider from 'primevue/divider';


    const route = useRoute();
    const year = route.params.year as string;
    const month = route.params.month as string;
    const transactionsByCategory = ref({}) as Ref<TransactionByCategory>;

    const monthNumber = getMonthNumber(month) as number;
    const categoryStore = useCategoryStore()

    const getCategories = ():CategoryData[] => {
        const categoriesList = categoryStore.getTotalsByMonth(parseInt(year), monthNumber) as CategoryData[]
        // if categories list has category with name === 'unknown' put it at the beginning of the list
        const unknownCategory = categoriesList.find((category:CategoryData) => category.title === 'unknown')
        if(unknownCategory) {
            const unknownIndex = categoriesList.indexOf(unknownCategory)
            categoriesList.splice(unknownIndex, 1)
            categoriesList.unshift(unknownCategory)
        }
        return categoriesList;
    }

    const isLoading = computed(() => categoryStore.isLoading(parseInt(year))) as ComputedRef<boolean>;
    let categories = computed(() => getCategories()) as ComputedRef<CategoryData[]>;
    
    // value for balance chart
    const incomeArray = categories.value.filter((data:CategoryData) => data.group === 'Revenu') as CategoryData[];
    const totalIncome = ref(incomeArray.reduce((acc:any, data:CategoryData) => acc + parseFloat(data.total), 0));
    
    const expenseArray = categories.value.filter((data:CategoryData) => data.group === 'Dépense');
    const totalExpense = ref(expenseArray.reduce((acc:any, data:CategoryData) => acc + parseFloat(data.total), 0));
    
    // value for repartition chart
    const repartitionData = ref(
        categories.value.filter(
            (data:CategoryData) => data.group === 'Dépense'
        )
    );
    

    // transactions list by category
    // ------------------------------------------------------------------------------------
    
    const unknownCategory = categories.value.find((data:CategoryData) => data.title === 'unknown') as CategoryData;
    const incomeCategories = categories.value.filter((data:CategoryData) => data.group === 'Revenu') as CategoryData[];
    const expenseCategories = categories.value.filter((data:CategoryData) => data.group === 'Dépense' && data.title !== 'unknown') as CategoryData[];
    const otherCategories = categories.value.filter((data:CategoryData) => data.group === 'Interne') as CategoryData[];
    const allCategories = ref([
        {title: 'Inconnus', categories: [unknownCategory]},
        {title: 'Revenus', categories: incomeCategories},
        {title: 'Dépenses', categories: expenseCategories},
        {title: 'Internes', categories: otherCategories}
    ]);


    
    // Click sur header accordion -> afficher les transactions de la catégorie
    const handleCategoryClick = async(category:string) => {

        if (category in transactionsByCategory.value && !isUnknownCategorisation.value) {
            return
        } else {
            const categoryTransactions = await TransactionApi().getTransactionsForCategoryAndMonth(category, monthNumber, parseInt(year)) as Transaction[]
            transactionsByCategory.value[category] = categoryTransactions
        }

        if(isUnknownCategorisation.value) {
            handleEditTransaction(transactionsByCategory.value['Inconnu'][0])
        }
    }


    // MODAL
    //-------------------------------------------------------------------------------------
    const openModal = ref(false)
    const modalData = ref({}) as Ref<Transaction>
    const modalCategory = ref({}) as Ref<Category>
    const modalShowEditField = ref(false) as Ref<boolean>
    const modalNewCategory = ref('') as Ref<string>
    const modalNewKeyword = ref('') as Ref<string>
    const isUnknownCategorisation = ref(false) as Ref<boolean>
    const isReadyForNext = ref(false) as Ref<boolean>
    const showMultipleTransactionsConfirm = ref(false) as Ref<boolean>
    let resolveMultipleTransactions = ref(null) as Ref<any>
    const sameDescriptionTransactions = ref([]) as Ref<Transaction[]>
    const selectedDescriptionTransactions = ref([]) as Ref<Transaction[]>

    // click sur bouton modifier transaction -> ouvrir modal
    const handleEditTransaction = (data:Transaction) => {
        modalData.value = data
        openModal.value = true
        modalCategory.value = categoryStore.getCategoryById(modalData.value.category.id as string)
    }

    // click sur bouton modifier -> enregistrer la nouvelle catégorie
    const handleChangeCategory = async (addKeyword:boolean) => {
        
        const openedCategory = modalCategory.value.name as string
        const newCategoryName = categoryStore.getCategoryById(modalNewCategory.value as string).name as string
        
        // update transaction category in database 
        if(modalNewCategory.value !== '') {
            await TransactionApi().updateCategoryTransaction(modalData.value.id as string, modalNewCategory.value)
            // remove transaction from transactionsByCategory
            transactionsByCategory.value[openedCategory] = transactionsByCategory.value[openedCategory].filter(
                (transaction:Transaction) => transaction.id !== modalData.value.id
            )
        }
        
        // add keyword to category in database
        if(addKeyword) {
            await CategoryApi().addKeywordToCategory(newCategoryName as string, modalNewKeyword.value)
        }
        
        // check if other transactions is the same category have the same description
        const sameCategoryTransactions = transactionsByCategory.value[openedCategory]
        sameDescriptionTransactions.value = sameCategoryTransactions.filter((transaction:Transaction) => transaction.description === modalData.value.description)
        if(sameDescriptionTransactions.value.length > 1) {
            try {
                const isConfirmed = await showMultipleTransactionsEdit()
                if(isConfirmed) {
                    // change category for all transactions in selectedDescriptionTransactions
                    selectedDescriptionTransactions.value.forEach(async(transaction:Transaction) => {
                        await TransactionApi().updateCategoryTransaction(transaction.id as string, modalNewCategory.value)
                    })
                } else {
                    console.log('modification multiple annulée')
                }
            } catch (error) {
                console.log('erreur lors de la selection multiple', error)
            } finally {
                
                resolveMultipleTransactions.value = null
            }
            
        }

        // update data
        // update category in store
        await categoryStore.updateAggregatedData(parseInt(year))
        
        // update transaction in transactionsByCategory
        const categoryAllTransactions = await TransactionApi().getTransactionsForCategoryAndMonth(openedCategory, monthNumber, parseInt(year)) as Transaction[]
        const newCategoryTransactions = await TransactionApi().getTransactionsForCategoryAndMonth(newCategoryName, monthNumber, parseInt(year)) as Transaction[]
        transactionsByCategory.value[openedCategory] = categoryAllTransactions;
        transactionsByCategory.value[newCategoryName] = newCategoryTransactions;


        // close modal
        if(!isUnknownCategorisation.value) {
           clearModal()
        } else {
            isReadyForNext.value = true
        } 
    }

    const handleNextUnknowTransaction = () => {
        isReadyForNext.value = false
        modalNewCategory.value = ''
        modalNewKeyword.value = ''
        modalShowEditField.value = false
        showMultipleTransactionsConfirm.value = false
        sameDescriptionTransactions.value = []
        selectedDescriptionTransactions.value = []
        resolveMultipleTransactions.value = null
        
        if(transactionsByCategory.value['Inconnu'].length > 0) {
            modalData.value = transactionsByCategory.value['Inconnu'][0]
        } else {
            isUnknownCategorisation.value = false
            openModal.value = false
        }

    }

    const showMultipleTransactionsEdit = () : Promise<boolean> => {
        showMultipleTransactionsConfirm.value = true
        return new Promise((resolve) => {
            resolveMultipleTransactions.value = resolve
        })
    }

    const clearModal = () => {
        openModal.value = false
        modalData.value = {
            id: '',
            transactionId: '',
            description: '',
            amount: 0,
            transactionDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            category: {
                id: '',
            }
        }
        modalCategory.value = {
            id: '',
            name: '',
            title: '',
            color: '',
            groupe: '',
            keywords: [],
            totalAmount: {},

        }
        modalShowEditField.value = false
        modalNewCategory.value = ''
        modalNewKeyword.value = ''
        isUnknownCategorisation.value = false
        isReadyForNext.value = false
        showMultipleTransactionsConfirm.value = false
        sameDescriptionTransactions.value = []
        selectedDescriptionTransactions.value = []
        resolveMultipleTransactions.value = null
    }

</script>

<template>
    <div class="layout">
        <h3>{{ month }} - {{ year }}</h3>
        <div v-if="isLoading" class="text-center">
            <p>Loading...</p>
        </div>
        <template v-else>
            <div class="chart-layout">
                <MonthBalance 
                    class="fade-enter-active" 
                    :totalIncome="totalIncome" 
                    :totalExpense="totalExpense * -1" 
                />
                <MonthRepartition 
                    class="fade-enter-active"
                    style="--fade-enter-active-delay: 0.3s" 
                    :repartitionData="repartitionData" 
                />
            </div>
            <template v-for="category, index in allCategories" :key="category.title">
                <template v-if="category.categories[0] !== undefined">
                    <h4>{{ category.title }}</h4>
                    <MonthCategorieList 
                        :categories="category.categories" 
                        :transactionsByCategory="transactionsByCategory" 
                        @on-category-click="handleCategoryClick" 
                        @on-edit-transaction="handleEditTransaction" 
                        @on-unknow-click="() => isUnknownCategorisation = true" 
                    />
                    <Divider v-if="index !== allCategories.length - 1" />
                </template>
            </template>
        </template>

        <Dialog 
            v-model:visible="openModal" 
            modal 
            header="Choisir une Catégorie" 
            :style="{ width: '32rem' }"
            @hide="clearModal"
        >
            <p>
                <span class="font-bold" :style="{color: modalCategory.color}">{{ modalCategory.name }}</span>
                &nbsp;-&nbsp;
                <span>{{ modalData.description }}</span>
                &nbsp;
                <span>{{ modalData.amount }} $</span>
            </p>
            <template v-if="!showMultipleTransactionsConfirm">
                <div class="flex gap-2">
                    <Select 
                        v-model="modalNewCategory"
                        :options="categoryStore.categories"
                        optionLabel="name"
                        optionValue="id" 
                        placeholder="Nouvelle catégorie"
                        class="h-8"
                    />
                    <Button 
                        label="Modifier" 
                        icon="pi pi-check" 
                        iconPos="left"
                        severity="success"
                        @click="() => {
                            modalShowEditField = !modalShowEditField;
                            modalNewKeyword = modalData.description as string;
                        }"
                    />
                </div>
                <div v-if="modalShowEditField" class="flex flex-column gap-2 mt-4">
                    <label for="description">Ajouter la description à 
                        <span class="font-bold">
                            {{ categoryStore.getCategoryById(modalNewCategory as string).name }}
                        </span>
                    </label>
                    <div class="flex gap-2">
                        <InputText v-model="modalNewKeyword" placeholder="Description" />
                        <Button 
                            label="Enregistrer" 
                            icon="pi pi-check" 
                            iconPos="left"
                            severity="success"
                            @click="handleChangeCategory(true)"
                        />
                        <Button 
                            label="Non" 
                            icon="pi pi-times" 
                            iconPos="left"
                            severity="danger"
                            @click="handleChangeCategory(false)"
                        />
                    </div>
                    <div v-if="isUnknownCategorisation" class="text-right mt-4">
                        <Button 
                            label="Suivant" 
                            icon="pi pi-chevron-right" 
                            iconPos="right"
                            severity="success"
                            :disabled="!isReadyForNext"
                            @click="handleNextUnknowTransaction"
                        />
                    </div>
                </div>
            </template>
            <div v-else>
                <p>Plusieurs transactions ont la même description</p>
                <p>Modifier la catégorie des transactions suivantes ?</p>
                <DataTable 
                    :value="sameDescriptionTransactions"
                    v-model:selection="selectedDescriptionTransactions"
                    data-key="id"
                >
                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="transactionDate" header="Date"></Column>
                    <Column field="description" header="Description"></Column>
                    <Column field="amount" header="Montant"></Column>
                </DataTable>
                <div class="flex gap-2 mt-4 justify-content-end">
                    <Button 
                        label="Oui" 
                        icon="pi pi-check" 
                        iconPos="left"
                        severity="success"
                        @click="() => resolveMultipleTransactions(true)"
                    />
                    <Button 
                        label="Non" 
                        icon="pi pi-times" 
                        iconPos="left"
                        severity="danger"
                        @click="() => resolveMultipleTransactions(false)"
                    />
                </div>
            </div>
        </Dialog>
    </div>
</template>

<style scoped>
    .layout {
        display: grid;
        place-items: center;
        gap: 1rem;
    }

    .chart-layout {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
        width: 100%;
    }

    .p-select,
    .p-inputtext {
        height: 40px;
    }


</style>
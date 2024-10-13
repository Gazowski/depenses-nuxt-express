  <script setup lang="ts">
    import { useComptesStore } from '~/stores/comptes'
    
    const comptesStore = useComptesStore()
    const dialogueAjoutCompteVisible = ref(false)
    const nouveauCompte = ref({ nom: '', solde: 0 })
    
    onMounted(async () => {
        await comptesStore.fetchComptes()
    })
    
    const rafraichirComptes = async () => {
        await comptesStore.fetchComptes()
    }
    
    const afficherDialogueAjoutCompte = () => {
        dialogueAjoutCompteVisible.value = true
        nouveauCompte.value = { nom: '', solde: 0 }
    }
    
    const ajouterNouveauCompte = async () => {
        await comptesStore.ajouterCompte(nouveauCompte.value)
        dialogueAjoutCompteVisible.value = false
    }
    
    const formatMontant = (montant: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(montant)
    }
</script>

<template>
    <div class="p-4">
      <h1 class="text-3xl font-bold mb-4">Suivi des Comptes Bancaires</h1>
      <p class="mb-4">Bienvenue dans votre application de suivi des comptes bancaires.</p>
      <div class="flex space-x-2 mb-4">
        <Button label="Rafraîchir les comptes" icon="pi pi-refresh" @click="rafraichirComptes" />
        <Button label="Ajouter un compte" icon="pi pi-plus" severity="success" @click="afficherDialogueAjoutCompte" />
      </div>
      <div class="mb-4">
        <h2 class="text-xl font-semibold mb-2">Solde total : {{ formatMontant(comptesStore.soldeTotal) }}</h2>
        <p>Nombre de comptes : {{ comptesStore.nombreDeComptes }}</p>
      </div>
      <div v-if="comptesStore.comptes?.length > 0">
        <h2 class="text-xl font-semibold mb-2">Liste des comptes</h2>
        <ul>
          <li v-for="compte in comptesStore.comptes" :key="compte.id" class="mb-2">
            {{ compte.nom }} - {{ formatMontant(compte.solde) }}
          </li>
        </ul>
      </div>
      <div v-else>
        <p>Aucun compte enregistré pour le moment.</p>
      </div>
  
      <!-- Dialog pour ajouter un compte -->
      <Dialog v-model:visible="dialogueAjoutCompteVisible" header="Ajouter un compte" :style="{ width: '30vw' }">
        <div class="flex flex-column gap-2">
          <InputText v-model="nouveauCompte.nom" placeholder="Nom du compte" />
          <InputNumber v-model="nouveauCompte.solde" mode="currency" currency="EUR" locale="fr-FR" placeholder="Solde initial" />
        </div>
        <template #footer>
          <Button label="Annuler" icon="pi pi-times" @click="dialogueAjoutCompteVisible = false" class="p-button-text" />
          <Button label="Ajouter" icon="pi pi-check" @click="ajouterNouveauCompte" autofocus />
        </template>
      </Dialog>
    </div>
  </template>

<style>
    body {
      font-family: Montserrat, sans-serif;
    }
</style>
  

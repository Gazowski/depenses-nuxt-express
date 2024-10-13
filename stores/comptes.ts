import { defineStore } from 'pinia'
import { useApi } from '~/server/useApi'

interface Compte {
  id: number;
  nom: string;
  solde: number;
}

export const useComptesStore = defineStore('comptes', {
  state: () => ({
    comptes: [] as Compte[],
    soldeTotal: 0,
  }),
  actions: {
    async fetchComptes() {
      const api = useApi()
      try {
        this.comptes = await api.getComptes()
        this.calculerSoldeTotal()
      } catch (error) {
        console.error('Erreur lors de la récupération des comptes:', error)
      }
    },
    async ajouterCompte(compte: { nom: string; solde: number }) {
      const api = useApi()
      try {
        const nouveauCompte = await api.addCompte(compte)
        console.log(this.comptes)
        this.comptes.push(nouveauCompte)
        this.calculerSoldeTotal()
      } catch (error) {
        console.error('Erreur lors de l\'ajout d\'un compte:', error)
      }
    },
    calculerSoldeTotal() {
      console.log('Calcul du solde total')
      // this.soldeTotal = this.comptes.reduce((total, compte) => total + compte.solde, 0)
    },
  },
  getters: {
    // nombreDeComptes: (state) => state.comptes.length,
    nombreDeComptes: (state) => 222222,
  },
})
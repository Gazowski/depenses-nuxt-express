import { useTransactionsStore } from "../stores/transactions";
import { useCategoryStore } from "../stores/category";
import { getMonthNumber, monthsList } from "./useMonth";

export function useTransactionsByCategoryMonth() {
    const transactionStore = useTransactionsStore()
    const categoryStore = useCategoryStore()


    /**
     * function : transactionsByCategoryAndMonth
     * description : This function is used to group transactions by category for month of the year passed in parameter.
     * it will also sum the total amount of transactions for each category and store it in totalAmountByCategory array.
     * @param : month(string) - month of the transaction
     * @param : year(string) - year of the transaction
     * return : result, object of transactions grouped by category.
     */
    
    const transactionsByCategoryAndMonth = (monthName:string, year:string):TransactionsByCategoryAndMonth => {
        const result: Record<number, Transaction[]> = {}
        const transactions = transactionStore.transactions[year as any] || []
        const month = getMonthNumber(monthName)

        categoryStore.categories.forEach(category => {
          result[category.id as any] = []
        })
        
        transactions.forEach(transaction => {
          const categoryId = transaction.category.id
          const transactionDate = new Date(transaction.transactionDate)
          // ajouter 1 heure pour corriger le decalage horaire
          transactionDate.setHours(24)

          if(transactionDate.getMonth() + 1 === month){
            const monthIndex = transactionDate.getMonth()
            const month = monthsList[monthIndex]
            
            if (!result[categoryId as any]) {
              result[categoryId as any] = []
            }
            result[categoryId as any].push(transaction)

            // add total amount of transaction for each category
            categoryStore.addAmountToCategory (categoryId, year, monthName, transaction.amount)
          }

        })
        
        return result as {};
    }


    
  
  
    const sortedMonths = computed(() => {
      // const months = new Set<string>()
      // Object.values(transactionsByCategoryAndMonth.value).forEach(categoryTransactions => {
      //   Object.keys(categoryTransactions).forEach(month => months.add(month))
      // })
      // return Array.from(months).sort().reverse()
    })
  
    return {
      transactionsByCategoryAndMonth,
      sortedMonths
    }
}
const locale = 'fr-FR';
const formatter = new Intl.DateTimeFormat(locale, { month: 'long' })

export const monthsList = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2000, i, 1)
    return formatter.format(date)
})

/**
 * function to get the number of the month from the month name
 * @param month (string) - month in long format in french
 * @returns month in number format
 */

export const getMonthNumber = (monthName: string) => {
    const normalizedName = monthName.toLowerCase()
    const index = monthsList.findIndex(month => month.toLowerCase() === normalizedName)
    return index !== -1 ? index + 1 : null
}

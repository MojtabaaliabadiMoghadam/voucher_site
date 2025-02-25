import { defineStore } from 'pinia'
export const useDataGlobal = defineStore('data', () => {
    const test = ref([])
    return {
        test
    }
})
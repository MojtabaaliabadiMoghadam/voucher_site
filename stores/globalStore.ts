import { defineStore } from 'pinia'
export const useDataGlobal = defineStore('data', () => {
    const categories = ref([
        {src:'images/category_1.webp',alt:'category_1',title:"category 1",slug:1,price:'20$'},
        {src:'images/category_2.webp',alt:'category_2',title:"category 2",slug:2,price:'20$'},
        {src:'images/category_3.webp',alt:'category_3',title:"category 3",slug:3,price:'20$'},
        {src:'images/category_4.webp',alt:'category_4',title:"category 4",slug:4,price:'20$'},
        {src:'images/category_2.webp',alt:'category_1',title:"category 1",slug:5,price:'20$'},
        {src:'images/category_1.webp',alt:'category_2',title:"category 2",slug:6,price:'20$'}
    ])
    return {
        categories
    }
})
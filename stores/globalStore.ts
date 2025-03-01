import { defineStore } from 'pinia'
import { faker } from "@faker-js/faker";
export const useDataGlobal = defineStore('data', () => {
    const categories = ref([
        {src:'/images/category_1.webp',alt:'category_1',title:"category 1",slug:1,price:'20$'},
        {src:'/images/category_2.webp',alt:'category_2',title:"category 2",slug:2,price:'20$'},
        {src:'/images/category_3.webp',alt:'category_3',title:"category 3",slug:3,price:'20$'},
        {src:'/images/category_4.webp',alt:'category_4',title:"category 4",slug:4,price:'20$'},
        {src:'/images/category_2.webp',alt:'category_1',title:"category 1",slug:5,price:'20$'},
        {src:'/images/category_1.webp',alt:'category_2',title:"category 2",slug:6,price:'20$'}
    ])
    const products = ref([])
    function generateProducts(count: number) {
        products.value = Array.from({ length: count }, () => ({
            name: faker.commerce.productName(),
            databaseId: faker.number.int({ min: 1000, max: 9999 }),
            price: faker.commerce.price(),
            regularPrice: faker.commerce.price(),
            salePrice: faker.commerce.price(),
            slug: faker.commerce.id(),
            stockQuantity: faker.number.int({ min: 0, max: 100 }),
            stockStatus: faker.helpers.arrayElement(["IN_STOCK", "OUT_OF_STOCK"]),
            hasAttributes: faker.datatype.boolean(),
            image: { url: faker.image.url(), alt: faker.lorem.words(3) },
            attributes: { nodes: [] },
            node: null,
        }));
    }
    return {
        categories,
        generateProducts,
        products
    }
})
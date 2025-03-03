
import { defineStore } from "pinia";
import { faker } from "@faker-js/faker";
import { useRoute, useRouter } from "vue-router";

export const useDataGlobal = defineStore("data", () => {
    const route = useRoute();
    const router = useRouter();

    const products = ref<any[]>([]);
    const lock = ref(true);

    // مقدار فیلترها
    const priceFilter = ref({ min: 0, max: 1000 });
    const categoryFilter = ref<string | null>(null);
    const orderby = ref<string>("date");
    const order = ref<"ASC" | "DESC">("DESC");

    function generateProducts(count: number) {
        if (!lock.value) return null;
        products.value = Array.from({ length: count }, () => ({
            name: faker.commerce.productName(),
            databaseId: faker.number.int({ min: 1000, max: 9999 }),
            price: parseFloat(faker.commerce.price({ min: 0, max: 1000 })),
            slug: faker.lorem.slug(),
            rating: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
            discount: faker.number.int({ min: 0, max: 50 }),
            category: faker.helpers.arrayElement(["لباس", "کفش", "لوازم الکترونیک", "کتاب"]),
            stockQuantity: faker.number.int({ min: 0, max: 100 }),
            stockStatus: faker.helpers.arrayElement(["IN_STOCK", "OUT_OF_STOCK"]),
            src: faker.image.url(),
            date: faker.date.past(),
        }));
        lock.value = false;
    }

    // فیلتر و مرتب‌سازی ترکیبی محصولات
    const filteredProducts = computed(() => {
        let result = products.value.filter(
            (product: any) =>
                product.price >= priceFilter.value.min &&
                product.price <= priceFilter.value.max
        );

        // مرتب‌سازی بر اساس نوع orderby و order
        if (orderby.value === "price") {
            result = result.sort((a, b) =>
                order.value === "ASC" ? a.price - b.price : b.price - a.price
            );
        } else if (orderby.value === "alphabetically") {
            result = result.sort((a, b) =>
                order.value === "ASC" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
            );
        } else if (orderby.value === "date") {
            // اگر نیاز به مرتب‌سازی بر اساس تاریخ دارید
            result = result.sort((a, b) =>
                order.value === "ASC" ? a.databaseId - b.databaseId : b.databaseId - a.databaseId
            );
        }

        return result;
    });

    // خواندن مقدار فیلترها از URL
    function setFiltersFromQuery() {
        priceFilter.value = { min: Number(route.query.minPrice) || 0, max: Number(route.query.maxPrice) || 1000 };
        categoryFilter.value = (route.query.category as string) || null;
        orderby.value = (route.query.orderby as string) || "date";
        order.value = (route.query.order as "ASC" | "DESC") || "DESC";
    }

    function setPriceFilter([min, max]: number[]) {
        priceFilter.value = { min, max };
        updateQuery();
    }

    // به‌روزرسانی کوئری هنگام تغییر دسته‌بندی
    function setCategoryFilter(category: string | null) {
        categoryFilter.value = category;
        updateQuery();
    }


    function setOrderBy(value: string) {
        orderby.value = value;
        updateQuery();
    }

    function toggleOrder() {
        order.value = order.value === "ASC" ? "DESC" : "ASC";
        updateQuery();
    }

    function updateQuery() {
        router.push({
            query: {
                minPrice: priceFilter.value.min || undefined,
                maxPrice: priceFilter.value.max || undefined,
                category: categoryFilter.value || undefined,
                orderby: orderby.value || undefined,
                order: order.value || undefined,
            },
        });
    }

    return {
        products,
        generateProducts,
        priceFilter,
        categoryFilter,
        orderby,
        order,
        filteredProducts,
        setFiltersFromQuery,
        setOrderBy,
        toggleOrder,
        setPriceFilter,
        setCategoryFilter
    };
});


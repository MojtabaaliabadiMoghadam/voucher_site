import {defineStore} from "pinia";

export const useLoginStore = defineStore("login", () => {
    const loginStatus = ref<'mobile'|'email'>('mobile')

    return {
        loginStatus
    };
})
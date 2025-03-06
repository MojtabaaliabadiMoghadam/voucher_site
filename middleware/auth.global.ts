import { defineNuxtRouteMiddleware, useCookie } from '#app'
import { useLoginStore } from '~/stores/loginStore'

export default defineNuxtRouteMiddleware((to, from) => {
    const token = useCookie('login_secret')
    const loginStore = useLoginStore()

    if (token.value) {
        loginStore.loginStatus = 'login-otp'
    }

})
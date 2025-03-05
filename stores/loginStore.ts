import { defineStore } from "pinia";
import { useCookie } from "#app";

export const useLoginStore = defineStore("login", () => {
    const loginStatus = ref<'login' | 'login-otp' | 'login-password'>('login')
    const loginWith = ref<'mobile' | 'email'>('mobile')
    const mobile = ref<string>('09158283028')
    const email = ref<string>('')
    const { getUrl, fetchData ,showSuccessToast,showErrorToast} = useHelpers()

    // ذخیره secret در کوکی (با زمان انقضا 5 دقیقه)
    const secret = useCookie<string | null>("login_secret", { maxAge: 300 })

    // مدیریت OTP
    const otpTimer = ref<number>(0)
    const otpTryCount = ref<number>(0)
    const maxTry = ref<number>(5)

    async function RequestForm() {
        let url = getUrl('auth/request')
        const requestData: Record<string, any> = {
            type: loginWith.value,
        }
        if (loginWith.value === 'mobile' && mobile.value) {
            requestData.mobile = mobile.value
            requestData.mobile_prefix = "+98"
        } else if (email.value) {
            requestData.email = email.value
        }
        const { status, message, data } = await fetchData({ method: 'POST', url, data: requestData })
        if (status == 200) {
            showSuccessToast(message)
            if (data.secret) {
                secret.value = data.secret // ذخیره secret در کوکی
            }

            if (data.type === 'login-otp') {
                otpTimer.value = data?.code?.timer
                otpTryCount.value = data?.code?.try_count
                maxTry.value = data?.code?.max_try
                loginStatus.value = 'login-otp'
            } else {
                loginStatus.value = 'login-password'
            }
        } else {
            showErrorToast(message)
        }
    }

    async function resendOTP() {
        if (otpTryCount.value >= maxTry.value) {
            alert('You have reached the maximum retry limit!')
            return
        }

        try {
            let url = getUrl('auth/resend-otp')
            const response = await fetchData({
                method: 'POST',
                url,
                data: { secret: secret.value }
            })

            if (response.status === 'success') {
                otpTimer.value = response.data.code.timer
                otpTryCount.value = response.data.code.try_count
            } else {
                errorMessage.value = response.message
            }
        } catch (error) {
            console.error('Resend OTP failed', error)
        }
    }

    async function verifyOTP(otp: string) {
        try {
            let url = getUrl('auth/verify-otp')
            const response = await fetchData({
                method: 'POST',
                url,
                data: { otp, secret: secret.value }
            })

            if (response.status === 'success' && response.data.token) {
                const token = useCookie<string | null>("auth_token", { maxAge: 60 * 60 * 24 * 7 }) // 7 روز ذخیره
                token.value = response.data.token
                secret.value = null // حذف secret
                return navigateTo('/dashboard')
            } else {
                errorMessage.value = response.message
            }
        } catch (error) {
            console.error('Invalid OTP', error)
        }
    }

    async function loginWithPassword(password: string) {
        try {
            let url = getUrl('auth/login-password')
            const response = await fetchData({
                method: 'POST',
                url,
                data: { password, secret: secret.value }
            })

            if (response.status === 'success' && response.data.token) {
                const token = useCookie<string | null>("auth_token", { maxAge: 60 * 60 * 24 * 7 })
                token.value = response.data.token
                secret.value = null
                return navigateTo('/dashboard')
            } else {
                errorMessage.value = response.message
            }
        } catch (error) {
            console.error('Login failed', error)
        }
    }

    return {
        mobile,
        email,
        loginStatus,
        RequestForm,
        loginWith,
        resendOTP,
        otpTimer,
        otpTryCount,
        verifyOTP,
        loginWithPassword
    }
})

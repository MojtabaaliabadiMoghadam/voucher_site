import { defineStore } from "pinia";
import { useCookie } from "#app";
export interface IUser {
    id: number;
    name: string | null;
    email: string | null;
    email_verified_at: string | null;
    mobile: string;
    mobile_prefix: string;
    mobile_verified_at: string | null;
    code_melli: string | null;
    birthday: string | null;
    gender: string | null;
    avatar_id: number | null;
    created_at: string;
    deleted_at: string | null;
}

export const useDataUserStore = defineStore("user", () => {
    const { getUrl, fetchData ,showSuccessToast,showErrorToast} = useHelpers()

    const dataUser = ref<IUser>()

    async function getUserData() {
        try {
            let url = getUrl('auth/me')
            const {status,data,message} = await fetchData({
                method: 'GET',
                url,
                authorization:true
            })

            if (status == 200) {
                dataUser.value = data
            } else {
                showErrorToast(message)
            }
        } catch (error) {
            showErrorToast(error)
        }
    }
    return {
        getUserData,
        dataUser
    }
})

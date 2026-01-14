import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import apiClient from "@/utils/axiosConf";

export const useGoogleAdsStore = defineStore('googleads',()=>{

    let customer_list = ref([])
    const provider = ref("google")

    return{
        customer_list,
        provider
    }
    
})
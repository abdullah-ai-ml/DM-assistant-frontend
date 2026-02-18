import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import apiClient from "@/utils/axiosConf";

export const useGoogleAdsStore = defineStore('googleads', () => {

    let error_messaging = ref("")
    let customer_details = ref([])
    let campaigns = ref([])
    let manager_id = ref("")
    let selectedCustomer = ref("")

    async function handleGetCustomers() {
        const is_google_connection = localStorage.getItem('google_connection')

        if (!is_google_connection) {
            error_messaging.value = "Please connect your Google account"
            return
        }

        try {
            const response = await apiClient.get('/google/list_customers')

            if (!response.data.ok) {
                error_messaging.value = "You Have To create a Customer first to manage their campaigns"
                customer_details.value = []

            } else {
                customer_details.value = response.data.clients || []
                manager_id.value = response.data.manager_id
            }

        } catch (error) {
            console.error("Something went wrong fetching Google customers:", error)
            error_messaging.value = "Failed to fetch Google customers. Try again later."
            customer_details.value = []
        }
    }



    async function handleGetCampaign() {
        try {
            const request_body = JSON.stringify({ customer_id: selectedCustomer.value, manager_id: manager_id.value })
            const response = await apiClient.post('/google/list_campaigns', request_body)
            if (!response.data.ok) {
                error_messaging.value = "Failed to fetch Google campaings. Try again later."
                return;
            }
            campaigns.value = response.data.campaigns || []

            if (!campaigns.value.length) {
                error_messaging.value = "Please create campaigns to get started."
            } else {
                error_messaging.value = ""  // clear any previous message
            }

        } catch (error) {
            console.error("Something went wrong fetching Google customers:", error)
            error_messaging.value = "Failed to fetch Google campaings. Try again later."
            campaigns.value = []
        }
    }

    return {

        error_messaging,
        customer_details,
        campaigns,
        selectedCustomer,
        handleGetCustomers,
        handleGetCampaign
    }

})
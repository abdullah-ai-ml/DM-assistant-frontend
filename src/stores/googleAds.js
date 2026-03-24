import { defineStore } from "pinia";
import apiClient from "@/utils/axiosConf";
import router from "@/router";
export const useGoogleAdsStore = defineStore('googleads', {
    state: () => ({
        error_messaging: "",
        customersLoading: false,
        campaignsLoading: false,
        customer_details: [],
        campaigns: [],
        manager_id: "",
        selectedCustomer: "",
        insights: {}
    }),

    actions: {
        async handleGetCustomers() {
            const is_google_connection = localStorage.getItem('google_connection');

            if (!is_google_connection) {
                this.error_messaging = "Please connect your Google account";
                return;
            }

            this.customersLoading = true;
            try {
                const response = await apiClient.get('/google/list_customers');

                if(response.data.google_auth_required){
                    this.error_messaging = "Please make sure the Google Ads Manager Account is connected"
                }
                else if(!response.data.ok) {
                    this.error_messaging = "There Are No Customer Found To Manage Campaings";
                    this.customer_details = [];
                } else {
                    this.customer_details = response.data.clients || [];
                    this.manager_id = response.data.manager_id;
                }
            } catch (error) {
                console.error("Something went wrong fetching Google customers:", error);
                this.error_messaging = "Failed to fetch Google customers. Try again later.";
                this.customer_details = [];
            } finally {
                this.customersLoading = false;
            }
        },

        async handleGetCampaign() {
            if (!this.selectedCustomer) return;
            this.campaignsLoading = true;
            try {
                const request_body = { 
                    customer_id: this.selectedCustomer, 
                    manager_id: this.manager_id 
                };
                
                const response = await apiClient.post('/google/list_campaigns', request_body);
                
                if (!response.data.ok) {
                    this.error_messaging = "Failed to fetch Google campaings. Try again later.";
                    return;
                }

                this.campaigns = response.data.campaigns || [];

                if (!this.campaigns.length) {
                    this.error_messaging = "Please create campaigns to get started.";
                } else {
                    this.error_messaging = "";
                }
            } catch (error) {
                console.error("Something went wrong fetching Google campaigns:", error);
                this.error_messaging = "Failed to fetch Google campaings. Try again later.";
                this.campaigns = [];
            } finally {
                this.campaignsLoading = false;
            }
        }
    }
});
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import apiClient from "@/utils/axiosConf";

export const useConnectionStore = defineStore('connections',()=>{
    let isConnected = ref(false)
    

    const connections = ref([
        {
            name: "Google Ads",
            description: "Connect your Google Ads account to manage campaigns",
            status: "disconnected",
            provider:'google',
            lastSync: "2 hours ago",
            customer_account:[]
        },
        {
            name: "Meta (Facebook)",
            description:
            "Connect your Meta Business account for Facebook & Instagram ads",
            status: "disconnected",
            provider:'meta',
            lastSync: "Never",
        },
    ]);
    async function handleConnection(connection) {
        const token = localStorage.getItem("token");
        const endpoint = connection.provider === "google" ? "/authorize_google" : "/authorize_meta";

        
        const response = await apiClient.get(endpoint, {
            headers: { Authorization: `Bearer ${token.trim()}` }
        });
                
        
        if (response.data?.redirect_url) {
            window.location.href = response.data.redirect_url;
        }
    }

    function toggleGoogleConnection(){
        isConnected.value = !isConnected.value
    }



    return{
        connections,
        handleConnection
    }
})
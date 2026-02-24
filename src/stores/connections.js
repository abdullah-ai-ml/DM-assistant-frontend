import { defineStore } from "pinia";
import apiClient from "@/utils/axiosConf";
import router from "@/router";

export const useConnectionStore = defineStore('connections', {
    state: () => ({
        isConnected: false,
        connections: [
            {
                name: "Google Ads",
                description: "Connect your Google Ads account to manage campaigns",
                status: "disconnected",
                provider: 'google',
                lastSync: "2 hours ago",
                customer_account: []
            },
            {
                name: "Meta (Facebook)",
                description: "Connect your Meta Business account for Facebook & Instagram ads",
                status: "disconnected",
                provider: 'meta',
                lastSync: "Never",
            },
        ]
    }),

    actions: {
        async handleConnection(connection) {
            const token = localStorage.getItem("token");
            const endpoint = connection.provider === "google" ? "/authorize_google" : "/authorize_meta";

            if(!token){
                router.push("/login")
            }
            const response = await apiClient.get(endpoint, {
                headers: { Authorization: `Bearer ${token?.trim()}` }
            });

            if (response.data?.redirect_url) {
                window.location.href = response.data.redirect_url;
            }
        },

        toggleGoogleConnection() {
            this.isConnected = !this.isConnected;
        }
    }
});
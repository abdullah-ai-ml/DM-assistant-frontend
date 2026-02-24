import { defineStore } from "pinia";
import apiClient from "@/utils/axiosConf";
import router from "@/router";

export const useAuthStore = defineStore("auth", {
    
    state: () => ({
        email: "",
        isLogin: false,
        token: "",
        loading: false,
        message: null,
        google_connection: localStorage.getItem("google_connection") === "true"
    }),

  
    actions: {
        async registerUser(userData) {
            this.loading = true;
            try {
                let response = await fetch("http://127.0.0.1:5000/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData)
                });
                let data = await response.json();
                
                if (!data.ok) {
                    this.message = data.message;
                    return;
                }
                this.message = data.message;
                localStorage.setItem("email", userData.email);
                router.push('/verify'); // Pinia has access to router if setup correctly
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async loginUser(userData) {
            this.loading = true;
            try {
                const response = await fetch("http://127.0.0.1:5000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData),
                });

                const data = await response.json();
                if (!data.ok) {
                    this.message = data.message;
                    return false;
                }

                localStorage.setItem("token", data.token);
                localStorage.setItem("email", userData.email);
                localStorage.setItem("google_connection", data.google_connection);
                
                this.isLogin = true;
                this.message = data.message;
                
                router.push('/dashboard');
            } catch (err) {
                console.error("Fetch error during login:", err);
                return false;
            } finally {
                this.loading = false;
            }
        },

        async logoutUser() {
            try {
                await apiClient.post("/logout");
            } catch (error) {
                console.error("Logout API failed, clearing local state anyway", error);
            } finally {
                this.$reset(); 
                localStorage.removeItem('token');
                localStorage.removeItem('google_connection');
                router.push('/login');
            }
        },

        async verifyToken(token) {
            this.loading = true;
            try {
                const response = await apiClient.post('/isvalid-token')
                const data = await response.json();
                return !!data.ok;
            } catch (error) {
                return false;
            } finally {
                this.loading = false;
            }
        },

    
        async forgetpassword(email) {
            const response = await fetch('http://127.0.0.1:5000/forget-email-send', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            this.message = data.message;
        }
    }
});
import { ref } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import apiClient from "@/utils/axiosConf";


export const useAuthStore = defineStore("auth", () => {

    const router = useRouter();

    let email = ref("");
    let isLogin = ref(false);
    let token = ref("");
    let loading = ref(false);
    let message = ref(null);

    async function registerUser(userData) {
        loading.value = true;
        try {
            let response = await fetch("http://127.0.0.1:5000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            })
            let data = await response.json();
            
            if (!data.ok) {
                message.value = data.message;
                loading.value = false;
               
                return;
            }
            message.value = data.message;
            loading.value = false
            localStorage.setItem("email", userData.email);
            router.push('/verify');
            
        } catch (error) {
            throw error;
        }

    }
    async function loginUser(userData) {
        loading.value = true;
        
        console.log("Attempting login with:", userData); // ✅ log input data

        try {
            const response = await fetch("http://127.0.0.1:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();
            console.log("Login response:", data);

            if (!data.ok) {
                message.value = data.message;
                console.log("Login failed:", message.value); // ✅ log failure reason
                return false;
            }

            localStorage.setItem("token", data.token);
            isLogin.value = true;
            localStorage.setItem("email", userData.email);
            message.value = data.message;
            loading.value = false;
            localStorage.setItem("google_connection", data.google_connection)


            router.push('/dashboard')
            return;

        } catch (err) {
            console.error("Fetch error during login:", err);
        
            return false; // ✅ return false here
        } finally {
            loading.value = false; // ✅ always reset loading
        }
    }

    async function logoutUser(){
       try {
            const response = await apiClient.post("/logout")
            if(!response.data.ok){
                alert("logout failed")
                return;
            }
       } catch (error) {
            alert(error)
       } finally{
            localStorage.removeItem('token')
            router.push('/login')
       }
    }

    async function resendVerificationEmail(email) {

        loading.value = true;
        try {
            const response = await fetch("http://127.0.0.1:5000/resend-verification",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email: email}),

            })
            const data = await response.json();
            if(!data.ok){
                message.value = data.message;
                loading.value = false;
                return;
            }
            message.value = data.message;
            loading.value = false;
        } catch (error) {
            
        }

    }

    async function forgetpassword(email){
        const response = await fetch('http://127.0.0.1:5000/forget-email-send',{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email: email}),
        });
        const data = await response.json();
        if(!data.ok){
            message.value = data.message;
            return;
        }
        message.value = data.message;
    
    }

    async function verifyToken(token){
        loading.value = true;
        try {
            const response = await fetch('http://127.0.0.1:5000/isvalid-token',{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            })
            const data = await response.json();
            if(!data.ok){
                loading.value = false;
                router.push('/login');
                return;
            }
        } catch (error) {
            throw error;
        }
    }
    

    async function changePassword(password, token){
        loading.value = true;
        try {
            const response = await fetch('http://127.0.0.1:5000/change-password',{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({password: password, token: token}),
            })
            const data = await response.json();
            if(!data.ok){
                message.value = data.message;
                loading.value = false;
                router.push('/login');
                return;
            }
        }
        catch (error) {
            throw error;
        }
    }
    function getAccessToken(){
        return localStorage.getItem("token") ?? ""
    }


    return {
        isLogin,
        loading,
       message,
        registerUser,
        loginUser,
        logoutUser,
        resendVerificationEmail,
        forgetpassword,
        verifyToken,
        changePassword,
        getAccessToken
    }
})
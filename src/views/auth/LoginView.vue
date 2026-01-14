<script setup>
import { Email, PasswordLock } from '@/components/icons/exportIcons';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { ref, onMounted } from 'vue';



let email = ref('');
let password = ref('');

const authStore = useAuthStore();

let { loginUser } = authStore;

let {message, loading} = storeToRefs(authStore);



const handleSubmit = async ()=>{

    await loginUser({email: email.value, password: password.value });
}

// let errorMessage = ref(null);
// let loading = ref(false)

// async function loginUser() {
//     const userData = {
//         email: email.value,
//         password: password.value,
//     };
//     loading.value = true;
//     errorMessage.value = null;
//     console.log("Attempting login with:", userData); // ✅ log input data

//     try {
//         const response = await fetch("http://127.0.0.1:5000/login", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(userData),
//         });

//         const data = await response.json();
//         console.log("Login response:", data);

//         if (!data.ok) {
//             errorMessage.value = data.message;
//             return false;
//         }

//         localStorage.setItem("token", data.token);
//         isLogin.value = true;
//         return true;

//     } catch (err) {
//         console.error("Fetch error during login:", err);
//         errorMessage.value = "Unexpected error occurred.";
//         return false; // ✅ return false here
//     } finally {
//         loading.value = false; // ✅ always reset loading
//     }
// }



</script>
<template>
    <section
        class="grid grid-cols-2 max-[1000px]:grid-cols-1 h-screen overflow-hidden bg-primary-background font-lexands">
        <RouterLink to="/" class="absolute hover:underline top-4 left-4 flex items-center gap-2 mb-10 ">
            Back
        </RouterLink>
        <div class="max-w-[450px] mx-auto py-3 flex flex-col justify-center">
            <!-- <div class="logo flex items-center gap-2 mb-10 ">
                <img src="@/assets/logo.svg" alt="" class="h-30 w-30">
                <span class="text-primary-500 text-primary font-bold">AdVisor</span>
            </div> -->
            <div class="max-md:px-3">
                <div class="mb-10 flex flex-col gap-6 max-w-150">
                    <h2 class="font-semibold text-primary text-primary-500">Welcome Back!</h2>
                    <p class="text-base text-body ftext-slate-500">Sign in to access your dashboard and manage campaigns
                        effortlessly with a single clicks.</p>
                </div>
                <div>
                    <form @submit.prevent="handleSubmit" class="flex flex-col gap-6  ">
                        <span class="text-red-600 text-center"> {{ message }} </span>
                        <div class="flex flex-col gap-2">
                            <label for="email" class="text-labels text-label">Email</label>
                            <div class="flex items-center border border-[#BEC3D0] rounded-xl">
                                <span class="px-3">
                                    <Email />
                                </span>
                                <input class="w-full p-3 outline-none" v-model="email" type="email" id="email"
                                    placeholder="Enter your email" required></input>
                            </div>
                        </div>
                        <div>
                            <label for="password" class="text-labels text-label">Password</label>
                            <div class="flex items-center border border-[#BEC3D0] rounded-xl">
                                <span class="px-3">
                                    <PasswordLock />
                                </span>
                                <input class="w-full p-3 outline-none" v-model="password" type="password" id="password"
                                    placeholder="Enter your password" required>
                            </div>
                        </div>
                        <div class="flex justify-between text-sm">
                            <RouterLink to="/signup" class="text-zinc-600 hover:underline mr-3">Create an account?
                            </RouterLink>

                            <RouterLink to="/forget-password" class="text-zinc-600 hover:underline">Forgot Password?
                            </RouterLink>
                        </div>
                        <div>
                            <button :disabled="loading" :class="['py-3 w-full hover:bg-zinc-700 cursor-pointer text-white  rounded bg-black transition ease-in',
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            ]" type="submit">{{ loading ? 'Signing In' : 'Sign In' }}</button>
                        </div>
                        <div class="h-[1px] w-full rounded bg-zinc-700 relative">
                            <span
                                class="absolute left-[50%] -translate-x-[50%] -translate-y-[50%] bg-primary-background font-medium">or</span>
                        </div>
                        <!-- <div class="flex justify-center" >
                            <div id="g_id_onload"
                                data-client_id="512258087509-e4qbja92t1o0g5gpkja5v315b4t1gg5l.apps.googleusercontent.com"
                                data-context="signin" data-ux_mode="popup" data-callback="handleGoogleOAuth"
                                data-auto_select="true" data-itp_support="true">
                            </div>

                            <div class="g_id_signin" data-type="standard" data-shape="rectangular"
                                data-theme="filled_black" data-text="signin_with" data-size="large" 
                                data-logo_alignment="center">
                            </div>
                        </div> -->
                    </form>

                </div>

            </div>
        </div>
        <div class="bg-[#E7F2EF] max-[1000px]:hidden h-full w-full">
            <img class="h-full w-full object-fit" src="@/assets/login.png" alt="login page side picture">
        </div>
    </section>
</template>

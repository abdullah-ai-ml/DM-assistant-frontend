<script setup>
import { Email, PasswordKye, PasswordLock } from '@/components/icons/exportIcons';
// import { useAuthStore } from '@/stores/authStore';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';


const router = useRouter();
let email = ref('');
let password = ref('');
let confirmPassword = ref('');

let error_confirm_password = ref('');
// let loading = ref(false);
// let error = ref(null);


// async function registerUser() {
//     const userData = {
//         email: email.value,
//         password: password.value,
//     };
//     if(password.value !== confirmPassword.value) {
//         error_confirm_password.value = "Passwords do not match";
//         return;
//     } else {
//         error_confirm_password.value = "";
//     }

//     loading.value = true;
//     error.value = null;
//     try {
//         const response = await fetch("http://127.0.0.1:5000/register", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(userData)
//         });
        
//         if (!response.ok) {
//             // Server responded with an HTTP error status (like 400, 500)
//             const errorData = await response.json();
            
//             error.value = errorData.message || "Registration failed";
//             return false;  // indicate failure
//         }

//         const data = await response.json();

        

//         //registration succesfull
//         router.push('/verify')
        

//     } catch (err) {
//         error.value = "Network or server error occurred";
//         console.error("Registration error:", err);
//         return false;
//     } finally {
//         loading.value = false;  // Always reset loading state
//     }
// }





let authSerive = useAuthStore();

let { registerUser } = authSerive;

let {message, loading} = storeToRefs(authSerive);

onMounted(()=>{
    // window.handleGoogleOAuth = handleGoogleOAuth;
    message.value = "";
})  



const handleSubmit = async ()=>{
    if(password.value !== confirmPassword.value) {
        error_confirm_password.value = "Passwords do not match";
        return;
    } else {
        error_confirm_password.value = "";
    }
   await registerUser({email:email.value,password:password.value})
}


//todo singup code
</script>
<template>
    <section class="grid grid-cols-2 max-[1000px]:grid-cols-1 overflow-hidden h-screen bg-primary-background font-lexands">
        <RouterLink to="/" class="absolute hover:underline top-4 left-4 flex items-center gap-2 mb-10 ">
            Back
        </RouterLink>
        <div class="max-w-[450px] mx-auto flex flex-col justify-center pb-12">
            <!-- <div class="logo flex items-center gap-2 mb-10 ">
                <img src="@/assets/logo.svg" alt="" class="h-30 w-30">
                <span class="text-primary-500 text-primary font-bold">AdVisor</span>
            </div> -->
            <div class="max-md:px-3" >
                <div class="mb-10 flex flex-col gap-6 max-w-150">
                    <h2 class="font-semibold text-primary text-primary-500">New Here? <br> Let's Get Started!</h2>
                    <p class="text-base text-body ftext-slate-500">Sign up to launch and manage your campaigns with ease
                        — your dashboard is just a click away.</p>
                </div>
                <div>
                    <form @submit.prevent="handleSubmit" class="flex flex-col gap-6 ">
                        <span class="text-red-600 text-center font-medium uppercase" >{{ message }}</span>
                        <div class="input-box">
                            <label for="email" class="text-labels text-label ">Email</label>
                            <div class="flex items-center border border-[#BEC3D0] rounded mt-2">
                                <span class="px-3">
                                    <Email />
                                </span>
                                <input class="w-full p-3 outline-none" type="email" id="email"
                                    placeholder="Enter your email" v-model="email" required></input>
                            </div>
                        </div>
                        <div class="input-box">
                            <label for="password" class="text-labels text-label">Password</label>
                            <div class="flex items-center border border-[#BEC3D0] rounded mt-2">
                                <span class="px-3">
                                    <PasswordKye />
                                </span>
                                <input class="w-full p-3 outline-none" 
                                    type="password" 
                                    id="password"
                                    placeholder="Enter your password" 
                                    minlength="8" 
                                    pattern="(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}" 
                                    title="Password must contain at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long."
                                     v-model="password" 
                                    required>
                            </div>
                        </div>
                        <div class="input-box">
                            <label for="confim_password" class="text-labels text-label">Confirm Password</label>
                            <div class="flex items-center border border-[#BEC3D0] rounded mt-2">
                                <span class="px-3">
                                    <PasswordLock />
                                </span>
                                <input class="w-full p-3 outline-none" type="password" id="confirm_password"
                                    placeholder="Enter your password" v-model="confirmPassword" required>
                            </div>
                            <div v-if="error_confirm_password" class="text-red-500 mt-2 text-sm">
                                {{ error_confirm_password }}
                            </div>
                        </div>
                        <div class="text-right text-sm">

                            <RouterLink to="/login" class="text-zinc-600 hover:underline mr-3">Already have an account?
                            </RouterLink>

                        </div>
                        <div>
                            <button
                                :disabled="loading" :class="['py-3 w-full hover:bg-zinc-700 cursor-pointer text-white  rounded bg-black transition ease-in',
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                                ]" 
                                type="submit">{{ loading ? "Joining Now....." : "Join Now!" }}</button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
        <div class="bg-[#E7F2EF] max-[1000px]:hidden h-full">
            <img class="object-fit h-full w-full" src="@/assets/signup.png" alt="signup sid picture">
        </div>
    </section>
</template>

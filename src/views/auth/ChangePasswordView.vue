<script setup>
import { PasswordLock } from '@/components/icons/exportIcons';
import { useRoute , useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';


const route = useRoute();
const router = useRouter();
let authStore = useAuthStore();
const { changePassword, verifyToken } = authStore;
let { loading, message } = storeToRefs(authStore)


let password = ref('');
let confirm_password = ref('');



onMounted(async () => {
    
    const token = route.query.token || '';
    if(!token){
        router.push('/login');
    }
    
    await verifyToken(token);


});

const handleSubmit = async ()=>{
    
    if(password.value !== confirm_password.value){
        message.value = "Password and Confirm Password must be same";
        return;
    }
    await changePassword({password: password.value, token});
}



</script>


<template>
    <section class="flex justify-center items-center h-screen w-full bg-primary-background font-lexands">
        <form @submit.prevent="handleSubmit" class="max-w-[599px] mx-auto bg-white p-8 rounded-lg shadow-md">
            <RouterLink to="/login" class="text-sm hover:underline">Back</RouterLink>
            <h1 class="text-2xl font-bold py-8">
                Enter your new password
            </h1>
            <!-- <p>Enter your email, so that we can send link to recover your account.</p> -->
            <p class="text-red-400 capitalize" >{{ message }}</p>
            <div class="input-box mt-3">

                <div class="flex items-center border border-[#BEC3D0] rounded mt-2">
                    <span class="px-3">
                        <PasswordLock />
                    </span>
                    <input class="w-full  p-3 outline-none" type="password" id="pass" placeholder="Enter your email"
                        v-model="password" required></input>
                </div>
            </div>
            <div class="input-box mt-3">

                <div class="flex items-center border border-[#BEC3D0] rounded mt-2">
                    <span class="px-3">
                        <Email />
                    </span>
                    <input class="w-full  p-3 outline-none" type="password" id="pass" placeholder="Enter your email"
                        v-model="confirm_password" required></input>
                </div>
            </div>
            <div class="flex justify-end items-center py-4" >
                
                <button type="submit" :disabled="loading" class="bg-zinc-600 hover:bg-zinc-700 transition all px-5 py-2 rounded text-white cursor-pointer" >Send Email.</button>
            </div>
        </form>
    </section>
</template>

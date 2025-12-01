<template>
    <section class="flex justify-center items-center h-screen w-full bg-primary-background font-lexands">
        <form @submit.prevent="handleSubmit" class="max-w-[599px] mx-auto bg-white p-8 rounded-lg shadow-md">
            <RouterLink to="/login" class="text-sm hover:underline">Back</RouterLink>
            <h1 class="text-2xl font-bold py-8">
                Have You Forgotten Your Password?
            </h1>
            <p>Enter your email, so that we can send link to recover your account.</p>
            <p class="text-red-400 capitalize" >{{ message }}</p>
            <div class="input-box mt-3">

                <div class="flex items-center border border-[#BEC3D0] rounded mt-2">
                    <span class="px-3">
                        <Email />
                    </span>
                    <input class="w-full  p-3 outline-none" type="email" id="email" placeholder="Enter your email"
                        v-model="email" required></input>
                </div>
            </div>
            <div class="flex justify-end items-center py-4" >
                
                <button type="submit" :disabled="loading" class="bg-zinc-600 hover:bg-zinc-700 transition all px-5 py-2 rounded text-white cursor-pointer" >Send Email.</button>
            </div>
        </form>
    </section>
</template>

<script setup>
import { Email } from '@/components/icons/exportIcons';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';


let authStore = useAuthStore();
const { forgetPassword } = authStore;
let { loading, message } = storeToRefs(authStore);
let email = ref('')


const handleSubmit = async ()=>{
    await forgetPassword(email.value);
}


</script>
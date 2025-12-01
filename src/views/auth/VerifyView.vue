<template>
    <section class="flex justify-center items-center bg-primary-background h-screen" > 
        <div class="bg-white p-8 rounded-lg shadow-md flex flex-col items-center gap-8">
            <div class="h-20  text-center w-full"  >
                <img src="@/assets/logo.svg" alt="" class="w-full h-full">
            </div>
            <h1 class="text-2xl font-semibold" >Please Verify Your Email</h1>
            <p>We have sent an verification email to <em>{{ email }}</em>, <br> Click on the link to verify your account.</p>
            <div>
                <button :disabled="loading" @click="handleResendClick" class="bg-zinc-600 cursor-not-allowed hover:bg-zinc-700 transition all border-white text-white border px-3 py-2" >Resend Email</button>
                {{ message }}
            </div>
        </div>
    </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

import { useRouter } from 'vue-router';

const router = useRouter();
 let authStore = useAuthStore();
 
    let {isLogin, message, loading} = storeToRefs(authStore);
    let email = ref('')

onMounted(()=>{
    document.title = "Verify Your Email - Adsvizer"

    const token = localStorage.getItem('token');
    const emailLS = localStorage.getItem('email');
    email.value = emailLS
    if(isLogin.value){
        router.push('/dashboard')
    }
    else if(!token){
        router.push('/login')
    }
    else if(!emailLS){
        router.push('/login')
    }
})

let { resendVerificationEmail } = authStore;
const handleResendClick = async ()=>{
   
    await resendVerificationEmail(email.value);
}

</script>
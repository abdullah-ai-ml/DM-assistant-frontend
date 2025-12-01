<script setup>

import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();




onMounted(async () => {
  const token = route.params.token || '';
  
  if (!token) {
    console.log('No token provided');
    router.push('/login');
    return
  }

  try {
    const response = await fetch('http://127.0.0.1:5000/verify-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      console.log('Token verified successfully:', data);
      // Redirect or update state here
      router.push('/dashboard');
    } else {
      console.error('Token verification failed:', response.statusText);
    }
  } catch (err) {
    console.error('Error verifying token:', err);
  }
});
</script>
<template>
    <h1>Email is being verified........</h1>
</template>
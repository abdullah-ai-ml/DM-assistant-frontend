<script setup>
import Sidebar from "./Sidebar.vue";
</script>

<template>
  <div class="min-h-screen bg-background flex">
    <Sidebar />

    <main class="flex-1 ml-64 p-8">
      <slot />
    </main>
  </div>
</template>

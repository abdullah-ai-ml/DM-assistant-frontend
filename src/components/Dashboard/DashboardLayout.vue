<script setup>
import Sidebar from "./Sidebar.vue";
</script>

<template>
  <div
    class="min-h-screen flex bg-[#060912] text-slate-200"
    style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;"
  >
    <Sidebar />

    <main class="flex-1 ml-64 p-6">
      <div class="pointer-events-none fixed inset-0 -z-10">
        <div class="absolute -top-24 left-20 h-72 w-72 rounded-full bg-indigo-500/18 blur-3xl"></div>
        <div class="absolute top-24 right-20 h-72 w-72 rounded-full bg-sky-500/16 blur-3xl"></div>
        <div class="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-pink-500/14 blur-3xl"></div>
      </div>
      <slot />
    </main>
  </div>
</template>

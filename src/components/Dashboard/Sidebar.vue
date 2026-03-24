<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";

const navigation = ref([
  { name: "Dashboard", to: "/dashboard", icon: "🏠", current: true },
  { name: "Campaigns", to: "/dashboard/campaign", icon: "🎯", current: false },
  { name: "AI Insights", to: "/dashboard/campaign/ai-analysis", icon: "💡", current: false },
  { name: "Analytics Report", to: "#", icon: "📊", current: false },
  { name: "Settings", to: "#", icon: "⚙️", current: false },
]);
</script>

<template>
  <div
    class="fixed inset-y-0 left-0 z-50 w-64 border-r border-white/5 bg-[#060912]/90 backdrop-blur-xl"
  >
    <div class="flex flex-col h-full">
      <!-- Logo Section -->
      <div
        class="flex items-center justify-center h-16 px-4 border-b border-white/5"
      >
        <div class="flex items-center space-x-2">
          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center text-white text-lg bg-gradient-to-br from-indigo-400 to-sky-400"
          >
            📊
          </div>

          <span
            class="text-xl font-black tracking-tight text-white"
          >
            DManalyzer
          </span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-2">
        <RouterLink
          v-for="item in navigation"
          :key="item.name"
          class="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left transition-all border border-transparent text-slate-300 hover:text-white hover:bg-white/[0.035] hover:border-white/10"
          :to="item.to"
        >
          <span class="text-lg">{{ item.icon }}</span>
          <span class="cursor-pointer text-sm font-mono">{{ item.name }}</span>
        </RouterLink>
      </nav>

      <!-- Footer -->
      <div class="p-4 border-t border-white/5">
        <div class="text-xs text-slate-600 text-center font-mono">
          Powered by AI Analytics
        </div>
      </div>
    </div>
  </div>
</template>

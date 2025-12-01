<script setup>
import { ref } from "vue";

const navigation = ref([
  { name: "Dashboard", href: "#", icon: "🏠", current: true },
  { name: "Campaigns", href: "#", icon: "🎯", current: false },
  { name: "Analytics", href: "#", icon: "📊", current: false },
  { name: "Video Analysis", href: "#", icon: "📤", current: false },
  { name: "AI Insights", href: "#", icon: "💡", current: false },
  { name: "Connections", href: "#", icon: "🔗", current: false },
  { name: "Settings", href: "#", icon: "⚙️", current: false },
]);
</script>

<template>
  <div
    class="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border shadow-card"
  >
    <div class="flex flex-col h-full">
      <!-- Logo Section -->
      <div
        class="flex items-center justify-center h-16 px-4 border-b border-border"
      >
        <div class="flex items-center space-x-2">
          <div
            class="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white text-lg"
          >
            📊
          </div>

          <span
            class="text-xl font-bold bg-gradient-primary bg-clip-text"
          >
            DManalyzer
          </span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-2">
        <button
          v-for="item in navigation"
          :key="item.name"
          class="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-all "
        >
          <span class="text-lg">{{ item.icon }}</span>
          <span class="hover:underline cursor-pointer" >{{ item.name }}</span>
        </button>
      </nav>

      <!-- Footer -->
      <div class="p-4 border-t border-border">
        <div class="text-xs text-muted-foreground text-center">
          Powered by AI Analytics
        </div>
      </div>
    </div>
  </div>
</template>

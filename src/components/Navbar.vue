<script setup>
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore()

const {isLogin} = storeToRefs(authStore)

// Assuming you would use an SVG for the icon instead of a library component
// If you are using a utility library like 'lucide-vue-next', you would keep the import.
// For a pure conversion, we replace it with a direct SVG.
</script>

<template>
  <nav
    class="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border"
  >
    <div class="container mx-auto px-6">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-8 h-8 text-primary"
          >
            <path d="M12 20V10" />
            <path d="M18 20V4" />
            <path d="M6 20v-4" />
          </svg>
          <span class="text-2xl font-bold">DManalyzer</span>
        </div>

        <div class="hidden md:flex items-center gap-8">
          <a
            href="#features"
            class="text-foreground/80 hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="#benefits"
            class="text-foreground/80 hover:text-foreground transition-colors"
          >
            Benefits
          </a>
          <a
            href="#pricing"
            class="text-foreground/80 hover:text-foreground transition-colors"
          >
            Pricing
          </a>
          <a
            href="#contact"
            class="text-foreground/80 hover:text-foreground transition-colors"
          >
            Contact
          </a>
        </div>
        <div v-if="isLogin" class="capitalize hover:bg-black text-white bg-[#222222] transition all duration-100 px-3 py-1.5 rounded">
         <RouterLink to="/dashboard"> dashboard</RouterLink>
        </div>
        <div v-else class="flex items-center gap-3">
          <RouterLink to="/login"
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 hover:bg-accent hover:text-accent-foreground"
          >
            Sign In
          </RouterLink>
          
          <RouterLink to="/login"
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow h-9 px-4 py-2 hover:bg-primary/90"
          >
            Get Started
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>
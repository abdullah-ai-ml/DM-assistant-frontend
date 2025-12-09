<template>
  <section id="#features" class="py-24 relative">
    <!-- Background Gradient -->
    <div class="absolute inset-0 bg-[image:var(--gradient-subtle)]"></div>

    <div class="container mx-auto px-6 relative z-10">
      <!-- Section Header -->
      <div class="text-center mb-16 space-y-4 animate-fade-in">
        <h2 class="text-4xl lg:text-5xl font-bold">
          Powerful Features for
          <span class="block bg-clip-text text-transparent bg-[image:var(--gradient-accent)]">
            Modern Marketers
          </span>
        </h2>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
          Everything you need to analyze, optimize, and scale your digital marketing campaigns with AI precision.
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="p-6 transition rounded-xl shadow-xl duration-300 border"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            :class="feature.bgClass"
          >
            <!-- Placeholder for icon -->
            <component :is="feature.initials" class="text-lg font-bold" />
          </div>
          <h3 class="text-xl font-semibold mb-2">{{ feature.title }}</h3>
          <p class="text-muted-foreground">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Brain, TrendingUp, Zap } from '../icons/exportIcons';

const features = [
  {
    title: "AI-Powered Insights",
    description:
      "Advanced LLM technology analyzes your campaigns and provides actionable recommendations in real-time.",
    color: "text-primary",
    bgClass: "bg-primary/10",
    initials: Brain,
  },
  {
    title: "Performance Optimization",
    description:
      "Automatically identify underperforming areas and receive intelligent suggestions to boost ROI.",
    color: "text-success",
    bgClass: "bg-success/10",
    initials: TrendingUp,
  },
  {
    title: "Real-Time Analytics",
    description:
      "Monitor your campaigns with live data updates and instant alerts for critical changes.",
    color: "text-accent",
    bgClass: "bg-accent/10",
    initials: Zap,
  },
];
</script>

<style scoped>
/* Optional: keep your animate-fade-in keyframes if not already in Tailwind */
.animate-fade-in {
  animation: fadeIn 0.8s ease forwards;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(12px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

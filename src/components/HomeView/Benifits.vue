<template>
  <section class="py-24 relative">
    <div class="container mx-auto px-6">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <!-- Left - Benefits list -->
        <div class="space-y-8 animate-slide-in-left">
          <div>
            <h2 class="text-4xl lg:text-5xl font-bold mb-4">
              Why Leading Brands
              <span
                class="block bg-clip-text"
              >
                Choose DManalyzer
              </span>
            </h2>
            <p class="text-xl text-muted-foreground">
              Join thousands of marketers who have transformed their digital
              campaigns with AI-driven intelligence.
            </p>
          </div>

          <div class="space-y-4">
            <div
              v-for="(benefit, index) in benefits"
              :key="index"
              class="flex items-start gap-3 animate-fade-in"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <!-- SVG check circle icon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6 text-success flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m1 9a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span class="text-lg">{{ benefit }}</span>
            </div>
          </div>
        </div>

        <!-- Right - Stats cards -->
        <div
          class="grid grid-cols-2 gap-6 animate-fade-in"
          style="animation-delay: 0.3s"
        >
          <div
            class="col-span-2 bg-card p-8 rounded-2xl border border-border shadow-[var(--shadow-card)]"
          >
            <div
              class="text-5xl font-bold  mb-2"
            >
              $5.2M+
            </div>
            <div class="text-muted-foreground">Ad spend optimized monthly</div>
          </div>

          <div
            class="bg-card p-6 rounded-2xl border border-border shadow-[var(--shadow-card)]"
          >
            <div class="text-4xl font-bold text-success mb-2">94%</div>
            <div class="text-sm text-muted-foreground">Customer satisfaction</div>
          </div>

          <div
            class="bg-card p-6 rounded-2xl border border-border shadow-[var(--shadow-card)]"
          >
            <div class="text-4xl font-bold text-primary mb-2">2,500+</div>
            <div class="text-sm text-muted-foreground">Active campaigns</div>
          </div>

          <div
            class="col-span-2 bg-card p-6 rounded-2xl border border-border shadow-[var(--shadow-card)]"
          >
            <div class="text-3xl font-bold text-secondary mb-2">
              Real-time AI Analysis
            </div>
            <div class="text-muted-foreground">
              Get insights in under 3 seconds with our advanced LLM models
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const benefits = [
  "Save 10+ hours per week on campaign analysis",
  "Increase conversion rates by an average of 35%",
  "Make decisions backed by AI-powered predictions",
  "Reduce ad spend waste with intelligent optimization",
  "Get instant insights across all marketing platforms",
  "Scale your campaigns with confidence",
];
</script>

<style scoped>
/* Fade-in animation */
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

/* Slide-in-left animation */
.animate-slide-in-left {
  animation: slideInLeft 0.8s ease forwards;
}
@keyframes slideInLeft {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>

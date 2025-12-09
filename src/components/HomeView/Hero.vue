<template>
  <section id="#Hero" class="relative min-h-[90vh] py-8 flex items-center overflow-hidden">
    <!-- Gradient background -->
    <div class="absolute inset-0 bg-[image:var(--gradient-hero)] opacity-5"></div>

    <!-- Floating geometric shapes -->
    <div class="absolute top-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float"></div>
    <div
      class="absolute bottom-20 left-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float"
      style="animation-delay: 1s"
    ></div>

    <div class="container mx-auto px-6 relative z-10">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Left content -->
        <div class="space-y-8 animate-fade-in">
          <div
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20"
          >
            <span class="text-sm font-medium">AI-Powered Analytics</span>
          </div>

          <h1 class="text-5xl lg:text-7xl font-bold leading-tight">
            Transform Your
            <span
              class="block"
            >
              Digital Marketing
            </span>
            With AI Intelligence
          </h1>

          <p class="text-xl text-muted-foreground max-w-xl">
            DManalyzer uses advanced LLM technology to analyze, optimize, and
            elevate your marketing campaigns. Make data-driven decisions with
            confidence.
          </p>

          <div class="flex flex-col sm:flex-row gap-4">
            <button
              class="bg-black hover:bg-zinc-700  transition all text-white duration-300 py-2 px-8 rounded-xl cursor-pointer"
            >
              Start Free Trial
            </button>
          </div>
        </div>

        <!-- Right image -->
        <div class="relative animate-fade-in" style="animation-delay: 0.2s">
          <div class="relative rounded-2xl overflow-hidden ">
            <img
              src="/hero_images.png"
              alt="Digital Marketing Analytics Dashboard"
              class="w-full h-auto animate-soothing"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// import heroImage from "@/assets/hero-marketing.jpg";
</script>

<style scoped>
/* Add any additional CSS if needed */
</style>

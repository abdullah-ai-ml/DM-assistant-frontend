<template>
  <footer class="border-t border-border bg-card/50">
    <div class="container mx-auto px-6 py-12">
      <div class="grid md:grid-cols-4 gap-8 mb-8">
        <!-- Brand -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <!-- BarChart3 SVG Icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <span class="text-xl font-bold">DManalyzer</span>
          </div>
          <p class="text-sm text-muted-foreground">
            AI-powered digital marketing analytics platform helping businesses
            optimize their campaigns.
          </p>
        </div>

        <!-- Product -->
        <div>
          <h3 class="font-semibold mb-4">Product</h3>
          <ul class="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" class="hover:text-foreground transition-colors">Features</a></li>
            <li><a href="#" class="hover:text-foreground transition-colors">Pricing</a></li>
            <li><a href="#" class="hover:text-foreground transition-colors">Integrations</a></li>
            <li><a href="#" class="hover:text-foreground transition-colors">API</a></li>
          </ul>
        </div>

        <!-- Company -->
        <div>
          <h3 class="font-semibold mb-4">Company</h3>
          <ul class="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" class="hover:text-foreground transition-colors">About</a></li>
            <li><a href="#" class="hover:text-foreground transition-colors">Blog</a></li>
            <li><a href="#" class="hover:text-foreground transition-colors">Careers</a></li>
            <li><a href="#" class="hover:text-foreground transition-colors">Contact</a></li>
          </ul>
        </div>

        <!-- Resources -->
        <div>
          <h3 class="font-semibold mb-4">Resources</h3>
          <ul class="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" class="hover:text-foreground transition-colors">Documentation</a></li>
            <li><a href="#" class="hover:text-foreground transition-colors">Help Center</a></li>
            <li><a href="#" class="hover:text-foreground transition-colors">Privacy Policy</a></li>
            <li><a href="#" class="hover:text-foreground transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div class="pt-8 border-t border-border text-center text-sm text-muted-foreground">
        <p>&copy; 2024 DManalyzer. All rights reserved. Powered by AI Analytics.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// No script logic needed
</script>

<style scoped>
/* Add any custom styles if needed */
</style>

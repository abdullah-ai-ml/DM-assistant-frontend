<script setup>
import { ref } from "vue";

const campaigns = ref([
  {
    id: 1,
    name: "Summer Sale Campaign",
    platform: "Google Ads",
    status: "active",
    budget: 2500,
    spent: 1850,
    impressions: 45200,
    clicks: 1250,
    conversions: 89,
    performance: "up",
  },
  {
    id: 2,
    name: "Brand Awareness Q4",
    platform: "Meta",
    status: "paused",
    budget: 1800,
    spent: 1200,
    impressions: 32100,
    clicks: 890,
    conversions: 34,
    performance: "down",
  },
  {
    id: 3,
    name: "Product Launch",
    platform: "Google Ads",
    status: "active",
    budget: 3200,
    spent: 2100,
    impressions: 58900,
    clicks: 1680,
    conversions: 156,
    performance: "up",
  },
]);
</script>

<template>
  <div class="shadow-card border rounded-xl bg-card">
    <div class="p-4 border-b">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">Active Campaigns</h2>
        <button class="bg-gradient-primary text-white px-3 py-1.5 rounded-md text-sm">
          Create Campaign
        </button>
      </div>
    </div>

    <div class="p-4 space-y-4">
      <div
        v-for="campaign in campaigns"
        :key="campaign.id"
        class="p-4 rounded-lg border border-border bg-gradient-card hover:shadow-card transition-shadow"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-3">
          <div>
            <h3 class="font-medium text-lg">{{ campaign.name }}</h3>
            <p class="text-sm text-muted-foreground">{{ campaign.platform }}</p>
          </div>

          <div class="flex items-center space-x-2">
            <span
              class="px-2 py-0.5 rounded text-xs capitalize"
              :class="campaign.status === 'active'
                ? 'bg-accent text-accent-foreground'
                : 'bg-secondary text-secondary-foreground'"
            >
              {{ campaign.status }}
            </span>

            <span
              class="text-sm font-semibold"
              :class="campaign.performance === 'up' ? 'text-accent' : 'text-warning'"
            >
              {{ campaign.performance === "up" ? "▲" : "▼" }}
            </span>
          </div>
        </div>

        <!-- Metrics -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div>
            <p class="text-muted-foreground">Spent</p>
            <p class="font-medium">${{ campaign.spent }}</p>
          </div>

          <div>
            <p class="text-muted-foreground">Impressions</p>
            <p class="font-medium">{{ campaign.impressions.toLocaleString() }}</p>
          </div>

          <div>
            <p class="text-muted-foreground">Clicks</p>
            <p class="font-medium">{{ campaign.clicks }}</p>
          </div>

          <div>
            <p class="text-muted-foreground">CTR</p>
            <p class="font-medium">
              {{ ((campaign.clicks / campaign.impressions) * 100).toFixed(2) }}%
            </p>
          </div>

          <div>
            <p class="text-muted-foreground">Conversions</p>
            <p class="font-medium text-accent">{{ campaign.conversions }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

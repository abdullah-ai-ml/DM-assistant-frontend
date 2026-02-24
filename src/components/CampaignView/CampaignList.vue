<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
    <h1 class="text-3xl font-bold text-white mb-8">Campaign Overview</h1>

    <div
      v-for="campaign in campaigns"
      :key="campaign.id"
      class="mb-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-md border border-white/20 p-6 transition hover:shadow-lg"
    >
      <!-- Header -->
      <div class="flex justify-between items-start mb-5">
        <div>
          <h2 class="text-xl font-semibold text-white">
            {{ campaign.name }}
          </h2>
          <p class="text-sm text-gray-300">
            ID: {{ campaign.id }}
          </p>
        </div>

        <span
          :class="statusBadgeClass(campaign.status)"
          class="px-3 py-1 rounded-full text-xs font-medium"
        >
          {{ campaign.status }}
        </span>
      </div>

      <!-- Metrics -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-200 mb-6">
        <div>
          <p class="text-gray-400">Impressions</p>
          <p class="font-semibold">{{ formatNumber(campaign.metrics.impressions) }}</p>
        </div>

        <div>
          <p class="text-gray-400">Clicks</p>
          <p class="font-semibold">{{ formatNumber(campaign.metrics.clicks) }}</p>
        </div>

        <div>
          <p class="text-gray-400">Conversions</p>
          <p class="font-semibold">{{ campaign.metrics.conversions }}</p>
        </div>

        <div>
          <p class="text-gray-400">Cost</p>
          <p class="font-semibold">
            ${{ microsToCurrency(campaign.metrics.cost_micros) }}
          </p>
        </div>
      </div>

      <!-- Budget & Dates -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-200 mb-6">
        <div>
          <p class="text-gray-400">Budget</p>
          <p class="font-semibold">
            ${{ microsToCurrency(campaign.campaign_budget.amount_micros) }}
          </p>
        </div>

        <div>
          <p class="text-gray-400">Start Date</p>
          <p class="font-semibold">{{ campaign.start_date }}</p>
        </div>

        <div>
          <p class="text-gray-400">End Date</p>
          <p class="font-semibold">
            {{ campaign.end_date || "No End Date" }}
          </p>
        </div>
      </div>

      <!-- CPC -->
      <div class="mb-6 text-sm text-gray-200">
        <p class="text-gray-400">Enhanced CPC</p>
        <p class="font-semibold">
          {{ campaign.manual_cpc.enhanced_cpc_enabled ? "Enabled" : "Disabled" }}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex gap-3">
        <button
          class="px-4 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-white shadow-sm transition"
        >
          👁️ View
        </button>

        <button
          class="px-4 py-2 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 text-white shadow-sm transition"
        >
          ✏️ Update
        </button>

        <button
          class="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-white shadow-sm transition"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

const campaigns = ref([
  {
    id: "1001",
    name: "Spring Sales Campaign",
    status: "ENABLED",
    manual_cpc: { enhanced_cpc_enabled: true },
    start_date: "2026-02-01",
    end_date: "2026-03-31",
    campaign_budget: { amount_micros: 500000000 }, // $500
    metrics: {
      impressions: 125000,
      clicks: 3200,
      conversions: 145,
      cost_micros: 342000000 // $342
    }
  },
  {
    id: "1002",
    name: "Brand Awareness Push",
    status: "PAUSED",
    manual_cpc: { enhanced_cpc_enabled: false },
    start_date: "2026-01-10",
    end_date: null,
    campaign_budget: { amount_micros: 300000000 }, // $300
    metrics: {
      impressions: 98000,
      clicks: 2100,
      conversions: 80,
      cost_micros: 198000000 // $198
    }
  },
  {
    id: "1003",
    name: "Retargeting Campaign",
    status: "REMOVED",
    manual_cpc: { enhanced_cpc_enabled: true },
    start_date: "2025-12-01",
    end_date: "2026-01-15",
    campaign_budget: { amount_micros: 200000000 }, // $200
    metrics: {
      impressions: 45000,
      clicks: 1500,
      conversions: 95,
      cost_micros: 175000000 // $175
    }
  }
])

const formatNumber = (value) => {
  return new Intl.NumberFormat().format(value || 0)
}

const microsToCurrency = (micros) => {
  return ((micros || 0) / 1_000_000).toFixed(2)
}

const statusBadgeClass = (status) => {
  switch (status) {
    case "ENABLED":
      return "bg-green-500/20 text-green-400"
    case "PAUSED":
      return "bg-yellow-500/20 text-yellow-400"
    case "REMOVED":
      return "bg-red-500/20 text-red-400"
    default:
      return "bg-gray-500/20 text-gray-300"
  }
}
</script>
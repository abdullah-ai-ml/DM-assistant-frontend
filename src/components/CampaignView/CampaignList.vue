<script setup>
import { useGoogleAdsStore } from "@/stores/googleAds"
import apiClient from "@/utils/axiosConf"
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css';

const googleAdStore = useGoogleAdsStore()
const campaigns = googleAdStore.campaigns
const manager_id = googleAdStore.manager_id
const customer_id = googleAdStore.selectedCustomer
// ---------- Helpers ----------

const formatNumber = (value) => {
  return new Intl.NumberFormat().format(value || 0)
}

const calculateBudgetUsage = (campaign) => {
  if (!campaign.budget || campaign.budget === 0) return 0
  return ((campaign.spent / campaign.budget) * 100).toFixed(1)
}

const statusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case "enabled":
      return "bg-green-500/20 text-green-400"
    case "paused":
      return "bg-yellow-500/20 text-yellow-400"
    case "removed":
      return "bg-red-500/20 text-red-400"
    default:
      return "bg-gray-500/20 text-gray-500"
  }
}

const performanceBadgeClass = (performance) => {
  switch (performance?.toLowerCase()) {
    case "up":
      return "bg-green-500/20 text-green-400"
    case "stable":
      return "bg-yellow-500/20 text-yellow-400"
    case "down":
      return "bg-red-500/20 text-red-400"
    default:
      return "bg-gray-500/20 text-gray-500"
  }
}


const handleDeletion = async (campaign_id) => {
   const payload = {
      manager_id: manager_id,
      customer_id: customer_id,
      campaign_id: campaign_id
    }
    const response = await apiClient.post('/google/search/delete', payload)
    if(response.data.ok){
      toast.success(response.data.message)
    }else{
      toast.warning(response.data.error)
    }
}
</script>
<template>
  <div class="min-h-screen border bg-transparent rounded-xl shadow-xs mt-8 p-8">
    <h1 class="text-3xl font-bold text-black  mb-8">Campaign Overview</h1>

    <div
      v-for="campaign in campaigns"
      :key="campaign.id"
      class="mb-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-md border border-white/20 p-6 transition hover:shadow-lg"
    >
      <!-- Header -->
      <div class="flex justify-between items-start mb-5">
        <div>
          <h2 class="text-xl font-semibold text-black">
            {{ campaign.name }}
          </h2>
          <p class="text-sm text-gray-500">
            ID: {{ campaign.id }}
          </p>
        </div>

        <div class="flex flex-col items-end gap-2">
          <span
            :class="statusBadgeClass(campaign.status)"
            class="px-3 py-1 rounded-full text-xs font-medium"
          >
            {{ campaign.status.toUpperCase() }}
          </span>

          <span
            :class="performanceBadgeClass(campaign.performance)"
            class="px-3 py-1 rounded-full text-xs font-medium"
          >
            {{ campaign.performance.toUpperCase() }}
          </span>
        </div>
      </div>

      <!-- Core Metrics -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 mb-6">
        <div>
          <p class="text-gray-700">Impressions</p>
          <p class="font-semibold">{{ formatNumber(campaign.impressions) }}</p>
        </div>

        <div>
          <p class="text-gray-700">Clicks</p>
          <p class="font-semibold">{{ formatNumber(campaign.clicks) }}</p>
        </div>

        <div>
          <p class="text-gray-700">Conversions</p>
          <p class="font-semibold">{{ campaign.conversions }}</p>
        </div>

        <div>
          <p class="text-gray-700">Spend</p>
          <p class="font-semibold">${{ campaign.spent.toFixed(2) }}</p>
        </div>
      </div>

      <!-- KPI Metrics -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 mb-6">
        <div>
          <p class="text-gray-700">CTR</p>
          <p class="font-semibold">{{ campaign.ctr }}%</p>
        </div>

        <div>
          <p class="text-gray-700">CPC</p>
          <p class="font-semibold">${{ campaign.cpc }}</p>
        </div>

        <div>
          <p class="text-gray-700">CVR</p>
          <p class="font-semibold">{{ campaign.cvr }}%</p>
        </div>

        <div>
          <p class="text-gray-700">CPA</p>
          <p class="font-semibold">${{ campaign.cpa }}</p>
        </div>
      </div>

      <!-- Budget & Platform -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 mb-6">
        <div>
          <p class="text-gray-700">Daily Budget</p>
          <p class="font-semibold">${{ campaign.budget.toFixed(2) }}</p>
        </div>

        <div>
          <p class="text-gray-700">Platform</p>
          <p class="font-semibold">{{ campaign.platform }}</p>
        </div>

        <div>
          <p class="text-gray-700">Budget Usage</p>
          <p class="font-semibold">
            {{ calculateBudgetUsage(campaign) }}%
          </p>
        </div>
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
          @click="handleDeletion(campaign.id)"
          >
          🗑️ Delete
        </button>
      </div>
    </div>
  </div>
</template>


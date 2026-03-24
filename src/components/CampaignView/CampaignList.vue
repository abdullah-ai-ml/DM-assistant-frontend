<script setup>
import { useGoogleAdsStore } from "@/stores/googleAds"
import apiClient from "@/utils/axiosConf"
import { ref } from "vue";
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css';
import UpdateCampaignModel from "./UpdateCampaignModel.vue";
import { RouterLink } from "vue-router";
import Spinner from "@/components/ui/Spinner.vue";

const googleAdStore = useGoogleAdsStore()

const manager_id = googleAdStore.manager_id
const customer_id = googleAdStore.selectedCustomer
const campaignsLoading = googleAdStore.campaignsLoading
// ---------- Helpers ----------

const props = defineProps({
  campaigns: Array,
  customer_id: Number
})


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



const show = ref(false)
const campaign_id = ref('')
const openCampaignModel = (id) => {
    show.value = true
    campaign_id.value = String(id)
}

const handleToggle = () => {
  show.value = !show.value
}
</script>
<template>


  <UpdateCampaignModel 
    :show="show"
    :campaignId="campaign_id"
    @close="handleToggle"
  />

  <div class="rounded-2xl border border-white/5 bg-white/[0.025] p-5">
    <div class="flex items-center justify-between mb-4">
      <div>
        <p class="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-1">Selected account</p>
        <h2 class="text-sm font-bold text-white">Campaigns</h2>
      </div>
      <Spinner v-if="campaignsLoading" label="loading" size="sm" />
    </div>

    <p v-if="!props.customer_id" class="text-xs font-mono text-slate-600">
      Select an account above to view campaigns.
    </p>

    <div
      v-for="campaign in props.campaigns"
      :key="campaign.id"
      class="mb-4 rounded-2xl bg-white/[0.02] backdrop-blur-md border border-white/5 p-5 transition hover:border-white/10"
    >
      <!-- Header -->
      <div class="flex justify-between items-start mb-5">
        <div>
          <h3 class="text-base font-semibold text-white">
            {{ campaign.name }}
          </h3>
          <p class="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
            ID: {{ campaign.id }}
          </p>
        </div>

        <div class="flex flex-col items-end gap-2">
          <span
            :class="statusBadgeClass(campaign.status)"
            class="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest"
          >
            {{ campaign.status.toUpperCase() }}
          </span>

          <span
            :class="performanceBadgeClass(campaign.performance)"
            class="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest"
          >
            {{ campaign.performance.toUpperCase() }}
          </span>
        </div>
      </div>

      <!-- Core Metrics -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-400 mb-6">
        <div>
          <p class="text-slate-500 font-mono text-[10px] uppercase tracking-widest">Impressions</p>
          <p class="font-semibold text-white">{{ formatNumber(campaign.impressions) }}</p>
        </div>

        <div>
          <p class="text-slate-500 font-mono text-[10px] uppercase tracking-widest">Clicks</p>
          <p class="font-semibold text-white">{{ formatNumber(campaign.clicks) }}</p>
        </div>

        <div>
          <p class="text-slate-500 font-mono text-[10px] uppercase tracking-widest">Conversions</p>
          <p class="font-semibold text-white">{{ campaign.conversions }}</p>
        </div>

        <div>
          <p class="text-slate-500 font-mono text-[10px] uppercase tracking-widest">Spend</p>
          <p class="font-semibold text-white">${{ campaign.spent.toFixed(2) }}</p>
        </div>
      </div>

      <!-- KPI Metrics -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-400 mb-6">
        <div>
          <p class="text-slate-500 font-mono text-[10px] uppercase tracking-widest">CTR</p>
          <p class="font-semibold text-white">{{ campaign.ctr }}%</p>
        </div>

        <div>
          <p class="text-slate-500 font-mono text-[10px] uppercase tracking-widest">CPC</p>
          <p class="font-semibold text-white">${{ campaign.cpc }}</p>
        </div>

        <div>
          <p class="text-slate-500 font-mono text-[10px] uppercase tracking-widest">CVR</p>
          <p class="font-semibold text-white">{{ campaign.cvr }}%</p>
        </div>

        <div>
          <p class="text-slate-500 font-mono text-[10px] uppercase tracking-widest">CPA</p>
          <p class="font-semibold text-white">${{ campaign.cpa }}</p>
        </div>
      </div>

      <!-- Budget & Platform -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-400 mb-6">
        <div>
          <p class="text-slate-500 font-mono text-[10px] uppercase tracking-widest">Daily Budget</p>
          <p class="font-semibold text-white">${{ campaign.budget.toFixed(2) }}</p>
        </div>

        <div>
          <p class="text-slate-500 font-mono text-[10px] uppercase tracking-widest">Platform</p>
          <p class="font-semibold text-white">{{ campaign.platform }}</p>
        </div>

        <div>
          <p class="text-slate-500 font-mono text-[10px] uppercase tracking-widest">Budget Usage</p>
          <p class="font-semibold text-white">
            {{ calculateBudgetUsage(campaign) }}%
          </p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3">
        <RouterLink
          class="px-4 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-white shadow-sm transition text-sm font-mono"
          :to="`/dashboard/campaign/${campaign.id}/analysis`"
          >
          👁️ View
        </RouterLink>

        <button
          class="px-4 py-2 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 text-white shadow-sm transition text-sm font-mono"
          @click="openCampaignModel(campaign.id)"
          >
          ✏️ Update
        </button>

        <button
          class="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-white shadow-sm transition text-sm font-mono"
          @click="handleDeletion(campaign.id)"
          >
          🗑️ Delete
        </button>
      </div>
    </div>
  </div>
</template>


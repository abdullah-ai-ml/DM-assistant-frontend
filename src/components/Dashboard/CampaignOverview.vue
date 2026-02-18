<script setup>
import { useGoogleAdsStore } from "@/stores/googleAds"
import { onMounted, watch } from "vue"
import { storeToRefs } from "pinia"

const googleAdsStore = useGoogleAdsStore()

const { handleGetCustomers, handleGetCampaign } = googleAdsStore

const {
  error_messaging,
  customer_details,
  campaigns,
  selectedCustomer
} = storeToRefs(googleAdsStore)

onMounted(async () => {
  await handleGetCustomers()
})

watch(selectedCustomer, (newCustomer, oldCustomer) => {
  if (!newCustomer || newCustomer === oldCustomer) return
 
  handleGetCampaign()
})
</script>

<template>
  <div class="shadow-card border rounded-xl bg-card">
    <div class="p-4 border-b">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">Active Campaigns</h2>
        <select 
          v-if="customer_details != null && customer_details.length" 
          v-model="selectedCustomer"
          class="border rounded-[5px] py-3 px-3"
          name="customer"
        >
          <option value="" disabled hidden="">Select Account to handle campaigns</option>
          <option 
            v-for="customer in customer_details" 
            :key="customer.id" 
            :value="customer.id"
          >
            {{ customer.name }}
          </option>
        </select>
        
      </div>
    </div>

    <div >
      <div v-if="customer_details == null && !customer_details.length">{{ error_messaging }}</div>
      <div v-if="campaigns && campaigns.length" class="p-4 space-y-4">

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
      <div v-else>{{ error_messaging }}</div>
      
    </div>
  </div>
</template>

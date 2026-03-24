<script setup>
import { onMounted, ref, watch } from "vue"
import { storeToRefs } from "pinia"
import DashboardLayout from "@/components/Dashboard/DashboardLayout.vue"
import CampaignList from "@/components/CampaignView/CampaignList.vue";
import CreateCampaignModel from "@/components/CampaignView/CreateCampaignModel.vue";
import Spinner from "@/components/ui/Spinner.vue";
import { useGoogleAdsStore } from "@/stores/googleAds";

const isShow = ref(false)

const handleToggle = () => {
  isShow.value = !isShow.value
}

const googleAds = useGoogleAdsStore();

const { campaigns, customer_details, selectedCustomer, customersLoading, campaignsLoading, error_messaging } = storeToRefs(googleAds);
const { handleGetCustomers, handleGetCampaign } = googleAds;

onMounted(async () => {
  if (!customer_details.value?.length) {
    await handleGetCustomers()
  }
})

watch(selectedCustomer, async (newVal, oldVal) => {
  if (!newVal || newVal === oldVal) return;
  await handleGetCampaign();
});
</script>

<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-6 pt-8 pb-16 space-y-6">
      <section class="rounded-2xl border border-white/5 bg-white/[0.025] px-5 py-4">
        <div class="flex flex-wrap items-center gap-3">
          <div class="min-w-0">
            <p class="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-1">Campaigns</p>
            <h1 class="text-2xl font-black tracking-tight text-white">Campaign list</h1>
            <p class="text-xs text-slate-500 mt-1 font-mono">Select an account to load campaigns</p>
          </div>

          <div class="ml-auto flex flex-wrap  items-center gap-2">
            <div class="min-w-[280px]">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Account</span>
                <Spinner v-if="customersLoading" label="loading customers" size="sm" />
              </div>

              <select
                v-model="selectedCustomer"
                class="w-full rounded-xl border border-white/10 bg-[#060912]/60 text-slate-200 px-3 py-2 text-sm outline-none focus:border-white/20"
                :disabled="customersLoading"
              >
                <option value="" disabled hidden>Select account</option>
                <option v-for="c in customer_details" :key="c.id" :value="c.id">
                  {{ c.name }}
                </option>
              </select>
            </div>

            <button
              @click="handleToggle"
              class="px-4 py-2 mt-auto rounded-full border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition text-sm font-mono"
            >
              + create
            </button>
          </div>
        </div>

        <div class="mt-3">
          <Spinner v-if="campaignsLoading" label="loading campaigns" />
          <p v-else-if="error_messaging" class="text-xs font-mono text-slate-600">
            {{ error_messaging }}
          </p>
        </div>
      </section>

      <CampaignList :campaigns="campaigns" :customer_id = "selectedCustomer" />
    </div>

    <div
      v-if="isShow"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
      @click.self="handleToggle"

    >
      <CreateCampaignModel @close="handleToggle" class="max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl p-6" />
    </div>
  </DashboardLayout>
</template>
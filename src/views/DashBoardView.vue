
<script setup>

import { onMounted, watch } from "vue";

import DashboardLayout from "@/components/Dashboard/DashboardLayout.vue";
import VideoAnalysis from "@/components/Dashboard/VideoAnalysis.vue";
import OAuthConnections from "@/components/Dashboard/OAuthConnection.vue";
import AccountSpendOverview from "@/components/Dashboard/AccountSpendOverview.vue";



import { useAuthStore } from "@/stores/auth";
import { useGoogleAdsStore } from "@/stores/googleAds";
import { storeToRefs } from "pinia";



const authStore = useAuthStore()
const { logoutUser } = authStore

async function handleLogout(){
    await logoutUser()
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
      <!-- Title -->
      <section class="rounded-2xl border border-white/5 bg-white/[0.025] px-5 py-4">
        <div class="flex flex-wrap items-center gap-3">
          <div class="min-w-0">
            <p class="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-1">Dashboard</p>
            <h1 class="text-2xl font-black tracking-tight text-white">Account performance overview</h1>
            <p class="text-xs text-slate-500 mt-1 font-mono">Connections first · spend/budget only · top campaign</p>
          </div>

          <div class="ml-auto flex items-center gap-2">
            <button
              class="px-4 py-2 rounded-full border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition text-sm font-mono"
              type="button"
            >
              account
            </button>
            <button
              class="px-4 py-2 rounded-full border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition text-sm font-mono"
              type="button"
              @click="handleLogout"
            >
              logout
            </button>
          </div>
        </div>
      </section>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

      <!-- Block 1: OAuth Connections -->
      <div class="lg:col-span-2">
        <OAuthConnections />
      </div>

      <!-- Block 2: Account Selector -->
      <div class="rounded-2xl border border-white/[0.06] p-5 space-y-4" style="background:rgba(255,255,255,0.02);">
        
        <div>
          <p class="text-[9px] font-mono text-sky-400 uppercase tracking-[0.2em] mb-0.5">Google Ads</p>
          <h3 class="text-sm font-bold text-white">Select Account</h3>
        </div>

        <!-- Loading -->
        <div v-if="customersLoading" class="flex items-center gap-2.5">
          <div class="w-3.5 h-3.5 rounded-full border-2 border-sky-400/30 border-t-sky-400 animate-spin"></div>
          <span class="text-xs font-mono text-slate-500">Fetching accounts…</span>
        </div>

        <!-- Error -->
        <div v-else-if="error_messaging" class="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5">
          <p class="text-xs font-mono text-rose-400">{{ error_messaging }}</p>
        </div>

        <!-- No accounts -->
        <div v-else-if="!customer_details?.length" class="py-3 text-center">
          <p class="text-xs font-mono text-slate-600">Connect Google Ads to load accounts</p>
        </div>

        <!-- Select -->
        <template v-else>
          <div class="relative">
            <select
              v-model="selectedCustomer"
              class="w-full appearance-none rounded-xl border border-white/10 bg-[#060912]/60 text-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-500/50 transition-all cursor-pointer pr-9"
              :disabled="campaignsLoading"
            >
              <option value="" disabled hidden>Select account…</option>
              <option v-for="c in customer_details" :key="c.id" :value="c.id">
                {{ c.name }}
              </option>
            </select>
            <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>

          <!-- Selected pill -->
          <div v-if="selectedCustomer" class="flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span class="text-[10px] font-mono text-emerald-400 truncate">
              {{ customer_details.find(c => c.id === selectedCustomer)?.name }}
            </span>
          </div>

          <!-- Campaigns loading -->
          <div v-if="campaignsLoading" class="flex items-center gap-2.5">
            <div class="w-3.5 h-3.5 rounded-full border-2 border-sky-400/30 border-t-sky-400 animate-spin"></div>
            <span class="text-[10px] font-mono text-slate-500">Loading campaigns…</span>
          </div>
        </template>

        <!-- Footer counts -->
        <div v-if="customer_details?.length" class="flex justify-between pt-1 border-t border-white/[0.04]">
          <span class="text-[9px] font-mono text-slate-700">{{ customer_details.length }} accounts</span>
          <span class="text-[9px] font-mono text-slate-700">{{ campaigns?.length ?? 0 }} campaigns</span>
        </div>

      </div>
    </div>

      <!-- Grid layout: spend/budget + top campaign -->
      <AccountSpendOverview />

      <!-- Keep video analysis feature -->
      <VideoAnalysis />
    </div>
  </DashboardLayout>
</template>

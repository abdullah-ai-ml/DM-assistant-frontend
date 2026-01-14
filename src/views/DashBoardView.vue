
<script setup>
import DashboardLayout from "@/components/Dashboard/DashboardLayout.vue";
import AnalyticsDashboard from "@/components/Dashboard/AnalyticsDashboard.vue";
import CampaignOverview from "@/components/Dashboard/CampaignOverview.vue";
import VideoAnalysis from "@/components/Dashboard/VideoAnalysis.vue";
import AIInsights from "@/components/Dashboard/Allinsight.vue";
import OAuthConnections from "@/components/Dashboard/OAuthConnection.vue";

import { RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore()
const { logoutUser } = authStore

async function handleLogout(){
    await logoutUser()
}
</script>

<template>
  <DashboardLayout>
    <div class="space-y-8">
      <!-- Removed HeroSection -->
      <div class="relative flex justify-end gap-3  border rounded-xl bg-white px-3" >
        <button class="cursor-pointer bg-white my-3 px-3 py-1.5 border border-border bg-transparent rounded-md text-sm " >👤 Account  </button>

        <button class="cursor-pointer bg-white my-3 px-3 py-1.5 border border-border bg-transparent rounded-md text-sm " @click="handleLogout">🔒 Logout</button>
       
      </div>

      <AnalyticsDashboard />

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CampaignOverview />

        <div class="space-y-8">
          <OAuthConnections />
          <VideoAnalysis />
        </div>
      </div>

      <AIInsights />
    </div>
  </DashboardLayout>
</template>

<!-- 

<script setup>
import { ref } from 'vue';

import { onMounted } from 'vue';
let messsage = ref('');
onMounted(async() => {
    const respnse = await fetch('http://127.0.0.1:5000/dashboard',{
        method: 'GET',
        headers:{
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    const data = await respnse.json();
    messsage.value = data.messsage;
});
</script>


<template>

    protected dashboard: {{ messsage }}
</template> -->


<script setup>
import DashboardLayout from "@/components/Dashboard/DashboardLayout.vue";
import AnalyticsDashboard from "@/components/Dashboard/AnalyticsDashboard.vue";
import CampaignOverview from "@/components/Dashboard/CampaignOverview.vue";
import VideoAnalysis from "@/components/Dashboard/VideoAnalysis.vue";
import AIInsights from "@/components/Dashboard/Allinsight.vue";
import OAuthConnections from "@/components/Dashboard/OAuthConnection.vue";
</script>

<template>
  <DashboardLayout>
    <div class="space-y-8">
      <!-- Removed HeroSection -->

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


<script setup>
import DashboardLayout from "@/components/Dashboard/DashboardLayout.vue";
import AnalyticsDashboard from "@/components/Dashboard/AnalyticsDashboard.vue";
import CampaignOverview from "@/components/Dashboard/CampaignOverview.vue";
import VideoAnalysis from "@/components/Dashboard/VideoAnalysis.vue";
import AIInsights from "@/components/Dashboard/Allinsight.vue";
import OAuthConnections from "@/components/Dashboard/OAuthConnection.vue";



// import { ref } from 'vue';

// import { onMounted } from 'vue';
// import router from "@/router";


// let messsage = ref('');
// let token = localStorage.getItem('token');
// onMounted(async() => {
  
//     if(!token){
//       router.push('/login')
//     }
//     const respnse = await fetch('http://127.0.0.1:5000/dashboard',{
//         method: 'GET',
//         headers:{
//             Authorization: `Bearer ${token}`
//         }
//     });

//     const data = await respnse.json();
//     if(!data.ok){
//       router.push('/login')
//     }

// });
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

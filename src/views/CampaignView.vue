<script setup>
import CampaignList from '@/components/CampaignView/CampaignList.vue';
import CreateCampaignModel from '@/components/CampaignView/CreateCampaignModel.vue';
import DashboardLayout from '@/components/Dashboard/DashboardLayout.vue';

</script>

<template>
    <DashboardLayout>
            <div class="border rounded-md w-full py-1.5 px-3 flex justify-end gap-8" >
                <button class="hover:underline" >
                    ➕ Create
                </button>
            </div>
           <CampaignList  />
           <CreateCampaignModel class="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] " />
    </DashboardLayout>
</template>
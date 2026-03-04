<script setup>
import { ref } from "vue"
import DashboardLayout from "@/components/Dashboard/DashboardLayout.vue"
import CampaignList from "@/components/CampaignView/CampaignList.vue";
import CreateCampaignModel from "@/components/CampaignView/CreateCampaignModel.vue";
const isShow = ref(false)

const handleToggle = () => {
  isShow.value = !isShow.value
}
</script>

<template>
  <DashboardLayout>
    <div class="border rounded-md w-full py-1.5 px-3 flex justify-end gap-8">
      <button @click="handleToggle" class="hover:underline">
        ➕ Create
      </button>
    </div>

    <CampaignList />

    <div
      v-if="isShow"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
      @click.self="handleToggle"
    >
      <CreateCampaignModel class="max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl p-6" />
    </div>
  </DashboardLayout>
</template>
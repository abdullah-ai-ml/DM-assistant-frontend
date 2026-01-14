<script setup>
import DashboardLayout from '@/components/Dashboard/DashboardLayout.vue';

</script>

<template>
    <DashboardLayout>
            <div class="border rounded-md w-full py-1.5 px-3 flex justify-end gap-8" >
                <button class="hover:underline" >
                    ➕ Create
                </button>
            </div>
            <div class="border rounded-md px-3 py-8" >
                list of campaings created
            </div>
    </DashboardLayout>
</template>
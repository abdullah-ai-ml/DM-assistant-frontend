<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import apiClient from '@/utils/axiosConf'

import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import { useGoogleAdsStore } from '@/stores/googleAds';

let useGoogleStore = useGoogleAdsStore()

const customer_id = useGoogleStore.selectedCustomer || ""
const manager_id = useGoogleStore.manager_id || ""

/* ===========================
   PROPS
=========================== */
const props = defineProps({
  show: Boolean,
  campaignId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'updated'])

/* ===========================
   STATE
=========================== */

const loading = ref(false)

const keywords = reactive([])

/* ===========================
   FETCH KEYWORDS
=========================== */

const fetchKeywords = async () => {
  if (!props.campaignId) return

  loading.value = true
  try {
    const { data } = await apiClient.get(
      `/google/search/${props.campaignId}/keywords`
    )

    // Expecting: [{ keyword: '', match_type: '' }]
    keywords.splice(0)
    data.forEach(k => keywords.push({ ...k }))

  } catch (err) {
    console.error('Failed to fetch keywords', err)
  } finally {
    loading.value = false
  }
}

// watch(() => props.show, (val) => {
//   if (val) fetchKeywords()
// })

/* ===========================
   ADD / REMOVE
=========================== */

const addKeyword = () => {
  keywords.push({
    keyword: '',
    match_type: 'BROAD'
  })
}

const removeKeyword = (index) => {
  keywords.splice(index, 1)
}

/* ===========================
   UPDATE KEYWORDS
=========================== */

const updateKeywords = async () => {
  loading.value = true
  const payload = {
    manager_id: manager_id,
    customer_id: customer_id,
    keywords
  }
  try {
   const response = await apiClient.put(
      `/google/search/${props.campaignId}/keywords`,
      payload
    )
    if (response.data.ok){
        toast.success(response.data.message)
    }
    else{
        toast.warning(response.data.error)
    }
    emit('updated')
    emit('close')

  } catch (err) {
    console.error('Keyword update failed', err.response?.data || err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div class="bg-white w-[700px] max-h-[85vh] overflow-y-auto p-8 rounded-xl space-y-6">

      <!-- Header -->
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold">✏️ Update Campaign Keywords</h2>
        <button @click="$emit('close')" class="text-lg">✖</button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-6">
        ⏳ Loading...
      </div>

      <!-- Keywords List -->
      <div v-else class="space-y-4">

        <div
          v-for="(kw, i) in keywords"
          :key="i"
          class="flex gap-3 items-center"
        >
          <input
            v-model="kw.keyword"
            placeholder="Enter keyword"
            class="flex-1 p-2 border rounded-md"
          />

          <select
            v-model="kw.match_type"
            class="p-2 border rounded-md"
          >
            <option value="BROAD">BROAD</option>
            <option value="PHRASE">PHRASE</option>
            <option value="EXACT">EXACT</option>
          </select>

          <button
            @click="removeKeyword(i)"
            class="text-red-500"
          >
            🗑
          </button>
        </div>

        <button
          @click="addKeyword"
          class="w-full border py-2 rounded-md"
        >
          ➕ Add Keyword
        </button>
      </div>

      <!-- Actions -->
      <div class="flex gap-4 pt-4">
        <button
          @click="$emit('close')"
          class="flex-1 border py-2 rounded-md"
        >
          Cancel
        </button>

        <button
          @click="updateKeywords"
          class="flex-1 bg-black text-white py-2 rounded-md"
          :disabled="loading"
        >
          💾 Save Changes
        </button>
      </div>

    </div>
  </div>
</template>
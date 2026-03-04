<script setup>
import apiClient from '@/utils/axiosConf'
import { ref, reactive } from 'vue'
import { useGoogleAdsStore } from '@/stores/googleAds'
import { storeToRefs } from 'pinia'
import { puter } from "@heyputer/puter.js"

const googleAdsStore = useGoogleAdsStore()
const { selectedCustomer, manager_id } = storeToRefs(googleAdsStore)

// UI State
const step = ref('draft')
const loading = ref(false)

// Campaign Idea
const idea = ref('')

// Search Campaign Data
const searchAssets = reactive({
  campaign_name: '',
  ad_group_name: '',
  business_name: '',
  final_url: '',
  budget: null,
  bidding_strategy: 'MAXIMIZE_CLICKS',

  keywords: [],

  headlines: Array(10).fill(''),
  descriptions: Array(4).fill('')
})

/* ===========================
   AI GENERATION
=========================== */

const getAISuggestions = async () => {
  loading.value = true

  try {
    const chatResponse = await puter.ai.chat(
      [{
        role: "user",
        content: `
            Generate Google Search Campaign assets.

            Return ONLY valid JSON.

            Schema:
            {
            "campaign_name": "",
            "ad_group_name": "",
            "business_name": "",
            "final_url": "",
            "budget": null,
            "bidding_strategy": "MAXIMIZE_CLICKS",
            "keywords": [
                {"keyword": "", "match_type": "BROAD"},
                {"keyword": "", "match_type": "PHRASE"},
                {"keyword": "", "match_type": "EXACT"}
            ],
            "headlines": ["", "", "", "", "", "", "", "", "", ""],
            "descriptions": ["", "", "", ""]
            }

            Rules:
            - Headlines max 30 chars
            - Descriptions max 90 chars
            - Include BROAD, PHRASE and EXACT keywords
            - Keywords must be high commercial intent
            - Focus on conversion-driven search intent

            Campaign Idea:
            ${idea.value}
            `
      }],
      {
        model: "gpt-4o",
        temperature: 0.7
      }
    )

    let raw = chatResponse.message.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    const assets = JSON.parse(raw)
    Object.assign(searchAssets, assets)

    step.value = "review"

  } catch (error) {
    console.error("AI generation failed:", error)
  } finally {
    loading.value = false
  }
}

/* ===========================
   PUBLISH
=========================== */

const publishCampaign = async () => {
  loading.value = true

  try {
    const payload = {
      ...searchAssets,
      customer_id: selectedCustomer.value,
      manager_id: manager_id.value
    }
    console.log(selectedCustomer.value, manager_id)
    const response = await apiClient.post(
      '/google/search/create',
      payload
    )

    console.log("Search Campaign Created", response.data)

  } catch (error) {
    console.error("Publish failed:", error.response?.data || error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-[800px] overflow-y-scroll mx-auto p-6 bg-white border rounded-lg">

    <!-- DRAFT -->
    <div v-if="step === 'draft'" class="space-y-6">

      <h2 class="text-xl font-semibold">💡 Campaign Idea</h2>

      <textarea
        v-model="idea"
        placeholder="Describe your search campaign idea..."
        class="w-full p-4 border rounded-md h-32"
      ></textarea>

      <button
        @click="getAISuggestions"
        :disabled="loading || !idea"
        class="w-full py-3 bg-black text-white rounded-md"
      >
        {{ loading ? "Generating..." : "Generate Search Campaign" }}
      </button>
    </div>

    <!-- REVIEW -->
    <div v-else class="space-y-6">

      <h2 class="text-xl font-semibold">📋 Review Search Campaign</h2>

      <!-- Campaign Info -->
      <input v-model="searchAssets.campaign_name" placeholder="Campaign Name" class="w-full p-2 border rounded-md" />
      <input v-model="searchAssets.ad_group_name" placeholder="Ad Group Name" class="w-full p-2 border rounded-md" />
      <input v-model="searchAssets.final_url" placeholder="Final URL" class="w-full p-2 border rounded-md" />
      <input v-model="searchAssets.budget" type="number" placeholder="Daily Budget" class="w-full p-2 border rounded-md" />

      <!-- Headlines -->
      <div>
        <h3 class="font-semibold">Headlines (max 30 chars)</h3>
        <div v-for="(hl, i) in searchAssets.headlines" :key="i">
          <input
            v-model="searchAssets.headlines[i]"
            maxlength="30"
            class="w-full p-2 border rounded-md mt-1"
          />
        </div>
      </div>

      <!-- Descriptions -->
      <div>
        <h3 class="font-semibold">Descriptions (max 90 chars)</h3>
        <div v-for="(desc, i) in searchAssets.descriptions" :key="i">
          <textarea
            v-model="searchAssets.descriptions[i]"
            maxlength="90"
            class="w-full p-2 border rounded-md mt-1"
          ></textarea>
        </div>
      </div>

      <!-- Keywords -->
      <div>
        <h3 class="font-semibold">Keywords</h3>
        <div v-for="(kw, i) in searchAssets.keywords" :key="i" class="flex gap-2 mt-2">
          <input
            v-model="searchAssets.keywords[i].keyword"
            class="flex-1 p-2 border rounded-md"
          />
          <select v-model="searchAssets.keywords[i].match_type" class="p-2 border rounded-md">
            <option>BROAD</option>
            <option>PHRASE</option>
            <option>EXACT</option>
          </select>
        </div>
      </div>
      
      <div class="flex gap-4 pt-4">
        <button @click="step='draft'" class="flex-1 border py-2 rounded-md">
          Back
        </button>
        <button @click="publishCampaign" class="flex-1 bg-black text-white py-2 rounded-md">
          Publish Campaign
        </button>
      </div>

    </div>
  </div>
</template>
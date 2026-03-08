<script setup>
import apiClient from '@/utils/axiosConf'
import { ref, reactive } from 'vue'
import { useGoogleAdsStore } from '@/stores/googleAds'
import { storeToRefs } from 'pinia'
import { puter } from "@heyputer/puter.js"

const googleAdsStore = useGoogleAdsStore()
const { selectedCustomer, manager_id } = storeToRefs(googleAdsStore)

const step = ref('draft')
const loading = ref(false)

const idea = ref('')

/* ===========================
   SEARCH CAMPAIGN DATA
=========================== */

const searchAssets = reactive({
  campaign_name: '',
  ad_group_name: '',
  business_name: '',
  budget: null,
  bidding_strategy: 'MAXIMIZE_CLICKS',

  keywords: [],
  headlines: Array(10).fill(''),
  descriptions: Array(4).fill(''),

  // ✅ USER ENTERED ONLY
  final_url: '',

  site_links: [
    { title: '', url: '' },
    { title: '', url: '' },
    { title: '', url: '' },
    { title: '', url: '' }
  ],

  structured_snippets: [
    {
      header: 'Services',
      values: ['', '', '', '']
    }
  ]
})

/* ===========================
   AI GENERATION (NO URL / EXTENSIONS)
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
- Do NOT include final_url
- Do NOT include sitelinks
- Do NOT include structured snippets

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

    await apiClient.post('/google/search/create', payload)

    console.log("Search Campaign Created")

  } catch (error) {
    console.error("Publish failed:", error.response?.data || error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-[950px] overflow-y-scroll mx-auto p-6 bg-white border rounded-lg space-y-8">

    <!-- ================= DRAFT ================= -->
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
        {{ loading ? "⚙️ Generating..." : "🚀 Generate Search Campaign" }}
      </button>
    </div>

    <!-- ================= REVIEW ================= -->
    <div v-else class="space-y-10">

      <h2 class="text-xl font-semibold">📋 Review Search Campaign</h2>

      <!-- Campaign Info -->
      <div class="space-y-4">
        <div>
          <label class="font-medium">📛 Campaign Name</label>
          <input v-model="searchAssets.campaign_name" class="w-full p-2 border rounded-md"/>
        </div>

        <div>
          <label class="font-medium">📂 Ad Group Name</label>
          <input v-model="searchAssets.ad_group_name" class="w-full p-2 border rounded-md"/>
        </div>

        <div>
          <label class="font-medium">💰 Daily Budget</label>
          <input v-model="searchAssets.budget" type="number" class="w-full p-2 border rounded-md"/>
        </div>
      </div>

      <!-- FINAL URL (USER REQUIRED) -->
      <div>
        <h3 class="font-semibold">🌐 Final URL (Required)</h3>
        <input
          v-model="searchAssets.final_url"
          placeholder="https://yourdomain.com/landing-page"
          class="w-full p-2 border rounded-md mt-2"
        />
      </div>

      <!-- Headlines -->
      <div>
        <h3 class="font-semibold">📰 Headlines (max 30 chars)</h3>
        <div v-for="(hl, i) in searchAssets.headlines" :key="i">
          <input
            v-model="searchAssets.headlines[i]"
            maxlength="30"
            class="w-full p-2 border rounded-md mt-2"
          />
        </div>
      </div>

      <!-- Descriptions -->
      <div>
        <h3 class="font-semibold">📝 Descriptions (max 90 chars)</h3>
        <div v-for="(desc, i) in searchAssets.descriptions" :key="i">
          <textarea
            v-model="searchAssets.descriptions[i]"
            maxlength="90"
            class="w-full p-2 border rounded-md mt-2"
          ></textarea>
        </div>
      </div>

      <!-- Keywords -->
      <div>
        <h3 class="font-semibold">🔑 Keywords</h3>
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

      <!-- SITELINKS -->
      <div>
        <h3 class="font-semibold">🔗 Sitelinks (User Managed)</h3>
        <div
          v-for="(link, i) in searchAssets.site_links"
          :key="i"
          class="grid grid-cols-2 gap-3 mt-3"
        >
          <input
            v-model="link.title"
            placeholder="Sitelink Title"
            class="p-2 border rounded-md"
          />
          <input
            v-model="link.url"
            placeholder="https://yourdomain.com/page"
            class="p-2 border rounded-md"
          />
        </div>
      </div>

      <!-- STRUCTURED SNIPPETS -->
      <div>
        <h3 class="font-semibold">📚 Structured Snippets (User Managed)</h3>

        <label class="block mt-2 font-medium">Header</label>
        <input
          v-model="searchAssets.structured_snippets[0].header"
          class="w-full p-2 border rounded-md"
        />

        <label class="block mt-4 font-medium">Values</label>
        <div
          v-for="(val, i) in searchAssets.structured_snippets[0].values"
          :key="i"
        >
          <input
            v-model="searchAssets.structured_snippets[0].values[i]"
            class="w-full p-2 border rounded-md mt-2"
          />
        </div>
      </div>

      <!-- ACTION BUTTONS -->
      <div class="flex gap-4 pt-6">
        <button
          @click="step='draft'"
          class="flex-1 border py-2 rounded-md"
        >
          ⬅ Back
        </button>
        <button
          @click="publishCampaign"
          class="flex-1 bg-black text-white py-2 rounded-md"
        >
          🚀 Publish Campaign
        </button>
      </div>

    </div>
  </div>
</template>
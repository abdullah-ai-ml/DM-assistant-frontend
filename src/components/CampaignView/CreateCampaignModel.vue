<script setup>
import apiClient from '@/utils/axiosConf'
import { ref, reactive } from 'vue'
import { useGoogleAdsStore } from '@/stores/googleAds'

let googleAdsStore= useGoogleAdsStore()
let {selectedCustomer, manager_id} = storeToRefs(googleAdsStore)

const props = defineProps({
    class: String
})

// UI State
const step = ref('draft') // 'draft' or 'review'
const loading = ref(false)

// Data State
const idea = ref('')
const selectedImage = ref(null)
const newImageUrl = ref('')
// The structure Gemini will fill via the schema
const pmaxAssets = reactive({
    business_name: '',
    headlines: ['', '', ''],
    long_headlines: [''],
    descriptions: ['', ''],
    budget: null,
    call_to_action: 'SHOP_NOW',
    image_prompt: ['','','']
})

const images = ref([])
const handleFileChange = (e) => {
    selectedImage.value = e.target.files[0]
    console.log(selectedImage.value)
}

const handleImageUpload = (type, event) => {
    const file = event.target.files[0]
    if (!file) return

    pmaxAssets.image_assets[type] = {
        file,
        preview: URL.createObjectURL(file)
    }
}

import { puter } from "@heyputer/puter.js";
import { storeToRefs } from 'pinia'

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}


// ===== Reactive State =====
const generatedImages = ref({
    square: null,
    landscape: null,
    portrait: null
})

const generatedFiles = reactive({
    square: null,
    landscape: null,
    portrait: null
})

const resolutionMap = {
    square: "1024x1024",
    landscape: "1792x1024",
    portrait: "1024x1792"
}


// ===== Helper: Convert URL → File =====
const urlToFile = async (url, filename) => {
    const response = await fetch(url)
    const blob = await response.blob()
    return new File([blob], filename, { type: blob.type })
}


// ===== Main Generator =====
const generateImagesForAds = async (assets) => {
    if (!assets.image_prompt) return

    try {
        const types = Object.keys(resolutionMap)

        const imagePromises = types.map(async (type, index) => {

            const prompt =
                assets.image_prompt[index] ||
                assets.image_prompt[0]

            const img = await puter.ai.txt2img(prompt, {
                model: "dall-e-3",
                size: resolutionMap[type],
                quality: "hd"
            })

            // Store preview URL
            generatedImages.value[type] = img.src

            // Convert to real File for Google Ads
            const file = await urlToFile(
                img.src,
                `pmax_${type}_${Date.now()}.png`
            )

            generatedFiles[type] = file
        })

        await Promise.all(imagePromises)

        console.log("All images generated and converted successfully")

    } catch (error) {
        console.error("Batch image generation failed:", error)
    }
}


const getAISuggestions = async () => {
    loading.value = true

    try {

        let imageContent = null

        // Convert image safely (if provided)
        if (selectedImage.value) {
            const base64 = await fileToBase64(selectedImage.value)

            imageContent = {
                type: "image_url",
                image_url: { url: base64 }
            }
        }

        // ---- 1️⃣ Structured Text Generation ----
        const chatResponse = await puter.ai.chat(
            [{
                role: "user",
                content: [
                    {
                        type: "text",
                        text: `
Generate Google Performance Max ad assets.
image_prompt should be based on the idea and to make sure it covers different sceniro and resolution (e.g landscape, square, logo)
also if images prompt also have text that is visible on images.
Make sure to get the details of image such as text and other visual aspects so that when image prompts generate the image it should be correct as the reference image.
Return ONLY valid JSON. No markdown. No explanations.

Schema:
{
  "business_name": "",
  "headlines": ["", "", ""],
  "long_headlines": [""],
  "descriptions": ["", ""],
  "budget": null,
  "call_to_action": "SHOP_NOW",
  "image_prompt": ["","",""]
}

Campaign Idea:
${idea.value}
`
                    },
                    ...(imageContent ? [imageContent] : [])
                ]
            }],
            {
                model: "gpt-4o",
                temperature: 0.7
            }
        )

        // ---- 2️⃣ Safely Extract JSON ----
        let rawContent = chatResponse.message?.content

        // Remove markdown fences if model adds them
        rawContent = rawContent
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim()

        const assets = JSON.parse(rawContent)
        console.log(assets)
        Object.assign(pmaxAssets, assets)

        // ---- 3️⃣ Optional Image Generation ----
        
        generateImagesForAds(assets)
        step.value = "review"

    } catch (error) {
        console.error("Puter AI Generation failed", error)
    } finally {
        loading.value = false
    }
}


// Phase 2: Final Publish to Google Ads
const publishCampaign = async () => {
    loading.value = true

    try {
        const formData = new FormData()

        // ===== Required Text Fields =====
        formData.append('name', pmaxAssets.campaign_name || 'PMax Campaign')
        formData.append('budget', pmaxAssets.budget)
        formData.append('final_url', pmaxAssets.final_url || 'https://example.com')

        formData.append('business_name', pmaxAssets.business_name)

        formData.append('headline_1', pmaxAssets.headlines[0])
        formData.append('headline_2', pmaxAssets.headlines[1])
        formData.append('headline_3', pmaxAssets.headlines[2])

        formData.append('long_headline', pmaxAssets.long_headlines[0])

        formData.append('description_1', pmaxAssets.descriptions[0])
        formData.append('description_2', pmaxAssets.descriptions[1])
        formData.append('customer_id', selectedCustomer)
        formData.append('manager_id', manager_id)
        // ===== Required Images =====
      if (generatedFiles.square) {
            formData.append('square', generatedFiles.square)
        }

        if (generatedFiles.landscape) {
            formData.append('landscape', generatedFiles.landscape)
        }

        // Use square as logo fallback OR generate separate logo
        if (generatedFiles.square) {
            formData.append('logo', generatedFiles.square)
        }

        // ===== Send to Backend =====
       const response = await apiClient.post('/google/ad/create', formData, {
            headers: {
                "Content-Type": undefined
            }
        })
        

        console.log("Campaign Published Successfully",response.data)

    } catch (error) {
        console.error("Publish failed:", error.response?.data || error)
    } finally {
        loading.value = false
    }
}
</script>

<template>
  <div :class="props.class" class="w-[750px] h-full overflow-y-scroll mx-auto p-6 bg-white border border-gray-200 rounded-lg">

    <div v-for="image in images" >
        <img :src="image" alt="">
    </div>
    <!-- ================= DRAFT STEP ================= -->
    <div v-if="step === 'draft'" class="space-y-6">

      <h2 class="text-xl font-semibold text-black">
        💡 Campaign Concept
      </h2>

      <!-- Campaign Idea -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-black">
          📝 Campaign Idea
        </label>
        <textarea 
          v-model="idea" 
          placeholder="Describe your campaign idea..."
          class="w-full p-4 border border-gray-300 rounded-md h-32 outline-none focus:border-black"
        ></textarea>
      </div>

      <!-- Reference Image -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-black">
          🖼 Reference Image
        </label>
        <input 
          type="file" 
          @change="handleFileChange" 
          accept="image/*" 
          class="w-full text-sm border border-gray-300 p-2 rounded-md"
        />
      </div>

      <!-- Generate Button -->
      <button 
        @click="getAISuggestions"
        :disabled="loading || !idea"
        class="w-full py-3 border border-black bg-black text-white rounded-md disabled:opacity-40"
      >
        <span v-if="loading">⏳ Generating Assets...</span>
        <span v-else>🤖 Generate Assets</span>
      </button>

    </div>

    <!-- ================= REVIEW STEP ================= -->
    <div v-else class="space-y-6">

      <h2 class="text-xl font-semibold text-black">
        📋 Review AI Assets
      </h2>


      <!-- Visual Assets -->
    <div class="space-y-6">

        <div
        v-for="(g_image, type) in generatedImages"
        :key="type"
        class="mb-6"
        >
        <label class="text-xs font-semibold text-gray-600">
            {{ type.toUpperCase() }} IMAGE
        </label>

        <img
            v-if="g_image"
            :src="g_image"
            class="mt-2 rounded-md border"
            :class="{
            'w-32 h-32 object-contain': type === 'square',
            'w-full h-40 object-cover': type === 'landscape',
            'w-32 h-52 object-cover': type === 'portrait'
            }"
        />
        </div>

    
    </div>

      <!-- Business Name -->
      <div class="space-y-2">
        <label class="text-xs font-semibold text-gray-600">
          🏢 BUSINESS NAME
        </label>
        <input 
          v-model="pmaxAssets.business_name" 
          class="w-full p-2 border border-gray-300 rounded-md focus:border-black outline-none"
        />
      </div>

      <!-- Headlines -->
      <div class="space-y-2">
        <label class="text-xs font-semibold text-gray-600">
          📰 HEADLINES (max 30 chars)
        </label>
        <div v-for="(hl, i) in pmaxAssets.headlines" :key="i">
          <input 
            v-model="pmaxAssets.headlines[i]" 
            class="w-full p-2 border border-gray-300 rounded-md mb-2 focus:border-black outline-none" 
            maxlength="30" 
          />
        </div>
      </div>

      <!-- Descriptions -->
      <div class="space-y-2">
        <label class="text-xs font-semibold text-gray-600">
          📄 DESCRIPTIONS (max 90 chars)
        </label>
        <div v-for="(desc, i) in pmaxAssets.descriptions" :key="i">
          <textarea 
            v-model="pmaxAssets.descriptions[i]" 
            class="w-full p-2 border border-gray-300 rounded-md mb-2 focus:border-black outline-none" 
            maxlength="90"
          ></textarea>
        </div>
      </div>

      <!-- Budget -->
      <div class="space-y-2">
        <label class="text-xs font-semibold text-gray-600">
          📄 Daily Budget
        </label>
        <div>
         <input
            v-model="pmaxAssets.budget"
            type="number"
            inputmode="decimal"
            pattern="[0-9]"
            class="w-full p-2 border border-gray-300 rounded-md mb-2 focus:border-black outline-none"
            />
        </div>
      </div>
      <!-- Action Buttons -->
      <div class="flex gap-3 pt-4">

        <button 
          @click="step = 'draft'"
          class="flex-1 py-2 border border-gray-400 rounded-md text-black bg-white"
        >
          ← Back
        </button>

        <button 
          @click="publishCampaign"
          class="flex-1 py-2 border border-black bg-black text-white rounded-md"
        >
          🚀 Publish Campaign
        </button>

      </div>

    </div>

  </div>
</template>
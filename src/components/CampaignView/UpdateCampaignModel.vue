<script setup>
import { ref, reactive, watch } from 'vue'
import apiClient from '@/utils/axiosConf'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { useGoogleAdsStore } from '@/stores/googleAds'

const googleAdsStore = useGoogleAdsStore()

const props = defineProps({
  show: {type: Boolean},
  campaignId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close'])

const handleCloseEmit = () => {
  emit("close")
  console.log("worked")
}


const loading  = ref(false)
const kw_loading = ref(false)
const keywords = reactive([])

// ── Fetch keywords whenever modal opens ──────────────────────
const fetchKeywords = async () => {
  if (!props.campaignId) return
  keywords.splice(0)
  kw_loading.value = true
  try {
    const { data } = await apiClient.get(`/google/search/${props.campaignId}/keywords`, {
      params: {
        customer_id: googleAdsStore.selectedCustomer,
        manager_id:  googleAdsStore.manager_id,
      }
    })
    keywords.splice(0)
    data.forEach(k => keywords.push({ ...k }))
  } catch (err) {
    console.error('Failed to fetch keywords', err)
    toast.error('Failed to load keywords')
  } finally {

    kw_loading.value = false
  }
}

watch(() => props.show, (val) => {
  if (val) fetchKeywords()
}, { immediate: true })

// ── Keyword helpers ───────────────────────────────────────────
const addKeyword = () => keywords.push({ keyword: '', match_type: 'BROAD' })

const removeKeyword = (index) => keywords.splice(index, 1)

// ── Save ─────────────────────────────────────────────────────
const updateKeywords = async () => {
  loading.value = true
  try {
    const response = await apiClient.put(
      `/google/search/${props.campaignId}/keywords`,
      {
        manager_id:  googleAdsStore.manager_id,
        customer_id: googleAdsStore.selectedCustomer,
        keywords
      }
    )
    if (response.data.ok) {
      toast.success(response.data.message)
      emit('updated')
      emit('close')
    } else {
      toast.warning(response.data.error)
    }
  } catch (err) {
    console.error('Keyword update failed', err.response?.data || err)
    toast.error('Failed to save keywords')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <!-- Backdrop — click outside to close -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background: rgba(0,0,0,0.75); backdrop-filter: blur(4px);"
        @click="handleCloseEmit"
      >
        <!-- Card — stop propagation so clicks inside don't close -->
        <div
          class="relative w-full max-w-2xl max-h-[88vh] flex flex-col rounded-2xl overflow-hidden"
          style="background: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 25px 60px rgba(0,0,0,0.8);"
          @click.stop
        >

          <!-- ── Header ── -->
          <div class="flex items-center justify-between px-6 py-5" style="border-bottom: 1px solid rgba(255,255,255,0.07);">
            <div>
              <p class="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 mb-0.5">Campaign · {{ campaignId }}</p>
              <h2 class="text-base font-bold text-white">Update Keywords</h2>
            </div>
            <!-- Close button — high contrast white X on dark -->
            <button
              @click="handleCloseEmit"
              class="flex cursor-pointer items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 hover:bg-white hover:text-slate-300 text-white"
              style="border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.06);"
              aria-label="Close"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- ── Body ── -->
          <div class="flex-1 overflow-y-auto px-6 py-5 space-y-3">

            <!-- Loading state -->
            <div v-if="kw_loading && !keywords.length" class="flex flex-col items-center gap-3 py-10">
              <div class="w-6 h-6 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
              <p class="text-sm font-mono text-neutral-500">Loading keywords…</p>
            </div>

            <template v-else>
              <!-- Column headers -->
              <div class="grid grid-cols-[1fr_140px_40px] gap-3 px-1">
                <span class="text-[10px] font-mono uppercase tracking-widest text-neutral-600">Keyword</span>
                <span class="text-[10px] font-mono uppercase tracking-widest text-neutral-600">Match Type</span>
                <span></span>
              </div>

              <!-- Keyword rows -->
              <div
                v-for="(kw, i) in keywords"
                :key="i"
                class="grid grid-cols-[1fr_140px_40px] gap-3 items-center group"
              >
                <input
                  v-model="kw.keyword"
                  placeholder="e.g. plumber near me"
                  class="w-full rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 outline-none transition-all duration-150"
                  style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);"
                  @focus="$event.target.style.borderColor='rgba(255,255,255,0.3)'"
                  @blur="$event.target.style.borderColor='rgba(255,255,255,0.08)'"
                />

                <select
                  v-model="kw.match_type"
                  class="w-full rounded-lg px-3 py-2 text-sm text-white outline-none appearance-none transition-all duration-150 cursor-pointer"
                  style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);"
                >
                  <option value="BROAD"  style="background:#1a1a1a;">BROAD</option>
                  <option value="PHRASE" style="background:#1a1a1a;">PHRASE</option>
                  <option value="EXACT"  style="background:#1a1a1a;">EXACT</option>
                </select>

                <!-- Remove -->
                <button
                  @click="removeKeyword(i)"
                  class="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-150 text-neutral-600 hover:bg-red-500/15 hover:text-red-400"
                  style="border: 1px solid rgba(255,255,255,0.06);"
                 
                  aria-label="Remove keyword"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>

              <!-- Add row -->
              <button
                @click="addKeyword"
                class="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-mono text-neutral-500 hover:text-white transition-all duration-150 mt-1 cursor-pointer"
                style="border: 1px dashed rgba(255,255,255,0.12);"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
                </svg>
                Add Keyword
              </button>

              <!-- Count badge -->
              <p class="text-[10px] font-mono text-neutral-700 text-right px-1">
                {{ keywords.filter(k => k.keyword).length }} of {{ keywords.length }} filled
              </p>
            </template>
          </div>

          <!-- ── Footer ── -->
          <div
            class="flex gap-3 px-6 py-4"
            style="border-top: 1px solid rgba(255,255,255,0.07); background: rgba(0,0,0,0.4);"
          >
            <button
              @click="handleCloseEmit"
              class="flex-1 py-2.5 rounded-xl text-sm font-semibold text-neutral-400 hover:text-white transition-all duration-150 cursor-pointer"
              style="border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03);"
            >
              Cancel
            </button>

            <button
              @click="updateKeywords"
              :disabled="loading || !keywords.filter(k => k.keyword).length"
              class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 cursor-pointer"
              style="background: #ffffff; color: #000000;"
              :style="(loading || !keywords.filter(k => k.keyword).length)
                ? 'opacity:0.35; cursor:not-allowed;'
                : 'opacity:1; cursor:pointer;'"
            >
              <svg
                v-if="loading"
                class="w-4 h-4 animate-spin"
                fill="none" viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" stroke="black" stroke-opacity="0.2" stroke-width="3"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="black" stroke-width="3" stroke-linecap="round"/>
              </svg>
              {{ loading ? 'Saving…' : 'Save Changes' }}
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative {
  transform: scale(0.96) translateY(8px);
  opacity: 0;
}

/* Scrollbar styling */
.overflow-y-auto::-webkit-scrollbar       { width: 4px; }
.overflow-y-auto::-webkit-scrollbar-track { background: transparent; }
.overflow-y-auto::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

/* Fix select option color on light OS themes */
select option { background: #1a1a1a; color: #e5e7eb; }
</style>
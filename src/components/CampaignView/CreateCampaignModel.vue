<script setup>
import apiClient from '@/utils/axiosConf'
import { ref, reactive, computed, nextTick } from 'vue'
import { useGoogleAdsStore } from '@/stores/googleAds'
import { storeToRefs } from 'pinia'
import { puter } from "@heyputer/puter.js"

const emit = defineEmits(['close'])

const googleAdsStore = useGoogleAdsStore()
const { selectedCustomer, manager_id } = storeToRefs(googleAdsStore)

const step        = ref('draft')   // draft | review1 | review2 | review3
const loading     = ref(false)
const idea        = ref('')
const errors      = ref({})        // field-level validation errors
const slideDir    = ref('forward') // forward | backward — controls animation

const locInput        = ref('')
const locSearchResults = ref([])
const locSearchLoading = ref(false)

// ── Constants ─────────────────────────────────────────────────
const DAY_LABELS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const DAY_KEYS   = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY']

const MINUTE_OPTIONS = [
  { label:':00', value:'ZERO'       },
  { label:':15', value:'FIFTEEN'    },
  { label:':30', value:'THIRTY'     },
  { label:':45', value:'FORTY_FIVE' },
]
const HOUR_OPTIONS = Array.from({length:24},(_,i)=>({
  label: String(i).padStart(2,'0')+':00', value: i
}))
const DEVICE_OPTIONS = [
  { label:'🖥 Desktop', value:'DESKTOP' },
  { label:'📱 Mobile',  value:'MOBILE'  },
  { label:'📟 Tablet',  value:'TABLET'  },
]
const BIDDING_STRATEGIES = ['MANUAL_CPC','MAXIMIZE_CLICKS','MAXIMIZE_CONVERSIONS','TARGET_CPA','TARGET_ROAS']
const SNIPPET_HEADERS = ['Services','Products','Brands','Courses','Destinations','Featured hotels','Insurance coverage','Models','Neighborhoods','Shows','Styles','Types']
const LANGUAGES = [
  { label:'English',              resource:'languageConstants/1000' },
  { label:'Spanish',              resource:'languageConstants/1003' },
  { label:'French',               resource:'languageConstants/1002' },
  { label:'German',               resource:'languageConstants/1001' },
  { label:'Portuguese',           resource:'languageConstants/1004' },
  { label:'Japanese',             resource:'languageConstants/1005' },
  { label:'Chinese (Simplified)', resource:'languageConstants/1017' },
  { label:'Arabic',               resource:'languageConstants/1019' },
  { label:'Italian',              resource:'languageConstants/1007' },
  { label:'Dutch',                resource:'languageConstants/1010' },
]

// ── Reactive form state ───────────────────────────────────────
const searchAssets = reactive({
  campaign_name:        '',
  ad_group_name:        '',
  business_name:        '',
  budget_amount_micros: null,
  bidding_strategy:     'MANUAL_CPC',
  keywords:             [],
  headlines:            Array(10).fill(''),
  descriptions:         Array(4).fill(''),
  start_date:           '',
  end_date:             '',
  location_criteria:    [],
  ad_schedules: DAY_KEYS.map((day, i) => ({
    day_of_week:  day,
    start_hour:   6,
    start_minute: 'ZERO',
    end_hour:     22,
    end_minute:   'ZERO',
    enabled:      i < 5,
  })),
  targeted_devices:     ['DESKTOP','MOBILE'],
  language_constant:    'languageConstants/1000',
  final_url:            '',
  site_links: [
    { link_text:'', final_urls:[''] },
    { link_text:'', final_urls:[''] },
    { link_text:'', final_urls:[''] },
    { link_text:'', final_urls:[''] },
  ],
  structured_snippets: [{ header:'Services', values:['','','',''] }],
})

// ── Computed ──────────────────────────────────────────────────
const reviewStep = computed(() =>
  ({ review1:1, review2:2, review3:3 }[step.value] ?? 0)
)

const budgetDisplay = computed({
  get: () => searchAssets.budget_amount_micros != null
    ? searchAssets.budget_amount_micros / 1_000_000 : '',
  set: v => {
    searchAssets.budget_amount_micros = v !== '' ? Math.round(Number(v) * 1_000_000) : null
  }
})

const charCount = s => s?.length ?? 0

const filledHeadlines    = computed(() => searchAssets.headlines.filter(Boolean).length)
const filledDescriptions = computed(() => searchAssets.descriptions.filter(Boolean).length)

// ── Validation ────────────────────────────────────────────────
function validateStep(s) {
  const e = {}

  if (s === 'review1') {
    if (!searchAssets.campaign_name.trim())  e.campaign_name  = 'Campaign name is required'
    if (!searchAssets.ad_group_name.trim())  e.ad_group_name  = 'Ad group name is required'
    if (!searchAssets.business_name.trim())  e.business_name  = 'Business name is required'
    if (!searchAssets.budget_amount_micros || searchAssets.budget_amount_micros < 1_000_000)
      e.budget = 'Minimum daily budget is $1'
    const validKw = searchAssets.keywords.filter(k => k.keyword.trim())
    if (!validKw.length) e.keywords = 'At least one keyword is required'
    if (filledHeadlines.value < 3)    e.headlines    = 'At least 3 headlines required'
    if (filledDescriptions.value < 2) e.descriptions = 'At least 2 descriptions required'
  }

  if (s === 'review2') {
    if (!searchAssets.start_date) e.start_date = 'Start date is required'
  }

  if (s === 'review3') {
    if (!searchAssets.final_url.trim())          e.final_url = 'Landing page URL is required'
    else if (!/^https?:\/\/.+/.test(searchAssets.final_url)) e.final_url = 'Must be a valid URL starting with http(s)://'
  }

  errors.value = e
  return Object.keys(e).length === 0
}

// ── Step navigation with direction ───────────────────────────
async function goTo(target, dir = 'forward') {
  if (dir === 'forward' && !validateStep(step.value)) return
  slideDir.value = dir
  await nextTick()
  step.value = target
  errors.value = {}
}

// ── Location search ───────────────────────────────────────────
let locDebounce = null
async function searchLocations() {
  clearTimeout(locDebounce)
  if (!locInput.value.trim()) { locSearchResults.value = []; return }
  locDebounce = setTimeout(async () => {
    locSearchLoading.value = true
    try {
      const { data } = await apiClient.get('/google/geo-targets', {
        params: { query: locInput.value.trim(), locale:'en', country_code:'', manager_id: manager_id.value }
      })
      locSearchResults.value = data
    } catch { locSearchResults.value = [] }
    finally { locSearchLoading.value = false }
  }, 400)
}
function selectLocation(loc) {
  if (!searchAssets.location_criteria.find(l => l.geo_target_constant === loc.geo_target_constant))
    searchAssets.location_criteria.push({ ...loc })
  locInput.value = ''
  locSearchResults.value = []
}
function removeLocation(i) { searchAssets.location_criteria.splice(i, 1) }

// ── Schedule & device helpers ─────────────────────────────────
function toggleScheduleDay(i) { searchAssets.ad_schedules[i].enabled = !searchAssets.ad_schedules[i].enabled }
function toggleDevice(val) {
  const idx = searchAssets.targeted_devices.indexOf(val)
  if (idx > -1 && searchAssets.targeted_devices.length > 1) searchAssets.targeted_devices.splice(idx, 1)
  else if (idx === -1) searchAssets.targeted_devices.push(val)
}

// ── Keyword helpers ───────────────────────────────────────────
function addKeyword()      { searchAssets.keywords.push({ keyword:'', match_type:'BROAD' }) }
function removeKeyword(i)  { searchAssets.keywords.splice(i, 1) }

// ── AI Generation ─────────────────────────────────────────────
const getAISuggestions = async () => {
  if (!idea.value.trim()) return
  loading.value = true
  try {
    const chatResponse = await puter.ai.chat([{
      role: 'user',
      content: `You are a Google Ads expert. Generate a complete Search Campaign from the idea below.
Return ONLY valid JSON — no markdown fences, no explanation, no preamble.

IMPORTANT RULES:
- Extract the landing page URL from the idea if mentioned, else set final_url to ""
- Extract business name if mentioned, else ""
- If specific locations are mentioned extract them as text names, else empty array
- Headlines MUST be max 30 chars each. If you can't fill one, leave it ""
- Descriptions MUST be max 90 chars each. If you can't fill one, leave it ""
- Only include keywords that match the idea — if not enough info, return fewer
- Sitelink titles max 25 chars, sitelink URLs must start with https:// or ""
- Snippet values max 25 chars each
- Do NOT invent data that isn't in the idea

JSON Schema:
{
  "campaign_name": "",
  "ad_group_name": "",
  "business_name": "",
  "bidding_strategy": "MANUAL_CPC",
  "final_url": "",
  "keywords": [
    {"keyword": "", "match_type": "BROAD"}
  ],
  "headlines": ["","","","","","","","","",""],
  "descriptions": ["","","",""],
  "location_names": [],
  "site_links": [
    {"link_text": "", "final_urls": [""]},
    {"link_text": "", "final_urls": [""]},
    {"link_text": "", "final_urls": [""]},
    {"link_text": "", "final_urls": [""]}
  ],
  "structured_snippets": [{"header": "Services", "values": ["","","",""]}]
}

Campaign Idea:
${idea.value}`
    }], { model:'gpt-4o', temperature:0.5 })

    let raw = chatResponse.message.content
      .replace(/```json/g,'').replace(/```/g,'').trim()
    const parsed = JSON.parse(raw)

    // Apply all fields
    searchAssets.campaign_name    = parsed.campaign_name    ?? ''
    searchAssets.ad_group_name    = parsed.ad_group_name    ?? ''
    searchAssets.business_name    = parsed.business_name    ?? ''
    searchAssets.bidding_strategy = parsed.bidding_strategy ?? 'MANUAL_CPC'
    searchAssets.final_url        = parsed.final_url        ?? ''
    searchAssets.keywords         = (parsed.keywords ?? []).filter(k => k.keyword)
    if (!searchAssets.keywords.length) searchAssets.keywords = [{ keyword:'', match_type:'BROAD' }]

    // Headlines — always keep array of 10
    const hl = parsed.headlines ?? []
    searchAssets.headlines = Array(10).fill('').map((_,i) => hl[i] ?? '')

    // Descriptions — always keep array of 4
    const ds = parsed.descriptions ?? []
    searchAssets.descriptions = Array(4).fill('').map((_,i) => ds[i] ?? '')

    searchAssets.site_links = parsed.site_links ?? searchAssets.site_links
    searchAssets.structured_snippets = parsed.structured_snippets ?? searchAssets.structured_snippets

    slideDir.value = 'forward'
    step.value = 'review1'
    errors.value = {}
  } catch (err) {
    console.error('AI generation failed:', err)
  } finally {
    loading.value = false
  }
}

// ── Publish ───────────────────────────────────────────────────
const publishCampaign = async () => {
  if (!validateStep('review3')) return
  loading.value = true
  try {
    const payload = {
      customer_id:          selectedCustomer.value,
      manager_id:           manager_id.value,
      budget_amount_micros: searchAssets.budget_amount_micros,
      campaign_name:        searchAssets.campaign_name,
      bidding_strategy:     searchAssets.bidding_strategy,
      start_date:           searchAssets.start_date || null,
      end_date:             searchAssets.end_date   || null,
      ad_group_name:        searchAssets.ad_group_name,
      business_name:        searchAssets.business_name,
      final_url:            searchAssets.final_url,
      headlines:            searchAssets.headlines.filter(Boolean),
      descriptions:         searchAssets.descriptions.filter(Boolean),
      keywords:             searchAssets.keywords.filter(k => k.keyword),
      location_criteria:    searchAssets.location_criteria.map(l => ({ geo_target_constant: l.geo_target_constant })),
      language_constant:    searchAssets.language_constant,
      device_criteria:      searchAssets.targeted_devices,
      ad_schedule_criteria: searchAssets.ad_schedules.filter(s => s.enabled).map(s => ({
        day_of_week:  s.day_of_week,
        start_hour:   s.start_hour,
        start_minute: s.start_minute,
        end_hour:     s.end_hour,
        end_minute:   s.end_minute,
      })),
      site_links:           searchAssets.site_links.filter(s => s.link_text && s.final_urls[0]),
      structured_snippets:  searchAssets.structured_snippets.map(sn => ({ header:sn.header, values:sn.values.filter(Boolean) })),
    }
    await apiClient.post('/google/search/create', payload)
    emit('close')
  } catch (err) {
    console.error('Publish failed:', err.response?.data || err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="backdrop">
      <div
        v-if="true"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background:rgba(0,0,0,0.8);backdrop-filter:blur(6px);"
        @click="emit('close')"
      >
        <Transition :name="slideDir === 'forward' ? 'slide-forward' : 'slide-back'" mode="out-in">
          <div
            class="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl overflow-hidden"
            style="background:#0a0a0a;border:1px solid rgba(255,255,255,0.08);box-shadow:0 32px 80px rgba(0,0,0,0.9);"
            @click.stop
            :key="step"
          >
            <!-- Top accent line -->
            <div class="absolute top-0 left-0 right-0 h-px" style="background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);"></div>

            <!-- ══ HEADER ══ -->
            <div
              class="flex items-center justify-between px-6 py-4 flex-shrink-0"
              style="border-bottom:1px solid rgba(255,255,255,0.06);"
            >
              <div class="flex items-center gap-3">
                <div
                  v-if="step === 'draft'"
                  class="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                  style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);"
                >✦</div>
                <!-- Step progress -->
                <div v-else class="flex items-center gap-2">
                  <div
                    v-for="(label, idx) in ['Basics','Schedule','Launch']"
                    :key="idx"
                    class="flex items-center gap-1.5 cursor-default"
                    @click="reviewStep > idx + 1 ? goTo(['review1','review2','review3'][idx],'backward') : null"
                    :class="reviewStep > idx + 1 ? 'cursor-pointer' : ''"
                  >
                    <div
                      class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300"
                      :class="{
                        'text-black': reviewStep === idx + 1,
                        'text-emerald-400 border-emerald-400/40': reviewStep > idx + 1,
                        'text-neutral-600 border-neutral-700': reviewStep < idx + 1,
                      }"
                      :style="reviewStep === idx+1
                        ? 'background:#fff;'
                        : reviewStep > idx+1
                          ? 'background:rgba(52,211,153,0.1);border:1px solid;'
                          : 'background:rgba(255,255,255,0.04);border:1px solid;'"
                    >
                      <svg v-if="reviewStep > idx+1" class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                      </svg>
                      <span v-else>{{ idx+1 }}</span>
                    </div>
                    <span
                      class="text-[10px] font-mono hidden sm:block transition-colors"
                      :class="reviewStep === idx+1 ? 'text-white' : reviewStep > idx+1 ? 'text-emerald-500' : 'text-neutral-700'"
                    >{{ label }}</span>
                    <span v-if="idx < 2" class="text-neutral-800 text-xs mx-0.5">/</span>
                  </div>
                </div>
                <div v-if="step === 'draft'">
                  <p class="text-[9px] font-mono text-neutral-600 uppercase tracking-[0.2em]">AI Campaign Builder</p>
                  <p class="text-sm font-bold text-white">New Search Campaign</p>
                </div>
              </div>

              <!-- Close -->
              <button
                @click="emit('close')"
                class="w-8 h-8 flex items-center justify-center rounded-lg text-white transition-all duration-150 hover:bg-white hover:text-slate-300 cursor-pointer flex-shrink-0"
                style="border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- ══ BODY ══ -->
            <div class="flex-1 overflow-y-auto px-6 py-5 space-y-4 scrollbar-thin">

              <!-- ════ DRAFT ════ -->
              <template v-if="step === 'draft'">
                <div class="flex flex-col items-center gap-6 py-6 text-center max-w-xl mx-auto">
                  <div>
                    <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
                      style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);">✦</div>
                    <h2 class="text-xl font-bold text-white mb-2">Describe Your Campaign</h2>
                    <p class="text-sm text-neutral-500 leading-relaxed">
                      Include your business, target audience, landing page URL and goals.<br>
                      AI will fill every field automatically.
                    </p>
                  </div>

                  <div class="w-full">
                    <textarea
                      v-model="idea"
                      rows="6"
                      placeholder="e.g. Emergency plumbing service in New York targeting homeowners. Landing page: https://acmeplumbing.com/emergency. Focus on fast response and 24/7 availability."
                      class="w-full px-4 py-3 text-sm text-white rounded-xl resize-none outline-none transition-all duration-200 placeholder-neutral-700"
                      style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);"
                      @focus="$event.target.style.borderColor='rgba(255,255,255,0.2)'"
                      @blur="$event.target.style.borderColor='rgba(255,255,255,0.08)'"
                    ></textarea>
                    <p class="text-[10px] font-mono text-neutral-700 text-right mt-1.5">{{ idea.length }} chars</p>
                  </div>

                  <!-- Hint pills -->
                  <div class="flex flex-wrap justify-center gap-1.5">
                    <span v-for="hint in ['Include your URL','Name your business','Describe your audience','Mention your location','State your goal']"
                      :key="hint"
                      class="px-2.5 py-1 rounded-full text-[10px] font-mono text-neutral-600"
                      style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);"
                    >{{ hint }}</span>
                  </div>

                  <button
                    @click="getAISuggestions"
                    :disabled="loading || !idea.trim()"
                    class="w-full flex items-center cursor-pointer justify-center gap-2.5 py-3 rounded-xl text-sm font-bold transition-all duration-200"
                    :style="loading || !idea.trim()
                      ? 'background:rgba(255,255,255,0.05);color:#404040;cursor:not-allowed;border:1px solid rgba(255,255,255,0.06);'
                      : 'background:#ffffff;color:#000000;border:1px solid #ffffff;'"
                  >
                    <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.2" stroke-width="3"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
                    </svg>
                    <span>{{ loading ? 'Generating campaign…' : '✦ Generate with AI' }}</span>
                  </button>
                </div>
              </template>

              <!-- ════ STEP 1: Campaign Basics ════ -->
              <template v-if="step === 'review1'">

                <!-- Campaign Info -->
                <section class="dark-card space-y-3">
                  <p class="sec-head">Campaign Info</p>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="field-wrap">
                      <label class="lbl">Campaign name <span class="req">*</span></label>
                      <input v-model="searchAssets.campaign_name" class="dinp" placeholder="e.g. Brand — NYC Q1"/>
                      <p v-if="errors.campaign_name" class="err">{{ errors.campaign_name }}</p>
                    </div>
                    <div class="field-wrap">
                      <label class="lbl">Ad group name <span class="req">*</span></label>
                      <input v-model="searchAssets.ad_group_name" class="dinp" placeholder="e.g. Core Keywords"/>
                      <p v-if="errors.ad_group_name" class="err">{{ errors.ad_group_name }}</p>
                    </div>
                    <div class="field-wrap">
                      <label class="lbl">Business name <span class="req">*</span></label>
                      <input v-model="searchAssets.business_name" class="dinp" placeholder="e.g. Acme Plumbing"/>
                      <p v-if="errors.business_name" class="err">{{ errors.business_name }}</p>
                    </div>
                    <div class="field-wrap">
                      <label class="lbl">Daily budget (USD) <span class="req">*</span></label>
                      <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 text-sm">$</span>
                        <input v-model.number="budgetDisplay" type="number" min="1" class="dinp pl-7" placeholder="50"/>
                      </div>
                      <p v-if="errors.budget" class="err">{{ errors.budget }}</p>
                    </div>
                  </div>
                  <div class="field-wrap">
                    <label class="lbl">Bidding strategy</label>
                    <select v-model="searchAssets.bidding_strategy" class="dinp">
                      <option v-for="s in BIDDING_STRATEGIES" :key="s" style="background:#1a1a1a;">{{ s }}</option>
                    </select>
                  </div>
                </section>

                <!-- Keywords -->
                <section class="dark-card space-y-2">
                  <div class="flex items-center justify-between">
                    <p class="sec-head">Keywords <span class="req">*</span></p>
                    <span class="text-[10px] font-mono text-neutral-700">{{ searchAssets.keywords.filter(k=>k.keyword).length }} filled</span>
                  </div>
                  <p v-if="errors.keywords" class="err -mt-1">{{ errors.keywords }}</p>
                  <div v-for="(kw, i) in searchAssets.keywords" :key="i" class="flex gap-2 items-center">
                    <input v-model="kw.keyword" class="dinp flex-1" placeholder="Enter keyword"/>
                    <select v-model="kw.match_type" class="dinp w-28 flex-shrink-0">
                      <option style="background:#1a1a1a;">BROAD</option>
                      <option style="background:#1a1a1a;">PHRASE</option>
                      <option style="background:#1a1a1a;">EXACT</option>
                    </select>
                    <button @click="removeKeyword(i)"
                      class="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg text-neutral-600 hover:bg-red-500/10 hover:text-red-400 transition-all"
                      style="border:1px solid rgba(255,255,255,0.06);">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                  <button @click="addKeyword" class="w-full py-2 rounded-lg text-xs font-mono text-neutral-600 hover:text-neutral-400 transition-colors"
                    style="border:1px dashed rgba(255,255,255,0.08);">+ Add keyword</button>
                </section>

                <!-- Headlines -->
                <section class="dark-card">
                  <div class="flex items-center justify-between mb-3">
                    <p class="sec-head">Headlines <span class="text-neutral-700 normal-case tracking-normal font-normal ml-1">max 30 chars · min 3</span></p>
                    <span class="text-[10px] font-mono" :class="filledHeadlines >= 3 ? 'text-emerald-500' : 'text-amber-500'">
                      {{ filledHeadlines }}/10 filled
                    </span>
                  </div>
                  <p v-if="errors.headlines" class="err mb-2">{{ errors.headlines }}</p>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div v-for="(hl, i) in searchAssets.headlines" :key="i" class="field-wrap">
                      <label class="lbl">Headline {{ i+1 }} <span v-if="i < 3" class="req">*</span></label>
                      <input v-model="searchAssets.headlines[i]" :maxlength="30" class="dinp"
                        :placeholder="'Headline '+(i+1)"
                        :style="searchAssets.headlines[i] && 'border-color:rgba(255,255,255,0.15)'"
                      />
                      <span class="text-[10px] text-right font-mono"
                        :class="charCount(searchAssets.headlines[i]) >= 28 ? 'text-amber-500' : 'text-neutral-700'">
                        {{ charCount(searchAssets.headlines[i]) }}/30
                      </span>
                    </div>
                  </div>
                </section>

                <!-- Descriptions -->
                <section class="dark-card">
                  <div class="flex items-center justify-between mb-3">
                    <p class="sec-head">Descriptions <span class="text-neutral-700 normal-case tracking-normal font-normal ml-1">max 90 chars · min 2</span></p>
                    <span class="text-[10px] font-mono" :class="filledDescriptions >= 2 ? 'text-emerald-500' : 'text-amber-500'">
                      {{ filledDescriptions }}/4 filled
                    </span>
                  </div>
                  <p v-if="errors.descriptions" class="err mb-2">{{ errors.descriptions }}</p>
                  <div class="space-y-3">
                    <div v-for="(d, i) in searchAssets.descriptions" :key="i" class="field-wrap">
                      <label class="lbl">Description {{ i+1 }} <span v-if="i < 2" class="req">*</span></label>
                      <textarea v-model="searchAssets.descriptions[i]" :maxlength="90" rows="2"
                        class="dinp resize-none" :placeholder="'Description '+(i+1)"></textarea>
                      <span class="text-[10px] text-right font-mono"
                        :class="charCount(searchAssets.descriptions[i]) >= 85 ? 'text-amber-500' : 'text-neutral-700'">
                        {{ charCount(searchAssets.descriptions[i]) }}/90
                      </span>
                    </div>
                  </div>
                </section>

                <div class="flex gap-3 pt-1">
                  <button @click="goTo('draft','backward')" class="btn-ghost flex-1">← Back</button>
                  <button @click="goTo('review2','forward')" class="btn-white flex-1">Continue →</button>
                </div>
              </template>

              <!-- ════ STEP 2: Schedule & Targeting ════ -->
              <template v-if="step === 'review2'">

                <!-- Dates -->
                <section class="dark-card">
                  <p class="sec-head mb-3">Campaign Dates</p>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="field-wrap">
                      <label class="lbl">Start date <span class="req">*</span></label>
                      <input v-model="searchAssets.start_date" type="date" class="dinp"/>
                      <p v-if="errors.start_date" class="err">{{ errors.start_date }}</p>
                    </div>
                    <div class="field-wrap">
                      <label class="lbl">End date <span class="text-neutral-700">(optional)</span></label>
                      <input v-model="searchAssets.end_date" type="date" class="dinp"/>
                    </div>
                  </div>
                </section>

                <!-- Location -->
                <section class="dark-card space-y-3">
                  <p class="sec-head">Location Targeting</p>
                  <div class="relative">
                    <input v-model="locInput" @input="searchLocations" class="dinp pr-9"
                      placeholder="Search city, region, country…" autocomplete="off"/>
                    <svg v-if="locSearchLoading" class="w-3.5 h-3.5 animate-spin text-neutral-600 absolute right-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.3" stroke-width="3"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
                    </svg>
                  </div>
                  <div v-if="locSearchResults.length" class="rounded-xl overflow-hidden" style="border:1px solid rgba(255,255,255,0.08);">
                    <button v-for="loc in locSearchResults.slice(0,6)" :key="loc.geo_target_constant"
                      @click="selectLocation(loc)"
                      class="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors hover:bg-white/5"
                      style="border-bottom:1px solid rgba(255,255,255,0.04);">
                      <span class="text-neutral-300">{{ loc.display_name }}</span>
                      <span class="text-[10px] font-mono text-neutral-700">{{ loc.geo_target_constant }}</span>
                    </button>
                  </div>
                  <div v-if="searchAssets.location_criteria.length" class="flex flex-wrap gap-1.5">
                    <span v-for="(loc, i) in searchAssets.location_criteria" :key="i"
                      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs text-neutral-300"
                      style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);">
                      {{ loc.display_name }}
                      <button @click="removeLocation(i)" class="text-neutral-600 hover:text-red-400 transition-colors">×</button>
                    </span>
                  </div>
                  <p v-else class="text-[11px] font-mono text-neutral-700">No locations — targeting globally</p>
                </section>

                <!-- Ad Schedule -->
                <section class="dark-card space-y-3">
                  <p class="sec-head">Ad Schedule</p>
                  <div class="grid grid-cols-7 gap-1.5">
                    <button v-for="(s, i) in searchAssets.ad_schedules" :key="i"
                      @click="toggleScheduleDay(i)"
                      class="py-2 text-[11px] font-bold rounded-lg border transition-all duration-200"
                      :style="s.enabled
                        ? 'background:#ffffff;color:#000;border-color:#ffffff;'
                        : 'background:rgba(255,255,255,0.03);color:#404040;border-color:rgba(255,255,255,0.08);'"
                    >{{ DAY_LABELS[i] }}</button>
                  </div>
                  <div class="space-y-1.5">
                    <template v-for="(s, i) in searchAssets.ad_schedules" :key="s.day_of_week">
                      <div v-if="s.enabled" class="grid grid-cols-[48px_1fr_16px_1fr] items-center gap-2 rounded-lg px-3 py-2"
                        style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);">
                        <span class="text-[11px] font-bold text-neutral-400">{{ DAY_LABELS[i] }}</span>
                        <div class="flex gap-1">
                          <select v-model.number="s.start_hour" class="dinp-sm flex-1">
                            <option v-for="h in HOUR_OPTIONS" :key="h.value" :value="h.value" style="background:#1a1a1a;">{{ h.label }}</option>
                          </select>
                          <select v-model="s.start_minute" class="dinp-sm w-14">
                            <option v-for="m in MINUTE_OPTIONS" :key="m.value" :value="m.value" style="background:#1a1a1a;">{{ m.label }}</option>
                          </select>
                        </div>
                        <span class="text-[10px] text-neutral-700 text-center">→</span>
                        <div class="flex gap-1">
                          <select v-model.number="s.end_hour" class="dinp-sm flex-1">
                            <option v-for="h in HOUR_OPTIONS" :key="h.value" :value="h.value" style="background:#1a1a1a;">{{ h.label }}</option>
                          </select>
                          <select v-model="s.end_minute" class="dinp-sm w-14">
                            <option v-for="m in MINUTE_OPTIONS" :key="m.value" :value="m.value" style="background:#1a1a1a;">{{ m.label }}</option>
                          </select>
                        </div>
                      </div>
                    </template>
                    <p v-if="!searchAssets.ad_schedules.some(s=>s.enabled)" class="text-[11px] font-mono text-neutral-700 text-center py-2">
                      No days selected — runs all day every day
                    </p>
                  </div>
                </section>

                <!-- Language & Devices -->
                <section class="dark-card">
                  <p class="sec-head mb-3">Language & Devices</p>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="field-wrap">
                      <label class="lbl">Language</label>
                      <select v-model="searchAssets.language_constant" class="dinp">
                        <option v-for="l in LANGUAGES" :key="l.resource" :value="l.resource" style="background:#1a1a1a;">{{ l.label }}</option>
                      </select>
                      <span class="text-[10px] font-mono text-neutral-700 mt-0.5">{{ searchAssets.language_constant }}</span>
                    </div>
                    <div class="field-wrap">
                      <label class="lbl">Devices</label>
                      <div class="flex flex-wrap gap-2 mt-1">
                        <button v-for="d in DEVICE_OPTIONS" :key="d.value"
                          @click="toggleDevice(d.value)"
                          class="px-3 py-1.5 text-xs rounded-full border transition-all duration-200"
                          :style="searchAssets.targeted_devices.includes(d.value)
                            ? 'background:#fff;color:#000;border-color:#fff;'
                            : 'background:rgba(255,255,255,0.03);color:#606060;border-color:rgba(255,255,255,0.08);'"
                        >{{ d.label }}</button>
                      </div>
                    </div>
                  </div>
                </section>

                <div class="flex gap-3 pt-1">
                  <button @click="goTo('review1','backward')" class="btn-ghost flex-1">← Back</button>
                  <button @click="goTo('review3','forward')" class="btn-white flex-1">Continue →</button>
                </div>
              </template>

              <!-- ════ STEP 3: URLs & Extensions ════ -->
              <template v-if="step === 'review3'">

                <!-- Final URL -->
                <section class="dark-card">
                  <p class="sec-head mb-3">Landing Page URL <span class="req">*</span></p>
                  <div class="field-wrap">
                    <label class="lbl">Final URL</label>
                    <input v-model="searchAssets.final_url" type="url" class="dinp"
                      placeholder="https://yourdomain.com/landing-page"
                      :style="errors.final_url ? 'border-color:rgba(248,113,113,0.5);' : ''"
                    />
                    <p v-if="errors.final_url" class="err">{{ errors.final_url }}</p>
                  </div>
                </section>

                <!-- Sitelinks -->
                <section class="dark-card">
                  <p class="sec-head mb-3">Sitelinks <span class="text-neutral-700 normal-case tracking-normal font-normal ml-1">optional</span></p>
                  <div v-for="(link, i) in searchAssets.site_links" :key="i" class="flex items-start gap-2 mb-2.5">
                    <div class="w-5 h-5 mt-2.5 shrink-0 rounded flex items-center justify-center text-[10px] font-bold text-neutral-700"
                      style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);">{{ i+1 }}</div>
                    <div class="flex-1 flex flex-col sm:flex-row gap-2">
                      <input v-model="link.link_text" class="dinp flex-1" placeholder="Link title (25 chars)" :maxlength="25"/>
                      <input v-model="link.final_urls[0]" type="url" class="dinp flex-1" placeholder="https://yourdomain.com/page"/>
                    </div>
                  </div>
                </section>

                <!-- Structured Snippets -->
                <section class="dark-card">
                  <p class="sec-head mb-3">Structured Snippets <span class="text-neutral-700 normal-case tracking-normal font-normal ml-1">optional</span></p>
                  <div class="field-wrap mb-3">
                    <label class="lbl">Header</label>
                    <select v-model="searchAssets.structured_snippets[0].header" class="dinp">
                      <option v-for="h in SNIPPET_HEADERS" :key="h" style="background:#1a1a1a;">{{ h }}</option>
                    </select>
                  </div>
                  <label class="lbl mb-2 block">Values</label>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input v-for="(val, i) in searchAssets.structured_snippets[0].values" :key="i"
                      v-model="searchAssets.structured_snippets[0].values[i]"
                      class="dinp" :maxlength="25" :placeholder="'Value '+(i+1)"/>
                  </div>
                </section>

                <div class="flex gap-3 pt-1 pb-1">
                  <button @click="goTo('review2','backward')" class="btn-ghost flex-1">← Back</button>
                  <button
                    @click="publishCampaign"
                    :disabled="loading"
                    class="btn-white flex-1 flex items-center justify-center gap-2"
                    :style="loading ? 'opacity:0.5;cursor:not-allowed;' : ''"
                  >
                    <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="black" stroke-opacity="0.2" stroke-width="3"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="black" stroke-width="3" stroke-linecap="round"/>
                    </svg>
                    {{ loading ? 'Publishing…' : '🚀 Publish Campaign' }}
                  </button>
                </div>
              </template>

            </div><!-- /body -->
          </div><!-- /card -->
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ── Dark input ── */
.dinp {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 0.5rem;
  outline: none;
  color: #e5e7eb;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  transition: border-color 0.15s ease;
  font-family: inherit;
}
.dinp::placeholder { color: #3f3f3f; }
.dinp:focus { border-color: rgba(255,255,255,0.25); }
textarea.dinp { resize: none; }
select.dinp { appearance: none; cursor: pointer; }

.dinp-sm {
  padding: 0.3rem 0.5rem;
  font-size: 0.7rem;
  border-radius: 0.375rem;
  outline: none;
  color: #d1d5db;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  transition: border-color 0.15s;
  font-family: inherit;
  appearance: none;
}
.dinp-sm:focus { border-color: rgba(255,255,255,0.2); }

/* ── Card section ── */
.dark-card {
  border-radius: 0.875rem;
  padding: 1rem 1.125rem;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
}

.sec-head {
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #404040;
  padding-bottom: 0.625rem;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  margin-bottom: 0;
}

.field-wrap { display:flex; flex-direction:column; gap:0.25rem; }
.lbl { font-size:0.7rem; font-weight:600; color:#5a5a5a; }
.req { color: #f87171; }
.err { font-size:0.68rem; color:#f87171; margin-top:0.125rem; }

/* ── Buttons ── */
.btn-white {
  padding: 0.625rem 1.25rem;
  background: #ffffff;
  color: #000000;
  font-size: 0.875rem;
  font-weight: 700;
  border: none;
  border-radius: 0.625rem;
  cursor: pointer;
  transition: opacity 0.15s;
  font-family: inherit;
}
.btn-white:hover { opacity: 0.9; }

.btn-ghost {
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  color: #4a4a4a;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 0.625rem;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}
.btn-ghost:hover { color:#9a9a9a; border-color:rgba(255,255,255,0.15); }

/* ── Scrollbar ── */
.scrollbar-thin::-webkit-scrollbar       { width: 4px; }
.scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
.scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius:2px; }

/* ── Step slide transitions ── */
.slide-forward-enter-active,
.slide-forward-leave-active,
.slide-back-enter-active,
.slide-back-leave-active {
  transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.slide-forward-enter-from { opacity:0; transform: translateX(28px) scale(0.98); }
.slide-forward-leave-to   { opacity:0; transform: translateX(-28px) scale(0.98); }
.slide-back-enter-from    { opacity:0; transform: translateX(-28px) scale(0.98); }
.slide-back-leave-to      { opacity:0; transform: translateX(28px) scale(0.98); }

/* ── Backdrop fade ── */
.backdrop-enter-active, .backdrop-leave-active { transition: opacity 0.2s ease; }
.backdrop-enter-from, .backdrop-leave-to       { opacity: 0; }

/* ── date input color fix ── */
input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.4); cursor:pointer; }
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button { opacity:0.3; }
</style>
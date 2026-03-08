<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useGoogleAdsStore } from '@/stores/googleAds'
import {
  Chart,
  BarController, BarElement,
  LineController, LineElement, PointElement,
  RadarController,
  DoughnutController, ArcElement,
  CategoryScale, LinearScale, RadialLinearScale,
  Tooltip, Legend, Filler
} from 'chart.js'

Chart.register(
  BarController, BarElement,
  LineController, LineElement, PointElement,
  RadarController,
  DoughnutController, ArcElement,
  CategoryScale, LinearScale, RadialLinearScale,
  Tooltip, Legend, Filler
)

// ── Store & Route ──────────────────────────────────────────────
const route  = useRoute()
const store  = useGoogleAdsStore()

// const campaign = computed(() =>
//   store.campaigns.find(c => String(c.id) === String(route.params.campaign_id))
// )
// ✅ Option A — wrap in ref (recommended, easy swap back to computed later)
const campaign = ref({
  id: 1,
  name: "Summer Sale 2024",
  platform: "Google Ads",
  status: "enabled",
  budget: 5000,
  spent: 3742.50,
  impressions: 124800,
  clicks: 3120,
  conversions: 87,
  ctr: 2.50,
  cpc: 1.20,
  cvr: 2.79,
  cpa: 43.02,
  performance: "up"
})
// ── Helpers ───────────────────────────────────────────────────
const fmt = v => Number(v ?? 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })

const spentPct = computed(() =>
  campaign.value?.budget > 0
    ? (campaign.value.spent / campaign.value.budget) * 100
    : 0
)

const statusStyle = s => ({
  'border-emerald-500/30 text-emerald-400 bg-emerald-500/10': s === 'enabled',
  'border-yellow-500/30 text-yellow-400 bg-yellow-500/10':   s === 'paused',
  'border-red-500/30 text-red-400 bg-red-500/10':            s === 'removed',
})

const perfStyle = p => ({
  'border-emerald-500/30 text-emerald-400 bg-emerald-500/10': p === 'up',
  'border-blue-500/30 text-blue-400 bg-blue-500/10':          p === 'stable',
  'border-amber-500/30 text-amber-400 bg-amber-500/10':       p === 'learning',
  'border-red-500/30 text-red-400 bg-red-500/10':             p === 'down',
})

// ── Metric cards ──────────────────────────────────────────────
const metricCards = [
  { key: 'impressions', label: 'Impressions', color: '#818cf8', format: v => Number(v ?? 0).toLocaleString() },
  { key: 'clicks',      label: 'Clicks',      color: '#38bdf8', format: v => Number(v ?? 0).toLocaleString() },
  { key: 'conversions', label: 'Conv.',        color: '#34d399', format: v => Number(v ?? 0).toLocaleString() },
  { key: 'spent',       label: 'Spent',        color: '#f472b6', format: v => `$${fmt(v)}` },
  { key: 'ctr',         label: 'CTR',          color: '#a78bfa', format: v => `${v}%` },
  { key: 'cvr',         label: 'CVR',          color: '#22d3ee', format: v => `${v}%` },
  { key: 'cpc',         label: 'CPC',          color: '#fb923c', format: v => `$${v}` },
  { key: 'cpa',         label: 'CPA',          color: campaign.value?.cpa > 50 ? '#f87171' : '#34d399', format: v => `$${v}` },
]

// ── Chart refs & instances ────────────────────────────────────
const funnelRef     = ref(null)
const efficiencyRef = ref(null)
const cpaRef        = ref(null)
const radarRef      = ref(null)
const donutRef      = ref(null)
const chartInst     = {}

const donutLegend = ref([])

const GRID = '#ffffff08'
const TICK = '#475569'

const tooltipDefaults = {
  backgroundColor: '#0f172a',
  borderColor: '#1e293b',
  borderWidth: 1,
  titleColor: '#94a3b8',
  bodyColor: '#e2e8f0',
  padding: 10,
  cornerRadius: 8,
}

function destroy(key) {
  if (chartInst[key]) { chartInst[key].destroy(); delete chartInst[key] }
}

function buildAll() {
  const c = campaign.value
  if (!c) return

  // 1. Funnel Bar
  destroy('funnel')
  chartInst.funnel = new Chart(funnelRef.value, {
    type: 'bar',
    data: {
      labels: ['Impressions', 'Clicks', 'Conversions'],
      datasets: [{
        label: c.name,
        data: [c.impressions, c.clicks, c.conversions],
        backgroundColor: ['#818cf855', '#38bdf855', '#34d39955'],
        borderColor:     ['#818cf8',   '#38bdf8',   '#34d399'],
        borderWidth: 2,
        borderRadius: 8,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false }, tooltip: { ...tooltipDefaults } },
      scales: {
        x: { ticks: { color: TICK }, grid: { color: GRID } },
        y: { ticks: { color: TICK }, grid: { color: GRID } }
      }
    }
  })

  // 2. Efficiency grouped bar
  destroy('efficiency')
  chartInst.efficiency = new Chart(efficiencyRef.value, {
    type: 'bar',
    data: {
      labels: ['CTR (%)', 'CVR (%)', 'CPC ($)', 'CPA ($)'],
      datasets: [{
        label: 'Value',
        data: [c.ctr, c.cvr, c.cpc, c.cpa],
        backgroundColor: ['#a78bfa55', '#22d3ee55', '#fb923c55', c.cpa > 50 ? '#f8717155' : '#34d39955'],
        borderColor:     ['#a78bfa',   '#22d3ee',   '#fb923c',   c.cpa > 50 ? '#f87171'   : '#34d399'],
        borderWidth: 2,
        borderRadius: 8,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false }, tooltip: { ...tooltipDefaults } },
      scales: {
        x: { ticks: { color: TICK }, grid: { color: GRID } },
        y: { ticks: { color: TICK }, grid: { color: GRID } }
      }
    }
  })

  // 3. CPA vs threshold
  destroy('cpa')
  chartInst.cpa = new Chart(cpaRef.value, {
    type: 'bar',
    data: {
      labels: ['CPA'],
      datasets: [
        {
          label: 'Your CPA',
          data: [c.cpa],
          backgroundColor: c.cpa > 50 ? '#FF658488' : '#43D9AD88',
          borderColor:     c.cpa > 50 ? '#FF6584'   : '#43D9AD',
          borderWidth: 2,
          borderRadius: 8,
          barThickness: 56,
        },
        {
          label: '$50 Target',
          data: [50],
          type: 'line',
          borderColor: '#FFB347',
          borderWidth: 2,
          borderDash: [6, 4],
          pointRadius: 0,
          fill: false,
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: '#94a3b8', font: { size: 11 } } },
        tooltip: { ...tooltipDefaults, callbacks: { label: ctx => ` $${ctx.raw}` } }
      },
      scales: {
        x: { ticks: { color: TICK }, grid: { color: GRID } },
        y: {
          max: Math.max(c.cpa, 50) * 1.3,
          ticks: { color: TICK, callback: v => `$${v}` },
          grid: { color: GRID }
        }
      }
    }
  })

  // 4. Radar
  destroy('radar')
  chartInst.radar = new Chart(radarRef.value, {
    type: 'radar',
    data: {
      labels: ['CTR', 'CVR', 'CPC', 'CPA'],
      datasets: [{
        label: c.name,
        data: [c.ctr, c.cvr, c.cpc, c.cpa],
        borderColor: '#818cf8',
        backgroundColor: '#818cf822',
        borderWidth: 2,
        pointBackgroundColor: '#818cf8',
        pointRadius: 4,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false }, tooltip: { ...tooltipDefaults } },
      scales: {
        r: {
          angleLines: { color: GRID },
          grid: { color: GRID },
          pointLabels: { color: '#94a3b8', font: { size: 11 } },
          ticks: { color: TICK, backdropColor: 'transparent', stepSize: 10 }
        }
      }
    }
  })

  // 5. Doughnut
  destroy('donut')
  const remaining = Math.max(c.budget - c.spent, 0)
  donutLegend.value = [
    { label: 'Spent',     value: c.spent,     color: '#f472b6' },
    { label: 'Remaining', value: remaining, color: '#1e293b' },
  ]
  chartInst.donut = new Chart(donutRef.value, {
    type: 'doughnut',
    data: {
      labels: ['Spent', 'Remaining'],
      datasets: [{
        data: [c.spent, remaining],
        backgroundColor: ['#f472b688', '#1e293b'],
        borderColor:     ['#f472b6',   '#334155'],
        borderWidth: 2,
        hoverOffset: 6,
      }]
    },
    options: {
      responsive: true,
      cutout: '72%',
      plugins: {
        legend: { display: false },
        tooltip: { ...tooltipDefaults, callbacks: { label: ctx => ` $${fmt(ctx.raw)}` } }
      }
    }
  })
}

onMounted(() => { if (campaign.value) buildAll() })

watch(campaign, (val) => { if (val) buildAll() })

onBeforeUnmount(() => Object.values(chartInst).forEach(c => c.destroy()))
</script>

<template>
  <div class="min-h-screen bg-[#060912] text-slate-200 font-['Syne',sans-serif]">

    <!-- Google Fonts
    <component :is="'style'">
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');
    </component> -->

    <!-- NOT FOUND -->
    <div v-if="!campaign" class="flex flex-col items-center justify-center min-h-screen gap-4">
      <p class="text-5xl font-black text-slate-700">404</p>
      <p class="text-slate-500 font-mono text-sm">Campaign #{{ $route.params.id }} not found in store</p>
      <button @click="$router.back()" class="mt-2 px-5 py-2 rounded-full border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200 transition-all text-sm">
        ← Go Back
      </button>
    </div>

    <template v-else>
      <!-- TOP NAV BAR -->
      <header class="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl bg-[#060912]/80">
        <div class="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">
          <button
            @click="$router.back()"
            class="flex items-center gap-2 text-slate-500 hover:text-slate-200 transition-colors text-sm font-mono"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            campaigns
          </button>
          <span class="text-slate-700">/</span>
          <span class="text-slate-300 font-semibold truncate max-w-[260px]">{{ campaign.name }}</span>
          <span
            class="ml-auto px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest border"
            :class="statusStyle(campaign.status)"
          >{{ campaign.status }}</span>
          <span
            class="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest border"
            :class="perfStyle(campaign.performance)"
          >{{ campaign.performance }}</span>
        </div>
      </header>

      <!-- HERO METRICS ROW -->
      <section class="max-w-7xl mx-auto px-6 pt-10 pb-6">
        <h1 class="text-3xl font-black tracking-tight text-white mb-1">{{ campaign.name }}</h1>
        <p class="text-slate-500 font-mono text-xs mb-8">{{ campaign.platform }} · ID {{ campaign.id }}</p>

        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <div
            v-for="(m, i) in metricCards"
            :key="m.key"
            class="relative rounded-xl border border-white/5 bg-white/[0.03] p-4 overflow-hidden group hover:border-white/10 hover:bg-white/[0.05] transition-all duration-300"
            :style="{ animationDelay: `${i * 60}ms` }"
          >
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              :style="{ background: `radial-gradient(ellipse at top left, ${m.color}12, transparent 70%)` }">
            </div>
            <p class="text-[10px] font-mono uppercase tracking-widest mb-2" :style="{ color: m.color }">{{ m.label }}</p>
            <p class="text-xl font-black text-white">{{ m.format(campaign[m.key]) }}</p>
          </div>
        </div>
      </section>

      <!-- BUDGET PROGRESS BAR -->
      <section class="max-w-7xl mx-auto px-6 mb-8">
        <div class="rounded-xl border border-white/5 bg-white/[0.03] p-5">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-mono text-slate-500 uppercase tracking-widest">Budget Utilisation</span>
            <span class="text-xs font-mono text-slate-400">
              ${{ fmt(campaign.spent) }} <span class="text-slate-600">of</span> ${{ fmt(campaign.budget) }}
            </span>
          </div>
          <div class="h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-1000 ease-out"
              :style="{
                width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%`,
                background: spentPct > 90 ? '#FF6584' : spentPct > 70 ? '#FFB347' : '#43D9AD'
              }"
            ></div>
          </div>
          <p class="text-right text-[10px] font-mono mt-1" :class="spentPct > 90 ? 'text-red-400' : 'text-slate-600'">
            {{ spentPct.toFixed(1) }}% used
          </p>
        </div>
      </section>

      <!-- CHARTS GRID -->
      <section class="max-w-7xl mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-5">

        <!-- Funnel Chart -->
        <div class="lg:col-span-2 rounded-2xl border border-white/5 bg-white/[0.03] p-6">
          <div class="flex items-baseline gap-3 mb-5">
            <h3 class="text-sm font-bold text-white">Conversion Funnel</h3>
            <span class="text-[10px] font-mono text-slate-600 uppercase tracking-widest">impressions → clicks → conversions</span>
          </div>
          <canvas ref="funnelRef" class="max-h-52"></canvas>
        </div>

        <!-- CTR / CVR / CPC / CPA grouped -->
        <div class="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
          <div class="flex items-baseline gap-3 mb-5">
            <h3 class="text-sm font-bold text-white">Efficiency Metrics</h3>
            <span class="text-[10px] font-mono text-slate-600 uppercase tracking-widest">CTR · CVR · CPC · CPA</span>
          </div>
          <canvas ref="efficiencyRef" class="max-h-56"></canvas>
        </div>

        <!-- CPA vs Threshold -->
        <div class="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
          <div class="flex items-baseline gap-3 mb-2">
            <h3 class="text-sm font-bold text-white">CPA vs Threshold</h3>
            <span class="text-[10px] font-mono text-slate-600 uppercase tracking-widest">$50 target line</span>
          </div>
          <div class="flex items-center gap-4 mb-4">
            <div class="flex items-center gap-2">
              <span class="inline-block w-3 h-3 rounded-full" :style="{ background: campaign.cpa > 50 ? '#FF6584' : '#43D9AD' }"></span>
              <span class="text-xs font-mono text-slate-500">CPA: ${{ campaign.cpa }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="inline-block w-6 h-px bg-amber-400"></span>
              <span class="text-xs font-mono text-slate-500">Target: $50</span>
            </div>
          </div>
          <canvas ref="cpaRef" class="max-h-52"></canvas>
        </div>

        <!-- Radar: CTR vs CVR -->
        <div class="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
          <div class="flex items-baseline gap-3 mb-5">
            <h3 class="text-sm font-bold text-white">Rate Comparison</h3>
            <span class="text-[10px] font-mono text-slate-600 uppercase tracking-widest">radar view</span>
          </div>
          <div class="flex justify-center">
            <canvas ref="radarRef" class="max-h-56 max-w-xs"></canvas>
          </div>
        </div>

        <!-- Spend Doughnut -->
        <div class="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
          <div class="flex items-baseline gap-3 mb-5">
            <h3 class="text-sm font-bold text-white">Spend Breakdown</h3>
            <span class="text-[10px] font-mono text-slate-600 uppercase tracking-widest">spent vs remaining</span>
          </div>
          <div class="flex items-center justify-center gap-10">
            <canvas ref="donutRef" class="max-h-48 max-w-[180px]"></canvas>
            <div class="flex flex-col gap-3">
              <div v-for="item in donutLegend" :key="item.label" class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-sm flex-shrink-0" :style="{ background: item.color }"></span>
                <span class="text-xs font-mono text-slate-400">{{ item.label }}</span>
                <span class="text-xs font-bold text-white ml-1">${{ fmt(item.value) }}</span>
              </div>
            </div>
          </div>
        </div>

      </section>
    </template>
  </div>
</template>


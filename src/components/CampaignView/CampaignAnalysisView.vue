<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute } from 'vue-router'
// import { useGoogleAdsStore } from '@/stores/googleAds'
import {
  Chart,
  BarController, BarElement,
  LineController, LineElement, PointElement,
  DoughnutController, ArcElement,
  CategoryScale, LinearScale,
  Tooltip, Legend, Filler
} from 'chart.js'

Chart.register(
  BarController, BarElement,
  LineController, LineElement, PointElement,
  DoughnutController, ArcElement,
  CategoryScale, LinearScale,
  Tooltip, Legend, Filler
)

// ── Store & Route ─────────────────────────────────────────────
const route = useRoute()
// const store = useGoogleAdsStore()
// const campaign = computed(() =>
//   store.campaigns.find(c => String(c.id) === String(route.params.campaign_id))
// )

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
  performance: "up",
  daily: [
    { date: "2024-01-15", impressions: 16200, clicks: 390, conversions: 10, cost: 468.00,  ctr: 2.41, cpc: 1.20, cvr: 2.56, cpa: 46.80 },
    { date: "2024-01-16", impressions: 18500, clicks: 462, conversions: 14, cost: 554.40,  ctr: 2.50, cpc: 1.20, cvr: 3.03, cpa: 39.60 },
    { date: "2024-01-17", impressions: 20100, clicks: 523, conversions: 16, cost: 627.60,  ctr: 2.60, cpc: 1.20, cvr: 3.06, cpa: 39.23 },
    { date: "2024-01-18", impressions: 19400, clicks: 504, conversions: 13, cost: 604.80,  ctr: 2.60, cpc: 1.20, cvr: 2.58, cpa: 46.52 },
    { date: "2024-01-19", impressions: 17800, clicks: 436, conversions: 11, cost: 523.20,  ctr: 2.45, cpc: 1.20, cvr: 2.52, cpa: 47.56 },
    { date: "2024-01-20", impressions: 14200, clicks: 312, conversions:  8, cost: 374.40,  ctr: 2.20, cpc: 1.20, cvr: 2.56, cpa: 46.80 },
    { date: "2024-01-21", impressions: 18600, clicks: 493, conversions: 15, cost: 591.60,  ctr: 2.65, cpc: 1.20, cvr: 3.04, cpa: 39.44 },
  ]
})

// ── Helpers ───────────────────────────────────────────────────
const fmt    = v => Number(v ?? 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
const fmtDay = d => {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const dt   = new Date(d + 'T00:00:00')
  return `${days[dt.getDay()]} ${dt.getDate()}`
}
const isWeekend = d => {
  const dt = new Date(d + 'T00:00:00')
  return dt.getDay() === 0 || dt.getDay() === 6
}

const spentPct = computed(() =>
  campaign.value?.budget > 0 ? (campaign.value.spent / campaign.value.budget) * 100 : 0
)
const labels = computed(() => campaign.value?.daily?.map(d => fmtDay(d.date)) ?? [])

const statusStyle = s => ({
  'border-emerald-500/40 text-emerald-400 bg-emerald-500/10': s === 'enabled',
  'border-yellow-500/40 text-yellow-400 bg-yellow-500/10':   s === 'paused',
  'border-red-500/40 text-red-400 bg-red-500/10':            s === 'removed',
})
const perfStyle = p => ({
  'border-emerald-500/40 text-emerald-400 bg-emerald-500/10': p === 'up',
  'border-blue-500/40 text-blue-400 bg-blue-500/10':          p === 'stable',
  'border-amber-500/40 text-amber-400 bg-amber-500/10':       p === 'learning',
  'border-red-500/40 text-red-400 bg-red-500/10':             p === 'down',
})

// ── Stat Cards ────────────────────────────────────────────────
const statCards = computed(() => {
  const c = campaign.value
  if (!c) return []
  return [
    { label: 'Impressions', value: Number(c.impressions).toLocaleString(), color: '#818cf8' },
    { label: 'Clicks',      value: Number(c.clicks).toLocaleString(),      color: '#38bdf8' },
    { label: 'Conversions', value: Number(c.conversions).toLocaleString(), color: '#34d399' },
    { label: 'Spent',       value: `$${fmt(c.spent)}`,                     color: '#f472b6' },
    { label: 'CTR',         value: `${c.ctr}%`,                            color: '#a78bfa' },
    { label: 'CVR',         value: `${c.cvr}%`,                            color: '#22d3ee' },
    { label: 'CPC',         value: `$${c.cpc}`,                            color: '#fb923c' },
    { label: 'CPA',         value: `$${c.cpa}`,                            color: c.cpa > 50 ? '#f87171' : '#34d399' },
  ]
})

// ── Chart Refs ────────────────────────────────────────────────
const spendRef   = ref(null)
const trafficRef = ref(null)
const convRef    = ref(null)
const ctrRef     = ref(null)
const costRef    = ref(null)
const cvrRef     = ref(null)
const summaryRef = ref(null)
const donutRef   = ref(null)
const chartInst  = {}
const donutLegend = ref([])

// ── Chart Defaults ────────────────────────────────────────────
const GRID = '#ffffff07'
const TICK = '#475569'
const tip = {
  backgroundColor: '#0d1424',
  borderColor: '#1e293b',
  borderWidth: 1,
  titleColor: '#94a3b8',
  bodyColor: '#e2e8f0',
  padding: 12,
  cornerRadius: 8,
}
const scaleX = { ticks: { color: TICK, font: { size: 10 } }, grid: { color: GRID } }
const scaleY = { ticks: { color: TICK, font: { size: 10 } }, grid: { color: GRID } }

function destroy(key) {
  if (chartInst[key]) { chartInst[key].destroy(); delete chartInst[key] }
}

// ── Build All Charts ──────────────────────────────────────────
function buildAll() {
  const c = campaign.value
  if (!c?.daily?.length) return
  const d   = c.daily
  const lbl = labels.value

  // 1 ── Spend Pace
  destroy('spend')
  chartInst.spend = new Chart(spendRef.value, {
    type: 'line',
    data: {
      labels: lbl,
      datasets: [{
        label: 'Daily Spend ($)',
        data: d.map(x => x.cost),
        borderColor: '#f472b6',
        backgroundColor: 'rgba(244,114,182,0.10)',
        borderWidth: 2.5, fill: true, tension: 0.4,
        pointBackgroundColor: '#f472b6', pointRadius: 4, pointHoverRadius: 7,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false }, tooltip: { ...tip, callbacks: { label: ctx => ` $${fmt(ctx.raw)}` } } },
      scales: { x: scaleX, y: { ...scaleY, ticks: { ...scaleY.ticks, callback: v => `$${v}` } } }
    }
  })

  // 2 ── Traffic Trend (dual axis)
  destroy('traffic')
  chartInst.traffic = new Chart(trafficRef.value, {
    type: 'line',
    data: {
      labels: lbl,
      datasets: [
        {
          label: 'Impressions',
          data: d.map(x => x.impressions),
          borderColor: '#818cf8', backgroundColor: 'rgba(129,140,248,0.08)',
          borderWidth: 2.5, fill: true, tension: 0.4,
          pointBackgroundColor: '#818cf8', pointRadius: 4, pointHoverRadius: 7,
          yAxisID: 'y',
        },
        {
          label: 'Clicks',
          data: d.map(x => x.clicks),
          borderColor: '#38bdf8', backgroundColor: 'transparent',
          borderWidth: 2, tension: 0.4,
          pointBackgroundColor: '#38bdf8', pointRadius: 4, pointHoverRadius: 7,
          yAxisID: 'y1',
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: 'index' },
      plugins: { legend: { labels: { color: '#94a3b8', font: { size: 10 }, boxWidth: 12 } }, tooltip: { ...tip } },
      scales: {
        x: scaleX,
        y:  { ...scaleY, position: 'left' },
        y1: { ...scaleY, position: 'right', grid: { drawOnChartArea: false } }
      }
    }
  })

  // 3 ── Conversions + CVR overlay
  destroy('conv')
  chartInst.conv = new Chart(convRef.value, {
    type: 'bar',
    data: {
      labels: lbl,
      datasets: [
        {
          label: 'Conversions',
          data: d.map(x => x.conversions),
          backgroundColor: d.map(x => isWeekend(x.date) ? '#34d39940' : '#34d39980'),
          borderColor: '#34d399', borderWidth: 2, borderRadius: 6,
          yAxisID: 'y',
        },
        {
          label: 'CVR (%)',
          data: d.map(x => x.cvr),
          type: 'line',
          borderColor: '#22d3ee', backgroundColor: 'transparent',
          borderWidth: 2, tension: 0.4,
          pointBackgroundColor: '#22d3ee', pointRadius: 4,
          yAxisID: 'y1',
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: 'index' },
      plugins: { legend: { labels: { color: '#94a3b8', font: { size: 10 }, boxWidth: 12 } }, tooltip: { ...tip } },
      scales: {
        x: scaleX,
        y:  { ...scaleY, position: 'left' },
        y1: { ...scaleY, position: 'right', grid: { drawOnChartArea: false }, ticks: { ...scaleY.ticks, callback: v => `${v}%` } }
      }
    }
  })

  // 4 ── CTR Trend
  destroy('ctr')
  chartInst.ctr = new Chart(ctrRef.value, {
    type: 'line',
    data: {
      labels: lbl,
      datasets: [{
        label: 'CTR (%)',
        data: d.map(x => x.ctr),
        borderColor: '#a78bfa', backgroundColor: 'rgba(167,139,250,0.10)',
        borderWidth: 2.5, fill: true, tension: 0.4,
        pointBackgroundColor: d.map(x => isWeekend(x.date) ? '#f472b6' : '#a78bfa'),
        pointRadius: 5, pointHoverRadius: 8, pointBorderColor: 'transparent',
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false }, tooltip: { ...tip, callbacks: { label: ctx => ` ${ctx.raw}%` } } },
      scales: { x: scaleX, y: { ...scaleY, ticks: { ...scaleY.ticks, callback: v => `${v}%` } } }
    }
  })

  // 5 ── CPC vs CPA + $50 threshold
  destroy('cost')
  chartInst.cost = new Chart(costRef.value, {
    type: 'line',
    data: {
      labels: lbl,
      datasets: [
        {
          label: 'CPC ($)',
          data: d.map(x => x.cpc),
          borderColor: '#fb923c', backgroundColor: 'transparent',
          borderWidth: 2.5, tension: 0.3,
          pointBackgroundColor: '#fb923c', pointRadius: 4,
        },
        {
          label: 'CPA ($)',
          data: d.map(x => x.cpa),
          borderColor: '#f87171', backgroundColor: 'rgba(248,113,113,0.08)',
          borderWidth: 2.5, fill: true, tension: 0.4,
          pointBackgroundColor: '#f87171', pointRadius: 4,
        },
        {
          label: '$50 Target',
          data: d.map(() => 50),
          borderColor: '#FFB347', borderDash: [6, 4],
          borderWidth: 1.5, pointRadius: 0, fill: false,
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: 'index' },
      plugins: { legend: { labels: { color: '#94a3b8', font: { size: 10 }, boxWidth: 12 } }, tooltip: { ...tip, callbacks: { label: ctx => ` $${ctx.raw}` } } },
      scales: { x: scaleX, y: { ...scaleY, ticks: { ...scaleY.ticks, callback: v => `$${v}` } } }
    }
  })

  // 6 ── CVR Trend
  destroy('cvr')
  chartInst.cvr = new Chart(cvrRef.value, {
    type: 'line',
    data: {
      labels: lbl,
      datasets: [{
        label: 'CVR (%)',
        data: d.map(x => x.cvr),
        borderColor: '#22d3ee', backgroundColor: 'rgba(34,211,238,0.10)',
        borderWidth: 2.5, fill: true, tension: 0.4,
        pointBackgroundColor: '#22d3ee', pointRadius: 5, pointHoverRadius: 8, pointBorderColor: 'transparent',
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false }, tooltip: { ...tip, callbacks: { label: ctx => ` ${ctx.raw}%` } } },
      scales: { x: scaleX, y: { ...scaleY, ticks: { ...scaleY.ticks, callback: v => `${v}%` } } }
    }
  })

  // 7 ── Daily Summary grouped bar
  destroy('summary')
  chartInst.summary = new Chart(summaryRef.value, {
    type: 'bar',
    data: {
      labels: lbl,
      datasets: [
        {
          label: 'Impressions',
          data: d.map(x => x.impressions),
          backgroundColor: d.map(x => isWeekend(x.date) ? '#818cf833' : '#818cf866'),
          borderColor: '#818cf8', borderWidth: 1.5, borderRadius: 4, yAxisID: 'y',
        },
        {
          label: 'Clicks',
          data: d.map(x => x.clicks),
          backgroundColor: d.map(x => isWeekend(x.date) ? '#38bdf833' : '#38bdf866'),
          borderColor: '#38bdf8', borderWidth: 1.5, borderRadius: 4, yAxisID: 'y',
        },
        {
          label: 'Conversions',
          data: d.map(x => x.conversions),
          backgroundColor: d.map(x => isWeekend(x.date) ? '#34d39933' : '#34d39966'),
          borderColor: '#34d399', borderWidth: 1.5, borderRadius: 4, yAxisID: 'y1',
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: 'index' },
      plugins: { legend: { labels: { color: '#94a3b8', font: { size: 10 }, boxWidth: 12 } }, tooltip: { ...tip } },
      scales: {
        x: scaleX,
        y:  { ...scaleY, position: 'left' },
        y1: { ...scaleY, position: 'right', grid: { drawOnChartArea: false } }
      }
    }
  })

  // 8 ── Spend Doughnut
  destroy('donut')
  const remaining = Math.max(c.budget - c.spent, 0)
  donutLegend.value = [
    { label: 'Spent',     value: c.spent,   color: '#f472b6' },
    { label: 'Remaining', value: remaining, color: '#334155' },
  ]
  chartInst.donut = new Chart(donutRef.value, {
    type: 'doughnut',
    data: {
      labels: ['Spent', 'Remaining'],
      datasets: [{
        data: [c.spent, remaining],
        backgroundColor: ['#f472b688', '#1e293b'],
        borderColor: ['#f472b6', '#334155'],
        borderWidth: 2, hoverOffset: 6,
      }]
    },
    options: {
      responsive: true, cutout: '74%',
      plugins: {
        legend: { display: false },
        tooltip: { ...tip, callbacks: { label: ctx => ` $${fmt(ctx.raw)}` } }
      }
    }
  })
}

onMounted(async () => {
  await nextTick()
  buildAll()
})

onBeforeUnmount(() => Object.values(chartInst).forEach(c => c.destroy()))
</script>

<template>
  <div class="min-h-screen bg-[#060912] text-slate-200" style="font-family: 'DM Sans', ui-sans-serif, sans-serif;">

    <!-- 404 State -->
    <div v-if="!campaign" class="flex flex-col items-center justify-center min-h-screen gap-4">
      <p class="text-6xl font-black text-slate-800">404</p>
      <p class="text-slate-600 text-sm font-mono">Campaign not found in store</p>
      <button @click="$router.back()" class="px-5 py-2 rounded-full border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition text-sm">
        ← Go Back
      </button>
    </div>

    <template v-else>

      <!-- ── STICKY HEADER ── -->
      <header class="sticky top-0 z-50 border-b border-white/5 bg-[#060912]/90 backdrop-blur-xl">
        <div class="max-w-7xl mx-auto px-6 h-14 flex items-center gap-3">
          <button @click="$router.back()" class="flex items-center gap-1.5 text-slate-500 hover:text-white transition text-sm font-mono">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            campaigns
          </button>
          <span class="text-slate-700 text-xs">/</span>
          <span class="text-slate-300 text-sm font-semibold truncate max-w-[200px]">{{ campaign.name }}</span>
          <div class="ml-auto flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest border" :class="statusStyle(campaign.status)">
              {{ campaign.status }}
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest border" :class="perfStyle(campaign.performance)">
              {{ campaign.performance }}
            </span>
          </div>
        </div>
      </header>

      <!-- ── PAGE TITLE ── -->
      <div class="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <p class="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-1">{{ campaign.platform }} · #{{ campaign.id }}</p>
        <h1 class="text-2xl font-black tracking-tight text-white">{{ campaign.name }}</h1>
        <p class="text-xs text-slate-500 mt-1 font-mono">7-day performance window</p>
      </div>

      <!-- ── STAT CARDS ── -->
      <section class="max-w-7xl mx-auto px-6 pb-6">
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          <div
            v-for="m in statCards"
            :key="m.label"
            class="relative rounded-xl border border-white/5 bg-white/[0.025] px-3 py-3.5 overflow-hidden group hover:border-white/10 transition-all duration-300 cursor-default"
          >
            <div
              class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              :style="{ background: `radial-gradient(ellipse at 0% 0%, ${m.color}18, transparent 65%)` }"
            ></div>
            <p class="text-[9px] font-mono uppercase tracking-widest mb-1.5" :style="{ color: m.color }">{{ m.label }}</p>
            <p class="text-lg font-black text-white leading-none">{{ m.value }}</p>
          </div>
        </div>
      </section>

      <!-- ── BUDGET BAR ── -->
      <section class="max-w-7xl mx-auto px-6 mb-6">
        <div class="rounded-xl border border-white/5 bg-white/[0.025] px-5 py-4">
          <div class="flex items-center justify-between mb-2.5">
            <span class="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Budget Utilisation</span>
            <span class="text-[10px] font-mono text-slate-400">
              ${{ fmt(campaign.spent) }} <span class="text-slate-700">of</span> ${{ fmt(campaign.budget) }}
            </span>
          </div>
          <div class="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-1000 ease-out"
              :style="{
                width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%`,
                background: spentPct > 90 ? '#f87171' : spentPct > 70 ? '#FFB347' : '#34d399'
              }"
            ></div>
          </div>
          <p class="text-right text-[10px] font-mono mt-1.5 text-slate-600">{{ spentPct.toFixed(1) }}% used</p>
        </div>
      </section>

      <!-- ── CHARTS GRID ── -->
      <section class="max-w-7xl mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-4">

        <!-- 1. Spend Pace — full width -->
        <div class="lg:col-span-2 rounded-2xl border border-white/5 bg-white/[0.025] p-5">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-[10px] font-mono text-pink-400 uppercase tracking-widest mb-0.5">Spend Pace</p>
              <h3 class="text-sm font-bold text-white">Daily Spend Over 7 Days</h3>
            </div>
            <span class="text-[10px] font-mono text-slate-600">area · daily cost ($)</span>
          </div>
          <canvas ref="spendRef" class="max-h-48"></canvas>
        </div>

        <!-- 2. Traffic Trend -->
        <div class="rounded-2xl border border-white/5 bg-white/[0.025] p-5">
          <div class="mb-4">
            <p class="text-[10px] font-mono text-indigo-400 uppercase tracking-widest mb-0.5">Traffic</p>
            <h3 class="text-sm font-bold text-white">Impressions vs Clicks</h3>
          </div>
          <canvas ref="trafficRef" class="max-h-52"></canvas>
        </div>

        <!-- 3. Conversions + CVR -->
        <div class="rounded-2xl border border-white/5 bg-white/[0.025] p-5">
          <div class="mb-4">
            <p class="text-[10px] font-mono text-emerald-400 uppercase tracking-widest mb-0.5">Conversions</p>
            <h3 class="text-sm font-bold text-white">Daily Conversions + CVR</h3>
          </div>
          <canvas ref="convRef" class="max-h-52"></canvas>
        </div>

        <!-- 4. CTR Trend -->
        <div class="rounded-2xl border border-white/5 bg-white/[0.025] p-5">
          <div class="mb-3">
            <p class="text-[10px] font-mono text-violet-400 uppercase tracking-widest mb-0.5">Click-Through Rate</p>
            <h3 class="text-sm font-bold text-white">CTR Trend</h3>
          </div>
          <div class="flex items-center gap-4 mb-3">
            <span class="text-xs font-mono text-slate-500">
              Peak <span class="text-violet-400 font-bold">{{ Math.max(...campaign.daily.map(d => d.ctr)) }}%</span>
            </span>
            <span class="text-xs font-mono text-slate-500">
              Low <span class="text-red-400 font-bold">{{ Math.min(...campaign.daily.map(d => d.ctr)) }}%</span>
            </span>
            <span class="text-[10px] font-mono text-slate-600 ml-auto flex items-center gap-1">
              <span class="inline-block w-2 h-2 rounded-full bg-pink-400"></span> weekend
            </span>
          </div>
          <canvas ref="ctrRef" class="max-h-48"></canvas>
        </div>

        <!-- 5. CPC vs CPA + threshold -->
        <div class="rounded-2xl border border-white/5 bg-white/[0.025] p-5">
          <div class="mb-4">
            <p class="text-[10px] font-mono text-orange-400 uppercase tracking-widest mb-0.5">Cost Efficiency</p>
            <h3 class="text-sm font-bold text-white">CPC vs CPA vs $50 Target</h3>
          </div>
          <canvas ref="costRef" class="max-h-52"></canvas>
        </div>

        <!-- 6. CVR Trend -->
        <div class="rounded-2xl border border-white/5 bg-white/[0.025] p-5">
          <div class="mb-4">
            <p class="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-0.5">Conversion Rate</p>
            <h3 class="text-sm font-bold text-white">CVR Trend</h3>
          </div>
          <canvas ref="cvrRef" class="max-h-48"></canvas>
        </div>

        <!-- 7. Daily Summary — full width -->
        <div class="lg:col-span-2 rounded-2xl border border-white/5 bg-white/[0.025] p-5">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-0.5">Weekly Overview</p>
              <h3 class="text-sm font-bold text-white">Daily Summary — All Metrics</h3>
            </div>
            <span class="text-[10px] font-mono text-slate-600 flex items-center gap-1.5">
              <span class="inline-block w-2.5 h-2.5 rounded-sm opacity-30 bg-slate-400"></span>faded = weekend
            </span>
          </div>
          <canvas ref="summaryRef" class="max-h-52"></canvas>
        </div>

        <!-- 8. Spend Doughnut -->
        <div class="rounded-2xl border border-white/5 bg-white/[0.025] p-5">
          <div class="mb-5">
            <p class="text-[10px] font-mono text-pink-400 uppercase tracking-widest mb-0.5">Budget</p>
            <h3 class="text-sm font-bold text-white">Spend Breakdown</h3>
          </div>
          <div class="flex items-center justify-center gap-10">
            <canvas ref="donutRef" style="max-height:160px;max-width:160px;"></canvas>
            <div class="flex flex-col gap-3">
              <div v-for="item in donutLegend" :key="item.label" class="flex items-center gap-2.5">
                <span class="w-2.5 h-2.5 rounded-sm flex-shrink-0" :style="{ background: item.color }"></span>
                <span class="text-xs font-mono text-slate-400">{{ item.label }}</span>
                <span class="text-xs font-bold text-white ml-1">${{ fmt(item.value) }}</span>
              </div>
              <div class="mt-2 pt-2 border-t border-white/5">
                <p class="text-[10px] font-mono text-slate-600">Total Budget</p>
                <p class="text-sm font-bold text-white">${{ fmt(campaign.budget) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 9. Auto Insights Card -->
        <div class="rounded-2xl border border-white/5 bg-white/[0.025] p-5">
          <div class="mb-4">
            <p class="text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-0.5">Auto Insights</p>
            <h3 class="text-sm font-bold text-white">7-Day Takeaways</h3>
          </div>
          <ul class="space-y-3.5">
            <li class="flex items-start gap-2.5">
              <span class="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
              <span class="text-xs text-slate-400 leading-relaxed">
                CTR improved from
                <span class="text-white font-semibold">{{ campaign.daily[0].ctr }}%</span> →
                <span class="text-emerald-400 font-semibold">{{ campaign.daily[campaign.daily.length - 1].ctr }}%</span>
                — ad relevance trending up.
              </span>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="mt-1 w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0"></span>
              <span class="text-xs text-slate-400 leading-relaxed">
                Saturday dip —
                <span class="text-yellow-400 font-semibold">{{ campaign.daily.find(d => isWeekend(d.date))?.impressions?.toLocaleString() }}</span>
                impressions vs weekday avg of
                <span class="text-white font-semibold">
                  {{ Math.round(campaign.daily.filter(d => !isWeekend(d.date)).reduce((a, b) => a + b.impressions, 0) / campaign.daily.filter(d => !isWeekend(d.date)).length).toLocaleString() }}
                </span>.
              </span>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" :class="campaign.cpa < 50 ? 'bg-emerald-400' : 'bg-red-400'"></span>
              <span class="text-xs text-slate-400 leading-relaxed">
                Avg CPA
                <span :class="campaign.cpa < 50 ? 'text-emerald-400' : 'text-red-400'" class="font-semibold">${{ campaign.cpa }}</span>
                — {{ campaign.cpa < 50 ? 'below $50 target ✓' : 'above $50 target — optimise bids ✗' }}
              </span>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
              <span class="text-xs text-slate-400 leading-relaxed">
                Budget at <span class="text-white font-semibold">{{ spentPct.toFixed(1) }}%</span> utilisation —
                pace is <span class="font-semibold" :class="spentPct > 90 ? 'text-red-400' : spentPct > 70 ? 'text-amber-400' : 'text-blue-400'">
                  {{ spentPct > 90 ? 'over-delivering' : spentPct > 70 ? 'on track' : 'under-delivering' }}
                </span>.
              </span>
            </li>
          </ul>
        </div>

      </section>
    </template>
  </div>
</template>
<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useGoogleAdsStore } from "@/stores/googleAds";
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

const googleAds = useGoogleAdsStore();
const { campaigns } = storeToRefs(googleAds);

const totalBudget = computed(() =>
  (campaigns.value ?? []).reduce((acc, c) => acc + Number(c?.budget ?? 0), 0)
);
const totalSpent = computed(() =>
  (campaigns.value ?? []).reduce((acc, c) => acc + Number(c?.spent ?? 0), 0)
);
const remaining = computed(() => Math.max(totalBudget.value - totalSpent.value, 0));
const spendPct = computed(() => (totalBudget.value > 0 ? (totalSpent.value / totalBudget.value) * 100 : 0));

// "Top performing" heuristic using your payload:
// prioritize conversions, then CTR, then CVR, then lowest CPA
const topCampaign = computed(() => {
  const list = (campaigns.value ?? []).slice();
  if (!list.length) return null;

  list.sort((a, b) => {
    const conv = Number(b?.conversions ?? 0) - Number(a?.conversions ?? 0);
    if (conv !== 0) return conv;
    const ctr = Number(b?.ctr ?? 0) - Number(a?.ctr ?? 0);
    if (ctr !== 0) return ctr;
    const cvr = Number(b?.cvr ?? 0) - Number(a?.cvr ?? 0);
    if (cvr !== 0) return cvr;
    return Number(a?.cpa ?? Infinity) - Number(b?.cpa ?? Infinity);
  });

  return list[0];
});

const donutRef = ref(null);
let donutChart = null;

// Spend efficiency chart (top campaigns by spend; CPA overlay)
import {
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler
} from "chart.js";

Chart.register(
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler
);

const efficiencyRef = ref(null);
let efficiencyChart = null;

const topBySpend = computed(() =>
  (campaigns.value ?? [])
    .slice()
    .sort((a, b) => Number(b?.spent ?? 0) - Number(a?.spent ?? 0))
    .slice(0, 6)
);

const GRID = "#ffffff07";
const TICK = "#475569";

const tip = {
  backgroundColor: "#0d1424",
  borderColor: "#1e293b",
  borderWidth: 1,
  titleColor: "#94a3b8",
  bodyColor: "#e2e8f0",
  padding: 12,
  cornerRadius: 8
};

function buildDonut() {
  if (!donutRef.value) return;
  if (donutChart) donutChart.destroy();

  donutChart = new Chart(donutRef.value, {
    type: "doughnut",
    data: {
      labels: ["Spent", "Remaining"],
      datasets: [
        {
          data: [totalSpent.value, remaining.value],
          backgroundColor: ["#f472b688", "#1e293b"],
          borderColor: ["#f472b6", "#334155"],
          borderWidth: 2,
          hoverOffset: 6
        }
      ]
    },
    options: {
      responsive: true,
      cutout: "74%",
      plugins: {
        legend: { display: false },
        tooltip: {
          ...tip,
          callbacks: {
            label: (ctx) => ` $${Number(ctx.raw ?? 0).toLocaleString()}`
          }
        }
      }
    }
  });
}

function buildEfficiency() {
  if (!efficiencyRef.value) return;
  if (efficiencyChart) efficiencyChart.destroy();

  const labels = topBySpend.value.map((c) => c.name);
  const spend = topBySpend.value.map((c) => Number(c?.spent ?? 0));
  const cpa = topBySpend.value.map((c) => Number(c?.cpa ?? 0));

  efficiencyChart = new Chart(efficiencyRef.value, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          type: "bar",
          label: "Spend ($)",
          data: spend,
          backgroundColor: "rgba(244,114,182,0.18)",
          borderColor: "#f472b6",
          borderWidth: 2,
          borderRadius: 8,
          yAxisID: "y"
        },
        {
          type: "line",
          label: "CPA ($)",
          data: cpa,
          borderColor: "#38bdf8",
          backgroundColor: "rgba(56,189,248,0.10)",
          borderWidth: 2,
          tension: 0.35,
          pointBackgroundColor: "#38bdf8",
          pointRadius: 4,
          yAxisID: "y1"
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: "index" },
      plugins: {
        legend: { labels: { color: "#94a3b8", font: { size: 10 }, boxWidth: 12 } },
        tooltip: { ...tip, callbacks: { label: (ctx) => ` $${Number(ctx.raw ?? 0).toLocaleString()}` } }
      },
      scales: {
        x: { ticks: { color: TICK, font: { size: 10 } }, grid: { color: GRID } },
        y: {
          position: "left",
          ticks: { color: TICK, font: { size: 10 }, callback: (v) => `$${v}` },
          grid: { color: GRID }
        },
        y1: {
          position: "right",
          ticks: { color: TICK, font: { size: 10 }, callback: (v) => `$${v}` },
          grid: { drawOnChartArea: false }
        }
      }
    }
  });
}

onMounted(buildDonut);
watch([totalSpent, remaining], () => buildDonut());
onMounted(buildEfficiency);
watch([campaigns], () => buildEfficiency(), { deep: true });

onBeforeUnmount(() => {
  donutChart?.destroy();
  efficiencyChart?.destroy();
});
</script>

<template>
  <section class="grid grid-cols-1 lg:grid-cols-12 gap-4">
    <!-- Spend vs Budget (account) -->
    <div class="lg:col-span-7 rounded-2xl border border-white/5 bg-white/[0.025] p-5">
      <div class="flex items-center justify-between mb-4">
        <div>
          <p class="text-[10px] font-mono text-pink-400 uppercase tracking-widest mb-0.5">
            Spend vs Budget
          </p>
          <h3 class="text-sm font-bold text-white">Account summary (from campaigns)</h3>
        </div>
        <span class="text-[10px] font-mono text-slate-600">doughnut · totals</span>
      </div>

      <div class="flex flex-col md:flex-row items-center gap-8">
        <div class="flex items-center justify-center">
          <canvas ref="donutRef" style="max-height:180px;max-width:180px;"></canvas>
        </div>

        <div class="flex-1 w-full">
          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
              <p class="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Budget</p>
              <p class="text-lg font-black text-white">${{ totalBudget.toLocaleString() }}</p>
            </div>
            <div class="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
              <p class="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Spent</p>
              <p class="text-lg font-black text-white">${{ totalSpent.toLocaleString() }}</p>
            </div>
          </div>

          <div class="mt-4">
            <div class="flex items-center justify-between mb-2.5">
              <span class="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Utilisation</span>
              <span class="text-[10px] font-mono text-slate-500">
                {{ spendPct.toFixed(1) }}%
              </span>
            </div>
            <div class="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-700 ease-out"
                :style="{
                  width: `${Math.min(spendPct, 100)}%`,
                  background: spendPct > 90 ? '#f87171' : spendPct > 70 ? '#FFB347' : '#34d399'
                }"
              ></div>
            </div>
          </div>

          <p v-if="!campaigns?.length" class="mt-3 text-xs font-mono text-slate-600">
            Select an account to load campaigns.
          </p>
        </div>
      </div>
    </div>

    <!-- Top performing campaign -->
    <div class="lg:col-span-5 rounded-2xl border border-white/5 bg-white/[0.025] p-5">
      <div class="flex items-center justify-between mb-4">
        <div>
          <p class="text-[10px] font-mono text-emerald-400 uppercase tracking-widest mb-0.5">
            Top performing
          </p>
          <h3 class="text-sm font-bold text-white">Best campaign (selected account)</h3>
        </div>
        <span class="text-[10px] font-mono text-slate-600">ranked by conversions</span>
      </div>

      <div v-if="topCampaign" class="rounded-2xl border border-white/5 bg-white/[0.02] p-4 space-y-3">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="text-white font-semibold truncate">{{ topCampaign.name }}</p>
            <p class="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
              id: {{ topCampaign.id }} · {{ topCampaign.platform }}
            </p>
          </div>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest border border-emerald-500/40 text-emerald-400 bg-emerald-500/10">
            {{ topCampaign.status }}
          </span>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5">
            <p class="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Budget</p>
            <p class="text-sm font-black text-white">${{ Number(topCampaign.budget ?? 0).toLocaleString() }}</p>
          </div>
          <div class="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5">
            <p class="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Spent</p>
            <p class="text-sm font-black text-white">${{ Number(topCampaign.spent ?? 0).toLocaleString() }}</p>
          </div>
          <div class="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5">
            <p class="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Conversions</p>
            <p class="text-sm font-black text-white">{{ Number(topCampaign.conversions ?? 0).toLocaleString() }}</p>
          </div>
          <div class="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5">
            <p class="text-[10px] font-mono text-slate-600 uppercase tracking-widest">CPA</p>
            <p class="text-sm font-black text-white">${{ Number(topCampaign.cpa ?? 0).toLocaleString() }}</p>
          </div>
        </div>
      </div>

      <p v-else class="text-xs font-mono text-slate-600">
        No campaigns loaded yet.
      </p>
    </div>

    <!-- Best summary chart: Spend + CPA (efficiency) -->
    <div class="lg:col-span-12 rounded-2xl border border-white/5 bg-white/[0.025] p-5">
      <div class="flex items-center justify-between mb-4">
        <div>
          <p class="text-[10px] font-mono text-sky-400 uppercase tracking-widest mb-0.5">
            Campaign performance summary
          </p>
          <h3 class="text-sm font-bold text-white">Top campaigns by spend + CPA overlay</h3>
        </div>
        <span class="text-[10px] font-mono text-slate-600">bar + line · selected account</span>
      </div>
      <canvas ref="efficiencyRef" class="max-h-64"></canvas>
      <p class="mt-2 text-[10px] font-mono text-slate-600">
        This chart uses only fields from your `fetch_campaign` payload: `spent` and `cpa`.
      </p>
    </div>
  </section>
</template>


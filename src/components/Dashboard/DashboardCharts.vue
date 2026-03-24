<script setup>
import { computed, onBeforeUnmount, onMounted, ref, nextTick } from "vue";
import {
  Chart,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  DoughnutController,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

Chart.register(
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  DoughnutController,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

// Dummy data: accounts -> campaigns with daily trends (7-day window)
const accounts = ref([
  {
    id: "acc_001",
    name: "Northwind",
    campaigns: [
      {
        id: "cmp_101",
        name: "Spring Sale - Search",
        channel: "Search",
        daily: [
          { day: "Mon", spend: 180, impressions: 22000, clicks: 820, conversions: 41 },
          { day: "Tue", spend: 205, impressions: 23800, clicks: 860, conversions: 44 },
          { day: "Wed", spend: 195, impressions: 23100, clicks: 840, conversions: 39 },
          { day: "Thu", spend: 235, impressions: 25500, clicks: 910, conversions: 52 },
          { day: "Fri", spend: 260, impressions: 27100, clicks: 960, conversions: 58 },
          { day: "Sat", spend: 240, impressions: 26050, clicks: 920, conversions: 54 },
          { day: "Sun", spend: 275, impressions: 28100, clicks: 990, conversions: 61 }
        ]
      },
      {
        id: "cmp_102",
        name: "Brand Lift - YouTube",
        channel: "YouTube",
        daily: [
          { day: "Mon", spend: 140, impressions: 41000, clicks: 380, conversions: 11 },
          { day: "Tue", spend: 150, impressions: 42800, clicks: 392, conversions: 12 },
          { day: "Wed", spend: 145, impressions: 42100, clicks: 388, conversions: 11 },
          { day: "Thu", spend: 165, impressions: 45200, clicks: 410, conversions: 13 },
          { day: "Fri", spend: 175, impressions: 46800, clicks: 425, conversions: 14 },
          { day: "Sat", spend: 170, impressions: 46250, clicks: 420, conversions: 14 },
          { day: "Sun", spend: 185, impressions: 48000, clicks: 435, conversions: 15 }
        ]
      }
    ]
  },
  {
    id: "acc_002",
    name: "Contoso",
    campaigns: [
      {
        id: "cmp_201",
        name: "Retargeting - Display",
        channel: "Display",
        daily: [
          { day: "Mon", spend: 110, impressions: 52000, clicks: 560, conversions: 18 },
          { day: "Tue", spend: 120, impressions: 53800, clicks: 575, conversions: 19 },
          { day: "Wed", spend: 115, impressions: 53000, clicks: 568, conversions: 18 },
          { day: "Thu", spend: 130, impressions: 55200, clicks: 590, conversions: 21 },
          { day: "Fri", spend: 140, impressions: 57100, clicks: 610, conversions: 23 },
          { day: "Sat", spend: 135, impressions: 56550, clicks: 602, conversions: 22 },
          { day: "Sun", spend: 145, impressions: 58000, clicks: 620, conversions: 24 }
        ]
      },
      {
        id: "cmp_202",
        name: "New Arrivals - Social",
        channel: "Social",
        daily: [
          { day: "Mon", spend: 90, impressions: 18000, clicks: 510, conversions: 23 },
          { day: "Tue", spend: 95, impressions: 19200, clicks: 540, conversions: 26 },
          { day: "Wed", spend: 92, impressions: 18600, clicks: 528, conversions: 25 },
          { day: "Thu", spend: 105, impressions: 20500, clicks: 575, conversions: 29 },
          { day: "Fri", spend: 115, impressions: 21800, clicks: 610, conversions: 32 },
          { day: "Sat", spend: 112, impressions: 21250, clicks: 598, conversions: 31 },
          { day: "Sun", spend: 120, impressions: 22400, clicks: 630, conversions: 34 }
        ]
      }
    ]
  }
]);

const flatCampaigns = computed(() =>
  accounts.value.flatMap((a) => a.campaigns.map((c) => ({ ...c, accountName: a.name })))
);

const days = computed(() => flatCampaigns.value[0]?.daily.map((d) => d.day) ?? []);

function sumByDay(field) {
  return days.value.map((day) =>
    flatCampaigns.value.reduce((acc, cmp) => {
      const row = cmp.daily.find((d) => d.day === day);
      return acc + (row ? row[field] : 0);
    }, 0)
  );
}

const totals = computed(() => {
  const spend = sumByDay("spend").reduce((a, b) => a + b, 0);
  const impressions = sumByDay("impressions").reduce((a, b) => a + b, 0);
  const clicks = sumByDay("clicks").reduce((a, b) => a + b, 0);
  const conversions = sumByDay("conversions").reduce((a, b) => a + b, 0);
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
  const cvr = clicks > 0 ? (conversions / clicks) * 100 : 0;
  return { spend, impressions, clicks, conversions, ctr, cvr };
});

const spendByAccount = computed(() =>
  accounts.value.map((a) => ({
    name: a.name,
    spend: a.campaigns.reduce((acc, c) => acc + c.daily.reduce((s, d) => s + d.spend, 0), 0)
  }))
);

const topCampaignsBySpend = computed(() =>
  flatCampaigns.value
    .map((c) => ({ name: c.name, spend: c.daily.reduce((acc, d) => acc + d.spend, 0) }))
    .sort((a, b) => b.spend - a.spend)
    .slice(0, 6)
);

// Chart refs
const spendRef = ref(null);
const trafficRef = ref(null);
const convRef = ref(null);
const donutRef = ref(null);
const topRef = ref(null);

const chartInst = {};

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
const scaleX = { ticks: { color: TICK, font: { size: 10 } }, grid: { color: GRID } };
const scaleY = { ticks: { color: TICK, font: { size: 10 } }, grid: { color: GRID } };

function destroy(key) {
  if (chartInst[key]) {
    chartInst[key].destroy();
    delete chartInst[key];
  }
}

function buildAll() {
  if (!days.value.length) return;

  // Spend pace (area)
  destroy("spend");
  chartInst.spend = new Chart(spendRef.value, {
    type: "line",
    data: {
      labels: days.value,
      datasets: [
        {
          label: "Daily Spend ($)",
          data: sumByDay("spend"),
          borderColor: "#f472b6",
          backgroundColor: "rgba(244,114,182,0.10)",
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#f472b6",
          pointRadius: 4,
          pointHoverRadius: 7
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { ...tip, callbacks: { label: (ctx) => ` $${ctx.raw}` } }
      },
      scales: { x: scaleX, y: { ...scaleY, ticks: { ...scaleY.ticks, callback: (v) => `$${v}` } } }
    }
  });

  // Traffic (impressions + clicks)
  destroy("traffic");
  chartInst.traffic = new Chart(trafficRef.value, {
    type: "line",
    data: {
      labels: days.value,
      datasets: [
        {
          label: "Impressions",
          data: sumByDay("impressions"),
          borderColor: "#818cf8",
          backgroundColor: "rgba(129,140,248,0.08)",
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#818cf8",
          pointRadius: 4,
          pointHoverRadius: 7
        },
        {
          label: "Clicks",
          data: sumByDay("clicks"),
          borderColor: "#38bdf8",
          backgroundColor: "transparent",
          borderWidth: 2,
          tension: 0.4,
          pointBackgroundColor: "#38bdf8",
          pointRadius: 4,
          pointHoverRadius: 7
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: "index" },
      plugins: { legend: { labels: { color: "#94a3b8", font: { size: 10 }, boxWidth: 12 } }, tooltip: { ...tip } },
      scales: { x: scaleX, y: scaleY }
    }
  });

  // Conversions (bar)
  destroy("conv");
  chartInst.conv = new Chart(convRef.value, {
    type: "bar",
    data: {
      labels: days.value,
      datasets: [
        {
          label: "Conversions",
          data: sumByDay("conversions"),
          backgroundColor: "rgba(52,211,153,0.55)",
          borderColor: "#34d399",
          borderWidth: 2,
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false }, tooltip: { ...tip } },
      scales: { x: scaleX, y: { ...scaleY, beginAtZero: true } }
    }
  });

  // Spend by account (donut)
  destroy("donut");
  chartInst.donut = new Chart(donutRef.value, {
    type: "doughnut",
    data: {
      labels: spendByAccount.value.map((x) => x.name),
      datasets: [
        {
          data: spendByAccount.value.map((x) => x.spend),
          backgroundColor: ["#f472b6", "#818cf8", "#38bdf8", "#34d399", "#fb923c"].slice(0, spendByAccount.value.length),
          borderColor: ["#f472b6", "#818cf8", "#38bdf8", "#34d399", "#fb923c"].slice(0, spendByAccount.value.length),
          borderWidth: 2,
          hoverOffset: 6
        }
      ]
    },
    options: {
      responsive: true,
      cutout: "74%",
      plugins: { legend: { display: false }, tooltip: { ...tip } }
    }
  });

  // Top campaigns by spend
  destroy("top");
  chartInst.top = new Chart(topRef.value, {
    type: "bar",
    data: {
      labels: topCampaignsBySpend.value.map((x) => x.name),
      datasets: [
        {
          label: "Spend ($)",
          data: topCampaignsBySpend.value.map((x) => x.spend),
          backgroundColor: "rgba(129,140,248,0.35)",
          borderColor: "#818cf8",
          borderWidth: 2,
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false }, tooltip: { ...tip, callbacks: { label: (ctx) => ` $${ctx.raw}` } } },
      scales: { x: scaleX, y: { ...scaleY, ticks: { ...scaleY.ticks, callback: (v) => `$${v}` } } }
    }
  });
}

onMounted(async () => {
  await nextTick();
  buildAll();
});

onBeforeUnmount(() => Object.values(chartInst).forEach((c) => c.destroy()));
</script>

<template>
  <section class="space-y-4">
    <div class="rounded-2xl border border-white/5 bg-white/[0.025] p-5">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-1">Dashboard analytics</p>
          <h2 class="text-base font-black tracking-tight text-white">
            {{ accounts.length }} accounts · {{ flatCampaigns.length }} campaigns
          </h2>
          <p class="text-xs text-slate-500 mt-1 font-mono">Dummy dataset for layout + visual validation</p>
        </div>

        <div class="flex flex-wrap gap-2.5">
          <div class="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-3">
            <p class="text-[9px] font-mono uppercase tracking-widest text-pink-400 mb-1">Spend</p>
            <p class="text-sm font-black text-white leading-none">${{ totals.spend.toLocaleString() }}</p>
          </div>
          <div class="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-3">
            <p class="text-[9px] font-mono uppercase tracking-widest text-indigo-400 mb-1">Impressions</p>
            <p class="text-sm font-black text-white leading-none">{{ totals.impressions.toLocaleString() }}</p>
          </div>
          <div class="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-3">
            <p class="text-[9px] font-mono uppercase tracking-widest text-sky-400 mb-1">Clicks</p>
            <p class="text-sm font-black text-white leading-none">{{ totals.clicks.toLocaleString() }}</p>
          </div>
          <div class="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-3">
            <p class="text-[9px] font-mono uppercase tracking-widest text-violet-400 mb-1">CTR</p>
            <p class="text-sm font-black text-white leading-none">{{ totals.ctr.toFixed(2) }}%</p>
          </div>
          <div class="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-3">
            <p class="text-[9px] font-mono uppercase tracking-widest text-emerald-400 mb-1">Conversions</p>
            <p class="text-sm font-black text-white leading-none">{{ totals.conversions.toLocaleString() }}</p>
          </div>
          <div class="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-3">
            <p class="text-[9px] font-mono uppercase tracking-widest text-cyan-400 mb-1">CVR</p>
            <p class="text-sm font-black text-white leading-none">{{ totals.cvr.toFixed(2) }}%</p>
          </div>
        </div>
      </div>
    </div>

    <div class="rounded-2xl border border-white/5 bg-white/[0.025] p-5">
      <div class="flex items-center justify-between mb-4">
        <div>
          <p class="text-[10px] font-mono text-pink-400 uppercase tracking-widest mb-0.5">Spend Pace</p>
          <h3 class="text-sm font-bold text-white">Daily Spend Over 7 Days</h3>
        </div>
        <span class="text-[10px] font-mono text-slate-600">area · daily spend ($)</span>
      </div>
      <canvas ref="spendRef" class="max-h-52"></canvas>
    </div>

    <div class="rounded-2xl border border-white/5 bg-white/[0.025] p-5">
      <div class="flex items-center justify-between mb-4">
        <div>
          <p class="text-[10px] font-mono text-indigo-400 uppercase tracking-widest mb-0.5">Traffic</p>
          <h3 class="text-sm font-bold text-white">Impressions vs Clicks</h3>
        </div>
        <span class="text-[10px] font-mono text-slate-600">line · combined</span>
      </div>
      <canvas ref="trafficRef" class="max-h-56"></canvas>
    </div>

    <div class="rounded-2xl border border-white/5 bg-white/[0.025] p-5">
      <div class="flex items-center justify-between mb-4">
        <div>
          <p class="text-[10px] font-mono text-emerald-400 uppercase tracking-widest mb-0.5">Conversions</p>
          <h3 class="text-sm font-bold text-white">Daily Conversions</h3>
        </div>
        <span class="text-[10px] font-mono text-slate-600">bar · daily total</span>
      </div>
      <canvas ref="convRef" class="max-h-56"></canvas>
    </div>

    <div class="rounded-2xl border border-white/5 bg-white/[0.025] p-5">
      <div class="flex items-center justify-between mb-4">
        <div>
          <p class="text-[10px] font-mono text-violet-400 uppercase tracking-widest mb-0.5">Allocation</p>
          <h3 class="text-sm font-bold text-white">Spend by Account</h3>
        </div>
        <span class="text-[10px] font-mono text-slate-600">doughnut</span>
      </div>
      <div class="flex items-center justify-center gap-10">
        <canvas ref="donutRef" style="max-height:160px;max-width:160px;"></canvas>
        <div class="hidden md:flex flex-col gap-2">
          <div
            v-for="item in spendByAccount"
            :key="item.name"
            class="flex items-center gap-2.5"
          >
            <span class="w-2.5 h-2.5 rounded-sm flex-shrink-0 bg-white/20"></span>
            <span class="text-xs font-mono text-slate-400">{{ item.name }}</span>
            <span class="text-xs font-bold text-white ml-1">${{ item.spend.toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="rounded-2xl border border-white/5 bg-white/[0.025] p-5">
      <div class="flex items-center justify-between mb-4">
        <div>
          <p class="text-[10px] font-mono text-indigo-400 uppercase tracking-widest mb-0.5">Top Spend</p>
          <h3 class="text-sm font-bold text-white">Top Campaigns by Spend</h3>
        </div>
        <span class="text-[10px] font-mono text-slate-600">bar · campaign total</span>
      </div>
      <canvas ref="topRef" class="max-h-56"></canvas>
    </div>
  </section>
</template>


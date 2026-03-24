<template>
  <div class="flex flex-wrap gap-2.5 mb-6">
    <div
      v-for="metric in metrics"
      :key="metric.title"
      class="relative rounded-xl border border-white/5 bg-white/[0.025] px-3 py-3.5 overflow-hidden group hover:border-white/10 transition-all duration-300 cursor-default min-w-[160px]"
    >
      <div
        class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        :style="{
          background: `radial-gradient(ellipse at 0% 0%, ${metric.accent}18, transparent 65%)`
        }"
      ></div>
      <div class="p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[9px] font-mono uppercase tracking-widest mb-1.5" :style="{ color: metric.accent }">
              {{ metric.title }}
            </p>
            <p class="text-lg font-black text-white leading-none">{{ metric.value }}</p>
          </div>

          <!-- Icon placeholder instead of lucide-react -->
          <div
            class="p-3 rounded-full"
            :class="metric.trend === 'up' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'"
          >
            <div class="w-6 h-6 bg-current rounded"></div>
          </div>
        </div>

        <div class="flex items-center mt-4">
          <!-- Trend icon replacement -->
          <div
            class="w-4 h-4 mr-1 rounded-sm"
            :class="metric.trend === 'up' ? 'bg-emerald-400' : 'bg-amber-400'"
          ></div>

          <span
            class="px-2 py-1 border rounded-full text-[10px] font-mono uppercase tracking-widest"
            :class="metric.trend === 'up' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-amber-400 border-amber-500/30 bg-amber-500/10'"
          >
            {{ metric.change }}
          </span>

          <span class="text-[10px] font-mono text-slate-600 ml-2">vs last month</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AnalyticsDashboard",

  data() {
    return {
      metrics: [
        {
          title: "Total Spend",
          value: "$5,150",
          change: "+12.5%",
          trend: "up",
          accent: "#f472b6"
        },
        {
          title: "Impressions",
          value: "136.2K",
          change: "+8.2%",
          trend: "up",
          accent: "#818cf8"
        },
        {
          title: "Clicks",
          value: "3,820",
          change: "-2.1%",
          trend: "down",
          accent: "#38bdf8"
        },
        {
          title: "Conversions",
          value: "279",
          change: "+15.8%",
          trend: "up",
          accent: "#34d399"
        }
      ]
    };
  }
};
</script>

<style scoped>
.shadow-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
</style>

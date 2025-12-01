<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div
      v-for="metric in metrics"
      :key="metric.title"
      class="shadow-card border rounded-xl bg-white"
    >
      <div class="p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">{{ metric.title }}</p>
            <p class="text-2xl font-bold">{{ metric.value }}</p>
          </div>

          <!-- Icon placeholder instead of lucide-react -->
          <div
            class="p-3 rounded-full"
            :class="metric.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'"
          >
            <div class="w-6 h-6 bg-current rounded"></div>
          </div>
        </div>

        <div class="flex items-center mt-4">
          <!-- Trend icon replacement -->
          <div
            class="w-4 h-4 mr-1 rounded-sm"
            :class="metric.trend === 'up' ? 'bg-green-600' : 'bg-yellow-600'"
          ></div>

          <span
            class="px-2 py-1 border rounded text-xs"
            :class="metric.trend === 'up' ? 'text-green-600 border-green-600' : 'text-yellow-600 border-yellow-600'"
          >
            {{ metric.change }}
          </span>

          <span class="text-sm text-gray-500 ml-2">vs last month</span>
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
          trend: "up"
        },
        {
          title: "Impressions",
          value: "136.2K",
          change: "+8.2%",
          trend: "up"
        },
        {
          title: "Clicks",
          value: "3,820",
          change: "-2.1%",
          trend: "down"
        },
        {
          title: "Conversions",
          value: "279",
          change: "+15.8%",
          trend: "up"
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

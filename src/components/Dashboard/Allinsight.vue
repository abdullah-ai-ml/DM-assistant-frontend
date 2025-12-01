<template>
  <div class="shadow-card border rounded-xl p-4 bg-white">
    <div class="mb-4 flex items-center space-x-2">
      <div class="w-5 h-5 bg-yellow-400 rounded"></div>
      <span class="font-bold">AI-Powered Insights</span>
      <span class="ml-2 px-2 py-1 rounded bg-blue-500 text-white text-xs flex items-center">
        <span class="w-3 h-3 bg-white rounded-full mr-1"></span>
        3 New
      </span>
    </div>

    <div class="space-y-4">
      <div
        v-for="insight in insights"
        :key="insight.id"
        class="p-4 rounded-lg border bg-gray-50"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center"
              :class="{
                'bg-blue-100 text-blue-600': insight.type === 'optimization',
                'bg-yellow-100 text-yellow-600': insight.type === 'alert',
                'bg-green-100 text-green-600': insight.type === 'opportunity'
              }"
            >
              <!-- Replaced lucide-react icons with simple placeholder shapes -->
              <div class="w-5 h-5 bg-current rounded-sm"></div>
            </div>

            <div class="flex-1">
              <h4 class="font-medium">{{ insight.title }}</h4>
              <p class="text-sm text-gray-500 mt-1">{{ insight.description }}</p>
            </div>
          </div>

          <span
            class="px-2 py-1 rounded text-xs border capitalize"
            :class="getPriorityColor(insight.priority)"
          >
            {{ insight.priority }} priority
          </span>
        </div>

        <div class="flex items-center justify-between">
          <div class="text-sm">
            <span class="text-gray-500">Potential Impact: </span>
            <span class="font-medium text-blue-600">{{ insight.impact }}</span>
          </div>

          <div class="flex space-x-2">
            <button class="px-3 py-1 border rounded text-sm">Dismiss</button>
            <button class="px-3 py-1 bg-blue-600 text-white rounded text-sm">
              Apply Suggestion
            </button>
          </div>
        </div>
      </div>

      <div class="text-center pt-4">
        <button class="w-full px-4 py-2 border rounded flex items-center justify-center">
          <div class="w-4 h-4 bg-yellow-400 rounded mr-2"></div>
          Generate More Insights
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AIInsights",

  data() {
    return {
      insights: [
        {
          id: 1,
          type: "optimization",
          priority: "high",
          title: "Increase Budget for Top Performing Campaign",
          description:
            'Your "Product Launch" campaign has a 4.8% conversion rate. Consider increasing budget by 30% to maximize ROI.',
          impact: "+$450 potential revenue"
        },
        {
          id: 2,
          type: "alert",
          priority: "medium",
          title: "Keywords Performance Declining",
          description:
            "Several high-volume keywords in your summer sale campaign show declining CTR. Review and refresh ad copy.",
          impact: "Prevent -15% performance drop"
        },
        {
          id: 3,
          type: "opportunity",
          priority: "low",
          title: "New Audience Segment Identified",
          description:
            'AI analysis found untapped audience segment: "Eco-conscious millennials aged 25-35" with high conversion potential.',
          impact: "+25% reach expansion"
        }
      ]
    };
  },

  methods: {
    getPriorityColor(priority) {
      switch (priority) {
        case "high":
          return "bg-red-100 text-red-600 border-red-300";
        case "medium":
          return "bg-yellow-100 text-yellow-600 border-yellow-300";
        case "low":
          return "bg-green-100 text-green-600 border-green-300";
        default:
          return "bg-gray-100 text-gray-600 border-gray-300";
      }
    }
  }
};
</script>

<style scoped>
.shadow-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
</style>

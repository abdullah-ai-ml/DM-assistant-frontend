<script setup>
import { ref } from "vue";

const uploadedVideos = ref([
  {
    id: 1,
    name: "Product Demo Video.mp4",
    score: 87,
    insights: [
      "Strong opening hook",
      "Clear call-to-action",
      "Good audio quality",
    ],
    uploadedAt: "2 hours ago",
  },
  {
    id: 2,
    name: "Brand Story.mp4",
    score: 72,
    insights: [
      "Engaging storyline",
      "Needs shorter duration",
      "Good visual appeal",
    ],
    uploadedAt: "1 day ago",
  },
]);

const getScoreColor = (score) => {
  if (score >= 80) return "text-accent";
  if (score >= 60) return "text-warning";
  return "text-destructive";
};

const getScoreBadge = (score) => {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  return "Needs Improvement";
};
</script>

<template>
  <div class="shadow-card border rounded-xl bg-card">
    <!-- Header -->
    <div class="p-4 border-b">
      <div class="flex items-center space-x-2">
        <span class="text-lg">📤</span>
        <h2 class="text-lg font-semibold">Video Analysis</h2>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 space-y-6">
      <!-- Upload Area -->
      <div
        class="border-2 border-dashed border-border rounded-lg p-8 text-center bg-gradient-card"
      >
        <div class="text-muted-foreground mx-auto mb-4 text-4xl">📤</div>
        <h3 class="text-lg font-medium mb-2">
          Upload Video for AI Analysis
        </h3>
        <p class="text-muted-foreground mb-4">
          Get AI-powered insights on video quality, engagement potential,
          and optimization recommendations
        </p>

        <button
          class="bg-gradient-primary text-white px-4 py-2 rounded-md inline-flex items-center"
        >
          <span class="mr-2">📤</span>
          Choose Video File
        </button>
      </div>

      <!-- Recent Analyses -->
      <div v-if="uploadedVideos.length" class="space-y-4">
        <h4 class="font-medium">Recent Analyses</h4>

        <div
          v-for="video in uploadedVideos"
          :key="video.id"
          class="p-4 rounded-lg border border-border bg-gradient-card"
        >
          <!-- Video Row -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center text-xl text-secondary"
              >
                ▶️
              </div>

              <div>
                <h5 class="font-medium">{{ video.name }}</h5>
                <p class="text-xs text-muted-foreground">
                  {{ video.uploadedAt }}
                </p>
              </div>
            </div>

            <span
              class="px-2 py-1 text-xs rounded bg-primary/10 text-primary capitalize"
            >
              {{ getScoreBadge(video.score) }}
            </span>
          </div>

          <!-- Score & Progress -->
          <div class="space-y-3">
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">AI Quality Score</span>
              <span
                class="font-bold text-lg"
                :class="getScoreColor(video.score)"
              >
                {{ video.score }}/100
              </span>
            </div>

            <!-- Progress Bar -->
            <div class="w-full h-2 bg-secondary/20 rounded overflow-hidden">
              <div
                class="h-full bg-primary transition-all"
                :style="{ width: video.score + '%' }"
              ></div>
            </div>

            <!-- Insights -->
            <div>
              <p class="text-sm font-medium mb-2 flex items-center">
                ⚡ <span class="ml-1">AI Insights</span>
              </p>

              <div class="flex flex-wrap gap-1">
                <span
                  v-for="(insight, index) in video.insights"
                  :key="index"
                  class="border border-border px-2 py-1 text-xs rounded inline-flex items-center"
                >
                  ⭐ <span class="ml-1">{{ insight }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

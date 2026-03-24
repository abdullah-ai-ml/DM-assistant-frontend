<script setup>
import creative1 from "@/assets/creative-1.svg";
import creative2 from "@/assets/creative-2.svg";
import creative3 from "@/assets/creative-3.svg";

const creatives = [
  {
    id: "cr_001",
    title: "Spring Sale — Neon Gradient",
    channel: "YouTube",
    format: "16:9 Video",
    score: 87,
    status: "ready",
    img: creative1
  },
  {
    id: "cr_002",
    title: "Retargeting — Clean Product Card",
    channel: "Display",
    format: "1200×675 Image",
    score: 74,
    status: "testing",
    img: creative2
  },
  {
    id: "cr_003",
    title: "Brand Story — Dark Glow",
    channel: "Social",
    format: "Story Creative",
    score: 92,
    status: "top",
    img: creative3
  }
];

const badge = (s) => {
  switch (s) {
    case "top":
      return "border-emerald-500/40 text-emerald-400 bg-emerald-500/10";
    case "testing":
      return "border-amber-500/40 text-amber-400 bg-amber-500/10";
    default:
      return "border-sky-500/40 text-sky-400 bg-sky-500/10";
  }
};

const scoreColor = (v) => {
  if (v >= 85) return "text-emerald-400";
  if (v >= 70) return "text-amber-400";
  return "text-red-400";
};
</script>

<template>
  <section class="rounded-2xl border border-white/5 bg-white/[0.025] p-5">
    <div class="flex items-center justify-between mb-4">
      <div>
        <p class="text-[10px] font-mono text-fuchsia-400 uppercase tracking-widest mb-0.5">
          Creative previews
        </p>
        <h3 class="text-sm font-bold text-white">How images will look on the dashboard</h3>
      </div>
      <span class="text-[10px] font-mono text-slate-600">dummy assets · thumbnails</span>
    </div>

    <div class="space-y-3.5">
      <div
        v-for="c in creatives"
        :key="c.id"
        class="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden hover:border-white/10 transition-all duration-300"
      >
        <div class="grid grid-cols-1 md:grid-cols-[220px_1fr]">
          <div class="bg-black/20 p-3">
            <div class="aspect-video rounded-xl overflow-hidden border border-white/5 bg-black/30">
              <img :src="c.img" :alt="c.title" class="w-full h-full object-cover" />
            </div>
          </div>

          <div class="p-4 flex flex-col gap-2">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                  {{ c.channel }} · {{ c.format }}
                </p>
                <p class="text-white font-semibold truncate">{{ c.title }}</p>
              </div>
              <span
                class="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest border"
                :class="badge(c.status)"
              >
                {{ c.status }}
              </span>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <div class="text-xs font-mono text-slate-500">
                AI quality score
                <span class="font-black ml-1" :class="scoreColor(c.score)">{{ c.score }}/100</span>
              </div>
              <div class="flex-1 min-w-[180px] h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  class="h-full rounded-full"
                  :style="{
                    width: `${c.score}%`,
                    background: c.score >= 85 ? '#34d399' : c.score >= 70 ? '#FFB347' : '#f87171'
                  }"
                ></div>
              </div>
            </div>

            <div class="flex flex-wrap gap-2 pt-1">
              <span class="text-[10px] font-mono px-2 py-1 rounded-full border border-white/5 bg-white/[0.02] text-slate-400">
                Hook
              </span>
              <span class="text-[10px] font-mono px-2 py-1 rounded-full border border-white/5 bg-white/[0.02] text-slate-400">
                Branding
              </span>
              <span class="text-[10px] font-mono px-2 py-1 rounded-full border border-white/5 bg-white/[0.02] text-slate-400">
                CTA clarity
              </span>
              <span class="text-[10px] font-mono px-2 py-1 rounded-full border border-white/5 bg-white/[0.02] text-slate-400">
                Pacing
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


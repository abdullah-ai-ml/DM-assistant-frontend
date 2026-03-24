<script setup>
defineProps({
  label: { type: String, default: "Loading..." },
  size: { type: String, default: "md" } // sm | md | lg
});

const sizeClass = (s) => {
  switch (s) {
    case "sm":
      return "h-4 w-4";
    case "lg":
      return "h-6 w-6";
    default:
      return "h-5 w-5";
  }
};
</script>

<template>
  <div class="inline-flex items-center gap-2 text-slate-500 font-mono text-xs">
    <svg
      class="animate-spin"
      :class="sizeClass(size)"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-opacity="0.25"
        stroke-width="3"
      />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
      />
    </svg>
    <span>{{ label }}</span>
  </div>
</template>


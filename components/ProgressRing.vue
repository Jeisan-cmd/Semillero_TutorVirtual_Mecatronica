<template>
  <div class="relative inline-flex items-center justify-center">
    <!-- El anillo de fondo (gris) -->
    <svg class="transform -rotate-90 w-32 h-32">
      <circle
        cx="64"
        cy="64"
        r="56"
        stroke="currentColor"
        stroke-width="8"
        fill="none"
        class="text-slate-700 dark:text-slate-600"
      />
      <!-- El anillo de progreso (colorido) -->
      <circle
        cx="64"
        cy="64"
        r="56"
        stroke="currentColor"
        stroke-width="8"
        fill="none"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="progressOffset"
        class="text-aquamarine transition-all duration-500 ease-out"
      />
    </svg>
    <!-- El texto del porcentaje -->
    <div class="absolute inset-0 flex items-center justify-center">
      <span class="text-3xl font-bold text-gray-900 dark:text-white">{{ progress }}%</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  progress: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 100,
  }
});

const radius = 56;
const circumference = computed(() => 2 * Math.PI * radius);
const progressOffset = computed(() => {
  return circumference.value - (props.progress / 100) * circumference.value;
});
</script>
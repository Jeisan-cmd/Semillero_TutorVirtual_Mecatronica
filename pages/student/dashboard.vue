<template>
  <div class="p-6 space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        Visualiza tu progreso y estadísticas de aprendizaje.
      </p>
    </div>

    <!-- Tarjeta de Progreso General -->
    <div class="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-8">
      <div class="flex flex-col md:flex-row items-center gap-8">
        <ProgressRing :progress="overallProgress" />
        <div class="text-center md:text-left flex-grow">
          <h2 class="font-bold text-xl text-gray-900 dark:text-white mb-2">
            Progreso General
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Has completado {{ completedModules }} de {{ totalModules }} módulos. ¡Continúa así!
          </p>
          
          <!-- Lista de estadísticas -->
          <div class="flex flex-col md:flex-row gap-4 md:gap-6 text-sm">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <Icon name="heroicons:book-open" class="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </div>
              <div>
                <p class="font-bold text-lg text-gray-900 dark:text-white">{{ remainingModules }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Módulos Restantes</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <Icon name="heroicons:chart-bar" class="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </div>
              <div>
                <p class="font-bold text-lg text-gray-900 dark:text-white">{{ averageScore }}%</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Promedio de Notas</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <Icon name="heroicons:fire" class="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </div>
              <div>
                <p class="font-bold text-lg text-gray-900 dark:text-white">{{ activeDays }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Días Activos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid de Estadísticas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="(stat, index) in stats" :key="stat.label" class="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-4">
        <div class="flex items-center gap-4">
          <div class="p-2 rounded-lg bg-slate-100 dark:bg-slate-700">
            <Icon :name="stat.icon" class="w-6 h-6 text-slate-600 dark:text-slate-300" />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ stat.value }}
              <span v-if="stat.total" class="text-gray-500 dark:text-gray-400 text-lg">/{{ stat.total }}</span>
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Actividad Reciente -->
    <div class="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6">
      <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-4">
        Actividad Reciente
      </h3>
      <div class="space-y-4">
        <div v-for="(activity, index) in recentActivities" :key="index" class="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
          <div class="w-2 h-2 rounded-full bg-aquamarine mt-2"></div>
          <div class="flex-1">
            <p class="text-sm text-gray-900 dark:text-white">{{ activity.action }}</p>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ activity.time }}</span>
              <span class="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300">
                {{ activity.module }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// --- VARIABLES PARA BACKEND ---
const overallProgress = ref(0);
const completedModules = ref(0);
const totalModules = ref(0);
const averageScore = ref(0);
const activeDays = ref(0);

const remainingModules = computed(() => {
  return totalModules.value - completedModules.value;
});

const stats = ref([
  { label: 'Módulos Completados', value: 0, total: 0, icon: 'heroicons:book-open' },
  { label: 'Lecciones Terminadas', value: 0, total: 0, icon: 'heroicons:check-circle' },
  { label: 'Horas de Estudio', value: 0, icon: 'heroicons:clock' },
  { label: 'Logros Obtenidos', value: 0, icon: 'heroicons:award' },
]);

const recentActivities = ref([]);

const fetchDashboardData = async () => {
  try {
    // TODO: Llama a tus APIs aquí.
    // const progressData = await $fetch('/api/student/progress');
    // ... etc.
  } catch (error) {
    console.error('Error al cargar datos del dashboard:', error);
  }
};

onMounted(() => {
  fetchDashboardData();
});

definePageMeta({
  layout: 'student'
});
</script>

<style scoped>
.stats-enter-active {
  transition: all 0.5s ease-out;
}
.stats-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.stats-move {
  transition: transform 0.5s ease;
}
</style>
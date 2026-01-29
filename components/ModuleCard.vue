<template>
  <div class="group bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <!-- Imagen del Módulo -->
    <div class="relative aspect-video overflow-hidden">
      <!-- Reemplazar imagen del módulo: module.coverImage -->
      <img src="https://via.placeholder.com/640x360/1e293b/ffffff?text=Módulo" alt="Imagen del Módulo" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      
      <!-- Badge del número de módulo -->
      <div class="absolute top-3 left-3 bg-slate-900/80 text-white px-3 py-1 rounded-md text-xs font-bold backdrop-blur-sm">
        MÓDULO {{ String(module.number).padStart(2, '0') }}
      </div>

      <!-- Badge de Completado -->
      <div v-if="module.completed" class="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
        Completado
      </div>
    </div>

    <!-- Contenido de la Tarjeta -->
    <div class="p-5">
      <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">
        {{ module.title }}
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
        {{ module.description }}
      </p>

      <!-- Barra de Progreso -->
      <div class="mb-4">
        <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>Progreso</span>
          <span>{{ module.progress }}%</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div class="bg-gradient-to-r from-aquamarine to-blue-400 h-2 rounded-full transition-all duration-500" :style="{ width: module.progress + '%' }"></div>
        </div>
      </div>

      <!-- Botón de Acción -->
      <NuxtLink :to="`/student/modules/${module.id}`" class="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 bg-aquamarine text-gray-900 font-bold rounded-lg hover:bg-aquamarine/80 transition-colors">
        Entrar al Módulo
        <Icon name="heroicons:arrow-right" class="w-4 h-4" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  module: {
    type: Object,
    required: true,
    //estructura pendiente de definir en el backend
    default: () => ({
      id: String,
      number: Number,
      title: String,
      description: String,
      progress: Number,
      completed: Boolean,
      coverImage: String, 
    })
  }
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
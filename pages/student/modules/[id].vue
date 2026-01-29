<template>
  <div>
    <!-- Banner Superior con la imagen del módulo -->
    <div class="relative h-64 md:h-80 rounded-xl overflow-hidden">
      <!-- Reemplazar imagen del módulo: module.coverImage -->
      <img src="https://via.placeholder.com/1200x400/1e293b/ffffff?text=Detalle+del+Módulo" alt="Detalle del Módulo" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/60" />
      <div class="absolute inset-0 flex flex-col justify-center p-8">
        <NuxtLink to="/student/modules" class="flex items-center gap-2 text-aquamarine/80 hover:text-aquamarine mb-4 w-fit">
          <Icon name="heroicons:arrow-left" class="w-4 h-4" />
          Volver a Módulos
        </NuxtLink>
        <h1 class="font-bold text-3xl md:text-4xl text-white">
          Módulo {{ module.id }}: {{ module.title }}
        </h1>
      </div>
    </div>

    <!-- Contenido Principal -->
    <div class="mt-8 p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-lg">
      <!-- Estado de Carga -->
      <div v-if="loading" class="flex justify-center items-center h-32">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-aquamarine"></div>
      </div>

      <!-- Contenido del Módulo -->
      <div v-else class="prose prose-lg dark:prose-invert max-w-none" v-html="module.content"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const route = useRoute();

// --- Variables para el backend ---
const module = ref({});
const loading = ref(true);

const fetchModuleDetails = async () => {
  loading.value = true;
  const moduleId = route.params.id;
  try {
    // TODO: Realizar la llamada a tu API para obtener los detalles de este módulo específico.
    // La API debe devolver un objeto con 'title' y 'content' (en formato HTML).
    const data = await $fetch(`/api/student/modules/${moduleId}`);
    module.value = data;
  } catch (e) {
    console.error('Error al cargar detalles del módulo:', e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchModuleDetails();
});

definePageMeta({
  layout: 'student'
});
</script>
<template>
  <div class="p-6">
    <!-- Título de la Página -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Módulos de Aprendizaje</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        Explora los módulos disponibles y continúa tu formación.
      </p>
    </div>

    <!-- Estado de Carga -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-aquamarine"></div>
    </div>

    <!-- Estado de Error -->
    <div v-else-if="error" class="bg-red-500 text-white p-4 rounded-lg">
      {{ error }}
    </div>

    <!-- Contenido Principal -->
    <div v-else>
      <!-- Grid de Módulos -->
      <div v-if="modules.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ModuleCard v-for="module in modules" :key="module.id" :module="module" />
      </div>

      <!-- Estado Vacío  -->
      <div v-else class="text-center py-12">
        <Icon name="heroicons:book-open" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p class="text-gray-600 dark:text-gray-400 text-xl">No hay módulos disponibles en este momento.</p>
        <p class="text-gray-500 dark:text-gray-500 text-sm mt-2">¡Vuelve pronto para ver el nuevo contenido!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// --- Variables para el backend ---
const modules = ref([]);
const loading = ref(true);
const error = ref('');

const fetchModules = async () => {
  loading.value = true;
  error.value = '';
  try {
    // TODO: Realizar la llamada a tu API para obtener la lista de módulos.
    // La API debe devolver un array de objetos con la estructura definida en ModuleCard.
    // Ejemplo:
    // const data = await $fetch('/api/student/modules'); 
    // modules.value = data;
    modules.value = []; 
    
  } catch (e) {
    console.error('Error al cargar módulos:', e);
    error.value = 'No se pudieron cargar los módulos. Inténtalo de nuevo.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchModules();
});

definePageMeta({
  layout: 'student'
});
</script>
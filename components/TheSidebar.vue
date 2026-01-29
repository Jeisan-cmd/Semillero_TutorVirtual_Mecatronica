<template>
  <div>
    <!-- Overlay -->
    <div v-if="isOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" @click="$emit('close')" />

    <!-- Sidebar -->
    <aside :class="['fixed top-0 left-0 h-full w-72 bg-gray-900 border-r border-gray-700 z-50 transform transition-transform duration-300 ease-in-out', isOpen ? 'translate-x-0' : '-translate-x-full']">
      <!-- Botón de cerrar -->
      <div class="flex items-center justify-between p-4 border-b border-gray-700">
        <span class="font-bold text-lg text-gray-100">Menú</span>
        <button @click="$emit('close')" class="p-2 hover:bg-gray-800 rounded-lg text-gray-400">
          <Icon name="heroicons:x-mark" class="w-5 h-5" />
        </button>
      </div>

      <!-- Información del Usuario -->
      <div class="p-4 border-b border-gray-700">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-lg">
            {{ user?.name?.charAt(0).toUpperCase() }}
          </div>
          <div>
            <p class="font-semibold text-gray-100">{{ user?.name }}</p>
            <p class="text-xs text-gray-400 capitalize">{{ roleDisplayName }}</p>
          </div>
        </div>
      </div>

      <!-- Navegación -->
      <nav class="p-4 flex-1 overflow-y-auto">
        <ul class="space-y-2">
          <!-- Enlaces Normales -->
          <li>
            <NuxtLink to="/student" @click="$emit('close')" class="flex items-center gap-3 p-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-800">
              <Icon name="heroicons:home" class="w-5 h-5" />
              <span>Inicio</span>
            </NuxtLink>
          </li>
          
              <!-- Enlace al Dashboard -->
          <li>
            <NuxtLink to="/student/dashboard" @click="$emit('close')" class="flex items-center gap-3 p-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-800">
            <Icon name="heroicons:chart-bar" class="w-5 h-5" />
            <span>Dashboard</span>
          </NuxtLink>
          </li>

          <!-- SECCIÓN DE MÓDULOS DESPLEGABLE -->
          <li>
            <button @click="toggleModules" class="w-full flex items-center justify-between gap-3 p-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-800">
              <div class="flex items-center gap-3">
                <Icon name="heroicons:book-open" class="w-5 h-5" />
                <span>Módulos</span>
              </div>
              <Icon :name="isModulesOpen ? 'heroicons:chevron-down' : 'heroicons:chevron-right'" class="w-4 h-4 transition-transform" :class="{ 'rotate-180': isModulesOpen }" />
            </button>
            
            <!-- Lista de opciones -->
            <ul v-if="isModulesOpen" class="mt-2 ml-4 space-y-1">
              <li>
                <NuxtLink to="/student/modules" @click="$emit('close')" 
                  class="flex items-center gap-2 p-2 rounded-md text-sm transition-colors text-gray-400 hover:bg-gray-800 hover:text-white">
                  <Icon name="heroicons:squares-2x2" class="w-4 h-4" />
                  <span>Ver todos los módulos</span>
                </NuxtLink>
              </li>
              
              <!-- Lista dinámica de módulos -->
              <li v-for="module in modules" :key="module.id">
                <NuxtLink :to="`/student/modules/${module.id}`" @click="$emit('close')" 
                  :class="[
                    'flex items-center gap-2 p-2 rounded-md text-sm transition-colors',
                    $route.path === `/student/modules/${module.id}`
                      ? 'bg-gray-800 text-aquamarine'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  ]">
                  <Icon name="heroicons:document-text" class="w-4 h-4" />
                  <span>{{ module.title }}</span>
                </NuxtLink>
              </li>
            </ul>
          </li>

          <!-- Otros enlaces -->
          <li>
            <NuxtLink to="/student/news" @click="$emit('close')" class="flex items-center gap-3 p-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-800">
              <Icon name="heroicons:newspaper" class="w-5 h-5" />
              <span>Noticias</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/student/chat" @click="$emit('close')" class="flex items-center gap-3 p-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-800">
              <Icon name="heroicons:chat-bubble-left-right" class="w-5 h-5" />
              <span>Chat IA</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- Botón de Cerrar Sesión -->
      <div class="p-4 border-t border-gray-700">
        <button @click="handleLogout" class="w-full flex items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors">
          <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';

const { user, logout } = useAuth();
const router = useRouter();

const props = defineProps({ isOpen: Boolean });
defineEmits(['close']);

// --- Lógica para desplegar módulos ---
const isModulesOpen = ref(false);
const toggleModules = () => {
  isModulesOpen.value = !isModulesOpen.value;
};

// --- Lógica para obtener la lista de módulos ---
const modules = ref([]);

const fetchModules = async () => {
  // TODO: Realizar una llamada a tu API para obtener los módulos del estudiante.
  // const data = await $fetch('/api/student/modules');
  // modules.value = data;
};

onMounted(() => {
  fetchModules();
});

const roleDisplayName = computed(() => { /* ... */ });
const handleLogout = async () => { /* ... */ };
</script>
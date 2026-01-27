<template>
  <div>
    <!-- Overlay para móvil (y ahora también para desktop) -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      @click="$emit('close')"
    />

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed top-0 left-0 h-full w-72 bg-gray-900 border-r border-gray-700 z-50 transform transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Botón de cerrar (visible siempre) -->
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
          <li v-for="item in menuItems" :key="item.label">
            <NuxtLink
              :to="item.path"
              @click="$emit('close')"
              :class="[
                'flex items-center gap-3 p-3 rounded-lg transition-colors',
                $route.path === item.path
                  ? 'bg-gray-800 text-indigo-400'
                  : 'text-gray-300 hover:bg-gray-800'
              ]"
            >
              <Icon :name="item.icon" class="w-5 h-5" />
              <span>{{ item.label }}</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- Botón de Cerrar Sesión -->
      <div class="p-4 border-t border-gray-700">
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors"
        >
          <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';

const { user, logout } = useAuth();
const router = useRouter();

const props = defineProps({
  isOpen: Boolean,
});

defineEmits(['close']);

const studentMenu = [
  { icon: 'heroicons:home', label: 'Inicio', path: '/student' },
  { icon: 'heroicons:book-open', label: 'Contenido', path: '/student/content' },
  { icon: 'heroicons:calendar', label: 'Calendario', path: '/student/calendar' },
  { icon: 'heroicons:chat-bubble-left-right', label: 'Chat IA', path: '/student/chat' },
];

const menuItems = computed(() => {
  return studentMenu;
});

const roleDisplayName = computed(() => {
  if (!user.value?.role) return '';
  switch (user.value.role) {
    case 'student': return 'Estudiante';
    case 'teacher': return 'Docente';
    case 'admin': return 'Administrador';
    default: return user.value.role;
  }
});

const handleLogout = async () => {
  await logout();
  router.push('/login');
};
</script>
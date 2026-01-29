<template>
  <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-40 shadow-sm">
    <!-- Botón de Menú -->
    <button
      @click="$emit('menu-toggle')"
      class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
      aria-label="Toggle menu"
    >
      <Icon name="heroicons:bars-3" class="w-6 h-6 text-gray-700" />
    </button>

    <!-- Logo -->
    <div class="absolute left-1/2 transform -translate-x-1/2">
      <img src="/logos/light.png" alt="Brand" class="h-10 w-auto" />
    </div>

    <!-- Theme Toggle y el Perfil -->
    <div class="w-24 lg:w-48 flex justify-end items-center gap-2">
      <Theme />

      <!-- Perfil de Usuario (Dropdown) -->
      <div class="relative">
        <button
          @click="toggleDropdown"
          class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span class="hidden sm:block text-sm font-medium text-gray-700">
            Hola, {{ user?.name?.split(' ')[0] }}
          </span>
          <div class="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-600 font-semibold">
            {{ user?.name?.charAt(0).toUpperCase() }}
          </div>
          <Icon name="heroicons:chevron-down" class="w-4 h-4 text-gray-500 hidden sm:block" />
        </button>

        <!-- Menú Desplegable -->
        <div
          v-if="isDropdownOpen"
          class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
        >
          <button
            @click="handleLogout"
            class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
          >
            <Icon name="heroicons:arrow-right-on-rectangle" class="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';
import Theme from '~/components/Theme.vue'; 

const { user, logout } = useAuth();
const router = useRouter();

const isDropdownOpen = ref(false);

defineEmits(['menu-toggle']);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const handleLogout = async () => {
  await logout();
  router.push('/login');
};

const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
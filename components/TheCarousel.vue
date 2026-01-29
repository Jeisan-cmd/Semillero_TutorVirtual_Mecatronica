<template>
  <div class="relative w-full mb-8">
    <!-- Botones de Navegación -->
    <button @click="prevSlide" class="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110">
      <Icon name="heroicons:chevron-left" class="w-5 h-5" />
    </button>
    <button @click="nextSlide" class="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110">
      <Icon name="heroicons:chevron-right" class="w-5 h-5" />
    </button>

    <!-- Contenedor del Carrusel -->
    <div class="relative h-80 overflow-hidden rounded-xl">
      <TransitionGroup name="slide" tag="div" class="flex h-full">
        <!-- Slide 1 -->
        <div v-if="currentSlide === 0" key="progress" class="w-full h-full flex-shrink-0">
          <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-8 h-full flex items-center">
            <div class="text-white w-full">
              <h2 class="text-3xl font-bold mb-6 flex items-center gap-3">
                <Icon name="heroicons:map" class="w-8 h-8 text-aquamarine" />
                Tu Camino de Aprendizaje
              </h2>
              
              <!-- Mensaje si no hay módulos -->
              <div v-if="totalModules === 0" class="text-center">
                <Icon name="heroicons:rocket-launch" class="w-16 h-16 mx-auto mb-4 text-aquamarine" />
                <p class="text-2xl font-bold">¡Tu viaje está por comenzar!</p>
                <p class="text-gray-400">El primer módulo te espera.</p>
              </div>

              <!-- Contenido si hay módulos -->
              <div v-else class="space-y-4">
                <p class="text-lg text-gray-300">
                  ¡Vas por buen camino! Has completado <span class="font-bold text-2xl text-aquamarine">{{ completedModules }}</span> de <span class="font-bold text-2xl">{{ totalModules }}</span> módulos.
                </p>
                
                <div class="w-full bg-slate-700 rounded-full h-4">
                  <div class="bg-gradient-to-r from-aquamarine to-blue-400 h-4 rounded-full transition-all duration-700 ease-out" :style="{ width: progressPercentage + '%' }"></div>
                </div>

                <div v-if="currentModule" class="mt-6 p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                  <p class="text-sm font-semibold text-gray-400">Módulo Actual:</p>
                  <p class="text-xl">{{ currentModule.name }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Slide 2-->
        <div v-if="currentSlide === 1" key="marketing" class="w-full h-full flex-shrink-0">
          <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-6 h-full flex items-center">
            <div class="text-white w-full">
              <h2 class="text-2xl font-bold mb-4 text-center">Domina el Futuro</h2>
              <p class="text-center text-gray-400 mb-6 text-sm">Tutor IUDC es tu plataforma para convertirte en un experto.</p>
              
              <div class="grid grid-cols-2 gap-3 text-center">
                <div class="p-3 bg-white/5 rounded-lg border border-white/10">
                  <Icon name="heroicons:cube-transparent" class="w-8 h-8 mx-auto mb-1 text-pink-400" />
                  <p class="font-semibold text-sm">Módulos Interactivos</p>
                </div>
                <div class="p-3 bg-white/5 rounded-lg border border-white/10">
                  <Icon name="heroicons:clock" class="w-8 h-8 mx-auto mb-1 text-aquamarine" />
                  <p class="font-semibold text-sm">A tu Ritmo</p>
                </div>
                <div class="p-3 bg-white/5 rounded-lg border border-white/10">
                  <Icon name="heroicons:sparkles" class="w-8 h-8 mx-auto mb-1 text-aquamarine" />
                  <p class="font-semibold text-sm">Tutor IA</p>
                </div>
                <div class="p-3 bg-white/5 rounded-lg border border-white/10">
                  <Icon name="heroicons:code-bracket" class="w-8 h-8 mx-auto mb-1 text-pink-400" />
                  <p class="font-semibold text-sm">Habilidades Reales</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Slide 3 -->
        <div v-if="currentSlide === 2" key="tutor" class="w-full h-full flex-shrink-0">
          <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-8 h-full flex items-center">
            <div class="text-white w-full">
              <div class="flex flex-col md:flex-row items-center gap-8">
                <div class="flex-shrink-0">
                  <div class="w-28 h-28 rounded-full bg-white/10 backdrop-blur-sm border-2 border-aquamarine/50 flex items-center justify-center">
                    <Icon name="heroicons:chat-bubble-left-ellipsis" class="w-12 h-12 text-aquamarine" />
                  </div>
                </div>
                
                <div class="flex-grow text-center md:text-left">
                  <h2 class="text-3xl font-bold mb-4">¿Necesitas ayuda?</h2>
                  <p class="text-lg text-gray-300 mb-6">
                    Nuestro tutor virtual está aquí para ayudarte. Pregúntale sobre cualquier tema y obtén respuestas instantáneas.
                  </p>
                  <button disabled class="inline-flex items-center gap-2 px-6 py-3 bg-aquamarine/20 backdrop-blur-sm text-aquamarine font-bold rounded-full border border-aquamarine/50 cursor-not-allowed transition-all duration-300 hover:bg-aquamarine/30">
                    <Icon name="heroicons:chat-bubble-left-right" class="w-5 h-5" />
                    Iniciar Conversación (Próximamente)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
        <!-- Indicadores de Slide -->
      <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        <button
          v-for="(slide, index) in 3"
          :key="index"
          @click="goToSlide(index)"
          class="w-3 h-3 rounded-full transition-all duration-300 bg-slate-600"
          :style="currentSlide === index ? 'background-color: #00d9ff; width: 2rem;' : ''"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const currentSlide = ref(0);
const autoPlayInterval = ref(null);
const totalSlides = 3;

// --- VARIABLES PARA BACKEND ---
const totalModules = ref(0);
const completedModules = ref(0);
const currentModule = ref(null);
// -------------------------------------------

const progressPercentage = computed(() => {
  if (totalModules.value === 0) return 0;
  return Math.round((completedModules.value / totalModules.value) * 100);
});

const nextSlide = () => {
  stopAutoPlay();
  currentSlide.value = (currentSlide.value + 1) % totalSlides;
  startAutoPlay();
};

const prevSlide = () => {
  stopAutoPlay();
  currentSlide.value = (currentSlide.value - 1 + totalSlides) % totalSlides;
  startAutoPlay();
};

const goToSlide = (index) => {
  stopAutoPlay();
  currentSlide.value = index;
  startAutoPlay();
};

const startAutoPlay = () => {
  stopAutoPlay();
  autoPlayInterval.value = setInterval(nextSlide, 5000);
};

const stopAutoPlay = () => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value);
  }
};

onMounted(() => {
  startAutoPlay();
});

onUnmounted(() => {
  stopAutoPlay();
});
</script>

<style scoped>

:root {
  --accent-aquamarine: #00d9ff;
}

/* Animaciones para las transiciones */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease-in-out;
}
.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-leave-active {
  position: absolute;
}
</style>
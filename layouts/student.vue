<template>
  <div class="grid-container">
    <TheSidebar 
      :is-open="isSidebarOpen" 
      @close="closeSidebar" 
    />
    <div class="content-wrapper">
      <!-- Header -->
      <TheHeader @menu-toggle="toggleSidebar" />
      <main class="content-area">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};
</script>

<style scoped>

.grid-container {
  display: grid;
  grid-template-columns: 1fr; 
  grid-template-rows: auto 1fr;
  height: 100vh;
  background-color: rgb(249 250 251); 
}

.dark .grid-container {
  background-color: rgb(17 24 39); 
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden; 
}

.content-area { 
  flex-grow: 1; 
  overflow-y: auto; 
  overflow-x: hidden;
  padding: 1.5rem; 
  padding-top: 4rem; 
}
</style>
<template>
  <div class="min-h-screen bg-gray-50">
    <div class="sticky top-0 z-20">
      <TheNavbar />
    </div>
    <main class="container mx-auto px-4 py-8 space-y-6">
      <router-view>

      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import TheNavbar from './components/TheNavbar.vue'
</script>

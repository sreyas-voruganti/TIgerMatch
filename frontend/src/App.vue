<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div>
      <nav class="bg-orange-200 p-4 space-x-10 flex justify-center font-bold text-xl">
        <RouterLink to="/" class="hover:text-orange-700">Home</RouterLink>
        <RouterLink to="/about" class="hover:text-orange-700">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>
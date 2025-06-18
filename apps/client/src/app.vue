<template lang="html">
  <Background />
  <main class="layout">
    <RouterView />
  </main>
</template>

<script lang="ts" setup>
import { RouterView } from 'vue-router';
import Background from './components/background.vue';
</script>

<style lang="css" src="./styles/globals.css"></style>

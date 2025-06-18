<template lang="html">
  <div class="background">
    <div class="background__shape"></div>
    <div class="background__shape"></div>
    <div class="background__shape"></div>
    <div class="background__shape"></div>
    <div class="background__overlay"></div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'Background',
});
</script>

<style lang="css" scoped>
@reference '@fake-coin/client/styles/globals.css';

.background {
  @apply fixed top-0 left-0 -z-1 h-dvh w-dvw overflow-hidden;

  &:before {
    @apply animate-grain h-grain w-grain content-empty fixed -top-40 -left-40 bg-[image:url('@fake-coin/client/assets/images/grain.png')] opacity-85;
  }

  & > .background__shape {
    @apply blur-shape absolute;

    &:nth-child(1) {
      @apply to-shape-1 from-background animate-float-1 -top-60 -right-40 h-160 w-160 rounded-full bg-linear-45;
    }

    &:nth-child(2) {
      @apply from-background to-shape-2 animate-float-2 -bottom-40 -left-40 h-80 w-240 rotate-30 bg-linear-360;
    }

    &:nth-child(3) {
      @apply from-background animate-float-3 to-shape-3 right-20 -bottom-20 h-80 w-80 rotate-45 bg-linear-270;
    }

    &:nth-child(4) {
      @apply from-background animate-float-4 to-shape-4 top-20 left-40 h-60 w-60 rotate-45 rounded-full bg-linear-0;
    }
  }

  & > .background__overlay {
    @apply absolute z-1 h-dvh w-dvw bg-linear-to-b from-transparent to-black/50;
  }
}
</style>

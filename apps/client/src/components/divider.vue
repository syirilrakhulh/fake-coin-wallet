<template lang="html">
  <div class="divider">
    <hr class="divider__line" />
    <template v-if="$slots.default">
      <span class="divider__text">
        <slot></slot>
      </span>
      <hr class="divider__line" />
    </template>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'Divider',
});
</script>

<style lang="css" scoped>
@reference '@fake-coin/client/styles/globals.css';

.divider {
  @apply font-jakarta text-text/10 mx-auto flex items-center justify-center gap-2;

  & > .divider__line {
    @apply w-full text-current;
  }

  & > .divider__text {
    @apply text-label-sm text-text/50 uppercase;
  }
}
</style>

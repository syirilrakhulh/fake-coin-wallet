<template lang="html">
  <button
    :class="{
      button: true,
      'button--solid': variant === 'solid',
      'button--ghost': variant === 'ghost',
    }"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
interface ButtonProps {
  variant?: 'solid' | 'ghost';
}

defineOptions({
  name: 'Button',
});

const { variant = 'solid' } = defineProps<ButtonProps>();
</script>

<style lang="css" scoped>
@reference '@fake-coin/client/styles/globals.css';

.button {
  @apply font-jakarta text-body-md text-text w-fit cursor-pointer font-medium outline-none disabled:cursor-not-allowed disabled:opacity-50;

  &.button--solid {
    @apply glass-current min-w-40 rounded-full px-4 py-2 transition-colors duration-300 ease-in-out not-disabled:hover:border-current/50 not-disabled:hover:bg-current/10 not-disabled:focus-visible:border-current/50 not-disabled:focus-visible:bg-current/10 not-disabled:active:border-current/75 not-disabled:active:bg-current/20;
  }

  &.button--ghost {
    @apply underline-animation;
  }
}
</style>

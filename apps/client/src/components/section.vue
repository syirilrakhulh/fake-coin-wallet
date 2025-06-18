<template lang="html">
  <section class="section">
    <div class="section__header">
      <div class="section__title">
        <template v-if="$slots.icon">
          <span class="section__icon">
            <slot name="icon"></slot>
          </span>
        </template>
        <h1 class="section__title-text">
          {{ title }}
        </h1>
      </div>
      <!-- <Button class="section__close" type="button">
        <span class="section__close-icon">
          <CloseIcon />
        </span>
      </Button> -->
    </div>
    <div class="seciton__content">
      <slot></slot>
    </div>
  </section>
</template>

<script lang="ts" setup>
// import CloseIcon from '@fake-coin/client/assets/icons/close.svg';
// import Button from './button.vue';

interface SectionProps {
  title: string;
}

interface Slots {
  default: () => void;
  icon: () => void;
}

defineOptions({
  name: 'Section',
});

const { title } = defineProps<SectionProps>();
const slots = defineSlots<Slots>();
</script>

<style lang="css" scoped>
@reference '@fake-coin/client/styles/globals.css';

.section {
  @apply glass-white mx-auto flex max-w-4xl flex-col gap-8 overflow-hidden rounded-3xl p-4;

  & > .section__header {
    @apply font-jakarta flex items-center justify-between;

    & > .section__title {
      @apply glass-white flex w-60 items-center gap-2 rounded-full p-1;

      & > .section__icon {
        @apply glass-white size-12 rounded-full p-2;
      }

      &:not(:has(> .section__icon)) {
        & > .section__title-text {
          @apply mx-4;
        }
      }

      & > .section__title-text {
        @apply text-title-lg font-jakarta text-text mr-3 font-medium;
      }
    }

    /* & > .section__close {
      @apply absolute top-4 right-4 flex min-w-0 p-1;

      & > .section__close-icon {
        @apply size-3;
      }
    } */
  }

  & > .seciton__content {
    @apply pb-4;
  }
}
</style>

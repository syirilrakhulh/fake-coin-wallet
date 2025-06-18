<template lang="html">
  <section
    :class="{
      callout: true,
      'callout--info': type === 'info',
      'callout--warning': type === 'warning',
      'callout--error': type === 'error',
    }"
  >
    <div class="callout__header">
      <div class="callout__title">
        <span class="callout__icon">
          <template v-if="type === 'info'">
            <InfoIcon />
          </template>
          <template v-else-if="type === 'warning'">
            <WarningIcon />
          </template>
          <template v-else>
            <ErrorIcon />
          </template>
        </span>
        <h3 class="callout__title-text">{{ title }}</h3>
      </div>
    </div>
    <div class="callout__content">
      <slot></slot>
    </div>
  </section>
</template>

<script lang="ts" setup>
import ErrorIcon from '@fake-coin/client/assets/icons/error.svg';
import InfoIcon from '@fake-coin/client/assets/icons/info.svg';
import WarningIcon from '@fake-coin/client/assets/icons/warning.svg';

interface CalloutProps {
  title: string;
  type?: 'info' | 'warning' | 'error';
}

defineOptions({
  name: 'Callout',
});

const { title, type = 'info' } = defineProps<CalloutProps>();
</script>

<style lang="css" scoped>
@reference '@fake-coin/client/styles/globals.css';

.callout {
  @apply glass-white text-text flex flex-col gap-2 rounded-xl p-2;

  &.callout--warning {
    @apply glass-warning text-warning;
  }

  &.callout--error {
    @apply glass-error text-error;
  }

  & > .callout__header {
    @apply font-jakarta flex items-center justify-between;

    & > .callout__title {
      @apply glass-white flex items-center justify-center gap-1 rounded-full p-1;

      & > .callout__icon {
        @apply size-6;
      }

      & > .callout__title-text {
        @apply text-text mr-3 font-medium;
      }
    }
  }

  & > .callout__content {
    @apply text-text/50;
  }
}
</style>

<template lang="html">
  <div :class="['text-area', classProp]">
    <label class="text-area__label" :for="id">{{ label }}</label>
    <div class="text-area__container">
      <textarea v-bind="$attrs" class="text-area__native" :id="id" rows="4" v-model="internalValue" />
    </div>
    <template v-if="errorText && isError">
      <small class="text-area__error-text">
        <span class="text-area__helper-icon"><WarningIcon /></span>
        {{ errorText }}
      </small>
    </template>
    <template v-else-if="helperText">
      <small class="text-area__helper-text">
        <span class="text-area__helper-icon"><HelpIcon /></span>
        {{ helperText }}
      </small>
    </template>
  </div>
</template>

<script lang="ts" setup>
import HelpIcon from '@fake-coin/client/assets/icons/help.svg';
import WarningIcon from '@fake-coin/client/assets/icons/warning.svg';
import { computed } from 'vue';

interface TextAreaProps {
  class?: string;
  errorText?: string;
  helperText?: string;
  id?: string;
  isError?: boolean;
  label: string;
  modelValue: string;
}

defineOptions({
  inheritAttrs: false,
  name: 'TextArea',
});

const { class: classProp, errorText, helperText, id, isError, label, modelValue } = defineProps<TextAreaProps>();

const emit = defineEmits(['update:modelValue']);

const internalValue = computed({
  get: () => modelValue,
  set: (val) => emit('update:modelValue', val),
});
</script>

<style lang="css" scoped>
@reference '@fake-coin/client/styles/globals.css';

.text-area {
  @apply flex flex-col gap-1;

  & > .text-area__label {
    @apply font-jakarta text-text w-fit cursor-pointer font-medium;

    &:not(:has(+ .text-area__container > .text-area__native:focus)):hover + .text-area__container {
      @apply border-text/50;
    }
  }

  & > .text-area__container {
    @apply border-text/10 focus-within:border-text/75 hover:border-text/50 flex rounded-3xl border transition-colors duration-300 ease-in-out;

    & > .text-area__native {
      @apply text-text placeholder:text-text/25 w-full resize-none px-4 py-3 outline-none;
    }
  }

  & > .text-area__error-text,
  & > .text-area__helper-text {
    @apply text-label-sm text-text/50 inline-flex gap-1;

    & > .text-area__helper-icon {
      @apply size-4;
    }
  }

  & > .text-area__error-text > .text-area__helper-icon {
    @apply text-error;
  }
}
</style>

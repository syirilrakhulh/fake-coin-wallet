<template lang="html">
  <div :class="['text-field', classProp]">
    <label class="text-field__label" :for="id">{{ label }}</label>
    <div class="text-field__container">
      <input v-bind="$attrs" class="text-field__input" :id="id" v-model="internalValue" />
    </div>
    <template v-if="errorText && isError">
      <small class="text-field__error-text">
        <span class="text-field__helper-icon"><WarningIcon /></span>
        {{ errorText }}
      </small>
    </template>
    <template v-else-if="helperText">
      <small class="text-field__helper-text">
        <span class="text-field__helper-icon"><HelpIcon /></span>
        {{ helperText }}
      </small>
    </template>
  </div>
</template>

<script lang="ts" setup>
import HelpIcon from '@fake-coin/client/assets/icons/help.svg';
import WarningIcon from '@fake-coin/client/assets/icons/warning.svg';
import { computed } from 'vue';

interface TextFieldProps {
  class?: string;
  errorText?: string;
  helperText?: string;
  id?: string;
  isError?: boolean;
  label: string;
  modelValue: string | number;
}

defineOptions({
  inheritAttrs: false,
  name: 'TextField',
});

const { class: classProp, errorText, helperText, id, isError, label, modelValue } = defineProps<TextFieldProps>();

const emit = defineEmits(['update:modelValue']);

const internalValue = computed({
  get: () => modelValue,
  set: (val) => emit('update:modelValue', val),
});
</script>

<style lang="css" scoped>
@reference '@fake-coin/client/styles/globals.css';

.text-field {
  @apply flex flex-col gap-1;

  & > .text-field__label {
    @apply font-jakarta text-text w-fit cursor-pointer font-medium;

    &:not(:has(+ .text-field__container > .text-field__input:focus)):hover + .text-field__container {
      @apply border-text/50;
    }
  }

  & > .text-field__container {
    @apply border-text/10 focus-within:border-text/75 hover:border-text/50 rounded-full border transition-colors duration-300 ease-in-out;

    & > .text-field__input {
      @apply text-text placeholder:text-text/25 w-full px-4 py-3 outline-none;
    }
  }

  & > .text-field__error-text,
  & > .text-field__helper-text {
    @apply text-label-sm text-text/50 inline-flex gap-1;

    & > .text-field__helper-icon {
      @apply size-4;
    }
  }

  & > .text-field__error-text > .text-field__helper-icon {
    @apply text-error;
  }
}
</style>

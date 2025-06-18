<template lang="html">
  <label :class="['checkbox', classProp]" :for="id">
    <input v-bind="$attrs" class="peer checkbox__input" :id="id" type="checkbox" v-model="internalValue" />
    <div class="checkbox__virtual-checkbox">
      <span class="checkbox__icon">
        <CheckIcon />
      </span>
    </div>
    <span :class="['checkbox__label', labelPlacement === 'left' ? 'checkbox__label--left' : 'checkbox__label--right']">
      <slot></slot>
    </span>
  </label>
</template>

<script lang="ts" setup>
import CheckIcon from '@fake-coin/client/assets/icons/check.svg';
import { computed } from 'vue';

interface CheckboxProps {
  class?: any;
  id?: string;
  labelPlacement?: 'left' | 'right';
  modelValue: boolean;
}

defineOptions({
  inheritAttrs: false,
  name: 'Checkbox',
});

const { class: classProp, id, labelPlacement = 'left', modelValue } = defineProps<CheckboxProps>();

const emit = defineEmits(['update:modelValue']);

const internalValue = computed({
  get: () => modelValue,
  set: (val) => emit('update:modelValue', val),
});
</script>

<style lang="css" scoped>
@reference '@fake-coin/client/styles/globals.css';

.checkbox {
  @apply flex w-fit cursor-pointer items-start gap-2;

  & > .checkbox__input {
    @apply sr-only;
  }

  & > .checkbox__virtual-checkbox {
    @apply border-text/10 peer-checked:text-text peer-hover:border-text/50 peer-focus-visible:border-text/75 flex size-4 items-center justify-center rounded-sm border text-transparent transition-colors duration-300 ease-in-out;

    & > .checkbox__icon {
      @apply size-3 transition-colors duration-300 ease-in-out;
    }
  }

  & > .checkbox__label--right {
    order: -1;
  }
}
</style>

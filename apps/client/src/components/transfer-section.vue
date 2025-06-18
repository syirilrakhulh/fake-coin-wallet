<template lang="html">
  <Section :title="isSignedIn ? 'Transfers Coin' : 'Authentication'">
    <template #icon>
      <TransferIcon />
    </template>
    <template v-if="isSignedIn">
      <TransferForm />
    </template>
    <template v-else>
      <SignInForm />
    </template>
  </Section>
</template>

<script lang="ts" setup>
import TransferIcon from '@fake-coin/client/assets/icons/transfer.svg';
import { useWallet } from '@fake-coin/client/stores/wallet';
import { computed } from 'vue';
import Section from './section.vue';
import SignInForm from './sign-in-form.vue';
import TransferForm from './transfer-form.vue';

defineOptions({
  name: 'TransferSection',
});

const store = useWallet();

const isSignedIn = computed(() => store.encryptedWallet && store.walletAccount);
</script>

<style lang="css" scoped></style>

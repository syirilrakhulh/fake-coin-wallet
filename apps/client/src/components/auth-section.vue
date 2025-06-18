<template lang="html">
  <Section title="Authentication">
    <template #icon>
      <AuthIcon />
    </template>
    <template v-if="createdMnemonicPhrase && encryptedWallet">
      <PhraseViewer @complete-wallet-creation="completeWalletCreation" :mnemonic-phrase="createdMnemonicPhrase" />
    </template>
    <template v-else>
      <WalletForm
        @get-encrypted-wallet="setEncryptedWallet"
        @get-mnemonic-phrase="setMnemonicPhrase"
        @get-wallet-account="setWalletAccount"
      />
    </template>
  </Section>
</template>

<script lang="ts" setup>
import AuthIcon from '@fake-coin/client/assets/icons/auth.svg';
import { useWallet } from '@fake-coin/client/stores/wallet';
import type { EncryptedWallet, WalletAccount } from '@fake-coin/wallet';
import { ref } from 'vue';
import PhraseViewer from './phrase-viewer.vue';
import Section from './section.vue';
import WalletForm from './wallet-form.vue';

defineOptions({
  name: 'AuthSection',
});

const createdMnemonicPhrase = ref<string | null>(null);
const encryptedWallet = ref<EncryptedWallet | null>(null);
const walletAccount = ref<WalletAccount | null>(null);
const store = useWallet();

const setMnemonicPhrase = (mnemonicPhrase: string) => {
  createdMnemonicPhrase.value = mnemonicPhrase;
};

const setEncryptedWallet = (newEncryptedWallet: EncryptedWallet) => {
  encryptedWallet.value = newEncryptedWallet;
};

const setWalletAccount = (newWalletAccount: WalletAccount) => {
  walletAccount.value = newWalletAccount;
};

const completeWalletCreation = () => {
  store.setEncryptedWallet(encryptedWallet.value);
  store.setWalletAccount(walletAccount.value);
};
</script>

<style lang="css" scoped></style>

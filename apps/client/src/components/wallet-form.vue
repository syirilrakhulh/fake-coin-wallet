<template lang="html">
  <template v-if="isSignInProcess">
    <h2 class="wallet-form-title">Reclaim Your Fake Coin Wallet</h2>
    <p class="wallet-form-description">
      Effortlessly Recover Your Fake Coin Wallet and Securely Access Your Fake Coin Portfolio.
    </p>
    <form class="wallet-form" name="recover-wallet" @submit.prevent="recoverWallet">
      <TextArea
        id="id"
        name="id"
        placeholder="Enter your 12-word seed phrase"
        autofocus
        autocomplete="off"
        label="Recovery Seed Phrase"
        helper-text="Ensure no extra spaces or typos"
        v-model.trim="mnemonicPhrase"
      />
      <div class="wallet-form__line">
        <TextField
          id="password"
          name="password"
          placeholder="Create a password"
          type="password"
          autocomplete="off"
          label="Password"
          helper-text="8 characters, letters, numbers, or symbols"
          :is-error="!isPasswordValid"
          :error-text="passwordError"
          v-model.trim="password"
        />
        <TextField
          id="password_confirmation"
          name="password_confirmation"
          placeholder="Confirm your password"
          helper-text="Re-enter your password to ensure it matches"
          type="password"
          autocomplete="off"
          label="Password Confirmation"
          :is-error="!isPasswordConfirmationMatch && passwordConfirmation.length > 0"
          error-text="Passwords do not match."
          v-model.trim="passwordConfirmation"
        />
      </div>
      <Button
        class="wallet-form__button wallet-form__button--main"
        :disabled="!isUserPasswordValid && mnemonicPhrase.length > 0"
        type="submit"
      >
        Recover Wallet
      </Button>
      <Divider class="wallet-form__divider">Or</Divider>
      <Button class="wallet-form__button" @click="toggleAuthProcess(false)" type="button" variant="ghost">
        Don't Have a Wallet? Create Your Fake Coin Wallet Now!
      </Button>
    </form>
  </template>
  <template v-else>
    <h2 class="wallet-form-title">Launch Your Secure Fake Coin Journey</h2>
    <p class="wallet-form-description">
      Establish Your Fake Coin Wallet with Confidence, Taking Full Control of Your Fake Coin Assets.
    </p>
    <form class="wallet-form" name="create-wallet" @submit.prevent="createWallet">
      <TextField
        id="password"
        name="password"
        placeholder="Create a password"
        type="password"
        autofocus
        autocomplete="off"
        label="Password"
        helper-text="8 characters, letters, numbers, or symbols"
        :is-error="!isPasswordValid"
        :error-text="passwordError"
        v-model.trim="password"
      />
      <TextField
        id="password_confirmation"
        name="password_confirmation"
        placeholder="Confirm your password"
        type="password"
        autocomplete="off"
        label="Password Confirmation"
        helper-text="Re-enter your password to ensure it matches"
        :is-error="!isPasswordConfirmationMatch && passwordConfirmation.length > 0"
        error-text="Passwords do not match."
        v-model.trim="passwordConfirmation"
      />
      <Callout title="Exclusive Welcome Bonus">
        As a token of appreciation, we’ve credited your account with 100 Fake Coin to begin your secure cryptocurrency
        experience.
      </Callout>
      <Button
        class="wallet-form__button wallet-form__button--main"
        :disabled="!isUserPasswordValid || isLoading"
        type="submit"
      >
        Create Wallet
      </Button>
      <Divider class="wallet-form__divider">Or</Divider>
      <Button class="wallet-form__button" @click="toggleAuthProcess(true)" type="button" variant="ghost">
        Already Have a Wallet? Recover Your Fake Coin Wallet!
      </Button>
    </form>
  </template>
</template>

<script lang="ts" setup>
import { useFetch } from '@fake-coin/client/composables/fetch';
import { usePasswordValidator } from '@fake-coin/client/composables/password';
import { useWallet } from '@fake-coin/client/stores/wallet';
import {
  type EncryptedWallet,
  type WalletAccount,
  createEncryptedWallet,
  generateMnemonicPhrase,
  recoverWalletFromMnemonic,
  restoreWalletFromEncrypted,
  signMessage,
} from '@fake-coin/wallet';
import { computed, ref, watch } from 'vue';
import Button from './button.vue';
import Callout from './callout.vue';
import Divider from './divider.vue';
import TextArea from './text-area.vue';
import TextField from './text-field.vue';

interface WalletFormEmits {
  getMnemonicPhrase: [mnemonicPhrase: string];
  getEncryptedWallet: [encryptedWallet: EncryptedWallet];
  getWalletAccount: [walletAccount: WalletAccount];
}

defineOptions({
  name: 'WalletForm',
});

const emit = defineEmits<WalletFormEmits>();

const isSignInProcess = ref(false);
const mnemonicPhrase = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const { error: passwordError, isValid: isPasswordValid, validate: validatePassword } = usePasswordValidator();
const store = useWallet();
const { fetchData, isLoading } = useFetch<WalletAccount>();

const isPasswordConfirmationMatch = computed(() => password.value === passwordConfirmation.value);

const isUserPasswordValid = computed(
  () => password.value.length > 0 && isPasswordValid.value && isPasswordConfirmationMatch.value,
);

const createWallet = async () => {
  try {
    if (!isUserPasswordValid.value) return;

    const newMnemonicPhrase = generateMnemonicPhrase();

    const encryptedWallet = await createEncryptedWallet(newMnemonicPhrase, password.value);

    const wallet = await restoreWalletFromEncrypted(encryptedWallet, password.value);

    const messageToSend = `Create wallet at ${new Date().toISOString()}`;

    const { message, messageHash, recovery, signature } = signMessage(messageToSend, wallet.privateKey);

    const payload = {
      message,
      messageHash,
      recovery,
      signature,
    };

    const { data } = await fetchData('/init', {
      body: JSON.stringify(payload),
      headers: new Headers({ 'Content-Type': 'application/json' }),
      method: 'POST',
    });

    if (data) {
      emit('getEncryptedWallet', encryptedWallet);

      emit('getMnemonicPhrase', newMnemonicPhrase);

      emit('getWalletAccount', data);
    }
  } catch (error: any) {
    console.error(error);
  }
};

const recoverWallet = async () => {
  try {
    if (!isUserPasswordValid.value) return;

    const encryptedWallet = await recoverWalletFromMnemonic(mnemonicPhrase.value, password.value);

    const wallet = await restoreWalletFromEncrypted(encryptedWallet, password.value);

    const messageToSend = `Signed in at ${new Date().toISOString()}`;

    const { message, messageHash, recovery, signature } = signMessage(messageToSend, wallet.privateKey);

    const payload = {
      message,
      messageHash,
      recovery,
      signature,
    };

    const { data } = await fetchData('/wallet', {
      body: JSON.stringify(payload),
      headers: new Headers({ 'Content-Type': 'application/json' }),
      method: 'POST',
    });

    if (data) {
      store.setWalletAccount(data);

      store.setEncryptedWallet(encryptedWallet);
    }
  } catch (error: any) {
    console.error(error);
  }
};

const toggleAuthProcess = (onSignInProcess: boolean) => {
  isSignInProcess.value = onSignInProcess;
  mnemonicPhrase.value = '';
  password.value = '';
  passwordConfirmation.value = '';
};

watch(
  password,
  (newPassword) => {
    validatePassword(newPassword);
  },
  { immediate: false },
);
</script>

<style lang="css" scoped>
@reference '@fake-coin/client/styles/globals.css';

.wallet-form-title {
  @apply font-jakarta text-title-lg text-text mx-auto mb-2 max-w-2xl text-center font-bold;
}

.wallet-form-description {
  @apply text-body-md text-text/50 mx-auto mb-8 max-w-2xl text-center;
}

.wallet-form {
  @apply mx-auto flex max-w-2xl flex-col gap-4;

  & > .wallet-form__line {
    @apply grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6;
  }

  & > .wallet-form__first-new-line {
    @apply mt-2;
  }

  & > .wallet-form__button {
    @apply mx-auto;

    &.wallet-form__button--main {
      @apply mt-4;
    }
  }

  & > .wallet-form__divider {
    @apply w-full max-w-80;
  }
}
</style>

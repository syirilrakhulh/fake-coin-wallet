<template lang="html">
  <h2 class="sign-in-title">Unlock Your Fake Coin Wallet</h2>
  <p class="sign-in-description">
    Sign in to access your Fake Coin Wallet and take control of your digital assets with confidence.
  </p>
  <form class="sign-in-form" name="sign-in" @submit.prevent="signIn">
    <TextField
      id="password"
      name="password"
      label="Password"
      placeholder="Input your wallet password"
      type="password"
      autocomplete="off"
      v-model.trim="password"
    />
    <Button class="sign-in-form__button sign-in-form__button--main" :disabled="!password" type="submit">
      Sign In
    </Button>
    <Divider class="sign-in-form__divider">Or</Divider>
    <Button class="sign-in-form__button" @click="changeWallet" type="button" variant="ghost">
      Using Another Wallet? Switch or Create Your Fake Coin Wallet Now!
    </Button>
  </form>
</template>

<script lang="ts" setup>
import { type WalletAccount, restoreWalletFromEncrypted, signMessage } from '@fake-coin/wallet';
import { ref } from 'vue';
import { useFetch } from '../composables/fetch';
import { useWallet } from '../stores/wallet';
import Button from './button.vue';
import Divider from './divider.vue';
import TextField from './text-field.vue';

defineOptions({
  name: 'SignInForm',
});

const password = ref('');
const store = useWallet();
const { fetchData } = useFetch<WalletAccount>();

const changeWallet = () => {
  store.setEncryptedWallet(null);
};

const signIn = async () => {
  try {
    if (!store.encryptedWallet) return;

    const wallet = await restoreWalletFromEncrypted(store.encryptedWallet, password.value);

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

    store.setWalletAccount(data);
  } catch (error: any) {
    console.error(error);
  }
};
</script>

<style lang="css" scoped>
@reference '@fake-coin/client/styles/globals.css';

.sign-in-title {
  @apply font-jakarta text-title-lg text-text mx-auto mb-2 max-w-2xl text-center font-bold;
}

.sign-in-description {
  @apply text-body-md text-text/50 mx-auto mb-8 max-w-2xl text-center;
}

.sign-in-form {
  @apply mx-auto flex max-w-2xl flex-col gap-4;

  & > .sign-in-form__button {
    @apply mx-auto;

    &.sign-in-form__button--main {
      @apply mt-4;
    }
  }

  & > .sign-in-form__divider {
    @apply w-full max-w-80;
  }
}
</style>

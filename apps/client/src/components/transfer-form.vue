<template lang="html">
  <template v-if="store.encryptedWallet && store.walletAccount">
    <h2 class="transfer-form-title">Seamlessy Transfer Your Fake Coin</h2>
    <p class="transfer-form-description">
      Effortlessly send Fake Coin to everyone with speed, security, and confidence.
    </p>
    <div class="transfer-form">
      <Card class="transfer-form__card" />
      <form name="transfer-form" class="transfer-form__form" @submit.prevent="sendCoin">
        <TextField
          id="address"
          name="address"
          label="Wallet Address"
          placeholder="Enter the destination wallet address (e.g., 0x1234567890abcdef...)"
          autofocus
          autocomplete="off"
          v-model.trim="transferAddress"
        />
        <TextField
          id="amount"
          name="amount"
          label="Amount"
          placeholder="Specify the amount of Fake Coin (e.g., 0.2)"
          min="0.01"
          step="0.01"
          type="number"
          autocomplete="off"
          v-model.number="transferAmount"
          :helper-text="`Ensure sufficient balance for transfer and fees (${TRANSFER_FEE})`"
          :is-error="store.walletAccount.balance < transferAmount + TRANSFER_FEE"
          error-text="Insufficient balance for transfer and fees"
        />
        <TextField
          id="password"
          name="password"
          label="Password"
          placeholder="Input your wallet password to authorize the transaction"
          type="password"
          autocomplete="off"
          v-model.trim="password"
        />
        <Checkbox class="transfer-form__first-new-line" v-model="isAgreeWithFee">
          I agree to proceed with the cryptocurrency transfer, including {{ TRANSFER_FEE }} transaction fees.</Checkbox
        >
        <Checkbox v-model="isAddressCorrect"
          >I confirm that the provided wallet address is correct and have verified its accuracy.</Checkbox
        >
        <Callout class="transfer-form__first-new-line" title="Secure Your Fake Coin" type="warning">
          The wallet address for your Fake Coin transfer has been entered. Please meticulously verify its accuracy, as
          the system bears no liability for errors. Funds transferred to an incorrect address are irretrievable.
        </Callout>
        <Button class="transfer-form__button transfer-form__button--main" :disabled="!isFormValid" type="submit">
          Send Fake Coin
        </Button>
        <Divider class="transfer-form__divider">Or</Divider>
        <Button class="transfer-form__button" @click="changeWallet" type="button" variant="ghost">
          Want to Send from Different Wallet? Switch Your Fake Coin Wallet Now!
        </Button>
      </form>
    </div>
  </template>
</template>

<script lang="ts" setup>
import { TRANSFER_FEE, type WalletAccount, restoreWalletFromEncrypted, signMessage } from '@fake-coin/wallet';
import { computed, ref } from 'vue';
import { useFetch } from '../composables/fetch';
import { useWallet } from '../stores/wallet';
import Button from './button.vue';
import Callout from './callout.vue';
import Card from './card.vue';
import Checkbox from './checkbox.vue';
import Divider from './divider.vue';
import TextField from './text-field.vue';

defineOptions({
  name: 'TransferForm',
});

const isAgreeWithFee = ref(false);
const isAddressCorrect = ref(false);
const password = ref('');
const transferAddress = ref('');
const transferAmount = ref(0);
const store = useWallet();
const { fetchData } = useFetch<WalletAccount>();

const isFormValid = computed(
  () =>
    transferAddress.value.length > 0 &&
    transferAmount.value > 0 &&
    password.value.length > 0 &&
    isAgreeWithFee.value &&
    isAddressCorrect.value &&
    store.walletAccount &&
    store.walletAccount.balance >= transferAmount.value + TRANSFER_FEE,
);

const changeWallet = () => {
  store.setEncryptedWallet(null);
};

const sendCoin = async () => {
  try {
    if (!store.encryptedWallet) return;

    const wallet = await restoreWalletFromEncrypted(store.encryptedWallet, password.value);

    const messageToSend = `Sending ${transferAmount.value} Fake Coin at ${new Date().toISOString()}`;

    const { message, messageHash, recovery, signature } = signMessage(messageToSend, wallet.privateKey);

    const payload = {
      address: transferAddress.value,
      amount: transferAmount.value,
      message,
      messageHash,
      recovery,
      signature,
    };

    const { data } = await fetchData('/transfer', {
      body: JSON.stringify(payload),
      headers: new Headers({ 'Content-Type': 'application/json' }),
      method: 'POST',
    });

    console.log('Updated Wallet: ', data);

    if (data) {
      store.setWalletAccount(data);
    }
  } catch (error: any) {
    console.error(error);
  }
};
</script>

<style lang="css" scoped>
@reference '@fake-coin/client/styles/globals.css';

.transfer-form-title {
  @apply text-title-lg font-jakarta text-text mx-auto mb-2 max-w-2xl text-center font-bold;
}

.transfer-form-description {
  @apply text-body-md text-text/50 mx-auto mb-8 max-w-2xl text-center;
}

.transfer-form {
  @apply mx-auto flex max-w-2xl flex-col gap-8 sm:flex-row;

  & > .transfer-form__card {
    @apply sm:aspect-card-portrait sm:order-1 sm:h-full sm:w-2/5;
  }

  & > .transfer-form__form {
    @apply flex flex-col gap-4 sm:w-3/5;

    & > .transfer-form__first-new-line {
      @apply mt-2;
    }

    & > .transfer-form__button {
      @apply mx-auto;

      &.transfer-form__button--main {
        @apply mt-4;
      }
    }

    & > .transfer-form__divider {
      @apply w-full max-w-80;
    }
  }
}
</style>

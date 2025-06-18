<template lang="html">
  <div class="group card">
    <h3 class="card__brand">
      <span>Fake</span>
      <span>Coin</span>
    </h3>
    <div class="card__info">
      <p class="card__balance">
        <span class="card__amount">{{ balance }}</span> Coin
      </p>
      <p class="card__address">
        {{ address }}
      </p>
      <div class="card__copy">
        <Button
          :class="['card__copy-button', isCopied ? 'card__copy-button--copied' : '']"
          @click="copyToClipboard(address)"
          type="button"
        >
          <span class="card__copy-icon">
            <CopyIcon />
          </span>
        </Button>
        <span :class="['card__copy-flag', isCopied ? 'card__copy-flag--copied' : '']">Copied</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CopyIcon from '@fake-coin/client/assets/icons/copy.svg';
import { useClipboard } from '@fake-coin/client/composables/clipboard';
import { formatNumber } from '@fake-coin/client/utils/number';
import { computed } from 'vue';
import { useWallet } from '../stores/wallet';
import Button from './button.vue';

defineOptions({
  name: 'Card',
});

const store = useWallet();
const { copyToClipboard, isCopied } = useClipboard();

const address = computed(() => (store.encryptedWallet ? store.encryptedWallet.address : ''));
const balance = computed(() => formatNumber(store.walletAccount ? store.walletAccount.balance : 0));
</script>

<style lang="css" scoped>
@reference '@fake-coin/client/styles/globals.css';

.card {
  @apply font-jakarta aspect-card-landscape relative flex h-auto w-full rounded-2xl bg-[image:url(@fake-coin/client/assets/images/my-wallet.jpg)] bg-cover bg-top-left;

  & > .card__brand {
    @apply text-title-md text-text absolute top-1/25 left-1/25 inline-flex;

    & > span {
      @apply first:font-bold last:font-thin;
    }
  }

  & > .card__info {
    @apply absolute bottom-1/25 left-1/25 w-23/25;

    & > .card__balance {
      @apply text-title-lg text-text font-extralight;

      & > .card__amount {
        @apply font-semibold;
      }
    }

    & > .card__address {
      @apply text-body-lg break-all;
    }

    & > .card__copy {
      @apply text-body-lg flex items-center gap-2 overflow-hidden;

      & > .card__copy-button {
        @apply text-text/50 hover:text-text/75 focus-visible:text-text/75 active:text-text flex min-w-0 shrink-0 border-none bg-transparent p-0 transition-colors duration-300 ease-in-out;

        &.card__copy-button--copied {
          @apply text-text;
        }

        & > .card__copy-icon {
          @apply size-6;
        }
      }

      & > .card__copy-flag {
        @apply -ml-1 shrink-0 text-transparent transition-colors duration-300 ease-in-out;

        &.card__copy-flag--copied {
          @apply text-text;
        }
      }
    }
  }
}
</style>

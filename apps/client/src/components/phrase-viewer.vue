<template lang="html">
  <h2 class="phrase-viewer-title">Your Fake Coin Wallet is Live</h2>
  <p class="phrase-viewer-description">
    The seed phrase is provided below for your records. Securely copy or download it as a file and store it in a safe,
    offline location, as it is critical for wallet recovery.
  </p>
  <div class="phrase-viewer">
    <div class="phrase-viewer__content">
      <div class="phrase-viewer__headers">
        <h3 class="phrase-viewer__title">Seed Phrase</h3>
        <div class="phrase-viewer__actions">
          <Button
            class="phrase-viewer__action"
            @click="downloadTextFile('seed_phrase.txt', mnemonicPhrase)"
            type="button"
            variant="ghost"
          >
            <span class="phrase-viewer__action-icon">
              <DownloadIcon />
            </span>
            <span>Download</span>
          </Button>
          <Button class="phrase-viewer__action" @click="copyToClipboard(mnemonicPhrase)" type="button" variant="ghost">
            <span class="phrase-viewer__action-icon">
              <template v-if="isCopied">
                <CheckIcon />
              </template>
              <template v-else>
                <CopyIcon />
              </template>
            </span>
            <span>{{ isCopied ? 'Copied' : 'Copy' }}</span>
          </Button>
        </div>
      </div>
      <ul class="phrase-viewer__words">
        <li v-for="(word, index) in words" class="phrase-viewer__word" :data-order="index + 1">
          {{ word }}
        </li>
      </ul>
    </div>
    <Callout title="Safeguard Your Mnemonic Phrase" type="warning">
      Your mnemonic phrase is the key to your Fake Coin wallet. If lost, there is no way to recover your funds. Write it
      down on paper and store it in a secure, offline location to ensure your assets remain safe.
    </Callout>
    <Checkbox v-model="isSeedPhraseStored">
      I confirm that I have securely stored my Fake Coin wallet seed phrase in a safe, offline location.
    </Checkbox>
    <Button @click="$emit('completeWalletCreation')" :disabled="!isSeedPhraseStored" type="button">Continue</Button>
  </div>
</template>

<script lang="ts" setup>
import CheckIcon from '@fake-coin/client/assets/icons/check.svg';
import CopyIcon from '@fake-coin/client/assets/icons/copy.svg';
import DownloadIcon from '@fake-coin/client/assets/icons/download.svg';
import { useClipboard } from '@fake-coin/client/composables/clipboard';
import { downloadTextFile } from '@fake-coin/client/utils/download';
import { computed, ref } from 'vue';
import Button from './button.vue';
import Callout from './callout.vue';
import Checkbox from './checkbox.vue';

interface PhraseViewEmits {
  completeWalletCreation: [];
}

interface PhraseViewerProps {
  mnemonicPhrase: string;
}

defineOptions({
  name: 'PhraseViewer',
});

const { mnemonicPhrase } = defineProps<PhraseViewerProps>();
const emit = defineEmits<PhraseViewEmits>();
const { copyToClipboard, isCopied } = useClipboard();
const isSeedPhraseStored = ref(false);

const words = computed(() => mnemonicPhrase.split(' '));
</script>

<style lang="css" scoped>
@reference '@fake-coin/client/styles/globals.css';

.phrase-viewer-title {
  @apply font-jakarta text-title-lg text-text mx-auto mb-2 max-w-2xl text-center font-bold;
}

.phrase-viewer-description {
  @apply text-body-md text-text/50 mx-auto mb-8 max-w-2xl text-center;
}

.phrase-viewer {
  @apply mx-auto flex max-w-2xl flex-col items-center gap-4;

  & > .phrase-viewer__content {
    @apply glass-white w-full max-w-120 rounded-xl p-4;

    & > .phrase-viewer__headers {
      @apply mb-2 flex justify-between;

      & > .phrase-viewer__title {
        @apply text-text font-jakarta font-medium;
      }

      & > .phrase-viewer__actions {
        @apply flex items-center gap-2;

        & > .phrase-viewer__action {
          @apply text-body-sm flex items-center gap-1 before:content-none;

          & > .phrase-viewer__action-icon {
            @apply size-4;
          }
        }
      }
    }

    & > .phrase-viewer__words {
      @apply grid grid-cols-2 gap-x-2 gap-y-2 sm:grid-cols-3 sm:gap-x-4;

      & > .phrase-viewer__word {
        @apply before:glass-white font-jakarta border-text/10 text-text/75 before:text-text relative rounded-lg border py-2 pr-3 pl-10 font-light before:absolute before:top-1/2 before:left-3 before:w-6 before:-translate-y-1/2 before:rounded-sm before:text-center before:content-[attr(data-order)];
      }
    }
  }
}
</style>

<template lang="html">
  <template v-if="store.encryptedWallet">
    <TransferSection />
  </template>
  <template v-else>
    <!-- <template v-if="displayLandingPage"> -->
    <AuthSection />
    <!-- </template>
    <template v-else>
      <div class="landing-page">
        <h1 class="landing-page__title">Your Gateway to Freedom</h1>
        <p class="landing-page__description">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, blanditiis soluta a, minima pariatur
          ducimus sunt earum facilis magnam recusandae sed, nobis deserunt voluptates architecto accusamus quisquam ipsa
          nostrum velit.
        </p>
      </div>
    </template> -->
  </template>
</template>

<script lang="ts" setup>
import AuthSection from '@fake-coin/client/components/auth-section.vue';
import TransferSection from '@fake-coin/client/components/transfer-section.vue';
import { useWallet } from '@fake-coin/client/stores/wallet';
import { ref } from 'vue';

const displayLandingPage = ref(false);

const store = useWallet();
</script>

<style lang="css" scoped>
@reference '@fake-coin/client/styles/globals.css';

.landing-page {
  @apply flex h-full w-full flex-col justify-center;

  & > .landing-page__title {
    @apply text-display-md text-text font-jakarta mb-2 font-bold;
  }
}
</style>

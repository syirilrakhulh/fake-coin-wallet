import { ENCRYPTED_WALLET, localstorage } from '@fake-coin/client/utils/localstorage';
import type { EncryptedWallet, WalletAccount } from '@fake-coin/wallet';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useWallet = defineStore('wallet', () => {
  let initialEncryptedWallet: EncryptedWallet | null = null;
  let initialWalletAccount: WalletAccount | null = null;

  const stringifiedWallet = localstorage.get(ENCRYPTED_WALLET);

  if (stringifiedWallet) {
    initialEncryptedWallet = stringifiedWallet;
  }

  const encryptedWallet = ref<EncryptedWallet | null>(initialEncryptedWallet);
  const walletAccount = ref<WalletAccount | null>(initialWalletAccount);

  const setEncryptedWallet = (newEncryptedWallet: EncryptedWallet | null) => {
    encryptedWallet.value = newEncryptedWallet;

    if (newEncryptedWallet === null) {
      localstorage.remove(ENCRYPTED_WALLET);
    } else {
      localstorage.set(ENCRYPTED_WALLET, newEncryptedWallet);
    }
  };

  const setWalletAccount = (newWalletAccount: WalletAccount | null) => {
    walletAccount.value = newWalletAccount;
  };

  return {
    encryptedWallet,
    walletAccount,
    setEncryptedWallet,
    setWalletAccount,
  };
});

export const ENCRYPTED_WALLET = 'fake_coin_encrypted_wallet';

type AvailableLocalStorageKeys = typeof ENCRYPTED_WALLET;

export const localstorage = {
  clear: () => {
    try {
      localStorage.clear();
    } catch (err) {
      console.error('[utils:localstorage]: Error clearing:', err);
    }
  },
  get: (key: AvailableLocalStorageKeys) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (err) {
      console.error(`[utils:localstorage]: Error getting key "${key}":`, err);
      return null;
    }
  },
  remove: (key: AvailableLocalStorageKeys) => {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error(`[utils:localstorage]: Error removing key "${key}":`, err);
    }
  },
  set: (key: AvailableLocalStorageKeys, value: unknown) => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (err) {
      console.error(`[utils:localstorage]: Error setting key "${key}":`, err);
    }
  },
};

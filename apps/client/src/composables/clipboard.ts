import { ref } from 'vue';

export const useClipboard = () => {
  const isCopied = ref(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      isCopied.value = true;

      const copyingTimeout = setTimeout(() => {
        isCopied.value = false;
        clearTimeout(copyingTimeout);
      }, 2000);
    } catch (err) {
      isCopied.value = false;
      console.error('[composable:clipboard]: Failed to copy text: ', err);
    }
  };

  return {
    copyToClipboard,
    isCopied,
  };
};

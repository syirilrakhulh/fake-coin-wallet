import { ref } from 'vue';

export const useFetch = <T = unknown>() => {
  const data = ref<T | null>(null);
  const error = ref<Error | null>(null);
  const isLoading = ref(false);

  const fetchData = async (url: string, options?: RequestInit) => {
    isLoading.value = true;
    error.value = null;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, options);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || 'Unknown error');
      }

      data.value = json.data;
    } catch (err: any) {
      error.value = err as Error;
      data.value = null;
    } finally {
      isLoading.value = false;

      return {
        data: data.value as T | null,
      };
    }
  };

  return { data, error, fetchData, isLoading };
};

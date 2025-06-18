import { ref } from 'vue';

export const usePasswordValidator = () => {
  const error = ref('');
  const isValid = ref(true);

  const validate = (password: string) => {
    error.value = '';
    isValid.value = true;

    const rules = {
      minLength: /.{8,}/,
      lowercase: /[a-z]/,
      uppercase: /[A-Z]/,
      number: /[0-9]/,
      symbol: /[^a-zA-Z0-9]/,
    };

    if (!rules.minLength.test(password)) {
      error.value = 'Password must be at least 8 characters long.';
    } else if (!rules.lowercase.test(password)) {
      error.value = 'Password must contain at least one lowercase letter.';
    } else if (!rules.uppercase.test(password)) {
      error.value = 'Password must contain at least one uppercase letter.';
    } else if (!rules.number.test(password)) {
      error.value = 'Password must contain at least one number.';
    } else if (!rules.symbol.test(password)) {
      error.value = 'Password must contain at least one special character.';
    }

    isValid.value = error.value === '';
    return { isValid: isValid.value, error: error.value };
  };

  return {
    validate,
    isValid,
    error,
  };
};

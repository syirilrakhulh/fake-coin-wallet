export const formatNumber = (numberToFormat: number, options?: Intl.NumberFormatOptions) => {
  try {
    const locale = navigator.language || 'en-US';
    if (typeof numberToFormat !== 'number') {
      throw new Error('Input must be a number');
    }

    const formatter = new Intl.NumberFormat(locale, {
      style: 'decimal',
      ...options,
    });

    return formatter.format(numberToFormat);
  } catch (err) {
    console.error('[utils:number]: Failed to format number:', err);
    return numberToFormat.toString();
  }
};

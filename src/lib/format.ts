export const formatPrice = (amount: number, currency: string = 'PYG'): string => {
  const currencyUpper = currency.toUpperCase();
  const isPyg = currencyUpper === 'PYG';
  const finalAmount = isPyg ? amount : amount / 100;
  const locale = isPyg ? 'es-PY' : 'en-US';

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyUpper,
      minimumFractionDigits: isPyg ? 0 : 2,
      maximumFractionDigits: isPyg ? 0 : 2,
    }).format(finalAmount);
  } catch {
    return `${currencyUpper} ${finalAmount.toLocaleString(locale)}`;
  }
};

export const formatCurrency = (value: number): string => {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(value);
};

export const dispatchStorageEvent = () => {
  //for trigger if storage has updated
  window.dispatchEvent(new Event('storage'));
};

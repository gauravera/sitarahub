export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
};

export const calculateDiscount = (
  originalPrice: number
): { percent: number; amount: number; finalPrice: number } => {
  // Generate discount between 5-30% based on price
  const discountPercent = Math.min(5 + Math.floor(originalPrice / 100), 30);
  const discountAmount = Math.round((originalPrice * discountPercent) / 100);
  const finalPrice = originalPrice - discountAmount;

  return { percent: discountPercent, amount: discountAmount, finalPrice };
};
